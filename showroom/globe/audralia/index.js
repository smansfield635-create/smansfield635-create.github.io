// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1
//
// Previous JS contract:
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_TNT_v1
//
// HTML binding contract:
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_HTML_BINDING_TNT_v1
//
// Protected parent baseline:
// AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1
//
// Datum child file held:
// /assets/audralia/clean/runtime/audralia.true-globe.datum.js
//
// Public datum contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1
//
// Clone datum contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1
//
// Purpose:
// - Preserve the G1 observable globe + 360 diagnostic lattice baseline.
// - Consume the cloned datum seed if available.
// - Load the datum child if globals are absent.
// - Verify public contract, clone contract, cloning method, receive map, 256 seats, NEWS, and child packet.
// - Write success or bounded failure into visible diagnostic slots.
// - Publish a complete diagnostic-reporting route status global.
// - Do not rewrite HTML.
// - Do not rewrite datum.
// - Do not activate downstream.
// - Do not claim visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1";
  var PREVIOUS_JS_CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_TNT_v1";
  var HTML_BINDING_CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_HTML_BINDING_TNT_v1";
  var PROTECTED_PARENT_BASELINE = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";

  var DATUM_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var PUBLIC_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var CLONE_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var DATUM_CACHE_KEY = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";

  var PROCESS = "cloning_method";
  var PUBLIC_FRAME = "adopted_packet";
  var TECHNICAL_REALITY = "new_seed_birth";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  var LENS_COPY = Object.freeze({
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → spherical carrier · diagnostic reporting active",
      copy: "Planet View preserves the observable globe carrier. Cloned datum consumption is reported under the hood without replacing the planet body."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 diagnostic lattice · NEWS proof layer",
      copy: "Lattice View preserves the 16 × 16 / 256 diagnostic scope while the route verifies cloned-seed receive-map readiness."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → cloned-seed consumption report · downstream held",
      copy: "Diagnostic Scope reports cloned-seed consumption, receive-map readiness, NEWS completion, child-packet availability, and downstream hold."
    }
  });

  var FAILURE_TEXT = Object.freeze({
    BOOT_PENDING: "boot pending",
    DATUM_LOADING: "datum loading",
    DATUM_MISSING: "datum global missing",
    DATUM_LOAD_FAILED: "cloned datum script load failed",
    API_MISSING: "datum API missing required method",
    PUBLIC_CONTRACT_MISMATCH: "public datum contract mismatch",
    CLONE_CONTRACT_MISMATCH: "clone datum contract mismatch",
    PROCESS_MISMATCH: "process is not cloning_method",
    RECEIVE_MAP_UNAVAILABLE: "receive map unavailable",
    RECEIVE_MAP_INCOMPLETE: "receive map not ready",
    SEAT_COUNT_MISMATCH: "expected 256 seats",
    NEWS_INCOMPLETE: "one or more seats lacks NEWS completion",
    CHILD_PACKET_UNAVAILABLE: "route-diagnostic child packet unavailable",
    DOWNSTREAM_FALSE_READY: "datum or packet claims downstream readiness",
    REPORTING_SLOT_MISSING: "HTML diagnostic slot unavailable",
    UNKNOWN_EXCEPTION: "unexpected exception"
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    details: [],

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

    diagnosticSlotsFound: false,
    diagnosticSlotsWritten: false,
    finalVisibleReportWritten: false,
    lastDiagnosticWrite: 0,
    datasetCache: {},
    errors: [],

    report: {
      phase: "boot pending",
      datumScriptLoadAttempted: false,
      datumScriptLoaded: false,
      datumApiFound: false,
      datumApiSource: null,

      publicContractAccepted: false,
      cloneContractRecognized: false,
      cloningMethodRecognized: false,
      publicAdoptionCompatible: false,
      technicalBirthComplete: false,
      parentInterfaceUnchanged: false,

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
      failureReason: FAILURE_TEXT.BOOT_PENDING,
      attempts: 0,
      checkedAt: null,
      errors: []
    }
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
    var text = String(value);

    if (node && node.textContent !== text) {
      node.textContent = text;
    }

    return Boolean(node);
  }

  function setHtml(selector, value) {
    var node = query(selector);
    var html = String(value);

    if (node && node.innerHTML !== html) {
      node.innerHTML = html;
    }

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

  function closeMenus() {
    for (var i = 0; i < state.details.length; i += 1) {
      try {
        state.details[i].open = false;
      } catch (_error) {}
    }
  }

  function setFailure(code, reason) {
    state.report.failureCode = code;
    state.report.failureReason = reason || FAILURE_TEXT[code] || String(code || "unknown failure");
  }

  function setPhase(phase) {
    state.report.phase = phase;
    state.report.checkedAt = new Date().toISOString();
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };
  }

  function recordReportError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");

    state.report.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    setFailure("UNKNOWN_EXCEPTION", scope + ": " + message);
  }

  function makeSeat(band, radial) {
    var v = (band + 0.5) / FIBONACCI_BANDS;
    var lat = Math.asin(1 - 2 * v);
    var lon = (radial / RADIAL_NODES) * TAU - Math.PI;
    var clat = Math.cos(lat);
    var fib = FIBONACCI_SEQUENCE[band];

    return Object.freeze({
      seatIndex: band * RADIAL_NODES + radial,
      band: band,
      radial: radial,
      fibonacci: fib,
      fibonacciPhase: fib / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1],
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
    });
  }

  function buildLocalDiagnosticGeometry() {
    var rings = [];
    var band;
    var radial;

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      var ring = [];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(makeSeat(band, radial));
      }

      rings.push(Object.freeze(ring));
    }

    function seat(bandIndex, radialIndex) {
      return rings[bandIndex][((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function link(a, b, family, major, secondary) {
      return Object.freeze({
        a: a,
        b: b,
        family: family,
        major: Boolean(major),
        secondary: Boolean(secondary),
        renderEligible: true
      });
    }

    var ringLinks = [];
    var spineLinks = [];
    var fibonacciLinks = [];
    var fibonacciReturnLinks = [];

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        ringLinks.push(link(
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
        spineLinks.push(link(
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
        var priority = radial % 4 === 0 || band % 4 === 0;

        fibonacciLinks.push(link(
          seat(band, radial),
          seat(band + 1, radial + offset),
          "fibonacci-forward",
          priority,
          radial % 2 === 0 || band % 2 === 0
        ));

        if (band % 2 === 0) {
          fibonacciReturnLinks.push(link(
            seat(band, radial),
            seat(band + 1, radial - offset),
            "fibonacci-return",
            priority,
            radial % 2 === 0 || band % 2 === 0
          ));
        }
      }
    }

    state.seats = rings.reduce(function (all, ring) {
      return all.concat(ring);
    }, []);
    state.ringLinks = ringLinks;
    state.spineLinks = spineLinks;
    state.fibonacciLinks = fibonacciLinks;
    state.fibonacciReturnLinks = fibonacciReturnLinks;
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
      centerY: height * 0.42,
      radius: minSide * (width / Math.max(1, state.dpr) < 680 ? 0.345 : 0.365),
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

    var depth = ctx.createRadialGradient(cx + r * 0.34, cy + r * 0.32, r * 0.10, cx, cy, r * 1.08);
    depth.addColorStop(0.00, "rgba(0,0,0,0)");
    depth.addColorStop(0.52, "rgba(0,0,0,0.08)");
    depth.addColorStop(0.82, "rgba(0,0,0,0.34)");
    depth.addColorStop(1.00, "rgba(0,0,0,0.66)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = depth;
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
        ? "rgba(244,207,131," + clamp(0.44 + z * 0.12, 0.26, 0.72).toFixed(3) + ")"
        : "rgba(244,207,131,0.10)";
    }

    if (link.family === "fibonacci-return") {
      return front
        ? "rgba(184,238,255," + clamp(0.18 + z * 0.08, 0.10, 0.34).toFixed(3) + ")"
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
    closeMenus();

    state.activeLens = lens;
    document.documentElement.dataset.audraliaActiveLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaLensButton === lens ? "true" : "false");
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    writeVisibleReport(true);
    requestRender(lens === "planet" ? 4 : 10);
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

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function resetCarrier() {
    state.yaw = -0.54;
    state.pitch = -0.18;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender(8);
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      closeMenus();

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
      requestRender(16);

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
    state.canvas.setAttribute("data-audralia-g1-diagnostic-canvas", CONTRACT);
    state.canvas.setAttribute("data-previous-js-contract", PREVIOUS_JS_CONTRACT);
    state.canvas.setAttribute("data-html-binding-contract", HTML_BINDING_CONTRACT);
    state.canvas.setAttribute("data-protected-parent-baseline", PROTECTED_PARENT_BASELINE);
    state.canvas.setAttribute("data-public-datum-contract", PUBLIC_DATUM_CONTRACT);
    state.canvas.setAttribute("data-clone-datum-contract", CLONE_DATUM_CONTRACT);
    state.canvas.setAttribute("data-diagnostic-reporting", "true");
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

    requestRender(6);
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
      requestRender(6);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStage();
        requestRender(6);
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

    state.report.datumApiSource = null;
    return null;
  }

  function getDatumStatus(api) {
    if (api && typeof api.status === "function") {
      try {
        return api.status();
      } catch (error) {
        recordReportError("datum.status", error);
      }
    }

    return window.AUDRALIA_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G1_TRUE_GLOBE_DATUM_STATUS ||
      window.AUDRALIA_G2_TRUE_GLOBE_DATUM_STATUS ||
      null;
  }

  function getReceiveMap(api) {
    if (api && typeof api.receive === "function") {
      try {
        return api.receive({ reference: true });
      } catch (error) {
        recordReportError("datum.receive", error);
      }
    }

    if (api && typeof api.getReceiveMap === "function") {
      try {
        return api.getReceiveMap({ reference: true });
      } catch (error2) {
        recordReportError("datum.getReceiveMap", error2);
      }
    }

    if (api && typeof api.childReceiveMap === "function") {
      try {
        return api.childReceiveMap({ reference: true });
      } catch (error3) {
        recordReportError("datum.childReceiveMap", error3);
      }
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
      recordReportError("datum.getChildReceivePacket", error);
      return null;
    }
  }

  function hasRequiredApi(api) {
    return Boolean(
      api &&
      typeof api.status === "function" &&
      (
        typeof api.receive === "function" ||
        typeof api.getReceiveMap === "function" ||
        typeof api.childReceiveMap === "function"
      ) &&
      typeof api.getChildReceivePacket === "function"
    );
  }

  function verifyAllSeatsNEWSComplete(seats) {
    if (!Array.isArray(seats) || seats.length !== LATTICE_STATES) return false;

    return seats.every(function (seat) {
      return Boolean(
        seat &&
        seat.newsComplete === true &&
        seat.childReceiveEligible === true &&
        seat.renderEligible === true &&
        seat.north &&
        seat.north.defined === true &&
        seat.east &&
        seat.east.defined === true &&
        seat.west &&
        seat.west.defined === true &&
        seat.south &&
        seat.south.defined === true
      );
    });
  }

  function resetReportForEvaluation() {
    state.report.attempts += 1;
    state.report.checkedAt = new Date().toISOString();

    state.report.datumApiFound = false;
    state.report.publicContractAccepted = false;
    state.report.cloneContractRecognized = false;
    state.report.cloningMethodRecognized = false;
    state.report.publicAdoptionCompatible = false;
    state.report.technicalBirthComplete = false;
    state.report.parentInterfaceUnchanged = false;

    state.report.receiveMapReady = false;
    state.report.seatCount = null;
    state.report.seatCountValid = false;
    state.report.newsComplete = false;
    state.report.allSeatsNewsComplete = false;

    state.report.childPacketAvailable = false;
    state.report.childPacketSeatCount = null;
    state.report.childPacketSeatCountValid = false;

    state.report.diagnosticSlotsFound = checkDiagnosticSlots(false);
    state.report.diagnosticSlotsWritten = false;
    state.report.finalVisibleReportWritten = false;

    state.report.downstreamHeld = true;
    state.report.visualPassClaimed = false;

    setFailure("DATUM_MISSING", FAILURE_TEXT.DATUM_MISSING);
  }

  function evaluateDatumConsumption() {
    resetReportForEvaluation();
    setPhase("datum API discovery");

    var api = findDatumApi();

    if (!api) {
      setFailure("DATUM_MISSING", FAILURE_TEXT.DATUM_MISSING);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    state.report.datumApiFound = true;

    if (!hasRequiredApi(api)) {
      setFailure("API_MISSING", FAILURE_TEXT.API_MISSING);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    setPhase("datum API found");

    var status = getDatumStatus(api) || {};

    var datumContract = status.contract || api.contract || null;
    var cloneContract = status.cloneContract || api.cloneContract || null;
    var process = status.process || api.process || null;
    var publicFrame = status.publicFrame || api.publicFrame || null;
    var technicalReality = status.technicalReality || api.technicalReality || null;

    state.report.publicContractAccepted = datumContract === PUBLIC_DATUM_CONTRACT;
    state.report.cloneContractRecognized = cloneContract === CLONE_DATUM_CONTRACT;
    state.report.cloningMethodRecognized = process === PROCESS;
    state.report.publicAdoptionCompatible = Boolean(status.publicAdoptionCompatible || api.publicAdoptionCompatible);
    state.report.technicalBirthComplete = Boolean(status.technicalBirthComplete || api.technicalBirthComplete);
    state.report.parentInterfaceUnchanged = Boolean(status.parentInterfaceUnchanged || api.parentInterfaceUnchanged);

    state.report.datumContract = datumContract;
    state.report.cloneContract = cloneContract;
    state.report.process = process;
    state.report.publicFrame = publicFrame;
    state.report.technicalReality = technicalReality;

    if (!state.report.publicContractAccepted) {
      setFailure("PUBLIC_CONTRACT_MISMATCH", FAILURE_TEXT.PUBLIC_CONTRACT_MISMATCH);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    if (!state.report.cloneContractRecognized) {
      setFailure("CLONE_CONTRACT_MISMATCH", FAILURE_TEXT.CLONE_CONTRACT_MISMATCH);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    if (!state.report.cloningMethodRecognized) {
      setFailure("PROCESS_MISMATCH", FAILURE_TEXT.PROCESS_MISMATCH);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    if (
      !state.report.publicAdoptionCompatible ||
      !state.report.technicalBirthComplete ||
      !state.report.parentInterfaceUnchanged
    ) {
      setFailure("PROCESS_MISMATCH", "cloning-method markers incomplete");
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    setPhase("contracts verified");

    var map = getReceiveMap(api);

    if (!map) {
      setFailure("RECEIVE_MAP_UNAVAILABLE", FAILURE_TEXT.RECEIVE_MAP_UNAVAILABLE);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    var seats = Array.isArray(map.seats) ? map.seats : [];

    state.report.receiveMapReady = Boolean(
      map.childReceiveMapReady === true ||
      map.receiveMapReady === true ||
      status.childReceiveMapReady === true
    );

    state.report.seatCount = seats.length;
    state.report.seatCountValid = Boolean(
      seats.length === LATTICE_STATES &&
      Number(map.radialNodes) === RADIAL_NODES &&
      Number(map.fibonacciBands) === FIBONACCI_BANDS &&
      Number(map.latticeStates) === LATTICE_STATES
    );

    state.report.newsComplete = Boolean(
      map.newsProtocolActive === true &&
      map.newsComplete === true &&
      map.chronologyComplete === true &&
      map.relationshipMapReady === true &&
      map.carrierBound === true
    );

    state.report.allSeatsNewsComplete = verifyAllSeatsNEWSComplete(seats);

    if (!state.report.receiveMapReady) {
      setFailure("RECEIVE_MAP_INCOMPLETE", FAILURE_TEXT.RECEIVE_MAP_INCOMPLETE);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    if (!state.report.seatCountValid) {
      setFailure("SEAT_COUNT_MISMATCH", FAILURE_TEXT.SEAT_COUNT_MISMATCH);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    setPhase("receive map verified");

    if (!state.report.newsComplete || !state.report.allSeatsNewsComplete) {
      setFailure("NEWS_INCOMPLETE", FAILURE_TEXT.NEWS_INCOMPLETE);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    setPhase("NEWS verified");

    var packet = getChildPacket(api);

    state.report.childPacketAvailable = Boolean(packet && packet.childReceivePacketReady === true);
    state.report.childPacketSeatCount = packet && Number.isFinite(Number(packet.seatCount))
      ? Number(packet.seatCount)
      : null;
    state.report.childPacketSeatCountValid = state.report.childPacketSeatCount === LATTICE_STATES;

    if (!state.report.childPacketAvailable || !state.report.childPacketSeatCountValid) {
      setFailure("CHILD_PACKET_UNAVAILABLE", FAILURE_TEXT.CHILD_PACKET_UNAVAILABLE);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    setPhase("child packet verified");

    var downstreamFalseReady = Boolean(
      map.terrainReady === true ||
      map.moistureReady === true ||
      map.surfaceReady === true ||
      map.cloudReady === true ||
      map.continentReady === true ||
      map.visualPassClaimed === true ||
      packet.terrainReady === true ||
      packet.moistureReady === true ||
      packet.surfaceReady === true ||
      packet.cloudReady === true ||
      packet.continentReady === true ||
      packet.visualPassClaimed === true
    );

    if (downstreamFalseReady) {
      setFailure("DOWNSTREAM_FALSE_READY", FAILURE_TEXT.DOWNSTREAM_FALSE_READY);
      publishStatus();
      writeVisibleReport(true);
      return false;
    }

    state.report.downstreamHeld = true;
    state.report.visualPassClaimed = false;
    state.report.failureCode = "";
    state.report.failureReason = "";
    setPhase("success ready");

    writeVisibleReport(true);
    setPhase("success written");
    publishStatus();

    return true;
  }

  function loadDatumFile() {
    return new Promise(function (resolve) {
      if (findDatumApi()) {
        state.report.datumScriptLoaded = true;
        resolve(true);
        return;
      }

      state.report.datumScriptLoadAttempted = true;
      setPhase("datum loading");
      setFailure("DATUM_LOADING", FAILURE_TEXT.DATUM_LOADING);
      writeVisibleReport(true);
      publishStatus();

      var existing = document.querySelector("script[src*='audralia.true-globe.datum.js']");

      if (existing) {
        setTimeout(function () {
          state.report.datumScriptLoaded = Boolean(findDatumApi());
          if (!state.report.datumScriptLoaded) {
            setFailure("DATUM_LOAD_FAILED", "existing datum script found but globals absent");
          }
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
      script.setAttribute("data-process", PROCESS);
      script.setAttribute("data-downstream-held", "true");

      script.onload = function () {
        setTimeout(function () {
          state.report.datumScriptLoaded = Boolean(findDatumApi());

          if (!state.report.datumScriptLoaded) {
            setFailure("DATUM_LOAD_FAILED", "datum script loaded but globals were not published");
          }

          resolve(state.report.datumScriptLoaded);
        }, 80);
      };

      script.onerror = function () {
        state.report.datumScriptLoaded = false;
        setFailure("DATUM_LOAD_FAILED", FAILURE_TEXT.DATUM_LOAD_FAILED);
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  function runDiagnosticReportingCycle() {
    setPhase("boot pending");
    setFailure("BOOT_PENDING", FAILURE_TEXT.BOOT_PENDING);
    writeVisibleReport(true);
    publishStatus();

    var firstPass = evaluateDatumConsumption();
    if (firstPass) return;

    if (!state.report.datumApiFound) {
      loadDatumFile().then(function () {
        evaluateDatumConsumption();

        setTimeout(function () {
          evaluateDatumConsumption();
        }, 240);

        setTimeout(function () {
          evaluateDatumConsumption();
        }, 720);
      });
      return;
    }

    setTimeout(function () {
      evaluateDatumConsumption();
    }, 240);

    setTimeout(function () {
      evaluateDatumConsumption();
    }, 720);
  }

  function checkDiagnosticSlots(updateReport) {
    var required = [
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

    var found = required.every(function (selector) {
      return Boolean(query(selector));
    });

    if (updateReport) {
      state.report.diagnosticSlotsFound = found;
    }

    return found;
  }

  function reportSucceeded() {
    return Boolean(
      state.report.publicContractAccepted &&
      state.report.cloneContractRecognized &&
      state.report.cloningMethodRecognized &&
      state.report.receiveMapReady &&
      state.report.seatCountValid &&
      state.report.newsComplete &&
      state.report.allSeatsNewsComplete &&
      state.report.childPacketAvailable &&
      state.report.childPacketSeatCountValid &&
      state.report.downstreamHeld &&
      state.report.visualPassClaimed === false &&
      !state.report.failureCode
    );
  }

  function writeVisibleReport(force) {
    var t = now();
    if (!force && t - state.lastDiagnosticWrite < 750) return;

    state.lastDiagnosticWrite = t;

    var slotsFound = checkDiagnosticSlots(true);
    state.diagnosticSlotsFound = slotsFound;

    var written = true;

    written = setText("[data-audralia-diagnostic-route]", "JS diagnostic-reporting consumer · cloned seed proof") && written;
    written = setText("[data-audralia-diagnostic-carrier]", "spherical carrier active · G1 baseline protected") && written;
    written = setText("[data-audralia-diagnostic-lens]", state.activeLens) && written;
    written = setText("[data-audralia-diagnostic-canvas]", state.oneCanvas ? "one canvas" : "canvas pending") && written;
    written = setText("[data-audralia-diagnostic-loop]", state.dirtyRafPiston ? "dirty RAF · piston controlled" : "loop pending") && written;
    written = setText("[data-audralia-diagnostic-children]", "downstream held · cloned seed proof only") && written;
    written = setText("[data-audralia-diagnostic-scope]", "360 scope · 16 × 16 / 256 seats") && written;

    if (reportSucceeded()) {
      written = setText("[data-audralia-diagnostic-news]", "NEWS complete · cloned seed verified") && written;
      written = setText("[data-audralia-diagnostic-datum-child]", "cloned seed consumed · adoption-compatible") && written;
      written = setText("[data-audralia-diagnostic-receive-map]", "ready · 256 seats") && written;
      written = setText("[data-audralia-diagnostic-news-map]", "complete · N/E/W/S") && written;
      written = setText("[data-audralia-diagnostic-child-packet]", "available · route-diagnostic") && written;
      written = setText("[data-audralia-diagnostic-seat-count]", "256 / 16 × 16") && written;
      written = setText("[data-audralia-diagnostic-downstream]", "held · no child activation") && written;
      state.report.finalVisibleReportWritten = Boolean(written && slotsFound);
    } else {
      var reason = state.report.failureReason || "pending diagnostic proof";
      written = setText("[data-audralia-diagnostic-news]", "pending/fail · " + reason) && written;
      written = setText("[data-audralia-diagnostic-datum-child]", "failed · " + reason) && written;
      written = setText("[data-audralia-diagnostic-receive-map]", state.report.receiveMapReady ? "available · constrained" : "failed · receive map unavailable") && written;
      written = setText("[data-audralia-diagnostic-news-map]", state.report.newsComplete && state.report.allSeatsNewsComplete ? "complete · N/E/W/S" : "failed · NEWS incomplete") && written;
      written = setText("[data-audralia-diagnostic-child-packet]", state.report.childPacketAvailable ? "available · constrained" : "failed · child packet unavailable") && written;
      written = setText("[data-audralia-diagnostic-seat-count]", state.report.seatCountValid ? "256 / 16 × 16" : "failed · expected 256") && written;
      written = setText("[data-audralia-diagnostic-downstream]", "held · no activation") && written;
      state.report.finalVisibleReportWritten = false;
    }

    state.report.diagnosticSlotsWritten = Boolean(written && slotsFound);
    state.diagnosticSlotsWritten = state.report.diagnosticSlotsWritten;
    state.finalVisibleReportWritten = state.report.finalVisibleReportWritten;

    if (!slotsFound) {
      setFailure("REPORTING_SLOT_MISSING", FAILURE_TEXT.REPORTING_SLOT_MISSING);
    }

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousJsContract", PREVIOUS_JS_CONTRACT);
    setDataset("audraliaHtmlBindingContract", HTML_BINDING_CONTRACT);
    setDataset("audraliaPublicDatumContract", PUBLIC_DATUM_CONTRACT);
    setDataset("audraliaCloneDatumContract", CLONE_DATUM_CONTRACT);
    setDataset("audraliaDiagnosticReporting", true);
    setDataset("audraliaPhase", state.report.phase);
    setDataset("audraliaDatumApiFound", state.report.datumApiFound);
    setDataset("audraliaPublicContractAccepted", state.report.publicContractAccepted);
    setDataset("audraliaCloneContractRecognized", state.report.cloneContractRecognized);
    setDataset("audraliaCloningMethodRecognized", state.report.cloningMethodRecognized);
    setDataset("audraliaReceiveMapReady", state.report.receiveMapReady);
    setDataset("audraliaSeatCountValid", state.report.seatCountValid);
    setDataset("audraliaNewsComplete", state.report.newsComplete && state.report.allSeatsNewsComplete);
    setDataset("audraliaChildPacketAvailable", state.report.childPacketAvailable);
    setDataset("audraliaFinalVisibleReportWritten", state.report.finalVisibleReportWritten);
    setDataset("audraliaDownstreamHeld", true);
    setDataset("audraliaFailureCode", state.report.failureCode || "NONE");

    publishStatus();
  }

  function publishStatus() {
    var payload = {
      contract: CONTRACT,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      htmlBindingContract: HTML_BINDING_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",

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
      cloningMethodRecognized: state.report.cloningMethodRecognized,
      publicAdoptionCompatible: state.report.publicAdoptionCompatible,
      technicalBirthComplete: state.report.technicalBirthComplete,
      parentInterfaceUnchanged: state.report.parentInterfaceUnchanged,

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

      parentBaselineProtected: true,
      globeRole: "observable-organic-carrier",
      diamondLatticeRole: "scientific-discovery-rule-layer",
      diamondLatticeIsPlanetBody: false,
      visualLatticeSource: "protected-local-g1-diagnostic-geometry",
      datumSeatsUsedForVisualLattice: false,

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

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      routeErrors: state.errors.slice()
    };

    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_STATUS = payload;

    return payload;
  }

  function publishBoot() {
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_BOOT = {
      contract: CONTRACT,
      previousJsContract: PREVIOUS_JS_CONTRACT,
      htmlBindingContract: HTML_BINDING_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      datumFile: DATUM_FILE,
      publicDatumContract: PUBLIC_DATUM_CONTRACT,
      cloneDatumContract: CLONE_DATUM_CONTRACT,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",
      parentBaselineProtected: true,
      datumFileChanged: false,
      htmlFileChanged: false,
      visualLatticeReplacement: false,
      downstreamHeld: true,
      terrainActivated: false,
      moistureActivated: false,
      surfaceActivated: false,
      cloudActivated: false,
      continentActivated: false,
      visualPassClaimed: false,
      bootedAt: new Date().toISOString()
    };
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    state.raf = 0;

    if (resizeObserver) {
      try {
        resizeObserver.disconnect();
      } catch (_error2) {}
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch (_error3) {}
    }
  }

  window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    previousJsContract: PREVIOUS_JS_CONTRACT,
    htmlBindingContract: HTML_BINDING_CONTRACT,
    protectedParentBaseline: PROTECTED_PARENT_BASELINE,
    diagnosticStatus: publishStatus,
    runDiagnosticReportingCycle: runDiagnosticReportingCycle
  };

  function init() {
    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");
    state.details = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      return;
    }

    enforceOneCanvas();
    buildLocalDiagnosticGeometry();
    setupResize();
    bindLensControls();
    bindPointer();
    setLens("planet");
    publishBoot();
    publishStatus();
    writeVisibleReport(true);
    requestRender(8);
    runDiagnosticReportingCycle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
