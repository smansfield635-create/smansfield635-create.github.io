/* G1 PLANET 1 RENDERER HEXGRID CONSUMPTION
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_RENDERER_HEXGRID_CONSUMPTION_TNT_v1

   PURPOSE:
   - Preserve renderer as the public composition facade.
   - Consume /world/render/planet-one.hexgrid.render.js.
   - Keep land constructs, surface materials, terrain, and hydration as detected support modules.
   - Do not claim visual pass.
   - Move Planet 1 from painted-only composition toward hex-cell terrain substrate composition.
*/

(function attachPlanetOneRendererFacade(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_RENDERER_HEXGRID_CONSUMPTION_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var HEXGRID_PATH = "/world/render/planet-one.hexgrid.render.js";

  var CONTRACT_MARKERS = [
    VERSION,
    BASELINE,
    "RENDERER_FACADE_ACTIVE",
    "RESPONSIBILITY_SPLIT_ACTIVE",
    "HEXGRID_CONSUMPTION_ACTIVE",
    "HEXAGONAL_PIXEL_FORMAT_CONSUMED",
    "HEX_CELL_SUBSTRATE_CONSUMED",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    paused: false,
    animationFrame: null,
    lastCanvas: null,
    lastMount: null,
    lastRender: null,
    lastError: null,
    hexgridLoadAttempted: false,
    hexgridLoadComplete: false,
    hexgridLoadFailed: false,
    rendererConsumesHexgrid: false
  };

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return fallback;
    }
  }

  function resolveElement(target) {
    if (!target && global.document) {
      return global.document.getElementById("planet-one-render") ||
        global.document.querySelector("[data-planet-one-mount='true']") ||
        global.document.querySelector(".planet-one-render") ||
        global.document.body;
    }

    if (typeof target === "string" && global.document) {
      return global.document.querySelector(target);
    }

    return target || null;
  }

  function ensureCanvas(mount, options) {
    var canvas;
    var width;
    var height;

    options = options || {};
    mount = resolveElement(mount);

    if (!mount || !global.document) return null;

    width = Number(options.width || options.size || mount.clientWidth || 720);
    height = Number(options.height || options.size || mount.clientHeight || width || 720);

    width = Math.max(320, Math.min(1200, width));
    height = Math.max(320, Math.min(1200, height));

    canvas = mount.querySelector && mount.querySelector("canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-renderer-version", VERSION);
      canvas.setAttribute("aria-label", "Planet 1 Generation 1 hex substrate renderer");

      if (options.clearMount !== false) {
        mount.innerHTML = "";
      }

      mount.appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.maxWidth = width + "px";
    canvas.style.aspectRatio = width + " / " + height;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    state.lastCanvas = canvas;
    state.lastMount = mount;

    return canvas;
  }

  function hasHexgrid() {
    return Boolean(
      global.DGBPlanetOneHexgridRender &&
      typeof global.DGBPlanetOneHexgridRender.createPlanetOneHexGrid === "function" &&
      typeof global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid === "function" &&
      (
        typeof global.DGBPlanetOneHexgridRender.getHexgridStatus === "function" ||
        typeof global.DGBPlanetOneHexgridRender.status === "function"
      )
    );
  }

  function getHexgridStatus() {
    if (!hasHexgrid()) return null;

    return safeCall(function () {
      if (typeof global.DGBPlanetOneHexgridRender.getHexgridStatus === "function") {
        return global.DGBPlanetOneHexgridRender.getHexgridStatus();
      }

      return global.DGBPlanetOneHexgridRender.status();
    }, null);
  }

  function ensureHexgridScript() {
    var existing;
    var script;

    if (hasHexgrid()) {
      state.hexgridLoadComplete = true;
      state.rendererConsumesHexgrid = true;
      return Promise.resolve(true);
    }

    if (!global.document) return Promise.resolve(false);

    existing = Array.prototype.slice.call(global.document.getElementsByTagName("script")).filter(function (item) {
      return item.src && item.src.indexOf(HEXGRID_PATH) !== -1;
    })[0];

    state.hexgridLoadAttempted = true;

    if (existing) {
      return waitForHexgrid(1800);
    }

    return new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = HEXGRID_PATH + "?renderer_consume=" + encodeURIComponent(VERSION) + "&t=" + Date.now();
      script.async = false;
      script.defer = false;
      script.dataset.planetOneHexgridRequiredByRenderer = VERSION;

      script.onload = function () {
        waitForHexgrid(1800).then(resolve);
      };

      script.onerror = function () {
        state.hexgridLoadFailed = true;
        state.lastError = "HEXGRID_SCRIPT_LOAD_FAILED";
        resolve(false);
      };

      (global.document.head || global.document.body || global.document.documentElement).appendChild(script);
    });
  }

  function waitForHexgrid(timeoutMs) {
    var start = Date.now();

    return new Promise(function (resolve) {
      function tick() {
        if (hasHexgrid()) {
          state.hexgridLoadComplete = true;
          state.rendererConsumesHexgrid = true;
          resolve(true);
          return;
        }

        if (Date.now() - start > timeoutMs) {
          state.hexgridLoadFailed = true;
          resolve(false);
          return;
        }

        global.setTimeout(tick, 45);
      }

      tick();
    });
  }

  function moduleDetected(name) {
    return Boolean(global[name]);
  }

  function drawBaseSphere(ctx, cx, cy, radius) {
    var ocean;
    var shade;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.42, radius * 0.08, cx, cy, radius * 1.08);
    ocean.addColorStop(0, "rgba(76,126,156,.96)");
    ocean.addColorStop(0.36, "rgba(30,74,111,.98)");
    ocean.addColorStop(0.72, "rgba(10,31,62,.99)");
    ocean.addColorStop(1, "rgba(2,8,24,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255,255,255,.12)");
    shade.addColorStop(0.42, "rgba(255,255,255,.02)");
    shade.addColorStop(0.72, "rgba(0,0,0,.18)");
    shade.addColorStop(1, "rgba(0,0,0,.42)");
    ctx.fillStyle = shade;
    ctx.fill();

    ctx.restore();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.72, "rgba(145,189,255,.06)");
    rim.addColorStop(1, "rgba(145,189,255,.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.015, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(145,189,255,.34)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();
    ctx.fillStyle = rim;
    ctx.fill();
    ctx.restore();
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.38, radius * 0.15, cx, cy, radius * 1.12);

    glow.addColorStop(0, "rgba(255,255,255,.13)");
    glow.addColorStop(0.38, "rgba(145,189,255,.04)");
    glow.addColorStop(0.82, "rgba(9,20,48,.04)");
    glow.addColorStop(1, "rgba(0,0,0,.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.strokeStyle = "rgba(242,199,111,.18)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.12);
    ctx.lineTo(0, radius * 1.12);
    ctx.strokeStyle = "rgba(242,199,111,.28)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function drawFallbackLandHint(ctx, cx, cy, radius) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);
    ctx.globalAlpha = 0.36;
    ctx.fillStyle = "rgba(112,96,65,.68)";

    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.22, cy + radius * 0.02, radius * 0.34, radius * 0.52, -0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.18, cy - radius * 0.02, radius * 0.38, radius * 0.45, 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.02, cy - radius * 0.72, radius * 0.58, radius * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(226,238,245,.56)";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.73, radius * 0.58, radius * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderNow(canvas, options) {
    var ctx;
    var size;
    var cx;
    var cy;
    var radius;
    var hexgrid;
    var grid;
    var hexStatus;
    var drewHexgrid = false;

    options = options || {};
    ctx = canvas.getContext("2d");

    if (!ctx) {
      return {
        ok: false,
        mounted: false,
        reason: "NO_2D_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
    }

    size = Math.min(canvas.width, canvas.height);
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    radius = Number(options.radius || size * 0.43);

    drawBaseSphere(ctx, cx, cy, radius);

    if (hasHexgrid()) {
      hexgrid = global.DGBPlanetOneHexgridRender;
      hexStatus = getHexgridStatus();

      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      grid = hexgrid.createPlanetOneHexGrid({
        width: canvas.width,
        height: canvas.height,
        centerX: cx,
        centerY: cy,
        radius: radius,
        hexSize: options.hexSize || Math.max(4.5, radius / 34),
        seed: options.seed || 256451
      });

      hexgrid.drawPlanetOneHexGrid(ctx, grid, {
        alpha: options.hexAlpha == null ? 0.84 : options.hexAlpha,
        stroke: options.hexStroke !== false
      });

      ctx.restore();

      drewHexgrid = true;
      state.rendererConsumesHexgrid = true;
    } else {
      drawFallbackLandHint(ctx, cx, cy, radius);
      state.rendererConsumesHexgrid = false;
    }

    drawAtmosphere(ctx, cx, cy, radius);

    if (options.showAxis !== false) {
      drawAxis(ctx, cx, cy, radius);
    }

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      radius: radius,
      hexgridDetected: hasHexgrid(),
      hexgridSubstrateDetected: hasHexgrid(),
      hexCellSubstrateActive: Boolean(hexStatus && hexStatus.hexCellSubstrateActive),
      hexagonalPixelFormatActive: Boolean(hexStatus && hexStatus.hexagonalPixelFormatActive),
      rendererConsumesHexgrid: drewHexgrid,
      landConstructsModuleDetected: moduleDetected("DGBPlanetOneLandConstructs"),
      surfaceMaterialsModuleDetected: moduleDetected("DGBPlanetOneSurfaceMaterials"),
      terrainModuleDetected: moduleDetected("DGBPlanetOneTerrainRender"),
      hydrationModuleDetected: moduleDetected("DGBPlanetOneHydrationRender"),
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    var mount = resolveElement(target);
    var canvas = ensureCanvas(mount, options);
    var immediate;

    if (!canvas) {
      state.lastRender = {
        ok: false,
        mounted: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };

      return state.lastRender;
    }

    immediate = renderNow(canvas, options || {});

    ensureHexgridScript().then(function (loaded) {
      if (loaded && !state.paused && state.lastCanvas === canvas) {
        renderNow(canvas, options || {});
      }
    });

    return immediate;
  }

  function render(target, options) {
    return renderPlanetOne(target, options);
  }

  function mount(target, options) {
    return renderPlanetOne(target, options);
  }

  function renderGlobe(target, options) {
    return renderPlanetOne(target, options);
  }

  function mountPlanetOne(target, options) {
    return renderPlanetOne(target, options);
  }

  function createPlanetOneRender(target, options) {
    return renderPlanetOne(target, options);
  }

  function createPlanetOneScene(target, options) {
    return renderPlanetOne(target, options);
  }

  function create(target, options) {
    return renderPlanetOne(target, options);
  }

  function start(target, options) {
    state.paused = false;
    return renderPlanetOne(target || state.lastMount, options || {});
  }

  function pause() {
    state.paused = true;

    if (state.animationFrame && global.cancelAnimationFrame) {
      global.cancelAnimationFrame(state.animationFrame);
    }

    state.animationFrame = null;

    return {
      ok: true,
      paused: true,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function resume() {
    state.paused = false;

    if (state.lastCanvas) {
      renderNow(state.lastCanvas, {});
    }

    return {
      ok: true,
      paused: false,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function destroy() {
    pause();

    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }

    state.lastCanvas = null;
    state.lastMount = null;

    return {
      ok: true,
      destroyed: true,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    var hexStatus = getHexgridStatus();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      activeCanvas: Boolean(state.lastCanvas),
      mountComplete: Boolean(state.lastCanvas && state.lastMount),
      hexgridDetected: hasHexgrid(),
      hexGridDetected: hasHexgrid(),
      hexgridSubstrateDetected: hasHexgrid(),
      hexCellSubstrateActive: Boolean(hexStatus && hexStatus.hexCellSubstrateActive),
      hexagonalPixelFormatActive: Boolean(hexStatus && hexStatus.hexagonalPixelFormatActive),
      terrainCellSamplingActive: Boolean(hexStatus && hexStatus.terrainCellSamplingActive),
      coastCellQuantizationActive: Boolean(hexStatus && hexStatus.coastCellQuantizationActive),
      elevationCellFieldActive: Boolean(hexStatus && hexStatus.elevationCellFieldActive),
      waterDepthCellFieldActive: Boolean(hexStatus && hexStatus.waterDepthCellFieldActive),
      mineralPressureCellFieldActive: Boolean(hexStatus && hexStatus.mineralPressureCellFieldActive),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexgrid && hasHexgrid()),
      landConstructsModuleDetected: moduleDetected("DGBPlanetOneLandConstructs"),
      surfaceMaterialsModuleDetected: moduleDetected("DGBPlanetOneSurfaceMaterials"),
      terrainModuleDetected: moduleDetected("DGBPlanetOneTerrainRender"),
      hydrationModuleDetected: moduleDetected("DGBPlanetOneHydrationRender"),
      hexgridLoadAttempted: state.hexgridLoadAttempted,
      hexgridLoadComplete: state.hexgridLoadComplete,
      hexgridLoadFailed: state.hexgridLoadFailed,
      lastRender: state.lastRender,
      lastError: state.lastError,
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    CONTRACT_MARKERS: CONTRACT_MARKERS,
    renderPlanetOne: renderPlanetOne,
    render: render,
    renderGlobe: renderGlobe,
    mount: mount,
    mountPlanetOne: mountPlanetOne,
    create: create,
    createPlanetOneRender: createPlanetOneRender,
    createPlanetOneScene: createPlanetOneScene,
    start: start,
    pause: pause,
    resume: resume,
    destroy: destroy,
    getStatus: getStatus,
    status: status
  };

  global.DGBPlanetOneRenderTeam = api;
  global.DGBPlanetOneRenderer = api;
  global.DGBPlanetOneRender = api;

  ensureHexgridScript();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {
    /* Event dispatch is optional. The global renderer contract remains available. */
  }
})(typeof window !== "undefined" ? window : globalThis);
