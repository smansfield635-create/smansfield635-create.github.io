/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_SATELLITE_DEFINITION_AXIS_RENEWAL_TNT_v1

   PURPOSE:
   Keep the correct colors and add satellite/observatory definition.
   Render Earth, Sun, and Moon as axis bodies, not spinning 2D disks.

   REQUIRED LOCAL TEXTURES:
   /assets/textures/earth-blue-marble-4096.jpg
   /assets/textures/sun-sdo-4096.jpg
   /assets/textures/moon-lro-4096.jpg

   BOUNDARY:
   Instrument draws body only.
   Route owns labels, buttons, mount, and zoom wrapper.
*/

(function satelliteDefinitionAxisInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_SATELLITE_DEFINITION_AXIS_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);
  const TAU = Math.PI * 2;
  const CACHE = "?v=satellite-definition-axis-v1";

  const TEXTURES = {
    earth: [
      "/assets/textures/earth-blue-marble-4096.jpg" + CACHE,
      "/assets/textures/earth-blue-marble.png" + CACHE,
      "/assets/textures/earth-blue-marble.jpg" + CACHE
    ],
    sun: [
      "/assets/textures/sun-sdo-4096.jpg" + CACHE,
      "/assets/textures/sun-sdo.png" + CACHE,
      "/assets/textures/sun-sdo.jpg" + CACHE
    ],
    moon: [
      "/assets/textures/moon-lro-4096.jpg" + CACHE,
      "/assets/textures/moon-lro.png" + CACHE,
      "/assets/textures/moon-lro.jpg" + CACHE
    ]
  };

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 0.0035,
    zoom: 100,
    longitude: 0,
    mount: null,
    canvas: null,
    ctx: null,
    raf: 0,
    textureCache: {},
    textureIndex: { earth: 0, sun: 0, moon: 0 },
    resizeObserver: null,
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.0018,
    normal: 0.0035,
    fast: 0.007
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

    const body = String(value || "").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function normalizeSpeed(value) {
    if (value && typeof value === "object") {
      value = value.speedName || value.speed || value.value;
    }

    const speed = String(value || "normal").toLowerCase();
    return Object.prototype.hasOwnProperty.call(speedValues, speed) ? speed : "normal";
  }

  function normalizeZoom(value) {
    if (value && typeof value === "object") value = value.zoom;
    return clamp(Number(value) || 100, 70, 240);
  }

  function bodyTilt(body) {
    if (body === "sun") return -7.25;
    if (body === "moon") return -6.68;
    return -23.5;
  }

  function resolveMount(target) {
    if (isElement(target)) return target;

    if (target && typeof target === "object") {
      return resolveMount(target.mount || target.root || target.target || target.element || target.el || null);
    }

    if (typeof target === "string" && global.document) {
      const found = global.document.querySelector(target);
      if (found) return found;
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

    if (options.activeBody || options.body || options.name || options.value) {
      state.body = normalizeBody(options);
    }

    if (typeof options.running === "boolean") state.running = options.running;
    if (options.direction) state.direction = options.direction === "reverse" ? "reverse" : "forward";

    if (options.speedName || options.speed) {
      state.speedName = normalizeSpeed(options);
      state.speedValue = speedValues[state.speedName];
    }

    if (options.zoom !== undefined) state.zoom = normalizeZoom(options);
  }

  function ensureCanvas(target) {
    const mount = resolveMount(target);

    if (!mount || !global.document) {
      state.lastError = "NO_MOUNT";
      return false;
    }

    if (state.mount === mount && state.canvas && state.ctx) return true;

    stopLoop();

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    mount.replaceChildren();

    const canvas = global.document.createElement("canvas");
    canvas.className = "dgb-showroom-satellite-axis-canvas";
    canvas.setAttribute("data-showroom-satellite-axis-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe satellite-definition axis body");

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    mount.appendChild(canvas);

    mount.dataset.instrumentMounted = "true";
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "layout-command-panel-zoom-wrapper";
    mount.dataset.instrumentBoundary = "satellite-definition-axis-render-only";
    mount.dataset.textureAuthority = "local-real-source-imagery";
    mount.dataset.projection = "spherical-axis";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;
    mount.dataset.visualPassClaimed = "false";

    state.mount = mount;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function onResize() {
        resizeCanvas();
        drawOnce();
      });
      state.resizeObserver.observe(mount);
    }

    resizeCanvas();
    loadTexture(state.body);
    return true;
  }

  function resizeCanvas() {
    if (!state.mount || !state.canvas) return;

    const rect = state.mount.getBoundingClientRect();
    const cssSize = clamp(rect.width || state.mount.clientWidth || 420, 260, 1080);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 2.5);
    const pixelSize = Math.round(cssSize * dpr);

    if (state.canvas.width !== pixelSize || state.canvas.height !== pixelSize) {
      state.canvas.width = pixelSize;
      state.canvas.height = pixelSize;
    }
  }

  function loadTexture(body) {
    body = normalizeBody(body);

    if (state.textureCache[body] && state.textureCache[body].complete) {
      drawOnce();
      return;
    }

    const sources = TEXTURES[body] || [];
    const index = state.textureIndex[body] || 0;
    const src = sources[index];

    if (!src) {
      state.lastError = "MISSING_LOCAL_TEXTURE:" + body;
      drawMissingTextureFallback(body);
      writeReceipt("MISSING_TEXTURE");
      return;
    }

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = function onLoad() {
      state.textureCache[body] = img;
      drawOnce();
      writeReceipt("TEXTURE_LOADED");
    };

    img.onerror = function onError() {
      state.textureIndex[body] = index + 1;
      loadTexture(body);
    };

    img.src = src;
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function clipSphere(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function drawProjectedTexture(ctx, img, cx, cy, r, longitude, body) {
    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;

    const qualitySlices = body === "earth" ? 520 : 440;
    const sliceCount = Math.max(qualitySlices, Math.floor(r * 2.25));
    const tilt = bodyTilt(body) * Math.PI / 180;

    ctx.save();
    clipSphere(ctx, cx, cy, r);

    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.translate(-cx, -cy);

    for (let i = 0; i < sliceCount; i += 1) {
      const nx1 = -1 + (2 * i) / sliceCount;
      const nx2 = -1 + (2 * (i + 1)) / sliceCount;
      const nx = (nx1 + nx2) / 2;

      const visibleScale = Math.sqrt(Math.max(0, 1 - nx * nx));
      if (visibleScale <= 0.001) continue;

      const meridian = Math.asin(clamp(nx, -1, 1));
      let u = 0.5 + meridian / Math.PI + longitude;
      u = ((u % 1) + 1) % 1;

      const sx = Math.floor(u * naturalW);
      const sw = Math.max(1, Math.ceil(naturalW / sliceCount) + 1);

      const destX = cx + nx1 * r;
      const destW = Math.ceil((nx2 - nx1) * r) + 2;
      const destH = 2 * r * visibleScale;
      const destY = cy - destH / 2;

      ctx.drawImage(
        img,
        sx,
        0,
        Math.min(sw, naturalW - sx),
        naturalH,
        destX,
        destY,
        destW,
        destH
      );
    }

    ctx.restore();

    drawBodyOptics(ctx, cx, cy, r, body);
  }

  function drawBodyOptics(ctx, cx, cy, r, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(
      cx - r * 0.34,
      cy - r * 0.36,
      r * 0.04,
      cx,
      cy,
      r
    );

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.32)");
      highlight.addColorStop(0.22, "rgba(255,238,120,0.12)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.24)");
      highlight.addColorStop(0.28, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const terminator = ctx.createLinearGradient(cx - r * 0.55, cy - r, cx + r, cy + r);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.54, "rgba(0,0,0,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(80,12,0,0.16)" : "rgba(0,0,0,0.42)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    if (body === "earth") drawAtmosphere(ctx, cx, cy, r);
    if (body === "sun") drawSolarGlow(ctx, cx, cy, r);

    drawRim(ctx, cx, cy, r, body);
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.014, 0, TAU);
    ctx.strokeStyle = "rgba(126,219,255,0.46)";
    ctx.lineWidth = Math.max(2, r * 0.028);
    ctx.shadowColor = "rgba(126,219,255,0.42)";
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function drawSolarGlow(ctx, cx, cy, r) {
    const corona = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.2);
    corona.addColorStop(0, "rgba(255,197,63,0.16)");
    corona.addColorStop(0.58, "rgba(255,114,26,0.12)");
    corona.addColorStop(1, "rgba(255,114,26,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, TAU);
    ctx.fillStyle = corona;
    ctx.fill();
    ctx.restore();
  }

  function drawRim(ctx, cx, cy, r, body) {
    let stroke = "rgba(236,235,219,0.52)";
    let glow = "rgba(255,255,244,0.18)";

    if (body === "earth") {
      stroke = "rgba(134,225,255,0.62)";
      glow = "rgba(126,219,255,0.36)";
    }

    if (body === "sun") {
      stroke = "rgba(255,224,116,0.76)";
      glow = "rgba(255,166,34,0.5)";
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.01);
    ctx.shadowColor = glow;
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function drawMissingTextureFallback(body) {
    if (!state.canvas || !state.ctx) return;

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const r = size * 0.39 * (state.zoom / 100);

    clear(ctx);

    const gradient = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.36, r * 0.04, cx, cy, r);

    if (body === "sun") {
      gradient.addColorStop(0, "#fff4a8");
      gradient.addColorStop(0.28, "#f7a632");
      gradient.addColorStop(1, "#7b210a");
    } else if (body === "moon") {
      gradient.addColorStop(0, "#fbfae8");
      gradient.addColorStop(0.42, "#babdb6");
      gradient.addColorStop(1, "#4c5662");
    } else {
      gradient.addColorStop(0, "#6fe8ff");
      gradient.addColorStop(0.42, "#1476c4");
      gradient.addColorStop(1, "#02183f");
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();

    drawBodyOptics(ctx, cx, cy, r, body);
  }

  function drawOnce() {
    if (!state.canvas || !state.ctx) return;

    resizeCanvas();

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const r = size * 0.395 * (state.zoom / 100);
    const texture = state.textureCache[state.body];

    clear(ctx);

    if (texture && texture.complete && texture.naturalWidth > 0) {
      drawProjectedTexture(ctx, texture, cx, cy, r, state.longitude, state.body);
      writeReceipt("SATELLITE_TEXTURE_DRAWN");
    } else {
      drawMissingTextureFallback(state.body);
      writeReceipt("FALLBACK_DRAWN_TEXTURE_MISSING");
    }
  }

  function step() {
    state.raf = 0;

    if (state.running) {
      const direction = state.direction === "reverse" ? -1 : 1;
      state.longitude = (state.longitude + direction * state.speedValue) % 1;
    }

    drawOnce();

    if (state.running) {
      state.raf = global.requestAnimationFrame(step);
    }
  }

  function stopLoop() {
    if (state.raf) {
      global.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function startLoop() {
    stopLoop();

    if (state.running) {
      state.raf = global.requestAnimationFrame(step);
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
      instrumentBoundary: "satellite-definition-axis-render-only",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      axialTilt: bodyTilt(state.body),
      textureLoaded: Boolean(state.textureCache[state.body]),
      textureExpected: TEXTURES[state.body][0],
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
      state.mount.dataset.instrumentBoundary = "satellite-definition-axis-render-only";
      state.mount.dataset.projection = "spherical-axis";
      state.mount.dataset.textureLoaded = String(Boolean(state.textureCache[state.body]));
      state.mount.dataset.textureExpected = TEXTURES[state.body][0];
      state.mount.dataset.visualPassClaimed = "false";
    }

    return state.lastReceipt;
  }

  function renderGlobe(target, options) {
    try {
      applyOptions(options);

      if (!ensureCanvas(target || options)) {
        return {
          ok: false,
          status: "HOLD_NO_MOUNT",
          version: VERSION,
          instrumentBoundary: "satellite-definition-axis-render-only"
        };
      }

      loadTexture(state.body);
      startLoop();

      return writeReceipt("MOUNTED");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);

      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError,
        instrumentBoundary: "satellite-definition-axis-render-only"
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

    if (state.mount) {
      loadTexture(state.body);
      startLoop();
    }

    return writeReceipt("BODY_SELECTED");
  }

  function setMotion(options) {
    applyOptions(options);

    if (state.mount) {
      loadTexture(state.body);
      startLoop();
    }

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
    stopLoop();
    drawOnce();
    return writeReceipt("PAUSED");
  }

  function reset() {
    state.running = true;
    state.direction = "forward";
    state.speedName = "normal";
    state.speedValue = speedValues.normal;
    state.zoom = 100;
    state.longitude = 0;
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

    drawOnce();
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
      instrumentBoundary: "satellite-definition-axis-render-only",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      axialTilt: bodyTilt(state.body),
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      textureLoaded: Boolean(state.textureCache[state.body]),
      textureExpected: TEXTURES[state.body][0],
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

      global.dispatchEvent(new CustomEvent("dgb:showroom:satellite-definition-axis-renewed", {
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

    global.addEventListener("resize", function handleResize() {
      resizeCanvas();
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);
