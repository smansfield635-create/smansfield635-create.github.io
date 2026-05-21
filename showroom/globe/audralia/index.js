// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_ROUTE_JS_CONSUMPTION_ERROR_RELAY_AND_SPHERICAL_FIX_TNT_v1
//
// Supersedes:
// AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_ROUTE_JS_TNT_v1
//
// Paired HTML:
// AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_HTML_SHELL_TNT_v1
//
// Purpose:
// - Fix the likely runtime/init failure while exposing exact failure state.
// - Remove export syntax to reduce module fragility.
// - Put a visible boot marker into Diagnostic Scope as soon as the file executes.
// - Build true spherical globe carrier math.
// - Render Planet View and Lattice View from the same 16 × 16 / 256 spherical seat field.
// - Keep Planet View clean: no lattice overlay.
// - Keep Lattice View separate: spherical lattice only.
// - Update Diagnostic Scope from pending to live or visible error.
// - No generated image. No GraphicBox. No flat projection. No legacy handoff wall.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_ROUTE_JS_CONSUMPTION_ERROR_RELAY_AND_SPHERICAL_FIX_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_ROUTE_JS_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_HTML_SHELL_TNT_v1";
  var STANDARD = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_STANDARD_v1";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var FIBONACCI_SEQUENCE = [
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ];

  var FIBONACCI_OFFSETS = [1, 2, 3, 5, 8, 13];

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → Audralia · true spherical globe carrier",
      copy: "Planet View shows Audralia as a clean material globe expression on the spherical carrier. No lattice overlay. No diagnostic wall."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → spherical 16 × 16 / 256 planetary-seat structure",
      copy: "Lattice View maps 16 radial nodes through 16 Fibonacci-governed bands onto the same spherical carrier, producing 256 planetary seats with front/back visibility."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → compact route, sphere, renderer, and seat status",
      copy: "Diagnostic Scope reports whether the route JS, spherical carrier, render loop, active lens, and 256-seat lattice are alive without becoming the public page body."
    }
  };

  var state = {
    stage: null,
    mount: null,
    diagnosticMount: null,
    canvas: null,
    ctx: null,

    activeLens: "planet",

    seats: [],
    seatGrid: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],

    yaw: -0.56,
    pitch: -0.18,
    roll: 0.02,
    velocityYaw: 0,
    velocityPitch: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    dpr: 1,
    time: 0,
    lastFrame: 0,
    renderCount: 0,
    raf: 0,

    bootMarkerReached: false,
    domLocated: false,
    routeJsReady: false,
    sphereMathReady: false,
    planetViewReady: false,
    latticeViewReady: false,
    diagnosticScopeReady: false,
    touchReady: false,
    canvasReady: false,
    duplicateCanvasCount: 0,

    sphericalProjection: true,
    flatProjectionBlocked: true,
    frontBackVisibility: true,
    rotationAppliedBeforeProjection: true,

    errors: []
  };

  function setDataset(key, value) {
    try {
      if (document && document.documentElement) {
        document.documentElement.dataset[key] = String(value);
      }
      if (document && document.body) {
        document.body.dataset[key] = String(value);
      }
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

  function bootMarker() {
    state.bootMarkerReached = true;

    window.AUDRALIA_G2_ROUTE_JS_BOOT_MARKER = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      reached: true,
      reachedAt: new Date().toISOString(),
      meaning: "If this object exists, MIME/module rejection is not the blocker."
    };

    window.AUDRALIA_G2_ROUTE_JS_CONTRACT = CONTRACT;

    setDataset("audraliaRouteJsBootMarker", "reached");
    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousRouteJsContract", PREVIOUS_CONTRACT);
    setDataset("audraliaRouteJsFailureFork", "js-executed-not-mime");

    setText("[data-audralia-diagnostic-route-js]", "boot marker reached · executing");
    setText("[data-audralia-diagnostic-sphere]", "waiting for sphere math");
    setText("[data-audralia-diagnostic-planet]", "waiting for renderer");
    setText("[data-audralia-diagnostic-lattice]", "waiting for renderer");
    setText("[data-audralia-diagnostic-seats]", "16 × 16 / 256 expected");
  }

  bootMarker();

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function normalize3(point) {
    var length = Math.hypot(point.x, point.y, point.z) || 1;
    return {
      x: point.x / length,
      y: point.y / length,
      z: point.z / length
    };
  }

  function pointFromLonLat(longitude, latitude) {
    var cosLat = Math.cos(latitude);
    return {
      x: cosLat * Math.cos(longitude),
      y: Math.sin(latitude),
      z: cosLat * Math.sin(longitude)
    };
  }

  function rotatePoint(point) {
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(state.roll);
    var sr = Math.sin(state.roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;

    return {
      x: x2,
      y: y2,
      z: z
    };
  }

  function getStageMetrics() {
    var width = state.canvas ? state.canvas.width : 640;
    var height = state.canvas ? state.canvas.height : 720;
    var minSide = Math.min(width, height);
    var mobile = width < 760 * state.dpr;

    return {
      width: width,
      height: height,
      centerX: width / 2,
      centerY: mobile ? height * 0.405 : height * 0.42,
      radius: minSide * (mobile ? 0.345 : 0.365),
      cameraDistance: 3.72
    };
  }

  function projectPoint(point) {
    var metrics = getStageMetrics();
    var rotated = rotatePoint(point);
    var denominator = Math.max(0.72, metrics.cameraDistance - rotated.z);
    var perspective = metrics.cameraDistance / denominator;

    return {
      x: metrics.centerX + rotated.x * metrics.radius * perspective,
      y: metrics.centerY - rotated.y * metrics.radius * perspective,
      z: rotated.z,
      frontFacing: rotated.z >= 0,
      perspective: perspective,
      rotated: rotated
    };
  }

  function createSeat(radialIndex, bandIndex) {
    var u = (bandIndex + 0.5) / FIBONACCI_BANDS;
    var y = 1 - 2 * u;
    var ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    var longitude = TAU * (radialIndex / RADIAL_NODES);
    var latitude = Math.asin(y);

    var position = {
      x: ringRadius * Math.cos(longitude),
      y: y,
      z: ringRadius * Math.sin(longitude)
    };

    var normal = normalize3(position);
    var fibonacci = FIBONACCI_SEQUENCE[bandIndex];
    var fibonacciWeight = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];

    return {
      seatIndex: bandIndex * RADIAL_NODES + radialIndex,
      radialIndex: radialIndex,
      bandIndex: bandIndex,
      longitude: longitude,
      latitude: latitude,
      spherePosition: position,
      surfaceNormal: normal,
      fibonacci: fibonacci,
      fibonacciWeight: fibonacciWeight,
      renderPriority: radialIndex % 4 === 0 ? 1 : radialIndex % 2 === 0 ? 0.74 : 0.54,
      connectionPriority: radialIndex % 4 === 0 ? 1 : radialIndex % 2 === 0 ? 0.70 : 0.48,
      futureMaterialClass: "pending-audralia-material",
      futureDiagnosticState: "carrier-seat-ready"
    };
  }

  function buildSphereSeats() {
    var seatGrid = [];
    var bandIndex;
    var radialIndex;

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      var band = [];

      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        band.push(createSeat(radialIndex, bandIndex));
      }

      seatGrid.push(band);
    }

    function getSeat(radial, band) {
      var r = ((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
      var b = clamp(band, 0, FIBONACCI_BANDS - 1);
      return seatGrid[b][r];
    }

    var ringLinks = [];
    var spineLinks = [];
    var fibonacciLinks = [];

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        ringLinks.push({
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex + 1, bandIndex),
          family: "band-ring",
          major: radialIndex % 4 === 0
        });
      }
    }

    for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
      for (bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
        spineLinks.push({
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex, bandIndex + 1),
          family: "radial-spine",
          major: radialIndex % 4 === 0
        });
      }
    }

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
      var offset = FIBONACCI_OFFSETS[bandIndex % FIBONACCI_OFFSETS.length];

      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        fibonacciLinks.push({
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex + offset, bandIndex + 1),
          family: "fibonacci-forward-" + offset,
          offset: offset,
          major: radialIndex % 4 === 0 || bandIndex % 4 === 0
        });

        if (bandIndex % 2 === 0) {
          fibonacciLinks.push({
            a: getSeat(radialIndex, bandIndex),
            b: getSeat(radialIndex - offset, bandIndex + 1),
            family: "fibonacci-return-" + offset,
            offset: offset,
            major: radialIndex % 4 === 0
          });
        }
      }
    }

    state.seatGrid = seatGrid;
    state.seats = [].concat.apply([], seatGrid);
    state.ringLinks = ringLinks;
    state.spineLinks = spineLinks;
    state.fibonacciLinks = fibonacciLinks;
    state.sphereMathReady = state.seats.length === LATTICE_STATES;

    if (!state.sphereMathReady) {
      throw new Error("SPHERE_SEAT_COUNT_FAILED_" + state.seats.length);
    }
  }

  function resizeCanvas() {
    if (!state.canvas || !state.mount || !state.ctx) return;

    var box = state.mount.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var width = Math.max(320, Math.floor((box.width || 640) * dpr));
    var height = Math.max(620, Math.floor((box.height || 720) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.dpr = dpr;
    state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function clearCanvas() {
    if (!state.canvas || !state.ctx) return;
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  }

  function drawLimb(ctx, alpha, lineWidth) {
    var metrics = getStageMetrics();

    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;

    var atmosphere = ctx.createRadialGradient(
      metrics.centerX - metrics.radius * 0.20,
      metrics.centerY - metrics.radius * 0.28,
      metrics.radius * 0.05,
      metrics.centerX,
      metrics.centerY,
      metrics.radius * 1.18
    );

    atmosphere.addColorStop(0, "rgba(255,255,255,0.20)");
    atmosphere.addColorStop(0.34, "rgba(141,216,255,0.11)");
    atmosphere.addColorStop(0.72, "rgba(20,70,130,0.05)");
    atmosphere.addColorStop(1, "rgba(141,216,255,0.00)");

    ctx.fillStyle = atmosphere;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.18, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(141,216,255,0.42)";
    ctx.lineWidth = lineWidth || 1.5 * state.dpr;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  function clipSphere(ctx) {
    var metrics = getStageMetrics();
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.clip();
  }

  function makeLatLonPatch(centerLon, centerLat, width, height, count, wobble) {
    var points = [];
    var index;

    for (index = 0; index < count; index += 1) {
      var angle = TAU * (index / count);
      var pulse = 1 + Math.sin(index * 2.17 + centerLon * 0.7) * wobble;
      points.push({
        lon: centerLon + Math.cos(angle) * width * pulse,
        lat: centerLat + Math.sin(angle) * height * pulse * 0.72
      });
    }

    return points;
  }

  function drawAudraliaMaterialPatches(ctx) {
    var patches = [
      {
        points: makeLatLonPatch(-0.80, 0.22, 0.62, 0.35, 13, 0.24),
        fill: "rgba(216,230,222,0.66)",
        stroke: "rgba(255,255,255,0.15)"
      },
      {
        points: makeLatLonPatch(0.72, -0.12, 0.56, 0.30, 12, 0.20),
        fill: "rgba(174,205,190,0.60)",
        stroke: "rgba(255,255,255,0.13)"
      },
      {
        points: makeLatLonPatch(1.72, 0.46, 0.32, 0.22, 10, 0.18),
        fill: "rgba(230,230,216,0.50)",
        stroke: "rgba(255,255,255,0.11)"
      },
      {
        points: makeLatLonPatch(-1.95, -0.42, 0.40, 0.19, 11, 0.19),
        fill: "rgba(196,218,208,0.48)",
        stroke: "rgba(255,255,255,0.10)"
      }
    ];

    var patchIndex;

    for (patchIndex = 0; patchIndex < patches.length; patchIndex += 1) {
      var patch = patches[patchIndex];
      var projected = [];
      var i;

      for (i = 0; i < patch.points.length; i += 1) {
        var point = patch.points[i];
        var spherePoint = pointFromLonLat(point.lon, point.lat);
        var rotated = rotatePoint(spherePoint);

        if (rotated.z > -0.08) {
          projected.push(projectPoint(spherePoint));
        }
      }

      if (projected.length < 3) continue;

      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.fillStyle = patch.fill;
      ctx.strokeStyle = patch.stroke;
      ctx.lineWidth = 1 * state.dpr;
      ctx.beginPath();

      for (i = 0; i < projected.length; i += 1) {
        if (i === 0) ctx.moveTo(projected[i].x, projected[i].y);
        else ctx.lineTo(projected[i].x, projected[i].y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPlanet(ctx) {
    var metrics = getStageMetrics();

    ctx.save();

    var body = ctx.createRadialGradient(
      metrics.centerX - metrics.radius * 0.30,
      metrics.centerY - metrics.radius * 0.32,
      metrics.radius * 0.05,
      metrics.centerX,
      metrics.centerY,
      metrics.radius
    );

    body.addColorStop(0, "rgba(228,247,255,0.92)");
    body.addColorStop(0.16, "rgba(100,192,220,0.74)");
    body.addColorStop(0.38, "rgba(16,104,153,0.86)");
    body.addColorStop(0.68, "rgba(6,42,89,0.96)");
    body.addColorStop(1, "rgba(1,8,24,1)");

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.fill();

    ctx.save();
    clipSphere(ctx);
    drawAudraliaMaterialPatches(ctx);

    var terminator = ctx.createLinearGradient(
      metrics.centerX - metrics.radius,
      metrics.centerY - metrics.radius,
      metrics.centerX + metrics.radius,
      metrics.centerY + metrics.radius
    );

    terminator.addColorStop(0, "rgba(255,255,255,0.16)");
    terminator.addColorStop(0.44, "rgba(255,255,255,0.02)");
    terminator.addColorStop(0.72, "rgba(0,0,0,0.22)");
    terminator.addColorStop(1, "rgba(0,0,0,0.54)");

    ctx.fillStyle = terminator;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    drawLimb(ctx, 1, 1.6 * state.dpr);
  }

  function linkDepth(link) {
    var a = rotatePoint(link.a.spherePosition);
    var b = rotatePoint(link.b.spherePosition);
    return (a.z + b.z) / 2;
  }

  function drawLink(ctx, link) {
    var a = projectPoint(link.a.spherePosition);
    var b = projectPoint(link.b.spherePosition);
    var avgZ = (a.z + b.z) / 2;
    var front = avgZ >= 0;
    var family = link.family || "";
    var major = !!link.major;

    var alpha = front ? 0.62 : 0.08;
    var width = front ? 1.08 : 0.58;
    var color = front ? "rgba(132,220,255,1)" : "rgba(78,126,170,1)";

    if (family.indexOf("spine") !== -1) {
      alpha = front ? (major ? 0.90 : 0.58) : 0.08;
      width = major ? 1.7 : 1.0;
      color = major ? "rgba(255,218,130,1)" : "rgba(150,230,255,1)";
    }

    if (family.indexOf("ring") !== -1) {
      alpha = front ? (major ? 0.68 : 0.48) : 0.075;
      width = major ? 1.32 : 0.88;
      color = major ? "rgba(255,220,140,1)" : "rgba(110,210,255,1)";
    }

    if (family.indexOf("fibonacci") !== -1) {
      alpha = front ? (major ? 0.45 : 0.24) : 0.04;
      width = major ? 1.18 : 0.68;
      color = major ? "rgba(255,196,86,1)" : "rgba(168,236,255,1)";
    }

    if (alpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * state.dpr;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawSeatNode(ctx, seat) {
    var point = projectPoint(seat.spherePosition);
    var front = point.z >= 0;
    var cardinal = seat.radialIndex % 4 === 0;
    var even = seat.radialIndex % 2 === 0;

    var alpha = front
      ? cardinal ? 0.98 : even ? 0.74 : 0.48
      : cardinal ? 0.12 : 0.045;

    if (alpha <= 0.025) return;

    var radius = (cardinal ? 3.7 : even ? 2.7 : 1.9) * state.dpr * point.perspective;
    var fill = cardinal ? "rgba(255,218,120,1)" : even ? "rgba(160,235,255,1)" : "rgba(94,174,230,1)";

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, TAU);
    ctx.fill();

    if (front && cardinal) {
      ctx.globalAlpha = alpha * 0.24;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 2.6, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLattice(ctx) {
    var metrics = getStageMetrics();

    ctx.save();

    var ghost = ctx.createRadialGradient(
      metrics.centerX - metrics.radius * 0.25,
      metrics.centerY - metrics.radius * 0.30,
      metrics.radius * 0.04,
      metrics.centerX,
      metrics.centerY,
      metrics.radius
    );

    ghost.addColorStop(0, "rgba(190,238,255,0.11)");
    ghost.addColorStop(0.48, "rgba(30,90,150,0.07)");
    ghost.addColorStop(1, "rgba(0,0,0,0.01)");

    ctx.fillStyle = ghost;
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    drawLimb(ctx, 0.92, 1.35 * state.dpr);

    var links = state.ringLinks.concat(state.spineLinks, state.fibonacciLinks);
    links.sort(function (a, b) {
      return linkDepth(a) - linkDepth(b);
    });

    for (var i = 0; i < links.length; i += 1) {
      drawLink(ctx, links[i]);
    }

    var seats = state.seats.slice();
    seats.sort(function (a, b) {
      return rotatePoint(a.spherePosition).z - rotatePoint(b.spherePosition).z;
    });

    for (var j = 0; j < seats.length; j += 1) {
      drawSeatNode(ctx, seats[j]);
    }
  }

  function render() {
    try {
      if (!state.ctx || !state.canvas || !state.sphereMathReady) return;

      resizeCanvas();
      clearCanvas();

      if (state.activeLens === "lattice") {
        drawLattice(state.ctx);
        state.latticeViewReady = true;
      } else {
        drawPlanet(state.ctx);
        state.planetViewReady = true;
      }

      state.renderCount += 1;
      updateDiagnostics();
      publishStatus("render");
    } catch (error) {
      recordError("render", error);
    }
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_error) {
      return false;
    }
  }

  function step(timestamp) {
    try {
      var dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
      state.lastFrame = timestamp;
      state.time += dt;

      if (!state.dragging) {
        state.yaw += state.velocityYaw;
        state.pitch += state.velocityPitch;

        var damping = Math.pow(0.94, dt * 60);
        state.velocityYaw *= damping;
        state.velocityPitch *= damping;

        if (Math.abs(state.velocityYaw) < 0.00006) state.velocityYaw = 0;
        if (Math.abs(state.velocityPitch) < 0.00006) state.velocityPitch = 0;

        if (state.velocityYaw === 0 && state.velocityPitch === 0 && !prefersReducedMotion()) {
          state.yaw += dt * 0.045;
        }
      }

      state.pitch = clamp(state.pitch, -1.05, 1.05);
      state.roll = Math.sin(state.time * 0.16) * 0.015;

      render();
      state.raf = window.requestAnimationFrame(step);
    } catch (error) {
      recordError("step", error);
    }
  }

  function resetGlobe() {
    state.yaw = -0.56;
    state.pitch = -0.18;
    state.roll = 0.02;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    render();
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", function (event) {
      var now = performance.now();

      if (now - state.lastTap < 320) {
        resetGlobe();
      }

      state.lastTap = now;
      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        if (state.stage.setPointerCapture) state.stage.setPointerCapture(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;

      var dx = event.clientX - state.pointerX;
      var dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.008;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.05, 1.05);

      state.velocityYaw = clamp(dx * 0.0022, -0.048, 0.048);
      state.velocityPitch = clamp(dy * 0.0015, -0.034, 0.034);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    function release(event) {
      if (!state.dragging) return;
      state.dragging = false;

      try {
        if (state.stage.releasePointerCapture) state.stage.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
    state.stage.addEventListener("pointerleave", release, { passive: true });

    state.touchReady = true;
  }

  function setLens(nextLens) {
    var lens = LENS_COPY[nextLens] ? nextLens : "planet";
    state.activeLens = lens;

    setDataset("audraliaActiveLens", lens);

    var buttons = document.querySelectorAll("[data-audralia-lens-button]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute("aria-pressed", buttons[i].dataset.audraliaLensButton === lens ? "true" : "false");
    }

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    render();
    publishStatus("set-lens");
  }

  function bindLensControls() {
    var buttons = document.querySelectorAll("[data-audralia-lens-button]");

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function (event) {
        var lens = event.currentTarget.dataset.audraliaLensButton;
        setLens(lens);
      });
    }

    window.addEventListener("audralia:lens", function (event) {
      var lens = event && event.detail && event.detail.activeLens
        ? event.detail.activeLens
        : document.documentElement.dataset.audraliaActiveLens;

      if (lens && lens !== state.activeLens) {
        setLens(lens);
      }
    });

    setLens(document.documentElement.dataset.audraliaActiveLens || "planet");
  }

  function updateDiagnostics() {
    state.diagnosticScopeReady = !!state.diagnosticMount;

    setText("[data-audralia-diagnostic-route-js]", state.routeJsReady ? "active · " + CONTRACT : "booting");
    setText("[data-audralia-diagnostic-sphere]", state.sphereMathReady ? "active · 256 seats · spherical projection" : "pending");
    setText("[data-audralia-diagnostic-planet]", state.planetViewReady ? "active · clean material globe" : "ready · awaiting Planet View render");
    setText("[data-audralia-diagnostic-lattice]", state.latticeViewReady ? "active · spherical 16 × 16 / 256 lattice" : "ready · awaiting Lattice View render");
    setText("[data-audralia-diagnostic-seats]", RADIAL_NODES + " × " + FIBONACCI_BANDS + " = " + state.seats.length);
  }

  function neutralizeDuplicateCanvases() {
    if (!state.mount || !state.canvas) return;

    var canvases = state.mount.querySelectorAll("canvas");
    var duplicates = 0;

    for (var i = 0; i < canvases.length; i += 1) {
      var canvas = canvases[i];
      if (canvas === state.canvas) continue;

      duplicates += 1;
      canvas.setAttribute("data-audralia-legacy-canvas-neutralized", "true");
      canvas.style.display = "none";
      canvas.style.visibility = "hidden";
      canvas.style.pointerEvents = "none";

      try {
        canvas.remove();
      } catch (_error) {}
    }

    state.duplicateCanvasCount += duplicates;
  }

  function createCanonicalCanvas() {
    if (!state.mount) return null;

    var canvas = state.mount.querySelector("canvas[data-audralia-true-globe-canvas]");

    if (!canvas) {
      canvas = document.createElement("canvas");
      state.mount.appendChild(canvas);
    }

    canvas.setAttribute("data-audralia-true-globe-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    canvas.setAttribute("data-globe-carrier", "sphere");
    canvas.setAttribute("data-spherical-projection", "true");
    canvas.setAttribute("data-flat-projection-blocked", "true");
    canvas.setAttribute("data-radial-nodes", String(RADIAL_NODES));
    canvas.setAttribute("data-fibonacci-bands", String(FIBONACCI_BANDS));
    canvas.setAttribute("data-lattice-states", String(LATTICE_STATES));
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.pointerEvents = "none";

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
    state.canvasReady = !!state.ctx;

    neutralizeDuplicateCanvases();

    if (typeof MutationObserver === "function") {
      var observer = new MutationObserver(function () {
        neutralizeDuplicateCanvases();
      });

      observer.observe(state.mount, { childList: true, subtree: false });
    }

    return canvas;
  }

  function markRoute() {
    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousRouteJsContract", PREVIOUS_CONTRACT);
    setDataset("audraliaHtmlContract", HTML_CONTRACT);
    setDataset("audraliaStandard", STANDARD);
    setDataset("audraliaRouteJsReady", state.routeJsReady ? "true" : "false");
    setDataset("audraliaSphereMathReady", state.sphereMathReady ? "true" : "false");
    setDataset("audraliaGlobeCarrier", "sphere");
    setDataset("audraliaSphericalProjection", "true");
    setDataset("audraliaFlatProjectionBlocked", "true");
    setDataset("audraliaFrontBackVisibility", "true");
    setDataset("audraliaRotationAppliedBeforeProjection", "true");
    setDataset("audraliaRadialNodes", String(RADIAL_NODES));
    setDataset("audraliaFibonacciBands", String(FIBONACCI_BANDS));
    setDataset("audraliaLatticeStates", String(LATTICE_STATES));
    setDataset("audraliaSphereSeats", String(state.seats.length));
    setDataset("visibleLegacyHandoff", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("audraliaEarthCrossover", "false");
    setDataset("australiaNamingDrift", "false");
    setDataset("visualPassClaimed", "false");

    window.AUDRALIA_G2_ROUTE_JS_CONTRACT = CONTRACT;
  }

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
    setText("[data-audralia-diagnostic-sphere]", state.sphereMathReady ? "active before error · 256 seats" : "failed before sphere math");
    setText("[data-audralia-diagnostic-planet]", "error relay · " + message);
    setText("[data-audralia-diagnostic-lattice]", "blocked by route JS error");
    setText("[data-audralia-diagnostic-seats]", state.seats.length ? String(state.seats.length) : "not built");

    publishStatus("error:" + scope);
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      standard: STANDARD,
      route: "/showroom/globe/audralia/",
      activeLens: state.activeLens,

      bootMarkerReached: state.bootMarkerReached,
      domLocated: state.domLocated,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      sphereSeats: state.seats.length,

      sphericalProjection: state.sphericalProjection,
      flatProjectionBlocked: state.flatProjectionBlocked,
      frontBackVisibility: state.frontBackVisibility,
      rotationAppliedBeforeProjection: state.rotationAppliedBeforeProjection,

      routeJsReady: state.routeJsReady,
      sphereMathReady: state.sphereMathReady,
      planetViewReady: state.planetViewReady,
      latticeViewReady: state.latticeViewReady,
      diagnosticScopeReady: state.diagnosticScopeReady,
      canvasReady: state.canvasReady,
      touchReady: state.touchReady,

      duplicateCanvas: state.duplicateCanvasCount > 0,
      duplicateCanvasCount: state.duplicateCanvasCount,
      renderCount: state.renderCount,

      yaw: state.yaw,
      pitch: state.pitch,

      generatedImage: false,
      graphicBox: false,
      visibleLegacyHandoff: false,
      earthCrossover: false,
      australiaNamingDrift: false,
      errors: state.errors.slice()
    };
  }

  function publishStatus(scope) {
    var payload = status();
    payload.scope = scope || "publish";
    payload.updatedAt = new Date().toISOString();

    window.AUDRALIA_G2_TRUE_GLOBE_STATUS = payload;
    window.AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_STATUS = payload;
    window.AUDRALIA_G2_ROUTE_JS_CONSUMPTION_STATUS = payload;

    setDataset("audraliaRouteJsReady", state.routeJsReady ? "true" : "false");
    setDataset("audraliaSphereMathReady", state.sphereMathReady ? "true" : "false");
    setDataset("audraliaSphereSeats", String(state.seats.length));
    setDataset("audraliaRenderCount", String(state.renderCount));
    setDataset("audraliaActiveLens", state.activeLens);

    return payload;
  }

  function publishApi() {
    window.AUDRALIA_G2_TRUE_GLOBE = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      standard: STANDARD,
      setLens: setLens,
      resetGlobe: resetGlobe,
      render: render,
      status: status
    };

    return window.AUDRALIA_G2_TRUE_GLOBE;
  }

  function init() {
    try {
      setText("[data-audralia-diagnostic-route-js]", "init started");

      state.stage = document.querySelector("#audraliaGlobeStage") || document.querySelector("[data-audralia-globe-stage]");
      state.mount = document.querySelector("#audraliaGlobeMount") || document.querySelector("[data-audralia-globe-mount]");
      state.diagnosticMount = document.querySelector("#audraliaDiagnosticMount") || document.querySelector("[data-audralia-diagnostic-mount]");

      state.domLocated = !!(state.stage && state.mount);

      if (!state.stage || !state.mount) {
        throw new Error("AUDRALIA_GLOBE_STAGE_OR_MOUNT_MISSING");
      }

      setText("[data-audralia-diagnostic-route-js]", "DOM located · building sphere");

      buildSphereSeats();

      setText("[data-audralia-diagnostic-sphere]", "active · 256 seats · spherical projection");

      createCanonicalCanvas();

      if (!state.canvasReady) {
        throw new Error("AUDRALIA_CANVAS_2D_CONTEXT_UNAVAILABLE");
      }

      state.routeJsReady = true;

      markRoute();
      bindPointer();
      bindLensControls();
      updateDiagnostics();
      publishApi();

      window.addEventListener("resize", render, { passive: true });

      render();

      if (!state.raf) {
        state.raf = window.requestAnimationFrame(step);
      }

      publishStatus("init-complete");

      return window.AUDRALIA_G2_TRUE_GLOBE;
    } catch (error) {
      recordError("init", error);
      return null;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
