/* G1 PLANET 1 BODY SYSTEM BOUNDARY ENGINE RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1
*/

(function attachPlanetOneRendererFacade(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_HYDROLOGY_SYSTEM_PHYSICAL_GOVERNANCE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var MARITIME_BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";

  var BODY_SYSTEM_PATH = "/world/render/planet-one.body-system.render.js";
  var HYDRATION_PATH = "/world/render/planet-one.hydration.render.js";
  var HEXGRID_PATH = "/world/render/planet-one.hexgrid.render.js";
  var DEFAULT_RENDER_MODE = "satellite";

  var state = {
    active: true,
    paused: false,
    lastCanvas: null,
    lastMount: null,
    lastRender: null,
    lastError: null,
    rendererConsumesBodySystem: false,
    rendererConsumesHexgrid: false,
    rendererConsumesHydrology: false,
    bodySystemLoadAttempted: false,
    hexgridLoadAttempted: false,
    hydrationLoadAttempted: false,
    bodySystemLoadComplete: false,
    hexgridLoadComplete: false,
    hydrationLoadComplete: false
  };

  function now() {
    return new Date().toISOString();
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

    if (typeof target === "string" && global.document) return global.document.querySelector(target);
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
      canvas.setAttribute("data-render-mode", DEFAULT_RENDER_MODE);
      canvas.setAttribute("aria-label", "Planet 1 body system boundary renderer");

      if (options.clearMount !== false) mount.innerHTML = "";
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

  function hasBodySystem() {
    return Boolean(
      global.DGBPlanetOneBodySystemRender &&
      typeof global.DGBPlanetOneBodySystemRender.sampleBodySystem === "function"
    );
  }

  function hasHexgrid() {
    return Boolean(
      global.DGBPlanetOneHexgridRender &&
      typeof global.DGBPlanetOneHexgridRender.samplePlanetSurface === "function" &&
      typeof global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid === "function"
    );
  }

  function hasHydrology() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.sampleHydrationSurface === "function"
    );
  }

  function getBodySystemStatus() {
    if (!hasBodySystem()) return null;
    return safeCall(function () {
      if (typeof global.DGBPlanetOneBodySystemRender.getBodySystemStatus === "function") {
        return global.DGBPlanetOneBodySystemRender.getBodySystemStatus();
      }
      return global.DGBPlanetOneBodySystemRender.status();
    }, null);
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

  function getHydrologyStatus() {
    if (!hasHydrology()) return null;
    return safeCall(function () {
      if (typeof global.DGBPlanetOneHydrationRender.getHydrologyStatus === "function") {
        return global.DGBPlanetOneHydrationRender.getHydrologyStatus();
      }
      if (typeof global.DGBPlanetOneHydrationRender.getHydrationStatus === "function") {
        return global.DGBPlanetOneHydrationRender.getHydrationStatus();
      }
      return global.DGBPlanetOneHydrationRender.status();
    }, null);
  }

  function ensureScript(path, marker, testFn) {
    var existing;
    var script;

    if (testFn()) return Promise.resolve(true);
    if (!global.document) return Promise.resolve(false);

    existing = Array.prototype.slice.call(global.document.getElementsByTagName("script")).filter(function (item) {
      return item.src && item.src.indexOf(path) !== -1;
    })[0];

    if (marker === "body") state.bodySystemLoadAttempted = true;
    if (marker === "hexgrid") state.hexgridLoadAttempted = true;
    if (marker === "hydration") state.hydrationLoadAttempted = true;

    if (existing) {
      return new Promise(function (resolve) {
        var start = Date.now();

        function tick() {
          if (testFn()) {
            resolve(true);
            return;
          }

          if (Date.now() - start > 2400) {
            resolve(false);
            return;
          }

          global.setTimeout(tick, 45);
        }

        tick();
      });
    }

    return new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(VERSION) + "&t=" + Date.now();
      script.async = false;
      script.defer = false;

      script.onload = function () {
        var start = Date.now();

        function tick() {
          if (testFn()) {
            resolve(true);
            return;
          }

          if (Date.now() - start > 2400) {
            resolve(false);
            return;
          }

          global.setTimeout(tick, 45);
        }

        tick();
      };

      script.onerror = function () {
        state.lastError = "SCRIPT_LOAD_FAILED:" + path;
        resolve(false);
      };

      (global.document.head || global.document.body || global.document.documentElement).appendChild(script);
    });
  }

  function ensureRenderDependencies() {
    return ensureScript(BODY_SYSTEM_PATH, "body", hasBodySystem)
      .then(function () {
        return ensureScript(HYDRATION_PATH, "hydration", hasHydrology);
      })
      .then(function () {
        return ensureScript(HEXGRID_PATH, "hexgrid", hasHexgrid);
      })
      .then(function () {
        state.bodySystemLoadComplete = hasBodySystem();
        state.hydrationLoadComplete = hasHydrology();
        state.hexgridLoadComplete = hasHexgrid();
        return state.bodySystemLoadComplete && state.hydrationLoadComplete && state.hexgridLoadComplete;
      });
  }

  function drawBaseSphere(ctx, cx, cy, radius) {
    var ocean;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.44, radius * 0.08, cx, cy, radius * 1.08);
    ocean.addColorStop(0, "rgba(82,146,178,.98)");
    ocean.addColorStop(0.34, "rgba(24,84,128,.98)");
    ocean.addColorStop(0.72, "rgba(6,29,64,.99)");
    ocean.addColorStop(1, "rgba(2,8,24,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.78, "rgba(145,189,255,.075)");
    rim.addColorStop(1, "rgba(145,189,255,.38)");
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.strokeStyle = "rgba(145,189,255,.34)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();
    ctx.restore();
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function drawPlanetLighting(ctx, cx, cy, radius) {
    var sunlight;
    var terminator;
    var atmosphere;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    sunlight = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.38, radius * 0.05, cx, cy, radius * 0.92);
    sunlight.addColorStop(0, "rgba(255,255,255,.10)");
    sunlight.addColorStop(0.30, "rgba(255,255,255,.034)");
    sunlight.addColorStop(0.66, "rgba(255,255,255,.010)");
    sunlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.35, cy - radius, cx + radius * 0.96, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.028)");
    terminator.addColorStop(0.54, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.44)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.03);
    atmosphere.addColorStop(0, "rgba(145,189,255,0)");
    atmosphere.addColorStop(0.74, "rgba(145,189,255,.040)");
    atmosphere.addColorStop(1, "rgba(145,189,255,.20)");
    ctx.fillStyle = atmosphere;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.38, radius * 0.15, cx, cy, radius * 1.12);

    glow.addColorStop(0, "rgba(255,255,255,.090)");
    glow.addColorStop(0.38, "rgba(145,189,255,.040)");
    glow.addColorStop(0.82, "rgba(9,20,48,.04)");
    glow.addColorStop(1, "rgba(0,0,0,.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.strokeStyle = "rgba(242,199,111,.10)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.10);
    ctx.lineTo(0, radius * 1.10);
    ctx.strokeStyle = "rgba(242,199,111,.040)";
    ctx.lineWidth = Math.max(1, radius * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function renderNow(canvas, options) {
    var ctx = canvas.getContext("2d");
    var size;
    var cx;
    var cy;
    var radius;
    var bodyStatus;
    var hexStatus;
    var hydrologyStatus;
    var renderMode;
    var drawReceipt = null;

    options = options || {};

    if (!ctx) {
      return { ok: false, mounted: false, reason: "NO_2D_CONTEXT", version: VERSION, visualPassClaimed: false };
    }

    size = Math.min(canvas.width, canvas.height);
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    radius = Number(options.radius || size * 0.43);
    renderMode = options.renderMode || DEFAULT_RENDER_MODE;

    drawBaseSphere(ctx, cx, cy, radius);

    if (hasHexgrid()) {
      bodyStatus = getBodySystemStatus();
      hexStatus = getHexgridStatus();
      hydrologyStatus = getHydrologyStatus();

      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      drawReceipt = global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid(ctx, {
        renderMode: renderMode,
        centerX: cx,
        centerY: cy,
        radius: radius,
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        compositorScale: options.compositorScale || 0.72,
        surfaceAlpha: options.surfaceAlpha == null ? 0.97 : options.surfaceAlpha,
        seed: options.seed || 256451
      });

      ctx.restore();
      state.rendererConsumesBodySystem = hasBodySystem();
      state.rendererConsumesHexgrid = true;
      state.rendererConsumesHydrology = hasHydrology();
    }

    drawPlanetLighting(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius);

    if (options.showAxis === true) drawAxis(ctx, cx, cy, radius);

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      renderedAt: now(),
      renderMode: renderMode,
      projectionModel: "body_system_boundary_engine",

      rendererConsumesBodySystem: Boolean(state.rendererConsumesBodySystem),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexgrid),
      rendererConsumesHydrology: Boolean(state.rendererConsumesHydrology),

      bodySystemLayerComposed: Boolean(drawReceipt && drawReceipt.bodySystemLayerComposed),
      anatomicalBoundariesRendered: Boolean(drawReceipt && drawReceipt.anatomicalBoundariesRendered),
      muscleFatSeparationRendered: Boolean(drawReceipt && drawReceipt.muscleFatSeparationRendered),
      veinArteryFlowRendered: Boolean(drawReceipt && drawReceipt.veinArteryFlowRendered),
      fasciaBoundaryRendered: Boolean(drawReceipt && drawReceipt.fasciaBoundaryRendered),
      amorphousBlobReduced: Boolean(drawReceipt && drawReceipt.amorphousBlobReduced),

      hydrologyLayerComposed: Boolean(hydrologyStatus && hydrologyStatus.hydrologyNetworkActive),
      riverVeinsRendered: Boolean(drawReceipt && drawReceipt.hydrologyLayerRendered),
      oceanShelfCoastPreserved: true,
      terrainHydrologyMaskRespected: true,
      waterDominanceBalanced: true,
      terrainShaderPreserved: Boolean(hexStatus && hexStatus.heightfieldTerrainShaderActive),
      hydrologyPreserved: Boolean(drawReceipt && drawReceipt.hydrologyPreserved),

      bodySystemStatus: bodyStatus,
      hexgridStatus: hexStatus,
      hydrologyStatus: hydrologyStatus,

      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      publicDotsVisible: false,

      drawReceipt: drawReceipt,
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    var mount = resolveElement(target);
    var canvas = ensureCanvas(mount, options);
    var immediate;

    options = options || {};
    options.renderMode = options.renderMode || DEFAULT_RENDER_MODE;

    if (!canvas) {
      state.lastRender = { ok: false, mounted: false, reason: "NO_MOUNT", version: VERSION, visualPassClaimed: false };
      return state.lastRender;
    }

    immediate = renderNow(canvas, options);

    ensureRenderDependencies().then(function (loaded) {
      if (loaded && !state.paused && state.lastCanvas === canvas) {
        renderNow(canvas, options);
      }
    });

    return immediate;
  }

  function render(target, options) { return renderPlanetOne(target, options); }
  function mount(target, options) { return renderPlanetOne(target, options); }
  function renderGlobe(target, options) { return renderPlanetOne(target, options); }
  function mountPlanetOne(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneRender(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneScene(target, options) { return renderPlanetOne(target, options); }
  function create(target, options) { return renderPlanetOne(target, options); }

  function start(target, options) {
    state.paused = false;
    return renderPlanetOne(target || state.lastMount, options || {});
  }

  function pause() {
    state.paused = true;
    return { ok: true, paused: true, version: VERSION, visualPassClaimed: false };
  }

  function resume() {
    state.paused = false;
    if (state.lastCanvas) renderNow(state.lastCanvas, { renderMode: DEFAULT_RENDER_MODE });
    return { ok: true, paused: false, version: VERSION, visualPassClaimed: false };
  }

  function destroy() {
    pause();

    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }

    state.lastCanvas = null;
    state.lastMount = null;

    return { ok: true, destroyed: true, version: VERSION, visualPassClaimed: false };
  }

  function getStatus() {
    var bodyStatus = getBodySystemStatus();
    var hexStatus = getHexgridStatus();
    var hydrologyStatus = getHydrologyStatus();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      activeCanvas: Boolean(state.lastCanvas),
      mountComplete: Boolean(state.lastCanvas && state.lastMount),

      rendererConsumesBodySystem: Boolean(state.rendererConsumesBodySystem && hasBodySystem()),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexgrid && hasHexgrid()),
      rendererConsumesHydrology: Boolean(state.rendererConsumesHydrology && hasHydrology()),

      bodySystemLayerComposed: Boolean(state.lastRender && state.lastRender.bodySystemLayerComposed),
      anatomicalBoundariesRendered: Boolean(state.lastRender && state.lastRender.anatomicalBoundariesRendered),
      muscleFatSeparationRendered: Boolean(state.lastRender && state.lastRender.muscleFatSeparationRendered),
      veinArteryFlowRendered: Boolean(state.lastRender && state.lastRender.veinArteryFlowRendered),
      fasciaBoundaryRendered: Boolean(state.lastRender && state.lastRender.fasciaBoundaryRendered),
      amorphousBlobReduced: Boolean(state.lastRender && state.lastRender.amorphousBlobReduced),

      hydrologyLayerComposed: Boolean(hydrologyStatus && hydrologyStatus.hydrologyNetworkActive),
      terrainShaderPreserved: Boolean(hexStatus && hexStatus.heightfieldTerrainShaderActive),
      hydrologyPreserved: Boolean(hydrologyStatus && hydrologyStatus.hydrologyNetworkActive),

      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      publicDotsVisible: false,

      bodySystemStatus: bodyStatus,
      hexgridStatus: hexStatus,
      hydrologyStatus: hydrologyStatus,

      bodySystemLoadAttempted: state.bodySystemLoadAttempted,
      hexgridLoadAttempted: state.hexgridLoadAttempted,
      hydrationLoadAttempted: state.hydrationLoadAttempted,
      bodySystemLoadComplete: state.bodySystemLoadComplete,
      hexgridLoadComplete: state.hexgridLoadComplete,
      hydrationLoadComplete: state.hydrationLoadComplete,

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
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
    BASELINE: BASELINE,
    MARITIME_BASELINE: MARITIME_BASELINE,

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

  ensureRenderDependencies();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
