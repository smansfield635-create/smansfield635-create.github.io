/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_INSTRUMENT_RENDER_ONLY_BOUNDARY_RENEWAL_TNT_v1

   RENEWAL LAW:
   Instrument draws body only.
   Route owns labels, descriptions, buttons, mount, and zoom wrapper.
   CSS contains presentation.
   Runtime supports state.
   Gauges audits only.
*/

(function renewShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_RENDER_ONLY_BOUNDARY_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODIES = new Set(["earth", "sun", "moon"]);

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 1,
    zoom: 100,
    frame: 0,
    mount: null,
    surface: null,
    canvas: null,
    ctx: null,
    raf: 0,
    resizeObserver: null,
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.45,
    normal: 1,
    fast: 1.75
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function normalizeBody(value) {
    if (value && typeof value === "object") {
      value = value.activeBody || value.body || value.name || value.value;
    }

    value = String(value || "").toLowerCase();
    return BODIES.has(value) ? value : "earth";
  }

  function normalizeSpeed(value) {
    if (value && typeof value === "object") {
      value = value.speedName || value.speed || value.value;
    }

    value = String(value || "normal").toLowerCase();
    return Object.prototype.hasOwnProperty.call(speedValues, value) ? value : "normal";
  }

  function normalizeZoom(value) {
    if (value && typeof value === "object") {
      value = value.zoom;
    }

    return clamp(Number(value) || 100, 70, 240);
  }

  function resolveMount(target) {
    if (isElement(target)) return target;

    if (target && typeof target === "object") {
      return resolveMount(
        target.mount ||
        target.root ||
        target.target ||
        target.element ||
        target.el ||
        null
      );
    }

    if (typeof target === "string" && global.document) {
      const queried = global.document.querySelector(target);
      if (queried) return queried;
    }

    if (!global.document) return null;

    return (
      global.document.getElementById("showroomGlobeMount") ||
      global.document.getElementById("showroom-globe-mount") ||
      global.document.getElementById("actualBodyMount") ||
      global.document.querySelector("[data-showroom-globe-mount]") ||
      global.document.querySelector("[data-actual-bodies-mount='true']") ||
      global.document.querySelector("[data-globe-mount]") ||
      global.document.querySelector(".actual-globe-mount") ||
      global.document.querySelector(".showroom-globe-mount")
    );
  }

  function applyOptions(options) {
    if (!options || typeof options !== "object") return;

    if (options.activeBody || options.body || options.name) {
      state.body = normalizeBody(options);
    }

    if (typeof options.running === "boolean") {
      state.running = options.running;
    }

    if (options.direction) {
      state.direction = options.direction === "reverse" ? "reverse" : "forward";
    }

    if (options.speedName || options.speed) {
      state.speedName = normalizeSpeed(options);
      state.speedValue = speedValues[state.speedName];
    }

    if (options.zoom !== undefined) {
      state.zoom = normalizeZoom(options);
    }
  }

  function setRenderSurfaceStyles(surface, canvas) {
    surface.style.width = "100%";
    surface.style.maxWidth = "100%";
    surface.style.aspectRatio = "1 / 1";
    surface.style.display = "grid";
    surface.style.placeItems = "center";
    surface.style.overflow = "hidden";
    surface.style.borderRadius = "50%";
    surface.style.contain = "layout paint";
    surface.style.isolation = "isolate";

    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";
  }

  function ensureSurface(target) {
    const mount = resolveMount(target);
    if (!mount || !global.document) {
      state.lastError = "NO_MOUNT";
      return false;
    }

    if (state.mount === mount && state.surface && state.canvas && state.ctx) {
      return true;
    }

    stop();

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    mount.replaceChildren();

    const surface = global.document.createElement("div");
    surface.className = "dgb-showroom-globe-render-only-surface";
    surface.setAttribute("data-showroom-globe-render-only-surface", "true");

    const canvas = global.document.createElement("canvas");
    canvas.className = "dgb-showroom-globe-render-only-canvas";
    canvas.setAttribute("data-showroom-globe-render-only-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe selected body render");

    setRenderSurfaceStyles(surface, canvas);

    surface.appendChild(canvas);
    mount.appendChild(surface);

    state.mount = mount;
    state.surface = surface;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });

    mount.dataset.instrumentMounted = "true";
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "layout-command-panel-zoom-wrapper";
    mount.dataset.instrumentBoundary = "render-only";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function handleResize() {
        resizeCanvas();
        drawOnce();
      });
      state.resizeObserver.observe(surface);
    }

    resizeCanvas();
    return true;
  }

  function resizeCanvas() {
    if (!state.canvas || !state.surface) return;

    const rect = state.surface.getBoundingClientRect();
    const cssSize = clamp(rect.width || state.surface.clientWidth || 420, 220, 960);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 2);

    const pixelSize = Math.round(cssSize * dpr);

    if (state.canvas.width !== pixelSize || state.canvas.height !== pixelSize) {
      state.canvas.width = pixelSize;
      state.canvas.height = pixelSize;
    }
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawSphereClip(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function drawRim(ctx, cx, cy, r, stroke, glow) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.012);
    ctx.stroke();

    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = r * 0.08;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLighting(ctx, cx, cy, r, mode) {
    ctx.save();
    drawSphereClip(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(
      cx - r * 0.35,
      cy - r * 0.38,
      r * 0.04,
      cx,
      cy,
      r
    );

    highlight.addColorStop(0, mode === "sun" ? "rgba(255,255,210,0.42)" : "rgba(255,255,255,0.30)");
    highlight.addColorStop(0.28, "rgba(255,255,255,0.08)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createLinearGradient(cx - r * 0.5, cy - r, cx + r, cy + r);
    shade.addColorStop(0, "rgba(255,255,255,0)");
    shade.addColorStop(0.55, "rgba(0,0,0,0)");
    shade.addColorStop(1, mode === "sun" ? "rgba(85,15,0,0.30)" : "rgba(0,0,0,0.42)");

    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();
  }

  function drawLand(ctx, cx, cy, r, rotation) {
    const land = [
      { x: -0.48, y: -0.2, w: 0.28, h: 0.55, angle: -0.18, fill: "rgba(82,161,82,0.92)" },
      { x: 0.16, y: -0.18, w: 0.38, h: 0.56, angle: 0.12, fill: "rgba(180,145,70,0.92)" },
      { x: -0.26, y: 0.54, w: 0.52, h: 0.09, angle: 0.15, fill: "rgba(238,246,255,0.92)" }
    ];

    ctx.save();
    drawSphereClip(ctx, cx, cy, r);
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);

    for (const item of land) {
      const x = cx + item.x * r;
      const y = cy + item.y * r;
      const w = item.w * r;
      const h = item.h * r;

      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(item.angle);
      ctx.translate(-w / 2, -h / 2);

      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.06);
      ctx.lineTo(w * 0.72, 0);
      ctx.lineTo(w, h * 0.32);
      ctx.lineTo(w * 0.86, h * 0.78);
      ctx.lineTo(w * 0.55, h);
      ctx.lineTo(w * 0.18, h * 0.86);
      ctx.lineTo(0, h * 0.45);
      ctx.closePath();
      ctx.fillStyle = item.fill;
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  function drawCloud(ctx, cx, cy, length, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-length / 2, 0);
    ctx.bezierCurveTo(-length * 0.25, -length * 0.04, length * 0.18, length * 0.04, length / 2, 0);
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.lineWidth = Math.max(2, length * 0.025);
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, r, tick) {
    const ocean = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.38, r * 0.05, cx, cy, r);
    ocean.addColorStop(0, "rgba(107,230,255,1)");
    ocean.addColorStop(0.22, "rgba(26,150,214,1)");
    ocean.addColorStop(0.62, "rgba(5,78,154,1)");
    ocean.addColorStop(1, "rgba(2,23,60,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();

    const rotation = tick * 0.003 * (state.direction === "reverse" ? -1 : 1);
    drawLand(ctx, cx, cy, r, rotation);
    drawSphereClip(ctx, cx, cy, r);

    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);

    drawCloud(ctx, cx, cy - r * 0.3, r * 0.76, -0.72);
    drawCloud(ctx, cx - r * 0.05, cy + r * 0.06, r * 0.72, 0.72);
    drawCloud(ctx, cx, cy + r * 0.34, r * 0.52, 0.12);

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "earth");
    drawRim(ctx, cx, cy, r, "rgba(126,219,255,0.55)", "rgba(126,219,255,0.35)");
  }

  function drawSun(ctx, cx, cy, r, tick) {
    const body = ctx.createRadialGradient(cx - r * 0.33, cy - r * 0.34, r * 0.05, cx, cy, r);
    body.addColorStop(0, "rgba(255,255,207,1)");
    body.addColorStop(0.14, "rgba(255,219,78,1)");
    body.addColorStop(0.36, "rgba(255,140,31,1)");
    body.addColorStop(0.70, "rgba(212,61,18,1)");
    body.addColorStop(1, "rgba(88,18,6,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.shadowColor = "rgba(255,145,35,0.42)";
    ctx.shadowBlur = r * 0.13;
    ctx.fill();

    drawSphereClip(ctx, cx, cy, r);
    ctx.translate(cx, cy);
    ctx.rotate(tick * 0.004 * (state.direction === "reverse" ? -1 : 1));
    ctx.translate(-cx, -cy);

    for (let i = 0; i < 88; i += 1) {
      const angle = i * 2.399963 + tick * 0.006;
      const dist = r * (0.12 + ((i * 37) % 78) / 100);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const size = r * (0.015 + ((i * 11) % 10) / 500);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(2.8, 1);
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "rgba(255,238,140,0.42)" : "rgba(255,185,76,0.34)";
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "sun");
    drawRim(ctx, cx, cy, r, "rgba(255,224,116,0.70)", "rgba(255,166,34,0.55)");
  }

  function drawMoonMaria(ctx, x, y, rx, ry, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(rx, ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(83,90,91,0.22)";
    ctx.fill();
    ctx.restore();
  }

  function drawCrater(ctx, x, y, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(66,70,72,0.13)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,244,0.34)";
    ctx.lineWidth = Math.max(1, r * 0.16);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x - r * 0.2, y - r * 0.22, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fill();
    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r) {
    const surface = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, r * 0.05, cx, cy, r);
    surface.addColorStop(0, "rgba(255,255,235,1)");
    surface.addColorStop(0.28, "rgba(214,214,202,1)");
    surface.addColorStop(0.70, "rgba(151,158,157,1)");
    surface.addColorStop(1, "rgba(76,84,94,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = surface;
    ctx.fill();

    drawSphereClip(ctx, cx, cy, r);

    drawMoonMaria(ctx, cx - r * 0.22, cy - r * 0.22, r * 0.24, r * 0.16, 0.05);
    drawMoonMaria(ctx, cx + r * 0.26, cy - r * 0.08, r * 0.2, r * 0.14, -0.08);
    drawMoonMaria(ctx, cx + r * 0.03, cy + r * 0.2, r * 0.28, r * 0.17, 0.02);
    drawMoonMaria(ctx, cx - r * 0.18, cy + r * 0.46, r * 0.19, r * 0.11, 0.12);

    const craters = [
      [-0.34, -0.35, 0.08],
      [0.19, -0.41, 0.05],
      [0.47, -0.22, 0.075],
      [-0.53, -0.02, 0.055],
      [0.01, 0.04, 0.105],
      [0.45, 0.22, 0.055],
      [-0.31, 0.35, 0.075],
      [0.23, 0.55, 0.095]
    ];

    for (const crater of craters) {
      drawCrater(ctx, cx + crater[0] * r, cy + crater[1] * r, crater[2] * r);
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "moon");
    drawRim(ctx, cx, cy, r, "rgba(236,235,219,0.52)", "rgba(255,255,244,0.20)");
  }

  function drawOnce() {
    if (!state.canvas || !state.ctx) return;

    resizeCanvas();

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const zoom = clamp(state.zoom, 70, 240) / 100;
    const r = size * 0.38 * zoom;

    clear(ctx);

    if (state.running) {
      state.frame += state.speedValue;
    }

    if (state.body === "sun") {
      drawSun(ctx, cx, cy, r, state.frame);
    } else if (state.body === "moon") {
      drawMoon(ctx, cx, cy, r);
    } else {
      drawEarth(ctx, cx, cy, r, state.frame);
    }

    writeReceipt("DRAWN");
  }

  function loop() {
    state.raf = 0;
    drawOnce();

    if (state.running) {
      state.raf = global.requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (state.raf) {
      global.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function startLoop() {
    stop();

    if (state.running) {
      state.raf = global.requestAnimationFrame(loop);
    } else {
      drawOnce();
    }
  }

  function writeReceipt(status) {
    state.lastReceipt = {
      ok: true,
      status: status || "READY",
      version: VERSION,
      route: ROUTE,
      instrumentBoundary: "render-only",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      ownsBodyRender: true,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControls: false,
      ownsRouteCopy: false,
      ownsGauges: false,
      ownsRuntime: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };

    if (state.mount) {
      state.mount.dataset.instrumentReceipt = status || "READY";
      state.mount.dataset.activeBody = state.body;
      state.mount.dataset.instrumentBoundary = "render-only";
      state.mount.dataset.visualPassClaimed = "false";
    }

    return state.lastReceipt;
  }

  function renderGlobe(target, options) {
    try {
      applyOptions(options);

      if (!ensureSurface(target || options)) {
        return {
          ok: false,
          status: "HOLD_NO_MOUNT",
          version: VERSION,
          instrumentBoundary: "render-only"
        };
      }

      startLoop();
      return writeReceipt("MOUNTED");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError,
        instrumentBoundary: "render-only"
      };
    }
  }

  function mount(target, options) {
    return renderGlobe(target, options);
  }

  function render(target, options) {
    return renderGlobe(target, options);
  }

  function renderActualBody(target, options) {
    return renderGlobe(target, options);
  }

  function setActiveBody(value) {
    state.body = normalizeBody(value);
    if (state.mount) startLoop();
    return writeReceipt("BODY_SELECTED");
  }

  function setMotion(options) {
    applyOptions(options);
    if (state.mount) startLoop();
    return writeReceipt("MOTION_UPDATED");
  }

  function update(options) {
    return setMotion(options);
  }

  function setState(options) {
    return setMotion(options);
  }

  function start() {
    state.running = true;
    startLoop();
    return writeReceipt("STARTED");
  }

  function resume() {
    return start();
  }

  function pause() {
    state.running = false;
    stop();
    drawOnce();
    return writeReceipt("PAUSED");
  }

  function reset() {
    state.running = true;
    state.direction = "forward";
    state.speedName = "normal";
    state.speedValue = speedValues.normal;
    state.zoom = 100;
    state.frame = 0;
    startLoop();
    return writeReceipt("RESET");
  }

  function reverse() {
    state.direction = state.direction === "forward" ? "reverse" : "forward";
    startLoop();
    return writeReceipt("REVERSED");
  }

  function setSpeed(value) {
    state.speedName = normalizeSpeed(value);
    state.speedValue = speedValues[state.speedName];
    startLoop();
    return writeReceipt("SPEED_UPDATED");
  }

  function setZoom(value) {
    if (value && typeof value === "object") {
      if (value.zoom === "in") state.zoom = clamp(state.zoom + 10, 70, 240);
      else if (value.zoom === "out") state.zoom = clamp(state.zoom - 10, 70, 240);
      else if (value.zoom === "reset") state.zoom = 100;
      else state.zoom = normalizeZoom(value);
    } else if (value === "in") {
      state.zoom = clamp(state.zoom + 10, 70, 240);
    } else if (value === "out") {
      state.zoom = clamp(state.zoom - 10, 70, 240);
    } else if (value === "reset") {
      state.zoom = 100;
    } else {
      state.zoom = normalizeZoom(value);
    }

    startLoop();
    return writeReceipt("ZOOM_UPDATED");
  }

  function writeReceipts() {
    return writeReceipt("RECEIPT_WRITTEN");
  }

  function getStatus() {
    return {
      ok: true,
      version: VERSION,
      route: ROUTE,
      instrumentBoundary: "render-only",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      lastReceipt: state.lastReceipt,
      lastError: state.lastError,
      ownsBodyRender: true,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControls: false,
      ownsRouteCopy: false,
      ownsGauges: false,
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  function boot() {
    const mountNode = resolveMount(null);

    if (mountNode) {
      renderGlobe(mountNode, {
        activeBody: state.body,
        running: state.running,
        direction: state.direction,
        speedName: state.speedName,
        zoom: state.zoom
      });
    }

    try {
      global.dispatchEvent(new CustomEvent("showroom:globe:instrument-ready", {
        detail: getStatus()
      }));

      global.dispatchEvent(new CustomEvent("dgb:showroom:actual-bodies-instrument-restored", {
        detail: getStatus()
      }));
    } catch (_) {}
  }

  const api = {
    VERSION,
    version: VERSION,
    renderGlobe,
    renderActualBody,
    render,
    mount,
    setActiveBody,
    setMotion,
    update,
    setState,
    start,
    resume,
    pause,
    reset,
    reverse,
    setSpeed,
    setZoom,
    writeReceipts,
    getStatus,
    status,
    visualPassClaimed: false,
    ownerVisualReceiptRequired: true
  };

  global.DGBShowroomGlobeInstrument = api;
  global.DGBActualBodiesInstrument = api;
  global.ShowroomGlobeInstrument = api;
  global.showroomGlobeInstrument = api;

  if (global.DiamondGateBridge && typeof global.DiamondGateBridge === "object") {
    global.DiamondGateBridge.DGBShowroomGlobeInstrument = api;
    global.DiamondGateBridge.DGBActualBodiesInstrument = api;
    global.DiamondGateBridge.ShowroomGlobeInstrument = api;
    global.DiamondGateBridge.showroomGlobeInstrument = api;
  } else {
    global.DiamondGateBridge = {
      DGBShowroomGlobeInstrument: api,
      DGBActualBodiesInstrument: api,
      ShowroomGlobeInstrument: api,
      showroomGlobeInstrument: api
    };
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    global.addEventListener("resize", function handleWindowResize() {
      resizeCanvas();
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);
