/* /assets/showroom.globe.instrument.js
   AUDRELIA_TOUCH_INSTRUMENT_RENEWAL_TNT_v1

   ROLE=
   THIN_INSTRUMENT_FACADE_WITH_TOUCH_CONTROL

   OWNS=
   PUBLIC_API
   ACTIVE_BODY_STATE
   MOTION_STATE
   SPEED_DIRECTION_ZOOM
   TOUCH_GESTURES
   CANVAS_MOUNT
   RENDER_PLATFORM_HANDOFF

   DOES_NOT_OWN=
   BODY_PIXELS
   ROUTE_COPY
   ROUTE_LABELS
   BUTTONS
   GAUGES
*/

(function bindAudreliaTouchInstrument(global) {
  "use strict";

  const VERSION = "AUDRELIA_TOUCH_INSTRUMENT_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_ORDER = ["audrelia", "audrelia-sun", "audrelia-moon"];

  const speedValues = {
    slow: 0.0016,
    normal: 0.0032,
    fast: 0.0068
  };

  const state = {
    activeBody: "audrelia",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: speedValues.normal,
    zoom: 100,
    longitude: 0,
    mount: null,
    canvas: null,
    renderer: null,
    raf: 0,
    pointers: new Map(),
    gesture: {
      lastTap: 0,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      lastDistance: 0,
      dragging: false,
      pinching: false,
      moved: false
    },
    resizeObserver: null,
    lastReceipt: null,
    lastError: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeBody(value) {
    if (value && typeof value === "object") {
      value = value.activeBody || value.body || value.name || value.value;
    }

    value = String(value || "").trim().toLowerCase();

    if (value === "audrelia" || value === "earth" || value.includes("planet")) return "audrelia";
    if (value === "audrelia-sun" || value === "sun" || value.includes("sun")) return "audrelia-sun";
    if (value === "audrelia-moon" || value === "moon" || value.includes("moon")) return "audrelia-moon";

    return "audrelia";
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

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
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
      global.document.querySelector("[data-showroom-globe-mount]") ||
      global.document.querySelector("[data-globe-mount]") ||
      global.document.querySelector(".showroom-globe-mount")
    );
  }

  function renderApi() {
    return (
      global.DGBShowroomGlobeRender ||
      (global.DiamondGateBridge && global.DiamondGateBridge.DGBShowroomGlobeRender) ||
      null
    );
  }

  function applyOptions(options) {
    if (!options || typeof options !== "object") return;

    if (options.activeBody || options.body || options.name || options.value) {
      state.activeBody = normalizeBody(options);
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

    if (state.mount === mount && state.canvas) return true;

    stopLoop();

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    mount.replaceChildren();

    const canvas = global.document.createElement("canvas");
    canvas.className = "dgb-audrelia-touch-render-canvas";
    canvas.setAttribute("data-showroom-globe-render-canvas", "true");
    canvas.setAttribute("data-body", state.activeBody);
    canvas.setAttribute("aria-label", "Audrelia touch-controlled globe");

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    mount.appendChild(canvas);

    state.mount = mount;
    state.canvas = canvas;
    state.renderer = null;

    mount.dataset.instrumentMounted = "true";
    mount.dataset.instrumentVersion = VERSION;
    mount.dataset.instrumentBoundary = "thin-touch-facade";
    mount.dataset.touchControls = "true";
    mount.dataset.routeControlsPanel = "removed";
    mount.dataset.activeBody = state.activeBody;
    mount.dataset.activeAssets = "audrelia,audrelia-sun,audrelia-moon";
    mount.dataset.referenceBodies = "earth,earth-sun,earth-moon";
    mount.dataset.planetName = "Audrelia";
    mount.dataset.moonName = "Adralia’s Moon";
    mount.dataset.visualPassClaimed = "false";

    bindTouch(canvas);

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function onResize() {
        if (state.renderer && typeof state.renderer.resize === "function") {
          state.renderer.resize();
        }
        drawOnce();
      });
      state.resizeObserver.observe(mount);
    }

    return true;
  }

  function ensureRenderer() {
    if (state.renderer) return true;

    const api = renderApi();

    if (!api || typeof api.createRenderer !== "function") {
      state.lastError = "RENDER_PLATFORM_MISSING";
      writeReceipt("RENDER_PLATFORM_MISSING");
      return false;
    }

    state.renderer = api.createRenderer(state.canvas, renderPayload());
    return true;
  }

  function renderPayload(extra) {
    return Object.assign({
      route: ROUTE,
      universe: "nine-summits-universe",
      planetName: "Audrelia",
      moonName: "Adralia’s Moon",
      activeBody: state.activeBody,
      body: state.activeBody,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speed: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      activeAssets: BODY_ORDER.slice(),
      referenceBodies: ["earth", "earth-sun", "earth-moon"],
      touchControls: true,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    }, extra || {});
  }

  function drawOnce() {
    if (!state.canvas || !ensureRenderer()) return null;

    state.canvas.dataset.body = state.activeBody;
    state.canvas.dataset.activeBody = state.activeBody;

    const receipt = state.renderer.render(renderPayload());
    writeReceipt("DRAWN_BY_RENDER_PLATFORM");

    return receipt;
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

    if (state.running) state.raf = global.requestAnimationFrame(step);
    else drawOnce();

    broadcastState();
  }

  function distance(a, b) {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pointerList() {
    return Array.from(state.pointers.values());
  }

  function bindTouch(canvas) {
    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", onPointerUp, { passive: false });
    canvas.addEventListener("pointercancel", onPointerUp, { passive: false });
    canvas.addEventListener("wheel", onWheel, { passive: false });
  }

  function onPointerDown(event) {
    event.preventDefault();
    state.canvas.setPointerCapture(event.pointerId);

    state.pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY
    });

    const points = pointerList();

    if (points.length === 1) {
      state.gesture.startX = event.clientX;
      state.gesture.startY = event.clientY;
      state.gesture.lastX = event.clientX;
      state.gesture.lastY = event.clientY;
      state.gesture.dragging = true;
      state.gesture.pinching = false;
      state.gesture.moved = false;
    }

    if (points.length === 2) {
      state.gesture.pinching = true;
      state.gesture.dragging = false;
      state.gesture.lastDistance = distance(points[0], points[1]);
    }
  }

  function onPointerMove(event) {
    if (!state.pointers.has(event.pointerId)) return;

    event.preventDefault();

    state.pointers.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY
    });

    const points = pointerList();

    if (points.length === 1 && state.gesture.dragging) {
      const dx = event.clientX - state.gesture.lastX;
      const dy = event.clientY - state.gesture.lastY;

      if (Math.abs(dx) + Math.abs(dy) > 2) {
        state.gesture.moved = true;
        state.running = false;
        state.longitude = (state.longitude - dx * 0.00115) % 1;
        drawOnce();
        broadcastState();
      }

      state.gesture.lastX = event.clientX;
      state.gesture.lastY = event.clientY;
    }

    if (points.length === 2 && state.gesture.pinching) {
      const nextDistance = distance(points[0], points[1]);
      const delta = nextDistance - state.gesture.lastDistance;

      if (Math.abs(delta) > 1) {
        state.zoom = clamp(state.zoom + delta * 0.22, 70, 240);
        state.gesture.lastDistance = nextDistance;
        state.running = false;
        drawOnce();
        broadcastState();
      }
    }
  }

  function onPointerUp(event) {
    event.preventDefault();

    const priorPointerCount = state.pointers.size;
    state.pointers.delete(event.pointerId);

    if (priorPointerCount === 1) {
      const dx = event.clientX - state.gesture.startX;
      const dy = event.clientY - state.gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const now = Date.now();

      if (absX > 84 && absX > absY * 1.6) {
        if (dx < 0) selectNextBody();
        else selectPreviousBody();
      } else if (!state.gesture.moved && now - state.gesture.lastTap < 300) {
        state.running = !state.running;
        startLoop();
      } else if (!state.gesture.moved) {
        state.gesture.lastTap = now;
      }

      state.gesture.dragging = false;
      state.gesture.pinching = false;
      broadcastState();
    }

    if (state.pointers.size === 0) {
      state.gesture.dragging = false;
      state.gesture.pinching = false;
    }
  }

  function onWheel(event) {
    event.preventDefault();

    state.zoom = clamp(state.zoom - event.deltaY * 0.04, 70, 240);
    state.running = false;
    drawOnce();
    broadcastState();
  }

  function bodyIndex() {
    return Math.max(0, BODY_ORDER.indexOf(state.activeBody));
  }

  function selectNextBody() {
    const next = BODY_ORDER[(bodyIndex() + 1) % BODY_ORDER.length];
    setActiveBody(next);
  }

  function selectPreviousBody() {
    const next = BODY_ORDER[(bodyIndex() + BODY_ORDER.length - 1) % BODY_ORDER.length];
    setActiveBody(next);
  }

  function broadcastState() {
    try {
      global.dispatchEvent(new CustomEvent("dgb:showroom:globe-state", {
        detail: getStatus()
      }));
    } catch (_) {}
  }

  function writeReceipt(status) {
    state.lastReceipt = {
      ok: true,
      status: status || "READY",
      version: VERSION,
      route: ROUTE,
      universe: "nine-summits-universe",
      planetName: "Audrelia",
      moonName: "Adralia’s Moon",
      activeBody: state.activeBody,
      activeAssets: BODY_ORDER.slice(),
      referenceBodies: ["earth", "earth-sun", "earth-moon"],
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      touchControls: true,
      routeControlsPanel: "removed",
      ownsPublicApi: true,
      ownsMotionState: true,
      ownsTouchGestures: true,
      ownsBodyDrawing: false,
      ownsRouteLabels: false,
      ownsRouteCopy: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false,
      lastError: state.lastError,
      timestamp: new Date().toISOString()
    };

    if (state.mount) {
      state.mount.dataset.instrumentReceipt = status || "READY";
      state.mount.dataset.instrumentVersion = VERSION;
      state.mount.dataset.activeBody = state.activeBody;
      state.mount.dataset.touchControls = "true";
      state.mount.dataset.routeControlsPanel = "removed";
      state.mount.dataset.zoom = String(Math.round(state.zoom));
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
          version: VERSION
        };
      }

      drawOnce();
      startLoop();

      return writeReceipt("MOUNTED_TOUCH_CONTROL_ACTIVE");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError
      };
    }
  }

  function mount(target, options) { return renderGlobe(target, options); }
  function render(target, options) { return renderGlobe(target, options); }

  function setActiveBody(value) {
    state.activeBody = normalizeBody(value);
    state.running = false;
    drawOnce();
    writeReceipt("BODY_SELECTED");
    broadcastState();
    return state.lastReceipt;
  }

  function setMotion(options) {
    applyOptions(options);
    startLoop();
    return writeReceipt("MOTION_UPDATED");
  }

  function update(options) { return setMotion(options); }
  function setState(options) { return setMotion(options); }

  function start() {
    state.running = true;
    startLoop();
    return writeReceipt("STARTED");
  }

  function resume() { return start(); }

  function pause() {
    state.running = false;
    stopLoop();
    drawOnce();
    broadcastState();
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
    if (value && typeof value === "object") value = value.zoom;
    state.zoom = normalizeZoom(value);
    drawOnce();
    broadcastState();
    return writeReceipt("ZOOM_UPDATED");
  }

  function getStatus() {
    return {
      ok: true,
      version: VERSION,
      route: ROUTE,
      universe: "nine-summits-universe",
      planetName: "Audrelia",
      moonName: "Adralia’s Moon",
      activeBody: state.activeBody,
      activeAssets: BODY_ORDER.slice(),
      referenceBodies: ["earth", "earth-sun", "earth-moon"],
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      rendererPresent: Boolean(state.renderer),
      touchControls: true,
      routeControlsPanel: "removed",
      ownsPublicApi: true,
      ownsMotionState: true,
      ownsTouchGestures: true,
      ownsBodyDrawing: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false,
      lastReceipt: state.lastReceipt,
      lastError: state.lastError
    };
  }

  function boot() {
    const mountNode = resolveMount(null);

    if (mountNode) {
      renderGlobe(mountNode, {
        activeBody: state.activeBody,
        running: state.running,
        direction: state.direction,
        speedName: state.speedName,
        zoom: state.zoom
      });
    }

    try {
      global.dispatchEvent(new CustomEvent("showroom:globe:instrument-ready", { detail: getStatus() }));
    } catch (_) {}
  }

  const api = {
    VERSION,
    version: VERSION,
    renderGlobe,
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
    getStatus,
    status: getStatus,
    visualPassClaimed: false,
    ownerVisualReceiptRequired: true
  };

  global.DGBShowroomGlobeInstrument = api;
  global.ShowroomGlobeInstrument = api;
  global.showroomGlobeInstrument = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeInstrument = api;
  global.DiamondGateBridge.ShowroomGlobeInstrument = api;
  global.DiamondGateBridge.showroomGlobeInstrument = api;

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    global.addEventListener("resize", function handleResize() {
      if (state.renderer && typeof state.renderer.resize === "function") {
        state.renderer.resize();
      }
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);
