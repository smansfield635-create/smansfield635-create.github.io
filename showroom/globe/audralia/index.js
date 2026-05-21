// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_ROUTE_JS_GRATITUDE_SURFACE_RENDERER_CONSUMER_TNT_v4
//
// Supersedes:
// AUDRALIA_G2_ROUTE_JS_TERRAIN_ECOSYSTEM_RUNTIME_CONSUMER_KEY_RENEWAL_TNT_v3
//
// Purpose:
// - Preserve current public route behavior.
// - Preserve finger control.
// - Preserve protected Lattice View.
// - Preserve global multi-layer cloud shell.
// - Fetch runtime by the surface-aware v6 cache key.
// - Accept runtime by preserved public v2 contract.
// - Verify runtime by v6 surface renderer capability marker.
// - Call the Gratitude surface renderer before cloud rendering.
// - Keep route JS as canvas orchestrator only.
// - Do not move terrain/surface/cloud logic into route JS.
// - Do not alter HTML.
// - No generated image. No GraphicBox. No flat projection. No legacy handoff wall.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_ROUTE_JS_GRATITUDE_SURFACE_RENDERER_CONSUMER_TNT_v4";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_ROUTE_JS_TERRAIN_ECOSYSTEM_RUNTIME_CONSUMER_KEY_RENEWAL_TNT_v3";
  var HTML_CONTRACT = "AUDRALIA_G2_HTML_ROUTE_JS_MOISTURE_CLOUD_CONSUMER_KEY_RENEWAL_TNT_v1";

  var RUNTIME_EXPECTED_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6";

  var RUNTIME_SURFACE_CAPABILITY_FIELD = "surfaceRendererConsumerContract";
  var RUNTIME_SURFACE_CAPABILITY_MARKER = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6";

  var PREVIOUS_RUNTIME_CACHE_KEY = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_TERRAIN_ECOSYSTEM_MANIFEST_CONSUMER_TNT_v5";
  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";

  var STANDARD = "AUDRALIA_G2_GRATITUDE_CONTINENT_SURFACE_VISUALIZATION_SPEC_OPS_v1";
  var TAU = Math.PI * 2;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia · Gratitude continent under hydrology-powered clouds",
      copy: "Planet View renders Audralia from the true-globe runtime. The Gratitude continent surface renderer draws beneath the global cloud shell."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → protected 16 × 16 / 256 spherical lattice baseline",
      copy: "Lattice View is protected. Surface, terrain, and clouds are blocked from this lens."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → runtime, surface, moisture, cloud, and lattice status",
      copy: "Diagnostic Scope reports route JS, runtime v6, Gratitude surface visibility, terrain forcing, moisture, clouds, and protected lattice state."
    }
  };

  var state = {
    stage: null,
    mount: null,
    diagnosticMount: null,
    canvas: null,
    ctx: null,
    runtime: null,

    activeLens: "planet",
    dpr: 1,
    raf: 0,
    renderCount: 0,

    runtimeLoadStarted: false,
    runtimeLoaded: false,
    runtimeDetected: false,
    runtimeExpectedContractPreserved: true,
    runtimeCacheKeySeparated: true,
    runtimeFetchKeyCurrent: false,
    runtimeAcceptedByPublicContract: false,
    runtimeSurfaceCapabilityConfirmed: false,

    routeReady: false,
    canvasReady: false,
    planetViewReady: false,
    latticeViewReady: false,
    diagnosticScopeReady: false,

    terrainEcosystemReady: false,
    terrainEcosystemLoaded: false,
    terrainForcingDrivesMoisture: false,
    moistureDerivedFromTerrainForcing: false,
    moistureFieldReady: false,

    surfaceLoaded: false,
    surfaceRendererReady: false,
    gratitudeContinentVisible: false,
    surfaceRenderedBeforeClouds: false,

    cloudRendererReady: false,
    cloudsRenderAboveSurface: true,

    latticeViewProtected: true,
    duplicateCanvasCount: 0,
    dragging: false,
    errors: []
  };

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
      if (document.body) document.body.dataset[key] = String(value);
    } catch (_error) {}
  }

  function setText(selector, value) {
    try {
      var node = document.querySelector(selector);
      if (node) node.textContent = String(value);
    } catch (_error) {}
  }

  function setHtml(selector, value) {
    try {
      var node = document.querySelector(selector);
      if (node) node.innerHTML = String(value);
    } catch (_error) {}
  }

  function getRuntime() {
    return window.AUDRALIA_TRUE_GLOBE_RUNTIME || window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME || null;
  }

  function getSurfaceApi() {
    return window.AUDRALIA_TRUE_GLOBE_SURFACE || window.AUDRALIA_G2_TRUE_GLOBE_SURFACE || null;
  }

  function getCloudApi() {
    return window.AUDRALIA_TRUE_GLOBE_CLOUDS || window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS || null;
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE || window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE || null;
  }

  function getTerrainEcosystemApi() {
    return window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM || window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM || null;
  }

  function runtimeStatus(runtime) {
    if (!runtime || typeof runtime.status !== "function") return null;

    try {
      return runtime.status();
    } catch (_error) {
      return null;
    }
  }

  function runtimeContract(runtime) {
    var status = runtimeStatus(runtime);
    return status && status.contract ? String(status.contract) : "";
  }

  function runtimeSurfaceCapability(runtime) {
    var status = runtimeStatus(runtime);
    return status && status[RUNTIME_SURFACE_CAPABILITY_FIELD]
      ? String(status[RUNTIME_SURFACE_CAPABILITY_FIELD])
      : "";
  }

  function runtimeIsPubliclyAccepted(runtime) {
    return runtimeContract(runtime) === RUNTIME_EXPECTED_CONTRACT;
  }

  function runtimeHasSurfaceCapability(runtime) {
    return runtimeSurfaceCapability(runtime) === RUNTIME_SURFACE_CAPABILITY_MARKER;
  }

  function runtimeIsFullyAccepted(runtime) {
    return runtimeIsPubliclyAccepted(runtime) && runtimeHasSurfaceCapability(runtime);
  }

  function markBoot() {
    window.AUDRALIA_G2_ROUTE_JS_BOOT_MARKER = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      previousRuntimeCacheKey: PREVIOUS_RUNTIME_CACHE_KEY,
      runtimeSurfaceCapabilityField: RUNTIME_SURFACE_CAPABILITY_FIELD,
      runtimeSurfaceCapabilityMarker: RUNTIME_SURFACE_CAPABILITY_MARKER,
      standard: STANDARD,
      reached: true,
      reachedAt: new Date().toISOString(),
      meaning: "Route JS evaluated. Runtime now fetches by surface-aware v6 cache key and draws Gratitude surface before clouds."
    };

    window.AUDRALIA_G2_ROUTE_JS_CONTRACT = CONTRACT;

    setDataset("audraliaRouteJsBootMarker", "reached");
    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaRouteJsPreviousContract", PREVIOUS_CONTRACT);
    setDataset("audraliaRuntimeExpectedContract", RUNTIME_EXPECTED_CONTRACT);
    setDataset("audraliaRuntimeCacheKey", RUNTIME_CACHE_KEY);
    setDataset("audraliaRuntimeCacheKeySeparated", "true");
    setDataset("audraliaRuntimeExpectedContractPreserved", "true");
    setDataset("audraliaRuntimeSurfaceCapabilityField", RUNTIME_SURFACE_CAPABILITY_FIELD);
    setDataset("audraliaRuntimeSurfaceCapabilityMarker", RUNTIME_SURFACE_CAPABILITY_MARKER);
    setDataset("audraliaSurfaceRendererExpected", "true");
    setDataset("audraliaSurfaceDrawsBeforeClouds", "true");
    setDataset("audraliaCloudsRenderAboveSurface", "true");
    setDataset("audraliaLatticeViewProtected", "true");
    setDataset("audraliaPlanetViewCloudsOnly", "true");
    setDataset("audraliaLatticeViewCloudsBlocked", "true");
    setDataset("audraliaLatticeViewSurfaceBlocked", "true");

    setText("[data-audralia-diagnostic-route-js]", "route JS booted · surface runtime key active");
    setText("[data-audralia-diagnostic-sphere]", "runtime v6 fetch key pending");
    setText("[data-audralia-diagnostic-planet]", "Planet View pending Gratitude surface");
    setText("[data-audralia-diagnostic-lattice]", "Lattice View protected");
    setText("[data-audralia-diagnostic-seats]", "16 × 16 / 256 expected");
    setText("[data-audralia-diagnostic-loader]", "runtime surface-renderer cache key preparing");
  }

  markBoot();

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    setDataset("audraliaRouteJsErrorScope", scope);
    setDataset("audraliaRouteJsError", message);

    setText("[data-audralia-diagnostic-route-js]", "error · " + scope);
    setText("[data-audralia-diagnostic-sphere]", state.runtimeDetected ? "runtime detected before error" : "runtime not detected");
    setText("[data-audralia-diagnostic-planet]", message);
    setText("[data-audralia-diagnostic-lattice]", "protected · not rewritten");

    publishStatus("error:" + scope);
  }

  function removePriorRuntimeLoaders() {
    var loaders = document.querySelectorAll("script[data-audralia-runtime-loader]");

    for (var i = 0; i < loaders.length; i += 1) {
      var loader = loaders[i];
      var key = loader.getAttribute("data-runtime-cache-key") || loader.getAttribute("data-runtime-contract") || "";

      if (key !== RUNTIME_CACHE_KEY) {
        try { loader.remove(); } catch (_error) {}
      }
    }
  }

  function loadRuntime() {
    return new Promise(function (resolve, reject) {
      var existing = getRuntime();

      if (runtimeIsFullyAccepted(existing)) {
        state.runtime = existing;
        state.runtimeDetected = true;
        state.runtimeLoaded = true;
        state.runtimeAcceptedByPublicContract = true;
        state.runtimeSurfaceCapabilityConfirmed = true;
        state.runtimeFetchKeyCurrent = true;
        resolve(existing);
        return;
      }

      if (state.runtimeLoadStarted) {
        var attempts = 0;
        var interval = window.setInterval(function () {
          attempts += 1;

          var runtime = getRuntime();

          if (runtimeIsFullyAccepted(runtime)) {
            window.clearInterval(interval);
            state.runtime = runtime;
            state.runtimeDetected = true;
            state.runtimeLoaded = true;
            state.runtimeAcceptedByPublicContract = true;
            state.runtimeSurfaceCapabilityConfirmed = true;
            state.runtimeFetchKeyCurrent = true;
            resolve(runtime);
          }

          if (attempts > 120) {
            window.clearInterval(interval);
            reject(new Error("AUDRALIA_RUNTIME_SURFACE_CAPABILITY_WAIT_TIMEOUT"));
          }
        }, 50);

        return;
      }

      state.runtimeLoadStarted = true;
      state.runtimeCacheKeySeparated = true;
      state.runtimeExpectedContractPreserved = true;

      setDataset("audraliaRuntimeLoadStarted", "true");
      setDataset("audraliaRuntimeExpectedContract", RUNTIME_EXPECTED_CONTRACT);
      setDataset("audraliaRuntimeCacheKey", RUNTIME_CACHE_KEY);
      setDataset("audraliaRuntimeCacheKeySeparated", "true");
      setDataset("audraliaRuntimeSurfaceCapabilityMarker", RUNTIME_SURFACE_CAPABILITY_MARKER);
      setText("[data-audralia-diagnostic-loader]", "loading runtime with surface renderer v6 cache key");

      removePriorRuntimeLoaders();

      var script = document.createElement("script");
      script.src = RUNTIME_PATH + "?v=" + encodeURIComponent(RUNTIME_CACHE_KEY);
      script.async = true;
      script.defer = true;
      script.setAttribute("data-audralia-runtime-loader", CONTRACT);
      script.setAttribute("data-runtime-expected-contract", RUNTIME_EXPECTED_CONTRACT);
      script.setAttribute("data-runtime-cache-key", RUNTIME_CACHE_KEY);
      script.setAttribute("data-previous-runtime-cache-key", PREVIOUS_RUNTIME_CACHE_KEY);
      script.setAttribute("data-runtime-surface-capability-field", RUNTIME_SURFACE_CAPABILITY_FIELD);
      script.setAttribute("data-runtime-surface-capability-marker", RUNTIME_SURFACE_CAPABILITY_MARKER);

      script.onload = function () {
        var runtime = getRuntime();

        if (!runtimeIsPubliclyAccepted(runtime)) {
          reject(new Error("AUDRALIA_RUNTIME_LOADED_BUT_PUBLIC_CONTRACT_REJECTED_" + runtimeContract(runtime)));
          return;
        }

        if (!runtimeHasSurfaceCapability(runtime)) {
          reject(new Error("AUDRALIA_RUNTIME_LOADED_BUT_SURFACE_CAPABILITY_MISSING_" + runtimeSurfaceCapability(runtime)));
          return;
        }

        state.runtime = runtime;
        state.runtimeDetected = true;
        state.runtimeLoaded = true;
        state.runtimeAcceptedByPublicContract = true;
        state.runtimeSurfaceCapabilityConfirmed = true;
        state.runtimeFetchKeyCurrent = true;

        setDataset("audraliaRuntimeLoaded", "true");
        setDataset("audraliaRuntimeAcceptedByPublicContract", "true");
        setDataset("audraliaRuntimeSurfaceCapabilityConfirmed", "true");
        setDataset("audraliaRuntimeFetchKeyCurrent", "true");
        setText("[data-audralia-diagnostic-loader]", "runtime v6 surface renderer key loaded");

        resolve(runtime);
      };

      script.onerror = function () {
        reject(new Error("AUDRALIA_RUNTIME_SURFACE_RENDERER_SCRIPT_LOAD_FAILED"));
      };

      document.head.appendChild(script);
    });
  }

  function locateDom() {
    state.stage =
      document.querySelector("#audraliaGlobeStage") ||
      document.querySelector("[data-audralia-globe-stage]") ||
      document.querySelector("[data-audralia-stage]");

    state.mount =
      document.querySelector("#audraliaGlobeMount") ||
      document.querySelector("[data-audralia-globe-mount]") ||
      document.querySelector("[data-audralia-canonical-visual-mount]") ||
      document.querySelector("[data-audralia-canvas-mount]");

    state.diagnosticMount =
      document.querySelector("#audraliaDiagnosticMount") ||
      document.querySelector("[data-audralia-diagnostic-mount]");

    state.diagnosticScopeReady = Boolean(state.diagnosticMount);

    if (!state.stage || !state.mount) {
      throw new Error("AUDRALIA_ROUTE_DOM_MISSING_STAGE_OR_MOUNT");
    }

    setDataset("audraliaRouteDomLocated", "true");
  }

  function neutralizeDuplicateCanvases() {
    if (!state.mount || !state.canvas) return;

    var canvases = state.mount.querySelectorAll("canvas");
    var duplicateCount = 0;

    for (var i = 0; i < canvases.length; i += 1) {
      var canvas = canvases[i];

      if (canvas === state.canvas) continue;

      duplicateCount += 1;
      canvas.setAttribute("data-audralia-duplicate-neutralized", "true");
      canvas.style.display = "none";
      canvas.style.visibility = "hidden";
      canvas.style.pointerEvents = "none";

      try { canvas.remove(); } catch (_error) {}
    }

    state.duplicateCanvasCount += duplicateCount;
  }

  function createCanvas() {
    var canvas = state.mount.querySelector("canvas[data-audralia-runtime-consumer-canvas]");

    if (!canvas) {
      canvas = document.createElement("canvas");
      state.mount.appendChild(canvas);
    }

    canvas.setAttribute("data-audralia-runtime-consumer-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("data-runtime-expected-contract", RUNTIME_EXPECTED_CONTRACT);
    canvas.setAttribute("data-runtime-cache-key", RUNTIME_CACHE_KEY);
    canvas.setAttribute("data-runtime-surface-capability-marker", RUNTIME_SURFACE_CAPABILITY_MARKER);
    canvas.setAttribute("data-globe-carrier", "runtime-sphere");
    canvas.setAttribute("data-flat-projection-blocked", "true");
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-lattice-view-protected", "true");
    canvas.setAttribute("data-planet-view-clouds-only", "true");
    canvas.setAttribute("data-surface-rendered-before-clouds", "true");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.pointerEvents = "none";

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
    state.canvasReady = Boolean(state.ctx);

    if (!state.canvasReady) {
      throw new Error("AUDRALIA_ROUTE_CANVAS_2D_CONTEXT_UNAVAILABLE");
    }

    neutralizeDuplicateCanvases();

    if (typeof MutationObserver === "function") {
      var observer = new MutationObserver(function () {
        neutralizeDuplicateCanvases();
      });

      observer.observe(state.mount, { childList: true, subtree: false });
    }

    setDataset("audraliaCanonicalCanvasReady", "true");
  }

  function resizeCanvas() {
    if (!state.canvas || !state.ctx || !state.mount) return;

    var box = state.mount.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var width = Math.max(320, Math.floor((box.width || 640) * dpr));
    var height = Math.max(620, Math.floor((box.height || 720) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.dpr = dpr;

    if (state.runtime && typeof state.runtime.resize === "function") {
      state.runtime.resize(width, height, dpr);
    }

    state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function clear() {
    if (!state.ctx || !state.canvas) return;
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  }

  function drawLimb(ctx, frame, alpha) {
    var metrics = frame.metrics;
    var radius = metrics.radius;

    ctx.save();

    var glow = ctx.createRadialGradient(
      metrics.centerX - radius * 0.22,
      metrics.centerY - radius * 0.30,
      radius * 0.08,
      metrics.centerX,
      metrics.centerY,
      radius * 1.18
    );

    glow.addColorStop(0, "rgba(255,255,255,0.22)");
    glow.addColorStop(0.30, "rgba(141,216,255,0.12)");
    glow.addColorStop(0.70, "rgba(28,88,150,0.05)");
    glow.addColorStop(1, "rgba(141,216,255,0)");

    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius * 1.18, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(141,216,255,0.42)";
    ctx.lineWidth = 1.5 * state.dpr;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  function clipSphere(ctx, frame) {
    var metrics = frame.metrics;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.clip();
  }

  function drawPlanetBody(ctx, frame) {
    var metrics = frame.metrics;
    var radius = metrics.radius;

    ctx.save();

    var body = ctx.createRadialGradient(
      metrics.centerX - radius * 0.30,
      metrics.centerY - radius * 0.34,
      radius * 0.06,
      metrics.centerX,
      metrics.centerY,
      radius
    );

    body.addColorStop(0, "rgba(236,250,255,0.94)");
    body.addColorStop(0.13, "rgba(118,206,226,0.74)");
    body.addColorStop(0.34, "rgba(20,116,164,0.88)");
    body.addColorStop(0.68, "rgba(7,48,94,0.98)");
    body.addColorStop(1, "rgba(1,8,24,1)");

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius, 0, TAU);
    ctx.fill();

    ctx.save();
    clipSphere(ctx, frame);

    var oceanPressure = ctx.createRadialGradient(
      metrics.centerX + radius * 0.10,
      metrics.centerY + radius * 0.16,
      radius * 0.10,
      metrics.centerX,
      metrics.centerY,
      radius
    );

    oceanPressure.addColorStop(0, "rgba(24,128,176,0.14)");
    oceanPressure.addColorStop(0.45, "rgba(7,72,126,0.18)");
    oceanPressure.addColorStop(1, "rgba(0,4,16,0.30)");

    ctx.fillStyle = oceanPressure;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius, 0, TAU);
    ctx.fill();

    var shade = ctx.createLinearGradient(
      metrics.centerX - radius,
      metrics.centerY - radius,
      metrics.centerX + radius,
      metrics.centerY + radius
    );

    shade.addColorStop(0, "rgba(255,255,255,0.14)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.018)");
    shade.addColorStop(0.72, "rgba(0,0,0,0.24)");
    shade.addColorStop(1, "rgba(0,0,0,0.58)");

    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius, 0, TAU);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  function drawSurfaceLayer(ctx, frame) {
    if (state.activeLens !== "planet") return null;

    var surfaceApi = getSurfaceApi();

    if (!surfaceApi || typeof surfaceApi.render !== "function") {
      state.surfaceRendererReady = false;
      state.surfaceLoaded = false;
      return null;
    }

    try {
      var layer = surfaceApi.render(ctx, frame, {
        activeLens: "planet",
        protectedLattice: true,
        drawBeforeClouds: true
      });

      state.surfaceLoaded = true;
      state.surfaceRendererReady = Boolean(layer && layer.surfaceRendererReady);
      state.gratitudeContinentVisible = Boolean(layer && layer.gratitudeContinentVisible);
      state.surfaceRenderedBeforeClouds = true;

      return layer;
    } catch (error) {
      recordError("surface-render", error);
      return null;
    }
  }

  function drawMoistureCloudLayer(ctx, frame) {
    if (state.activeLens !== "planet") return null;

    var cloudApi = getCloudApi();

    if (!cloudApi || typeof cloudApi.render !== "function") {
      state.cloudRendererReady = false;
      return null;
    }

    try {
      var layer = cloudApi.render(ctx, frame, {
        activeLens: "planet",
        protectedLattice: true,
        renderAboveSurface: true
      });

      state.cloudRendererReady = Boolean(layer && layer.rendererReady);
      state.moistureFieldReady = Boolean(layer && layer.moistureFieldReady);
      state.cloudsRenderAboveSurface = true;

      return layer;
    } catch (error) {
      recordError("cloud-render", error);
      return null;
    }
  }

  function drawPlanetView(ctx, frame) {
    drawPlanetBody(ctx, frame);

    var surfaceLayer = drawSurfaceLayer(ctx, frame);
    var cloudLayer = drawMoistureCloudLayer(ctx, frame);

    drawLimb(ctx, frame, 1);

    state.planetViewReady = true;

    return {
      surfaceLayer: surfaceLayer,
      cloudLayer: cloudLayer
    };
  }

  function drawLink(ctx, link, type) {
    var a = link.a;
    var b = link.b;
    var front = link.frontFacing;
    var major = Boolean(link.major);

    var alpha = front ? 0.55 : 0.07;
    var width = front ? 1.0 : 0.55;
    var color = front ? "rgba(130,222,255,1)" : "rgba(70,120,170,1)";

    if (type === "spine") {
      alpha = front ? (major ? 0.90 : 0.54) : 0.07;
      width = major ? 1.65 : 0.95;
      color = major ? "rgba(255,218,128,1)" : "rgba(152,232,255,1)";
    }

    if (type === "ring") {
      alpha = front ? (major ? 0.68 : 0.46) : 0.07;
      width = major ? 1.28 : 0.84;
      color = major ? "rgba(255,220,140,1)" : "rgba(116,214,255,1)";
    }

    if (type === "fibonacci") {
      alpha = front ? (major ? 0.40 : 0.20) : 0.035;
      width = major ? 1.10 : 0.62;
      color = major ? "rgba(255,190,82,1)" : "rgba(172,236,255,1)";
    }

    if (alpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = alpha * Math.max(a.visibility || 0.1, b.visibility || 0.1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width * state.dpr;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.screen.x, a.screen.y);
    ctx.lineTo(b.screen.x, b.screen.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawSeat(ctx, seat) {
    var cardinal = seat.radialIndex % 4 === 0;
    var even = seat.radialIndex % 2 === 0;
    var front = seat.frontFacing;

    var alpha = front
      ? cardinal ? 0.98 : even ? 0.72 : 0.46
      : cardinal ? 0.10 : 0.035;

    if (alpha <= 0.025) return;

    var radius = (cardinal ? 3.8 : even ? 2.7 : 1.85) * state.dpr * seat.screen.perspective;

    ctx.save();
    ctx.globalAlpha = alpha * seat.visibility;
    ctx.fillStyle = cardinal ? "rgba(255,218,120,1)" : even ? "rgba(160,235,255,1)" : "rgba(94,174,230,1)";
    ctx.beginPath();
    ctx.arc(seat.screen.x, seat.screen.y, radius, 0, TAU);
    ctx.fill();

    if (front && cardinal) {
      ctx.globalAlpha *= 0.25;
      ctx.beginPath();
      ctx.arc(seat.screen.x, seat.screen.y, radius * 2.6, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLattice(ctx, frame) {
    ctx.save();

    var metrics = frame.metrics;
    var radius = metrics.radius;

    var ghost = ctx.createRadialGradient(
      metrics.centerX - radius * 0.24,
      metrics.centerY - radius * 0.30,
      radius * 0.06,
      metrics.centerX,
      metrics.centerY,
      radius
    );

    ghost.addColorStop(0, "rgba(194,240,255,0.12)");
    ghost.addColorStop(0.48, "rgba(30,90,150,0.07)");
    ghost.addColorStop(1, "rgba(0,0,0,0.01)");

    ctx.fillStyle = ghost;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, radius, 0, TAU);
    ctx.fill();

    ctx.restore();

    drawLimb(ctx, frame, 0.92);

    var links = frame.projectedLinks || {};
    var ringLinks = links.ringLinks || [];
    var spineLinks = links.spineLinks || [];
    var fibonacciLinks = links.fibonacciLinks || [];
    var seats = frame.projectedSeats || [];

    for (var i = 0; i < ringLinks.length; i += 1) drawLink(ctx, ringLinks[i], "ring");
    for (var j = 0; j < spineLinks.length; j += 1) drawLink(ctx, spineLinks[j], "spine");
    for (var k = 0; k < fibonacciLinks.length; k += 1) drawLink(ctx, fibonacciLinks[k], "fibonacci");
    for (var n = 0; n < seats.length; n += 1) drawSeat(ctx, seats[n]);

    state.latticeViewReady = true;
    state.latticeViewProtected = true;
  }

  function render() {
    try {
      if (!state.ctx || !state.canvas || !state.runtime) return;

      resizeCanvas();

      var frame = state.runtime.tick(performance.now());
      clear();

      var layers = {
        surfaceLayer: null,
        cloudLayer: null
      };

      if (state.activeLens === "lattice") {
        drawLattice(state.ctx, frame);
      } else if (state.activeLens === "diagnostic") {
        drawLattice(state.ctx, frame);
      } else {
        layers = drawPlanetView(state.ctx, frame) || layers;
      }

      state.renderCount += 1;

      updateDiagnostics(frame, layers.surfaceLayer, layers.cloudLayer);
      publishStatus("render", frame, layers.surfaceLayer, layers.cloudLayer);
    } catch (error) {
      recordError("render", error);
    }
  }

  function loop() {
    render();
    state.raf = window.requestAnimationFrame(loop);
  }

  function setLens(nextLens) {
    var lens = LENS_COPY[nextLens] ? nextLens : "planet";

    state.activeLens = lens;
    setDataset("audraliaActiveLens", lens);

    if (state.runtime && typeof state.runtime.setLens === "function") {
      state.runtime.setLens(lens);
    }

    var buttons = document.querySelectorAll("[data-audralia-lens-button]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute("aria-pressed", buttons[i].dataset.audraliaLensButton === lens ? "true" : "false");
    }

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    render();
  }

  function bindLensControls() {
    var buttons = document.querySelectorAll("[data-audralia-lens-button]");

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function (event) {
        setLens(event.currentTarget.dataset.audraliaLensButton);
      });
    }

    window.addEventListener("audralia:lens", function (event) {
      var lens = event && event.detail && event.detail.activeLens
        ? event.detail.activeLens
        : document.documentElement.dataset.audraliaActiveLens;

      if (lens && lens !== state.activeLens) setLens(lens);
    });

    setLens(document.documentElement.dataset.audraliaActiveLens || "planet");
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", function (event) {
      state.dragging = true;

      if (state.runtime && typeof state.runtime.pointerDown === "function") {
        state.runtime.pointerDown(event.clientX, event.clientY, performance.now());
      }

      try {
        if (state.stage.setPointerCapture) state.stage.setPointerCapture(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;

      if (state.runtime && typeof state.runtime.pointerMove === "function") {
        state.runtime.pointerMove(event.clientX, event.clientY, performance.now());
      }

      try { event.preventDefault(); } catch (_error) {}
    }, { passive: false });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;

      if (state.runtime && typeof state.runtime.pointerUp === "function") {
        state.runtime.pointerUp(performance.now());
      }

      try {
        if (state.stage.releasePointerCapture) state.stage.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
    state.stage.addEventListener("pointerleave", release, { passive: true });
  }

  function updateDiagnostics(frame, surfaceLayer, cloudLayer) {
    var runtimeStatusValue = state.runtime && typeof state.runtime.status === "function"
      ? state.runtime.status()
      : null;

    var terrainApi = getTerrainEcosystemApi();
    var terrainStatus = terrainApi && typeof terrainApi.status === "function" ? terrainApi.status() : null;

    var moistureApi = getMoistureApi();
    var moistureStatus = moistureApi && typeof moistureApi.status === "function" ? moistureApi.status() : null;

    var surfaceApi = getSurfaceApi();
    var surfaceStatus = surfaceApi && typeof surfaceApi.status === "function" ? surfaceApi.status() : null;

    var cloudApi = getCloudApi();
    var cloudStatus = cloudApi && typeof cloudApi.status === "function" ? cloudApi.status() : null;

    state.terrainEcosystemReady = Boolean(
      (frame && frame.terrainEcosystemReady) ||
      (runtimeStatusValue && runtimeStatusValue.terrainEcosystemReady) ||
      (terrainStatus && terrainStatus.fieldReady)
    );

    state.terrainEcosystemLoaded = Boolean(
      (frame && frame.terrainEcosystemLoaded) ||
      (runtimeStatusValue && runtimeStatusValue.terrainEcosystemLoaded)
    );

    state.terrainForcingDrivesMoisture = Boolean(
      (frame && frame.terrainForcingDrivesMoisture) ||
      (runtimeStatusValue && runtimeStatusValue.terrainForcingDrivesMoisture)
    );

    state.moistureDerivedFromTerrainForcing = Boolean(
      (moistureStatus && moistureStatus.moistureDerivedFromTerrainForcing) ||
      (moistureStatus && moistureStatus.terrainForcingConsumed)
    );

    state.moistureFieldReady = Boolean(
      (cloudLayer && cloudLayer.moistureFieldReady) ||
      (runtimeStatusValue && runtimeStatusValue.moistureFieldReady) ||
      (moistureStatus && moistureStatus.moistureFieldReady)
    );

    state.surfaceLoaded = Boolean(
      (runtimeStatusValue && runtimeStatusValue.surfaceLoaded) ||
      (surfaceStatus && surfaceStatus.initialized) ||
      surfaceLayer
    );

    state.surfaceRendererReady = Boolean(
      (surfaceLayer && surfaceLayer.surfaceRendererReady) ||
      (runtimeStatusValue && runtimeStatusValue.surfaceRendererReady) ||
      (surfaceStatus && surfaceStatus.surfaceRendererReady)
    );

    state.gratitudeContinentVisible = Boolean(
      (surfaceLayer && surfaceLayer.gratitudeContinentVisible) ||
      (runtimeStatusValue && runtimeStatusValue.gratitudeContinentVisible) ||
      (surfaceStatus && surfaceStatus.gratitudeContinentVisible)
    );

    state.surfaceRenderedBeforeClouds = Boolean(surfaceLayer && state.activeLens === "planet");

    state.cloudRendererReady = Boolean(
      (cloudLayer && cloudLayer.rendererReady) ||
      (runtimeStatusValue && runtimeStatusValue.cloudRendererReady) ||
      (cloudStatus && cloudStatus.rendererReady)
    );

    state.runtimeFetchKeyCurrent = Boolean(
      runtimeStatusValue &&
      runtimeStatusValue[RUNTIME_SURFACE_CAPABILITY_FIELD] === RUNTIME_SURFACE_CAPABILITY_MARKER
    );

    state.runtimeSurfaceCapabilityConfirmed = state.runtimeFetchKeyCurrent;

    setText("[data-audralia-diagnostic-route-js]", "active · Gratitude surface route consumer");
    setText(
      "[data-audralia-diagnostic-sphere]",
      runtimeStatusValue && runtimeStatusValue.sphereSeats === 256
        ? "runtime accepted · 256 seats · surface v6 " + (state.runtimeFetchKeyCurrent ? "confirmed" : "unconfirmed")
        : "runtime detected · sphere pending"
    );
    setText(
      "[data-audralia-diagnostic-planet]",
      state.gratitudeContinentVisible
        ? "active · Gratitude continent surface under clouds"
        : "Planet View active · Gratitude surface pending"
    );
    setText(
      "[data-audralia-diagnostic-lattice]",
      state.latticeViewReady ? "protected · spherical runtime lattice" : "protected · held baseline"
    );
    setText(
      "[data-audralia-diagnostic-seats]",
      runtimeStatusValue
        ? runtimeStatusValue.radialNodes + " × " + runtimeStatusValue.fibonacciBands + " = " + runtimeStatusValue.sphereSeats
        : "runtime status pending"
    );
    setText(
      "[data-audralia-diagnostic-loader]",
      "runtimeCache=" + RUNTIME_CACHE_KEY +
      " · surface=" + (state.surfaceRendererReady ? "ready" : "pending") +
      " · gratitude=" + (state.gratitudeContinentVisible ? "visible" : "pending") +
      " · clouds=" + (state.cloudRendererReady ? "above" : "pending") +
      " · surfaceCells=" + (surfaceLayer && surfaceLayer.visibleCellCount != null ? surfaceLayer.visibleCellCount : 0) +
      " · cloudCount=" + (cloudLayer && cloudLayer.cloudCount != null ? cloudLayer.cloudCount : 0)
    );

    setDataset("audraliaRuntimeDetected", state.runtimeDetected ? "true" : "false");
    setDataset("audraliaRuntimeLoaded", state.runtimeLoaded ? "true" : "false");
    setDataset("audraliaRuntimeExpectedContract", RUNTIME_EXPECTED_CONTRACT);
    setDataset("audraliaRuntimeCacheKey", RUNTIME_CACHE_KEY);
    setDataset("audraliaRuntimeCacheKeySeparated", "true");
    setDataset("audraliaRuntimeAcceptedByPublicContract", state.runtimeAcceptedByPublicContract ? "true" : "false");
    setDataset("audraliaRuntimeFetchKeyCurrent", state.runtimeFetchKeyCurrent ? "true" : "false");
    setDataset("audraliaRuntimeSurfaceCapabilityConfirmed", state.runtimeSurfaceCapabilityConfirmed ? "true" : "false");

    setDataset("audraliaRouteRenderCount", String(state.renderCount));
    setDataset("audraliaTerrainEcosystemLoaded", state.terrainEcosystemLoaded ? "true" : "false");
    setDataset("audraliaTerrainEcosystemReady", state.terrainEcosystemReady ? "true" : "false");
    setDataset("audraliaTerrainForcingDrivesMoisture", state.terrainForcingDrivesMoisture ? "true" : "false");
    setDataset("audraliaMoistureDerivedFromTerrainForcing", state.moistureDerivedFromTerrainForcing ? "true" : "false");
    setDataset("audraliaMoistureFieldReady", state.moistureFieldReady ? "true" : "false");
    setDataset("audraliaSurfaceLoaded", state.surfaceLoaded ? "true" : "false");
    setDataset("audraliaSurfaceRendererReady", state.surfaceRendererReady ? "true" : "false");
    setDataset("audraliaGratitudeContinentVisible", state.gratitudeContinentVisible ? "true" : "false");
    setDataset("audraliaSurfaceRenderedBeforeClouds", state.surfaceRenderedBeforeClouds ? "true" : "false");
    setDataset("audraliaCloudRendererReady", state.cloudRendererReady ? "true" : "false");
    setDataset("audraliaCloudsRenderAboveSurface", state.cloudsRenderAboveSurface ? "true" : "false");
    setDataset("audraliaPlanetViewCloudsOnly", "true");
    setDataset("audraliaLatticeViewProtected", "true");
    setDataset("audraliaLatticeViewCloudsBlocked", "true");
    setDataset("audraliaLatticeViewSurfaceBlocked", "true");

    if (frame) {
      setDataset("audraliaRuntimeFrameIndex", String(frame.frameIndex || 0));
      setDataset("audraliaRuntimeSphereSeats", String(frame.sphereSeats || 0));
    }

    if (surfaceLayer) {
      setDataset("audraliaSurfaceVisibleCellCount", String(surfaceLayer.visibleCellCount || 0));
      setDataset("audraliaSurfaceGratitudeCellCount", String(surfaceLayer.gratitudeCellCount || 0));
      setDataset("audraliaSurfaceHydrologyHintCount", String(surfaceLayer.hydrologyHintCount || 0));
    }

    if (cloudLayer) {
      setDataset("audraliaCloudCount", String(cloudLayer.cloudCount || 0));
      setDataset("audraliaCloudFragmentCount", String(cloudLayer.fragmentCount || 0));
    }
  }

  function status() {
    var runtimeStatusValue = state.runtime && typeof state.runtime.status === "function" ? state.runtime.status() : null;

    var terrainApi = getTerrainEcosystemApi();
    var terrainStatus = terrainApi && typeof terrainApi.status === "function" ? terrainApi.status() : null;

    var moistureApi = getMoistureApi();
    var moistureStatus = moistureApi && typeof moistureApi.status === "function" ? moistureApi.status() : null;

    var surfaceApi = getSurfaceApi();
    var surfaceStatus = surfaceApi && typeof surfaceApi.status === "function" ? surfaceApi.status() : null;

    var cloudApi = getCloudApi();
    var cloudStatus = cloudApi && typeof cloudApi.status === "function" ? cloudApi.status() : null;

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      standard: STANDARD,
      route: "/showroom/globe/audralia/",

      runtimePath: RUNTIME_PATH,
      runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      previousRuntimeCacheKey: PREVIOUS_RUNTIME_CACHE_KEY,
      runtimeSurfaceCapabilityField: RUNTIME_SURFACE_CAPABILITY_FIELD,
      runtimeSurfaceCapabilityMarker: RUNTIME_SURFACE_CAPABILITY_MARKER,
      runtimeCacheKeySeparated: state.runtimeCacheKeySeparated,
      runtimeExpectedContractPreserved: state.runtimeExpectedContractPreserved,
      runtimeAcceptedByPublicContract: state.runtimeAcceptedByPublicContract,
      runtimeSurfaceCapabilityConfirmed: state.runtimeSurfaceCapabilityConfirmed,
      runtimeFetchKeyCurrent: state.runtimeFetchKeyCurrent,

      runtimeDetected: state.runtimeDetected,
      runtimeLoaded: state.runtimeLoaded,
      runtimeStatus: runtimeStatusValue,

      routeReady: state.routeReady,
      canvasReady: state.canvasReady,
      activeLens: state.activeLens,
      renderCount: state.renderCount,

      planetViewReady: state.planetViewReady,
      latticeViewReady: state.latticeViewReady,
      latticeViewProtected: state.latticeViewProtected,
      diagnosticScopeReady: state.diagnosticScopeReady,

      terrainEcosystemLoaded: state.terrainEcosystemLoaded,
      terrainEcosystemReady: state.terrainEcosystemReady,
      terrainForcingDrivesMoisture: state.terrainForcingDrivesMoisture,
      terrainStatus: terrainStatus,

      moistureDerivedFromTerrainForcing: state.moistureDerivedFromTerrainForcing,
      moistureFieldReady: state.moistureFieldReady,
      moistureStatus: moistureStatus,

      surfaceLoaded: state.surfaceLoaded,
      surfaceRendererReady: state.surfaceRendererReady,
      gratitudeContinentVisible: state.gratitudeContinentVisible,
      surfaceRenderedBeforeClouds: state.surfaceRenderedBeforeClouds,
      surfaceStatus: surfaceStatus,

      cloudRendererReady: state.cloudRendererReady,
      cloudsRenderAboveSurface: state.cloudsRenderAboveSurface,
      cloudStatus: cloudStatus,

      duplicateCanvas: state.duplicateCanvasCount > 0,
      duplicateCanvasCount: state.duplicateCanvasCount,

      generatedImage: false,
      graphicBox: false,
      flatProjectionBlocked: true,
      cssRingProof: false,
      visibleLegacyHandoff: false,
      earthCrossover: false,
      australiaNamingDrift: false,

      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      latticeViewSurfaceBlocked: true,

      errors: state.errors.slice()
    };
  }

  function publishStatus(scope, frame, surfaceLayer, cloudLayer) {
    var payload = status();
    payload.scope = scope || "publish";
    payload.updatedAt = new Date().toISOString();

    if (frame) {
      payload.frame = {
        frameIndex: frame.frameIndex,
        activeLens: frame.activeLens,
        sphereSeats: frame.sphereSeats,
        radialNodes: frame.radialNodes,
        fibonacciBands: frame.fibonacciBands,
        latticeStates: frame.latticeStates,
        surfaceLoaded: frame.surfaceLoaded,
        surfaceRendererReady: frame.surfaceRendererReady,
        gratitudeContinentVisible: frame.gratitudeContinentVisible
      };
    }

    if (surfaceLayer) {
      payload.surfaceLayer = {
        surfaceCellCount: surfaceLayer.surfaceCellCount,
        visibleCellCount: surfaceLayer.visibleCellCount,
        gratitudeCellCount: surfaceLayer.gratitudeCellCount,
        hydrologyHintCount: surfaceLayer.hydrologyHintCount,
        gratitudeContinentVisible: surfaceLayer.gratitudeContinentVisible,
        surfaceRendererReady: surfaceLayer.surfaceRendererReady
      };
    }

    if (cloudLayer) {
      payload.cloudLayer = {
        cloudCount: cloudLayer.cloudCount,
        fragmentCount: cloudLayer.fragmentCount,
        moistureEligibleCount: cloudLayer.moistureEligibleCount,
        averageCloudOpacity: cloudLayer.averageCloudOpacity,
        rendererReady: cloudLayer.rendererReady,
        cloudsDerivedFromMoisture: cloudLayer.cloudsDerivedFromMoisture,
        cloudsNotVisible256Grid: cloudLayer.cloudsNotVisible256Grid,
        globalCloudShellActive: cloudLayer.globalCloudShellActive
      };
    }

    window.AUDRALIA_G2_ROUTE_JS_CONSUMER_STATUS = payload;
    window.AUDRALIA_G2_TRUE_GLOBE_STATUS = payload;
    window.AUDRALIA_G2_GRATITUDE_SURFACE_ROUTE_STATUS = payload;

    return payload;
  }

  function publishApi() {
    window.AUDRALIA_G2_ROUTE_JS_CONSUMER = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      runtimeSurfaceCapabilityField: RUNTIME_SURFACE_CAPABILITY_FIELD,
      runtimeSurfaceCapabilityMarker: RUNTIME_SURFACE_CAPABILITY_MARKER,
      runtimePath: RUNTIME_PATH,
      setLens: setLens,
      render: render,
      status: status
    };

    return window.AUDRALIA_G2_ROUTE_JS_CONSUMER;
  }

  function initRuntime(runtime) {
    var box = state.mount.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var width = Math.max(320, Math.floor((box.width || 640) * dpr));
    var height = Math.max(620, Math.floor((box.height || 720) * dpr));

    runtime.init({
      activeLens: state.activeLens,
      width: width,
      height: height,
      dpr: dpr,
      reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });

    if (typeof runtime.ensureAtmosphereChildren === "function") {
      runtime.ensureAtmosphereChildren();
    }

    runtime.resize(width, height, dpr);
  }

  function init() {
    try {
      setText("[data-audralia-diagnostic-route-js]", "route JS init started");

      locateDom();
      createCanvas();

      loadRuntime()
        .then(function (runtime) {
          state.runtime = runtime;
          state.runtimeDetected = true;
          state.runtimeLoaded = true;
          state.runtimeAcceptedByPublicContract = true;
          state.runtimeSurfaceCapabilityConfirmed = true;

          setText("[data-audralia-diagnostic-route-js]", "runtime accepted · surface renderer v6 confirmed");

          initRuntime(runtime);

          bindLensControls();
          bindPointer();

          state.routeReady = true;

          setDataset("audraliaRouteReady", "true");
          setDataset("audraliaRuntimeExpectedContract", RUNTIME_EXPECTED_CONTRACT);
          setDataset("audraliaRuntimeCacheKey", RUNTIME_CACHE_KEY);
          setDataset("audraliaRuntimeCacheKeySeparated", "true");
          setDataset("audraliaRuntimeAcceptedByPublicContract", "true");
          setDataset("audraliaRuntimeSurfaceCapabilityConfirmed", "true");
          setDataset("audraliaSurfaceRendererExpected", "true");
          setDataset("audraliaSurfaceDrawsBeforeClouds", "true");
          setDataset("audraliaCloudsRenderAboveSurface", "true");
          setDataset("audraliaLatticeViewProtected", "true");

          updateDiagnostics(runtime.getFrame ? runtime.getFrame() : null, null, null);
          publishApi();
          publishStatus("init-complete");

          if (!state.raf) {
            state.raf = window.requestAnimationFrame(loop);
          }
        })
        .catch(function (error) {
          recordError("runtime-load", error);
        });
    } catch (error) {
      recordError("init", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
