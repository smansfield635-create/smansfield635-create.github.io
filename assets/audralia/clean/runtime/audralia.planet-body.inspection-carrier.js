// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_MATERIAL_REFINEMENT_JS_TNT_v1
// Full-file replacement.
// Scope: JS-only material refinement for the clean Audralia planet inspection carrier.
// HTML is protected and must remain untouched.
// Runtime / Strength remains held. No final visual pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_MATERIAL_REFINEMENT_JS_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_JS_FEMALE_FIRST_HTML_MALE_SECOND_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_MATERIAL_REFINEMENT_JS_SPEC_OPS_v1";
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
      title: "Body View",
      anchor: "North · Datum Body",
      copy: "Clean planet-body inspection. Audralia is shown as a larger, deeper canvas body; Runtime / Strength remains held."
    },
    surface: {
      title: "Surface View",
      anchor: "Northeast / East · Terrain + Material",
      copy: "Surface view emphasizes terrain pressure, mineral grain, and irregular coast formation without replacing the planet."
    },
    hydration: {
      title: "Hydration View",
      anchor: "Southeast / South · Ocean + Coast",
      copy: "Hydration view emphasizes deeper basins, coast shelves, bays, channels, and ocean-edge pressure."
    },
    lattice: {
      title: "Lattice View",
      anchor: "West · 16 × 16 / 256",
      copy: "Lattice view reveals the 256 inspection field through Engineering only. Body View keeps the lattice suppressed."
    },
    receipt: {
      title: "Receipt View",
      anchor: "Northwest · Inspection Receipt",
      copy: "Receipt view confirms JS-only material refinement, HTML untouched, clean inspection preserved, and Runtime / Strength held."
    }
  });

  var SURFACE_POLYGONS = Object.freeze([
    {
      name: "far-west craton shelf",
      fill: "rgba(88,105,83,0.72)",
      edge: "rgba(181,205,166,0.22)",
      points: [
        [-146, 26], [-138, 34], [-124, 43], [-106, 49], [-87, 47],
        [-72, 41], [-57, 33], [-43, 22], [-39, 10], [-48, -1],
        [-65, -9], [-88, -13], [-111, -8], [-132, 3], [-148, 16]
      ]
    },
    {
      name: "north crown highland",
      fill: "rgba(116,118,96,0.66)",
      edge: "rgba(211,206,156,0.18)",
      points: [
        [-10, 54], [4, 62], [22, 68], [43, 67], [63, 62],
        [82, 54], [99, 42], [105, 29], [98, 17], [78, 9],
        [54, 8], [31, 14], [12, 24], [-1, 38]
      ]
    },
    {
      name: "central basin continent",
      fill: "rgba(67,91,75,0.70)",
      edge: "rgba(165,217,178,0.24)",
      points: [
        [-24, 16], [-10, 28], [12, 36], [37, 35], [61, 27],
        [82, 14], [101, -3], [111, -20], [104, -34], [84, -45],
        [58, -53], [31, -55], [7, -49], [-14, -38], [-29, -23],
        [-34, -5]
      ]
    },
    {
      name: "southwest pressure shelf",
      fill: "rgba(81,76,65,0.64)",
      edge: "rgba(196,171,130,0.16)",
      points: [
        [-116, -32], [-99, -23], [-80, -18], [-61, -20], [-43, -29],
        [-31, -43], [-28, -57], [-43, -67], [-64, -70], [-86, -63],
        [-105, -51], [-119, -42]
      ]
    },
    {
      name: "southeast arc mass",
      fill: "rgba(95,103,82,0.62)",
      edge: "rgba(165,217,178,0.15)",
      points: [
        [102, 15], [119, 19], [137, 13], [151, 2], [159, -14],
        [154, -30], [138, -42], [116, -43], [98, -32], [90, -15],
        [93, 2]
      ]
    },
    {
      name: "near-polar fractured cap",
      fill: "rgba(118,126,111,0.46)",
      edge: "rgba(207,229,209,0.10)",
      points: [
        [-172, 70], [-138, 76], [-94, 78], [-45, 75], [1, 72],
        [38, 68], [8, 61], [-38, 58], [-88, 60], [-135, 64]
      ]
    }
  ]);

  var ISLAND_CHAINS = Object.freeze([
    [[-154, -3], [-148, -6], [-141, -8], [-134, -11]],
    [[-20, -58], [-9, -61], [3, -63], [15, -62]],
    [[118, -49], [130, -53], [143, -55], [155, -51]],
    [[84, 38], [96, 42], [109, 40], [121, 35]],
    [[-74, 8], [-64, 3], [-55, 0], [-46, -4]]
  ]);

  var COAST_SHELVES = Object.freeze([
    [[-149, 15], [-132, 3], [-111, -8], [-88, -13], [-65, -9], [-48, -1], [-39, 10]],
    [[-1, 38], [12, 24], [31, 14], [54, 8], [78, 9], [98, 17], [105, 29]],
    [[-34, -5], [-29, -23], [-14, -38], [7, -49], [31, -55], [58, -53], [84, -45], [104, -34]],
    [[-119, -42], [-105, -51], [-86, -63], [-64, -70], [-43, -67], [-28, -57]],
    [[90, -15], [98, -32], [116, -43], [138, -42], [154, -30], [159, -14]]
  ]);

  var MINERAL_STROKES = Object.freeze([
    [[-128, 34], [-103, 41], [-79, 39], [-58, 29]],
    [[-96, 12], [-72, 5], [-48, 10], [-29, 20]],
    [[8, 25], [32, 20], [58, 9], [82, -8]],
    [[12, -38], [34, -43], [59, -39], [82, -28]],
    [[-91, -33], [-70, -42], [-47, -49]],
    [[29, 56], [51, 51], [77, 39]],
    [[112, 7], [136, -6], [146, -24]]
  ]);

  var BASIN_BANDS = Object.freeze([
    [[-160, -18], [-126, -21], [-92, -24], [-58, -23], [-24, -18]],
    [[-38, 4], [-5, 0], [29, -5], [62, -14], [96, -26]],
    [[-154, 48], [-119, 52], [-82, 53], [-44, 49], [-8, 41]],
    [[38, 47], [70, 39], [99, 25], [124, 8], [146, -12]]
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
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop();
    } catch (_error) {}
  }

  var abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = abortController ? abortController.signal : undefined;
  var resizeObserver = null;

  function hasDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function normalizeRoute(value) {
    var text = String(value || "");
    if (!text) return "";
    return text.endsWith("/") ? text : text + "/";
  }

  function routeAllowed() {
    if (!hasDOM()) return false;
    var htmlRoute = normalizeRoute(document.documentElement.getAttribute("data-route") || "");
    var path = normalizeRoute(window.location ? window.location.pathname : "");
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
    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });
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
    var cssWidth = width / Math.max(1, state.dpr);

    return {
      centerX: width / 2,
      centerY: height * 0.395,
      radius: minSide * (cssWidth < 680 ? 0.405 : 0.435),
      cameraDistance: 3.92
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

  function roundedRect(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawCarrier() {
    var ctx = state.ctx;
    var m = metrics();
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var ocean = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, 0, cx, cy, r * 1.22);
    ocean.addColorStop(0.00, "rgba(171,235,246,0.92)");
    ocean.addColorStop(0.12, "rgba(55,145,196,0.88)");
    ocean.addColorStop(0.34, "rgba(13,75,143,0.98)");
    ocean.addColorStop(0.66, "rgba(4,30,88,1)");
    ocean.addColorStop(1.00, "rgba(1,7,25,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    ctx.save();
    clipSphere();

    var basin = ctx.createLinearGradient(cx - r, cy + r * 0.2, cx + r, cy - r * 0.1);
    basin.addColorStop(0.00, "rgba(0,12,38,0.34)");
    basin.addColorStop(0.30, "rgba(0,25,73,0.08)");
    basin.addColorStop(0.52, "rgba(34,149,198,0.05)");
    basin.addColorStop(0.76, "rgba(0,18,58,0.16)");
    basin.addColorStop(1.00, "rgba(0,7,22,0.40)");

    ctx.fillStyle = basin;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    var directional = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    directional.addColorStop(0.00, "rgba(255,255,255,0.040)");
    directional.addColorStop(0.26, "rgba(255,255,255,0.010)");
    directional.addColorStop(0.56, "rgba(0,0,0,0.11)");
    directional.addColorStop(1.00, "rgba(0,0,0,0.34)");

    ctx.fillStyle = directional;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    var depth = ctx.createRadialGradient(cx + r * 0.36, cy + r * 0.33, r * 0.08, cx, cy, r * 1.10);
    depth.addColorStop(0.00, "rgba(0,0,0,0)");
    depth.addColorStop(0.48, "rgba(0,0,0,0.12)");
    depth.addColorStop(0.80, "rgba(0,0,0,0.42)");
    depth.addColorStop(1.00, "rgba(0,0,0,0.76)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = depth;
    ctx.fill();

    var atmosphere = ctx.createRadialGradient(cx, cy, r * 0.94, cx, cy, r * 1.075);
    atmosphere.addColorStop(0.00, "rgba(141,216,255,0)");
    atmosphere.addColorStop(0.72, "rgba(141,216,255,0.025)");
    atmosphere.addColorStop(0.92, "rgba(141,216,255,0.105)");
    atmosphere.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.08, 0, TAU);
    ctx.fillStyle = atmosphere;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.001, 0, TAU);
    ctx.strokeStyle = "rgba(170,226,255,0.125)";
    ctx.lineWidth = Math.max(0.65, state.dpr * 0.62);
    ctx.stroke();

    ctx.restore();
  }

  function polygonProjection(points) {
    var projected = [];
    var front = 0;

    for (var i = 0; i < points.length; i += 1) {
      var p = projectPoint(lonLatPoint(points[i][0], points[i][1]));
      projected.push(p);
      if (p.frontFacing) front += 1;
    }

    return { projected: projected, front: front };
  }

  function drawSurfacePolygon(poly) {
    var ctx = state.ctx;
    var result = polygonProjection(poly.points);
    if (result.front < 2) return;

    var surfaceBoost = state.activeLens === "surface";
    var hydrationBoost = state.activeLens === "hydration";

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
    ctx.globalAlpha = surfaceBoost ? 0.92 : 0.66;
    ctx.fill();

    ctx.strokeStyle = hydrationBoost ? "rgba(167,243,198,0.40)" : poly.edge;
    ctx.lineWidth = Math.max(0.85, state.dpr * (hydrationBoost ? 1.45 : 0.82));
    ctx.globalAlpha = hydrationBoost ? 0.68 : surfaceBoost ? 0.46 : 0.28;
    ctx.stroke();

    ctx.restore();
  }

  function drawProjectedPath(points, stroke, width, alpha) {
    var ctx = state.ctx;
    var projected = points.map(function (pair) {
      return projectPoint(lonLatPoint(pair[0], pair[1]));
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 2) return;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      if (i === 0) ctx.moveTo(projected[i].x, projected[i].y);
      else ctx.lineTo(projected[i].x, projected[i].y);
    }

    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawIslandChain(points, alpha) {
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < points.length; i += 1) {
      var p = projectPoint(lonLatPoint(points[i][0], points[i][1]));
      if (!p.frontFacing) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, state.dpr * 1.6 * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(130,137,105," + alpha.toFixed(3) + ")";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.2, state.dpr * 2.5 * p.perspective), 0, TAU);
      ctx.strokeStyle = "rgba(167,243,198," + (alpha * 0.45).toFixed(3) + ")";
      ctx.lineWidth = Math.max(0.5, state.dpr * 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAudraliaSurface() {
    var i;
    var hydration = state.activeLens === "hydration";
    var surface = state.activeLens === "surface";
    var body = state.activeLens === "body";

    for (i = 0; i < SURFACE_POLYGONS.length; i += 1) {
      drawSurfacePolygon(SURFACE_POLYGONS[i]);
    }

    for (i = 0; i < COAST_SHELVES.length; i += 1) {
      drawProjectedPath(
        COAST_SHELVES[i],
        hydration ? "rgba(167,243,198,0.42)" : "rgba(167,243,198,0.15)",
        Math.max(0.75, state.dpr * (hydration ? 1.75 : 0.85)),
        hydration ? 0.78 : body ? 0.20 : 0.38
      );
    }

    for (i = 0; i < BASIN_BANDS.length; i += 1) {
      drawProjectedPath(
        BASIN_BANDS[i],
        hydration ? "rgba(95,202,236,0.28)" : "rgba(95,202,236,0.10)",
        Math.max(0.65, state.dpr * (hydration ? 1.25 : 0.65)),
        hydration ? 0.64 : body ? 0.10 : 0.22
      );
    }

    for (i = 0; i < MINERAL_STROKES.length; i += 1) {
      drawProjectedPath(
        MINERAL_STROKES[i],
        surface ? "rgba(255,244,216,0.24)" : "rgba(255,244,216,0.075)",
        Math.max(0.75, state.dpr * (surface ? 1.25 : 0.65)),
        surface ? 0.70 : body ? 0.12 : 0.28
      );
    }

    for (i = 0; i < ISLAND_CHAINS.length; i += 1) {
      drawIslandChain(ISLAND_CHAINS[i], hydration ? 0.48 : surface ? 0.38 : 0.22);
    }
  }

  function drawReferenceLines() {
    if (state.activeLens === "receipt") return;

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
    ctx.globalAlpha = state.activeLens === "body" ? 0.12 : 0.48;
    strokeLine(equator, "rgba(244,207,131,0.16)", Math.max(0.45, state.dpr * 0.38));
    strokeLine(meridian, "rgba(141,216,255,0.09)", Math.max(0.38, state.dpr * 0.32));
    ctx.restore();
  }

  function linkColor(link, a, b) {
    var front = a.frontFacing || b.frontFacing;
    var z = (a.z + b.z) / 2;

    if (link.family === "fibonacci-forward") {
      return front
        ? "rgba(244,207,131," + clamp(0.42 + z * 0.12, 0.24, 0.70).toFixed(3) + ")"
        : "rgba(244,207,131,0.08)";
    }

    if (link.family === "fibonacci-return") {
      return front
        ? "rgba(184,238,255," + clamp(0.17 + z * 0.08, 0.10, 0.32).toFixed(3) + ")"
        : "rgba(184,238,255,0.05)";
    }

    if (link.major) {
      return front
        ? "rgba(244,207,131," + clamp(0.40 + z * 0.10, 0.22, 0.64).toFixed(3) + ")"
        : "rgba(244,207,131,0.08)";
    }

    return front
      ? "rgba(112,199,255," + clamp(0.20 + z * 0.08, 0.10, 0.36).toFixed(3) + ")"
      : "rgba(112,199,255,0.045)";
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
      ctx.lineWidth = link.major ? Math.max(0.65, state.dpr * 0.66) : Math.max(0.34, state.dpr * 0.36);
      ctx.stroke();
    }
  }

  function drawSeats(reduced) {
    var ctx = state.ctx;

    for (var i = 0; i < state.seats.length; i += 1) {
      var seat = state.seats[i];

      if (reduced && !seat.major) continue;

      var p = projectPoint(seat);
      var alpha = p.frontFacing ? (seat.major ? 0.74 : 0.46) : (seat.major ? 0.12 : 0.04);
      var radius = seat.major ? 1.85 : seat.secondary ? 1.25 : 0.95;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, radius * state.dpr * p.perspective), 0, TAU);
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
    var h = Math.min(state.height * 0.23, m.radius * 0.58);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.58)";
    ctx.strokeStyle = "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(14, 16 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,207,131,0.92)";
    ctx.fillText("MATERIAL REFINEMENT", m.centerX, y + h * 0.32);

    ctx.font = "900 " + Math.max(10, 11 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.82)";
    ctx.fillText("HTML UNTOUCHED · JS ONLY", m.centerX, y + h * 0.56);

    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText("NO FINAL VISUAL PASS", m.centerX, y + h * 0.76);
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
      state.ctx.globalAlpha = 0.075;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else if (state.activeLens === "surface" || state.activeLens === "hydration") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.025;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.008;
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
    setText("[data-audralia-planet-carrier-status]", "JS material carrier · " + LENSES[lens].title);
    setText("[data-audralia-planet-carrier-proof]", "JS-only material refinement · HTML untouched · lattice suppressed in Body View · Runtime / Strength held");

    setDataset("audraliaPlanetActiveLens", lens);
    publishStatus(true);
    requestRender(lens === "body" ? 10 : 16);
  }

  function bindExistingEngineeringControls() {
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
    state.canvas.setAttribute("data-audralia-g2-material-refinement-js", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-material-refinement-js-only", "true");
    state.canvas.setAttribute("data-html-untouched", "true");
    state.canvas.setAttribute("data-clean-inspection-preserved", "true");
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
    var height = Math.max(560, Math.floor(rect.height * dpr));

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

    requestRender(10);
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
      requestRender(10);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStage();
        requestRender(10);
      }, 120);
    }, signal ? { signal: signal, passive: true } : { passive: true });
  }

  function receipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      donorContract: DONOR_CONTRACT,
      route: ROUTE,
      target: FILE,

      materialRefinementJsOnly: true,
      htmlUntouched: true,
      cleanInspectionPreserved: true,

      planetScaleRefined: true,
      planetCenterRefined: true,
      oceanDepthRefined: true,
      landOpacityReduced: true,
      coastlineDetailIncreased: true,
      islandDetailAdded: true,
      atmosphereRimThinned: true,
      bodyLatticeSuppressed: true,

      engineeringLensesPreserved: true,
      oneCanvas: state.oneCanvas,
      dragRotation: state.onePointerPath,
      activeLens: state.activeLens,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,

      runtimeStrengthHeld: true,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_MATERIAL_REFINEMENT_JS_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_MATERIAL_REFINEMENT_JS_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaPlanetMaterialRefinementJsOnly", true);
    setDataset("audraliaPlanetHtmlUntouched", true);
    setDataset("audraliaPlanetCleanInspectionPreserved", true);
    setDataset("audraliaPlanetScaleRefined", true);
    setDataset("audraliaPlanetCenterRefined", true);
    setDataset("audraliaPlanetOceanDepthRefined", true);
    setDataset("audraliaPlanetLandOpacityReduced", true);
    setDataset("audraliaPlanetCoastlineDetailIncreased", true);
    setDataset("audraliaPlanetAtmosphereRimThinned", true);
    setDataset("audraliaPlanetBodyLatticeSuppressed", true);
    setDataset("audraliaPlanetRuntimeStrengthHeld", true);
    setDataset("audraliaPlanetFinalVisualPassClaim", false);
    setDataset("audraliaPlanetActiveLens", state.activeLens);

    if (force) {
      setText("[data-audralia-planet-carrier-status]", "JS material carrier · " + LENSES[state.activeLens].title);
      setText("[data-audralia-planet-carrier-proof]", "JS-only material refinement · HTML untouched · lattice suppressed in Body View · Runtime / Strength held");
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
      recordError("init", "JS material carrier is present, but HTML stage/mount is unavailable.");
      publishStatus(true);
      return;
    }

    enforceOneCanvas();
    buildLocalDiagnosticGeometry();
    setupResize();
    bindExistingEngineeringControls();
    bindPointer();
    setLens("body");
    publishStatus(true);
    requestRender(14);
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    specOps: SPEC_OPS,
    donorContract: DONOR_CONTRACT,
    receipt: receipt,
    status: publishStatus
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
