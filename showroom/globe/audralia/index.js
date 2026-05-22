// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1
//
// Purpose:
// - Restore Audralia's Generation One observable spherical globe baseline.
// - Keep the globe as the observable organic carrier.
// - Keep the diamond lattice as scientific discovery / diagnostic rule layer.
// - Preserve NEWS protocol: North, East, West, South.
// - Deliver a 360-degree diagnostic scope without downstream child math.
// - No runtime rewrite. No child files. No continents. No clouds. No surface maturity claim. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G1_BASELINE_360_DIAGNOSTIC_SCOPE_PAIR_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_HTML_JS_PAIR_NEWS_DIAMOND_LATTICE_RUNTIME_ALIGNMENT_TNT_v1";

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
      copy: "Planet View restores the observable globe carrier. The diamond lattice remains under the surface as a rule and discovery layer, not as the body shape."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 diagnostic scope · diamond lattice as rule layer",
      copy: "Lattice View wraps the spherical carrier with a diagnostic scope. It reveals the NEWS and Fibonacci rule system without replacing the globe."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → G1 carrier, NEWS, 256 seats, downstream held",
      copy: "Diagnostic Scope reports the baseline proof: spherical carrier, 360 lattice, NEWS completion duties, child math held, and downstream blocked."
    }
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    cachedDetails: [],

    width: 0,
    height: 0,
    dpr: 1,
    stageRect: null,

    activeLens: "planet",
    seats: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],
    fibonacciReturnLinks: [],
    allLinks: [],

    geometryBuilt: false,
    oneCanvas: false,
    oneLoop: false,
    pointerBound: false,

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

    datasetCache: {},
    lastDiagnosticAt: 0,
    duplicateCanvasRemoved: 0,
    errorCount: 0,
    lastError: ""
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
    return Number.isFinite(number) ? number : (fallback || 0);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function setDataset(key, value) {
    var next = String(value);
    if (state.datasetCache[key] === next) return;

    state.datasetCache[key] = next;

    try {
      document.documentElement.dataset[key] = next;
      if (document.body) document.body.dataset[key] = next;
    } catch (_error) {}
  }

  function recordError(scope, error) {
    state.errorCount += 1;
    state.lastError = scope + ": " + (error && error.message ? error.message : String(error || "unknown"));

    window.AUDRALIA_G1_360_DIAGNOSTIC_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: state.lastError,
      errorCount: state.errorCount,
      time: new Date().toISOString()
    };
  }

  function closeCachedMenus() {
    for (var i = 0; i < state.cachedDetails.length; i += 1) {
      try {
        state.cachedDetails[i].open = false;
      } catch (_error) {}
    }
  }

  function newsForSeat(band, radial) {
    return {
      north: {
        defined: true,
        role: "origin/pole/axis/predecessor-authority",
        predecessorBand: band > 0 ? band - 1 : "north-pole-boundary"
      },
      east: {
        defined: true,
        role: "formation/successor-expression",
        successorRadial: (radial + 1) % RADIAL_NODES
      },
      west: {
        defined: true,
        role: "correction/memory/opposite-relation",
        oppositeRadial: (radial + RADIAL_NODES / 2) % RADIAL_NODES
      },
      south: {
        defined: true,
        role: "completion/grounding/render-eligibility",
        successorBand: band < FIBONACCI_BANDS - 1 ? band + 1 : "south-pole-boundary"
      },
      complete: true,
      renderEligible: true,
      routeOwnsFinalNewsMath: false
    };
  }

  function createSeat(band, radial) {
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
      poleRelation: band < 2 ? "north" : band > 13 ? "south" : "field",
      hemisphere: lat >= 0 ? "north" : "south",
      equatorRelation: Math.abs(lat) < 0.16 ? "equator" : "off-equator",
      news: newsForSeat(band, radial)
    });
  }

  function buildGeometry() {
    var rings = [];

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      var ring = [];

      for (var radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(createSeat(band, radial));
      }

      rings.push(Object.freeze(ring));
    }

    function seat(band, radial) {
      return rings[band][((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    var ringLinks = [];
    var spineLinks = [];
    var fibonacciLinks = [];
    var fibonacciReturnLinks = [];

    function makeLink(a, b, family, major, secondary) {
      return {
        a: a,
        b: b,
        family: family,
        major: Boolean(major),
        secondary: Boolean(secondary),
        newsContinuity: true,
        renderEligible: true
      };
    }

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        var a = seat(band, radial);
        var b = seat(band, radial + 1);

        ringLinks.push(makeLink(
          a,
          b,
          "ring",
          band % 4 === 0 || radial % 4 === 0,
          band % 2 === 0 || radial % 2 === 0
        ));
      }
    }

    for (radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        a = seat(band, radial);
        b = seat(band + 1, radial);

        spineLinks.push(makeLink(
          a,
          b,
          "spine",
          radial % 4 === 0,
          radial % 2 === 0
        ));
      }
    }

    for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      var offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        a = seat(band, radial);
        b = seat(band + 1, radial + offset);
        var c = seat(band + 1, radial - offset);
        var priority = radial % 4 === 0 || band % 4 === 0;

        fibonacciLinks.push(makeLink(a, b, "fibonacci-forward", priority, radial % 2 === 0 || band % 2 === 0));

        if (band % 2 === 0) {
          fibonacciReturnLinks.push(makeLink(a, c, "fibonacci-return", priority, radial % 2 === 0 || band % 2 === 0));
        }
      }
    }

    state.seats = rings.reduce(function (out, ring) {
      return out.concat(ring);
    }, []);
    state.ringLinks = ringLinks;
    state.spineLinks = spineLinks;
    state.fibonacciLinks = fibonacciLinks;
    state.fibonacciReturnLinks = fibonacciReturnLinks;
    state.allLinks = ringLinks.concat(spineLinks, fibonacciReturnLinks, fibonacciLinks);
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
      width: width,
      height: height,
      centerX: width / 2,
      centerY: height * 0.42,
      radius: minSide * (width / Math.max(1, state.dpr) < 680 ? 0.345 : 0.365),
      cameraDistance: 3.9
    };
  }

  function projectSeat(seat) {
    var m = metrics();
    var rotated = rotatePoint(seat);
    var perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - rotated.z);

    return {
      x: m.centerX + rotated.x * m.radius * perspective,
      y: m.centerY - rotated.y * m.radius * perspective,
      z: rotated.z,
      perspective: perspective,
      frontFacing: rotated.z >= -0.05,
      seat: seat
    };
  }

  function clear() {
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.002, 0, TAU);
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

  function drawAxisAndEquator() {
    var ctx = state.ctx;
    var m = metrics();

    function drawPolyline(points, stroke, width, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.beginPath();

      for (var i = 0; i < points.length; i += 1) {
        var p = projectSeat(points[i]);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
      ctx.restore();
    }

    var equator = [];
    var meridian = [];

    for (var i = 0; i <= 96; i += 1) {
      var lon = -Math.PI + (i / 96) * TAU;
      equator.push({ x: Math.cos(lon), y: 0, z: Math.sin(lon) });
    }

    for (i = 0; i <= 96; i += 1) {
      var lat = -HALF_PI + (i / 96) * Math.PI;
      meridian.push({ x: Math.cos(lat), y: Math.sin(lat), z: 0 });
    }

    ctx.save();
    clipSphere();
    drawPolyline(equator, "rgba(244,207,131,0.44)", Math.max(0.8, state.dpr * 0.75), 1);
    drawPolyline(meridian, "rgba(141,216,255,0.24)", Math.max(0.65, state.dpr * 0.55), 1);
    ctx.restore();

    var north = projectSeat({ x: 0, y: 1, z: 0 });
    var south = projectSeat({ x: 0, y: -1, z: 0 });

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 10 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,207,131,0.86)";
    ctx.fillText("N", north.x, north.y - m.radius * 0.035);
    ctx.fillText("S", south.x, south.y + m.radius * 0.035);
    ctx.restore();
  }

  function linkColor(link, projectedA, projectedB) {
    var front = projectedA.frontFacing || projectedB.frontFacing;
    var z = (projectedA.z + projectedB.z) / 2;

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

  function drawLinkSet(links, reduced) {
    var ctx = state.ctx;

    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];

      if (reduced && !link.major && link.family.indexOf("fibonacci") >= 0) continue;

      var a = projectSeat(link.a);
      var b = projectSeat(link.b);

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

      var p = projectSeat(seat);
      var major = seat.major;
      var alpha = p.frontFacing ? (major ? 0.84 : 0.58) : (major ? 0.18 : 0.08);
      var radius = major ? 2.35 : seat.secondary ? 1.55 : 1.18;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, radius * state.dpr * p.perspective), 0, TAU);
      ctx.fillStyle = major
        ? "rgba(244,207,131," + alpha.toFixed(3) + ")"
        : "rgba(141,216,255," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  function drawDiagnosticLattice(reduced) {
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    drawLinkSet(state.ringLinks, reduced);
    drawLinkSet(state.spineLinks, reduced);
    if (!reduced) drawLinkSet(state.fibonacciReturnLinks, false);
    drawLinkSet(state.fibonacciLinks, reduced);
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

    clear();
    drawCarrier();
    drawAxisAndEquator();

    if (state.activeLens === "lattice" || state.activeLens === "diagnostic") {
      drawDiagnosticLattice(state.pointerActive);
    } else {
      var ctx = state.ctx;
      ctx.save();
      ctx.globalAlpha = 0.18;
      drawDiagnosticLattice(true);
      ctx.restore();
    }

    state.renderCount += 1;
    state.oneLoop = true;

    if (state.settleFrames > 0) state.settleFrames -= 1;

    window.AUDRALIA_G1_360_DIAGNOSTIC_STATE = compactStatus();

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(reason, settleFrames) {
    if (settleFrames) state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function setLens(nextLens) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, nextLens) ? nextLens : "planet";
    closeCachedMenus();
    state.activeLens = lens;

    document.documentElement.dataset.audraliaActiveLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaLensButton === lens ? "true" : "false");
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    updateDiagnostics(true);
    requestRender("lens-switch", lens === "planet" ? 4 : 10);
  }

  function bindLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      }, signal ? { signal: signal } : false);
    });
  }

  function pointerPoint(event) {
    var rect = state.stageRect;
    if (!rect) return { x: event.clientX, y: event.clientY };

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      closeCachedMenus();

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

      requestRender("pointer-down", 4);
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

      requestRender("pointer-move", 2);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    function release(event) {
      if (!state.pointerActive) return;

      state.pointerActive = false;

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;

      updateDiagnostics(true);
      requestRender("pointer-release", 16);
      event.preventDefault();
    }

    state.stage.addEventListener("pointerup", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal: signal, passive: false } : { passive: false });

    state.pointerBound = true;
  }

  function resetCarrier() {
    state.yaw = -0.54;
    state.pitch = -0.18;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender("reset", 8);
  }

  function enforceOneCanvas(reason) {
    if (!state.mount) return;

    var canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));
    var selected = state.canvas && state.mount.contains(state.canvas) ? state.canvas : null;

    if (!selected) {
      selected = canvases.find(function (canvas) {
        return canvas.getAttribute("data-audralia-g1-diagnostic-canvas") === CONTRACT;
      }) || canvases[0] || document.createElement("canvas");
    }

    if (!state.mount.contains(selected)) {
      selected.setAttribute("data-audralia-g1-diagnostic-canvas", CONTRACT);
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
    state.canvas.setAttribute("data-globe-role", "observable-organic-carrier");
    state.canvas.setAttribute("data-diamond-lattice-role", "scientific-discovery-rule-layer");
    state.canvas.setAttribute("data-news-protocol-active", "true");

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

  function updateDimensionsFromRect(rect) {
    if (!rect || !state.canvas || !state.ctx) return false;

    var dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(520, Math.floor(rect.height * dpr));

    state.stageRect = {
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

    requestRender("dimension-update", 6);
    return true;
  }

  function measureStageOnce() {
    if (!state.stage) return false;
    return updateDimensionsFromRect(state.stage.getBoundingClientRect());
  }

  function setupResizeHandling() {
    measureStageOnce();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      resizeObserver = new ResizeObserver(function (entries) {
        if (!entries || !entries[0]) return;

        var content = entries[0].contentRect;
        var box = state.stage.getBoundingClientRect();

        updateDimensionsFromRect({
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
      measureStageOnce();
      requestRender("window-resize", 6);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStageOnce();
        requestRender("orientationchange", 6);
      }, 120);
    }, signal ? { signal: signal, passive: true } : { passive: true });
  }

  function compactStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      activeLens: state.activeLens,
      htmlOwns: "public-visual-expression",
      jsOwns: "under-hood-mathematics-and-construct-delivery",
      globeRole: "observable-organic-carrier",
      diamondLatticeRole: "scientific-discovery-rule-layer",
      diamondLatticeIsPlanetBody: false,
      newsProtocolActive: true,
      northDefined: true,
      eastDefined: true,
      westDefined: true,
      southDefined: true,
      cellRenderEligibilityDefined: true,
      diagnosticScope360Degrees: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,
      oneCanvas: state.oneCanvas,
      oneLoop: state.oneLoop,
      pointerBound: state.pointerBound,
      pointerActive: state.pointerActive,
      downstreamHeld: true,
      noChildMath: true,
      noVisualPassClaim: true,
      renderCount: state.renderCount,
      errorCount: state.errorCount
    };
  }

  function updateDiagnostics(force) {
    var time = now();

    if (state.pointerActive && !force) return;
    if (!force && time - state.lastDiagnosticAt < 1000) return;

    state.lastDiagnosticAt = time;

    var status = compactStatus();

    setText("[data-audralia-diagnostic-route]", "HTML public expression · JS construct delivery");
    setText("[data-audralia-diagnostic-carrier]", "spherical carrier active · lattice is discovery layer");
    setText("[data-audralia-diagnostic-lens]", status.activeLens);
    setText("[data-audralia-diagnostic-canvas]", status.oneCanvas ? "one canvas" : "canvas pending");
    setText("[data-audralia-diagnostic-loop]", status.oneLoop ? "dirty RAF · piston controlled" : "loop pending");
    setText("[data-audralia-diagnostic-children]", "downstream held · no child math");
    setText("[data-audralia-diagnostic-news]", "NEWS active · N/E/W/S complete");
    setText("[data-audralia-diagnostic-scope]", "360 scope · 16 × 16 / 256 seats");

    setDataset("audraliaG1DiagnosticContract", CONTRACT);
    setDataset("audraliaGlobeRole", "observable-organic-carrier");
    setDataset("audraliaDiamondLatticeRole", "scientific-discovery-rule-layer");
    setDataset("audraliaDiamondLatticeIsPlanetBody", false);
    setDataset("audraliaNewsProtocolActive", true);
    setDataset("audraliaDiagnosticScope360Degrees", true);
    setDataset("audraliaDownstreamHeld", true);

    window.AUDRALIA_G1_360_DIAGNOSTIC_STATUS = status;
  }

  function publishBoot() {
    window.AUDRALIA_G1_360_DIAGNOSTIC_BOOT = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: "/showroom/globe/audralia/",
      html: "/showroom/globe/audralia/index.html",
      js: "/showroom/globe/audralia/index.js",
      htmlOwns: "public-visual-expression",
      jsOwns: "under-hood-mathematics-and-construct-delivery",
      globeRole: "observable-organic-carrier",
      diamondLatticeRole: "scientific-discovery-rule-layer",
      diamondLatticeIsPlanetBody: false,
      newsProtocolActive: true,
      northDefined: true,
      eastDefined: true,
      westDefined: true,
      southDefined: true,
      diagnosticScope360Degrees: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      downstreamHeld: true,
      noChildMath: true,
      noRuntimeRewrite: true,
      noVisualPassClaim: true,
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
      } catch (_error) {}
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch (_error) {}
    }
  }

  window.__AUDRALIA_G1_360_DIAGNOSTIC_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT
  };

  function init() {
    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");
    state.cachedDetails = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      return;
    }

    enforceOneCanvas("boot");
    buildGeometry();
    setupResizeHandling();
    bindLensControls();
    bindPointer();
    setLens("planet");
    publishBoot();
    updateDiagnostics(true);
    requestRender("boot", 8);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
