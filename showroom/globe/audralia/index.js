// TARGET FILE: /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PARENT_ROUTE_INTERACTIVE_GLOBE_AND_LATTICE_RESTORE_JS_TNT_v1
//
// Previous functional JS baseline:
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1
//
// Purpose:
// Restore the Audralia parent route as a real interactive canvas globe with
// finger drag, Planet View, Lattice View, Diagnostic Scope, and 256-state
// diagnostic reporting.
//
// Owns:
// - one canvas inside #audraliaGlobeMount
// - pointer/finger spin
// - inertial glide
// - Planet / Lattice / Diagnostic lenses
// - 16 × 16 / 256 diagnostic lattice
// - visible diagnostic slot writing
// - bounded datum child consumption reporting
//
// Does not own:
// - /showroom/globe/audralia/planet/
// - Blueprint HUD files
// - site.bootstrap.js
// - datum child mutation
// - water/hydration/final visual pass

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PARENT_ROUTE_INTERACTIVE_GLOBE_AND_LATTICE_RESTORE_JS_TNT_v1";
  var PREVIOUS_FUNCTIONAL_JS = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_PARENT_ROUTE_INTERACTIVE_GLOBE_AND_LATTICE_RESTORE_HTML_TNT_v1";
  var PROTECTED_PARENT_BASELINE = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";

  var DATUM_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var PUBLIC_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var CLONE_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var DATUM_CACHE_KEY = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  var FIBONACCI_SEQUENCE = [
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ];

  var FIBONACCI_OFFSETS = [1, 2, 3, 5, 8, 13];

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → spherical carrier · diagnostic reporting active",
      copy: "Planet View preserves the observable globe carrier. Cloned datum consumption is reported under the hood without replacing the planet body."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 diagnostic lattice · 16 × 16 / 256 proof layer",
      copy: "Lattice View exposes the diagnostic lattice. The globe remains the planet body while the lattice becomes the inspection layer."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → cloned-seed consumption report · downstream held",
      copy: "Diagnostic Scope reports datum readiness, receive-map status, NEWS completion, child-packet availability, and downstream hold."
    }
  };

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    rect: null,

    activeLens: "planet",
    seats: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],
    fibonacciReturnLinks: [],
    geometryBuilt: false,

    yaw: -0.54,
    pitch: -0.18,
    roll: 0,
    velocityYaw: 0,
    velocityPitch: 0,
    pointerActive: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    raf: 0,
    lastFrameTime: 0,
    settleFrames: 0,
    renderCount: 0,
    stopped: false,

    oneCanvas: false,
    onePointerPath: false,
    dirtyRafPiston: false,
    duplicateCanvasRemoved: 0,

    report: {
      phase: "boot pending",
      datumScriptLoadAttempted: false,
      datumScriptLoaded: false,
      datumApiFound: false,
      datumApiSource: "",
      publicContractAccepted: false,
      cloneContractRecognized: false,
      receiveMapReady: false,
      seatCount: null,
      seatCountValid: false,
      newsComplete: false,
      allSeatsNewsComplete: false,
      childPacketAvailable: false,
      childPacketSeatCount: null,
      childPacketSeatCountValid: false,
      diagnosticSlotsFound: false,
      diagnosticSlotsWritten: false,
      finalVisibleReportWritten: false,
      downstreamHeld: true,
      visualPassClaimed: false,
      failureCode: "BOOT_PENDING",
      failureReason: "boot pending",
      attempts: 0,
      checkedAt: null,
      errors: []
    },

    errors: [],
    datasetCache: {},
    diagnosticWriteAt: 0
  };

  if (
    window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__ &&
    typeof window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__.stop();
    } catch (_error) {}
  }

  var abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = abortController ? abortController.signal : undefined;
  var resizeObserver = null;

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

  function query(selector) {
    try {
      return document.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function setText(selector, value) {
    var node = query(selector);
    var text = String(value == null ? "" : value);
    if (node && node.textContent !== text) node.textContent = text;
    return Boolean(node);
  }

  function setHtml(selector, value) {
    var node = query(selector);
    var html = String(value == null ? "" : value);
    if (node && node.innerHTML !== html) node.innerHTML = html;
    return Boolean(node);
  }

  function setDataset(key, value) {
    var text = String(value);
    if (state.datasetCache[key] === text) return;
    state.datasetCache[key] = text;

    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
    } catch (_error) {}
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");
    state.errors.push({ scope: scope, message: message, time: new Date().toISOString() });
    state.report.errors.push({ scope: scope, message: message, time: new Date().toISOString() });
    state.report.failureCode = "ERROR";
    state.report.failureReason = scope + ": " + message;
    publishStatus();
  }

  function makeSeat(band, radial) {
    var v = (band + 0.5) / FIBONACCI_BANDS;
    var lat = Math.asin(1 - 2 * v);
    var lon = (radial / RADIAL_NODES) * TAU - Math.PI;
    var clat = Math.cos(lat);
    var fib = FIBONACCI_SEQUENCE[band];

    return {
      seatIndex: band * RADIAL_NODES + radial,
      band: band,
      radial: radial,
      fibonacci: fib,
      latitude: lat,
      longitude: lon,
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon),
      major: radial % 4 === 0 || band % 4 === 0,
      secondary: radial % 2 === 0 || band % 2 === 0,
      newsComplete: true,
      childReceiveEligible: true,
      renderEligible: true
    };
  }

  function buildGeometry() {
    var rings = [];
    var band;
    var radial;

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      var ring = [];
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(makeSeat(band, radial));
      }
      rings.push(ring);
    }

    function seat(bandIndex, radialIndex) {
      return rings[bandIndex][((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function link(a, b, family, major, secondary) {
      return { a: a, b: b, family: family, major: Boolean(major), secondary: Boolean(secondary) };
    }

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        state.ringLinks.push(link(
          seat(band, radial),
          seat(band, radial + 1),
          "ring",
          band % 4 === 0 || radial % 4 === 0,
          band % 2 === 0 || radial % 2 === 0
        ));
      }
    }

    for (radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        state.spineLinks.push(link(
          seat(band, radial),
          seat(band + 1, radial),
          "spine",
          radial % 4 === 0,
          radial % 2 === 0
        ));
      }
    }

    for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      var offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        state.fibonacciLinks.push(link(
          seat(band, radial),
          seat(band + 1, radial + offset),
          "fibonacci-forward",
          radial % 4 === 0 || band % 4 === 0,
          radial % 2 === 0 || band % 2 === 0
        ));

        if (band % 2 === 0) {
          state.fibonacciReturnLinks.push(link(
            seat(band, radial),
            seat(band + 1, radial - offset),
            "fibonacci-return",
            radial % 4 === 0 || band % 4 === 0,
            radial % 2 === 0 || band % 2 === 0
          ));
        }
      }
    }

    state.seats = rings.reduce(function (all, ring) { return all.concat(ring); }, []);
    state.geometryBuilt = state.seats.length === LATTICE_STATES;
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

    return { x: x2, y: y2, z: z };
  }

  function metrics() {
    var width = state.width || 640;
    var height = state.height || 720;
    var minSide = Math.min(width, height);

    return {
      centerX: width / 2,
      centerY: height * 0.43,
      radius: minSide * 0.36,
      cameraDistance: 3.9
    };
  }

  function projectPoint(point) {
    var m = metrics();
    var rotated = rotatePoint(point);
    var perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - rotated.z);

    return {
      x: m.centerX + rotated.x * m.radius * perspective,
      y: m.centerY - rotated.y * m.radius * perspective,
      z: rotated.z,
      perspective: perspective,
      frontFacing: rotated.z >= -0.05
    };
  }

  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();
    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.003, 0, TAU);
    ctx.clip();
  }

  function drawCarrier() {
    var ctx = state.ctx;
    var m = metrics();
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var ocean = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.34, 0, cx, cy, r * 1.18);
    ocean.addColorStop(0.00, "rgba(184,242,255,0.96)");
    ocean.addColorStop(0.18, "rgba(71,176,221,0.88)");
    ocean.addColorStop(0.42, "rgba(18,96,170,0.95)");
    ocean.addColorStop(0.73, "rgba(5,43,108,0.99)");
    ocean.addColorStop(1.00, "rgba(1,10,32,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    var shade = ctx.createRadialGradient(cx + r * 0.34, cy + r * 0.32, r * 0.10, cx, cy, r * 1.08);
    shade.addColorStop(0.00, "rgba(0,0,0,0)");
    shade.addColorStop(0.52, "rgba(0,0,0,0.08)");
    shade.addColorStop(0.82, "rgba(0,0,0,0.34)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.66)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.003, 0, TAU);
    ctx.strokeStyle = "rgba(170,226,255,0.18)";
    ctx.lineWidth = Math.max(0.8, state.dpr * 0.8);
    ctx.stroke();

    var glow = ctx.createRadialGradient(cx, cy, r * 0.86, cx, cy, r * 1.20);
    glow.addColorStop(0.00, "rgba(141,216,255,0)");
    glow.addColorStop(0.72, "rgba(141,216,255,0.08)");
    glow.addColorStop(0.92, "rgba(141,216,255,0.18)");
    glow.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.16, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  function drawReferenceLines() {
    var ctx = state.ctx;
    var equator = [];
    var meridian = [];
    var i;

    for (i = 0; i <= 96; i += 1) {
      var lon = -Math.PI + (i / 96) * TAU;
      equator.push({ x: Math.cos(lon), y: 0, z: Math.sin(lon) });
    }

    for (i = 0; i <= 96; i += 1) {
      var lat = -HALF_PI + (i / 96) * Math.PI;
      meridian.push({ x: Math.cos(lat), y: Math.sin(lat), z: 0 });
    }

    function strokeLine(points, stroke, width) {
      ctx.beginPath();

      for (var j = 0; j < points.length; j += 1) {
        var p = projectPoint(points[j]);
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }

      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    ctx.save();
    clipSphere();
    strokeLine(equator, "rgba(244,207,131,0.44)", Math.max(0.8, state.dpr * 0.75));
    strokeLine(meridian, "rgba(141,216,255,0.24)", Math.max(0.65, state.dpr * 0.55));
    ctx.restore();

    var m = metrics();
    var north = projectPoint({ x: 0, y: 1, z: 0 });
    var south = projectPoint({ x: 0, y: -1, z: 0 });

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 10 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,207,131,0.86)";
    ctx.fillText("N", north.x, north.y - m.radius * 0.035);
    ctx.fillText("S", south.x, south.y + m.radius * 0.035);
    ctx.restore();
  }

  function linkColor(link, a, b) {
    var front = a.frontFacing || b.frontFacing;
    var z = (a.z + b.z) / 2;

    if (link.family === "fibonacci-forward") {
      return front
        ? "rgba(244,207,131," + clamp(0.46 + z * 0.14, 0.28, 0.76).toFixed(3) + ")"
        : "rgba(244,207,131,0.10)";
    }

    if (link.family === "fibonacci-return") {
      return front
        ? "rgba(184,238,255," + clamp(0.20 + z * 0.10, 0.11, 0.38).toFixed(3) + ")"
        : "rgba(184,238,255,0.06)";
    }

    if (link.major) {
      return front
        ? "rgba(244,207,131," + clamp(0.42 + z * 0.10, 0.24, 0.66).toFixed(3) + ")"
        : "rgba(244,207,131,0.09)";
    }

    return front
      ? "rgba(112,199,255," + clamp(0.22 + z * 0.08, 0.12, 0.38).toFixed(3) + ")"
      : "rgba(112,199,255,0.055)";
  }

  function drawLinks(links, reduced) {
    var ctx = state.ctx;

    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];

      if (reduced && !link.major && link.family.indexOf("fibonacci") >= 0) continue;

      var a = projectPoint(link.a);
      var b = projectPoint(link.b);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = linkColor(link, a, b);
      ctx.lineWidth = link.major ? Math.max(0.75, state.dpr * 0.76) : Math.max(0.42, state.dpr * 0.46);
      ctx.stroke();
    }
  }

  function drawSeats(reduced) {
    var ctx = state.ctx;

    for (var i = 0; i < state.seats.length; i += 1) {
      var seat = state.seats[i];

      if (reduced && !seat.major) continue;

      var p = projectPoint(seat);
      var alpha = p.frontFacing ? (seat.major ? 0.84 : 0.58) : (seat.major ? 0.18 : 0.08);
      var radius = seat.major ? 2.35 : seat.secondary ? 1.55 : 1.18;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, radius * state.dpr * p.perspective), 0, TAU);
      ctx.fillStyle = seat.major
        ? "rgba(244,207,131," + alpha.toFixed(3) + ")"
        : "rgba(141,216,255," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  function drawDiagnosticLattice(reduced) {
    var ctx = state.ctx;
    ctx.save();
    clipSphere();
    drawLinks(state.ringLinks, reduced);
    drawLinks(state.spineLinks, reduced);
    if (!reduced) drawLinks(state.fibonacciReturnLinks, false);
    drawLinks(state.fibonacciLinks, reduced);
    drawSeats(reduced);
    ctx.restore();
  }

  function renderFrame(timestamp) {
    if (state.stopped || !state.ctx || !state.geometryBuilt) return;

    state.raf = 0;

    var dt = state.lastFrameTime ? clamp((timestamp - state.lastFrameTime) / 1000, 0, 0.05) : 0;
    state.lastFrameTime = timestamp;

    if (!state.pointerActive) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      var damping = Math.pow(0.938, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -1.16, 1.16);
    state.roll = Math.sin(timestamp * 0.00018) * 0.010;

    clearCanvas();
    drawCarrier();
    drawReferenceLines();

    if (state.activeLens === "lattice" || state.activeLens === "diagnostic") {
      drawDiagnosticLattice(state.pointerActive);
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.18;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    }

    state.renderCount += 1;
    state.dirtyRafPiston = true;
    if (state.settleFrames > 0) state.settleFrames -= 1;

    writeVisibleReport(false);
    publishStatus();

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(settleFrames) {
    if (settleFrames) state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) state.raf = window.requestAnimationFrame(renderFrame);
  }

  function setLens(nextLens) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, nextLens) ? nextLens : "planet";
    state.activeLens = lens;

    try {
      document.documentElement.dataset.audraliaActiveLens = lens;
    } catch (_error) {}

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      var active = button.dataset.audraliaLensButton === lens;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("gold", active);
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    writeVisibleReport(true);
    requestRender(lens === "planet" ? 6 : 14);
  }

  function bindLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      }, signal ? { signal: signal } : false);
    });
  }

  function pointerPoint(event) {
    var rect = state.rect || state.stage.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function resetCarrier() {
    state.yaw = -0.54;
    state.pitch = -0.18;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender(12);
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      var t = now();
      if (t - state.lastTap < 320) resetCarrier();
      state.lastTap = t;

      state.pointerActive = true;
      state.pointerId = event.pointerId;

      var p = pointerPoint(event);
      state.pointerX = p.x;
      state.pointerY = p.y;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      requestRender(4);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointerActive) return;

      var p = pointerPoint(event);
      var dx = p.x - state.pointerX;
      var dy = p.y - state.pointerY;

      state.pointerX = p.x;
      state.pointerY = p.y;

      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.16, 1.16);
      state.velocityYaw = clamp(dx * 0.0022, -0.048, 0.048);
      state.velocityPitch = clamp(dy * 0.0014, -0.038, 0.038);

      requestRender(2);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    function release(event) {
      if (!state.pointerActive) return;

      state.pointerActive = false;

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;
      writeVisibleReport(true);
      requestRender(18);

      try {
        event.preventDefault();
      } catch (_error2) {}
    }

    state.stage.addEventListener("pointerup", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal: signal, passive: false } : { passive: false });

    state.onePointerPath = true;
  }

  function enforceOneCanvas() {
    if (!state.mount) return;

    var canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));
    var selected = state.canvas && state.mount.contains(state.canvas) ? state.canvas : null;

    if (!selected) selected = canvases[0] || document.createElement("canvas");

    if (!state.mount.contains(selected)) {
      selected.setAttribute("aria-hidden", "true");
      state.mount.appendChild(selected);
    }

    canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));

    canvases.forEach(function (canvas) {
      if (canvas === selected) return;

      try {
        canvas.remove();
        state.duplicateCanvasRemoved += 1;
      } catch (_error) {}
    });

    state.canvas = selected;
    state.canvas.setAttribute("data-audralia-interactive-globe-canvas", CONTRACT);
    state.canvas.setAttribute("data-previous-functional-js", PREVIOUS_FUNCTIONAL_JS);
    state.canvas.setAttribute("data-html-contract", HTML_CONTRACT);
    state.canvas.setAttribute("data-protected-parent-baseline", PROTECTED_PARENT_BASELINE);
    state.canvas.setAttribute("data-public-datum-contract", PUBLIC_DATUM_CONTRACT);
    state.canvas.setAttribute("data-clone-datum-contract", CLONE_DATUM_CONTRACT);
    state.canvas.setAttribute("data-downstream-held", "true");

    state.canvas.style.position = "absolute";
    state.canvas.style.inset = "0";
    state.canvas.style.width = "100%";
    state.canvas.style.height = "100%";
    state.canvas.style.display = "block";
    state.canvas.style.background = "transparent";
    state.canvas.style.pointerEvents = "none";

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.oneCanvas = Boolean(state.ctx);
  }

  function updateDimensions(rect) {
    if (!rect || !state.canvas || !state.ctx) return false;

    var dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(520, Math.floor(rect.height * dpr));

    state.rect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };

    if (state.width === width && state.height === height && state.dpr === dpr) return false;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;
    requestRender(8);
    return true;
  }

  function measureStage() {
    if (!state.stage) return false;
    return updateDimensions(state.stage.getBoundingClientRect());
  }

  function setupResize() {
    measureStage();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      resizeObserver = new ResizeObserver(function (entries) {
        var box = state.stage.getBoundingClientRect();
        var content = entries && entries[0] ? entries[0].contentRect : box;

        updateDimensions({
          left: box.left,
          top: box.top,
          width: content.width,
          height: content.height
        });
      });

      try {
        resizeObserver.observe(state.stage);
      } catch (_error) {}
    }

    window.addEventListener("resize", function () {
      measureStage();
      requestRender(8);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStage();
        requestRender(8);
      }, 120);
    }, signal ? { signal: signal, passive: true } : { passive: true });
  }

  function findDatumApi() {
    var sources = [
      ["AUDRALIA_TRUE_GLOBE_DATUM", window.AUDRALIA_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G1_TRUE_GLOBE_DATUM", window.AUDRALIA_G1_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G2_TRUE_GLOBE_DATUM", window.AUDRALIA_G2_TRUE_GLOBE_DATUM],
      ["AUDRALIA_TRUE_PLANETARY_DATUM", window.AUDRALIA_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G1_TRUE_PLANETARY_DATUM", window.AUDRALIA_G1_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G2_TRUE_PLANETARY_DATUM", window.AUDRALIA_G2_TRUE_PLANETARY_DATUM]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) {
        state.report.datumApiSource = sources[i][0];
        return sources[i][1];
      }
    }

    state.report.datumApiSource = "";
    return null;
  }

  function getDatumStatus(api) {
    if (api && typeof api.status === "function") {
      try {
        return api.status();
      } catch (error) {
        recordError("datum.status", error);
      }
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G2_TRUE_GLOBE_DATUM_STATUS ||
      null;
  }

  function getReceiveMap(api) {
    if (api && typeof api.receive === "function") {
      try { return api.receive({ reference: true }); } catch (error) { recordError("datum.receive", error); }
    }

    if (api && typeof api.getReceiveMap === "function") {
      try { return api.getReceiveMap({ reference: true }); } catch (error2) { recordError("datum.getReceiveMap", error2); }
    }

    if (api && typeof api.childReceiveMap === "function") {
      try { return api.childReceiveMap({ reference: true }); } catch (error3) { recordError("datum.childReceiveMap", error3); }
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_RECEIVE_MAP ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_RECEIVE_MAP ||
      null;
  }

  function getChildPacket(api) {
    if (!api || typeof api.getChildReceivePacket !== "function") return null;

    try {
      return api.getChildReceivePacket("route-diagnostic", { compact: true });
    } catch (error) {
      recordError("datum.getChildReceivePacket", error);
      return null;
    }
  }

  function loadDatumFile() {
    return new Promise(function (resolve) {
      if (findDatumApi()) {
        state.report.datumScriptLoaded = true;
        resolve(true);
        return;
      }

      state.report.datumScriptLoadAttempted = true;
      state.report.phase = "datum loading";
      state.report.failureCode = "DATUM_LOADING";
      state.report.failureReason = "datum loading";
      writeVisibleReport(true);
      publishStatus();

      var existing = document.querySelector("script[src*='audralia.true-globe.datum.js']");

      if (existing) {
        setTimeout(function () {
          state.report.datumScriptLoaded = Boolean(findDatumApi());
          resolve(state.report.datumScriptLoaded);
        }, 220);
        return;
      }

      var script = document.createElement("script");
      script.src = DATUM_FILE + "?v=" + encodeURIComponent(DATUM_CACHE_KEY);
      script.async = true;
      script.defer = true;
      script.setAttribute("data-audralia-datum-loader", CONTRACT);
      script.setAttribute("data-public-datum-contract", PUBLIC_DATUM_CONTRACT);
      script.setAttribute("data-clone-datum-contract", CLONE_DATUM_CONTRACT);
      script.setAttribute("data-downstream-held", "true");

      script.onload = function () {
        setTimeout(function () {
          state.report.datumScriptLoaded = Boolean(findDatumApi());
          resolve(state.report.datumScriptLoaded);
        }, 80);
      };

      script.onerror = function () {
        state.report.datumScriptLoaded = false;
        state.report.failureCode = "DATUM_LOAD_FAILED";
        state.report.failureReason = "datum child script load failed";
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  function evaluateDatumConsumption() {
    state.report.attempts += 1;
    state.report.checkedAt = new Date().toISOString();
    state.report.phase = "datum API discovery";

    var api = findDatumApi();

    if (!api) {
      state.report.datumApiFound = false;
      state.report.failureCode = "DATUM_MISSING";
      state.report.failureReason = "datum global missing";
      writeVisibleReport(true);
      publishStatus();
      return false;
    }

    state.report.datumApiFound = true;

    var status = getDatumStatus(api) || {};
    var datumContract = status.contract || api.contract || "";
    var cloneContract = status.cloneContract || api.cloneContract || "";

    state.report.publicContractAccepted = datumContract === PUBLIC_DATUM_CONTRACT;
    state.report.cloneContractRecognized = cloneContract === CLONE_DATUM_CONTRACT;

    var map = getReceiveMap(api);
    var seats = map && Array.isArray(map.seats) ? map.seats : [];

    state.report.receiveMapReady = Boolean(
      map &&
      (map.childReceiveMapReady === true || map.receiveMapReady === true || status.childReceiveMapReady === true)
    );

    state.report.seatCount = seats.length || null;
    state.report.seatCountValid = seats.length === LATTICE_STATES;
    state.report.newsComplete = Boolean(map && (map.newsComplete === true || map.newsProtocolActive === true));
    state.report.allSeatsNewsComplete = seats.length === LATTICE_STATES
      ? seats.every(function (seat) { return seat && seat.newsComplete !== false; })
      : false;

    var packet = getChildPacket(api);

    state.report.childPacketAvailable = Boolean(packet && packet.childReceivePacketReady === true);
    state.report.childPacketSeatCount = packet && Number.isFinite(Number(packet.seatCount)) ? Number(packet.seatCount) : null;
    state.report.childPacketSeatCountValid = state.report.childPacketSeatCount === LATTICE_STATES;

    state.report.downstreamHeld = true;
    state.report.visualPassClaimed = false;

    if (
      state.report.publicContractAccepted &&
      state.report.cloneContractRecognized &&
      state.report.receiveMapReady &&
      state.report.seatCountValid &&
      state.report.newsComplete &&
      state.report.allSeatsNewsComplete &&
      state.report.childPacketAvailable &&
      state.report.childPacketSeatCountValid
    ) {
      state.report.phase = "success written";
      state.report.failureCode = "";
      state.report.failureReason = "";
      state.report.finalVisibleReportWritten = true;
    } else {
      state.report.phase = "bounded datum report";
      state.report.failureCode = "DATUM_BOUNDED";
      state.report.failureReason = "datum reporting incomplete or held";
      state.report.finalVisibleReportWritten = false;
    }

    writeVisibleReport(true);
    publishStatus();
    return !state.report.failureCode;
  }

  function runDiagnosticReportingCycle() {
    state.report.phase = "boot pending";
    state.report.failureCode = "BOOT_PENDING";
    state.report.failureReason = "boot pending";
    writeVisibleReport(true);
    publishStatus();

    if (evaluateDatumConsumption()) return;

    if (!state.report.datumApiFound) {
      loadDatumFile().then(function () {
        evaluateDatumConsumption();
        setTimeout(evaluateDatumConsumption, 240);
        setTimeout(evaluateDatumConsumption, 720);
      });
      return;
    }

    setTimeout(evaluateDatumConsumption, 240);
    setTimeout(evaluateDatumConsumption, 720);
  }

  function checkDiagnosticSlots() {
    var selectors = [
      "[data-audralia-diagnostic-route]",
      "[data-audralia-diagnostic-carrier]",
      "[data-audralia-diagnostic-lens]",
      "[data-audralia-diagnostic-canvas]",
      "[data-audralia-diagnostic-loop]",
      "[data-audralia-diagnostic-children]",
      "[data-audralia-diagnostic-news]",
      "[data-audralia-diagnostic-scope]",
      "[data-audralia-diagnostic-datum-child]",
      "[data-audralia-diagnostic-receive-map]",
      "[data-audralia-diagnostic-news-map]",
      "[data-audralia-diagnostic-child-packet]",
      "[data-audralia-diagnostic-seat-count]",
      "[data-audralia-diagnostic-downstream]"
    ];

    return selectors.every(function (selector) { return Boolean(query(selector)); });
  }

  function writeVisibleReport(force) {
    var t = now();
    if (!force && t - state.diagnosticWriteAt < 750) return;

    state.diagnosticWriteAt = t;

    var slotsFound = checkDiagnosticSlots();
    state.report.diagnosticSlotsFound = slotsFound;

    var written = true;

    written = setText("[data-audralia-diagnostic-route]", "interactive parent globe · route JS active") && written;
    written = setText("[data-audralia-diagnostic-carrier]", "spherical carrier active · finger drag enabled") && written;
    written = setText("[data-audralia-diagnostic-lens]", state.activeLens) && written;
    written = setText("[data-audralia-diagnostic-canvas]", state.oneCanvas ? "one canvas" : "canvas pending") && written;
    written = setText("[data-audralia-diagnostic-loop]", state.dirtyRafPiston ? "dirty RAF · piston controlled" : "loop pending") && written;
    written = setText("[data-audralia-diagnostic-children]", "downstream held · parent route only") && written;
    written = setText("[data-audralia-diagnostic-scope]", "360 scope · 16 × 16 / 256 seats") && written;

    if (!state.report.failureCode) {
      written = setText("[data-audralia-diagnostic-news]", "NEWS complete · datum verified") && written;
      written = setText("[data-audralia-diagnostic-datum-child]", "cloned seed consumed") && written;
      written = setText("[data-audralia-diagnostic-receive-map]", "ready · 256 seats") && written;
      written = setText("[data-audralia-diagnostic-news-map]", "complete · N/E/W/S") && written;
      written = setText("[data-audralia-diagnostic-child-packet]", "available · route-diagnostic") && written;
      written = setText("[data-audralia-diagnostic-seat-count]", "256 / 16 × 16") && written;
      written = setText("[data-audralia-diagnostic-downstream]", "held · no activation") && written;
    } else {
      var reason = state.report.failureReason || "pending diagnostic proof";
      written = setText("[data-audralia-diagnostic-news]", "pending/fail · " + reason) && written;
      written = setText("[data-audralia-diagnostic-datum-child]", state.report.datumApiFound ? "found · bounded" : "missing/pending") && written;
      written = setText("[data-audralia-diagnostic-receive-map]", state.report.receiveMapReady ? "available · constrained" : "pending") && written;
      written = setText("[data-audralia-diagnostic-news-map]", state.report.newsComplete ? "complete · bounded" : "pending") && written;
      written = setText("[data-audralia-diagnostic-child-packet]", state.report.childPacketAvailable ? "available · constrained" : "pending") && written;
      written = setText("[data-audralia-diagnostic-seat-count]", state.report.seatCountValid ? "256 / 16 × 16" : "local 256 lattice active") && written;
      written = setText("[data-audralia-diagnostic-downstream]", "held · no activation") && written;
    }

    state.report.diagnosticSlotsWritten = Boolean(written && slotsFound);

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousFunctionalJs", PREVIOUS_FUNCTIONAL_JS);
    setDataset("audraliaHtmlContract", HTML_CONTRACT);
    setDataset("audraliaInteractiveGlobe", true);
    setDataset("audraliaActiveLens", state.activeLens);
    setDataset("audraliaGeometryBuilt", state.geometryBuilt);
    setDataset("audraliaOneCanvas", state.oneCanvas);
    setDataset("audraliaOnePointerPath", state.onePointerPath);
    setDataset("audraliaLatticeStates", LATTICE_STATES);
    setDataset("audraliaDownstreamHeld", true);
    setDataset("audraliaFinalVisualPass", false);
    setDataset("audraliaFailureCode", state.report.failureCode || "NONE");

    publishStatus();
  }

  function publishStatus() {
    var payload = {
      contract: CONTRACT,
      previousFunctionalJs: PREVIOUS_FUNCTIONAL_JS,
      htmlContract: HTML_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",

      parentRouteInteractiveGlobe: true,
      staticGlobeRestore: false,
      childRouteHeld: true,
      blueprintWorkHeld: true,

      datumFile: DATUM_FILE,
      publicDatumContract: PUBLIC_DATUM_CONTRACT,
      cloneDatumContract: CLONE_DATUM_CONTRACT,

      phase: state.report.phase,
      datumScriptLoadAttempted: state.report.datumScriptLoadAttempted,
      datumScriptLoaded: state.report.datumScriptLoaded,
      datumApiFound: state.report.datumApiFound,
      datumApiSource: state.report.datumApiSource,

      publicContractAccepted: state.report.publicContractAccepted,
      cloneContractRecognized: state.report.cloneContractRecognized,
      receiveMapReady: state.report.receiveMapReady,
      seatCount: state.report.seatCount,
      seatCountValid: state.report.seatCountValid,
      newsComplete: state.report.newsComplete,
      allSeatsNewsComplete: state.report.allSeatsNewsComplete,
      childPacketAvailable: state.report.childPacketAvailable,
      childPacketSeatCount: state.report.childPacketSeatCount,
      childPacketSeatCountValid: state.report.childPacketSeatCountValid,

      diagnosticSlotsFound: state.report.diagnosticSlotsFound,
      diagnosticSlotsWritten: state.report.diagnosticSlotsWritten,
      finalVisibleReportWritten: state.report.finalVisibleReportWritten,

      downstreamHeld: true,
      visualPassClaimed: false,

      failureCode: state.report.failureCode,
      failureReason: state.report.failureReason,
      attempts: state.report.attempts,
      checkedAt: state.report.checkedAt,
      errors: state.report.errors.slice(),

      globeRole: "observable-interactive-canvas-carrier",
      latticeRole: "360-diagnostic-lattice",
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,
      activeLens: state.activeLens,
      oneCanvas: state.oneCanvas,
      onePointerPath: state.onePointerPath,
      dirtyRafPiston: state.dirtyRafPiston,
      smoothDragProtected: true,

      terrainActivated: false,
      moistureActivated: false,
      surfaceActivated: false,
      cloudActivated: false,
      continentActivated: false,
      waterActivated: false,
      hydrationActivated: false,
      finalVisualPass: false,

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      routeErrors: state.errors.slice()
    };

    window.AUDRALIA_PARENT_ROUTE_INTERACTIVE_GLOBE_AND_LATTICE_RESTORE_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_PARENT_ROUTE_INTERACTIVE_GLOBE_AND_LATTICE_RESTORE_BOOT = {
      contract: CONTRACT,
      previousFunctionalJs: PREVIOUS_FUNCTIONAL_JS,
      htmlContract: HTML_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",
      parentRouteInteractiveGlobe: true,
      staticGlobeRestore: false,
      datumFileChanged: false,
      childRouteTouched: false,
      blueprintFilesTouched: false,
      downstreamHeld: true,
      visualPassClaimed: false,
      bootedAt: new Date().toISOString()
    };
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try { window.cancelAnimationFrame(state.raf); } catch (_error) {}
    }

    state.raf = 0;

    if (resizeObserver) {
      try { resizeObserver.disconnect(); } catch (_error2) {}
    }

    if (abortController) {
      try { abortController.abort(); } catch (_error3) {}
    }
  }

  window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    previousFunctionalJs: PREVIOUS_FUNCTIONAL_JS,
    htmlContract: HTML_CONTRACT,
    protectedParentBaseline: PROTECTED_PARENT_BASELINE,
    diagnosticStatus: publishStatus,
    runDiagnosticReportingCycle: runDiagnosticReportingCycle,
    setLens: setLens,
    resetCarrier: resetCarrier
  };

  function init() {
    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      writeVisibleReport(true);
      return;
    }

    enforceOneCanvas();
    buildGeometry();
    setupResize();
    bindLensControls();
    bindPointer();
    setLens("planet");
    publishBoot();
    publishStatus();
    writeVisibleReport(true);
    requestRender(10);
    runDiagnosticReportingCycle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
