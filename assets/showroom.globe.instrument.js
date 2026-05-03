/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_AXIS_GLOBE_TEXTURE_RENEWAL_TNT_v1

   RENEWAL LAW:
   Demo Actual Universe uses real-source Earth, Sun, and Moon imagery.
   Instrument draws body only.
   Route owns labels, descriptions, buttons, mount, and zoom wrapper.
   CSS contains presentation.
   Runtime supports state.
   Gauges audits only.

   PURPOSE:
   Stop 2D disk-spin behavior.
   Render selected image as a globe/sphere on an axis using canvas projection.

   EXPECTED LOCAL ASSETS:
   /assets/textures/earth-blue-marble.png
   /assets/textures/sun-sdo.png
   /assets/textures/moon-lro.png
*/

(function renewAxisGlobeTextureInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_AXIS_GLOBE_TEXTURE_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);
  const TAU = Math.PI * 2;

  const TEXTURES = {
    earth: [
      "/assets/textures/earth-blue-marble.png",
      "/assets/textures/earth-blue-marble.jpg",
      "https://svs.gsfc.nasa.gov/vis/a030000/a030600/a030614/blue_marble_modis_north_america_searchweb.png"
    ],
    sun: [
      "/assets/textures/sun-sdo.png",
      "/assets/textures/sun-sdo.jpg",
      "https://svs.gsfc.nasa.gov/vis/a030000/a031200/a031213/2022-agu-fox-slide5_print.jpg"
    ],
    moon: [
      "/assets/textures/moon-lro.png",
      "/assets/textures/moon-lro.jpg",
      "https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005001/moon_mosaic_print.jpg"
    ]
  };

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 0.004,
    zoom: 100,
    longitude: 0,
    axialTilt: -23.5,
    mount: null,
    canvas: null,
    ctx: null,
    image: null,
    textureCache: {},
    textureIndex: { earth: 0, sun: 0, moon: 0 },
    raf: 0,
    resizeObserver: null,
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.0022,
    normal: 0.004,
    fast: 0.008
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

  function resolveMount(target) {
    if (isElement(target)) return target;

    if (target && typeof target === "object") {
      return resolveMount(target.mount || target.root || target.target || target.element || target.el || null);
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
    canvas.className = "dgb-showroom-axis-globe-canvas";
    canvas.setAttribute("data-showroom-axis-globe-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe spherical body render");

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
    mount.dataset.instrumentBoundary = "axis-globe-render-only";
    mount.dataset.textureAuthority = "real-source-imagery";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;
    mount.dataset.visualPassClaimed = "false";

    state.mount = mount;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function handleResize() {
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
    const cssSize = clamp(rect.width || state.mount.clientWidth || 420, 220, 960);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 2);
    const pixelSize = Math.round(cssSize * dpr);

    if (state.canvas.width !== pixelSize || state.canvas.height !== pixelSize) {
      state.canvas.width = pixelSize;
      state.canvas.height = pixelSize;
    }
  }

  function loadTexture(body) {
    body = normalizeBody(body);

    if (state.textureCache[body] && state.textureCache[body].complete) {
      state.image = state.textureCache[body];
      drawOnce();
      return;
    }

    const sources = TEXTURES[body] || [];
    const index = state.textureIndex[body] || 0;
    const source = sources[index];

    if (!source) {
      state.lastError = "NO_TEXTURE_SOURCE:" + body;
      drawFallbackSphere(body);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.loading = "eager";

    image.onload = function handleTextureLoaded() {
      state.textureCache[body] = image;
      if (state.body === body) {
        state.image = image;
        drawOnce();
      }
      writeReceipt("TEXTURE_LOADED");
    };

    image.onerror = function handleTextureError() {
      state.textureIndex[body] = index + 1;
      loadTexture(body);
    };

    image.src = source;
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

  function bodyTilt(body) {
    if (body === "sun") return -7.25;
    if (body === "moon") return -6.68;
    return state.axialTilt;
  }

  function drawProjectedTexture(ctx, image, cx, cy, r, longitude, body) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const sxWidth = image.naturalWidth || image.width;
    const sxHeight = image.naturalHeight || image.height;

    const sliceCount = Math.max(220, Math.floor(r * 2));
    const left = cx - r;
    const top = cy - r;

    ctx.save();

    clipSphere(ctx, cx, cy, r);

    ctx.translate(cx, cy);
    ctx.rotate(bodyTilt(body) * Math.PI / 180);
    ctx.translate(-cx, -cy);

    for (let i = 0; i < sliceCount; i += 1) {
      const nx = -1 + (2 * i) / (sliceCount - 1);
      const meridian = Math.asin(clamp(nx, -1, 1));
      const visibleScale = Math.sqrt(Math.max(0, 1 - nx * nx));

      const destX = cx + nx * r;
      const destH = Math.max(1, 2 * r * visibleScale);
      const destY = cy - destH / 2;
      const destW = Math.ceil((2 * r) / sliceCount) + 1;

      let u = 0.5 + (meridian / Math.PI) + longitude;
      u = ((u % 1) + 1) % 1;

      const sx = Math.floor(u * sxWidth);
      const sw = Math.max(1, Math.ceil(sxWidth / sliceCount));

      ctx.drawImage(
        image,
        sx,
        0,
        Math.min(sw, sxWidth - sx),
        sxHeight,
        destX,
        destY,
        destW,
        destH
      );
    }

    ctx.restore();

    drawSphereOverlays(ctx, cx, cy, r, body);
  }

  function drawSphereOverlays(ctx, cx, cy, r, body) {
    ctx.save();

    clipSphere(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(
      cx - r * 0.36,
      cy - r * 0.38,
      r * 0.04,
      cx,
      cy,
      r
    );

    highlight.addColorStop(0, body === "sun" ? "rgba(255,255,210,0.45)" : "rgba(255,255,255,0.32)");
    highlight.addColorStop(0.28, "rgba(255,255,255,0.08)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createLinearGradient(cx - r * 0.52, cy - r, cx + r, cy + r);

    if (body === "sun") {
      shade.addColorStop(0, "rgba(255,255,255,0.02)");
      shade.addColorStop(0.56, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(90,12,0,0.24)");
    } else {
      shade.addColorStop(0, "rgba(255,255,255,0)");
      shade.addColorStop(0.54, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(0,0,0,0.48)");
    }

    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    if (body === "earth") {
      drawAtmosphere(ctx, cx, cy, r);
    }

    if (body === "sun") {
      drawSolarCorona(ctx, cx, cy, r);
    }

    drawRim(ctx, cx, cy, r, body);
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TAU);
    ctx.strokeStyle = "rgba(126,219,255,0.42)";
    ctx.lineWidth = Math.max(2, r * 0.032);
    ctx.shadowColor = "rgba(126,219,255,0.45)";
    ctx.shadowBlur = r * 0.08;
    ctx.stroke();
    ctx.restore();
  }

  function drawSolarCorona(ctx, cx, cy, r) {
    const corona = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.22);
    corona.addColorStop(0, "rgba(255,191,54,0.16)");
    corona.addColorStop(0.58, "rgba(255,114,26,0.13)");
    corona.addColorStop(1, "rgba(255,114,26,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.22, 0, TAU);
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
      glow = "rgba(255,166,34,0.58)";
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.012);
    ctx.shadowColor = glow;
    ctx.shadowBlur = r * 0.08;
    ctx.stroke();
    ctx.restore();
  }

  function drawFallbackSphere(body) {
    if (!state.ctx || !state.canvas) return;

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const r = size * 0.39 * (state.zoom / 100);

    clear(ctx);

    const gradient = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.05, cx, cy, r);

    if (body === "sun") {
      gradient.addColorStop(0, "#fff7b6");
      gradient.addColorStop(0.25, "#ffc83c");
      gradient.addColorStop(0.7, "#d94a15");
      gradient.addColorStop(1, "#4c1005");
    } else if (body === "moon") {
      gradient.addColorStop(0, "#fffbe8");
      gradient.addColorStop(0.35, "#cfcfc4");
      gradient.addColorStop(0.75, "#858d8f");
      gradient.addColorStop(1, "#3e4650");
    } else {
      gradient.addColorStop(0, "#7de7ff");
      gradient.addColorStop(0.35, "#168acb");
      gradient.addColorStop(0.75, "#063d86");
      gradient.addColorStop(1, "#011537");
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();

    drawSphereOverlays(ctx, cx, cy, r, body);
  }

  function drawOnce() {
    if (!state.canvas || !state.ctx) return;

    resizeCanvas();

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const r = size * 0.39 * (state.zoom / 100);

    clear(ctx);

    const texture = state.textureCache[state.body];

    if (texture && texture.complete && texture.naturalWidth > 0) {
      drawProjectedTexture(ctx, texture, cx, cy, r, state.longitude, state.body);
    } else {
      drawFallbackSphere(state.body);
    }

    writeReceipt("DRAWN_AS_AXIS_GLOBE");
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
      instrumentBoundary: "axis-globe-render-only",
      sourceClass: "REAL_IMAGE_TEXTURE_SPHERICAL_PROJECTION",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      axialTilt: bodyTilt(state.body),
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
      state.mount.dataset.instrumentBoundary = "axis-globe-render-only";
      state.mount.dataset.textureAuthority = "real-source-imagery";
      state.mount.dataset.projection = "spherical-axis";
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
          instrumentBoundary: "axis-globe-render-only"
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
        instrumentBoundary: "axis-globe-render-only"
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
      instrumentBoundary: "axis-globe-render-only",
      sourceClass: "REAL_IMAGE_TEXTURE_SPHERICAL_PROJECTION",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      axialTilt: bodyTilt(state.body),
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

      global.dispatchEvent(new CustomEvent("dgb:showroom:actual-bodies-axis-globe-renewed", {
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
