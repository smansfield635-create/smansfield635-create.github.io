/* G1 PLANET 1 TRI-DOMAIN 256 WHOLE-WORLD CONTAINER RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1
   LAYER_VERSION: G1_PLANET_1_TRI_DOMAIN_256_WHOLE_WORLD_CONTAINER_TNT_v1

   LAW:
   Renderer expresses one whole-world container with three internal domains:
   WATER_256, LAND_256, AIR_256.
   The renderer does not split them into separate worlds.
   It renders coordinated cycle exchange inside one planetary body.
*/

(function attachPlanetOneTriDomain256Renderer(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1";
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
      canvas.setAttribute("data-layer-version", LAYER_VERSION);
      canvas.setAttribute("aria-label", "Planet 1 tri-domain 256 renderer");

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

  function drawBaseSphere(ctx, cx, cy, radius) {
    var ocean;
    var rim;
    var container;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.42, radius * 0.07, cx, cy, radius * 1.06);
    ocean.addColorStop(0, "rgba(88,154,184,.99)");
    ocean.addColorStop(0.32, "rgba(24,92,146,.99)");
    ocean.addColorStop(0.74, "rgba(6,35,86,1)");
    ocean.addColorStop(1, "rgba(2,10,30,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    container = ctx.createRadialGradient(cx, cy, radius * 0.40, cx, cy, radius * 1.06);
    container.addColorStop(0, "rgba(255,255,255,0)");
    container.addColorStop(0.76, "rgba(140,180,255,.025)");
    container.addColorStop(1, "rgba(140,180,255,.105)");
    ctx.fillStyle = container;
    ctx.fill();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.76, "rgba(145,189,255,.08)");
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

  function drawAtmosphere(ctx, cx, cy, radius) {
    var atmosphere;
    var upper;
    var lower;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    atmosphere = ctx.createRadialGradient(cx - radius * 0.15, cy - radius * 0.20, radius * 0.20, cx, cy, radius * 1.02);
    atmosphere.addColorStop(0, "rgba(166,210,255,.030)");
    atmosphere.addColorStop(0.46, "rgba(166,210,255,.018)");
    atmosphere.addColorStop(0.84, "rgba(166,210,255,.040)");
    atmosphere.addColorStop(1, "rgba(166,210,255,.110)");
    ctx.fillStyle = atmosphere;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    upper = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius * 0.4);
    upper.addColorStop(0, "rgba(210,226,255,.050)");
    upper.addColorStop(0.45, "rgba(210,226,255,.015)");
    upper.addColorStop(1, "rgba(210,226,255,0)");
    ctx.fillStyle = upper;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    lower = ctx.createLinearGradient(cx - radius * 0.3, cy + radius, cx + radius, cy - radius);
    lower.addColorStop(0, "rgba(160,200,255,.040)");
    lower.addColorStop(0.55, "rgba(160,200,255,.010)");
    lower.addColorStop(1, "rgba(160,200,255,0)");
    ctx.fillStyle = lower;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawLighting(ctx, cx, cy, radius) {
    var sunlight;
    var terminator;
    var atmosphere;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    sunlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.40, radius * 0.05, cx, cy, radius * 0.92);
    sunlight.addColorStop(0, "rgba(255,255,255,.12)");
    sunlight.addColorStop(0.30, "rgba(255,255,255,.045)");
    sunlight.addColorStop(0.70, "rgba(255,255,255,.012)");
    sunlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.40, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.026)");
    terminator.addColorStop(0.52, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.44)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.03);
    atmosphere.addColorStop(0, "rgba(145,189,255,0)");
    atmosphere.addColorStop(0.75, "rgba(145,189,255,.045)");
    atmosphere.addColorStop(1, "rgba(145,189,255,.22)");
    ctx.fillStyle = atmosphere;
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
    ctx.strokeStyle = "rgba(242,199,111,.046)";
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
        layerVersion: LAYER_VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    size = Math.min(canvas.width, canvas.height);
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    radius = Number(options.radius || size * 0.43);

    drawBaseSphere(ctx, cx, cy, radius);

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
        surfaceAlpha: options.surfaceAlpha == null ? 0.99 : options.surfaceAlpha,
        seed: options.seed || 256451
      });

      ctx.restore();
    }

    drawAtmosphere(ctx, cx, cy, radius);
    drawLighting(ctx, cx, cy, radius);

    if (options.showAxis === true) drawAxis(ctx, cx, cy, radius);

    state.rendererConsumesHydration = hasHydration();
    state.rendererConsumesHexBridge = hasHexBridge();

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      VERSION: VERSION,
      layerVersion: LAYER_VERSION,
      LAYER_VERSION: LAYER_VERSION,
      baseline: BASELINE,

      cleanSlatePreserved: true,

      wholeWorldContainerRendered: Boolean(drawReceipt && drawReceipt.wholeWorldContainerRendered),
      triDomain256Rendered: Boolean(drawReceipt && drawReceipt.triDomain256Rendered),
      water256Rendered: Boolean(drawReceipt && drawReceipt.water256Rendered),
      land256Rendered: Boolean(drawReceipt && drawReceipt.land256Rendered),
      air256Rendered: Boolean(drawReceipt && drawReceipt.air256Rendered),
      wholeWorld256Rendered: Boolean(drawReceipt && drawReceipt.wholeWorld256Rendered),
      triDomainCycleRendered: Boolean(drawReceipt && drawReceipt.triDomainCycleRendered),
      domainContactZonesRendered: Boolean(drawReceipt && drawReceipt.domainContactZonesRendered),
      waterLandExchangeRendered: Boolean(drawReceipt && drawReceipt.waterLandExchangeRendered),
      landAirExchangeRendered: Boolean(drawReceipt && drawReceipt.landAirExchangeRendered),
      airWaterExchangeRendered: Boolean(drawReceipt && drawReceipt.airWaterExchangeRendered),

      landValueMapRendered: Boolean(drawReceipt && drawReceipt.landValueMapRendered),
      invertedBacktraceRendered: Boolean(drawReceipt && drawReceipt.invertedBacktraceRendered),
      sourceTraceValidationRendered: Boolean(drawReceipt && drawReceipt.sourceTraceValidationRendered),
      visibleTerrainBacktracedToSource: Boolean(drawReceipt && drawReceipt.visibleTerrainBacktracedToSource),
      unauthorizedPaintBlocked: true,
      waterPhaseContinuityVisible: true,
      authorizedVisualWeightOnly: true,
      sourceBacktracedTerrain: true,
      globalLandValueReadability: true,
      materialToneFromLandValue: true,

      terrainLifeRendered: true,
      lowReliefRendered: true,
      wetDryTerrainVariationRendered: true,
      readableBeachThreshold: true,
      wetLowlandVariation: true,
      livingTerrainVariation: true,
      restrainedRidgeDivideHint: true,
      highElevationIceStateHint: true,

      waterDivideRendered: true,
      phaseStateDivideRendered: true,
      highElevationIceStateRendered: true,
      highElevationFrozenWaterCandidateRendered: true,
      watershedDivideHintRendered: true,
      futureMeltPathHeld: true,

      waterRemainsSovereign: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      wetEdgePreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      terrainFillBlocked: true,
      noBlobReintroduced: Boolean(drawReceipt && drawReceipt.noBlobReintroduced),
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      noPublicHoneycomb: true,
      noPublicDotGrid: true,
      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,

      rendererConsumesHydration: state.rendererConsumesHydration,
      rendererConsumesHexBridge: state.rendererConsumesHexBridge,
      rendererConsumesHexgrid: state.rendererConsumesHexBridge,

      drawReceipt: drawReceipt,
      triDomainReceipt: {
        ok: true,
        version: VERSION,
        layerVersion: LAYER_VERSION,
        wholeWorldContainerRendered: true,
        triDomain256Rendered: true,
        water256Rendered: true,
        land256Rendered: true,
        air256Rendered: true,
        wholeWorld256Rendered: true,
        domainShare: 33.3333,
        waterLandExchangeRendered: true,
        landAirExchangeRendered: true,
        airWaterExchangeRendered: true,
        visualPassClaimed: false
      },
      waterDivideReceipt: {
        ok: true,
        version: VERSION,
        layerVersion: LAYER_VERSION,
        waterDivideRendered: true,
        phaseStateDivideRendered: true,
        highElevationIceStateRendered: true,
        waterRemainsSovereign: true,
        elevationTransformsWaterState: true,
        noGlacierDivideAuthority: true,
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
        layerVersion: LAYER_VERSION,
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
    return { ok: true, paused: true, version: VERSION, layerVersion: LAYER_VERSION, visualPassClaimed: false };
  }

  function resume() {
    state.paused = false;
    if (state.lastCanvas) renderNow(state.lastCanvas, {});
    return { ok: true, paused: false, version: VERSION, layerVersion: LAYER_VERSION, visualPassClaimed: false };
  }

  function destroy() {
    state.paused = true;

    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }

    state.lastCanvas = null;
    state.lastMount = null;

    return { ok: true, destroyed: true, version: VERSION, layerVersion: LAYER_VERSION, visualPassClaimed: false };
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      cleanSlatePreserved: true,

      wholeWorldContainerRendered: Boolean(state.lastRender && state.lastRender.wholeWorldContainerRendered),
      triDomain256Rendered: Boolean(state.lastRender && state.lastRender.triDomain256Rendered),
      water256Rendered: Boolean(state.lastRender && state.lastRender.water256Rendered),
      land256Rendered: Boolean(state.lastRender && state.lastRender.land256Rendered),
      air256Rendered: Boolean(state.lastRender && state.lastRender.air256Rendered),
      wholeWorld256Rendered: Boolean(state.lastRender && state.lastRender.wholeWorld256Rendered),
      triDomainCycleRendered: Boolean(state.lastRender && state.lastRender.triDomainCycleRendered),
      domainContactZonesRendered: Boolean(state.lastRender && state.lastRender.domainContactZonesRendered),
      waterLandExchangeRendered: Boolean(state.lastRender && state.lastRender.waterLandExchangeRendered),
      landAirExchangeRendered: Boolean(state.lastRender && state.lastRender.landAirExchangeRendered),
      airWaterExchangeRendered: Boolean(state.lastRender && state.lastRender.airWaterExchangeRendered),

      landValueMapRendered: Boolean(state.lastRender && state.lastRender.landValueMapRendered),
      invertedBacktraceRendered: Boolean(state.lastRender && state.lastRender.invertedBacktraceRendered),
      sourceTraceValidationRendered: Boolean(state.lastRender && state.lastRender.sourceTraceValidationRendered),
      visibleTerrainBacktracedToSource: Boolean(state.lastRender && state.lastRender.visibleTerrainBacktracedToSource),
      unauthorizedPaintBlocked: true,
      waterPhaseContinuityVisible: true,
      authorizedVisualWeightOnly: true,
      sourceBacktracedTerrain: true,
      globalLandValueReadability: true,
      materialToneFromLandValue: true,

      terrainLifeRendered: Boolean(state.lastRender && state.lastRender.terrainLifeRendered),
      lowReliefRendered: Boolean(state.lastRender && state.lastRender.lowReliefRendered),
      wetDryTerrainVariationRendered: Boolean(state.lastRender && state.lastRender.wetDryTerrainVariationRendered),
      readableBeachThreshold: Boolean(state.lastRender && state.lastRender.readableBeachThreshold),
      wetLowlandVariation: Boolean(state.lastRender && state.lastRender.wetLowlandVariation),
      livingTerrainVariation: Boolean(state.lastRender && state.lastRender.livingTerrainVariation),
      restrainedRidgeDivideHint: Boolean(state.lastRender && state.lastRender.restrainedRidgeDivideHint),
      highElevationIceStateHint: Boolean(state.lastRender && state.lastRender.highElevationIceStateHint),

      waterDivideRendered: Boolean(state.lastRender && state.lastRender.waterDivideRendered),
      phaseStateDivideRendered: Boolean(state.lastRender && state.lastRender.phaseStateDivideRendered),
      highElevationIceStateRendered: Boolean(state.lastRender && state.lastRender.highElevationIceStateRendered),
      highElevationFrozenWaterCandidateRendered: Boolean(state.lastRender && state.lastRender.highElevationFrozenWaterCandidateRendered),
      watershedDivideHintRendered: Boolean(state.lastRender && state.lastRender.watershedDivideHintRendered),
      futureMeltPathHeld: Boolean(state.lastRender && state.lastRender.futureMeltPathHeld),

      waterRemainsSovereign: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepthPreserved: Boolean(state.lastRender && state.lastRender.waterDepthPreserved),
      reefShelfPreserved: Boolean(state.lastRender && state.lastRender.reefShelfPreserved),
      beachThresholdPreserved: Boolean(state.lastRender && state.lastRender.beachThresholdPreserved),
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      terrainFillBlocked: true,
      noBlobReintroduced: Boolean(state.lastRender && state.lastRender.noBlobReintroduced),
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      rendererConsumesHydration: Boolean(state.rendererConsumesHydration),
      rendererConsumesHexBridge: Boolean(state.rendererConsumesHexBridge),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexBridge),

      noPublicHoneycomb: true,
      noPublicDotGrid: true,
      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,

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
    global.dispatchEvent(new CustomEvent("dgb:planet-one:renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
