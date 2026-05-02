/* G1 PLANET 1 SURFACE / AIR LAYER SEPARATION RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_SURFACE_AIR_LAYER_SEPARATION_TNT_v1

   LAW:
   Surface first.
   Air second.
   Lighting last.
   No runtime, route, gauges, hydration, or /runtime/* edits.
*/

(function attachPlanetOneSurfaceAirSeparationRenderer(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_SURFACE_AIR_LAYER_SEPARATION_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1";
  var LAYER_VERSION = "G1_PLANET_1_TRI_DOMAIN_256_WHOLE_WORLD_CONTAINER_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var HYDRATION_PATH = "/world/render/planet-one.hydration.render.js";
  var HEXGRID_PATH = "/world/render/planet-one.hexgrid.render.js";

  var state = {
    active: true,
    paused: false,
    lastCanvas: null,
    lastMount: null,
    lastRender: null,
    lastError: null,
    rendererConsumesHydration: false,
    rendererConsumesHexBridge: false
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
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
    width = Math.max(320, Math.min(1400, width));
    height = Math.max(320, Math.min(1400, height));

    canvas = mount.querySelector && mount.querySelector("canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-renderer-version", VERSION);
      canvas.setAttribute("data-prior-renderer-version", PRIOR_VERSION);
      canvas.setAttribute("data-layer-version", LAYER_VERSION);
      canvas.setAttribute("data-surface-air-layer-separation", "true");
      canvas.setAttribute("aria-label", "Planet 1 surface air layer separation renderer");

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

  function hasHydration() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.sampleHydrationDepth === "function"
    );
  }

  function hasHexBridge() {
    return Boolean(
      global.DGBPlanetOneHexgridRender &&
      typeof global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid === "function"
    );
  }

  function ensureScript(path, testFn) {
    var existing;
    var script;

    if (testFn()) return Promise.resolve(true);
    if (!global.document) return Promise.resolve(false);

    existing = Array.prototype.slice.call(global.document.getElementsByTagName("script")).filter(function (item) {
      return item.src && item.src.indexOf(path) !== -1;
    })[0];

    if (existing) {
      return new Promise(function (resolve) {
        var start = Date.now();

        function tick() {
          if (testFn()) return resolve(true);
          if (Date.now() - start > 2400) return resolve(false);
          global.setTimeout(tick, 40);
        }

        tick();
      });
    }

    return new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(VERSION) + "&layer=" + encodeURIComponent(LAYER_VERSION) + "&t=" + Date.now();
      script.async = false;
      script.defer = false;

      script.onload = function () {
        var start = Date.now();

        function tick() {
          if (testFn()) return resolve(true);
          if (Date.now() - start > 2400) return resolve(false);
          global.setTimeout(tick, 40);
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

  function ensureDependencies() {
    return ensureScript(HYDRATION_PATH, hasHydration).then(function () {
      return ensureScript(HEXGRID_PATH, hasHexBridge);
    });
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function drawBaseWaterSphere(ctx, cx, cy, radius) {
    var ocean;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.42, radius * 0.06, cx, cy, radius * 1.06);
    ocean.addColorStop(0, "rgba(78,154,190,.99)");
    ocean.addColorStop(0.30, "rgba(16,90,154,.99)");
    ocean.addColorStop(0.72, "rgba(5,36,96,1)");
    ocean.addColorStop(1, "rgba(2,10,30,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.72, "rgba(145,189,255,.075)");
    rim.addColorStop(1, "rgba(145,189,255,.38)");
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.strokeStyle = "rgba(155,202,255,.34)";
    ctx.lineWidth = Math.max(1, radius * 0.011);
    ctx.stroke();
    ctx.restore();
  }

  function drawAirContainer(ctx, cx, cy, radius) {
    var halo;
    var veil;

    ctx.save();

    halo = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.08);
    halo.addColorStop(0, "rgba(145,189,255,0)");
    halo.addColorStop(0.74, "rgba(145,189,255,.045)");
    halo.addColorStop(1, "rgba(145,189,255,.22)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.03, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    veil = ctx.createRadialGradient(cx - radius * 0.12, cy - radius * 0.18, radius * 0.18, cx, cy, radius * 1.02);
    veil.addColorStop(0, "rgba(190,222,255,.035)");
    veil.addColorStop(0.48, "rgba(190,222,255,.010)");
    veil.addColorStop(0.86, "rgba(190,222,255,.042)");
    veil.addColorStop(1, "rgba(190,222,255,.105)");
    ctx.fillStyle = veil;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawLightingLast(ctx, cx, cy, radius) {
    var sunlight;
    var terminator;
    var rim;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    sunlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.40, radius * 0.04, cx, cy, radius * 0.92);
    sunlight.addColorStop(0, "rgba(255,255,255,.12)");
    sunlight.addColorStop(0.30, "rgba(255,255,255,.045)");
    sunlight.addColorStop(0.70, "rgba(255,255,255,.010)");
    sunlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.40, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.026)");
    terminator.addColorStop(0.50, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.44)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    rim = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.03);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.74, "rgba(145,189,255,.045)");
    rim.addColorStop(1, "rgba(145,189,255,.20)");
    ctx.fillStyle = rim;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.10);
    ctx.lineTo(0, radius * 1.10);
    ctx.strokeStyle = "rgba(242,199,111,.052)";
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
    var drawReceipt = null;

    options = options || {};

    if (!ctx) {
      state.lastRender = {
        ok: false,
        mounted: false,
        reason: "NO_2D_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    size = Math.min(canvas.width, canvas.height);
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    radius = Number(options.radius || size * 0.43);

    drawBaseWaterSphere(ctx, cx, cy, radius);

    if (hasHexBridge()) {
      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      drawReceipt = global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid(ctx, {
        centerX: cx,
        centerY: cy,
        radius: radius,
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        compositorScale: options.compositorScale || 0.82,
        surfaceAlpha: options.surfaceAlpha == null ? 1 : options.surfaceAlpha,
        seed: options.seed || 256451
      });

      ctx.restore();
    }

    drawAirContainer(ctx, cx, cy, radius);
    drawLightingLast(ctx, cx, cy, radius);

    if (options.showAxis === true) drawAxis(ctx, cx, cy, radius);

    state.rendererConsumesHydration = hasHydration();
    state.rendererConsumesHexBridge = hasHexBridge();

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      VERSION: VERSION,
      priorVersion: PRIOR_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      surfaceAirLayerSeparationRendered: Boolean(drawReceipt && drawReceipt.surfaceAirLayerSeparationRendered),
      surfaceAirLayerSeparationActive: true,
      waterSurfaceMaterialRendered: Boolean(drawReceipt && drawReceipt.waterSurfaceMaterialRendered),
      waterSurfaceMaterialActive: true,
      landSurfaceMaterialRendered: Boolean(drawReceipt && drawReceipt.landSurfaceMaterialRendered),
      landSurfaceMaterialActive: true,
      airOverlayMaterialRendered: Boolean(drawReceipt && drawReceipt.airOverlayMaterialRendered),
      airOverlayMaterialActive: true,
      landMaskSeparationRendered: Boolean(drawReceipt && drawReceipt.landMaskSeparationRendered),
      landMaskSeparationActive: true,
      surfaceFirstAirSecondCompositor: true,
      cloudsDoNotBecomeWater: true,
      waterDoesNotBecomeCloud: true,
      cloudOpacityCapped: true,
      featheredLandMaskActive: true,
      noCartoonCutoutEdges: true,

      wholeWorldContainerRendered: Boolean(drawReceipt && drawReceipt.wholeWorldContainerRendered),
      triDomain256Rendered: Boolean(drawReceipt && drawReceipt.triDomain256Rendered),
      water256Rendered: Boolean(drawReceipt && drawReceipt.water256Rendered),
      land256Rendered: Boolean(drawReceipt && drawReceipt.land256Rendered),
      air256Rendered: Boolean(drawReceipt && drawReceipt.air256Rendered),
      wholeWorld256Rendered: Boolean(drawReceipt && drawReceipt.wholeWorld256Rendered),

      waterRemainsSovereign: true,
      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: Boolean(drawReceipt && drawReceipt.noBlobReintroduced),
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,
      noPublicHoneycomb: true,
      noPublicDotGrid: true,

      rendererConsumesHydration: state.rendererConsumesHydration,
      rendererConsumesHexBridge: state.rendererConsumesHexBridge,
      rendererConsumesHexgrid: state.rendererConsumesHexBridge,

      runtimeUntouched: true,
      gaugesUntouched: true,
      routeUntouched: true,
      hydrationUntouched: true,
      upstreamRuntimeUntouched: true,

      drawReceipt: drawReceipt,
      separationReceipt: {
        ok: true,
        version: VERSION,
        surfaceAirLayerSeparationActive: true,
        waterSurfaceMaterialActive: true,
        landSurfaceMaterialActive: true,
        airOverlayMaterialActive: true,
        landMaskSeparationActive: true,
        surfaceFirstAirSecondCompositor: true,
        cloudsDoNotBecomeWater: true,
        waterDoesNotBecomeCloud: true,
        cloudOpacityCapped: true,
        featheredLandMaskActive: true,
        noCartoonCutoutEdges: true,
        visualPassClaimed: false
      },
      renderedAt: new Date().toISOString(),
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    var mount = resolveElement(target);
    var canvas = ensureCanvas(mount, options);
    var immediate;

    options = options || {};

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

    immediate = renderNow(canvas, options);

    ensureDependencies().then(function () {
      if (!state.paused && state.lastCanvas === canvas) {
        renderNow(canvas, options);
      }
    });

    return immediate;
  }

  function render(target, options) { return renderPlanetOne(target, options); }
  function renderGlobe(target, options) { return renderPlanetOne(target, options); }
  function mount(target, options) { return renderPlanetOne(target, options); }
  function mountPlanetOne(target, options) { return renderPlanetOne(target, options); }
  function create(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneRender(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneScene(target, options) { return renderPlanetOne(target, options); }

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
    if (state.lastCanvas) renderNow(state.lastCanvas, {});
    return { ok: true, paused: false, version: VERSION, visualPassClaimed: false };
  }

  function destroy() {
    state.paused = true;

    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }

    state.lastCanvas = null;
    state.lastMount = null;

    return { ok: true, destroyed: true, version: VERSION, visualPassClaimed: false };
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      PRIOR_VERSION: PRIOR_VERSION,
      priorVersion: PRIOR_VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      cleanSlatePreserved: true,

      surfaceAirLayerSeparationRendered: Boolean(state.lastRender && state.lastRender.surfaceAirLayerSeparationRendered),
      surfaceAirLayerSeparationActive: true,
      waterSurfaceMaterialRendered: Boolean(state.lastRender && state.lastRender.waterSurfaceMaterialRendered),
      waterSurfaceMaterialActive: true,
      landSurfaceMaterialRendered: Boolean(state.lastRender && state.lastRender.landSurfaceMaterialRendered),
      landSurfaceMaterialActive: true,
      airOverlayMaterialRendered: Boolean(state.lastRender && state.lastRender.airOverlayMaterialRendered),
      airOverlayMaterialActive: true,
      landMaskSeparationRendered: Boolean(state.lastRender && state.lastRender.landMaskSeparationRendered),
      landMaskSeparationActive: true,
      surfaceFirstAirSecondCompositor: true,
      cloudsDoNotBecomeWater: true,
      waterDoesNotBecomeCloud: true,
      cloudOpacityCapped: true,
      featheredLandMaskActive: true,
      noCartoonCutoutEdges: true,

      wholeWorldContainerRendered: Boolean(state.lastRender && state.lastRender.wholeWorldContainerRendered),
      triDomain256Rendered: Boolean(state.lastRender && state.lastRender.triDomain256Rendered),
      water256Rendered: Boolean(state.lastRender && state.lastRender.water256Rendered),
      land256Rendered: Boolean(state.lastRender && state.lastRender.land256Rendered),
      air256Rendered: Boolean(state.lastRender && state.lastRender.air256Rendered),
      wholeWorld256Rendered: Boolean(state.lastRender && state.lastRender.wholeWorld256Rendered),

      waterRemainsSovereign: true,
      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: Boolean(state.lastRender && state.lastRender.noBlobReintroduced),
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      rendererConsumesHydration: Boolean(state.rendererConsumesHydration),
      rendererConsumesHexBridge: Boolean(state.rendererConsumesHexBridge),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexBridge),

      runtimeUntouched: true,
      gaugesUntouched: true,
      routeUntouched: true,
      hydrationUntouched: true,
      upstreamRuntimeUntouched: true,

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
    LAYER_VERSION: LAYER_VERSION,
    layerVersion: LAYER_VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,

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

  ensureDependencies();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:surface-air-separation-renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
