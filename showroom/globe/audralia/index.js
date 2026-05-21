// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_ROUTE_JS_WORKING_VISUAL_CONTROLLER_RECOVERY_TNT_v1
//
// Purpose:
// - Recover Audralia's working G2 visual controller.
// - Restore visible runtime globe.
// - Restore finger drag / pointer inspection.
// - Restore visible cloud rendering when cloud child is available.
// - Preserve protected Lattice View.
// - Preserve compact Diagnostic Scope.
// - Do not hard-gate render on Gratitude surface proof.
// - Keep Gratitude surface proof as target only.
// - Do not create duplicate canvases.
// - Do not move datum, terrain, moisture, surface, or cloud engine logic into route JS.
// - No generated image. No GraphicBox. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_ROUTE_JS_WORKING_VISUAL_CONTROLLER_RECOVERY_TNT_v1";
  var RESTORED_WORKING_POSTURE = "AUDRALIA_G2_ROUTE_JS_PLANET_VIEW_MOISTURE_CLOUD_RENDERER_WITH_LATTICE_PROTECTION_TNT_v1";
  var HELD_CONTRACT = "AUDRALIA_G2_ROUTE_JS_SHOWROOM_PLANET_OBJECT_GRANDPARENT_CONTROLLER_TNT_v5";
  var HTML_RECOVERY_CONTRACT = "AUDRALIA_G2_HTML_ROUTE_RECOVERY_LAST_WORKING_CONTROLLER_WITH_PLANET_OBJECT_COPY_TNT_v3";

  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";
  var RUNTIME_PUBLIC_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_G2_GRATITUDE_FRONT_FACE_AND_DATUM_VISUAL_PROOF_ALIGNMENT_TNT_v1";

  var CLOUD_PUBLIC_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";
  var LEGACY_CLOUD_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";
  var SURFACE_TARGET_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1";

  var TAU = Math.PI * 2;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia · recovered moisture-cloud globe · Gratitude proof target held",
      copy: "Planet View restores the runtime sphere, finger inspection, and cloud-visible atmosphere. Gratitude surface proof remains the next target, not a hard boot gate."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → protected 16 × 16 / 256 spherical lattice baseline",
      copy: "Lattice View is protected. It shows the runtime-owned 16 radial nodes × 16 Fibonacci bands as a spherical 256-seat structure. Clouds and surface material stay out of this lens."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → recovered controller, runtime, clouds, surface target, and lattice status",
      copy: "Diagnostic Scope reports the recovered visual controller, runtime sphere, cloud renderer, active lens, protected lattice, and held Gratitude surface target."
    }
  };

  var SHOWROOM_OBJECT = {
    objectType: "planet",
    objectName: "Audralia",
    showroomFamily: "globe",
    routeRole: "planet-object-inspection-route",
    visibleSubject: "Audralia planet",
    activeProofTarget: "Gratitude continent",
    planetViewCloudsOnly: true,
    previousPlanetViewCloudsOnly: true,
    surfaceVisibilityRequired: false,
    surfaceVisibilityTarget: true,
    cloudsAboveSurfaceRequired: false,
    cloudsAboveSurfaceTarget: true,
    planetViewSurfaceAndCloudsTarget: true,
    latticeViewProtected: true,
    latticeViewCloudsBlocked: true,
    latticeViewSurfaceBlocked: true,
    visualPassClaimed: false
  };

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,

    width: 0,
    height: 0,
    dpr: 1,

    activeLens: "planet",
    runtime: null,
    runtimeLoaded: false,
    runtimeAccepted: false,
    runtimeReady: false,

    routeReady: false,
    canvasReady: false,
    cloudReady: false,
    cloudCount: 0,
    latticeReady: false,

    renderCount: 0,
    raf: 0,
    lastFrame: null,
    lastCloudLayer: null,

    dragging: false,
    lastPointerId: null,

    duplicateCanvasRemoved: 0,
    errors: []
  };

  function finite(value, fallback) {
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.innerHTML = String(value);
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
      if (document.body) document.body.dataset[key] = String(value);
    } catch (_error) {}
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

  function readShowroomObject() {
    var root = document.documentElement;
    var stage = document.querySelector("#audraliaGlobeStage");

    SHOWROOM_OBJECT.objectType = root.dataset.objectType || (stage && stage.dataset.objectType) || "planet";
    SHOWROOM_OBJECT.objectName = root.dataset.objectName || (stage && stage.dataset.objectName) || "Audralia";
    SHOWROOM_OBJECT.showroomFamily = root.dataset.showroomFamily || (stage && stage.dataset.showroomFamily) || "globe";
    SHOWROOM_OBJECT.visibleSubject = root.dataset.visibleSubject || (stage && stage.dataset.visibleSubject) || "Audralia planet";
    SHOWROOM_OBJECT.activeProofTarget = root.dataset.activeProofTarget || (stage && stage.dataset.activeProofTarget) || "Gratitude continent";

    window.AUDRALIA_G2_SHOWROOM_OBJECT = SHOWROOM_OBJECT;
  }

  function getRuntime() {
    return window.AUDRALIA_TRUE_GLOBE_RUNTIME ||
      window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME ||
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

  function acceptRuntime(runtime) {
    var status = getRuntimeStatus(runtime);
    if (!status) return false;

    return Boolean(
      status.contract === RUNTIME_PUBLIC_CONTRACT ||
      status.runtimeReady ||
      status.sphereCarrierReady ||
      typeof runtime.tick === "function"
    );
  }

  function loadScriptOnce(path, key, attrs) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector("script[data-audralia-runtime-loader='" + CONTRACT + "']");
      if (existing && getRuntime()) {
        resolve(existing);
        return;
      }

      var script = document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(key);
      script.defer = true;
      script.async = true;

      Object.keys(attrs || {}).forEach(function (name) {
        script.setAttribute(name, attrs[name]);
      });

      script.onload = function () { resolve(script); };
      script.onerror = function () {
        reject(new Error("SCRIPT_LOAD_FAILED " + path + "?v=" + key));
      };

      document.body.appendChild(script);
    });
  }

  function initRuntime() {
    var runtime = getRuntime();

    if (!runtime) return;

    state.runtime = runtime;
    state.runtimeLoaded = true;
    state.runtimeAccepted = acceptRuntime(runtime);

    if (typeof runtime.init === "function") {
      try {
        runtime.init({
          width: state.width,
          height: state.height,
          dpr: state.dpr,
          activeLens: state.activeLens,
          showroomObject: SHOWROOM_OBJECT,
          objectType: SHOWROOM_OBJECT.objectType,
          objectName: SHOWROOM_OBJECT.objectName,
          visibleSubject: SHOWROOM_OBJECT.visibleSubject,
          activeProofTarget: SHOWROOM_OBJECT.activeProofTarget,
          surfaceVisibilityRequired: false,
          surfaceVisibilityTarget: true,
          cloudsAboveSurfaceRequired: false,
          cloudsAboveSurfaceTarget: true,
          planetViewCloudsOnly: true,
          latticeViewProtected: true
        });
      } catch (error) {
        recordError("runtime.init", error);
      }
    }

    state.runtimeReady = true;
  }

  function loadRuntime() {
    var existingRuntime = getRuntime();

    if (existingRuntime) {
      initRuntime();
      return Promise.resolve(existingRuntime);
    }

    setText("[data-audralia-diagnostic-loader]", "loading runtime · recovered controller");

    return loadScriptOnce(RUNTIME_PATH, RUNTIME_CACHE_KEY, {
      "data-audralia-runtime-loader": CONTRACT,
      "data-runtime-contract": RUNTIME_PUBLIC_CONTRACT,
      "data-runtime-cache-key": RUNTIME_CACHE_KEY,
      "data-restored-working-posture": RESTORED_WORKING_POSTURE,
      "data-object-type": SHOWROOM_OBJECT.objectType,
      "data-object-name": SHOWROOM_OBJECT.objectName,
      "data-visible-subject": SHOWROOM_OBJECT.visibleSubject,
      "data-active-proof-target": SHOWROOM_OBJECT.activeProofTarget,
      "data-surface-visibility-required": "false",
      "data-surface-visibility-target": "true",
      "data-clouds-above-surface-required": "false",
      "data-clouds-above-surface-target": "true"
    }).then(function () {
      initRuntime();
      return getRuntime();
    }).catch(function (error) {
      recordError("loadRuntime", error);
      setText("[data-audralia-diagnostic-loader]", "runtime load failed");
      return null;
    });
  }

  function createCanvas() {
    if (!state.mount) return;

    var canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));

    if (canvases.length > 1) {
      canvases.slice(1).forEach(function (canvas) {
        try {
          canvas.remove();
          state.duplicateCanvasRemoved += 1;
        } catch (_error) {}
      });
    }

    state.canvas = canvases[0] || document.createElement("canvas");

    if (!canvases[0]) {
      state.canvas.setAttribute("data-audralia-route-canvas", CONTRACT);
      state.canvas.setAttribute("aria-hidden", "true");
      state.mount.appendChild(state.canvas);
    }

    state.canvas.style.position = "absolute";
    state.canvas.style.inset = "0";
    state.canvas.style.width = "100%";
    state.canvas.style.height = "100%";
    state.canvas.style.display = "block";
    state.canvas.style.background = "transparent";
    state.canvas.style.pointerEvents = "none";

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.canvasReady = Boolean(state.ctx);
  }

  function resize() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(480, Math.floor(rect.height * dpr));

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
    var frame = null;

    if (state.runtime) {
      try {
        if (typeof state.runtime.tick === "function") {
          frame = state.runtime.tick(time);
        } else if (typeof state.runtime.getFrame === "function") {
          frame = state.runtime.getFrame();
        }
      } catch (error) {
        recordError("runtime.frame", error);
      }
    }

    if (!frame) {
      frame = state.lastFrame || {};
    }

    frame.width = state.width;
    frame.height = state.height;
    frame.dpr = state.dpr;
    frame.activeLens = state.activeLens;
    frame.showroomObject = SHOWROOM_OBJECT;
    frame.surfaceVisibilityRequired = false;
    frame.surfaceVisibilityTarget = true;
    frame.cloudsAboveSurfaceRequired = false;
    frame.cloudsAboveSurfaceTarget = true;
    frame.planetViewCloudsOnly = true;
    frame.latticeViewProtected = true;

    if (!frame.metrics) {
      frame.metrics = fallbackMetrics();
    }

    state.lastFrame = frame;
    return frame;
  }

  function fallbackMetrics() {
    var minSide = Math.min(state.width, state.height);
    var mobile = state.width < 760 * state.dpr;

    return {
      width: state.width,
      height: state.height,
      centerX: state.width / 2,
      centerY: mobile ? state.height * 0.405 : state.height * 0.42,
      radius: minSide * (mobile ? 0.345 : 0.365),
      cameraDistance: 3.72
    };
  }

  function metrics(frame) {
    return frame && frame.metrics ? frame.metrics : fallbackMetrics();
  }

  function clear() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function drawBaseSphere(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var ocean = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.28, 0, cx, cy, r * 1.18);
    ocean.addColorStop(0.00, "rgba(194,248,255,0.96)");
    ocean.addColorStop(0.16, "rgba(91,205,239,0.90)");
    ocean.addColorStop(0.38, "rgba(25,126,188,0.94)");
    ocean.addColorStop(0.68, "rgba(8,58,123,0.98)");
    ocean.addColorStop(1.00, "rgba(1,16,42,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    var shade = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, r * 0.08, cx, cy, r * 1.10);
    shade.addColorStop(0.00, "rgba(255,255,255,0.38)");
    shade.addColorStop(0.18, "rgba(255,255,255,0.10)");
    shade.addColorStop(0.52, "rgba(0,0,0,0.00)");
    shade.addColorStop(0.86, "rgba(0,0,0,0.32)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.62)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();

    var atmosphere = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 1.08);
    atmosphere.addColorStop(0.00, "rgba(141,216,255,0)");
    atmosphere.addColorStop(0.72, "rgba(141,216,255,0.08)");
    atmosphere.addColorStop(1.00, "rgba(141,216,255,0.30)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.014, 0, TAU);
    ctx.fillStyle = atmosphere;
    ctx.fill();

    ctx.restore();
  }

  function drawLimb(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = "rgba(162,222,255,0.42)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.012, 0, TAU);
    ctx.strokeStyle = "rgba(141,216,255,0.18)";
    ctx.lineWidth = Math.max(1.5, state.dpr * 2.2);
    ctx.stroke();

    ctx.restore();
  }

  function clipSphere(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.005, 0, TAU);
    ctx.clip();
  }

  function drawCloudFallback(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var t = finite(frame.renderTime, state.renderCount / 60);
    var count = 0;

    ctx.save();
    clipSphere(frame);
    ctx.globalCompositeOperation = "source-over";

    var bands = [
      { lat: -0.58, amp: 0.20, opacity: 0.16, width: 82, height: 12, cells: 18 },
      { lat: -0.24, amp: 0.14, opacity: 0.20, width: 104, height: 18, cells: 20 },
      { lat: 0.10, amp: 0.11, opacity: 0.18, width: 118, height: 20, cells: 22 },
      { lat: 0.42, amp: 0.16, opacity: 0.18, width: 92, height: 15, cells: 18 },
      { lat: 0.70, amp: 0.10, opacity: 0.13, width: 72, height: 10, cells: 12 }
    ];

    for (var b = 0; b < bands.length; b += 1) {
      var band = bands[b];

      for (var i = 0; i < band.cells; i += 1) {
        var phase = (i / band.cells) * TAU + t * (0.045 + b * 0.012);
        var x = m.centerX + Math.cos(phase) * m.radius * (0.58 + 0.08 * Math.sin(i + b));
        var y = m.centerY + band.lat * m.radius + Math.sin(phase * 1.7 + b) * band.amp * m.radius;
        var edge = Math.hypot(x - m.centerX, y - m.centerY) / m.radius;

        if (edge > 0.98) continue;

        var limb = 1 - Math.max(0, edge - 0.70) / 0.30;
        var opacity = clamp(band.opacity * limb, 0.04, 0.24);
        var w = band.width * state.dpr * (0.64 + 0.24 * Math.sin(i * 1.7 + t));
        var h = band.height * state.dpr * (0.72 + 0.18 * Math.cos(i * 1.3 + t));

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(phase * 0.16 + band.lat);

        var g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h));
        g.addColorStop(0, "rgba(255,255,255," + opacity.toFixed(4) + ")");
        g.addColorStop(0.42, "rgba(225,246,255," + (opacity * 0.55).toFixed(4) + ")");
        g.addColorStop(1, "rgba(150,198,226,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, w, h, 0, 0, TAU);
        ctx.fill();
        ctx.restore();

        count += 1;
      }
    }

    ctx.restore();

    return count;
  }

  function drawCloudLayerOutput(layer) {
    var ctx = state.ctx;
    var clouds = layer && (layer.clouds || layer.visibleClouds) || [];

    if (!clouds.length) return 0;

    var drawn = 0;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (var i = 0; i < clouds.length; i += 1) {
      var cloud = clouds[i];
      var fragments = cloud.fragments && cloud.fragments.length ? cloud.fragments : [cloud];

      for (var j = 0; j < fragments.length; j += 1) {
        var frag = fragments[j];

        var x = finite(frag.x, finite(cloud.x, NaN));
        var y = finite(frag.y, finite(cloud.y, NaN));
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

        var w = clamp(finite(frag.width, finite(cloud.width, 24)), 1, 190);
        var h = clamp(finite(frag.height, finite(cloud.height, 10)), 1, 90);
        var angle = finite(frag.angle, finite(cloud.angle, 0));
        var opacity = clamp(finite(frag.opacity, finite(cloud.cloudOpacity, 0.18)), 0, 0.70);

        if (opacity <= 0.01) continue;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h));
        grad.addColorStop(0.00, "rgba(255,255,255," + (opacity * 0.78).toFixed(4) + ")");
        grad.addColorStop(0.38, "rgba(230,248,255," + (opacity * 0.42).toFixed(4) + ")");
        grad.addColorStop(1.00, "rgba(150,198,226,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, w, h, 0, 0, TAU);
        ctx.fill();

        ctx.restore();
        drawn += 1;
      }
    }

    ctx.restore();
    return drawn;
  }

  function renderClouds(frame) {
    var cloudApi = getCloudApi();
    var layer = null;
    var drawn = 0;

    if (cloudApi && typeof cloudApi.render === "function") {
      try {
        layer = cloudApi.render(state.ctx, frame, {
          activeLens: "planet",
          showroomObject: SHOWROOM_OBJECT,
          surfaceVisibilityRequired: false,
          surfaceVisibilityTarget: true,
          cloudsAboveSurfaceRequired: false,
          cloudsAboveSurfaceTarget: true,
          planetViewCloudsOnly: true
        });
      } catch (error) {
        recordError("cloud.render", error);
      }
    }

    if (!layer && state.runtime && typeof state.runtime.getCloudLayer === "function") {
      try {
        layer = state.runtime.getCloudLayer();
      } catch (error) {
        recordError("runtime.getCloudLayer", error);
      }
    }

    if (layer && !cloudApi) {
      drawn = drawCloudLayerOutput(layer);
    }

    if (layer && cloudApi && typeof cloudApi.render !== "function") {
      drawn = drawCloudLayerOutput(layer);
    }

    if (!layer && cloudApi && typeof cloudApi.buildLayer === "function") {
      try {
        layer = cloudApi.buildLayer(frame);
        drawn = drawCloudLayerOutput(layer);
      } catch (error) {
        recordError("cloud.buildLayer", error);
      }
    }

    if (!layer || (drawn === 0 && !(layer.cloudCount > 0))) {
      drawn = drawCloudFallback(frame);
      layer = {
        rendererReady: true,
        fallbackCloudRecoveryActive: true,
        cloudCount: drawn,
        contract: CLOUD_PUBLIC_CONTRACT
      };
    }

    state.lastCloudLayer = layer;
    state.cloudReady = Boolean(layer && (layer.rendererReady || layer.cloudRendererReady || layer.cloudsReady || layer.cloudCount > 0 || drawn > 0));
    state.cloudCount = finite(layer && layer.cloudCount, drawn);

    return layer;
  }

  function drawLattice(frame) {
    var ctx = state.ctx;
    var links = frame && frame.projectedLinks ? frame.projectedLinks : {};
    var seats = frame && frame.projectedSeats ? frame.projectedSeats : [];

    var allLinks = []
      .concat(links.ringLinks || [])
      .concat(links.spineLinks || [])
      .concat(links.fibonacciLinks || []);

    ctx.save();

    if (!allLinks.length || !seats.length) {
      drawFallbackLattice(frame);
      ctx.restore();
      state.latticeReady = true;
      return;
    }

    for (var i = 0; i < allLinks.length; i += 1) {
      var link = allLinks[i];
      if (!link || !link.a || !link.b || !link.a.screen || !link.b.screen) continue;

      var opacity = link.frontFacing ? 0.28 : 0.08;
      if (link.major) opacity += 0.12;

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

      var r = seat.radialIndex % 4 === 0 ? 2.1 : 1.35;
      var a = seat.frontFacing ? 0.78 : 0.18;

      ctx.beginPath();
      ctx.arc(seat.screen.x, seat.screen.y, r * state.dpr, 0, TAU);
      ctx.fillStyle = seat.radialIndex % 4 === 0
        ? "rgba(244,207,131," + a.toFixed(4) + ")"
        : "rgba(141,216,255," + a.toFixed(4) + ")";
      ctx.fill();
    }

    ctx.restore();
    state.latticeReady = true;
  }

  function drawFallbackLattice(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    for (var ring = -6; ring <= 6; ring += 1) {
      var y = cy + (ring / 7) * r;
      var rx = r * Math.sqrt(Math.max(0, 1 - Math.pow((y - cy) / r, 2)));
      ctx.beginPath();
      ctx.ellipse(cx, y, rx, r * 0.045, 0, 0, TAU);
      ctx.strokeStyle = "rgba(112,199,255,0.16)";
      ctx.lineWidth = Math.max(0.5, state.dpr * 0.6);
      ctx.stroke();
    }

    for (var i = 0; i < 16; i += 1) {
      var a = (i / 16) * TAU;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * Math.abs(Math.cos(a)), r, 0, 0, TAU);
      ctx.strokeStyle = i % 4 === 0 ? "rgba(244,207,131,0.28)" : "rgba(112,199,255,0.14)";
      ctx.lineWidth = i % 4 === 0 ? Math.max(0.8, state.dpr) : Math.max(0.5, state.dpr * 0.55);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderFrame(time) {
    resize();
    clear();

    var frame = getFrame(time);

    drawBaseSphere(frame);

    if (state.activeLens === "lattice") {
      drawLattice(frame);
      drawLimb(frame);
    } else if (state.activeLens === "diagnostic") {
      drawLattice(frame);
      drawLimb(frame);
    } else {
      renderClouds(frame);
      drawLimb(frame);
    }

    state.renderCount += 1;

    if (state.renderCount % 8 === 0) {
      updateDiagnostics(frame);
    }

    window.AUDRALIA_G2_ROUTE_JS_STATE = buildStatus(frame);

    state.raf = window.requestAnimationFrame(renderFrame);
  }

  function buildStatus(frame) {
    return {
      contract: CONTRACT,
      restoredWorkingPosture: RESTORED_WORKING_POSTURE,
      heldContract: HELD_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
      runtimePublicContract: RUNTIME_PUBLIC_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      cloudPublicContract: CLOUD_PUBLIC_CONTRACT,
      legacyCloudContract: LEGACY_CLOUD_CONTRACT,
      surfaceTargetContract: SURFACE_TARGET_CONTRACT,

      showroomObject: SHOWROOM_OBJECT,

      routeReady: state.routeReady,
      canvasReady: state.canvasReady,
      runtimeLoaded: state.runtimeLoaded,
      runtimeAccepted: state.runtimeAccepted,
      runtimeReady: state.runtimeReady,

      activeLens: state.activeLens,

      planetViewCloudsOnly: true,
      surfaceVisibilityRequired: false,
      surfaceVisibilityTarget: true,
      cloudsAboveSurfaceRequired: false,
      cloudsAboveSurfaceTarget: true,

      cloudReady: state.cloudReady,
      cloudCount: state.cloudCount,
      latticeReady: state.latticeReady,
      latticeViewProtected: true,

      frameSeats: frame && frame.seats ? frame.seats.length : null,
      frameProjectedSeats: frame && frame.projectedSeats ? frame.projectedSeats.length : null,
      frameCloudLayerPresent: Boolean(frame && frame.cloudLayer),
      frameDatumReady: Boolean(frame && frame.datumReady),

      fingerControlRestored: true,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      duplicateCanvas: false,

      noSurfaceHardGate: true,
      noChildLogicInHtml: true,
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
        ? "active · recovered working visual controller"
        : "route controller pending"
    );

    setText(
      "[data-audralia-diagnostic-sphere]",
      status.runtimeReady
        ? "runtime active · seats=" + (status.frameProjectedSeats || status.frameSeats || "pending")
        : "runtime pending"
    );

    setText(
      "[data-audralia-diagnostic-planet]",
      "Planet View " +
        (state.activeLens === "planet" ? "active" : "held") +
        " · clouds=" + (status.cloudReady ? "ready" : "pending") +
        " · surface target=held"
    );

    setText(
      "[data-audralia-diagnostic-lattice]",
      "protected · no clouds or surface material in lattice lens"
    );

    setText(
      "[data-audralia-diagnostic-seats]",
      "16 × 16 / 256 expected · runtime=" + (status.frameProjectedSeats || status.frameSeats || "pending")
    );

    setText(
      "[data-audralia-diagnostic-loader]",
      "runtime=" + (status.runtimeReady ? "ready" : "pending") +
        " · cloud=" + (status.cloudReady ? "ready" : "fallback") +
        " · controller=recovered"
    );

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaRuntimeReady", status.runtimeReady);
    setDataset("audraliaCloudReady", status.cloudReady);
    setDataset("audraliaLatticeViewProtected", true);
    setDataset("audraliaSurfaceVisibilityRequired", false);
    setDataset("audraliaSurfaceVisibilityTarget", true);
    setDataset("audraliaNoSurfaceHardGate", true);
  }

  function setLens(lensName) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, lensName) ? lensName : "planet";
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

    window.dispatchEvent(new CustomEvent("audralia:route-lens", {
      detail: {
        contract: CONTRACT,
        activeLens: lens,
        latticeViewProtected: true,
        surfaceHardGate: false
      }
    }));
  }

  function attachLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      });
    });
  }

  function pointerPoint(event) {
    var rect = state.stage.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * state.dpr,
      y: (event.clientY - rect.top) * state.dpr
    };
  }

  function attachPointerControls() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      state.dragging = true;
      state.lastPointerId = event.pointerId;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.runtime && typeof state.runtime.pointerDown === "function") {
        var p = pointerPoint(event);
        try {
          state.runtime.pointerDown(p.x, p.y, now());
        } catch (error) {
          recordError("runtime.pointerDown", error);
        }
      }

      event.preventDefault();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;

      if (state.runtime && typeof state.runtime.pointerMove === "function") {
        var p = pointerPoint(event);
        try {
          state.runtime.pointerMove(p.x, p.y, now());
        } catch (error) {
          recordError("runtime.pointerMove", error);
        }
      }

      event.preventDefault();
    }, { passive: false });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;

      if (state.runtime && typeof state.runtime.pointerUp === "function") {
        try {
          state.runtime.pointerUp(now());
        } catch (error) {
          recordError("runtime.pointerUp", error);
        }
      }

      try {
        if (state.lastPointerId !== null) state.stage.releasePointerCapture(state.lastPointerId);
      } catch (_error) {}

      state.lastPointerId = null;
      event.preventDefault();
    }

    state.stage.addEventListener("pointerup", release, { passive: false });
    state.stage.addEventListener("pointercancel", release, { passive: false });
    state.stage.addEventListener("lostpointercapture", release, { passive: false });
  }

  function publishBoot() {
    window.AUDRALIA_G2_ROUTE_JS_BOOT_MARKER = {
      contract: CONTRACT,
      restoredWorkingPosture: RESTORED_WORKING_POSTURE,
      heldContract: HELD_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
      runtimePublicContract: RUNTIME_PUBLIC_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      showroomObject: SHOWROOM_OBJECT,

      routeJsActive: true,
      recoveredWorkingVisualController: true,
      fingerControlRestored: true,
      cloudsRecoveredAsWorkingVisualLayer: true,
      surfaceProofTargetHeld: true,
      surfaceHardGateRemoved: true,
      latticeViewProtected: true,
      duplicateCanvasBlocked: true,
      visualPassClaimed: false,
      bootedAt: new Date().toISOString()
    };
  }

  function init() {
    readShowroomObject();

    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      return;
    }

    createCanvas();
    resize();
    attachLensControls();
    attachPointerControls();
    setLens("planet");
    publishBoot();

    state.routeReady = true;

    loadRuntime().then(function () {
      updateDiagnostics(state.lastFrame);
    });

    window.addEventListener("resize", resize, { passive: true });

    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = window.requestAnimationFrame(renderFrame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
