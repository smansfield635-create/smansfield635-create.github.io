/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_REAL_IMAGE_TEXTURE_INSTRUMENT_RENEWAL_TNT_v1

   RENEWAL LAW:
   Demo Actual Universe uses real-source Earth, Sun, and Moon imagery.
   Instrument draws body only.
   Route owns labels, descriptions, buttons, mount, and zoom wrapper.
   CSS contains presentation.
   Runtime supports state.
   Gauges audits only.

   EXPECTED LOCAL ASSET PATHS:
   /assets/textures/earth-blue-marble.png
   /assets/textures/sun-sdo.png
   /assets/textures/moon-lro.png

   FALLBACK SOURCE CLASS:
   NASA Blue Marble, NASA/GSFC SDO, NASA SVS LRO/LROC Moon Mosaic.
*/

(function renewRealImageTextureInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_REAL_IMAGE_TEXTURE_INSTRUMENT_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);

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
    speedValue: 1,
    zoom: 100,
    rotation: 0,
    mount: null,
    surface: null,
    frame: null,
    image: null,
    raf: 0,
    lastReceipt: null,
    lastError: null,
    loadedTexture: null
  };

  const speedValues = {
    slow: 0.18,
    normal: 0.35,
    fast: 0.72
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

    if (options.activeBody || options.body || options.name || options.value) {
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

  function ensureStyles() {
    if (!global.document) return;
    if (global.document.getElementById("dgb-real-image-texture-instrument-style")) return;

    const style = global.document.createElement("style");
    style.id = "dgb-real-image-texture-instrument-style";
    style.textContent = `
      .dgb-real-body-surface {
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        display: grid;
        place-items: center;
        overflow: visible;
        contain: layout paint;
        isolation: isolate;
      }

      .dgb-real-body-frame {
        position: relative;
        width: min(100%, 36rem);
        max-width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        overflow: hidden;
        background: #000;
        transform: scale(var(--dgb-body-zoom, 1));
        transform-origin: center;
        box-shadow:
          inset -2rem -2.5rem 4rem rgba(0, 0, 0, 0.34),
          inset 1.2rem 1.2rem 3rem rgba(255, 255, 255, 0.16),
          0 0 0 1px rgba(255, 255, 255, 0.18),
          0 0 2.25rem rgba(123, 214, 255, 0.12);
      }

      .dgb-real-body-frame::before,
      .dgb-real-body-frame::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 3;
      }

      .dgb-real-body-frame::before {
        background:
          radial-gradient(circle at 34% 29%, rgba(255, 255, 255, 0.32), transparent 0 16%, transparent 38%),
          linear-gradient(130deg, rgba(255, 255, 255, 0.1), transparent 38%),
          radial-gradient(circle at 67% 70%, rgba(0, 0, 0, 0.26), transparent 56%);
        mix-blend-mode: screen;
        opacity: 0.75;
      }

      .dgb-real-body-frame::after {
        box-shadow:
          inset 1rem 1rem 1.25rem rgba(255, 255, 255, 0.16),
          inset -2.35rem -2rem 2.8rem rgba(0, 0, 0, 0.42);
      }

      .dgb-real-body-image {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        object-fit: cover;
        border-radius: 50%;
        transform: rotate(var(--dgb-body-rotation, 0deg)) scale(var(--dgb-image-scale, 1));
        transform-origin: center;
        filter: saturate(1.04) contrast(1.05);
        user-select: none;
        -webkit-user-drag: none;
      }

      .dgb-real-body-frame[data-body="earth"] {
        box-shadow:
          inset -2rem -2.5rem 4rem rgba(0, 0, 0, 0.36),
          0 0 0 2px rgba(126, 219, 255, 0.44),
          0 0 2.35rem rgba(78, 179, 255, 0.25);
      }

      .dgb-real-body-frame[data-body="earth"] .dgb-real-body-image {
        object-fit: cover;
        filter: saturate(1.12) contrast(1.06);
      }

      .dgb-real-body-frame[data-body="sun"] {
        box-shadow:
          0 0 0 2px rgba(255, 225, 122, 0.62),
          0 0 2rem rgba(255, 190, 57, 0.5),
          0 0 5rem rgba(255, 98, 25, 0.24),
          inset -2rem -2rem 3rem rgba(82, 12, 4, 0.3);
      }

      .dgb-real-body-frame[data-body="sun"]::before {
        background:
          radial-gradient(circle at 30% 27%, rgba(255, 255, 220, 0.32), transparent 0 18%, transparent 38%),
          radial-gradient(circle at 72% 72%, rgba(255, 111, 24, 0.16), transparent 48%);
        opacity: 0.85;
      }

      .dgb-real-body-frame[data-body="sun"] .dgb-real-body-image {
        object-fit: cover;
        filter: saturate(1.18) contrast(1.08) brightness(1.05);
      }

      .dgb-real-body-frame[data-body="moon"] {
        box-shadow:
          inset -2.1rem -2.4rem 3.6rem rgba(43, 51, 62, 0.42),
          0 0 0 2px rgba(236, 235, 219, 0.45),
          0 0 1.4rem rgba(255, 255, 244, 0.18);
      }

      .dgb-real-body-frame[data-body="moon"]::before {
        background:
          radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.22), transparent 0 18%, transparent 42%),
          radial-gradient(circle at 68% 70%, rgba(0, 0, 0, 0.22), transparent 56%);
        opacity: 0.72;
      }

      .dgb-real-body-frame[data-body="moon"] .dgb-real-body-image {
        object-fit: cover;
        filter: grayscale(1) contrast(1.12) brightness(1.03);
      }

      @media (max-width: 430px) {
        .dgb-real-body-frame {
          width: min(100%, 22.5rem);
        }
      }

      @media (max-width: 360px) {
        .dgb-real-body-frame {
          width: min(100%, 20rem);
        }
      }
    `;

    global.document.head.appendChild(style);
  }

  function ensureSurface(target) {
    const mount = resolveMount(target);

    if (!mount || !global.document) {
      state.lastError = "NO_MOUNT";
      return false;
    }

    if (state.mount === mount && state.surface && state.frame && state.image) {
      return true;
    }

    stopLoop();
    ensureStyles();
    mount.replaceChildren();

    const surface = global.document.createElement("div");
    surface.className = "dgb-real-body-surface";
    surface.setAttribute("data-showroom-globe-render-only-surface", "true");

    const frame = global.document.createElement("div");
    frame.className = "dgb-real-body-frame";
    frame.setAttribute("data-real-body-frame", "true");

    const image = global.document.createElement("img");
    image.className = "dgb-real-body-image";
    image.alt = "";
    image.decoding = "async";
    image.loading = "eager";
    image.draggable = false;

    image.addEventListener("load", function onLoad() {
      state.loadedTexture = image.currentSrc || image.src;
      writeReceipt("TEXTURE_LOADED");
    });

    image.addEventListener("error", function onError() {
      advanceTextureFallback();
    });

    frame.appendChild(image);
    surface.appendChild(frame);
    mount.appendChild(surface);

    state.mount = mount;
    state.surface = surface;
    state.frame = frame;
    state.image = image;

    mount.dataset.instrumentMounted = "true";
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "layout-command-panel-zoom-wrapper";
    mount.dataset.instrumentBoundary = "real-image-render-only";
    mount.dataset.textureAuthority = "nasa-source-class";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;
    mount.dataset.visualPassClaimed = "false";

    setTextureForBody(state.body, true);
    return true;
  }

  function setTextureForBody(body, resetIndex) {
    if (!state.frame || !state.image) return;

    state.body = normalizeBody(body);

    if (resetIndex || state.image.dataset.body !== state.body) {
      state.image.dataset.textureIndex = "0";
    }

    state.frame.dataset.body = state.body;
    state.image.dataset.body = state.body;
    state.mount.dataset.activeBody = state.body;

    state.frame.style.setProperty("--dgb-body-zoom", String(state.zoom / 100));
    state.frame.style.setProperty("--dgb-body-rotation", `${state.rotation}deg`);
    state.frame.style.setProperty("--dgb-image-scale", state.body === "sun" ? "1.16" : "1");

    const textureIndex = Number(state.image.dataset.textureIndex || "0");
    const source = TEXTURES[state.body][textureIndex] || TEXTURES[state.body][0];

    if (state.image.src !== source) {
      state.image.src = source;
    }

    writeReceipt("TEXTURE_SELECTED");
  }

  function advanceTextureFallback() {
    if (!state.image) return;

    const current = Number(state.image.dataset.textureIndex || "0");
    const next = current + 1;
    const sources = TEXTURES[state.body] || [];

    if (next >= sources.length) {
      state.lastError = `TEXTURE_LOAD_FAILED:${state.body}`;
      writeReceipt("TEXTURE_LOAD_FAILED");
      return;
    }

    state.image.dataset.textureIndex = String(next);
    state.image.src = sources[next];
  }

  function step() {
    state.raf = 0;

    if (state.running) {
      const direction = state.direction === "reverse" ? -1 : 1;
      state.rotation = (state.rotation + direction * state.speedValue) % 360;

      if (state.frame) {
        state.frame.style.setProperty("--dgb-body-rotation", `${state.rotation}deg`);
      }

      state.raf = global.requestAnimationFrame(step);
    }

    writeReceipt("DRAWN");
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
      writeReceipt("DRAWN_PAUSED");
    }
  }

  function applyMotionToSurface() {
    if (state.frame) {
      state.frame.style.setProperty("--dgb-body-zoom", String(state.zoom / 100));
      state.frame.style.setProperty("--dgb-body-rotation", `${state.rotation}deg`);
      state.frame.style.setProperty("--dgb-image-scale", state.body === "sun" ? "1.16" : "1");
    }

    if (state.mount) {
      state.mount.dataset.activeBody = state.body;
      state.mount.dataset.instrumentBoundary = "real-image-render-only";
      state.mount.dataset.visualPassClaimed = "false";
    }
  }

  function writeReceipt(status) {
    state.lastReceipt = {
      ok: true,
      status: status || "READY",
      version: VERSION,
      route: ROUTE,
      instrumentBoundary: "real-image-render-only",
      sourceClass: "NASA_BLUE_MARBLE_SDO_LRO",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      loadedTexture: state.loadedTexture,
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
      state.mount.dataset.instrumentBoundary = "real-image-render-only";
      state.mount.dataset.textureAuthority = "real-source-imagery";
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
          instrumentBoundary: "real-image-render-only"
        };
      }

      setTextureForBody(state.body, false);
      applyMotionToSurface();
      startLoop();

      return writeReceipt("MOUNTED");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);

      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError,
        instrumentBoundary: "real-image-render-only"
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
      setTextureForBody(state.body, true);
      applyMotionToSurface();
      startLoop();
    }

    return writeReceipt("BODY_SELECTED");
  }

  function setMotion(options) {
    applyOptions(options);

    if (state.mount) {
      setTextureForBody(state.body, false);
      applyMotionToSurface();
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
    writeReceipt("PAUSED");
    return state.lastReceipt;
  }

  function reset() {
    state.running = true;
    state.direction = "forward";
    state.speedName = "normal";
    state.speedValue = speedValues.normal;
    state.zoom = 100;
    state.rotation = 0;

    if (state.mount) {
      applyMotionToSurface();
      startLoop();
    }

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

    applyMotionToSurface();
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
      instrumentBoundary: "real-image-render-only",
      sourceClass: "NASA_BLUE_MARBLE_SDO_LRO",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      mountPresent: Boolean(state.mount),
      imagePresent: Boolean(state.image),
      loadedTexture: state.loadedTexture,
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

      global.dispatchEvent(new CustomEvent("dgb:showroom:actual-bodies-real-image-renewed", {
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
  }
})(typeof window !== "undefined" ? window : globalThis);
