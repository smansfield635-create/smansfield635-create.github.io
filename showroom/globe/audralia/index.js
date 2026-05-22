// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_TNT_v1
//
// Previous route JS contract:
// AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_TNT_v1
//
// Current HTML binding:
// AUDRALIA_G1_DATUM_ADOPTION_HTML_BINDING_TNT_v1
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
// Cloning-method datum contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1
//
// Purpose:
// - Preserve the locked G1 360 Diagnostic Scope globe baseline.
// - Consume the cloned datum seed without rewriting it.
// - Recognize both the public receive-map contract and the cloning-method seed contract.
// - Verify datum API, receive map, NEWS map, 256 seats, and child packet.
// - Write the visible diagnostic result into the HTML slots when present.
// - Publish route status even if HTML slots are absent.
// - Do not replace the visual lattice with datum seats yet.
// - Do not activate terrain, moisture, surface, cloud, continent, ground-level, or visual-pass work.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_TNT_v1";
  var PREVIOUS_ROUTE_JS_CONTRACT = "AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_TNT_v1";
  var HTML_BINDING_CONTRACT = "AUDRALIA_G1_DATUM_ADOPTION_HTML_BINDING_TNT_v1";
  var PROTECTED_PARENT_BASELINE = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";

  var DATUM_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var PUBLIC_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var CLONE_DATUM_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";
  var DATUM_CACHE_KEY = "AUDRALIA_G1_CHILD_MATH_DATUM_CLONING_METHOD_SEED_TNT_v1";

  var CLONING_METHOD = "cloning_method";
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
      label: "<strong>Planet View</strong> → spherical carrier · cloned datum consumed under the hood",
      copy: "Planet View preserves the observable globe carrier. The cloned datum seed is consumed as math only; it does not replace the planet body."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 diagnostic scope · cloned seed verified",
      copy: "Lattice View preserves the 16 × 16 / 256 diagnostic scope while the parent route verifies the cloned datum receive-map."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → cloning-method consumer · downstream held",
      copy: "Diagnostic Scope reports whether the parent route consumed the cloned datum seed, verified NEWS completion, and kept downstream children held."
    }
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

    lastDiagnosticWrite: 0,
    datasetCache: {},
    errors: [],

    consumer: {
      attempted: false,
      loading: false,
      loadAttempted: false,
      loadSucceeded: false,
      loadFailed: false,

      datumApiFound: false,
      datumApiSource: null,
      datumLoaded: false,
      datumConsumed: false,

      statusReady: false,
      publicContractAccepted: false,
      cloneContractRecognized: false,
      cloningMethodRecognized: false,
      publicAdoptionCompatible: false,
      technicalBirthComplete: false,
      parentInterfaceUnchanged: false,

      datumContract: null,
      cloneContract: null,
      process: null,
      publicFrame: null,
      technicalReality: null,

      receiveMapReady: false,
      seatCount: null,
      seatCountValid: false,
      newsComplete: false,
      allSeatsNewsComplete: false,
      childPacketAvailable: false,
      childPacketSeatCount: null,
      childPacketSeatCountValid: false,

      downstreamHeld: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassClaimed: false,

      failureReason: "pending-consumption",
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

  function setText(selector, value) {
    var node = document.querySelector(selector);
    var text = String(value);
    if (node && node.textContent !== text) node.textContent = text;
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    var html = String(value);
    if (node && node.innerHTML !== html) node.innerHTML = html;
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

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };
  }

  function recordConsumerError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");

    state.consumer.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    state.consumer.failureReason = scope + ": " + message;

    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ERROR = {
      contract: CONTRACT,
      datumFile: DATUM_FILE,
      publicDatumContract: PUBLIC_DATUM_CONTRACT,
      cloneDatumContract: CLONE_DATUM_CONTRACT,
      scope: scope,
      message: message,
      errors: state.consumer.errors.slice()
    };
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

    publishRouteStatus();

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

    writeDiagnostics(true);
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
      writeDiagnostics(true);
      requestRender(16);
      event.preventDefault();
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

    if (!selected) {
      selected = canvases[0] || document.createElement("canvas");
    }

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
    state.canvas.setAttribute("data-previous-route-js-contract", PREVIOUS_ROUTE_JS_CONTRACT);
    state.canvas.setAttribute("data-html-binding-contract", HTML_BINDING_CONTRACT);
    state.canvas.setAttribute("data-protected-parent-baseline", PROTECTED_PARENT_BASELINE);
    state.canvas.setAttribute("data-public-datum-contract", PUBLIC_DATUM_CONTRACT);
    state.canvas.setAttribute("data-clone-datum-contract", CLONE_DATUM_CONTRACT);
    state.canvas.setAttribute("data-cloning-method-consumer", "true");
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
        state.consumer.datumApiSource = sources[i][0];
        return sources[i][1];
      }
    }

    state.consumer.datumApiSource = null;
    return null;
  }

  function getDatumStatus(api) {
    if (api && typeof api.status === "function") {
      try {
        return api.status();
      } catch (error) {
        recordConsumerError("datum.status", error);
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
        recordConsumerError("datum.receive", error);
      }
    }

    if (api && typeof api.getReceiveMap === "function") {
      try {
        return api.getReceiveMap({ reference: true });
      } catch (error2) {
        recordConsumerError("datum.getReceiveMap", error2);
      }
    }

    if (api && typeof api.childReceiveMap === "function") {
      try {
        return api.childReceiveMap({ reference: true });
      } catch (error3) {
        recordConsumerError("datum.childReceiveMap", error3);
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
      recordConsumerError("datum.getChildReceivePacket", error);
      return null;
    }
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

  function publicContractAccepted(contract) {
    return contract === PUBLIC_DATUM_CONTRACT;
  }

  function cloneContractRecognized(cloneContract) {
    return cloneContract === CLONE_DATUM_CONTRACT;
  }

  function processRecognized(process) {
    return process === CLONING_METHOD;
  }

  function resetConsumerForCheck() {
    var consumer = state.consumer;

    consumer.attempted = true;
    consumer.checkedAt = new Date().toISOString();

    consumer.datumApiFound = false;
    consumer.datumLoaded = false;
    consumer.datumConsumed = false;

    consumer.statusReady = false;
    consumer.publicContractAccepted = false;
    consumer.cloneContractRecognized = false;
    consumer.cloningMethodRecognized = false;
    consumer.publicAdoptionCompatible = false;
    consumer.technicalBirthComplete = false;
    consumer.parentInterfaceUnchanged = false;

    consumer.datumContract = null;
    consumer.cloneContract = null;
    consumer.process = null;
    consumer.publicFrame = null;
    consumer.technicalReality = null;

    consumer.receiveMapReady = false;
    consumer.seatCount = null;
    consumer.seatCountValid = false;
    consumer.newsComplete = false;
    consumer.allSeatsNewsComplete = false;
    consumer.childPacketAvailable = false;
    consumer.childPacketSeatCount = null;
    consumer.childPacketSeatCountValid = false;

    consumer.downstreamHeld = true;
    consumer.terrainReady = false;
    consumer.moistureReady = false;
    consumer.surfaceReady = false;
    consumer.cloudReady = false;
    consumer.continentReady = false;
    consumer.visualPassClaimed = false;

    consumer.failureReason = "pending-consumption";
  }

  function evaluateCloneConsumer() {
    resetConsumerForCheck();

    var consumer = state.consumer;
    var api = findDatumApi();

    if (!api) {
      consumer.failureReason = consumer.loading ? "loading cloned datum seed" : "datum global missing";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    consumer.datumApiFound = true;
    consumer.datumLoaded = true;

    var status = getDatumStatus(api);
    consumer.statusReady = Boolean(status);

    consumer.datumContract = (status && status.contract) || api.contract || null;
    consumer.cloneContract = (status && status.cloneContract) || api.cloneContract || null;
    consumer.process = (status && status.process) || api.process || null;
    consumer.publicFrame = (status && status.publicFrame) || api.publicFrame || null;
    consumer.technicalReality = (status && status.technicalReality) || api.technicalReality || null;

    consumer.publicContractAccepted = publicContractAccepted(consumer.datumContract);
    consumer.cloneContractRecognized = cloneContractRecognized(consumer.cloneContract);
    consumer.cloningMethodRecognized = processRecognized(consumer.process);
    consumer.publicAdoptionCompatible = Boolean((status && status.publicAdoptionCompatible) || api.publicAdoptionCompatible);
    consumer.technicalBirthComplete = Boolean((status && status.technicalBirthComplete) || api.technicalBirthComplete);
    consumer.parentInterfaceUnchanged = Boolean((status && status.parentInterfaceUnchanged) || api.parentInterfaceUnchanged);

    if (!consumer.publicContractAccepted) {
      consumer.failureReason = "public contract mismatch";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    if (!consumer.cloneContractRecognized) {
      consumer.failureReason = "clone contract mismatch";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    if (!consumer.cloningMethodRecognized) {
      consumer.failureReason = "process mismatch";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    if (!consumer.publicAdoptionCompatible) {
      consumer.failureReason = "public adoption compatibility missing";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    if (!consumer.technicalBirthComplete) {
      consumer.failureReason = "technical birth incomplete";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    if (!consumer.parentInterfaceUnchanged) {
      consumer.failureReason = "parent interface changed";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    var map = getReceiveMap(api);

    if (!map) {
      consumer.failureReason = "receive map unavailable";
      publishRouteStatus();
      writeDiagnostics(true);
      return consumer;
    }

    var seats = Array.isArray(map.seats) ? map.seats : [];

    consumer.receiveMapReady = map.childReceiveMapReady === true || (status && status.childReceiveMapReady === true);
    consumer.seatCount = seats.length;
    consumer.seatCountValid =
      seats.length === LATTICE_STATES &&
      Number(map.radialNodes) === RADIAL_NODES &&
      Number(map.fibonacciBands) === FIBONACCI_BANDS &&
      Number(map.latticeStates) === LATTICE_STATES;

    consumer.newsComplete =
      map.newsProtocolActive === true &&
      map.newsComplete === true &&
      map.chronologyComplete === true &&
      map.relationshipMapReady === true &&
      map.carrierBound === true;

    consumer.allSeatsNewsComplete = verifyAllSeatsNEWSComplete(seats);

    var packet = getChildPacket(api);

    consumer.childPacketAvailable = Boolean(packet && packet.childReceivePacketReady === true);
    consumer.childPacketSeatCount = packet && Number.isFinite(Number(packet.seatCount)) ? Number(packet.seatCount) : null;
    consumer.childPacketSeatCountValid = consumer.childPacketSeatCount === LATTICE_STATES;

    consumer.terrainReady = map.terrainReady === true || (packet && packet.terrainReady === true);
    consumer.moistureReady = map.moistureReady === true || (packet && packet.moistureReady === true);
    consumer.surfaceReady = map.surfaceReady === true || (packet && packet.surfaceReady === true);
    consumer.cloudReady = map.cloudReady === true || (packet && packet.cloudReady === true);
    consumer.continentReady = map.continentReady === true || (packet && packet.continentReady === true);
    consumer.visualPassClaimed = map.visualPassClaimed === true || (packet && packet.visualPassClaimed === true);

    if (!consumer.receiveMapReady) {
      consumer.failureReason = "receive map not ready";
    } else if (!consumer.seatCountValid) {
      consumer.failureReason = "seat-count mismatch";
    } else if (!consumer.newsComplete || !consumer.allSeatsNewsComplete) {
      consumer.failureReason = "NEWS incomplete";
    } else if (!consumer.childPacketAvailable || !consumer.childPacketSeatCountValid) {
      consumer.failureReason = "child packet unavailable";
    } else if (
      consumer.terrainReady ||
      consumer.moistureReady ||
      consumer.surfaceReady ||
      consumer.cloudReady ||
      consumer.continentReady ||
      consumer.visualPassClaimed
    ) {
      consumer.failureReason = "downstream false-ready claim";
    } else {
      consumer.datumConsumed = true;
      consumer.failureReason = "";
    }

    publishRouteStatus();
    writeDiagnostics(true);
    return consumer;
  }

  function loadDatumFileIfMissing() {
    return new Promise(function (resolve) {
      if (findDatumApi()) {
        state.consumer.loadSucceeded = true;
        state.consumer.datumLoaded = true;
        resolve(findDatumApi());
        return;
      }

      state.consumer.loadAttempted = true;
      state.consumer.loading = true;
      writeDiagnostics(true);

      var existing = document.querySelector("script[src*='audralia.true-globe.datum.js']");

      if (existing) {
        setTimeout(function () {
          state.consumer.loading = false;
          state.consumer.loadSucceeded = Boolean(findDatumApi());
          state.consumer.loadFailed = !state.consumer.loadSucceeded;
          resolve(findDatumApi());
        }, 180);
        return;
      }

      var script = document.createElement("script");
      script.src = DATUM_FILE + "?v=" + encodeURIComponent(DATUM_CACHE_KEY);
      script.defer = true;
      script.async = true;
      script.setAttribute("data-audralia-datum-cloning-method-loader", CONTRACT);
      script.setAttribute("data-public-datum-contract", PUBLIC_DATUM_CONTRACT);
      script.setAttribute("data-clone-datum-contract", CLONE_DATUM_CONTRACT);
      script.setAttribute("data-process", CLONING_METHOD);
      script.setAttribute("data-downstream-activation", "false");

      script.onload = function () {
        state.consumer.loading = false;
        state.consumer.loadSucceeded = Boolean(findDatumApi());
        state.consumer.loadFailed = !state.consumer.loadSucceeded;

        if (!state.consumer.loadSucceeded) {
          recordConsumerError("load-cloned-datum-seed", "script loaded but datum global was not published");
        }

        resolve(findDatumApi());
      };

      script.onerror = function () {
        state.consumer.loading = false;
        state.consumer.loadSucceeded = false;
        state.consumer.loadFailed = true;
        recordConsumerError("load-cloned-datum-seed", "script load failed");
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  function runCloneConsumerCycle() {
    evaluateCloneConsumer();

    if (!state.consumer.datumConsumed && !findDatumApi()) {
      loadDatumFileIfMissing().then(function () {
        evaluateCloneConsumer();
      });
    }
  }

  function consumerStatusPayload() {
    return {
      contract: CONTRACT,
      previousRouteJsContract: PREVIOUS_ROUTE_JS_CONTRACT,
      htmlBindingContract: HTML_BINDING_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      datumFile: DATUM_FILE,
      publicDatumContract: PUBLIC_DATUM_CONTRACT,
      cloneDatumContract: CLONE_DATUM_CONTRACT,

      attempted: state.consumer.attempted,
      loading: state.consumer.loading,
      loadAttempted: state.consumer.loadAttempted,
      loadSucceeded: state.consumer.loadSucceeded,
      loadFailed: state.consumer.loadFailed,

      datumApiFound: state.consumer.datumApiFound,
      datumApiSource: state.consumer.datumApiSource,
      datumLoaded: state.consumer.datumLoaded,
      datumConsumed: state.consumer.datumConsumed,

      datumContract: state.consumer.datumContract,
      cloneContract: state.consumer.cloneContract,
      process: state.consumer.process,
      publicFrame: state.consumer.publicFrame,
      technicalReality: state.consumer.technicalReality,

      publicContractAccepted: state.consumer.publicContractAccepted,
      cloneContractRecognized: state.consumer.cloneContractRecognized,
      cloningMethodRecognized: state.consumer.cloningMethodRecognized,
      publicAdoptionCompatible: state.consumer.publicAdoptionCompatible,
      technicalBirthComplete: state.consumer.technicalBirthComplete,
      parentInterfaceUnchanged: state.consumer.parentInterfaceUnchanged,

      receiveMapReady: state.consumer.receiveMapReady,
      seatCount: state.consumer.seatCount,
      seatCountValid: state.consumer.seatCountValid,
      newsComplete: state.consumer.newsComplete,
      allSeatsNewsComplete: state.consumer.allSeatsNewsComplete,
      childPacketAvailable: state.consumer.childPacketAvailable,
      childPacketSeatCount: state.consumer.childPacketSeatCount,
      childPacketSeatCountValid: state.consumer.childPacketSeatCountValid,

      downstreamHeld: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassClaimed: false,

      failureReason: state.consumer.failureReason,
      checkedAt: state.consumer.checkedAt,
      errors: state.consumer.errors.slice()
    };
  }

  function publishRouteStatus() {
    var payload = {
      contract: CONTRACT,
      previousRouteJsContract: PREVIOUS_ROUTE_JS_CONTRACT,
      htmlBindingContract: HTML_BINDING_CONTRACT,
      protectedParentBaseline: PROTECTED_PARENT_BASELINE,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",

      consumer: consumerStatusPayload(),

      parentBaselineProtected: true,
      globeRole: "observable-organic-carrier",
      diamondLatticeRole: "scientific-discovery-rule-layer",
      diamondLatticeIsPlanetBody: false,
      visualLatticeSource: "protected-local-g1-diagnostic-geometry",
      datumSeatsUsedForVisualLattice: false,

      newsProtocolActive: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,
      activeLens: state.activeLens,
      oneCanvas: state.oneCanvas,
      onePointerPath: state.onePointerPath,
      dirtyRafPiston: state.dirtyRafPiston,
      smoothDragProtected: true,

      downstreamHeld: true,
      terrainActivated: false,
      moistureActivated: false,
      surfaceActivated: false,
      cloudActivated: false,
      continentActivated: false,
      visualPassClaimed: false,

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      errors: state.errors.slice()
    };

    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_STATUS = payload;
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_STATUS = payload.consumer;

    return payload;
  }

  function writeDiagnostics(force) {
    var t = now();
    if (!force && t - state.lastDiagnosticWrite < 1000) return;
    state.lastDiagnosticWrite = t;

    var c = state.consumer;

    setText("[data-audralia-diagnostic-route]", "JS cloning-method consumer · parent baseline protected");
    setText("[data-audralia-diagnostic-carrier]", "spherical carrier active · visual lattice remains protected");
    setText("[data-audralia-diagnostic-lens]", state.activeLens);
    setText("[data-audralia-diagnostic-canvas]", state.oneCanvas ? "one canvas" : "canvas pending");
    setText("[data-audralia-diagnostic-loop]", state.dirtyRafPiston ? "dirty RAF · piston controlled" : "loop pending");
    setText("[data-audralia-diagnostic-children]", "downstream held · cloned seed consumption only");
    setText("[data-audralia-diagnostic-news]", c.datumConsumed ? "NEWS complete · cloned seed verified" : "NEWS pending · cloned seed check");
    setText("[data-audralia-diagnostic-scope]", "360 scope · 16 × 16 / 256 seats");

    if (!c.attempted) {
      setText("[data-audralia-diagnostic-datum-child]", "pending cloned-seed consumption");
      setText("[data-audralia-diagnostic-receive-map]", "pending cloned-seed consumption");
      setText("[data-audralia-diagnostic-news-map]", "pending cloned-seed consumption");
      setText("[data-audralia-diagnostic-child-packet]", "pending cloned-seed consumption");
      setText("[data-audralia-diagnostic-seat-count]", "pending cloned-seed consumption");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else if (c.loading) {
      setText("[data-audralia-diagnostic-datum-child]", "loading cloned datum seed");
      setText("[data-audralia-diagnostic-receive-map]", "pending");
      setText("[data-audralia-diagnostic-news-map]", "pending");
      setText("[data-audralia-diagnostic-child-packet]", "pending");
      setText("[data-audralia-diagnostic-seat-count]", "pending");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else if (c.datumConsumed) {
      setText("[data-audralia-diagnostic-datum-child]", "cloned seed consumed · adoption-compatible");
      setText("[data-audralia-diagnostic-receive-map]", "ready · 256 seats");
      setText("[data-audralia-diagnostic-news-map]", "complete · N/E/W/S");
      setText("[data-audralia-diagnostic-child-packet]", "available · route-diagnostic");
      setText("[data-audralia-diagnostic-seat-count]", "256 / 16 × 16");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else {
      setText("[data-audralia-diagnostic-datum-child]", "failed · " + (c.failureReason || "cloned seed unavailable"));
      setText("[data-audralia-diagnostic-receive-map]", c.receiveMapReady ? "available · constrained" : "failed · receive map unavailable");
      setText("[data-audralia-diagnostic-news-map]", c.newsComplete && c.allSeatsNewsComplete ? "complete · N/E/W/S" : "failed · NEWS incomplete");
      setText("[data-audralia-diagnostic-child-packet]", c.childPacketAvailable ? "available · constrained" : "failed · child packet unavailable");
      setText("[data-audralia-diagnostic-seat-count]", c.seatCountValid ? "256 / 16 × 16" : "failed · expected 256");
      setText("[data-audralia-diagnostic-downstream]", "held · no activation");
    }

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousRouteJsContract", PREVIOUS_ROUTE_JS_CONTRACT);
    setDataset("audraliaHtmlBindingContract", HTML_BINDING_CONTRACT);
    setDataset("audraliaProtectedParentBaseline", PROTECTED_PARENT_BASELINE);
    setDataset("audraliaPublicDatumContract", PUBLIC_DATUM_CONTRACT);
    setDataset("audraliaCloneDatumContract", CLONE_DATUM_CONTRACT);
    setDataset("audraliaCloneMethodConsumer", true);
    setDataset("audraliaDatumConsumed", c.datumConsumed);
    setDataset("audraliaCloneContractRecognized", c.cloneContractRecognized);
    setDataset("audraliaPublicContractAccepted", c.publicContractAccepted);
    setDataset("audraliaTechnicalBirthComplete", c.technicalBirthComplete);
    setDataset("audraliaReceiveMapReady", c.receiveMapReady);
    setDataset("audraliaSeatCountValid", c.seatCountValid);
    setDataset("audraliaNewsComplete", c.newsComplete && c.allSeatsNewsComplete);
    setDataset("audraliaChildPacketAvailable", c.childPacketAvailable);
    setDataset("audraliaDownstreamHeld", true);
  }

  function publishBoot() {
    window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_BOOT = {
      contract: CONTRACT,
      previousRouteJsContract: PREVIOUS_ROUTE_JS_CONTRACT,
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
    previousRouteJsContract: PREVIOUS_ROUTE_JS_CONTRACT,
    htmlBindingContract: HTML_BINDING_CONTRACT,
    protectedParentBaseline: PROTECTED_PARENT_BASELINE,
    consumerStatus: consumerStatusPayload,
    routeStatus: publishRouteStatus
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
    publishRouteStatus();
    writeDiagnostics(true);
    requestRender(8);
    runCloneConsumerCycle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
