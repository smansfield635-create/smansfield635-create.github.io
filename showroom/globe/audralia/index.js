// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_VIEW_LATTICE_BASED_SATELLITE_SCOPE_TNT_v1
//
// Purpose:
// - Preserve the recovered working controller.
// - Keep Lattice View as the protected proof object.
// - Make Planet View inherit the proven runtime/lattice carrier as hidden material projection.
// - Restore finger inspection by reading runtime yaw / pitch / roll every frame.
// - Replace hard circular rim with soft atmospheric limb.
// - Replace flat brush-stroke cloud fallback with sphere-curved satellite cloud bands.
// - Add faint Gratitude surface pressure as a visible target hint, not a final continent claim.
// - Do not rewrite HTML.
// - Do not rewrite child files.
// - No generated image. No GraphicBox. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_VIEW_LATTICE_BASED_SATELLITE_SCOPE_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_ROUTE_JS_WORKING_VISUAL_CONTROLLER_RECOVERY_TNT_v1";
  var RESTORED_WORKING_POSTURE = "AUDRALIA_G2_ROUTE_JS_PLANET_VIEW_MOISTURE_CLOUD_RENDERER_WITH_LATTICE_PROTECTION_TNT_v1";
  var HELD_CONTRACT = "AUDRALIA_G2_ROUTE_JS_SHOWROOM_PLANET_OBJECT_GRANDPARENT_CONTROLLER_TNT_v5";
  var HTML_RECOVERY_CONTRACT = "AUDRALIA_G2_HTML_ROUTE_RECOVERY_LAST_WORKING_CONTROLLER_WITH_PLANET_OBJECT_COPY_TNT_v3";

  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";
  var RUNTIME_PUBLIC_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_G2_GRATITUDE_FRONT_FACE_AND_DATUM_VISUAL_PROOF_ALIGNMENT_TNT_v1";

  var SURFACE_TARGET_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1";
  var CLOUD_TARGET_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";

  var TAU = Math.PI * 2;
  var GRATITUDE_LON = -2.42;
  var GRATITUDE_LAT = 0.42;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia · lattice-based satellite scope · Gratitude proof target held",
      copy: "Planet View now uses the proven runtime/lattice carrier as hidden material projection. Surface hints and cloud bands curve with the sphere; Gratitude proof remains a target, not a hard boot gate."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → protected 16 × 16 / 256 spherical lattice baseline",
      copy: "Lattice View is protected. It shows the runtime-owned 16 radial nodes × 16 Fibonacci bands as a spherical 256-seat structure. Clouds and surface material stay out of this lens."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → satellite scope, runtime, lattice carrier, clouds, and surface target status",
      copy: "Diagnostic Scope reports the satellite-scope Planet View, runtime sphere, hidden lattice-carrier sampling, cloud projection, active lens, protected lattice, and held Gratitude surface target."
    }
  };

  var SHOWROOM_OBJECT = {
    objectType: "planet",
    objectName: "Audralia",
    showroomFamily: "globe",
    routeRole: "planet-object-inspection-route",
    visibleSubject: "Audralia planet",
    activeProofTarget: "Gratitude continent",
    planetViewCloudsOnly: false,
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

    planetViewUsesRuntimeFrame: false,
    fingerDragRestored: false,
    latticeCarrierSampled: false,
    satelliteScopeMaterialActive: false,
    gratitudeHintVisible: false,
    cloudReady: false,
    cloudCount: 0,
    latticeReady: false,

    renderCount: 0,
    raf: 0,
    lastFrame: null,

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

  function hash01(a, b, c) {
    var x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function wrapLon(lon) {
    var v = lon;
    while (v > Math.PI) v -= TAU;
    while (v < -Math.PI) v += TAU;
    return v;
  }

  function angularDistance(a, b) {
    return Math.abs(wrapLon(a - b));
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
          planetViewCloudsOnly: false,
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

    setText("[data-audralia-diagnostic-loader]", "loading runtime · satellite scope");

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
    frame.planetViewCloudsOnly = false;
    frame.planetViewSurfaceAndCloudsTarget = true;
    frame.latticeViewProtected = true;

    if (!frame.metrics) frame.metrics = fallbackMetrics();

    state.lastFrame = frame;
    state.planetViewUsesRuntimeFrame = Boolean(frame && (frame.projectedSeats || frame.yaw !== undefined || frame.renderTime !== undefined));

    return frame;
  }

  function clear() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function clipSphere(frame, scale) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var s = scale || 1;

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * s, 0, TAU);
    ctx.clip();
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

    return {
      x: m.centerX + rotated.x * m.radius * perspective,
      y: m.centerY - rotated.y * m.radius * perspective,
      z: rotated.z,
      rotated: rotated,
      perspective: perspective,
      frontFacing: rotated.z >= -0.05,
      visibility: rotated.z >= 0 ? 1 : clamp(0.10 + (rotated.z + 1) * 0.12, 0, 0.18)
    };
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

  function normalizeSeatLonLat(seat) {
    var lon = finite(seat.longitude, NaN);
    var lat = finite(seat.latitude, NaN);

    if (!Number.isFinite(lon) && seat.spherePosition) {
      lon = Math.atan2(seat.spherePosition.z, seat.spherePosition.x);
    }

    if (!Number.isFinite(lat) && seat.spherePosition) {
      lat = Math.asin(clamp(seat.spherePosition.y, -1, 1));
    }

    if (Number.isFinite(lon) && lon > Math.PI) lon = wrapLon(lon);

    return {
      lon: Number.isFinite(lon) ? lon : 0,
      lat: Number.isFinite(lat) ? lat : 0
    };
  }

  function materialSignal(lon, lat, seatIndex) {
    var gratitudeLonDistance = angularDistance(lon, GRATITUDE_LON);
    var gratitudeLatDistance = Math.abs(lat - GRATITUDE_LAT);
    var gratitudeInfluence = clamp(1 - Math.sqrt(
      Math.pow(gratitudeLonDistance / 0.72, 2) +
      Math.pow(gratitudeLatDistance / 0.45, 2)
    ), 0, 1);

    var equatorialMoisture = clamp(1 - Math.abs(lat) / 1.05, 0, 1);
    var shelfPulse = Math.sin(lon * 3.0 + lat * 5.0) * 0.5 + 0.5;
    var terrainPulse = Math.sin(lon * 2.2 - lat * 4.6) * 0.5 + 0.5;
    var roughness = hash01(lon * 10, lat * 10, seatIndex || 1);

    var land = clamp(
      gratitudeInfluence * 0.88 +
      Math.max(0, shelfPulse - 0.62) * 0.18 +
      Math.max(0, terrainPulse - 0.70) * 0.10 -
      Math.abs(lat) * 0.05,
      0,
      1
    );

    var shelf = clamp(gratitudeInfluence * (1 - land * 0.36) + equatorialMoisture * 0.12 + roughness * 0.06, 0, 1);

    return {
      gratitude: gratitudeInfluence,
      land: land,
      shelf: shelf,
      moisture: equatorialMoisture,
      roughness: roughness
    };
  }

  function drawSatelliteMaterialFromCarrier(frame) {
    var ctx = state.ctx;
    var seats = frame && frame.projectedSeats ? frame.projectedSeats.slice() : [];
    var usedRuntimeSeats = seats.length > 0;
    var drawn = 0;

    if (!seats.length) {
      seats = buildFallbackCarrier(frame);
    }

    state.latticeCarrierSampled = seats.length > 0;

    ctx.save();
    clipSphere(frame, 1.004);
    ctx.globalCompositeOperation = "source-over";

    seats.sort(function (a, b) {
      var za = a.screen ? a.screen.z : a.z || 0;
      var zb = b.screen ? b.screen.z : b.z || 0;
      return za - zb;
    });

    for (var i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      var screen = seat.screen || seat;
      var frontFacing = seat.frontFacing !== false && finite(screen.z, 0) >= -0.08;
      if (!frontFacing) continue;

      var ll = normalizeSeatLonLat(seat);
      var signal = materialSignal(ll.lon, ll.lat, seat.seatIndex || i);
      var materialStrength = Math.max(signal.land, signal.shelf * 0.58, signal.gratitude * 0.75);

      if (materialStrength <= 0.035) continue;

      var edge = sphereEdgeFactor(screen.x, screen.y, frame);
      var limbFade = clamp(1 - Math.max(0, edge - 0.70) / 0.32, 0, 1);
      var visibility = clamp(finite(seat.visibility, 1), 0, 1) * limbFade;
      if (visibility <= 0.02) continue;

      var p = clamp(finite(screen.perspective, 1), 0.72, 1.75);
      var baseSize = usedRuntimeSeats ? 20 : 16;
      var rx = clamp(baseSize * p * (0.65 + materialStrength * 1.15), 4, 42);
      var ry = clamp(baseSize * p * (0.28 + materialStrength * 0.52), 2, 24);
      var opacity = clamp(0.055 + materialStrength * 0.28, 0.035, 0.36) * visibility;

      if (signal.land > 0.42) {
        ctx.fillStyle = "rgba(93,151,105," + opacity.toFixed(4) + ")";
      } else if (signal.shelf > 0.36) {
        ctx.fillStyle = "rgba(83,177,180," + (opacity * 0.72).toFixed(4) + ")";
      } else {
        ctx.fillStyle = "rgba(61,131,151," + (opacity * 0.38).toFixed(4) + ")";
      }

      ctx.beginPath();
      ctx.ellipse(
        screen.x,
        screen.y,
        rx,
        ry,
        ll.lon * 0.44 + ll.lat * 0.28,
        0,
        TAU
      );
      ctx.fill();

      if (signal.gratitude > 0.56) {
        ctx.fillStyle = "rgba(197,184,119," + (opacity * 0.44).toFixed(4) + ")";
        ctx.beginPath();
        ctx.ellipse(
          screen.x + Math.sin(ll.lon * 2) * rx * 0.18,
          screen.y + Math.cos(ll.lat * 5) * ry * 0.18,
          rx * 0.58,
          ry * 0.48,
          ll.lon * 0.25,
          0,
          TAU
        );
        ctx.fill();
      }

      drawn += 1;
    }

    ctx.restore();

    state.satelliteScopeMaterialActive = drawn > 0;
    return drawn;
  }

  function buildFallbackCarrier(frame) {
    var seats = [];

    for (var band = 0; band < 16; band += 1) {
      var u = (band + 0.5) / 16;
      var lat = Math.asin(1 - 2 * u);

      for (var radial = 0; radial < 16; radial += 1) {
        var lon = wrapLon((radial / 16) * TAU);
        var projected = projectLonLat(lon, lat, frame);

        seats.push({
          seatIndex: band * 16 + radial,
          radialIndex: radial,
          bandIndex: band,
          longitude: lon,
          latitude: lat,
          frontFacing: projected.frontFacing,
          visibility: projected.visibility,
          screen: {
            x: projected.x,
            y: projected.y,
            z: projected.z,
            perspective: projected.perspective
          }
        });
      }
    }

    return seats;
  }

  function sphereEdgeFactor(x, y, frame) {
    var m = metrics(frame);
    var dx = x - m.centerX;
    var dy = y - m.centerY;
    return Math.sqrt(dx * dx + dy * dy) / Math.max(1, m.radius);
  }

  function drawGratitudeProofHint(frame) {
    var ctx = state.ctx;
    var p = projectLonLat(GRATITUDE_LON, GRATITUDE_LAT, frame);

    if (!p.frontFacing || p.visibility <= 0.04) {
      state.gratitudeHintVisible = false;
      return;
    }

    var edge = sphereEdgeFactor(p.x, p.y, frame);
    var limbFade = clamp(1 - Math.max(0, edge - 0.72) / 0.28, 0, 1);
    var alpha = clamp(0.14 * p.visibility * limbFade, 0.02, 0.18);

    ctx.save();
    clipSphere(frame, 1.004);
    ctx.globalCompositeOperation = "source-over";
    ctx.translate(p.x, p.y);
    ctx.rotate(GRATITUDE_LON * 0.20 + finite(frame.roll, 0));

    var rx = metrics(frame).radius * 0.22 * clamp(p.perspective, 0.72, 1.45);
    var ry = metrics(frame).radius * 0.085 * clamp(p.perspective, 0.72, 1.45);

    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, "rgba(178,198,126," + alpha.toFixed(4) + ")");
    g.addColorStop(0.44, "rgba(91,151,112," + (alpha * 0.74).toFixed(4) + ")");
    g.addColorStop(0.76, "rgba(76,174,184," + (alpha * 0.36).toFixed(4) + ")");
    g.addColorStop(1, "rgba(76,174,184,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();

    ctx.restore();

    state.gratitudeHintVisible = true;
  }

  function drawSatelliteCloudBands(frame) {
    var ctx = state.ctx;
    var t = finite(frame.renderTime, state.renderCount / 60);
    var drawn = 0;

    ctx.save();
    clipSphere(frame, 1.006);
    ctx.globalCompositeOperation = "source-over";

    var bands = [
      { lat: -0.62, drift: 0.018, cells: 18, width: 0.125, height: 0.025, opacity: 0.105, wave: 2.6 },
      { lat: -0.28, drift: -0.026, cells: 24, width: 0.150, height: 0.034, opacity: 0.145, wave: 3.8 },
      { lat: 0.04, drift: 0.020, cells: 28, width: 0.175, height: 0.040, opacity: 0.135, wave: 4.6 },
      { lat: 0.36, drift: -0.022, cells: 22, width: 0.130, height: 0.032, opacity: 0.130, wave: 3.3 },
      { lat: 0.72, drift: 0.016, cells: 14, width: 0.095, height: 0.020, opacity: 0.090, wave: 2.2 }
    ];

    for (var b = 0; b < bands.length; b += 1) {
      var band = bands[b];

      for (var i = 0; i < band.cells; i += 1) {
        var baseLon = wrapLon((i / band.cells) * TAU - Math.PI + t * band.drift * TAU);
        var lat = band.lat + Math.sin(baseLon * band.wave + b * 1.7 + t * 0.12) * 0.055;
        var lon = wrapLon(baseLon + Math.sin(i * 1.3 + t * 0.08) * 0.05);

        var p = projectLonLat(lon, lat, frame);
        if (!p.frontFacing) continue;

        var edge = sphereEdgeFactor(p.x, p.y, frame);
        if (edge > 1.02) continue;

        var limbFade = clamp(1 - Math.max(0, edge - 0.74) / 0.28, 0, 1);
        var visibility = p.visibility * limbFade;
        if (visibility <= 0.03) continue;

        var localNoise = hash01(i, b, Math.floor(t * 2));
        var opacity = clamp(band.opacity * visibility * (0.78 + localNoise * 0.45), 0.025, 0.18);
        var rx = metrics(frame).radius * band.width * clamp(p.perspective, 0.75, 1.65) * (0.72 + localNoise * 0.72);
        var ry = metrics(frame).radius * band.height * clamp(p.perspective, 0.75, 1.65) * (0.78 + localNoise * 0.35);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(lon * 0.28 + lat * 0.55 + b * 0.2);

        var g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
        g.addColorStop(0.00, "rgba(255,255,255," + opacity.toFixed(4) + ")");
        g.addColorStop(0.42, "rgba(226,246,255," + (opacity * 0.50).toFixed(4) + ")");
        g.addColorStop(1.00, "rgba(170,210,230,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
        ctx.fill();
        ctx.restore();

        drawn += 1;
      }
    }

    ctx.restore();

    state.cloudReady = drawn > 0;
    state.cloudCount = drawn;

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
    ctx.strokeStyle = "rgba(175,229,255,0.16)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.0);
    ctx.stroke();

    var terminator = ctx.createRadialGradient(cx + r * 0.36, cy + r * 0.30, r * 0.08, cx, cy, r * 1.04);
    terminator.addColorStop(0.00, "rgba(0,0,0,0)");
    terminator.addColorStop(0.58, "rgba(0,0,0,0)");
    terminator.addColorStop(0.86, "rgba(0,0,0,0.18)");
    terminator.addColorStop(1.00, "rgba(0,0,0,0.42)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = terminator;
    ctx.fill();

    ctx.restore();
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

  function renderPlanetView(frame) {
    drawOceanSphere(frame);
    drawSatelliteMaterialFromCarrier(frame);
    drawGratitudeProofHint(frame);
    drawSatelliteCloudBands(frame);
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
      restoredWorkingPosture: RESTORED_WORKING_POSTURE,
      heldContract: HELD_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
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
      fingerDragRestored: state.fingerDragRestored,
      latticeCarrierSampled: state.latticeCarrierSampled,
      satelliteScopeMaterialExpression: state.satelliteScopeMaterialActive,
      gratitudeSurfaceProofHintVisible: state.gratitudeHintVisible,

      cloudReady: state.cloudReady,
      cloudCount: state.cloudCount,
      cloudsCurveWithSphere: true,

      softAtmosphericLimb: true,
      hardCartoonRim: false,
      flatBrushStrokes: false,

      latticeReady: state.latticeReady,
      latticeViewProtected: true,
      planetViewNoVisibleWireframe: state.activeLens === "planet",

      surfaceVisibilityRequired: false,
      surfaceVisibilityTarget: true,
      surfaceProofHardGate: false,

      frameSeats: frame && frame.seats ? frame.seats.length : null,
      frameProjectedSeats: frame && frame.projectedSeats ? frame.projectedSeats.length : null,
      frameDatumReady: Boolean(frame && frame.datumReady),

      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      duplicateCanvas: false,

      noHtmlChange: true,
      noChildRewrite: true,
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
        ? "active · lattice-based satellite-scope controller"
        : "route controller pending"
    );

    setText(
      "[data-audralia-diagnostic-sphere]",
      status.runtimeReady
        ? "runtime active · projected seats=" + (status.frameProjectedSeats || status.frameSeats || "pending")
        : "runtime pending"
    );

    setText(
      "[data-audralia-diagnostic-planet]",
      "Planet View " +
        (state.activeLens === "planet" ? "active" : "held") +
        " · carrier=" + (status.latticeCarrierSampled ? "sampled" : "pending") +
        " · clouds=" + (status.cloudReady ? "ready" : "pending") +
        " · Gratitude hint=" + (status.gratitudeSurfaceProofHintVisible ? "visible" : "held")
    );

    setText(
      "[data-audralia-diagnostic-lattice]",
      "protected · Planet View uses carrier hidden, no visible wireframe"
    );

    setText(
      "[data-audralia-diagnostic-seats]",
      "16 × 16 / 256 expected · runtime=" + (status.frameProjectedSeats || status.frameSeats || "pending")
    );

    setText(
      "[data-audralia-diagnostic-loader]",
      "runtime=" + (status.runtimeReady ? "ready" : "pending") +
        " · satellite material=" + (status.satelliteScopeMaterialExpression ? "active" : "pending") +
        " · rim=soft · surface gate=off"
    );

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaRuntimeReady", status.runtimeReady);
    setDataset("audraliaPlanetViewUsesRuntimeFrame", status.planetViewUsesRuntimeFrame);
    setDataset("audraliaLatticeCarrierSampled", status.latticeCarrierSampled);
    setDataset("audraliaSatelliteScopeMaterialExpression", status.satelliteScopeMaterialExpression);
    setDataset("audraliaGratitudeSurfaceProofHintVisible", status.gratitudeSurfaceProofHintVisible);
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
        planetViewNoVisibleWireframe: lens === "planet",
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
          state.fingerDragRestored = true;
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
          state.fingerDragRestored = true;
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
      restoredWorkingPosture: RESTORED_WORKING_POSTURE,
      heldContract: HELD_CONTRACT,
      htmlRecoveryContract: HTML_RECOVERY_CONTRACT,
      runtimePublicContract: RUNTIME_PUBLIC_CONTRACT,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      showroomObject: SHOWROOM_OBJECT,

      routeJsActive: true,
      latticeBasedSatelliteScopeActive: true,
      planetViewUsesRuntimeFrame: true,
      fingerControlRestored: true,
      latticeCarrierSampled: true,
      planetViewNoVisibleWireframe: true,
      cloudsCurveWithSphere: true,
      softAtmosphericLimb: true,
      hardCartoonRim: false,
      flatBrushStrokes: false,
      gratitudeSurfaceProofHintTarget: true,
      surfaceProofTargetHeld: true,
      surfaceHardGateRemoved: true,
      latticeViewProtected: true,
      duplicateCanvasBlocked: true,
      htmlTouched: false,
      childFilesTouched: false,
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
