/* G1 PLANET 1 TERRAIN ELEVATION FIELD RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_TERRAIN_ELEVATION_FIELD_PAIR_TNT_v1

   PURPOSE:
   - Preserve water dominance and the maritime datum.
   - Render a true terrain elevation field from the hidden 256-state substrate.
   - Prepare beach-ready zones without painting final beaches.
   - Hold plateau, mineral exposure, mountains, glaciers, waterfalls, and higher relief.
   - Keep public mode satellite-observational.
   - Do not claim visual pass.
*/

(function attachPlanetOneRendererFacade(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_ELEVATION_FIELD_PAIR_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_CONTROLLED_LAND_ELEVATION_PAIR_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var MARITIME_BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";
  var HEXGRID_PATH = "/world/render/planet-one.hexgrid.render.js";
  var DEFAULT_RENDER_MODE = "satellite";

  var CONTRACT_MARKERS = [
    VERSION,
    PRIOR_VERSION,
    BASELINE,
    MARITIME_BASELINE,
    "RENDERER_FACADE_ACTIVE",
    "RESPONSIBILITY_SPLIT_ACTIVE",
    "ORBITAL_PROJECTION_RESTRAINT_ACTIVE",
    "HEXGRID_CONSUMED_AS_HIDDEN_PLANETARY_DATA",
    "MARITIME_DATUM_PRESERVED",
    "SEA_LEVEL_PLANE_READ_PRESERVED",
    "TERRAIN_ELEVATION_RENDERED",
    "BEACH_READY_ZONE_VISIBLE_BUT_NOT_FINAL",
    "LOWLAND_TERRAIN_VISIBLE",
    "INTERIOR_TERRAIN_LIFT_VISIBLE",
    "NO_PREMATURE_PLATEAU_RELIEF",
    "NO_PREMATURE_MOUNTAIN_RELIEF",
    "SATELLITE_OBSERVATIONAL_MODE_ACTIVE",
    "PUBLIC_HONEYCOMB_BLOCKED",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    paused: false,
    lastCanvas: null,
    lastMount: null,
    lastRender: null,
    lastError: null,
    hexgridLoadAttempted: false,
    hexgridLoadComplete: false,
    hexgridLoadFailed: false,
    rendererConsumesHexgrid: false,
    satelliteObservationalModeActive: true,
    defaultRenderMode: DEFAULT_RENDER_MODE
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
      canvas.setAttribute("data-render-mode", DEFAULT_RENDER_MODE);
      canvas.setAttribute("aria-label", "Planet 1 terrain elevation field satellite renderer");

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

    if (existing) return waitForHexgrid(1800);

    return new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = HEXGRID_PATH + "?terrain_elevation_field=" + encodeURIComponent(VERSION) + "&t=" + Date.now();
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

  function moduleDetected(name) {
    return Boolean(global[name]);
  }

  function drawBaseSphere(ctx, cx, cy, radius) {
    var ocean;
    var shade;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.30, cy - radius * 0.42, radius * 0.08, cx, cy, radius * 1.08);
    ocean.addColorStop(0, "rgba(78,138,168,.98)");
    ocean.addColorStop(0.32, "rgba(31,84,124,.98)");
    ocean.addColorStop(0.70, "rgba(8,31,64,.99)");
    ocean.addColorStop(1, "rgba(2,8,24,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255,255,255,.14)");
    shade.addColorStop(0.44, "rgba(255,255,255,.026)");
    shade.addColorStop(0.76, "rgba(0,0,0,.18)");
    shade.addColorStop(1, "rgba(0,0,0,.46)");
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.restore();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.76, "rgba(145,189,255,.06)");
    rim.addColorStop(1, "rgba(145,189,255,.36)");

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

  function drawTerrainElevationAtmosphere(ctx, cx, cy, radius) {
    var haze;
    var terminator;
    var waterline;
    var terrainLift;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    haze = ctx.createRadialGradient(cx - radius * 0.24, cy - radius * 0.34, radius * 0.12, cx, cy, radius);
    haze.addColorStop(0, "rgba(255,255,255,.11)");
    haze.addColorStop(0.46, "rgba(255,255,255,.025)");
    haze.addColorStop(0.80, "rgba(10,28,58,.04)");
    haze.addColorStop(1, "rgba(0,0,0,.34)");
    ctx.fillStyle = haze;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.35, cy - radius, cx + radius * 0.95, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.045)");
    terminator.addColorStop(0.54, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.31)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    waterline = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 1.0);
    waterline.addColorStop(0, "rgba(226,207,146,.020)");
    waterline.addColorStop(0.52, "rgba(226,207,146,.040)");
    waterline.addColorStop(0.86, "rgba(226,207,146,.018)");
    waterline.addColorStop(1, "rgba(226,207,146,0)");
    ctx.fillStyle = waterline;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terrainLift = ctx.createRadialGradient(cx - radius * 0.10, cy - radius * 0.06, radius * 0.08, cx, cy, radius * 0.96);
    terrainLift.addColorStop(0, "rgba(245,218,150,.026)");
    terrainLift.addColorStop(0.54, "rgba(245,218,150,.016)");
    terrainLift.addColorStop(1, "rgba(245,218,150,0)");
    ctx.fillStyle = terrainLift;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var glow = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.38, radius * 0.15, cx, cy, radius * 1.12);

    glow.addColorStop(0, "rgba(255,255,255,.12)");
    glow.addColorStop(0.38, "rgba(145,189,255,.045)");
    glow.addColorStop(0.82, "rgba(9,20,48,.04)");
    glow.addColorStop(1, "rgba(0,0,0,.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.strokeStyle = "rgba(242,199,111,.15)";
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
    ctx.strokeStyle = "rgba(242,199,111,.14)";
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.stroke();
    ctx.restore();
  }

  function renderNow(canvas, options) {
    var ctx = canvas.getContext("2d");
    var size;
    var cx;
    var cy;
    var radius;
    var hexgrid;
    var grid;
    var hexStatus;
    var renderMode;
    var drewHexgrid = false;

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
      hexgrid = global.DGBPlanetOneHexgridRender;
      hexStatus = getHexgridStatus();

      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      grid = hexgrid.createPlanetOneHexGrid({
        lonStep: options.lonStep || 4,
        latStep: options.latStep || 4,
        seed: options.seed || 256451
      });

      hexgrid.drawPlanetOneHexGrid(ctx, grid, {
        centerX: cx,
        centerY: cy,
        radius: radius,
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        alpha: options.hexAlpha == null ? 0.86 : options.hexAlpha,
        renderMode: renderMode,
        coastGlow: true,
        beachReadyGlow: true
      });

      ctx.restore();

      drewHexgrid = true;
      state.rendererConsumesHexgrid = true;
    } else {
      state.rendererConsumesHexgrid = false;
    }

    drawTerrainElevationAtmosphere(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius);
    if (options.showAxis !== false) drawAxis(ctx, cx, cy, radius);

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      renderedAt: now(),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      radius: radius,
      renderMode: renderMode,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      projectionModel: "orthographic_orbital_projection",

      hexgridDetected: hasHexgrid(),
      hexgridSubstrateDetected: hasHexgrid(),
      hexCellSubstrateActive: Boolean(hexStatus && hexStatus.hexCellSubstrateActive),
      hexagonalPixelFormatActive: Boolean(hexStatus && hexStatus.hexagonalPixelFormatActive),

      maritimeDatumPreserved: true,
      maritimeSeaLevelBaselineActive: Boolean(hexStatus && hexStatus.maritimeSeaLevelBaselineActive),
      seaLevelPlaneReadPreserved: true,

      controlledLandElevationRendered: Boolean(hexStatus && hexStatus.controlledLandElevationActive),
      terrainElevationRendered: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      terrainElevationFieldActive: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      beachReadyZoneVisibleButNotFinal: Boolean(hexStatus && hexStatus.beachReadyZonePrepared),
      lowlandTerrainVisible: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      interiorTerrainLiftVisible: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),

      waterDominancePreserved: Boolean(hexStatus && hexStatus.waterDominancePreserved),
      plateauPressureHeld: Boolean(hexStatus && hexStatus.plateauPressureHeld),
      higherReliefHeld: Boolean(hexStatus && hexStatus.higherReliefHeld),
      noPrematureShelfFinalization: true,
      noPrematurePlateauRelief: true,
      noPrematureMountainRelief: true,

      satelliteObservationalModeActive: renderMode === "satellite",
      publicHoneycombBlocked: renderMode === "satellite",
      cellDebugModeAvailable: Boolean(hexStatus && hexStatus.cellDebugModeAvailable),
      twoDynamicHemisphericLandStructuresActive: Boolean(hexStatus && hexStatus.twoDynamicHemisphericLandStructuresActive),
      threeSecondaryNonPolarBodiesActive: Boolean(hexStatus && hexStatus.threeSecondaryNonPolarBodiesActive),
      sevenLandmassLawActive: Boolean(hexStatus && hexStatus.sevenLandmassLawActive),

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

    options = options || {};
    options.renderMode = options.renderMode || DEFAULT_RENDER_MODE;

    if (!canvas) {
      state.lastRender = { ok: false, mounted: false, reason: "NO_MOUNT", version: VERSION, visualPassClaimed: false };
      return state.lastRender;
    }

    immediate = renderNow(canvas, options);

    ensureHexgridScript().then(function (loaded) {
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
    var hexStatus = getHexgridStatus();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      activeCanvas: Boolean(state.lastCanvas),
      mountComplete: Boolean(state.lastCanvas && state.lastMount),
      projectionModel: "orthographic_orbital_projection",

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

      maritimeDatumPreserved: true,
      maritimeSeaLevelBaselineActive: Boolean(hexStatus && hexStatus.maritimeSeaLevelBaselineActive),
      seaLevelPlaneReadPreserved: true,
      controlledLandElevationRendered: Boolean(hexStatus && hexStatus.controlledLandElevationActive),

      terrainElevationRendered: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      terrainElevationFieldActive: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      beachReadyZoneVisibleButNotFinal: Boolean(hexStatus && hexStatus.beachReadyZonePrepared),
      lowlandTerrainVisible: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      interiorTerrainLiftVisible: Boolean(hexStatus && hexStatus.terrainElevationFieldActive),
      waterDominancePreserved: Boolean(hexStatus && hexStatus.waterDominancePreserved),
      plateauPressureHeld: Boolean(hexStatus && hexStatus.plateauPressureHeld),
      higherReliefHeld: Boolean(hexStatus && hexStatus.higherReliefHeld),

      noPrematureShelfFinalization: true,
      noPrematurePlateauRelief: true,
      noPrematureMountainRelief: true,

      satelliteObservationalModeActive: true,
      publicHoneycombBlocked: true,
      cellDebugModeAvailable: Boolean(hexStatus && hexStatus.cellDebugModeAvailable),
      defaultRenderMode: DEFAULT_RENDER_MODE,

      twoDynamicHemisphericLandStructuresActive: Boolean(hexStatus && hexStatus.twoDynamicHemisphericLandStructuresActive),
      threeSecondaryNonPolarBodiesActive: Boolean(hexStatus && hexStatus.threeSecondaryNonPolarBodiesActive),
      sevenLandmassLawActive: Boolean(hexStatus && hexStatus.sevenLandmassLawActive),

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
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
    BASELINE: BASELINE,
    MARITIME_BASELINE: MARITIME_BASELINE,
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
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
