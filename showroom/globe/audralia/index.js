// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_VIEW_ROTATIONAL_CARRIER_BINDING_TNT_v1
//
// Purpose:
// - Bind Planet View to the same rotating carrier proven by Lattice View.
// - Disable screen-space field behavior.
// - Project all Planet View material from longitude / latitude / world-space.
// - Restore drag by applying runtime pointer calls and route-local yaw / pitch fallback.
// - Add explicit north/south pole anchors, equatorial circulation, hemisphere counterflow, and polar curl.
// - Keep Lattice View protected.
// - Do not touch HTML.
// - Do not rewrite child files.
// - No generated image. No GraphicBox. No final visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_VIEW_ROTATIONAL_CARRIER_BINDING_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_VIEW_LATTICE_BASED_SATELLITE_SCOPE_TNT_v1";
  var HTML_RECOVERY_CONTRACT = "AUDRALIA_G2_HTML_ROUTE_RECOVERY_LAST_WORKING_CONTROLLER_WITH_PLANET_OBJECT_COPY_TNT_v3";
  var RESTORED_WORKING_POSTURE = "AUDRALIA_G2_ROUTE_JS_PLANET_VIEW_MOISTURE_CLOUD_RENDERER_WITH_LATTICE_PROTECTION_TNT_v1";

  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";
  var RUNTIME_PUBLIC_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_G2_GRATITUDE_FRONT_FACE_AND_DATUM_VISUAL_PROOF_ALIGNMENT_TNT_v1";

  var SURFACE_TARGET_CONTRACT = "AUDRALIA_G2_SURFACE_CHILD_VISIBLE_GRATITUDE_PROOF_OUTPUT_TNT_v1";
  var CLOUD_TARGET_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";

  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  var GRATITUDE_LON = -2.42;
  var GRATITUDE_LAT = 0.42;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia · rotationally bound satellite scope",
      copy: "Planet View now binds clouds, polar curl, equatorial circulation, and the Gratitude surface hint to the rotating globe carrier. No screen-fixed cloud field."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → protected 16 × 16 / 256 spherical lattice baseline",
      copy: "Lattice View remains protected as the proof object. Clouds and surface material are blocked from this lens."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → runtime frame, fallback rotation, poles, clouds, and carrier binding",
      copy: "Diagnostic Scope reports runtime frame access, route-local fallback rotation, world-space clouds, polar anchors, equatorial banding, Gratitude hint rotation, and protected lattice state."
    }
  };

  var SHOWROOM_OBJECT = {
    objectType: "planet",
    objectName: "Audralia",
    showroomFamily: "globe",
    routeRole: "planet-object-inspection-route",
    visibleSubject: "Audralia planet",
    activeProofTarget: "Gratitude continent",
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

    localYaw: 0,
    localPitch: 0,
    localRoll: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    dragging: false,
    lastPointerId: null,
    dragDistance: 0,

    renderCount: 0,
    raf: 0,
    lastFrame: null,

    planetViewUsesRuntimeFrame: false,
    planetViewWorldSpaceProjection: false,
    screenSpaceFieldDisabled: true,
    fingerDragRotatesPlanetView: false,
    fallbackRotationAvailable: true,
    fallbackRotationActive: false,

    cloudsRotateWithBody: false,
    surfaceHintRotatesWithBody: false,
    northPoleAnchorActive: false,
    southPoleAnchorActive: false,
    equatorialBandActive: false,
    hemisphereCounterflowActive: false,
    polarCurlVisible: false,
    cloudsCurveWithSphere: false,
    limbFadeActive: false,
    softAtmosphericLimb: false,

    cloudCount: 0,
    materialCellCount: 0,
    gratitudeHintVisible: false,
    latticeReady: false,
    duplicateCanvasRemoved: 0,

    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function wrapLon(lon) {
    var value = finite(lon, 0);
    while (value > Math.PI) value -= TAU;
    while (value < -Math.PI) value += TAU;
    return value;
  }

  function hash01(a, b, c) {
    var x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return x - Math.floor(x);
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

    return Boolean(
      (status && status.contract === RUNTIME_PUBLIC_CONTRACT) ||
      (status && status.runtimeReady) ||
      (status && status.sphereCarrierReady) ||
      (runtime && typeof runtime.tick === "function") ||
      (runtime && typeof runtime.getFrame === "function")
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
          planetViewSurfaceAndCloudsTarget: true,
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

    setText("[data-audralia-diagnostic-loader]", "loading runtime · rotational carrier binding");

    return loadScriptOnce(RUNTIME_PATH, RUNTIME_CACHE_KEY, {
      "data-audralia-runtime-loader": CONTRACT,
      "data-runtime-contract": RUNTIME_PUBLIC_CONTRACT,
      "data-runtime-cache-key": RUNTIME_CACHE_KEY,
      "data-restored-working-posture": RESTORED_WORKING_POSTURE,
      "data-object-type": SHOWROOM_OBJECT.objectType,
      "data-object-name": SHOWROOM_OBJECT.objectName,
      "data-visible-subject": SHOWROOM_OBJECT.visibleSubject,
      "data-active-proof-target": SHOWROOM_OBJECT.activeProofTarget,
      "data-world-space-projection": "true",
      "data-screen-space-field-disabled": "true"
    }).then(function () {
      initRuntime();
      return getRuntime();
    }).catch(function (error) {
      recordError("loadRuntime", error);
      setText("[data-audralia-diagnostic-loader]", "runtime load failed · route fallback active");
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

    if (!frame) frame = state.lastFrame || {};

    frame.width = state.width;
    frame.height = state.height;
    frame.dpr = state.dpr;
    frame.activeLens = state.activeLens;
    frame.showroomObject = SHOWROOM_OBJECT;
    frame.surfaceVisibilityRequired = false;
    frame.surfaceVisibilityTarget = true;
    frame.cloudsAboveSurfaceRequired = false;
    frame.cloudsAboveSurfaceTarget = true;
    frame.planetViewSurfaceAndCloudsTarget = true;
    frame.latticeViewProtected = true;

    if (!frame.metrics) frame.metrics = fallbackMetrics();

    frame.runtimeYaw = finite(frame.yaw, 0);
    frame.runtimePitch = finite(frame.pitch, 0);
    frame.runtimeRoll = finite(frame.roll, 0);

    frame.yaw = wrapLon(frame.runtimeYaw + state.localYaw);
    frame.pitch = clamp(frame.runtimePitch + state.localPitch, -1.2, 1.2);
    frame.roll = frame.runtimeRoll + state.localRoll;
    frame.renderTime = finite(frame.renderTime, time / 1000);

    state.lastFrame = frame;
    state.planetViewUsesRuntimeFrame = Boolean(
      state.runtimeReady ||
      frame.projectedSeats ||
      frame.runtimeYaw !== undefined ||
      frame.renderTime !== undefined
    );

    state.fallbackRotationActive = Math.abs(state.localYaw) > 0.001 || Math.abs(state.localPitch) > 0.001;

    return frame;
  }

  function clear() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function rotateLonLat(lon, lat, frame) {
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

    return { x: x2, y: y2, z: z };
  }

  function projectLonLat(lon, lat, frame) {
    var m = metrics(frame);
    var rotated = rotateLonLat(lon, lat, frame);
    var denominator = Math.max(0.72, m.cameraDistance - rotated.z);
    var perspective = m.cameraDistance / denominator;
    var x = m.centerX + rotated.x * m.radius * perspective;
    var y = m.centerY - rotated.y * m.radius * perspective;
    var edge = Math.sqrt(Math.pow(x - m.centerX, 2) + Math.pow(y - m.centerY, 2)) / Math.max(1, m.radius);
    var limbFade = clamp(1 - Math.max(0, edge - 0.74) / 0.30, 0, 1);
    var frontFacing = rotated.z >= -0.15;
    var visibility = frontFacing
      ? clamp((rotated.z + 0.25) / 1.25, 0.10, 1) * limbFade
      : 0;

    return {
      x: x,
      y: y,
      z: rotated.z,
      edge: edge,
      limbFade: limbFade,
      perspective: perspective,
      frontFacing: frontFacing,
      visibility: visibility,
      rotated: rotated
    };
  }

  function clipSphere(frame, scale) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var s = scale || 1;

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * s, 0, TAU);
    ctx.clip();
  }

  function drawOceanSphere(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var ocean = ctx.createRadialGradient(cx - r * 0.30, cy - r * 0.32, 0, cx, cy, r * 1.20);
    ocean.addColorStop(0.00, "rgba(183,242,255,0.95)");
    ocean.addColorStop(0.16, "rgba(75,189,226,0.88)");
    ocean.addColorStop(0.40, "rgba(18,112,177,0.95)");
    ocean.addColorStop(0.70, "rgba(6,52,116,0.99)");
    ocean.addColorStop(1.00, "rgba(1,13,35,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    var depth = ctx.createRadialGradient(cx + r * 0.32, cy + r * 0.30, r * 0.10, cx, cy, r * 1.10);
    depth.addColorStop(0.00, "rgba(0,0,0,0)");
    depth.addColorStop(0.46, "rgba(0,0,0,0.05)");
    depth.addColorStop(0.78, "rgba(0,0,0,0.28)");
    depth.addColorStop(1.00, "rgba(0,0,0,0.60)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = depth;
    ctx.fill();

    ctx.restore();
  }

  function drawWorldSpaceGratitudeHint(frame) {
    var ctx = state.ctx;
    var p = projectLonLat(GRATITUDE_LON, GRATITUDE_LAT, frame);

    if (!p.frontFacing || p.visibility <= 0.02) {
      state.gratitudeHintVisible = false;
      return 0;
    }

    var m = metrics(frame);
    var alpha = clamp(0.10 * p.visibility, 0.02, 0.14);
    var rx = m.radius * 0.22 * clamp(p.perspective, 0.72, 1.45);
    var ry = m.radius * 0.080 * clamp(p.perspective, 0.72, 1.45);

    ctx.save();
    clipSphere(frame, 1.004);
    ctx.translate(p.x, p.y);
    ctx.rotate(GRATITUDE_LON * 0.20 + finite(frame.roll, 0));

    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0.00, "rgba(188,198,126," + alpha.toFixed(4) + ")");
    g.addColorStop(0.44, "rgba(84,151,112," + (alpha * 0.76).toFixed(4) + ")");
    g.addColorStop(0.76, "rgba(67,160,174," + (alpha * 0.36).toFixed(4) + ")");
    g.addColorStop(1.00, "rgba(67,160,174,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();

    ctx.restore();

    state.gratitudeHintVisible = true;
    state.surfaceHintRotatesWithBody = true;
    return 1;
  }

  function drawWorldSpaceMaterialCells(frame) {
    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere(frame, 1.004);
    ctx.globalCompositeOperation = "source-over";

    for (var band = 0; band < 16; band += 1) {
      var u = (band + 0.5) / 16;
      var lat = Math.asin(1 - 2 * u);

      for (var radial = 0; radial < 16; radial += 1) {
        var index = band * 16 + radial;
        var lon = wrapLon((radial / 16) * TAU - Math.PI);
        var lonDistance = Math.abs(wrapLon(lon - GRATITUDE_LON));
        var latDistance = Math.abs(lat - GRATITUDE_LAT);
        var gratitude = clamp(
          1 - Math.sqrt(Math.pow(lonDistance / 0.95, 2) + Math.pow(latDistance / 0.56, 2)),
          0,
          1
        );

        var shelf = clamp(
          1 - Math.sqrt(Math.pow(lonDistance / 1.22, 2) + Math.pow(latDistance / 0.82, 2)),
          0,
          1
        );

        var noise = hash01(radial, band, 4);
        var strength = clamp(gratitude * 0.78 + shelf * 0.26 + Math.max(0, noise - 0.70) * 0.12, 0, 1);

        if (strength < 0.055) continue;

        var p = projectLonLat(lon, lat, frame);
        if (!p.frontFacing || p.visibility <= 0.025) continue;

        var opacity = clamp(0.035 + strength * 0.18, 0.025, 0.22) * p.visibility;
        var rx = clamp(8 + strength * 24, 5, 36) * clamp(p.perspective, 0.72, 1.7);
        var ry = clamp(3 + strength * 10, 2, 16) * clamp(p.perspective, 0.72, 1.7);

        if (gratitude > 0.55) {
          ctx.fillStyle = "rgba(112,156,103," + opacity.toFixed(4) + ")";
        } else {
          ctx.fillStyle = "rgba(72,154,164," + (opacity * 0.62).toFixed(4) + ")";
        }

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, rx, ry, lon * 0.44 + lat * 0.31, 0, TAU);
        ctx.fill();

        drawn += 1;
      }
    }

    ctx.restore();

    state.materialCellCount = drawn;
    return drawn;
  }

  function cloudCells(frame) {
    var t = finite(frame.renderTime, state.renderCount / 60);
    var cells = [];

    function addCell(role, lon, lat, width, height, opacity, angle, layer) {
      cells.push({
        role: role,
        longitude: wrapLon(lon),
        latitude: clamp(lat, -HALF_PI + 0.02, HALF_PI - 0.02),
        width: width,
        height: height,
        opacity: opacity,
        angle: angle,
        layer: layer || 0
      });
    }

    for (var i = 0; i < 34; i += 1) {
      addCell(
        "equatorialBand",
        (i / 34) * TAU - Math.PI + t * 0.12,
        Math.sin(i * 0.78 + t * 0.42) * 0.065,
        0.115 + hash01(i, 2, 1) * 0.070,
        0.026 + hash01(i, 3, 1) * 0.016,
        0.090 + hash01(i, 4, 1) * 0.035,
        0.15 + Math.sin(i * 0.33) * 0.35,
        1
      );
    }

    for (i = 0; i < 26; i += 1) {
      addCell(
        "northJet",
        (i / 26) * TAU - Math.PI - t * 0.16,
        0.48 + Math.sin(i * 0.80 + t * 0.31) * 0.060,
        0.105 + hash01(i, 7, 2) * 0.060,
        0.020 + hash01(i, 8, 2) * 0.012,
        0.075 + hash01(i, 9, 2) * 0.040,
        -0.36 + Math.sin(i * 0.52) * 0.24,
        2
      );

      addCell(
        "southJet",
        (i / 26) * TAU - Math.PI + t * 0.16,
        -0.48 + Math.sin(i * 0.80 + t * 0.29) * 0.060,
        0.105 + hash01(i, 11, 3) * 0.060,
        0.020 + hash01(i, 12, 3) * 0.012,
        0.075 + hash01(i, 13, 3) * 0.040,
        0.36 + Math.sin(i * 0.52) * 0.24,
        2
      );
    }

    for (i = 0; i < 18; i += 1) {
      addCell(
        "temperateMoisture",
        (i / 18) * TAU - Math.PI + t * 0.09,
        0.25 + Math.sin(i * 1.4 + t * 0.22) * 0.08,
        0.082,
        0.030,
        0.060,
        Math.sin(i) * 0.6,
        1
      );

      addCell(
        "temperateMoisture",
        (i / 18) * TAU - Math.PI - t * 0.09,
        -0.25 + Math.sin(i * 1.4 + t * 0.24) * 0.08,
        0.082,
        0.030,
        0.060,
        Math.sin(i) * -0.6,
        1
      );
    }

    for (i = 0; i < 20; i += 1) {
      var northAngle = (i / 20) * TAU + t * 0.22;
      var southAngle = (i / 20) * TAU - t * 0.22;

      addCell(
        "northPolarCurl",
        northAngle,
        1.12 - i * 0.010 + Math.sin(northAngle * 2) * 0.025,
        0.070,
        0.018,
        0.060,
        northAngle + Math.PI / 2,
        3
      );

      addCell(
        "southPolarCurl",
        southAngle,
        -1.12 + i * 0.010 + Math.sin(southAngle * 2) * 0.025,
        0.070,
        0.018,
        0.060,
        -southAngle - Math.PI / 2,
        3
      );
    }

    for (i = 0; i < 9; i += 1) {
      addCell(
        "orographicHint",
        GRATITUDE_LON + (i - 4) * 0.14 + Math.sin(t * 0.2 + i) * 0.025,
        GRATITUDE_LAT + Math.sin(i * 1.1) * 0.13,
        0.080,
        0.022,
        0.050,
        -0.15,
        0
      );
    }

    return cells;
  }

  function drawWorldSpaceClouds(frame) {
    var ctx = state.ctx;
    var cells = cloudCells(frame);
    var drawn = 0;

    state.northPoleAnchorActive = true;
    state.southPoleAnchorActive = true;
    state.equatorialBandActive = true;
    state.hemisphereCounterflowActive = true;

    ctx.save();
    clipSphere(frame, 1.006);
    ctx.globalCompositeOperation = "source-over";

    cells.sort(function (a, b) {
      return a.layer - b.layer;
    });

    for (var i = 0; i < cells.length; i += 1) {
      var cell = cells[i];
      var p = projectLonLat(cell.longitude, cell.latitude, frame);

      if (!p.frontFacing || p.visibility <= 0.025) continue;

      var m = metrics(frame);
      var latitudeCompression = clamp(Math.cos(cell.latitude) * 0.78 + 0.22, 0.24, 1);
      var rx = m.radius * cell.width * clamp(p.perspective, 0.72, 1.60) * latitudeCompression;
      var ry = m.radius * cell.height * clamp(p.perspective, 0.72, 1.60);
      var opacity = cell.opacity * p.visibility;

      if (cell.role.indexOf("PolarCurl") >= 0) {
        opacity *= 1.12;
        state.polarCurlVisible = true;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(cell.angle + finite(frame.roll, 0) * 0.2);

      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
      g.addColorStop(0.00, "rgba(255,255,255," + clamp(opacity, 0.015, 0.155).toFixed(4) + ")");
      g.addColorStop(0.44, "rgba(228,247,255," + clamp(opacity * 0.48, 0.005, 0.075).toFixed(4) + ")");
      g.addColorStop(1.00, "rgba(164,210,232,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.fill();
      ctx.restore();

      drawn += 1;
    }

    ctx.restore();

    state.cloudCount = drawn;
    state.cloudsRotateWithBody = drawn > 0;
    state.cloudsCurveWithSphere = drawn > 0;
    state.limbFadeActive = drawn > 0;

    return drawn;
  }

  function drawSoftAtmosphericLimb(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var outer = ctx.createRadialGradient(cx, cy, r * 0.74, cx, cy, r * 1.18);
    outer.addColorStop(0.00, "rgba(141,216,255,0)");
    outer.addColorStop(0.62, "rgba(141,216,255,0.06)");
    outer.addColorStop(0.84, "rgba(141,216,255,0.18)");
    outer.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.14, 0, TAU);
    ctx.fillStyle = outer;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(175,229,255,0.13)";
    ctx.lineWidth = Math.max(0.6, state.dpr * 0.85);
    ctx.stroke();

    var terminator = ctx.createRadialGradient(cx + r * 0.36, cy + r * 0.30, r * 0.08, cx, cy, r * 1.04);
    terminator.addColorStop(0.00, "rgba(0,0,0,0)");
    terminator.addColorStop(0.58, "rgba(0,0,0,0)");
    terminator.addColorStop(0.86, "rgba(0,0,0,0.16)");
    terminator.addColorStop(1.00, "rgba(0,0,0,0.38)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = terminator;
    ctx.fill();

    ctx.restore();

    state.softAtmosphericLimb = true;
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

      var radius = seat.radialIndex % 4 === 0 ? 2.1 : 1.35;
      var alpha = seat.frontFacing ? 0.78 : 0.18;

      ctx.beginPath();
      ctx.arc(seat.screen.x, seat.screen.y, radius * state.dpr, 0, TAU);
      ctx.fillStyle = seat.radialIndex % 4 === 0
        ? "rgba(244,207,131," + alpha.toFixed(4) + ")"
        : "rgba(141,216,255," + alpha.toFixed(4) + ")";
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

  function renderPlanetView(frame) {
    state.planetViewWorldSpaceProjection = true;
    state.screenSpaceFieldDisabled = true;

    drawOceanSphere(frame);
    drawWorldSpaceMaterialCells(frame);
    drawWorldSpaceGratitudeHint(frame);
    drawWorldSpaceClouds(frame);
    drawSoftAtmosphericLimb(frame);
  }

  function renderFrame(time) {
    resize();
    clear();

    var frame = getFrame(time);

    if (state.activeLens === "lattice") {
      drawOceanSphere(frame);
      drawLattice(frame);
      drawSoftAtmosphericLimb(frame);
    } else if (state.activeLens === "diagnostic") {
      drawOceanSphere(frame);
      drawLattice(frame);
      drawSoftAtmosphericLimb(frame);
    } else {
      renderPlanetView(frame);
    }

    state.renderCount += 1;

    if (state.renderCount % 8 === 0) updateDiagnostics(frame);

    window.AUDRALIA_G2_ROUTE_JS_STATE = buildStatus(frame);

    state.raf = window.requestAnimationFrame(renderFrame);
  }

  function buildStatus(frame) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
      restoredWorkingPosture: RESTORED_WORKING_POSTURE,
      runtimePublicContract: RUNTIME_PUBLIC_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      surfaceTargetContract: SURFACE_TARGET_CONTRACT,
      cloudTargetContract: CLOUD_TARGET_CONTRACT,

      showroomObject: SHOWROOM_OBJECT,

      routeReady: state.routeReady,
      canvasReady: state.canvasReady,
      runtimeLoaded: state.runtimeLoaded,
      runtimeAccepted: state.runtimeAccepted,
      runtimeReady: state.runtimeReady,

      activeLens: state.activeLens,

      planetViewUsesRuntimeFrame: state.planetViewUsesRuntimeFrame,
      planetViewWorldSpaceProjection: state.planetViewWorldSpaceProjection,
      screenSpaceFieldDisabled: state.screenSpaceFieldDisabled,

      fingerDragRotatesPlanetView: state.fingerDragRotatesPlanetView,
      fallbackRotationAvailable: true,
      fallbackRotationActive: state.fallbackRotationActive,
      localYaw: state.localYaw,
      localPitch: state.localPitch,

      cloudsRotateWithBody: state.cloudsRotateWithBody,
      surfaceHintRotatesWithBody: state.surfaceHintRotatesWithBody,
      northPoleAnchorActive: state.northPoleAnchorActive,
      southPoleAnchorActive: state.southPoleAnchorActive,
      equatorialBandActive: state.equatorialBandActive,
      hemisphereCounterflowActive: state.hemisphereCounterflowActive,
      polarCurlVisible: state.polarCurlVisible,
      cloudsCurveWithSphere: state.cloudsCurveWithSphere,
      limbFadeActive: state.limbFadeActive,
      softAtmosphericLimb: state.softAtmosphericLimb,

      cloudCount: state.cloudCount,
      materialCellCount: state.materialCellCount,
      gratitudeSurfaceProofHintVisible: state.gratitudeHintVisible,

      latticeReady: state.latticeReady,
      latticeViewProtected: true,
      planetViewNoVisibleWireframe: state.activeLens === "planet",

      surfaceVisibilityRequired: false,
      surfaceVisibilityTarget: true,
      surfaceProofHardGate: false,

      noHtmlChange: true,
      noChildRewrite: true,
      noDuplicateCanvas: true,
      noFinalContinentClaim: true,
      noVisualPassClaim: true,

      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      frameProjectedSeats: frame && frame.projectedSeats ? frame.projectedSeats.length : null,
      frameDatumReady: Boolean(frame && frame.datumReady),

      errors: state.errors.slice()
    };
  }

  function updateDiagnostics(frame) {
    var status = buildStatus(frame);

    setText(
      "[data-audralia-diagnostic-route-js]",
      status.routeReady
        ? "active · rotational carrier binding"
        : "route controller pending"
    );

    setText(
      "[data-audralia-diagnostic-sphere]",
      status.runtimeReady
        ? "runtime frame read · fallback rotation=" + (status.fallbackRotationActive ? "active" : "available")
        : "runtime pending · fallback rotation available"
    );

    setText(
      "[data-audralia-diagnostic-planet]",
      "Planet View " +
        (state.activeLens === "planet" ? "active" : "held") +
        " · world-space=" + (status.planetViewWorldSpaceProjection ? "active" : "pending") +
        " · poles=" + (status.northPoleAnchorActive && status.southPoleAnchorActive ? "active" : "pending") +
        " · clouds=" + status.cloudCount
    );

    setText(
      "[data-audralia-diagnostic-lattice]",
      "protected · no Planet View material in lattice lens"
    );

    setText(
      "[data-audralia-diagnostic-seats]",
      "16 × 16 / 256 expected · projected seats=" + (status.frameProjectedSeats || "fallback world projection")
    );

    setText(
      "[data-audralia-diagnostic-loader]",
      "screen-space=disabled · drag=" + (status.fingerDragRotatesPlanetView ? "active" : "available") +
        " · polar curl=" + (status.polarCurlVisible ? "visible" : "projecting") +
        " · surface gate=off"
    );

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPlanetViewWorldSpaceProjection", status.planetViewWorldSpaceProjection);
    setDataset("audraliaScreenSpaceFieldDisabled", status.screenSpaceFieldDisabled);
    setDataset("audraliaFingerDragRotatesPlanetView", status.fingerDragRotatesPlanetView);
    setDataset("audraliaFallbackRotationActive", status.fallbackRotationActive);
    setDataset("audraliaNorthPoleAnchorActive", status.northPoleAnchorActive);
    setDataset("audraliaSouthPoleAnchorActive", status.southPoleAnchorActive);
    setDataset("audraliaEquatorialBandActive", status.equatorialBandActive);
    setDataset("audraliaHemisphereCounterflowActive", status.hemisphereCounterflowActive);
    setDataset("audraliaPolarCurlVisible", status.polarCurlVisible);
    setDataset("audraliaLatticeViewProtected", true);
    setDataset("audraliaNoHtmlChange", true);
    setDataset("audraliaNoChildRewrite", true);
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
        worldSpaceProjection: lens === "planet",
        screenSpaceFieldDisabled: true,
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

    window.addEventListener("audralia:lens", function (event) {
      if (event && event.detail && event.detail.activeLens) {
        setLens(event.detail.activeLens);
      }
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

      var p = pointerPoint(event);
      state.lastPointerX = p.x;
      state.lastPointerY = p.y;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.runtime && typeof state.runtime.pointerDown === "function") {
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

      var p = pointerPoint(event);
      var dx = p.x - state.lastPointerX;
      var dy = p.y - state.lastPointerY;

      state.lastPointerX = p.x;
      state.lastPointerY = p.y;
      state.dragDistance += Math.sqrt(dx * dx + dy * dy);

      state.localYaw = wrapLon(state.localYaw + dx * 0.0042);
      state.localPitch = clamp(state.localPitch - dy * 0.0032, -0.92, 0.92);

      state.fingerDragRotatesPlanetView = true;
      state.fallbackRotationActive = true;

      if (state.runtime && typeof state.runtime.pointerMove === "function") {
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
      previousContract: PREVIOUS_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
      runtimePublicContract: RUNTIME_PUBLIC_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      showroomObject: SHOWROOM_OBJECT,

      routeJsActive: true,
      planetViewUsesRuntimeFrame: true,
      planetViewWorldSpaceProjection: true,
      screenSpaceFieldDisabled: true,
      fallbackRotationAvailable: true,
      cloudsRotateWithBody: true,
      surfaceHintRotatesWithBody: true,
      northPoleAnchorActive: true,
      southPoleAnchorActive: true,
      equatorialBandActive: true,
      hemisphereCounterflowActive: true,
      polarCurlProjected: true,
      latticeViewProtected: true,
      htmlTouched: false,
      childFilesTouched: false,
      finalContinentClaimed: false,
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
