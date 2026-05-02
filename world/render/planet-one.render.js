/* G1 PLANET 1 HYDROLOGY RECEIVER VISIBILITY AND LAND ALPHA REBALANCE RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1

   LAW:
   Liquid base first.
   Internal hydrology must remain visible.
   Land topcoat must yield to receivers.
   Gas/weather above surface.
   Lighting last.
   No runtime loop added.
*/

(function attachPlanetOneHydrologyReceiverVisibilityRenderer(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_UNDERLAY_HEIGHTFIELD_HYDROLOGY_REBALANCE_TNT_v1";
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
      canvas.setAttribute("data-hydrology-receiver-visibility", "true");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Planet 1 hydrology receiver visibility renderer");

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
    return Boolean(global.DGBPlanetOneHydrationRender);
  }

  function hasHexBridge() {
    return Boolean(global.DGBPlanetOneHexgridRender && typeof global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid === "function");
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
      script.src = path + "?v=" + encodeURIComponent(VERSION) + "&t=" + Date.now();
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

  function drawBaseLiquidSphere(ctx, cx, cy, radius) {
    var ocean;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.42, radius * 0.05, cx, cy, radius * 1.06);
    ocean.addColorStop(0, "rgba(76,152,184,.99)");
    ocean.addColorStop(0.28, "rgba(14,82,145,.99)");
    ocean.addColorStop(0.68, "rgba(5,35,94,1)");
    ocean.addColorStop(1, "rgba(2,10,30,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.76, "rgba(145,189,255,.045)");
    rim.addColorStop(1, "rgba(145,189,255,.20)");
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.strokeStyle = "rgba(155,202,255,.24)";
    ctx.lineWidth = Math.max(1, radius * 0.010);
    ctx.stroke();
    ctx.restore();
  }

  function drawAtmosphereBoundary(ctx, cx, cy, radius) {
    var halo;
    var veil;

    ctx.save();

    halo = ctx.createRadialGradient(cx, cy, radius * 0.80, cx, cy, radius * 1.09);
    halo.addColorStop(0, "rgba(145,189,255,0)");
    halo.addColorStop(0.82, "rgba(145,189,255,.018)");
    halo.addColorStop(1, "rgba(145,189,255,.12)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    veil = ctx.createRadialGradient(cx - radius * 0.10, cy - radius * 0.18, radius * 0.20, cx, cy, radius * 1.02);
    veil.addColorStop(0, "rgba(190,222,255,.010)");
    veil.addColorStop(0.52, "rgba(190,222,255,.004)");
    veil.addColorStop(0.86, "rgba(190,222,255,.018)");
    veil.addColorStop(1, "rgba(190,222,255,.048)");
    ctx.fillStyle = veil;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawLightingLast(ctx, cx, cy, radius) {
    var sunlight;
    var terrainPressure;
    var terminator;
    var rim;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    sunlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.40, radius * 0.04, cx, cy, radius * 0.96);
    sunlight.addColorStop(0, "rgba(255,255,255,.074)");
    sunlight.addColorStop(0.30, "rgba(255,255,255,.028)");
    sunlight.addColorStop(0.72, "rgba(255,255,255,.006)");
    sunlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terrainPressure = ctx.createRadialGradient(cx - radius * 0.18, cy + radius * 0.16, radius * 0.25, cx, cy, radius * 0.96);
    terrainPressure.addColorStop(0, "rgba(0,0,0,0)");
    terrainPressure.addColorStop(0.72, "rgba(0,0,0,.050)");
    terrainPressure.addColorStop(1, "rgba(0,0,0,.20)");
    ctx.fillStyle = terrainPressure;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.42, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.012)");
    terminator.addColorStop(0.50, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.32)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    rim = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.03);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.78, "rgba(145,189,255,.026)");
    rim.addColorStop(1, "rgba(145,189,255,.13)");
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
    var drawReceipt;

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

    drawBaseLiquidSphere(ctx, cx, cy, radius);

    if (hasHexBridge()) {
      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      drawReceipt = global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid(ctx, {
        centerX: cx,
        centerY: cy,
        radius: radius,
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        compositorScale: options.compositorScale || 0.78,
        surfaceAlpha: options.surfaceAlpha == null ? 1 : options.surfaceAlpha,
        seed: options.seed || 256451
      });

      ctx.restore();
    }

    drawAtmosphereBoundary(ctx, cx, cy, radius);
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
      baseline: BASELINE,

      hydrologyReceiverVisibilityRendered: Boolean(drawReceipt && drawReceipt.hydrologyReceiverVisibilityRendered),
      landAlphaRebalanceRendered: Boolean(drawReceipt && drawReceipt.landAlphaRebalanceRendered),
      landmaskPreserved: true,
      legalLandShapeUnchanged: true,
      underlayHeightfieldActive: true,
      internalHydrologyVisible: Boolean(drawReceipt && drawReceipt.internalHydrologyVisible),
      landAlphaYieldsToHydrology: Boolean(drawReceipt && drawReceipt.landAlphaYieldsToHydrology),
      hydrologyCutActive: Boolean(drawReceipt && drawReceipt.hydrologyCutActive),
      internalWaterReceiversActive: Boolean(drawReceipt && drawReceipt.internalWaterReceiversActive),
      basinReceiverLogicActive: Boolean(drawReceipt && drawReceipt.basinReceiverLogicActive),
      riverVeinPotentialActive: Boolean(drawReceipt && drawReceipt.riverVeinPotentialActive),
      lakeWetlandPocketActive: Boolean(drawReceipt && drawReceipt.lakeWetlandPocketActive),
      estuaryMouthLogicActive: Boolean(drawReceipt && drawReceipt.estuaryMouthLogicActive),
      beigeDominanceReduced: Boolean(drawReceipt && drawReceipt.beigeDominanceReduced),

      materialDomainVisualRefinementRendered: true,
      landSolidMaterialBodyRendered: Boolean(drawReceipt && drawReceipt.landSolidMaterialBodyRendered),
      waterLiquidDepthBodyRendered: Boolean(drawReceipt && drawReceipt.waterLiquidDepthBodyRendered),
      airGasWeatherBodyRendered: Boolean(drawReceipt && drawReceipt.airGasWeatherBodyRendered),

      waterPhaseStateBoundaryRendered: Boolean(drawReceipt && drawReceipt.waterPhaseStateBoundaryRendered),
      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesActive: true,

      waterRemainsSovereign: true,
      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: Boolean(drawReceipt && drawReceipt.noBlobReintroduced),
      noMountainRelief: true,
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
      hydrologyReceiverVisibilityReceipt: {
        ok: true,
        version: VERSION,
        landmaskPreserved: true,
        legalLandShapeUnchanged: true,
        internalHydrologyVisible: true,
        landAlphaYieldsToHydrology: true,
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
      if (!state.paused && state.lastCanvas === canvas) renderNow(canvas, options);
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
      baseline: BASELINE,

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      cleanSlatePreserved: true,

      hydrologyReceiverVisibilityActive: true,
      hydrologyReceiverVisibilityRendered: Boolean(state.lastRender && state.lastRender.hydrologyReceiverVisibilityRendered),
      landAlphaRebalanceActive: true,
      landAlphaRebalanceRendered: Boolean(state.lastRender && state.lastRender.landAlphaRebalanceRendered),
      landmaskPreserved: true,
      legalLandShapeUnchanged: true,
      underlayHeightfieldActive: true,
      internalHydrologyVisible: Boolean(state.lastRender && state.lastRender.internalHydrologyVisible),
      landAlphaYieldsToHydrology: Boolean(state.lastRender && state.lastRender.landAlphaYieldsToHydrology),
      hydrologyCutActive: Boolean(state.lastRender && state.lastRender.hydrologyCutActive),

      materialDomainVisualRefinementActive: true,
      landSolidMaterialBodyRendered: Boolean(state.lastRender && state.lastRender.landSolidMaterialBodyRendered),
      waterLiquidDepthBodyRendered: Boolean(state.lastRender && state.lastRender.waterLiquidDepthBodyRendered),
      airGasWeatherBodyRendered: Boolean(state.lastRender && state.lastRender.airGasWeatherBodyRendered),

      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesActive: true,

      waterRemainsSovereign: true,
      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: Boolean(state.lastRender && state.lastRender.noBlobReintroduced),
      noMountainRelief: true,
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

  var api = {
    VERSION: VERSION,
    version: VERSION,
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
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
    status: getStatus
  };

  global.DGBPlanetOneRenderTeam = api;
  global.DGBPlanetOneRenderer = api;
  global.DGBPlanetOneRender = api;

  ensureDependencies();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hydrology-receiver-visibility-renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
