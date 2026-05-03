/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_THIN_INSTRUMENT_TO_RENDER_HANDOFF_TNT_v1

   ROLE:
   Thin instrument facade / controller only.

   OWNS:
   Public API.
   Mount canvas creation.
   Active body state.
   Motion state.
   Speed, direction, zoom.
   Calling /assets/showroom.globe.render.js.

   DOES_NOT_OWN:
   Earth/Sun/Moon drawing.
   Labels.
   Route copy.
   Buttons.
   Gauges.
*/

(function bindShowroomGlobeThinInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_THIN_INSTRUMENT_TO_RENDER_HANDOFF_TNT_v1";
  const RENDER_FILE = "/assets/showroom.globe.render.js?v=true-sphere-render-v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 0.0032,
    zoom: 100,
    longitude: 0,
    mount: null,
    canvas: null,
    renderer: null,
    raf: 0,
    resizeObserver: null,
    renderLoading: false,
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.0016,
    normal: 0.0032,
    fast: 0.0068
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

    if (options.zoom !== undefined) {
      state.zoom = normalizeZoom(options);
    }
  }

  function getRenderApi() {
    return (
      global.DGBShowroomGlobeRender ||
      (global.DiamondGateBridge && global.DiamondGateBridge.DGBShowroomGlobeRender) ||
      null
    );
  }

  function loadRenderFile(callback) {
    const api = getRenderApi();
    if (api) {
      callback(api);
      return;
    }

    if (state.renderLoading) {
      const wait = global.setInterval(() => {
        const ready = getRenderApi();
        if (ready) {
          global.clearInterval(wait);
          callback(ready);
        }
      }, 30);
      return;
    }

    if (!global.document) return;

    state.renderLoading = true;

    const script = global.document.createElement("script");
    script.src = RENDER_FILE;

    script.onload = () => {
      state.renderLoading = false;
      const loaded = getRenderApi();

      if (loaded) callback(loaded);
      else {
        state.lastError = "RENDER_FILE_LOADED_BUT_API_MISSING";
        writeReceipt("RENDER_FILE_API_MISSING");
      }
    };

    script.onerror = () => {
      state.renderLoading = false;
      state.lastError = "RENDER_FILE_LOAD_FAILED";
      writeReceipt("RENDER_FILE_LOAD_FAILED");
    };

    global.document.head.appendChild(script);
  }

  function ensureCanvas(target) {
    const mount = resolveMount(target);

    if (!mount || !global.document) {
      state.lastError = "NO_MOUNT";
      return false;
    }

    if (state.mount === mount && state.canvas) return true;

    stopLoop();

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    mount.replaceChildren();

    const canvas = global.document.createElement("canvas");
    canvas.className = "dgb-showroom-globe-render-canvas";
    canvas.setAttribute("data-showroom-globe-render-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe rendered body");

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    mount.appendChild(canvas);

    state.mount = mount;
    state.canvas = canvas;
    state.renderer = null;

    mount.dataset.instrumentMounted = "true";
    mount.dataset.instrumentBoundary = "thin-facade";
    mount.dataset.renderAuthority = "/assets/showroom.globe.render.js";
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.render.js";
    mount.dataset.instrumentAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "labels-controls-mount-zoom-wrapper";
    mount.dataset.projection = "true-inverse-spherical";
    mount.dataset.activeBody = state.body;
    mount.dataset.textureRequired = "false";
    mount.dataset.visualPassClaimed = "false";

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(() => {
        if (state.renderer && typeof state.renderer.resize === "function") state.renderer.resize();
        drawOnce();
      });
      state.resizeObserver.observe(mount);
    }

    return true;
  }

  function ensureRenderer(callback) {
    if (state.renderer) {
      callback(state.renderer);
      return;
    }

    loadRenderFile((api) => {
      if (!api || typeof api.createRenderer !== "function") {
        state.lastError = "CREATE_RENDERER_MISSING";
        writeReceipt("CREATE_RENDERER_MISSING");
        return;
      }

      state.renderer = api.createRenderer(state.canvas);
      callback(state.renderer);
    });
  }

  function drawOnce() {
    if (!state.canvas) return;

    ensureRenderer((renderer) => {
      if (!renderer || typeof renderer.render !== "function") {
        state.lastError = "RENDER_METHOD_MISSING";
        writeReceipt("RENDER_METHOD_MISSING");
        return;
      }

      renderer.render({
        body: state.body,
        longitude: state.longitude,
        zoom: state.zoom
      });

      writeReceipt("DRAWN_BY_RENDER_FILE");
    });
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
      instrumentBoundary: "thin-facade",
      renderAuthority: "/assets/showroom.globe.render.js",
      bodyRenderAuthority: "/assets/showroom.globe.render.js",
      projection: "true-inverse-spherical",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      textureRequired: false,
      ownsPublicApi: true,
      ownsMotionState: true,
      ownsBodyDrawing: false,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControlsMarkup: false,
      ownsRouteCopy: false,
      ownsGauges: false,
      visualPassClaimed: false,
      lastError: state.lastError,
      timestamp: new Date().toISOString()
    };

    if (state.mount) {
      state.mount.dataset.instrumentReceipt = status || "READY";
      state.mount.dataset.instrumentBoundary = "thin-facade";
      state.mount.dataset.renderAuthority = "/assets/showroom.globe.render.js";
      state.mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.render.js";
      state.mount.dataset.projection = "true-inverse-spherical";
      state.mount.dataset.activeBody = state.body;
      state.mount.dataset.textureRequired = "false";
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
          instrumentBoundary: "thin-facade"
        };
      }

      ensureRenderer(() => {
        startLoop();
      });

      return writeReceipt("MOUNTED");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);

      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError,
        instrumentBoundary: "thin-facade"
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
      instrumentBoundary: "thin-facade",
      renderAuthority: "/assets/showroom.globe.render.js",
      bodyRenderAuthority: "/assets/showroom.globe.render.js",
      projection: "true-inverse-spherical",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      rendererPresent: Boolean(state.renderer),
      textureRequired: false,
      lastReceipt: state.lastReceipt,
      lastError: state.lastError,
      ownsPublicApi: true,
      ownsMotionState: true,
      ownsBodyDrawing: false,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControlsMarkup: false,
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

      global.dispatchEvent(new CustomEvent("dgb:showroom:route-to-render-handoff-renewed", {
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

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeInstrument = api;
  global.DiamondGateBridge.DGBActualBodiesInstrument = api;
  global.DiamondGateBridge.ShowroomGlobeInstrument = api;
  global.DiamondGateBridge.showroomGlobeInstrument = api;

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    global.addEventListener("resize", function handleResize() {
      if (state.renderer && typeof state.renderer.resize === "function") state.renderer.resize();
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);
