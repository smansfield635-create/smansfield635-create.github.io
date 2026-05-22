// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_TNT_v1
//
// Process:
// ADOPTION, NOT BIRTH.
//
// Adoption file held:
// /assets/audralia/clean/runtime/audralia.true-globe.datum.js
//
// Adoption file contract:
// AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1
//
// Protected parent baseline:
// AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1
//
// Purpose:
// - Preserve the locked G1 360 Diagnostic Scope globe baseline.
// - Adopt the existing datum child file as-is.
// - Do not rewrite, renew, replace, or duplicate datum authority.
// - Verify datum API, receive map, NEWS map, 256 seats, and child packet.
// - Publish adoption status even if HTML diagnostic slots are absent.
// - Populate HTML diagnostic slots only if they already exist.
// - Do not replace the visual lattice with datum seats yet.
// - Do not activate terrain, moisture, surface, cloud, continent, or visual-pass work.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_TNT_v1";
  var PREVIOUS_BASELINE = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";
  var HTML_DIAGNOSTIC_CONTRACT = "AUDRALIA_G1_DATUM_CHILD_RECOGNITION_HTML_DIAGNOSTIC_TNT_v1";

  var ADOPTION_PROCESS = "adoption-not-birth";
  var ADOPTION_FILE = "/assets/audralia/clean/runtime/audralia.true-globe.datum.js";
  var ADOPTION_FILE_CONTRACT = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";
  var ADOPTION_CACHE_KEY = "AUDRALIA_G1_CHILD_MATH_DATUM_RECEIVE_MAP_TNT_v1";

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
      label: "<strong>Planet View</strong> → spherical carrier · diagnostic lattice held as discovery layer",
      copy: "Planet View preserves the observable globe carrier. The diagnostic lattice remains a rule layer, not the planet body."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 diagnostic scope · 16 × 16 / 256 seats",
      copy: "Lattice View wraps the spherical carrier with the protected 360 diagnostic scope while datum adoption is checked under the hood."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → parent baseline protected · datum adoption checked · downstream held",
      copy: "Diagnostic Scope reports the G1 carrier baseline and whether the existing datum child has been adopted without activating downstream children."
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
    oneLoop: false,
    duplicateCanvasRemoved: 0,

    lastDiagnosticWrite: 0,
    datasetCache: {},
    errors: [],

    adoption: {
      process: ADOPTION_PROCESS,
      attempted: false,
      loading: false,
      loadAttempted: false,
      loadSucceeded: false,
      loadFailed: false,
      apiFound: false,
      apiSource: null,
      statusReady: false,
      datumLoaded: false,
      datumAdopted: false,
      datumContract: null,
      contractValid: false,
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
      failureReason: "pending-adoption",
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

    window.AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };
  }

  function recordAdoptionError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");

    state.adoption.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    state.adoption.failureReason = scope + ": " + message;

    window.AUDRALIA_G1_DATUM_ADOPTION_ERROR = {
      contract: CONTRACT,
      adoptionFile: ADOPTION_FILE,
      adoptionFileContract: ADOPTION_FILE_CONTRACT,
      scope: scope,
      message: message,
      errors: state.adoption.errors.slice()
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
    state.oneLoop = true;
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
    state.canvas.setAttribute("data-previous-baseline", PREVIOUS_BASELINE);
    state.canvas.setAttribute("data-adoption-process", ADOPTION_PROCESS);
    state.canvas.setAttribute("data-adoption-file", ADOPTION_FILE);
    state.canvas.setAttribute("data-adoption-file-contract", ADOPTION_FILE_CONTRACT);
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

  function findDatumAdoptionApi() {
    var sources = [
      ["AUDRALIA_TRUE_GLOBE_DATUM", window.AUDRALIA_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G1_TRUE_GLOBE_DATUM", window.AUDRALIA_G1_TRUE_GLOBE_DATUM],
      ["AUDRALIA_TRUE_PLANETARY_DATUM", window.AUDRALIA_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G1_TRUE_PLANETARY_DATUM", window.AUDRALIA_G1_TRUE_PLANETARY_DATUM],
      ["AUDRALIA_G2_TRUE_GLOBE_DATUM", window.AUDRALIA_G2_TRUE_GLOBE_DATUM],
      ["AUDRALIA_G2_TRUE_PLANETARY_DATUM", window.AUDRALIA_G2_TRUE_PLANETARY_DATUM]
    ];

    for (var i = 0; i < sources.length; i += 1) {
      if (sources[i][1]) {
        state.adoption.apiSource = sources[i][0];
        return sources[i][1];
      }
    }

    state.adoption.apiSource = null;
    return null;
  }

  function getDatumStatus(api) {
    if (api && typeof api.status === "function") {
      try {
        return api.status();
      } catch (error) {
        recordAdoptionError("datum.status", error);
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
        recordAdoptionError("datum.receive", error);
      }
    }

    if (api && typeof api.getReceiveMap === "function") {
      try {
        return api.getReceiveMap({ reference: true });
      } catch (error2) {
        recordAdoptionError("datum.getReceiveMap", error2);
      }
    }

    if (api && typeof api.childReceiveMap === "function") {
      try {
        return api.childReceiveMap({ reference: true });
      } catch (error3) {
        recordAdoptionError("datum.childReceiveMap", error3);
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
      recordAdoptionError("datum.getChildReceivePacket", error);
      return null;
    }
  }

  function contractValid(contract) {
    return contract === ADOPTION_FILE_CONTRACT;
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

  function evaluateDatumAdoption() {
    var adoption = state.adoption;

    adoption.attempted = true;
    adoption.checkedAt = new Date().toISOString();
    adoption.datumAdopted = false;
    adoption.failureReason = "pending-adoption";
    adoption.apiFound = false;
    adoption.statusReady = false;
    adoption.datumLoaded = false;
    adoption.datumContract = null;
    adoption.contractValid = false;
    adoption.receiveMapReady = false;
    adoption.seatCount = null;
    adoption.seatCountValid = false;
    adoption.newsComplete = false;
    adoption.allSeatsNewsComplete = false;
    adoption.childPacketAvailable = false;
    adoption.childPacketSeatCount = null;
    adoption.childPacketSeatCountValid = false;
    adoption.terrainReady = false;
    adoption.moistureReady = false;
    adoption.surfaceReady = false;
    adoption.cloudReady = false;
    adoption.continentReady = false;
    adoption.visualPassClaimed = false;

    var api = findDatumAdoptionApi();

    if (!api) {
      adoption.failureReason = adoption.loading ? "loading adoption file" : "datum adoption global missing";
      publishRouteStatus();
      writeDiagnostics(true);
      return adoption;
    }

    adoption.apiFound = true;
    adoption.datumLoaded = true;

    var status = getDatumStatus(api);
    adoption.statusReady = Boolean(status);
    adoption.datumContract = (status && status.contract) || api.contract || null;
    adoption.contractValid = contractValid(adoption.datumContract);

    if (!adoption.contractValid) {
      adoption.failureReason = "contract mismatch";
      publishRouteStatus();
      writeDiagnostics(true);
      return adoption;
    }

    var map = getReceiveMap(api);

    if (!map) {
      adoption.failureReason = "receive map unavailable";
      publishRouteStatus();
      writeDiagnostics(true);
      return adoption;
    }

    var seats = Array.isArray(map.seats) ? map.seats : [];
    adoption.receiveMapReady = map.childReceiveMapReady === true || (status && status.childReceiveMapReady === true);
    adoption.seatCount = seats.length;
    adoption.seatCountValid =
      seats.length === LATTICE_STATES &&
      Number(map.radialNodes) === RADIAL_NODES &&
      Number(map.fibonacciBands) === FIBONACCI_BANDS &&
      Number(map.latticeStates) === LATTICE_STATES;

    adoption.newsComplete = map.newsProtocolActive === true && map.newsComplete === true;
    adoption.allSeatsNewsComplete = verifyAllSeatsNEWSComplete(seats);

    var packet = getChildPacket(api);
    adoption.childPacketAvailable = Boolean(packet && packet.childReceivePacketReady === true);
    adoption.childPacketSeatCount = packet && Number.isFinite(Number(packet.seatCount)) ? Number(packet.seatCount) : null;
    adoption.childPacketSeatCountValid = adoption.childPacketSeatCount === LATTICE_STATES;

    adoption.terrainReady = map.terrainReady === true || (packet && packet.terrainReady === true);
    adoption.moistureReady = map.moistureReady === true || (packet && packet.moistureReady === true);
    adoption.surfaceReady = map.surfaceReady === true || (packet && packet.surfaceReady === true);
    adoption.cloudReady = map.cloudReady === true || (packet && packet.cloudReady === true);
    adoption.continentReady = map.continentReady === true || (packet && packet.continentReady === true);
    adoption.visualPassClaimed = map.visualPassClaimed === true || (packet && packet.visualPassClaimed === true);

    if (!adoption.receiveMapReady) {
      adoption.failureReason = "receive map not ready";
    } else if (!adoption.seatCountValid) {
      adoption.failureReason = "seat-count mismatch";
    } else if (!adoption.newsComplete || !adoption.allSeatsNewsComplete) {
      adoption.failureReason = "NEWS incomplete";
    } else if (!adoption.childPacketAvailable || !adoption.childPacketSeatCountValid) {
      adoption.failureReason = "child packet unavailable";
    } else if (
      adoption.terrainReady ||
      adoption.moistureReady ||
      adoption.surfaceReady ||
      adoption.cloudReady ||
      adoption.continentReady ||
      adoption.visualPassClaimed
    ) {
      adoption.failureReason = "downstream false-ready claim";
    } else {
      adoption.datumAdopted = true;
      adoption.failureReason = "";
    }

    publishRouteStatus();
    writeDiagnostics(true);
    return adoption;
  }

  function loadDatumAdoptionFileIfMissing() {
    return new Promise(function (resolve) {
      if (findDatumAdoptionApi()) {
        state.adoption.loadSucceeded = true;
        state.adoption.datumLoaded = true;
        resolve(findDatumAdoptionApi());
        return;
      }

      state.adoption.loadAttempted = true;
      state.adoption.loading = true;
      writeDiagnostics(true);

      var existing = document.querySelector("script[src*='audralia.true-globe.datum.js']");

      if (existing) {
        setTimeout(function () {
          state.adoption.loading = false;
          state.adoption.loadSucceeded = Boolean(findDatumAdoptionApi());
          state.adoption.loadFailed = !state.adoption.loadSucceeded;
          resolve(findDatumAdoptionApi());
        }, 160);
        return;
      }

      var script = document.createElement("script");
      script.src = ADOPTION_FILE + "?v=" + encodeURIComponent(ADOPTION_CACHE_KEY);
      script.defer = true;
      script.async = true;
      script.setAttribute("data-audralia-datum-adoption-loader", CONTRACT);
      script.setAttribute("data-adoption-process", ADOPTION_PROCESS);
      script.setAttribute("data-adoption-file-contract", ADOPTION_FILE_CONTRACT);
      script.setAttribute("data-downstream-activation", "false");

      script.onload = function () {
        state.adoption.loading = false;
        state.adoption.loadSucceeded = Boolean(findDatumAdoptionApi());
        state.adoption.loadFailed = !state.adoption.loadSucceeded;

        if (!state.adoption.loadSucceeded) {
          recordAdoptionError("load-adoption-file", "script loaded but datum global was not published");
        }

        resolve(findDatumAdoptionApi());
      };

      script.onerror = function () {
        state.adoption.loading = false;
        state.adoption.loadSucceeded = false;
        state.adoption.loadFailed = true;
        recordAdoptionError("load-adoption-file", "script load failed");
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  function runAdoptionCycle() {
    evaluateDatumAdoption();

    if (!state.adoption.datumAdopted && !findDatumAdoptionApi()) {
      loadDatumAdoptionFileIfMissing().then(function () {
        evaluateDatumAdoption();
      });
    }
  }

  function adoptionStatusPayload() {
    return {
      contract: CONTRACT,
      previousBaseline: PREVIOUS_BASELINE,
      adoptionProcess: ADOPTION_PROCESS,
      adoptionFile: ADOPTION_FILE,
      adoptionFileContract: ADOPTION_FILE_CONTRACT,
      datumApiFound: state.adoption.apiFound,
      apiSource: state.adoption.apiSource,
      datumLoaded: state.adoption.datumLoaded,
      datumLoadAttempted: state.adoption.loadAttempted,
      datumLoadSucceeded: state.adoption.loadSucceeded,
      datumLoadFailed: state.adoption.loadFailed,
      datumAdopted: state.adoption.datumAdopted,
      datumContract: state.adoption.datumContract,
      contractValid: state.adoption.contractValid,
      statusReady: state.adoption.statusReady,
      receiveMapReady: state.adoption.receiveMapReady,
      seatCount: state.adoption.seatCount,
      seatCountValid: state.adoption.seatCountValid,
      newsComplete: state.adoption.newsComplete,
      allSeatsNewsComplete: state.adoption.allSeatsNewsComplete,
      childPacketAvailable: state.adoption.childPacketAvailable,
      childPacketSeatCount: state.adoption.childPacketSeatCount,
      childPacketSeatCountValid: state.adoption.childPacketSeatCountValid,
      downstreamHeld: true,
      terrainReady: false,
      moistureReady: false,
      surfaceReady: false,
      cloudReady: false,
      continentReady: false,
      visualPassClaimed: false,
      failureReason: state.adoption.failureReason,
      checkedAt: state.adoption.checkedAt,
      errors: state.adoption.errors.slice()
    };
  }

  function publishRouteStatus() {
    var payload = {
      contract: CONTRACT,
      previousBaseline: PREVIOUS_BASELINE,
      htmlDiagnosticContract: HTML_DIAGNOSTIC_CONTRACT,
      route: "/showroom/globe/audralia/",
      adoption: adoptionStatusPayload(),
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
      oneLoop: state.oneLoop,
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

    window.AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_STATUS = payload;
    window.AUDRALIA_G1_DATUM_ADOPTION_STATUS = payload.adoption;

    return payload;
  }

  function writeDiagnostics(force) {
    var t = now();
    if (!force && t - state.lastDiagnosticWrite < 1000) return;
    state.lastDiagnosticWrite = t;

    var a = state.adoption;

    setText("[data-audralia-diagnostic-route]", "JS adoption construct · parent baseline protected");
    setText("[data-audralia-diagnostic-carrier]", "spherical carrier active · lattice remains discovery layer");
    setText("[data-audralia-diagnostic-lens]", state.activeLens);
    setText("[data-audralia-diagnostic-canvas]", state.oneCanvas ? "one canvas" : "canvas pending");
    setText("[data-audralia-diagnostic-loop]", state.oneLoop ? "dirty RAF · piston controlled" : "loop pending");
    setText("[data-audralia-diagnostic-children]", "downstream held · adoption only");
    setText("[data-audralia-diagnostic-news]", "NEWS active · parent route protected");
    setText("[data-audralia-diagnostic-scope]", "360 scope · 16 × 16 / 256 seats");

    if (!a.attempted) {
      setText("[data-audralia-diagnostic-datum-child]", "pending adoption");
      setText("[data-audralia-diagnostic-receive-map]", "pending adoption");
      setText("[data-audralia-diagnostic-news-map]", "pending adoption");
      setText("[data-audralia-diagnostic-child-packet]", "pending adoption");
      setText("[data-audralia-diagnostic-seat-count]", "pending adoption");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else if (a.loading) {
      setText("[data-audralia-diagnostic-datum-child]", "loading adoption file");
      setText("[data-audralia-diagnostic-receive-map]", "pending");
      setText("[data-audralia-diagnostic-news-map]", "pending");
      setText("[data-audralia-diagnostic-child-packet]", "pending");
      setText("[data-audralia-diagnostic-seat-count]", "pending");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else if (a.datumAdopted) {
      setText("[data-audralia-diagnostic-datum-child]", "adopted · G1 receive-map authority");
      setText("[data-audralia-diagnostic-receive-map]", "adopted · 256 seats");
      setText("[data-audralia-diagnostic-news-map]", "complete · N/E/W/S");
      setText("[data-audralia-diagnostic-child-packet]", "available · route-diagnostic");
      setText("[data-audralia-diagnostic-seat-count]", "256 / 16 × 16");
      setText("[data-audralia-diagnostic-downstream]", "held · no child activation");
    } else {
      setText("[data-audralia-diagnostic-datum-child]", "failed · " + (a.failureReason || "adoption unavailable"));
      setText("[data-audralia-diagnostic-receive-map]", a.receiveMapReady ? "available · constrained" : "failed · unavailable");
      setText("[data-audralia-diagnostic-news-map]", a.newsComplete && a.allSeatsNewsComplete ? "complete · N/E/W/S" : "failed · NEWS incomplete");
      setText("[data-audralia-diagnostic-child-packet]", a.childPacketAvailable ? "available · constrained" : "failed · unavailable");
      setText("[data-audralia-diagnostic-seat-count]", a.seatCountValid ? "256 / 16 × 16" : "failed · expected 256");
      setText("[data-audralia-diagnostic-downstream]", "held · no activation");
    }

    setDataset("audraliaRouteJsContract", CONTRACT);
    setDataset("audraliaPreviousBaseline", PREVIOUS_BASELINE);
    setDataset("audraliaAdoptionProcess", ADOPTION_PROCESS);
    setDataset("audraliaAdoptionFileContract", ADOPTION_FILE_CONTRACT);
    setDataset("audraliaDatumAdopted", a.datumAdopted);
    setDataset("audraliaDatumApiFound", a.apiFound);
    setDataset("audraliaDatumReceiveMapReady", a.receiveMapReady);
    setDataset("audraliaDatumSeatCountValid", a.seatCountValid);
    setDataset("audraliaDatumNewsComplete", a.newsComplete && a.allSeatsNewsComplete);
    setDataset("audraliaDatumChildPacketAvailable", a.childPacketAvailable);
    setDataset("audraliaDownstreamHeld", true);
  }

  function publishBoot() {
    window.AUDRALIA_G1_DATUM_ADOPTION_ROUTE_JS_BOOT = {
      contract: CONTRACT,
      previousBaseline: PREVIOUS_BASELINE,
      adoptionProcess: ADOPTION_PROCESS,
      adoptionFile: ADOPTION_FILE,
      adoptionFileContract: ADOPTION_FILE_CONTRACT,
      route: "/showroom/globe/audralia/",
      target: "/showroom/globe/audralia/index.js",
      parentBaselineProtected: true,
      datumFileChanged: false,
      datumFileRenewed: false,
      visualLatticeReplacement: false,
      downstreamHeld: true,
      terrainActivated: false,
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
    previousBaseline: PREVIOUS_BASELINE,
    adoptionStatus: adoptionStatusPayload,
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
    runAdoptionCycle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
