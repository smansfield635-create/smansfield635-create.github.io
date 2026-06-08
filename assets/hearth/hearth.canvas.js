// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4
// Full-file replacement.
// Canvas hub / visible 2D output receiver only.
//
// Purpose:
// - Bind the existing canonical DOM canvas:
//   #hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas
// - Restore nonzero canvas CSS geometry when the canvas exists but reports a zero rect.
// - Synchronize the 2D backing store to the visible frame.
// - Paint a first visible Hearth 2D globe frame so pixel proof can become nonblank.
// - Publish a stable canvas hub namespace, receipt, and public API.
//
// Does not own:
// - canvas creation
// - route conductor repair
// - controls mutation
// - source truth
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - hex truth
// - pointer/finger truth
// - WebGL
// - generated image
// - graphic box
// - final visual pass claim
//

(function hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2DOutput(global) {
  "use strict";

  var CONTRACT = "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  var RECEIPT = "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";
  var PREVIOUS_CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  var VERSION = "2026-06-08.hearth-canvas-live-surface-identity-unified-visible-2d-output-v12-4";
  var FILE = "/assets/hearth/hearth.canvas.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var HTML_FILE = "/showroom/globe/hearth/index.html";
  var INDEX_FILE = "/showroom/globe/hearth/index.js";
  var ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  var CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  var HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  var HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  var POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  var MOUNT_SELECTOR = "#hearthCanvasMount";
  var FRAME_SELECTOR = "#hearthCanvasRectLockFrame";
  var CANVAS_SELECTOR = "#hearthVisibleCanvas";
  var CANONICAL_SELECTOR = "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas";

  var MIN_SIZE = 280;
  var MAX_DPR = 2;

  var root = global.HEARTH = global.HEARTH || {};

  var state = {
    booted: false,
    mounted: false,
    started: false,
    disposed: false,

    mount: null,
    frame: null,
    canvas: null,
    ctx: null,

    rect: null,
    backingWidth: 0,
    backingHeight: 0,
    dpr: 1,

    firstPaintComplete: false,
    lastPaintReason: "NONE",
    lastEvent: "CREATED",
    lastError: "NONE",
    errorCount: 0,

    rafId: 0,
    resizeObserver: null,
    visibilityListener: null,
    resizeListener: null,

    rotation: 0,
    autoMotion: true,
    motionSpeed: 0.0018,

    view: {
      yaw: 0,
      pitch: 0,
      zoom: 1
    },

    externalPacket: null,
    sourceSummary: null,
    hexSummary: null,
    controlsSummary: null
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (error) {
      return "";
    }
  }

  function safeNumber(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mark(eventName) {
    state.lastEvent = eventName || "UNKNOWN_EVENT";
    publishReceipt();
  }

  function fail(eventName, error) {
    state.errorCount += 1;
    state.lastEvent = eventName || "ERROR";
    state.lastError = error && error.message ? error.message : String(error || "UNKNOWN_ERROR");
    publishReceipt();
  }

  function getDocument() {
    return global.document || null;
  }

  function getElement(selector) {
    var doc = getDocument();
    if (!doc || !selector) return null;
    try {
      return doc.querySelector(selector);
    } catch (error) {
      fail("QUERY_SELECTOR_ERROR:" + selector, error);
      return null;
    }
  }

  function getRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return null;
    }

    try {
      var rect = element.getBoundingClientRect();
      return {
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0)
      };
    } catch (error) {
      fail("GET_BOUNDING_RECT_ERROR", error);
      return null;
    }
  }

  function rectNonzero(rect) {
    return !!rect && rect.width > 0 && rect.height > 0;
  }

  function chooseSizeFromRect(rect) {
    if (!rectNonzero(rect)) return 0;
    return Math.max(MIN_SIZE, Math.floor(Math.min(rect.width, rect.height)));
  }

  function isCanvas(element) {
    return !!element && String(element.tagName || "").toLowerCase() === "canvas";
  }

  function resolveCanonicalSurface() {
    var doc = getDocument();
    if (!doc) {
      state.mount = null;
      state.frame = null;
      state.canvas = null;
      state.ctx = null;
      return false;
    }

    var mount = getElement(MOUNT_SELECTOR);
    var frame = getElement(FRAME_SELECTOR);
    var canvas = getElement(CANVAS_SELECTOR);

    if (!canvas && mount) {
      try {
        canvas = mount.querySelector("canvas");
      } catch (error) {
        fail("CANVAS_FALLBACK_QUERY_ERROR", error);
      }
    }

    if (!isCanvas(canvas)) {
      state.mount = mount || null;
      state.frame = frame || null;
      state.canvas = null;
      state.ctx = null;
      return false;
    }

    state.mount = mount || canvas.parentElement || null;
    state.frame = frame || canvas.parentElement || state.mount || null;
    state.canvas = canvas;

    try {
      state.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true }) || canvas.getContext("2d");
    } catch (error) {
      fail("CANVAS_2D_CONTEXT_ERROR", error);
      state.ctx = null;
    }

    return !!state.ctx;
  }

  function applyMountAndFrameGeometry() {
    if (state.mount) {
      state.mount.style.display = state.mount.style.display && state.mount.style.display !== "none"
        ? state.mount.style.display
        : "grid";
      state.mount.style.placeItems = "center";
      state.mount.style.position = state.mount.style.position && state.mount.style.position !== "static"
        ? state.mount.style.position
        : "relative";
      state.mount.style.visibility = "visible";
      state.mount.style.opacity = "1";
      state.mount.style.overflow = "visible";

      if (!state.mount.style.minWidth) state.mount.style.minWidth = MIN_SIZE + "px";
      if (!state.mount.style.minHeight) state.mount.style.minHeight = MIN_SIZE + "px";
      if (!state.mount.style.aspectRatio) state.mount.style.aspectRatio = "1 / 1";
    }

    if (state.frame) {
      state.frame.style.display = "block";
      state.frame.style.position = state.frame.style.position && state.frame.style.position !== "static"
        ? state.frame.style.position
        : "relative";
      state.frame.style.visibility = "visible";
      state.frame.style.opacity = "1";
      state.frame.style.overflow = "visible";
      state.frame.style.width = state.frame.style.width || "100%";
      state.frame.style.minWidth = state.frame.style.minWidth || MIN_SIZE + "px";
      state.frame.style.minHeight = state.frame.style.minHeight || MIN_SIZE + "px";
      if (!state.frame.style.aspectRatio) state.frame.style.aspectRatio = "1 / 1";
    }
  }

  function applyCanvasGeometry() {
    var canvas = state.canvas;
    if (!canvas) return false;

    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minWidth = canvas.style.minWidth || MIN_SIZE + "px";
    canvas.style.minHeight = canvas.style.minHeight || MIN_SIZE + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.margin = "0";
    canvas.style.padding = "0";
    canvas.style.border = "0";
    canvas.style.background = "transparent";
    canvas.style.visibility = "visible";
    canvas.style.opacity = "1";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTapHighlightColor = "transparent";

    canvas.setAttribute("data-hearth-visible-canvas", "canonical");
    canvas.setAttribute("data-canonical-canvas", "true");
    canvas.setAttribute("data-canvas-authority", CONTRACT);
    canvas.setAttribute("data-canvas-receipt", RECEIPT);
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-webgl", "false");
    canvas.setAttribute("data-final-visual-pass-claimed", "false");

    return true;
  }

  function measureSurface() {
    var canvasRect = getRect(state.canvas);
    var frameRect = getRect(state.frame);
    var mountRect = getRect(state.mount);

    var chosenRect = rectNonzero(canvasRect)
      ? canvasRect
      : rectNonzero(frameRect)
        ? frameRect
        : rectNonzero(mountRect)
          ? mountRect
          : null;

    if (!rectNonzero(canvasRect) && rectNonzero(chosenRect) && state.canvas) {
      var size = chooseSizeFromRect(chosenRect);
      if (size > 0) {
        state.canvas.style.width = size + "px";
        state.canvas.style.height = size + "px";
        state.canvas.style.left = "50%";
        state.canvas.style.top = "50%";
        state.canvas.style.right = "auto";
        state.canvas.style.bottom = "auto";
        state.canvas.style.transform = "translate(-50%, -50%)";
        canvasRect = getRect(state.canvas);
      }
    }

    if (!rectNonzero(canvasRect) && state.canvas) {
      var fallbackSize = Math.max(
        MIN_SIZE,
        Math.min(
          820,
          Math.floor((global.innerWidth || 420) * 0.9),
          Math.floor((global.innerHeight || 620) * 0.68)
        )
      );

      state.canvas.style.position = "relative";
      state.canvas.style.inset = "auto";
      state.canvas.style.left = "auto";
      state.canvas.style.top = "auto";
      state.canvas.style.right = "auto";
      state.canvas.style.bottom = "auto";
      state.canvas.style.transform = "none";
      state.canvas.style.width = fallbackSize + "px";
      state.canvas.style.height = fallbackSize + "px";

      if (state.frame) {
        state.frame.style.width = fallbackSize + "px";
        state.frame.style.height = fallbackSize + "px";
      }

      if (state.mount) {
        state.mount.style.width = fallbackSize + "px";
        state.mount.style.height = fallbackSize + "px";
      }

      canvasRect = getRect(state.canvas);
    }

    state.rect = canvasRect || chosenRect || null;
    return rectNonzero(state.rect);
  }

  function syncBackingStore() {
    if (!state.canvas || !state.ctx) return false;

    var rectOk = measureSurface();
    if (!rectOk) return false;

    var dpr = clamp(safeNumber(global.devicePixelRatio, 1), 1, MAX_DPR);
    var width = Math.max(MIN_SIZE, Math.round(state.rect.width * dpr));
    var height = Math.max(MIN_SIZE, Math.round(state.rect.height * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.backingWidth = width;
    state.backingHeight = height;
    state.dpr = dpr;

    try {
      state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    } catch (error) {
      fail("CANVAS_SET_TRANSFORM_ERROR", error);
      return false;
    }

    return true;
  }

  function clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  function makeRadialGradient(ctx, x, y, r, stops) {
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    stops.forEach(function addStop(stop) {
      gradient.addColorStop(stop[0], stop[1]);
    });
    return gradient;
  }

  function drawVisibleHearthGlobe(reason) {
    if (!state.canvas || !state.ctx) return false;

    if (!syncBackingStore()) {
      state.firstPaintComplete = false;
      state.lastPaintReason = "RECT_NOT_AVAILABLE:" + (reason || "UNKNOWN");
      publishReceipt();
      return false;
    }

    var ctx = state.ctx;
    var rect = state.rect;
    var width = rect.width;
    var height = rect.height;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.max(40, Math.min(width, height) * 0.485);

    clear(ctx, width, height);

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();

    var body = makeRadialGradient(ctx, cx - radius * 0.24, cy - radius * 0.32, radius * 1.18, [
      [0.00, "rgba(128, 176, 190, 0.92)"],
      [0.18, "rgba(72, 116, 128, 0.96)"],
      [0.40, "rgba(43, 74, 82, 0.98)"],
      [0.64, "rgba(36, 50, 44, 1)"],
      [0.82, "rgba(43, 35, 27, 1)"],
      [1.00, "rgba(12, 15, 17, 1)"]
    ]);

    ctx.fillStyle = body;
    ctx.fill();

    ctx.clip();

    var spin = state.rotation + state.view.yaw;

    drawOceanBands(ctx, cx, cy, radius, spin);
    drawLandMasses(ctx, cx, cy, radius, spin);
    drawAncientCoastScars(ctx, cx, cy, radius, spin);
    drawAtmosphereInterior(ctx, cx, cy, radius);

    ctx.restore();

    drawOuterRim(ctx, cx, cy, radius);
    drawTerminator(ctx, cx, cy, radius);

    state.firstPaintComplete = true;
    state.lastPaintReason = reason || "FIRST_VISIBLE_2D_OUTPUT";
    mark("CANVAS_2D_FRAME_PAINTED");
    return true;
  }

  function drawOceanBands(ctx, cx, cy, r, spin) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.88;

    var ocean = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    ocean.addColorStop(0.00, "rgba(40, 98, 124, 0.80)");
    ocean.addColorStop(0.45, "rgba(21, 70, 100, 0.75)");
    ocean.addColorStop(1.00, "rgba(9, 36, 58, 0.92)");
    ctx.fillStyle = ocean;

    for (var i = 0; i < 8; i += 1) {
      var y = cy - r * 0.78 + i * r * 0.22;
      var wobble = Math.sin(spin * 1.4 + i * 0.8) * r * 0.08;

      ctx.beginPath();
      ctx.ellipse(
        cx + wobble,
        y,
        r * (0.58 + 0.05 * Math.sin(i)),
        r * (0.055 + 0.018 * Math.cos(i * 0.7)),
        Math.sin(spin + i) * 0.24,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLandMasses(ctx, cx, cy, r, spin) {
    var masses = [
      { x: -0.34, y: -0.26, sx: 0.34, sy: 0.21, rot: -0.45, seed: 1 },
      { x: 0.16, y: -0.34, sx: 0.28, sy: 0.18, rot: 0.35, seed: 2 },
      { x: 0.40, y: -0.05, sx: 0.24, sy: 0.28, rot: 0.62, seed: 3 },
      { x: -0.12, y: 0.10, sx: 0.36, sy: 0.18, rot: 0.16, seed: 4 },
      { x: -0.42, y: 0.35, sx: 0.22, sy: 0.14, rot: 0.32, seed: 5 },
      { x: 0.18, y: 0.36, sx: 0.30, sy: 0.16, rot: -0.24, seed: 6 },
      { x: 0.02, y: 0.03, sx: 0.17, sy: 0.12, rot: -0.78, seed: 7 }
    ];

    ctx.save();

    masses.forEach(function drawMass(mass) {
      var drift = Math.sin(spin + mass.seed) * 0.035;
      var x = cx + (mass.x + drift) * r;
      var y = cy + (mass.y + Math.cos(spin * 0.9 + mass.seed) * 0.018) * r;
      var sx = mass.sx * r;
      var sy = mass.sy * r;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(mass.rot + Math.sin(spin * 0.5 + mass.seed) * 0.08);

      ctx.beginPath();
      for (var i = 0; i < 18; i += 1) {
        var angle = (Math.PI * 2 * i) / 18;
        var jag = 0.78 + 0.24 * Math.sin(i * 2.17 + mass.seed) + 0.09 * Math.cos(i * 4.1);
        var px = Math.cos(angle) * sx * jag;
        var py = Math.sin(angle) * sy * (0.86 + 0.15 * Math.cos(i * 1.7 + mass.seed));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      var land = ctx.createLinearGradient(-sx, -sy, sx, sy);
      land.addColorStop(0.00, "rgba(159, 139, 87, 0.92)");
      land.addColorStop(0.46, "rgba(107, 96, 62, 0.94)");
      land.addColorStop(1.00, "rgba(71, 61, 44, 0.96)");

      ctx.fillStyle = land;
      ctx.fill();

      ctx.lineWidth = Math.max(1, r * 0.004);
      ctx.strokeStyle = "rgba(223, 190, 119, 0.42)";
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  function drawAncientCoastScars(ctx, cx, cy, r, spin) {
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i = 0; i < 20; i += 1) {
      var angle = spin * 0.4 + i * 0.83;
      var band = 0.18 + (i % 5) * 0.12;
      var x = cx + Math.cos(angle) * r * band;
      var y = cy + Math.sin(angle * 1.21) * r * (0.12 + (i % 4) * 0.11);
      var length = r * (0.08 + (i % 3) * 0.035);

      ctx.beginPath();
      ctx.moveTo(x - length * 0.5, y);
      ctx.bezierCurveTo(
        x - length * 0.18,
        y - r * 0.04,
        x + length * 0.18,
        y + r * 0.04,
        x + length * 0.5,
        y
      );

      ctx.lineWidth = Math.max(1, r * 0.0035);
      ctx.strokeStyle = i % 2 === 0
        ? "rgba(217, 177, 104, 0.34)"
        : "rgba(122, 173, 184, 0.28)";
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAtmosphereInterior(ctx, cx, cy, r) {
    ctx.save();

    var highlight = makeRadialGradient(ctx, cx - r * 0.34, cy - r * 0.42, r * 0.92, [
      [0.00, "rgba(255, 255, 255, 0.22)"],
      [0.20, "rgba(170, 210, 224, 0.10)"],
      [0.55, "rgba(255, 255, 255, 0.03)"],
      [1.00, "rgba(255, 255, 255, 0.00)"]
    ]);

    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawOuterRim(ctx, cx, cy, r) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.strokeStyle = "rgba(207, 229, 244, 0.18)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.996, 0, Math.PI * 2);
    ctx.closePath();
    ctx.lineWidth = Math.max(1, r * 0.0025);
    ctx.strokeStyle = "rgba(216, 168, 93, 0.16)";
    ctx.stroke();

    ctx.restore();
  }

  function drawTerminator(ctx, cx, cy, r) {
    ctx.save();

    var shadow = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    shadow.addColorStop(0.00, "rgba(0, 0, 0, 0.00)");
    shadow.addColorStop(0.48, "rgba(0, 0, 0, 0.04)");
    shadow.addColorStop(1.00, "rgba(0, 0, 0, 0.44)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = shadow;
    ctx.fill();

    ctx.restore();
  }

  function loop(timestamp) {
    if (!state.started || state.disposed) return;

    state.rotation += state.autoMotion ? state.motionSpeed * 16.67 : 0;
    if (state.rotation > Math.PI * 2) state.rotation -= Math.PI * 2;

    drawVisibleHearthGlobe("ANIMATION_FRAME:" + Math.round(safeNumber(timestamp, 0)));

    state.rafId = global.requestAnimationFrame(loop);
  }

  function requestPaint(reason) {
    if (state.disposed) return false;
    return drawVisibleHearthGlobe(reason || "REQUEST_PAINT");
  }

  function installResizeObservation() {
    uninstallResizeObservation();

    if (global.ResizeObserver && (state.frame || state.mount || state.canvas)) {
      try {
        state.resizeObserver = new global.ResizeObserver(function onResizeObserved() {
          requestPaint("RESIZE_OBSERVER");
        });

        if (state.mount) state.resizeObserver.observe(state.mount);
        if (state.frame && state.frame !== state.mount) state.resizeObserver.observe(state.frame);
        if (state.canvas) state.resizeObserver.observe(state.canvas);
      } catch (error) {
        fail("RESIZE_OBSERVER_INSTALL_ERROR", error);
        state.resizeObserver = null;
      }
    }

    state.resizeListener = function onResize() {
      requestPaint("WINDOW_RESIZE");
    };

    state.visibilityListener = function onVisibilityChange() {
      if (!getDocument() || getDocument().hidden) return;
      requestPaint("VISIBILITY_RETURN");
    };

    try {
      global.addEventListener("resize", state.resizeListener, { passive: true });
      if (getDocument()) {
        getDocument().addEventListener("visibilitychange", state.visibilityListener, { passive: true });
      }
    } catch (error) {
      fail("RESIZE_VISIBILITY_LISTENER_ERROR", error);
    }
  }

  function uninstallResizeObservation() {
    if (state.resizeObserver) {
      try {
        state.resizeObserver.disconnect();
      } catch (error) {
        fail("RESIZE_OBSERVER_DISCONNECT_ERROR", error);
      }
      state.resizeObserver = null;
    }

    if (state.resizeListener) {
      try {
        global.removeEventListener("resize", state.resizeListener);
      } catch (error) {
        fail("RESIZE_LISTENER_REMOVE_ERROR", error);
      }
      state.resizeListener = null;
    }

    if (state.visibilityListener && getDocument()) {
      try {
        getDocument().removeEventListener("visibilitychange", state.visibilityListener);
      } catch (error) {
        fail("VISIBILITY_LISTENER_REMOVE_ERROR", error);
      }
      state.visibilityListener = null;
    }
  }

  function mount(options) {
    if (state.disposed) state.disposed = false;

    resolveCanonicalSurface();
    applyMountAndFrameGeometry();
    applyCanvasGeometry();

    var ready = !!state.canvas && !!state.ctx;
    state.mounted = ready;

    if (!ready) {
      mark("CANONICAL_CANVAS_NOT_READY");
      return getStatusPacket();
    }

    installResizeObservation();

    requestPaint(options && options.reason ? options.reason : "MOUNT_FIRST_VISIBLE_2D_OUTPUT");

    mark("CANONICAL_CANVAS_MOUNTED");
    return getStatusPacket();
  }

  function boot(options) {
    state.booted = true;
    state.disposed = false;

    var packet = mount({
      reason: options && options.reason ? options.reason : "BOOT"
    });

    publishGlobals();
    publishReceipt();

    return packet;
  }

  function init(options) {
    return boot(options || { reason: "INIT" });
  }

  function start(options) {
    boot(options || { reason: "START" });

    if (!state.started) {
      state.started = true;
      if (state.rafId) {
        try {
          global.cancelAnimationFrame(state.rafId);
        } catch (error) {
          fail("CANCEL_EXISTING_RAF_ERROR", error);
        }
      }
      state.rafId = global.requestAnimationFrame(loop);
    }

    mark("CANVAS_ANIMATION_STARTED");
    return getStatusPacket();
  }

  function stop() {
    state.started = false;

    if (state.rafId) {
      try {
        global.cancelAnimationFrame(state.rafId);
      } catch (error) {
        fail("CANCEL_RAF_ERROR", error);
      }
      state.rafId = 0;
    }

    mark("CANVAS_ANIMATION_STOPPED");
    return getStatusPacket();
  }

  function dispose() {
    stop();
    uninstallResizeObservation();
    state.disposed = true;
    state.mounted = false;
    mark("CANVAS_HUB_DISPOSED");
    return getStatusPacket();
  }

  function render(packet) {
    if (packet) state.externalPacket = packet;
    return requestPaint("PUBLIC_RENDER") ? getStatusPacket() : getStatusPacket();
  }

  function refresh() {
    return mount({ reason: "PUBLIC_REFRESH" });
  }

  function receive(packet) {
    state.externalPacket = packet || null;
    mark("EXTERNAL_PACKET_RECEIVED");
    return render(packet);
  }

  function accept(packet) {
    return receive(packet);
  }

  function ingest(packet) {
    return receive(packet);
  }

  function receiveGovernedSourcePacket(packet) {
    state.sourceSummary = packet || null;
    mark("GOVERNED_SOURCE_PACKET_RECEIVED");
    return render(packet);
  }

  function receiveCanvasHandoffPacket(packet) {
    state.sourceSummary = packet || null;
    mark("CANVAS_HANDOFF_PACKET_RECEIVED");
    return render(packet);
  }

  function receiveHexSurfacePacket(packet) {
    state.hexSummary = packet || null;
    mark("HEX_SURFACE_PACKET_RECEIVED");
    return render(packet);
  }

  function receiveControlPacket(packet) {
    state.controlsSummary = packet || null;
    mark("CONTROL_PACKET_RECEIVED");
    return getStatusPacket();
  }

  function updateView(delta) {
    delta = delta || {};

    state.view.yaw += safeNumber(delta.yaw, 0);
    state.view.pitch = clamp(state.view.pitch + safeNumber(delta.pitch, 0), -0.85, 0.85);
    state.view.zoom = clamp(state.view.zoom + safeNumber(delta.zoom, 0), 0.65, 1.8);

    mark("VIEW_UPDATED");
    return render();
  }

  function setView(view) {
    view = view || {};

    if (Object.prototype.hasOwnProperty.call(view, "yaw")) {
      state.view.yaw = safeNumber(view.yaw, state.view.yaw);
    }

    if (Object.prototype.hasOwnProperty.call(view, "pitch")) {
      state.view.pitch = clamp(safeNumber(view.pitch, state.view.pitch), -0.85, 0.85);
    }

    if (Object.prototype.hasOwnProperty.call(view, "zoom")) {
      state.view.zoom = clamp(safeNumber(view.zoom, state.view.zoom), 0.65, 1.8);
    }

    mark("VIEW_SET");
    return render();
  }

  function getCanvas() {
    return state.canvas || null;
  }

  function getContext() {
    return state.ctx || null;
  }

  function getSurface() {
    return {
      mount: state.mount || null,
      frame: state.frame || null,
      canvas: state.canvas || null,
      context2d: state.ctx || null
    };
  }

  function getReceiptObject() {
    var canvasRect = getRect(state.canvas);
    var frameRect = getRect(state.frame);
    var mountRect = getRect(state.mount);

    return {
      packetType: "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_PACKET_v12_4",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,

      route: TARGET_ROUTE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      canonicalMountSelector: MOUNT_SELECTOR,
      canonicalFrameSelector: FRAME_SELECTOR,
      canonicalCanvasSelector: CANVAS_SELECTOR,
      canonicalChain: CANONICAL_SELECTOR,

      canvasCreationAuthorized: false,
      canvasCreated: false,
      existingCanonicalCanvasRequired: true,
      existingCanonicalCanvasFound: !!state.canvas,
      canonicalMountFound: !!state.mount,
      canonicalFrameFound: !!state.frame,
      canonicalCanvasFound: !!state.canvas,
      canonicalCanvasInMount: !!(state.mount && state.canvas && state.mount.contains(state.canvas)),
      canonicalCanvasInFrame: !!(state.frame && state.canvas && state.frame.contains(state.canvas)),

      canvasContext2dReady: !!state.ctx,
      webGL: false,
      webgl: false,
      generatedImage: false,
      graphicBox: false,

      ownsCanvasDomSurface: true,
      ownsCanvasDrawing: true,
      ownsPresentationSurface: true,
      ownsRouteRepair: false,
      ownsControls: false,
      ownsSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
      ownsPointerFingerTruth: false,
      ownsFinalVisualPassClaim: false,

      readyTextPermissionGranted: false,
      readyTextAllowed: false,
      readyTextClaimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      f13Claimed: false,
      f21EligibleForNorth: false,
      f21Claimed: false,
      f21SubmittedToNorth: false,

      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      firstPaintComplete: state.firstPaintComplete,
      lastPaintReason: state.lastPaintReason,
      lastEvent: state.lastEvent,
      lastError: state.lastError,
      errorCount: state.errorCount,

      dpr: state.dpr,
      backingWidth: state.backingWidth,
      backingHeight: state.backingHeight,

      mountRect: mountRect,
      frameRect: frameRect,
      canvasRect: canvasRect,
      canonicalMountRectNonzero: rectNonzero(mountRect),
      canonicalFrameRectNonzero: rectNonzero(frameRect),
      canonicalCanvasRectNonzero: rectNonzero(canvasRect),

      canvasNamespacePresent: true,
      canvasNamespaceMatchesDomSurface: !!state.canvas,

      publicMethodCount: Object.keys(api).length,
      publicMethods: Object.keys(api).sort(),

      updatedAt: nowIso()
    };
  }

  function getStatusPacket() {
    var receipt = getReceiptObject();

    return {
      PACKET_NAME: "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_STATUS_PACKET_v12_4",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      CANVAS_AUTHORITY_OBSERVED: true,
      CANVAS_AUTHORITY_CONTRACT: CONTRACT,
      CANVAS_AUTHORITY_RECEIPT: RECEIPT,
      CANVAS_NAMESPACE_PRESENT: true,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: !!state.canvas,

      CANONICAL_MOUNT_FOUND: receipt.canonicalMountFound,
      CANONICAL_FRAME_FOUND: receipt.canonicalFrameFound,
      CANONICAL_CANVAS_FOUND: receipt.canonicalCanvasFound,
      CANONICAL_CANVAS_IN_MOUNT: receipt.canonicalCanvasInMount,
      CANONICAL_CANVAS_IN_FRAME: receipt.canonicalCanvasInFrame,
      CANONICAL_MOUNT_RECT_NONZERO: receipt.canonicalMountRectNonzero,
      CANONICAL_FRAME_RECT_NONZERO: receipt.canonicalFrameRectNonzero,
      CANONICAL_CANVAS_RECT_NONZERO: receipt.canonicalCanvasRectNonzero,

      CANVAS_CONTEXT_2D_READY: receipt.canvasContext2dReady,
      CANVAS_FIRST_PAINT_COMPLETE: receipt.firstPaintComplete,
      CANVAS_PIXEL_VISIBLE_INTENT: receipt.firstPaintComplete,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_CREATED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,

      READY_TEXT_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      FINAL_VISUAL_PASS_CLAIMED: false,

      RECEIPT_OBJECT: receipt
    };
  }

  function getReceiptText() {
    var status = getStatusPacket();

    return [
      "PACKET_NAME=" + status.PACKET_NAME,
      "CONTRACT=" + CONTRACT,
      "RECEIPT=" + RECEIPT,
      "PREVIOUS_CONTRACT=" + PREVIOUS_CONTRACT,
      "VERSION=" + VERSION,
      "FILE=" + FILE,
      "TARGET_ROUTE=" + TARGET_ROUTE,
      "DIAGNOSTIC_ROUTE=" + DIAGNOSTIC_ROUTE,
      "CANONICAL_MOUNT_SELECTOR=" + MOUNT_SELECTOR,
      "CANONICAL_FRAME_SELECTOR=" + FRAME_SELECTOR,
      "CANONICAL_CANVAS_SELECTOR=" + CANVAS_SELECTOR,
      "CANONICAL_CHAIN=" + CANONICAL_SELECTOR,
      "CANVAS_AUTHORITY_OBSERVED=true",
      "CANVAS_NAMESPACE_PRESENT=true",
      "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE=" + String(!!state.canvas),
      "CANONICAL_MOUNT_FOUND=" + String(status.CANONICAL_MOUNT_FOUND),
      "CANONICAL_FRAME_FOUND=" + String(status.CANONICAL_FRAME_FOUND),
      "CANONICAL_CANVAS_FOUND=" + String(status.CANONICAL_CANVAS_FOUND),
      "CANONICAL_CANVAS_RECT_NONZERO=" + String(status.CANONICAL_CANVAS_RECT_NONZERO),
      "CANVAS_CONTEXT_2D_READY=" + String(status.CANVAS_CONTEXT_2D_READY),
      "CANVAS_FIRST_PAINT_COMPLETE=" + String(status.CANVAS_FIRST_PAINT_COMPLETE),
      "CANVAS_CREATION_AUTHORIZED=false",
      "CANVAS_CREATED=false",
      "GENERATED_IMAGE=false",
      "GRAPHIC_BOX=false",
      "WEBGL=false",
      "READY_TEXT_CLAIMED=false",
      "VISUAL_PASS_CLAIMED=false",
      "FINAL_VISUAL_PASS_CLAIMED=false",
      "UPDATED_AT=" + nowIso()
    ].join("\n");
  }

  function publishReceipt() {
    var receipt = getReceiptObject();

    root.canvasReceipt = receipt;
    root.canvasHubReceipt = receipt;
    root.canvasStatus = getStatusPacket;

    global.HEARTH_CANVAS_RECEIPT = receipt;
    global.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    global.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT = receipt;
    global.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_TEXT = getReceiptText;

    return receipt;
  }

  function publishGlobals() {
    root.canvas = api;
    root.canvasHub = api;
    root.hearthCanvas = api;
    root.canvasReceiver = api;

    global.HEARTH_CANVAS = api;
    global.HEARTH_CANVAS_HUB = api;
    global.HEARTH_CANVAS_RECEIVER = api;
    global.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT = api;

    publishReceipt();
    return api;
  }

  var api = {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    VERSION: VERSION,
    FILE: FILE,

    boot: boot,
    init: init,
    start: start,
    mount: mount,
    render: render,
    refresh: refresh,
    stop: stop,
    dispose: dispose,

    receive: receive,
    accept: accept,
    ingest: ingest,
    receiveGovernedSourcePacket: receiveGovernedSourcePacket,
    receiveCanvasHandoffPacket: receiveCanvasHandoffPacket,
    receiveHexSurfacePacket: receiveHexSurfacePacket,
    receiveControlPacket: receiveControlPacket,

    updateView: updateView,
    setView: setView,

    getCanvas: getCanvas,
    getContext: getContext,
    getSurface: getSurface,
    getStatusPacket: getStatusPacket,
    getReceipt: getReceiptObject,
    getReceiptObject: getReceiptObject,
    getReceiptText: getReceiptText,
    publishReceipt: publishReceipt,
    publishGlobals: publishGlobals
  };

  publishGlobals();

  function autoBootWhenReady() {
    if (state.disposed) return;

    try {
      boot({ reason: "AUTO_BOOT_DOM_READY" });
      start({ reason: "AUTO_START_VISIBLE_2D_OUTPUT" });
    } catch (error) {
      fail("AUTO_BOOT_ERROR", error);
    }
  }

  if (getDocument()) {
    if (getDocument().readyState === "loading") {
      getDocument().addEventListener("DOMContentLoaded", autoBootWhenReady, { once: true });
    } else {
      autoBootWhenReady();
    }
  } else {
    publishReceipt();
  }
})(window);
