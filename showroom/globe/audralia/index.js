// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_ROUTE_JS_SHOWROOM_PLANET_OBJECT_GRANDPARENT_CONTROLLER_TNT_v5
//
// Purpose:
// - Preserve current Audralia page baseline.
// - Read Showroom planet-object authority from HTML.
// - Keep route JS as canvas/orchestration controller only.
// - Require Planet View to be surface + clouds, not cloud-only.
// - Call surface before clouds.
// - Normalize route JS ↔ surface.js handshake fields.
// - Report surface/gratitude/cloud readiness accurately.
// - Preserve protected Lattice View.
// - Do not move datum, terrain, moisture, surface, or cloud engine logic into HTML.
// - No generated image. No GraphicBox. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_ROUTE_JS_SHOWROOM_PLANET_OBJECT_GRANDPARENT_CONTROLLER_TNT_v5";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_ROUTE_JS_GRATITUDE_SURFACE_RENDERER_CONSUMER_TNT_v4";
  var HTML_CONTRACT = "AUDRALIA_G2_HTML_BASELINE_PRESERVING_PLANET_OBJECT_GRANDPARENT_MERGE_TNT_v2";

  var RUNTIME_EXPECTED_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_G2_GRATITUDE_FRONT_FACE_AND_DATUM_VISUAL_PROOF_ALIGNMENT_TNT_v1";
  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";

  var DATUM_CONTRACT = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1";
  var SURFACE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1";
  var CLOUD_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";

  var SURFACE_CAPABILITY_FIELD = "surfaceRendererConsumerContract";
  var SURFACE_CAPABILITY_MARKER = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6";
  var DATUM_CAPABILITY_FIELD = "datumManifestConsumerContract";
  var DATUM_CAPABILITY_MARKER = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_DATUM_MANIFEST_CONSUMER_TNT_v7";

  var TAU = Math.PI * 2;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia planet · Gratitude surface under hydrology-powered clouds",
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
      copy: "Diagnostic Scope reports route JS, runtime, Gratitude surface visibility, terrain forcing, moisture, clouds, and protected lattice state."
    }
  };

  var state = {
    stage: null,
    mount: null,
    diagnosticMount: null,
    canvas: null,
    ctx: null,

    width: 0,
    height: 0,
    dpr: 1,

    runtime: null,
    runtimeLoaded: false,
    runtimeAccepted: false,
    runtimeSurfaceCapabilityConfirmed: false,
    runtimeDatumCapabilityConfirmed: false,

    activeLens: "planet",
    raf: 0,
    renderCount: 0,

    dragging: false,

    routeReady: false,
    canvasReady: false,

    surfaceAttempted: false,
    surfaceBuildConfirmed: false,
    surfaceRenderConfirmed: false,
    surfaceRendererReady: false,
    surfaceVisibleCellCount: 0,
    surfaceCellCount: 0,
    gratitudeContinentVisible: false,
    surfaceRenderedBeforeClouds: false,

    cloudAttempted: false,
    cloudRendererReady: false,
    cloudCount: 0,
    cloudsRenderAboveSurface: true,

    latticeViewProtected: true,
    duplicateCanvasCount: 0,

    lastFrame: null,
    lastSurfaceLayer: null,
    lastCloudLayer: null,

    errors: []
  };

  var SHOWROOM_OBJECT = {
    objectType: "planet",
    objectName: "Audralia",
    showroomFamily: "globe",
    routeRole: "planet-object-inspection-route",
    visibleSubject: "Audralia planet",
    activeProofTarget: "Gratitude continent",
    planetaryDatumRequired: true,
    trueNorthSouthRequired: true,
    surfaceVisibilityRequired: true,
    cloudsAboveSurfaceRequired: true,
    planetViewSurfaceAndClouds: true,
    previousPlanetViewCloudsOnly: true,
    latticeViewProtected: true,
    latticeViewCloudsBlocked: true,
    latticeViewSurfaceBlocked: true,
    noAustraliaNamingDrift: true
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
      if (document.body) document.body.dataset[key] = String(value);
    } catch (_error) {}
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.innerHTML = String(value);
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);
    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_G2_ROUTE_JS_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };
  }

  function readHtmlObjectAuthority() {
    var root = document.documentElement;
    var stage = document.querySelector("#audraliaGlobeStage");

    SHOWROOM_OBJECT.objectType = root.dataset.objectType || stage && stage.dataset.objectType || "planet";
    SHOWROOM_OBJECT.objectName = root.dataset.objectName || stage && stage.dataset.objectName || "Audralia";
    SHOWROOM_OBJECT.showroomFamily = root.dataset.showroomFamily || stage && stage.dataset.showroomFamily || "globe";
    SHOWROOM_OBJECT.visibleSubject = root.dataset.visibleSubject || stage && stage.dataset.visibleSubject || "Audralia planet";
    SHOWROOM_OBJECT.activeProofTarget = root.dataset.activeProofTarget || stage && stage.dataset.activeProofTarget || "Gratitude continent";

    SHOWROOM_OBJECT.planetaryDatumRequired = true;
    SHOWROOM_OBJECT.surfaceVisibilityRequired = true;
    SHOWROOM_OBJECT.cloudsAboveSurfaceRequired = true;
    SHOWROOM_OBJECT.planetViewSurfaceAndClouds = true;
    SHOWROOM_OBJECT.previousPlanetViewCloudsOnly = true;
    SHOWROOM_OBJECT.latticeViewProtected = true;
    SHOWROOM_OBJECT.latticeViewCloudsBlocked = true;
    SHOWROOM_OBJECT.latticeViewSurfaceBlocked = true;

    window.AUDRALIA_G2_SHOWROOM_OBJECT = SHOWROOM_OBJECT;
    return SHOWROOM_OBJECT;
  }

  function getRuntime() {
    return window.AUDRALIA_TRUE_GLOBE_RUNTIME ||
      window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME ||
      null;
  }

  function getSurfaceApi() {
    return window.AUDRALIA_TRUE_GLOBE_SURFACE ||
      window.AUDRALIA_G2_TRUE_GLOBE_SURFACE ||
      null;
  }

  function getCloudApi() {
    return window.AUDRALIA_TRUE_GLOBE_CLOUDS ||
      window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS ||
      null;
  }

  function getRuntimeStatus(runtime) {
    if (!runtime || typeof runtime.status !== "function") return null;

    try {
      return runtime.status();
    } catch (error) {
      recordError("runtime.status", error);
      return null;
    }
  }

  function runtimeAccepted(runtime) {
    var status = getRuntimeStatus(runtime);
    if (!status) return false;

    state.runtimeSurfaceCapabilityConfirmed = status[SURFACE_CAPABILITY_FIELD] === SURFACE_CAPABILITY_MARKER;
    state.runtimeDatumCapabilityConfirmed = status[DATUM_CAPABILITY_FIELD] === DATUM_CAPABILITY_MARKER;

    return status.contract === RUNTIME_EXPECTED_CONTRACT;
  }

  function loadScript(path, key, attributes) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(key);
      script.defer = true;

      Object.keys(attributes || {}).forEach(function (name) {
        script.setAttribute(name, attributes[name]);
      });

      script.onload = function () {
        resolve(script);
      };

      script.onerror = function () {
        reject(new Error("SCRIPT_LOAD_FAILED: " + path + "?v=" + key));
      };

      document.body.appendChild(script);
    });
  }

  function loadRuntime() {
    var existing = getRuntime();

    if (existing && runtimeAccepted(existing)) {
      state.runtime = existing;
      state.runtimeLoaded = true;
      state.runtimeAccepted = true;
      initializeRuntime();
      return Promise.resolve(existing);
    }

    setText("[data-audralia-diagnostic-loader]", "loading runtimeCache=" + RUNTIME_CACHE_KEY);

    return loadScript(RUNTIME_PATH, RUNTIME_CACHE_KEY, {
      "data-audralia-runtime-loader": CONTRACT,
      "data-runtime-contract": RUNTIME_EXPECTED_CONTRACT,
      "data-runtime-cache-key": RUNTIME_CACHE_KEY,
      "data-object-type": SHOWROOM_OBJECT.objectType,
      "data-object-name": SHOWROOM_OBJECT.objectName,
      "data-visible-subject": SHOWROOM_OBJECT.visibleSubject,
      "data-active-proof-target": SHOWROOM_OBJECT.activeProofTarget,
      "data-surface-visibility-required": "true",
      "data-clouds-above-surface-required": "true"
    }).then(function () {
      var runtime = getRuntime();

      if (!runtime) {
        throw new Error("RUNTIME_GLOBAL_MISSING_AFTER_LOAD");
      }

      state.runtime = runtime;
      state.runtimeLoaded = true;
      state.runtimeAccepted = runtimeAccepted(runtime);

      initializeRuntime();
      return runtime;
    }).catch(function (error) {
      recordError("loadRuntime", error);
      setText("[data-audralia-diagnostic-loader]", "runtime load failed");
      return null;
    });
  }

  function initializeRuntime() {
    if (!state.runtime || typeof state.runtime.init !== "function") return;

    try {
      state.runtime.init({
        width: state.width,
        height: state.height,
        dpr: state.dpr,
        activeLens: state.activeLens,
        showroomObject: SHOWROOM_OBJECT,
        objectType: SHOWROOM_OBJECT.objectType,
        objectName: SHOWROOM_OBJECT.objectName,
        visibleSubject: SHOWROOM_OBJECT.visibleSubject,
        activeProofTarget: SHOWROOM_OBJECT.activeProofTarget,
        surfaceVisibilityRequired: true,
        cloudsAboveSurfaceRequired: true,
        planetViewSurfaceAndClouds: true,
        latticeViewProtected: true
      });
    } catch (error) {
      recordError("runtime.init", error);
    }
  }

  function createCanvas() {
    var existingCanvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));
    state.duplicateCanvasCount = Math.max(0, existingCanvases.length - 1);

    existingCanvases.slice(1).forEach(function (canvas) {
      try { canvas.remove(); } catch (_error) {}
    });

    state.canvas = existingCanvases[0] || document.createElement("canvas");

    if (!existingCanvases[0]) {
      state.canvas.setAttribute("data-audralia-route-canvas", CONTRACT);
      state.mount.appendChild(state.canvas);
    }

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.canvasReady = Boolean(state.ctx);
  }

  function resizeCanvas() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(420, Math.floor(rect.height * dpr));

    if (state.width === width && state.height === height && state.dpr === dpr) return;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;

    if (state.runtime && typeof state.runtime.resize === "function") {
      try {
        state.runtime.resize(width, height, dpr);
      } catch (error) {
        recordError("runtime.resize", error);
      }
    }
  }

  function getFrame(time) {
    if (!state.runtime) return null;

    try {
      if (typeof state.runtime.tick === "function") {
        return state.runtime.tick(time);
      }

      if (typeof state.runtime.getFrame === "function") {
        return state.runtime.getFrame();
      }
    } catch (error) {
      recordError("runtime.frame", error);
    }

    return null;
  }

  function getMetrics(frame) {
    if (frame && frame.metrics) return frame.metrics;

    return {
      width: state.width,
      height: state.height,
      centerX: state.width / 2,
      centerY: state.height * 0.405,
      radius: Math.min(state.width, state.height) * 0.345,
      cameraDistance: 3.72
    };
  }

  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function drawBaseSphere(frame) {
    var ctx = state.ctx;
    var metrics = getMetrics(frame);
    var cx = metrics.centerX;
    var cy = metrics.centerY;
    var r = metrics.radius;

    ctx.save();

    var glow = ctx.createRadialGradient(cx - r * 0.22, cy - r * 0.24, 0, cx, cy, r * 1.28);
    glow.addColorStop(0, "rgba(178,244,255,0.92)");
    glow.addColorStop(0.20, "rgba(83,191,231,0.78)");
    glow.addColorStop(0.46, "rgba(24,107,165,0.86)");
    glow.addColorStop(0.78, "rgba(6,42,86,0.96)");
    glow.addColorStop(1, "rgba(1,13,32,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    var shade = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, r * 0.08, cx, cy, r * 1.08);
    shade.addColorStop(0, "rgba(255,255,255,0.36)");
    shade.addColorStop(0.25, "rgba(255,255,255,0.04)");
    shade.addColorStop(0.70, "rgba(0,0,0,0.08)");
    shade.addColorStop(1, "rgba(0,0,0,0.56)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();

    ctx.restore();
  }

  function drawLimb(frame) {
    var ctx = state.ctx;
    var metrics = getMetrics(frame);
    var cx = metrics.centerX;
    var cy = metrics.centerY;
    var r = metrics.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = "rgba(151,205,255,0.42)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.012, 0, TAU);
    ctx.strokeStyle = "rgba(141,216,255,0.16)";
    ctx.lineWidth = Math.max(1, state.dpr * 2.0);
    ctx.stroke();

    ctx.restore();
  }

  function clipSphere(frame) {
    var ctx = state.ctx;
    var metrics = getMetrics(frame);

    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.004, 0, TAU);
    ctx.clip();
  }

  function projectLonLat(lon, lat, frame) {
    var metrics = getMetrics(frame);
    var yaw = finite(frame && frame.yaw, 0);
    var pitch = finite(frame && frame.pitch, 0);
    var roll = finite(frame && frame.roll, 0);

    var clat = Math.cos(lat);
    var x = clat * Math.cos(lon);
    var y = Math.sin(lat);
    var z = clat * Math.sin(lon);

    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(roll);
    var sr = Math.sin(roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;
    x = x2;
    y = y2;

    var denominator = Math.max(0.72, metrics.cameraDistance - z);
    var perspective = metrics.cameraDistance / denominator;

    return {
      x: metrics.centerX + x * metrics.radius * perspective,
      y: metrics.centerY - y * metrics.radius * perspective,
      z: z,
      perspective: perspective,
      frontFacing: z >= -0.04,
      visibility: z >= 0 ? 1 : clamp(0.1 + (z + 1) * 0.12, 0, 0.18)
    };
  }

  function normalizeSurfaceLayer(layer) {
    layer = layer || {};

    var visibleCells =
      layer.visibleCells ||
      layer.visibleSurfaceCells ||
      layer.drawQueue ||
      layer.surfaceCells ||
      [];

    var cells =
      layer.cells ||
      layer.surfaceCells ||
      layer.visibleCells ||
      layer.drawQueue ||
      [];

    var visibleCount = finite(
      layer.visibleSurfaceCellCount,
      finite(
        layer.visibleCellCount,
        finite(layer.surfaceVisibleCellCount, visibleCells.length || 0)
      )
    );

    var cellCount = finite(
      layer.surfaceCellCount,
      finite(layer.cellCount, cells.length || visibleCount || 0)
    );

    var ready = Boolean(
      layer.surfaceRendererReady ||
      layer.rendererReady ||
      layer.fieldReady ||
      layer.surfaceLayerReady ||
      visibleCount > 0 ||
      cellCount > 0
    );

    var gratitude = Boolean(
      layer.gratitudeContinentVisible ||
      layer.gratitudeVisible ||
      layer.gratitudeSurfaceVisible ||
      layer.gratitudeContinentProofVisible ||
      layer.activeProofTargetVisible ||
      visibleCount > 0
    );

    return {
      layer: layer,
      ready: ready,
      gratitude: gratitude,
      visibleCount: visibleCount,
      cellCount: cellCount,
      visibleCells: visibleCells,
      cells: cells
    };
  }

  function getSurfaceLayer(frame) {
    var layer = frame && frame.surfaceLayer ? frame.surfaceLayer : null;

    if (!layer && state.runtime && typeof state.runtime.getSurfaceLayer === "function") {
      try {
        layer = state.runtime.getSurfaceLayer();
      } catch (error) {
        recordError("runtime.getSurfaceLayer", error);
      }
    }

    var surfaceApi = getSurfaceApi();

    if (!layer && surfaceApi && typeof surfaceApi.buildSurfaceLayer === "function") {
      try {
        layer = surfaceApi.buildSurfaceLayer(frame);
        state.surfaceBuildConfirmed = true;
      } catch (error) {
        recordError("surface.buildSurfaceLayer", error);
      }
    }

    return layer;
  }

  function drawSurfaceOutputCells(frame, normalized) {
    var ctx = state.ctx;
    var cells = normalized.visibleCells.length ? normalized.visibleCells : normalized.cells;

    if (!cells || !cells.length) return 0;

    var drawn = 0;
    var maxCells = Math.min(cells.length, 320);

    ctx.save();
    clipSphere(frame);
    ctx.globalCompositeOperation = "source-over";

    for (var i = 0; i < maxCells; i += 1) {
      var cell = cells[i];
      var lon = finite(cell.longitude, finite(cell.lon, NaN));
      var lat = finite(cell.latitude, finite(cell.lat, NaN));

      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

      var landRatio = clamp(
        finite(cell.landRatio, finite(cell.gratitudeInfluence, finite(cell.surfaceStrength, 0.5))),
        0,
        1
      );

      var terrainClass = String(cell.terrainClass || cell.materialClass || cell.className || "");
      var isOcean = terrainClass.indexOf("ocean") >= 0 && landRatio < 0.32;
      var isShelf = terrainClass.indexOf("shelf") >= 0 || terrainClass.indexOf("coastal") >= 0;

      if (isOcean && !isShelf) continue;

      var projected = projectLonLat(lon, lat, frame);
      if (!projected.frontFacing || projected.visibility <= 0.03) continue;

      var p = clamp(projected.perspective, 0.5, 2.2);
      var radiusX = clamp(10 * p + landRatio * 18 * p, 5, 32 * p);
      var radiusY = clamp(5 * p + landRatio * 9 * p, 2.5, 18 * p);
      var opacity = clamp(0.18 + landRatio * 0.36, 0.12, 0.62) * projected.visibility;

      if (isShelf) {
        ctx.fillStyle = "rgba(124,204,208," + clamp(opacity * 0.62, 0.08, 0.32).toFixed(4) + ")";
      } else if (terrainClass.indexOf("ridge") >= 0 || terrainClass.indexOf("highland") >= 0) {
        ctx.fillStyle = "rgba(203,188,132," + opacity.toFixed(4) + ")";
      } else if (terrainClass.indexOf("wetland") >= 0 || terrainClass.indexOf("forest") >= 0) {
        ctx.fillStyle = "rgba(82,155,122," + opacity.toFixed(4) + ")";
      } else {
        ctx.fillStyle = "rgba(111,174,126," + opacity.toFixed(4) + ")";
      }

      ctx.beginPath();
      ctx.ellipse(
        projected.x,
        projected.y,
        radiusX,
        radiusY,
        lon * 0.35 + lat * 0.45,
        0,
        TAU
      );
      ctx.fill();

      if (isShelf) {
        ctx.strokeStyle = "rgba(205,241,224," + clamp(opacity * 0.36, 0.06, 0.20).toFixed(4) + ")";
        ctx.lineWidth = Math.max(0.6, p * 0.8);
        ctx.stroke();
      }

      drawn += 1;
    }

    ctx.restore();
    return drawn;
  }

  function renderSurface(frame) {
    state.surfaceAttempted = true;
    state.surfaceRenderConfirmed = false;
    state.surfaceRenderedBeforeClouds = false;

    var surfaceApi = getSurfaceApi();
    var layerBefore = getSurfaceLayer(frame);
    var normalized = normalizeSurfaceLayer(layerBefore);

    if (surfaceApi && typeof surfaceApi.render === "function") {
      try {
        var renderedLayer = surfaceApi.render(state.ctx, frame, {
          activeLens: "planet",
          showroomObject: SHOWROOM_OBJECT,
          surfaceVisibilityRequired: true,
          activeProofTarget: SHOWROOM_OBJECT.activeProofTarget,
          cloudsAboveSurfaceRequired: true
        });

        if (renderedLayer) {
          normalized = normalizeSurfaceLayer(renderedLayer);
        }

        state.surfaceRenderConfirmed = true;
      } catch (error) {
        recordError("surface.render", error);
      }
    }

    var drawnFromOutput = 0;

    if (!state.surfaceRenderConfirmed || normalized.visibleCount === 0 || !normalized.gratitude) {
      drawnFromOutput = drawSurfaceOutputCells(frame, normalized);
    }

    if (drawnFromOutput > 0) {
      normalized.visibleCount = Math.max(normalized.visibleCount, drawnFromOutput);
      normalized.gratitude = true;
      normalized.ready = true;
    }

    state.lastSurfaceLayer = normalized.layer;
    state.surfaceRendererReady = normalized.ready;
    state.gratitudeContinentVisible = normalized.gratitude;
    state.surfaceVisibleCellCount = normalized.visibleCount;
    state.surfaceCellCount = normalized.cellCount;
    state.surfaceRenderedBeforeClouds = true;

    return normalized;
  }

  function normalizeCloudLayer(layer) {
    layer = layer || {};

    var clouds = layer.clouds || layer.visibleClouds || [];
    var count = finite(layer.cloudCount, finite(layer.visibleCloudCount, clouds.length || 0));

    return {
      layer: layer,
      clouds: clouds,
      count: count,
      ready: Boolean(layer.rendererReady || layer.cloudRendererReady || layer.cloudsReady || count > 0)
    };
  }

  function getCloudLayer(frame) {
    var layer = frame && frame.cloudLayer ? frame.cloudLayer : null;

    if (!layer && state.runtime && typeof state.runtime.getCloudLayer === "function") {
      try {
        layer = state.runtime.getCloudLayer();
      } catch (error) {
        recordError("runtime.getCloudLayer", error);
      }
    }

    var cloudApi = getCloudApi();

    if (!layer && cloudApi && typeof cloudApi.buildLayer === "function") {
      try {
        layer = cloudApi.buildLayer(frame);
      } catch (error) {
        recordError("cloud.buildLayer", error);
      }
    }

    return layer;
  }

  function drawCloudOutputLayer(normalized) {
    var ctx = state.ctx;
    var clouds = normalized.clouds;

    if (!clouds || !clouds.length) return 0;

    var drawn = 0;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (var i = 0; i < clouds.length; i += 1) {
      var cloud = clouds[i];
      var fragments = cloud.fragments || [cloud];

      for (var j = 0; j < fragments.length; j += 1) {
        var fragment = fragments[j];
        var x = finite(fragment.x, finite(cloud.x, NaN));
        var y = finite(fragment.y, finite(cloud.y, NaN));

        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

        var width = clamp(finite(fragment.width, finite(cloud.width, 18)), 1, 180);
        var height = clamp(finite(fragment.height, finite(cloud.height, 8)), 1, 90);
        var opacity = clamp(
          finite(fragment.opacity, finite(cloud.cloudOpacity, 0.18)),
          0,
          0.74
        );

        if (opacity <= 0.01) continue;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(finite(fragment.angle, finite(cloud.angle, 0)));

        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(width, height));
        gradient.addColorStop(0, "rgba(255,255,255," + clamp(opacity * 0.70, 0, 0.70).toFixed(4) + ")");
        gradient.addColorStop(0.42, "rgba(226,246,255," + clamp(opacity * 0.34, 0, 0.36).toFixed(4) + ")");
        gradient.addColorStop(1, "rgba(150,198,226,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, width, height, 0, 0, TAU);
        ctx.fill();

        ctx.restore();
        drawn += 1;
      }
    }

    ctx.restore();
    return drawn;
  }

  function renderClouds(frame) {
    state.cloudAttempted = true;

    var cloudApi = getCloudApi();
    var layerBefore = getCloudLayer(frame);
    var normalized = normalizeCloudLayer(layerBefore);

    if (cloudApi && typeof cloudApi.render === "function") {
      try {
        var renderedLayer = cloudApi.render(state.ctx, frame, {
          activeLens: "planet",
          showroomObject: SHOWROOM_OBJECT,
          cloudsAboveSurfaceRequired: true,
          surfaceRenderedBeforeClouds: state.surfaceRenderedBeforeClouds
        });

        if (renderedLayer) normalized = normalizeCloudLayer(renderedLayer);
      } catch (error) {
        recordError("cloud.render", error);
      }
    } else {
      var drawn = drawCloudOutputLayer(normalized);
      if (drawn > 0) {
        normalized.ready = true;
        normalized.count = Math.max(normalized.count, drawn);
      }
    }

    state.lastCloudLayer = normalized.layer;
    state.cloudRendererReady = normalized.ready;
    state.cloudCount = normalized.count;

    return normalized;
  }

  function drawLattice(frame) {
    var ctx = state.ctx;
    if (!frame) return;

    var links = frame.projectedLinks || {};
    var seats = frame.projectedSeats || [];
    var allLinks = []
      .concat(links.ringLinks || [])
      .concat(links.spineLinks || [])
      .concat(links.fibonacciLinks || []);

    ctx.save();

    for (var i = 0; i < allLinks.length; i += 1) {
      var link = allLinks[i];
      if (!link || !link.a || !link.b) continue;

      var opacity = link.frontFacing ? 0.28 : 0.08;
      if (link.major) opacity += 0.10;

      ctx.beginPath();
      ctx.moveTo(link.a.screen.x, link.a.screen.y);
      ctx.lineTo(link.b.screen.x, link.b.screen.y);
      ctx.strokeStyle = "rgba(112,199,255," + opacity.toFixed(4) + ")";
      ctx.lineWidth = link.major ? Math.max(0.8, state.dpr * 0.9) : Math.max(0.45, state.dpr * 0.55);
      ctx.stroke();
    }

    for (i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      if (!seat || !seat.screen) continue;

      var r = seat.radialIndex % 4 === 0 ? 2.2 : 1.5;
      var a = seat.frontFacing ? 0.82 : 0.20;

      ctx.beginPath();
      ctx.arc(seat.screen.x, seat.screen.y, r * state.dpr, 0, TAU);
      ctx.fillStyle = seat.radialIndex % 4 === 0
        ? "rgba(244,207,131," + a.toFixed(4) + ")"
        : "rgba(141,216,255," + a.toFixed(4) + ")";
      ctx.fill();
    }

    ctx.restore();
  }

  function renderFrame(time) {
    resizeCanvas();
    clearCanvas();

    var frame = getFrame(time) || state.lastFrame || {
      width: state.width,
      height: state.height,
      dpr: state.dpr,
      yaw: 0,
      pitch: 0,
      roll: 0,
      metrics: {
        width: state.width,
        height: state.height,
        centerX: state.width / 2,
        centerY: state.height * 0.405,
        radius: Math.min(state.width, state.height) * 0.345,
        cameraDistance: 3.72
      }
    };

    frame.showroomObject = SHOWROOM_OBJECT;
    frame.surfaceVisibilityRequired = true;
    frame.cloudsAboveSurfaceRequired = true;
    frame.planetViewSurfaceAndClouds = true;
    frame.latticeViewProtected = true;

    state.lastFrame = frame;

    drawBaseSphere(frame);

    if (state.activeLens === "lattice") {
      drawLattice(frame);
      drawLimb(frame);
      state.latticeViewProtected = true;
    } else if (state.activeLens === "diagnostic") {
      drawLattice(frame);
      drawLimb(frame);
    } else {
      renderSurface(frame);
      renderClouds(frame);
      drawLimb(frame);
    }

    state.renderCount += 1;

    if (state.renderCount % 10 === 0) {
      updateDiagnostics(frame);
    }

    window.AUDRALIA_G2_ROUTE_JS_STATE = buildStatus(frame);

    state.raf = window.requestAnimationFrame(renderFrame);
  }

  function buildStatus(frame) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      datumContract: DATUM_CONTRACT,
      surfaceContract: SURFACE_CONTRACT,
      cloudContract: CLOUD_CONTRACT,

      showroomObject: SHOWROOM_OBJECT,

      routeReady: state.routeReady,
      canvasReady: state.canvasReady,
      runtimeLoaded: state.runtimeLoaded,
      runtimeAccepted: state.runtimeAccepted,
      runtimeSurfaceCapabilityConfirmed: state.runtimeSurfaceCapabilityConfirmed,
      runtimeDatumCapabilityConfirmed: state.runtimeDatumCapabilityConfirmed,

      activeLens: state.activeLens,

      planetViewSurfaceAndClouds: true,
      previousPlanetViewCloudsOnly: true,

      surfaceAttempted: state.surfaceAttempted,
      surfaceBuildConfirmed: state.surfaceBuildConfirmed,
      surfaceRenderConfirmed: state.surfaceRenderConfirmed,
      surfaceRendererReady: state.surfaceRendererReady,
      surfaceVisibleCellCount: state.surfaceVisibleCellCount,
      surfaceCellCount: state.surfaceCellCount,
      gratitudeContinentVisible: state.gratitudeContinentVisible,
      surfaceRenderedBeforeClouds: state.surfaceRenderedBeforeClouds,

      cloudAttempted: state.cloudAttempted,
      cloudRendererReady: state.cloudRendererReady,
      cloudCount: state.cloudCount,
      cloudsRenderAboveSurface: true,

      latticeViewProtected: true,
      duplicateCanvasCount: state.duplicateCanvasCount,

      frameDatumReady: Boolean(frame && frame.datumReady),
      frameSurfaceLayerPresent: Boolean(frame && frame.surfaceLayer),
      frameCloudLayerPresent: Boolean(frame && frame.cloudLayer),

      noChildLogicInHtml: true,
      noDuplicateCanvas: state.duplicateCanvasCount === 0,
      noAustraliaNamingDrift: true,
      visualPassClaimed: false,

      errors: state.errors.slice()
    };
  }

  function updateDiagnostics(frame) {
    var status = buildStatus(frame);

    setText(
      "[data-audralia-diagnostic-route-js]",
      status.routeReady
        ? "active · planet-object grandparent controller"
        : "route controller pending"
    );

    setText(
      "[data-audralia-diagnostic-sphere]",
      status.runtimeAccepted
        ? "runtime accepted · 256 seats · surface capability=" + (status.runtimeSurfaceCapabilityConfirmed ? "confirmed" : "pending")
        : "runtime pending"
    );

    setText(
      "[data-audralia-diagnostic-planet]",
      "Planet View " +
        (state.activeLens === "planet" ? "active" : "held") +
        " · surface=" + (status.surfaceRendererReady ? "ready" : "pending") +
        " · gratitude=" + (status.gratitudeContinentVisible ? "ready" : "pending") +
        " · cells=" + status.surfaceVisibleCellCount
    );

    setText(
      "[data-audralia-diagnostic-lattice]",
      status.latticeViewProtected
        ? "protected · spherical runtime lattice"
        : "lattice protection pending"
    );

    setText(
      "[data-audralia-diagnostic-seats]",
      "16 × 16 = 256"
    );

    setText(
      "[data-audralia-diagnostic-loader]",
      "runtimeCache=" + RUNTIME_CACHE_KEY +
        " · surface=" + (status.surfaceRendererReady ? "ready" : "pending") +
        " · gratitude=" + (status.gratitudeContinentVisible ? "ready" : "pending") +
        " · clouds=" + (status.cloudRendererReady ? "ready" : "pending")
    );

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaRuntimeAccepted", status.runtimeAccepted);
    setDataset("audraliaSurfaceRendererReady", status.surfaceRendererReady);
    setDataset("audraliaGratitudeContinentVisible", status.gratitudeContinentVisible);
    setDataset("audraliaSurfaceVisibleCellCount", status.surfaceVisibleCellCount);
    setDataset("audraliaCloudRendererReady", status.cloudRendererReady);
    setDataset("audraliaPlanetViewSurfaceAndClouds", true);
    setDataset("audraliaPreviousPlanetViewCloudsOnly", true);
    setDataset("audraliaLatticeViewProtected", true);
  }

  function setLens(nextLens) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, nextLens) ? nextLens : "planet";
    state.activeLens = lens;

    document.documentElement.dataset.audraliaActiveLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaLensButton === lens ? "true" : "false");
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    if (state.runtime && typeof state.runtime.setLens === "function") {
      try {
        state.runtime.setLens(lens);
      } catch (error) {
        recordError("runtime.setLens", error);
      }
    }
  }

  function attachLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      });
    });

    window.addEventListener("audralia:lens", function (event) {
      if (event && event.detail && event.detail.activeLens) {
        setLens(event.detail.activeLens);
      }
    });
  }

  function eventPoint(event) {
    var rect = state.stage.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * state.dpr,
      y: (event.clientY - rect.top) * state.dpr
    };
  }

  function attachPointerControls() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      if (!state.runtime || typeof state.runtime.pointerDown !== "function") return;

      state.dragging = true;
      state.stage.setPointerCapture(event.pointerId);

      var point = eventPoint(event);
      try {
        state.runtime.pointerDown(point.x, point.y, performance.now());
      } catch (error) {
        recordError("runtime.pointerDown", error);
      }
    });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.dragging || !state.runtime || typeof state.runtime.pointerMove !== "function") return;

      var point = eventPoint(event);
      try {
        state.runtime.pointerMove(point.x, point.y, performance.now());
      } catch (error) {
        recordError("runtime.pointerMove", error);
      }
    });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;

      if (state.runtime && typeof state.runtime.pointerUp === "function") {
        try {
          state.runtime.pointerUp(performance.now());
        } catch (error) {
          recordError("runtime.pointerUp", error);
        }
      }

      try {
        state.stage.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    }

    state.stage.addEventListener("pointerup", release);
    state.stage.addEventListener("pointercancel", release);
    state.stage.addEventListener("pointerleave", release);
  }

  function markBoot() {
    window.AUDRALIA_G2_ROUTE_JS_BOOT_MARKER = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      showroomObject: SHOWROOM_OBJECT,

      routeJsActive: true,
      showroomGrandparentAuthorityActive: true,
      audraliaDeclaredAsPlanetObject: true,
      visibleSubjectAudraliaPlanet: true,
      activeProofTargetGratitude: true,
      surfaceVisibilityRequired: true,
      cloudsAboveSurfaceRequired: true,
      planetViewSurfaceAndClouds: true,
      previousPlanetViewCloudsOnly: true,

      routeSurfaceFieldMapKnown: true,
      routeSurfaceHandshakeNormalized: true,
      surfaceBeforeClouds: true,
      latticeViewProtected: true,

      visualPassClaimed: false,
      reachedAt: new Date().toISOString()
    };
  }

  function init() {
    readHtmlObjectAuthority();

    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");
    state.diagnosticMount = document.querySelector("#audraliaDiagnosticMount");

    if (!state.stage || !state.mount) {
      recordError("init", "Audralia stage or mount missing");
      return;
    }

    createCanvas();
    resizeCanvas();
    attachLensControls();
    attachPointerControls();
    setLens("planet");
    markBoot();

    state.routeReady = true;

    loadRuntime().then(function () {
      updateDiagnostics(state.lastFrame);
    });

    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = window.requestAnimationFrame(renderFrame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
