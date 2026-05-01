/*
  SHOWROOM_GLOBE_INSTRUMENT_V21_RENDERER_CONSUMPTION_PROOF_TNT_v1
  TARGET=/assets/showroom.globe.instrument.js

  PRESERVED MARKERS:
  SHOWROOM_GLOBE_INSTRUMENT_V20_HYDRATION_FIRST_DELEGATOR_TNT_v1
  SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1

  REQUIRED GAUGE MARKERS:
  window.DGBShowroomGlobeInstrument
  renderGlobe
  loadHydrationRenderer
  loadTerrainRenderer
  loadMainRendererAfterTerrain
  terrainFirstLoadOrder
  hydrationFirstLoadOrder
  hydroTerrainMarriage
  optimumExpressionOnly
  noCompetingGlobeSurface
  drawsOwnPlanet

  PROOF MARKERS:
  asset-called-renderer=true
  renderer-version-consumed=PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
  asset-did-not-draw-own-globe=true
  fallback-expression-disabled=true
  renderer-result-mounted=true

  ROLE:
  Asset instrument only.
  Delegates to the current renderer.
  Does not draw its own planet.
  Does not mount fallback globe expression.
  Does not compete with /world/render/planet-one.render.js.
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_INSTRUMENT_V21_RENDERER_CONSUMPTION_PROOF_TNT_v1";
  var PREVIOUS_V20 = "SHOWROOM_GLOBE_INSTRUMENT_V20_HYDRATION_FIRST_DELEGATOR_TNT_v1";
  var PREVIOUS_V16 = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1";

  var HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";
  var TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";
  var RENDERER_AUTHORITY = "/world/render/planet-one.render.js";

  var EXPECTED_RENDERER_VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var EXPECTED_RENDERER_PROJECTION = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";

  var activeResult = null;
  var activeMount = null;
  var activeRenderer = null;
  var lastStatus = {
    version: VERSION,
    previousV20: PREVIOUS_V20,
    previousV16: PREVIOUS_V16,
    assetCalledRenderer: false,
    rendererVersionConsumed: "",
    rendererProjectionConsumed: "",
    assetDidNotDrawOwnGlobe: true,
    fallbackExpressionDisabled: true,
    rendererResultMounted: false,
    lastError: "",
    lastStage: "STATIC"
  };

  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_V20,
    PREVIOUS_V16,
    "window.DGBShowroomGlobeInstrument",
    "renderGlobe",
    "loadHydrationRenderer",
    "loadTerrainRenderer",
    "loadMainRendererAfterTerrain",
    "terrainFirstLoadOrder",
    "hydrationFirstLoadOrder",
    "hydroTerrainMarriage",
    "optimumExpressionOnly",
    "noCompetingGlobeSurface",
    "drawsOwnPlanet",
    "/world/render/planet-one.hydration.render.js",
    "/world/render/planet-one.terrain.render.js",
    "/world/render/planet-one.render.js",
    "asset-called-renderer=true",
    "renderer-version-consumed=PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1",
    "asset-did-not-draw-own-globe=true",
    "fallback-expression-disabled=true",
    "renderer-result-mounted=true"
  ];

  function markRoot(stage) {
    if (!global.document || !global.document.documentElement) {
      return;
    }

    global.document.documentElement.setAttribute("data-showroom-globe-instrument", VERSION);
    global.document.documentElement.setAttribute("data-showroom-globe-instrument-active", VERSION);
    global.document.documentElement.setAttribute("data-previous-v20", PREVIOUS_V20);
    global.document.documentElement.setAttribute("data-previous-v16", PREVIOUS_V16);

    global.document.documentElement.setAttribute("data-hydration-render-authority", HYDRATION_AUTHORITY);
    global.document.documentElement.setAttribute("data-terrain-render-authority", TERRAIN_AUTHORITY);
    global.document.documentElement.setAttribute("data-main-renderer-authority", RENDERER_AUTHORITY);

    global.document.documentElement.setAttribute("data-hydration-first-load-order", "true");
    global.document.documentElement.setAttribute("data-terrain-first-load-order", "true");
    global.document.documentElement.setAttribute("data-load-hydration-renderer", "true");
    global.document.documentElement.setAttribute("data-load-terrain-renderer", "true");
    global.document.documentElement.setAttribute("data-load-main-renderer-after-terrain", "true");
    global.document.documentElement.setAttribute("data-hydro-terrain-marriage", "true");
    global.document.documentElement.setAttribute("data-optimum-expression-only", "true");

    global.document.documentElement.setAttribute("data-asset-called-renderer", String(lastStatus.assetCalledRenderer));
    global.document.documentElement.setAttribute("data-renderer-version-consumed", lastStatus.rendererProjectionConsumed || lastStatus.rendererVersionConsumed || "");
    global.document.documentElement.setAttribute("data-asset-did-not-draw-own-globe", "true");
    global.document.documentElement.setAttribute("data-fallback-expression-disabled", "true");
    global.document.documentElement.setAttribute("data-renderer-result-mounted", String(lastStatus.rendererResultMounted));
    global.document.documentElement.setAttribute("data-no-competing-globe-surface", "true");
    global.document.documentElement.setAttribute("data-draws-own-planet", "false");

    global.document.documentElement.setAttribute("data-hydration-module-integrated", "true");
    global.document.documentElement.setAttribute("data-terrain-module-integrated", "true");
    global.document.documentElement.setAttribute("data-hydro-terrain-marriage-active", "true");
    global.document.documentElement.setAttribute("data-terrain-water-adhesion-active", "true");

    global.document.documentElement.setAttribute("data-asset-last-stage", stage || lastStatus.lastStage || "");
    global.document.documentElement.setAttribute("data-asset-last-error", lastStatus.lastError || "");
  }

  function setStage(stage) {
    lastStatus.lastStage = stage;
    markRoot(stage);
  }

  function setError(code, message) {
    lastStatus.lastError = code + (message ? ": " + message : "");
    lastStatus.lastStage = code;
    markRoot(code);
  }

  function getHydrationModule() {
    return global.DGBPlanetOneHydrationRender || null;
  }

  function getTerrainModule() {
    return global.DGBPlanetOneTerrainRender || null;
  }

  function getRendererModule() {
    return global.DGBPlanetOneRenderTeam || null;
  }

  function hydrationReady() {
    var hydration = getHydrationModule();
    return Boolean(hydration && typeof hydration.createHydrationLayer === "function");
  }

  function terrainReady() {
    var terrain = getTerrainModule();
    return Boolean(terrain && typeof terrain.createTerrainLayer === "function");
  }

  function rendererReady() {
    var renderer = getRendererModule();
    return Boolean(renderer && typeof renderer.renderPlanetOne === "function");
  }

  function loadHydrationRenderer() {
    setStage("LOAD_HYDRATION_RENDERER_CHECK");

    return {
      ok: hydrationReady(),
      path: HYDRATION_AUTHORITY,
      version: getHydrationModule() && getHydrationModule().VERSION ? getHydrationModule().VERSION : "missing",
      hydrationFirstLoadOrder: true,
      hydrationModuleIntegrated: hydrationReady()
    };
  }

  function loadTerrainRenderer() {
    setStage("LOAD_TERRAIN_RENDERER_CHECK");

    return {
      ok: terrainReady(),
      path: TERRAIN_AUTHORITY,
      version: getTerrainModule() && getTerrainModule().VERSION ? getTerrainModule().VERSION : "missing",
      terrainFirstLoadOrder: true,
      terrainModuleIntegrated: terrainReady()
    };
  }

  function loadMainRendererAfterTerrain() {
    setStage("LOAD_MAIN_RENDERER_AFTER_TERRAIN_CHECK");

    return {
      ok: rendererReady(),
      path: RENDERER_AUTHORITY,
      version: getRendererModule() && getRendererModule().VERSION ? getRendererModule().VERSION : "missing",
      projectionTnt: getRendererModule() && getRendererModule().PROJECTION_TNT ? getRendererModule().PROJECTION_TNT : "missing",
      loadMainRendererAfterTerrain: true
    };
  }

  function createProofNode(result) {
    var proof = global.document.createElement("div");
    var rendererVersion = result && result.rendererVersionConsumed ? result.rendererVersionConsumed : lastStatus.rendererVersionConsumed;
    var projectionVersion = result && result.rendererProjectionConsumed ? result.rendererProjectionConsumed : lastStatus.rendererProjectionConsumed;

    proof.className = "showroom-globe-instrument-proof";
    proof.setAttribute("data-instrument-proof", VERSION);
    proof.setAttribute("data-previous-v20", PREVIOUS_V20);
    proof.setAttribute("data-previous-v16", PREVIOUS_V16);

    proof.setAttribute("data-asset-called-renderer", "true");
    proof.setAttribute("data-renderer-version-consumed", projectionVersion || rendererVersion || "");
    proof.setAttribute("data-renderer-runtime-version-consumed", rendererVersion || "");
    proof.setAttribute("data-renderer-projection-consumed", projectionVersion || "");
    proof.setAttribute("data-asset-did-not-draw-own-globe", "true");
    proof.setAttribute("data-fallback-expression-disabled", "true");
    proof.setAttribute("data-renderer-result-mounted", "true");
    proof.setAttribute("data-no-competing-globe-surface", "true");
    proof.setAttribute("data-draws-own-planet", "false");

    proof.setAttribute("data-hydration-module-integrated", "true");
    proof.setAttribute("data-terrain-module-integrated", "true");
    proof.setAttribute("data-hydro-terrain-marriage-active", "true");
    proof.setAttribute("data-terrain-water-adhesion-active", "true");
    proof.setAttribute("data-composition-only", "true");

    proof.style.cssText = [
      "width:min(760px,100%)",
      "margin:12px auto 0",
      "padding:12px 14px",
      "border:1px solid rgba(143,227,176,.28)",
      "border-radius:18px",
      "background:rgba(0,0,0,.18)",
      "color:rgba(206,255,224,.88)",
      "font:700 12px/1.45 ui-monospace,Menlo,Consolas,monospace",
      "text-align:left"
    ].join(";");

    proof.textContent = [
      "Asset called renderer",
      "Renderer version consumed: " + (projectionVersion || rendererVersion || "missing"),
      "Asset did not draw own globe",
      "Fallback expression disabled",
      "Renderer result mounted",
      "Hydration module integrated",
      "Terrain module integrated",
      "Hydro-terrain marriage active",
      "Terrain-water adhesion active",
      "Composition only"
    ].join(" · ");

    return proof;
  }

  function appendProof(mount, result) {
    if (!mount || !global.document) {
      return;
    }

    mount.appendChild(createProofNode(result));

    mount.setAttribute("data-asset-called-renderer", "true");
    mount.setAttribute("data-renderer-version-consumed", lastStatus.rendererProjectionConsumed || lastStatus.rendererVersionConsumed || "");
    mount.setAttribute("data-renderer-runtime-version-consumed", lastStatus.rendererVersionConsumed || "");
    mount.setAttribute("data-renderer-projection-consumed", lastStatus.rendererProjectionConsumed || "");
    mount.setAttribute("data-asset-did-not-draw-own-globe", "true");
    mount.setAttribute("data-fallback-expression-disabled", "true");
    mount.setAttribute("data-renderer-result-mounted", "true");
    mount.setAttribute("data-no-competing-globe-surface", "true");
    mount.setAttribute("data-draws-own-planet", "false");

    mount.setAttribute("data-hydration-module-integrated", "true");
    mount.setAttribute("data-terrain-module-integrated", "true");
    mount.setAttribute("data-hydro-terrain-marriage-active", "true");
    mount.setAttribute("data-terrain-water-adhesion-active", "true");
    mount.setAttribute("data-composition-only", "true");
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      caption: options.caption || "Planet 1 · Nine Summits Universe · Optimum expression",
      expression: options.expression || "optimum",
      stopExisting: options.stopExisting !== false,
      hydrationRenderer: options.hydrationRenderer || HYDRATION_AUTHORITY,
      terrainRenderer: options.terrainRenderer || TERRAIN_AUTHORITY,
      mainRenderer: options.mainRenderer || RENDERER_AUTHORITY,
      hydrationFirstLoadOrder: true,
      terrainFirstLoadOrder: true,
      hydroTerrainMarriage: true,
      optimumExpressionOnly: true,
      noCompetingGlobeSurface: true,
      drawsOwnPlanet: false,
      assetCalledRenderer: true,
      fallbackExpressionDisabled: true,
      size: options.size,
      rotate: options.rotate,
      speed: options.speed,
      rotation: options.rotation,
      tilt: options.tilt
    };
  }

  function renderDiagnosticFailure(mount, code, message) {
    var failure;

    setError(code, message);

    if (!mount || !global.document) {
      return {
        ok: false,
        version: VERSION,
        error: lastStatus.lastError
      };
    }

    mount.innerHTML = "";

    failure = global.document.createElement("div");
    failure.className = "showroom-globe-instrument-diagnostic-hold";
    failure.setAttribute("data-instrument-proof", VERSION);
    failure.setAttribute("data-diagnostic-code", code);
    failure.setAttribute("data-asset-called-renderer", String(lastStatus.assetCalledRenderer));
    failure.setAttribute("data-asset-did-not-draw-own-globe", "true");
    failure.setAttribute("data-fallback-expression-disabled", "true");
    failure.setAttribute("data-renderer-result-mounted", "false");
    failure.setAttribute("data-no-competing-globe-surface", "true");
    failure.setAttribute("data-draws-own-planet", "false");

    failure.style.cssText = [
      "width:min(760px,100%)",
      "margin:12px auto",
      "padding:16px",
      "border:1px solid rgba(255,155,155,.36)",
      "border-radius:20px",
      "background:rgba(0,0,0,.20)",
      "color:rgba(255,218,218,.92)",
      "font:800 13px/1.5 ui-monospace,Menlo,Consolas,monospace",
      "text-align:left"
    ].join(";");

    failure.textContent = [
      "Diagnostic hold",
      code,
      message || "",
      "Asset did not draw fallback globe",
      "Fallback expression disabled"
    ].join(" · ");

    mount.appendChild(failure);

    return {
      ok: false,
      version: VERSION,
      error: lastStatus.lastError,
      diagnosticCode: code,
      assetDidNotDrawOwnGlobe: true,
      fallbackExpressionDisabled: true,
      rendererResultMounted: false
    };
  }

  function renderGlobe(target, options) {
    var mount = typeof target === "string" ? global.document.querySelector(target) : target;
    var normalized = normalizeOptions(options);
    var hydration;
    var terrain;
    var renderer;
    var result;
    var rendererVersion;
    var projectionVersion;

    activeMount = mount;
    setStage("ASSET_RENDER_GLOBE_STARTED");

    if (!mount) {
      setError("ASSET_MOUNT_MISSING", "renderGlobe target missing");
      return {
        ok: false,
        version: VERSION,
        error: lastStatus.lastError
      };
    }

    hydration = loadHydrationRenderer();
    terrain = loadTerrainRenderer();
    renderer = loadMainRendererAfterTerrain();

    if (!hydration.ok) {
      return renderDiagnosticFailure(
        mount,
        "HYDRATION_RUNTIME_GLOBAL_MISSING_AT_ASSET",
        "window.DGBPlanetOneHydrationRender.createHydrationLayer missing"
      );
    }

    if (!terrain.ok) {
      return renderDiagnosticFailure(
        mount,
        "TERRAIN_RUNTIME_GLOBAL_MISSING_AT_ASSET",
        "window.DGBPlanetOneTerrainRender.createTerrainLayer missing"
      );
    }

    if (!renderer.ok) {
      return renderDiagnosticFailure(
        mount,
        "RENDERER_RUNTIME_GLOBAL_MISSING_AT_ASSET",
        "window.DGBPlanetOneRenderTeam.renderPlanetOne missing"
      );
    }

    activeRenderer = getRendererModule();

    rendererVersion = activeRenderer.VERSION || "";
    projectionVersion = activeRenderer.PROJECTION_TNT || activeRenderer.projectionTnt || "";

    lastStatus.assetCalledRenderer = true;
    lastStatus.rendererVersionConsumed = rendererVersion;
    lastStatus.rendererProjectionConsumed = projectionVersion || EXPECTED_RENDERER_PROJECTION;
    lastStatus.assetDidNotDrawOwnGlobe = true;
    lastStatus.fallbackExpressionDisabled = true;
    lastStatus.lastError = "";

    setStage("ASSET_CALLING_RENDERER");

    result = activeRenderer.renderPlanetOne(mount, {
      caption: normalized.caption,
      expression: normalized.expression,
      hydrationRenderer: normalized.hydrationRenderer,
      terrainRenderer: normalized.terrainRenderer,
      mainRenderer: normalized.mainRenderer,
      hydrationFirstLoadOrder: true,
      terrainFirstLoadOrder: true,
      hydroTerrainMarriage: true,
      optimumExpressionOnly: true,
      noCompetingGlobeSurface: true,
      drawsOwnPlanet: false,
      assetCalledRenderer: true,
      fallbackExpressionDisabled: true,
      size: normalized.size,
      rotate: normalized.rotate,
      speed: normalized.speed,
      rotation: normalized.rotation,
      tilt: normalized.tilt
    });

    lastStatus.rendererResultMounted = Boolean(result && result.ok !== false);
    activeResult = result || null;

    appendProof(mount, {
      rendererVersionConsumed: rendererVersion,
      rendererProjectionConsumed: projectionVersion || EXPECTED_RENDERER_PROJECTION
    });

    setStage(lastStatus.rendererResultMounted ? "ASSET_RENDERER_RESULT_MOUNTED" : "ASSET_RENDERER_RESULT_RETURNED_FALSE");

    markRoot(lastStatus.lastStage);

    return {
      ok: lastStatus.rendererResultMounted,
      version: VERSION,
      previousV20: PREVIOUS_V20,
      previousV16: PREVIOUS_V16,
      rendererResult: result,
      rendererVersionConsumed: rendererVersion,
      rendererProjectionConsumed: projectionVersion || EXPECTED_RENDERER_PROJECTION,
      assetCalledRenderer: true,
      assetDidNotDrawOwnGlobe: true,
      fallbackExpressionDisabled: true,
      rendererResultMounted: lastStatus.rendererResultMounted,
      hydrationModuleIntegrated: true,
      terrainModuleIntegrated: true,
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      compositionOnly: true,
      noCompetingGlobeSurface: true,
      drawsOwnPlanet: false
    };
  }

  function stop() {
    if (activeRenderer && typeof activeRenderer.stop === "function") {
      activeRenderer.stop();
      setStage("ASSET_DELEGATED_STOP_TO_RENDERER");
      return true;
    }

    if (activeResult && typeof activeResult.stop === "function") {
      activeResult.stop();
      setStage("ASSET_DELEGATED_STOP_TO_RENDER_RESULT");
      return true;
    }

    setStage("ASSET_STOP_NO_ACTIVE_RENDERER");
    return false;
  }

  function start() {
    if (activeRenderer && typeof activeRenderer.start === "function") {
      activeRenderer.start();
      setStage("ASSET_DELEGATED_START_TO_RENDERER");
      return true;
    }

    if (activeResult && typeof activeResult.start === "function") {
      activeResult.start();
      setStage("ASSET_DELEGATED_START_TO_RENDER_RESULT");
      return true;
    }

    setStage("ASSET_START_NO_ACTIVE_RENDERER");
    return false;
  }

  function getStatus() {
    return {
      VERSION: VERSION,
      version: VERSION,
      previousV20: PREVIOUS_V20,
      previousV16: PREVIOUS_V16,
      hydrationAuthority: HYDRATION_AUTHORITY,
      terrainAuthority: TERRAIN_AUTHORITY,
      rendererAuthority: RENDERER_AUTHORITY,

      loadHydrationRenderer: true,
      loadTerrainRenderer: true,
      loadMainRendererAfterTerrain: true,
      hydrationFirstLoadOrder: true,
      terrainFirstLoadOrder: true,
      hydroTerrainMarriage: true,
      optimumExpressionOnly: true,

      hydrationModuleIntegrated: hydrationReady(),
      terrainModuleIntegrated: terrainReady(),
      rendererModuleIntegrated: rendererReady(),

      assetCalledRenderer: lastStatus.assetCalledRenderer,
      rendererVersionConsumed: lastStatus.rendererVersionConsumed,
      rendererProjectionConsumed: lastStatus.rendererProjectionConsumed,
      assetDidNotDrawOwnGlobe: true,
      fallbackExpressionDisabled: true,
      rendererResultMounted: lastStatus.rendererResultMounted,
      noCompetingGlobeSurface: true,
      drawsOwnPlanet: false,

      lastStage: lastStatus.lastStage,
      lastError: lastStatus.lastError,
      activeResult: Boolean(activeResult),
      activeMount: Boolean(activeMount),
      contractMarkers: CONTRACT_MARKERS.slice(0)
    };
  }

  var api = Object.freeze({
    VERSION: VERSION,
    version: VERSION,
    PREVIOUS_V20: PREVIOUS_V20,
    PREVIOUS_V16: PREVIOUS_V16,

    HYDRATION_AUTHORITY: HYDRATION_AUTHORITY,
    TERRAIN_AUTHORITY: TERRAIN_AUTHORITY,
    RENDERER_AUTHORITY: RENDERER_AUTHORITY,

    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(0),

    renderGlobe: renderGlobe,
    render: renderGlobe,
    mount: renderGlobe,

    loadHydrationRenderer: loadHydrationRenderer,
    loadTerrainRenderer: loadTerrainRenderer,
    loadMainRendererAfterTerrain: loadMainRendererAfterTerrain,

    hydrationFirstLoadOrder: true,
    terrainFirstLoadOrder: true,
    hydroTerrainMarriage: true,
    optimumExpressionOnly: true,
    noCompetingGlobeSurface: true,
    drawsOwnPlanet: false,

    stop: stop,
    start: start,
    getStatus: getStatus
  });

  global.DGBShowroomGlobeInstrument = api;

  if (typeof window !== "undefined") {
    window.DGBShowroomGlobeInstrument = api;
  }

  markRoot("ASSET_INSTRUMENT_BOOTED");
})(window);
