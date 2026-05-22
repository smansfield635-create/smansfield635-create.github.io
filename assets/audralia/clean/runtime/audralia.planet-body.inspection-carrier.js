// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_G2_PLANET_BODY_TRUE_CANVAS_GLOBE_CARRIER_ENGINEERING_LENS_TNT_v1
// Full-file replacement.
// Purpose: route-local true canvas Audralia planet body inspection carrier.
// Donor logic: /showroom/globe/audralia/index.js
// Does not own: parent template plate, cockpit route, root Globe route, Runtime / Strength, final visual pass, generated image, GraphicBox, Earth substitution, or Australia drift.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_BODY_TRUE_CANVAS_GLOBE_CARRIER_ENGINEERING_LENS_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PLANET_BODY_TRUE_CANVAS_GLOBE_CARRIER_ENGINEERING_LENS_SPEC_OPS_v1";
  var DONOR_CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1";
  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";

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

  var LENSES = Object.freeze({
    body: {
      key: "body",
      title: "Body View",
      anchor: "North · Datum Body",
      copy: "One coherent Audralia body under true canvas inspection. Drag to inspect the carrier."
    },
    surface: {
      key: "surface",
      title: "Surface View",
      anchor: "Northeast / East · Terrain + Material",
      copy: "Terrain mass and mineral pressure are emphasized inside the same canvas body."
    },
    hydration: {
      key: "hydration",
      title: "Hydration View",
      anchor: "Southeast / South · Ocean + Coast",
      copy: "Ocean depth, basin pressure, shelf edge, and coast logic are emphasized."
    },
    lattice: {
      key: "lattice",
      title: "Lattice View",
      anchor: "West · 16 × 16 / 256",
      copy: "The 256 inspection lattice appears through Engineering only. It does not replace the planet."
    },
    receipt: {
      key: "receipt",
      title: "Receipt View",
      anchor: "Northwest · Inspection Receipt",
      copy: "Route-local proof is shown while Runtime / Strength remains held."
    }
  });

  var SURFACE_POLYGONS = Object.freeze([
    {
      family: "western-mass",
      fill: "rgba(112,126,104,0.90)",
      shelf: "rgba(167,243,198,0.28)",
      points: [[-128, 28],[-112, 43],[-88, 50],[-57, 42],[-41, 25],[-51, 6],[-79, -10],[-111, -5],[-135, 11]]
    },
    {
      family: "northern-highland",
      fill: "rgba(145,143,122,0.84)",
      shelf: "rgba(167,243,198,0.20)",
      points: [[8, 54],[34, 66],[72, 58],[96, 39],[91, 18],[57, 7],[23, 16],[4, 34]]
    },
    {
      family: "central-continent",
      fill: "rgba(76,99,84,0.88)",
      shelf: "rgba(167,243,198,0.24)",
      points: [[-12, 15],[18, 33],[54, 27],[83, 8],[102, -18],[81, -43],[39, -55],[-4, -45],[-31, -20]]
    },
    {
      family: "southern-craton",
      fill: "rgba(99,95,83,0.84)",
      shelf: "rgba(167,243,198,0.18)",
      points: [[-92, -28],[-62, -16],[-31, -26],[-19, -49],[-45, -68],[-80, -63],[-108, -47]]
    },
    {
      family: "eastern-arc",
      fill: "rgba(132,134,113,0.78)",
      shelf: "rgba(167,243,198,0.16)",
      points: [[118, 16],[144, 7],[157, -18],[142, -42],[111, -39],[96, -13]]
    }
  ]);

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

    activeLens: "body",
    seats: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],
    fibonacciReturnLinks: [],
    geometryBuilt: false,

    yaw: -0.62,
    pitch: -0.16,
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
    duplicateCanvasRemoved: 0,
    datasetCache: {},
    errors: []
  };

  if (
    window.__AUDRALIA_G2_TRUE_CANVAS_PLANET_BODY_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_TRUE_CANVAS_PLANET_BODY_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_TRUE_CANVAS_PLANET_BODY_CONTROLLER__.stop();
    } catch (_error) {}
  }

  var abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = abortController ? abortController.signal : undefined;
  var resizeObserver = null;

  function hasDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function routeAllowed() {
    if (!hasDOM()) return false;
    var htmlRoute = document.documentElement.getAttribute("data-route") || "";
    var path = window.location ? window.location.pathname : "";
    return htmlRoute === ROUTE || path === ROUTE;
  }

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
    if (node && node.textContent !== text) node.textContent = text;
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

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || "unknown");
    state.errors.push({ scope: scope, message: message, time: new Date().toISOString() });
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = lonDeg * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var clat = Math.cos(lat);
    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon),
      lon: lon,
      lat: lat
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
        spineLinks.push(link(seat(band, radial), seat(band + 1, radial), "spine", radial % 4 === 0, radial % 2 === 0));
      }
    }

    for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      var offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        var priority = radial % 4 === 0 || band % 4 === 0;

        fibonacciLinks.push(link(seat(band, radial), seat(band + 1, radial + offset), "fibonacci-forward", priority, radial % 2 === 0 || band % 2 === 0));

        if (band % 2 === 0) {
          fibonacciReturnLinks.push(link(seat(band, radial), seat(band + 1, radial - offset), "fibonacci-return", priority, radial % 2 === 0 || band % 2 === 0));
        }
      }
    }

    state.seats = rings.reduce(function (all, ring) { return all.concat(ring); }, []);
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
      centerY: height * 0.43,
      radius: minSide * (width / Math.max(1, state.dpr) < 680 ? 0.36 : 0.39),
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
    ocean.addColorStop(0.00, "rgba(188,244,255,0.96)");
    ocean.addColorStop(0.16, "rgba(70,174,219,0.90)");
    ocean.addColorStop(0.42, "rgba(18,91,162,0.96)");
    ocean.addColorStop(0.70, "rgba(4,36,96,1)");
    ocean.addColorStop(1.00, "rgba(1,8,28,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    ctx.save();
    clipSphere();

    var bandGradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    bandGradient.addColorStop(0.00, "rgba(255,255,255,0.04)");
    bandGradient.addColorStop(0.34, "rgba(255,255,255,0)");
    bandGradient.addColorStop(0.58, "rgba(0,0,0,0.10)");
    bandGradient.addColorStop(1.00, "rgba(0,0,0,0.28)");

    ctx.fillStyle = bandGradient;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    var depth = ctx.createRadialGradient(cx + r * 0.35, cy + r * 0.32, r * 0.10, cx, cy, r * 1.08);
    depth.addColorStop(0.00, "rgba(0,0,0,0)");
    depth.addColorStop(0.50, "rgba(0,0,0,0.10)");
    depth.addColorStop(0.82, "rgba(0,0,0,0.38)");
    depth.addColorStop(1.00, "rgba(0,0,0,0.70)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = depth;
    ctx.fill();

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

  function polygonProjection(points) {
    var projected = [];
    var front = 0;

    for (var i = 0; i < points.length; i += 1) {
      var point = lonLatPoint(points[i][0], points[i][1]);
      var p = projectPoint(point);
      projected.push(p);
      if (p.frontFacing) front += 1;
    }

    return { projected: projected, front: front };
  }

  function drawSurfacePolygon(poly, mode) {
    var ctx = state.ctx;
    var result = polygonProjection(poly.points);
    if (result.front < 2) return;

    ctx.save();
    clipSphere();

    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = poly.fill;
    ctx.globalAlpha = mode === "surface" ? 0.96 : 0.80;
    ctx.fill();

    ctx.lineWidth = Math.max(1, state.dpr * 1.15);
    ctx.strokeStyle = mode === "hydration" ? "rgba(167,243,198,0.42)" : poly.shelf;
    ctx.globalAlpha = mode === "hydration" ? 0.78 : 0.48;
    ctx.stroke();

    ctx.restore();
  }

  function drawSurfaceStrokes(mode) {
    var ctx = state.ctx;
    var paths = [
      [[-120, 33],[-94, 42],[-64, 39],[-48, 22]],
      [[16, 51],[42, 55],[76, 42],[90, 24]],
      [[-5, 9],[30, 18],[66, 5],[92, -24]],
      [[-78, -31],[-54, -41],[-30, -55]],
      [[35, -35],[58, -45],[88, -36]]
    ];

    ctx.save();
    clipSphere();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i = 0; i < paths.length; i += 1) {
      var projected = paths[i].map(function (pair) {
        return projectPoint(lonLatPoint(pair[0], pair[1]));
      });

      if (projected.filter(function (p) { return p.frontFacing; }).length < 2) continue;

      ctx.beginPath();
      for (var j = 0; j < projected.length; j += 1) {
        if (j === 0) ctx.moveTo(projected[j].x, projected[j].y);
        else ctx.lineTo(projected[j].x, projected[j].y);
      }

      ctx.strokeStyle = mode === "surface" ? "rgba(255,244,216,0.30)" : "rgba(255,244,216,0.16)";
      ctx.lineWidth = Math.max(1.2, state.dpr * (mode === "surface" ? 1.8 : 1.2));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawOceanShelves(mode) {
    var ctx = state.ctx;
    var arcs = [
      [[-136, 7],[-111, -5],[-80, -10],[-52, 6],[-40, 22]],
      [[5, 31],[23, 16],[57, 7],[91, 18],[96, 39]],
      [[-31, -20],[-4, -45],[39, -55],[81, -43],[102, -18]],
      [[-108, -47],[-80, -63],[-45, -68],[-19, -49]]
    ];

    ctx.save();
    clipSphere();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i = 0; i < arcs.length; i += 1) {
      var points = arcs[i].map(function (pair) {
        return projectPoint(lonLatPoint(pair[0], pair[1]));
      });

      if (points.filter(function (p) { return p.frontFacing; }).length < 2) continue;

      ctx.beginPath();
      for (var j = 0; j < points.length; j += 1) {
        if (j === 0) ctx.moveTo(points[j].x, points[j].y);
        else ctx.lineTo(points[j].x, points[j].y);
      }

      ctx.strokeStyle = mode === "hydration" ? "rgba(167,243,198,0.44)" : "rgba(167,243,198,0.18)";
      ctx.lineWidth = Math.max(1, state.dpr * (mode === "hydration" ? 2.2 : 1.2));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAudraliaSurface() {
    var lens = state.activeLens;

    for (var i = 0; i < SURFACE_POLYGONS.length; i += 1) {
      drawSurfacePolygon(SURFACE_POLYGONS[i], lens);
    }

    drawOceanShelves(lens);
    drawSurfaceStrokes(lens);
  }

  function drawReferenceLines() {
    if (state.activeLens !== "body" && state.activeLens !== "surface" && state.activeLens !== "hydration") return;

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
    strokeLine(equator, "rgba(244,207,131,0.22)", Math.max(0.6, state.dpr * 0.55));
    strokeLine(meridian, "rgba(141,216,255,0.14)", Math.max(0.5, state.dpr * 0.45));
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

  function drawReceiptOverlay() {
    if (state.activeLens !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var w = Math.min(state.width * 0.62, m.radius * 1.58);
    var h = Math.min(state.height * 0.25, m.radius * 0.62);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.62)";
    ctx.strokeStyle = "rgba(244,207,131,0.38)";
    ctx.lineWidth = Math.max(1, state.dpr);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 24 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(16, 18 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,207,131,0.92)";
    ctx.fillText("TRUE CANVAS CARRIER", m.centerX, y + h * 0.34);

    ctx.font = "900 " + Math.max(12, 13 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.82)";
    ctx.fillText("RUNTIME / STRENGTH HELD", m.centerX, y + h * 0.58);

    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText("NO FINAL VISUAL PASS CLAIM", m.centerX, y + h * 0.75);
    ctx.restore();
  }

  function drawFrame(timestamp) {
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
    drawAudraliaSurface();
    drawReferenceLines();

    if (state.activeLens === "lattice") {
      drawDiagnosticLattice(state.pointerActive);
    } else if (state.activeLens === "receipt") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.16;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.08;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    }

    drawReceiptOverlay();

    state.renderCount += 1;

    publishStatus(false);

    if (state.settleFrames > 0) state.settleFrames -= 1;

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(drawFrame);
    }
  }

  function requestRender(settleFrames) {
    if (settleFrames) state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) state.raf = window.requestAnimationFrame(drawFrame);
  }

  function setLens(nextLens) {
    var lens = Object.prototype.hasOwnProperty.call(LENSES, nextLens) ? nextLens : "body";
    state.activeLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-planet-lens]")).forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaPlanetLens === lens ? "true" : "false");
    });

    setText("[data-audralia-planet-lens-anchor]", LENSES[lens].anchor);
    setText("[data-audralia-planet-lens-title]", LENSES[lens].title);
    setText("[data-audralia-planet-lens-copy]", LENSES[lens].copy);
    setText("[data-audralia-planet-carrier-status]", "true canvas carrier · " + LENSES[lens].title);
    setText("[data-audralia-planet-carrier-proof]", "one canvas · donor mechanics adopted · SVG/cartoon carrier retired · Engineering controls below stage");

    setDataset("audraliaPlanetActiveLens", lens);
    publishStatus(true);
    requestRender(lens === "body" ? 6 : 12);
  }

  function bindLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-planet-lens]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaPlanetLens);
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
    state.yaw = -0.62;
    state.pitch = -0.16;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender(10);
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
      publishStatus(true);
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
    state.canvas.setAttribute("data-audralia-g2-true-canvas-planet", CONTRACT);
    state.canvas.setAttribute("data-donor-contract", DONOR_CONTRACT);
    state.canvas.setAttribute("data-svg-cartoon-carrier-retired", "true");
    state.canvas.setAttribute("data-engineering-controls-below-stage", "true");
    state.canvas.setAttribute("data-runtime-strength-held", "true");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");

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

  function receipt() {
    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      donorContract: DONOR_CONTRACT,
      route: ROUTE,
      target: FILE,
      trueCanvasCarrier: true,
      oneCanvas: state.oneCanvas,
      svgCartoonCarrierRetired: true,
      engineeringControlsBelowStage: true,
      dragRotation: state.onePointerPath,
      activeLens: state.activeLens,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,
      templatePlateUntouched: true,
      cockpitUntouched: true,
      rootGlobeUntouched: true,
      runtimeStrengthHeld: true,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,
      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PLANET_BODY_TRUE_CANVAS_GLOBE_CARRIER_ENGINEERING_LENS_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_G2_PLANET_BODY_TRUE_CANVAS_GLOBE_CARRIER_ENGINEERING_LENS_STATUS = payload;
    window.AUDRALIA_G2_TRUE_CANVAS_PLANET_BODY_STATUS = payload;

    setDataset("audraliaPlanetTrueCanvasCarrier", true);
    setDataset("audraliaPlanetSvgCartoonCarrierRetired", true);
    setDataset("audraliaPlanetEngineeringControlsBelowStage", true);
    setDataset("audraliaPlanetRuntimeStrengthHeld", true);
    setDataset("audraliaPlanetFinalVisualPassClaim", false);
    setDataset("audraliaPlanetActiveLens", state.activeLens);

    if (force) {
      setText("[data-audralia-planet-carrier-status]", "true canvas carrier · " + LENSES[state.activeLens].title);
      setText("[data-audralia-planet-carrier-proof]", "one canvas · drag rotation · donor projection mechanics · Engineering below stage");
    }

    return payload;
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

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");
    state.details = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Missing Audralia planet inspection stage or mount");
      return;
    }

    enforceOneCanvas();
    buildLocalDiagnosticGeometry();
    setupResize();
    bindLensControls();
    bindPointer();
    setLens("body");
    publishStatus(true);
    requestRender(12);
  }

  window.__AUDRALIA_G2_TRUE_CANVAS_PLANET_BODY_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    donorContract: DONOR_CONTRACT,
    receipt: receipt,
    status: publishStatus
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
