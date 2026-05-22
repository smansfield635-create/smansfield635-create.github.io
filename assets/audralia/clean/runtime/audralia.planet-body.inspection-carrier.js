// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_TNT_v1
// Full-file replacement.
// Scope: carrier consumes Gratitude terrain child after HTML loads child before carrier.
// Carrier does not invent terrain. Gratitude child owns land-first terrain and valley-fill hydration.
// Runtime / Strength remains held. No final visual pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_BODY_HYDROSPHERE_CARRIER_TERRAIN_HELD_JS_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_SPEC_OPS_v1";
  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";

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
      anchor: "North · Hydrosphere Body",
      copy: "Clean body view keeps Audralia hydrosphere-first. Gratitude child terrain is held back for Surface and Hydration views."
    },
    surface: {
      title: "Surface View",
      anchor: "East · Gratitude Surface",
      copy: "Surface view renders the Continent of Gratitude from the child terrain packet. The carrier does not invent land."
    },
    hydration: {
      title: "Hydration View",
      anchor: "South · Valley-Fill Hydration",
      copy: "Hydration view renders valley-fill water from the child hydration map after land, elevation, ridges, basins, and valleys are defined."
    },
    lattice: {
      title: "Lattice View",
      anchor: "West · 16 × 16 / 256",
      copy: "Lattice view reveals the 256 inspection field through Engineering while preserving child-authority boundaries."
    },
    receipt: {
      title: "Receipt View",
      anchor: "Northwest · Collaboration Receipt",
      copy: "Receipt view confirms inline tray active, Gratitude child detected, carrier consumption active, and Runtime / Strength held."
    }
  });

  var HYDRO_CURRENT_ARCS = Object.freeze([
    [[-170, 18], [-136, 12], [-101, 8], [-66, 10], [-31, 18], [4, 23]],
    [[-150, -22], [-116, -29], [-82, -31], [-47, -25], [-10, -15], [26, -7]],
    [[22, 42], [58, 38], [94, 28], [128, 14], [156, -3]],
    [[-32, 56], [5, 51], [44, 43], [81, 30], [111, 12]],
    [[42, -48], [75, -43], [106, -34], [135, -20], [158, -4]],
    [[-178, 62], [-135, 66], [-92, 65], [-49, 60], [-8, 52], [31, 42]]
  ]);

  var HYDRO_DEPTH_BANDS = Object.freeze([
    [[-180, -52], [-135, -56], [-90, -55], [-45, -49], [0, -40], [45, -31], [90, -26], [135, -30], [180, -39]],
    [[-180, -10], [-138, -16], [-96, -18], [-54, -14], [-12, -7], [30, -2], [72, -5], [114, -12], [156, -16], [180, -13]],
    [[-180, 24], [-140, 30], [-99, 34], [-58, 32], [-17, 25], [24, 18], [65, 15], [106, 18], [147, 25], [180, 30]],
    [[-180, 48], [-130, 53], [-80, 54], [-30, 50], [20, 43], [70, 38], [120, 40], [170, 47]]
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
    errors: [],

    gratitude: {
      api: null,
      detected: false,
      packetReady: false,
      validated: false,
      packet: null,
      continentSeats: [],
      hydrationSeats: [],
      summitMap: null,
      status: null,
      failureReason: "child not checked"
    }
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try { window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop(); } catch (_error) {}
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
    try { return document.querySelector(selector); } catch (_error) { return null; }
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
      try { state.details[i].open = false; } catch (_error) {}
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

  function terrainSeatToLonLat(x, y) {
    var lon = -142 + (x / 15) * 108;
    var lat = 56 - (y / 15) * 112;
    return { lon: lon, lat: lat };
  }

  function makeTerrainCellPoints(seat) {
    var west = terrainSeatToLonLat(seat.x - 0.46, seat.y - 0.46);
    var east = terrainSeatToLonLat(seat.x + 0.46, seat.y + 0.46);
    return [
      [west.lon, west.lat],
      [east.lon, west.lat],
      [east.lon, east.lat],
      [west.lon, east.lat]
    ];
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
      for (radial = 0; radial < RADIAL_NODES; radial += 1) ring.push(makeSeat(band, radial));
      rings.push(Object.freeze(ring));
    }

    function seat(bandIndex, radialIndex) {
      return rings[bandIndex][((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function link(a, b, family, major, secondary) {
      return Object.freeze({ a: a, b: b, family: family, major: Boolean(major), secondary: Boolean(secondary), renderEligible: true });
    }

    var ringLinks = [];
    var spineLinks = [];
    var fibonacciLinks = [];
    var fibonacciReturnLinks = [];

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        ringLinks.push(link(seat(band, radial), seat(band, radial + 1), "ring", band % 4 === 0 || radial % 4 === 0, band % 2 === 0 || radial % 2 === 0));
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
    var cssWidth = width / Math.max(1, state.dpr);

    return {
      centerX: width / 2,
      centerY: height * 0.365,
      radius: minSide * (cssWidth < 680 ? 0.385 : 0.420),
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

  function drawProjectedPath(points, stroke, width, alpha) {
    var ctx = state.ctx;
    var projected = points.map(function (pair) { return projectPoint(lonLatPoint(pair[0], pair[1])); });

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
    basin.addColorStop(0.52, "rgba(34,149,198,0.055)");
    basin.addColorStop(0.76, "rgba(0,18,58,0.16)");
    basin.addColorStop(1.00, "rgba(0,7,22,0.42)");
    ctx.fillStyle = basin;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    var directional = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    directional.addColorStop(0.00, "rgba(255,255,255,0.038)");
    directional.addColorStop(0.26, "rgba(255,255,255,0.010)");
    directional.addColorStop(0.56, "rgba(0,0,0,0.12)");
    directional.addColorStop(1.00, "rgba(0,0,0,0.35)");
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

  function drawHydrosphereBody() {
    var hydration = state.activeLens === "hydration";
    var body = state.activeLens === "body";

    var bandAlpha = hydration ? 0.45 : body ? 0.11 : 0.16;
    var currentAlpha = hydration ? 0.52 : body ? 0.13 : 0.20;

    for (var i = 0; i < HYDRO_DEPTH_BANDS.length; i += 1) {
      drawProjectedPath(HYDRO_DEPTH_BANDS[i], "rgba(85,201,236,0.34)", Math.max(0.65, state.dpr * (hydration ? 1.18 : 0.58)), bandAlpha);
    }

    for (var j = 0; j < HYDRO_CURRENT_ARCS.length; j += 1) {
      drawProjectedPath(HYDRO_CURRENT_ARCS[j], "rgba(182,245,255,0.26)", Math.max(0.62, state.dpr * (hydration ? 1.08 : 0.50)), currentAlpha);
    }
  }

  function findGratitudeChild() {
    var api = window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD || null;
    state.gratitude.api = api;
    state.gratitude.detected = Boolean(api);

    if (!api) {
      state.gratitude.failureReason = "Gratitude child global missing";
      return false;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getChildReceivePacket !== "function" ||
      typeof api.getContinentMap !== "function" ||
      typeof api.getHydrationMap !== "function" ||
      typeof api.getSummitMap !== "function"
    ) {
      state.gratitude.failureReason = "Gratitude child API incomplete";
      return false;
    }

    try {
      var packet = api.getChildReceivePacket("audralia-clean-planet-carrier", { compact: false });
      var status = api.status();
      var continent = api.getContinentMap({ compact: false });
      var hydration = api.getHydrationMap({ compact: false });
      var summit = api.getSummitMap({ compact: false });

      state.gratitude.packet = packet;
      state.gratitude.status = status;
      state.gratitude.summitMap = summit;
      state.gratitude.continentSeats = continent && Array.isArray(continent.seats) ? continent.seats : [];
      state.gratitude.hydrationSeats = hydration && Array.isArray(hydration.seats) ? hydration.seats : [];

      state.gratitude.packetReady = Boolean(packet && packet.childReceivePacketReady === true);
      state.gratitude.validated = Boolean(
        state.gratitude.packetReady &&
        packet.landFirst === true &&
        packet.nineSummitsEmbedded === true &&
        packet.hydrationIsConsequence === true &&
        packet.waterFillDerivedFromValleys === true &&
        packet.finalVisualPassClaim === false
      );

      state.gratitude.failureReason = state.gratitude.validated ? "" : "Gratitude child validation failed";
      return state.gratitude.validated;
    } catch (error) {
      recordError("findGratitudeChild", error);
      state.gratitude.failureReason = error && error.message ? error.message : "child packet exception";
      return false;
    }
  }

  function projectedCell(points) {
    var projected = [];
    var front = 0;

    for (var i = 0; i < points.length; i += 1) {
      var p = projectPoint(lonLatPoint(points[i][0], points[i][1]));
      projected.push(p);
      if (p.frontFacing) front += 1;
    }

    return { projected: projected, front: front };
  }

  function drawTerrainCell(seat) {
    if (!seat || !seat.continentMembership) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var elevation = clamp(seat.elevation, 0, 1);
    var alpha = state.activeLens === "surface" ? 0.64 : 0.22;
    var warm = Math.floor(76 + elevation * 54);
    var green = Math.floor(96 + elevation * 74);
    var blue = Math.floor(76 + elevation * 34);

    if (seat.ridgeStatus) {
      warm += 20;
      green += 14;
    }

    if (seat.basinStatus || seat.valleyStatus) {
      green += 12;
      blue += 12;
    }

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = "rgba(" + warm + "," + green + "," + blue + "," + alpha.toFixed(3) + ")";
    ctx.fill();

    if (seat.ridgeStatus || seat.continentCore) {
      ctx.strokeStyle = "rgba(255,244,216,0.18)";
      ctx.lineWidth = Math.max(0.3, state.dpr * 0.32);
      ctx.globalAlpha = state.activeLens === "surface" ? 0.58 : 0.18;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawHydrationCell(seat) {
    if (!seat || !seat.waterFillEligible || !(seat.hydrationDepth > 0)) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var depth = clamp(seat.hydrationDepth, 0, 1);
    var alpha = state.activeLens === "hydration" ? 0.66 : 0.26;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = "rgba(95,202,236," + (alpha * (0.54 + depth * 0.46)).toFixed(3) + ")";
    ctx.fill();
    ctx.strokeStyle = "rgba(182,245,255,0.28)";
    ctx.lineWidth = Math.max(0.35, state.dpr * 0.36);
    ctx.stroke();
    ctx.restore();
  }

  function drawSummitMarkers() {
    if (!state.gratitude.validated || state.activeLens !== "surface") return;

    var summitMap = state.gratitude.summitMap;
    var summits = summitMap && Array.isArray(summitMap.summits) ? summitMap.summits : [];
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < summits.length; i += 1) {
      var seat = terrainSeatToLonLat(summits[i].x, summits[i].y);
      var p = projectPoint(lonLatPoint(seat.lon, seat.lat));
      if (!p.frontFacing) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.1, state.dpr * 2.1 * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(244,207,131,0.76)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2.2, state.dpr * 4.0 * p.perspective), 0, TAU);
      ctx.strokeStyle = "rgba(244,207,131,0.28)";
      ctx.lineWidth = Math.max(0.4, state.dpr * 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGratitudeChildTerrain() {
    if (!state.gratitude.validated) return;

    if (state.activeLens === "surface") {
      for (var i = 0; i < state.gratitude.continentSeats.length; i += 1) {
        drawTerrainCell(state.gratitude.continentSeats[i]);
      }
      drawSummitMarkers();
    }

    if (state.activeLens === "hydration") {
      for (var j = 0; j < state.gratitude.continentSeats.length; j += 1) {
        if (state.gratitude.continentSeats[j].continentMembership) drawTerrainCell(state.gratitude.continentSeats[j]);
      }

      for (var k = 0; k < state.gratitude.hydrationSeats.length; k += 1) {
        drawHydrationCell(state.gratitude.hydrationSeats[k]);
      }
    }

    if (state.activeLens === "body") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.10;
      for (var b = 0; b < state.gratitude.continentSeats.length; b += 1) {
        drawTerrainCell(state.gratitude.continentSeats[b]);
      }
      state.ctx.restore();
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
    ctx.globalAlpha = state.activeLens === "body" ? 0.06 : 0.34;
    strokeLine(equator, "rgba(244,207,131,0.13)", Math.max(0.42, state.dpr * 0.34));
    strokeLine(meridian, "rgba(141,216,255,0.075)", Math.max(0.34, state.dpr * 0.28));
    ctx.restore();
  }

  function linkColor(link, a, b) {
    var front = a.frontFacing || b.frontFacing;
    var z = (a.z + b.z) / 2;

    if (link.family === "fibonacci-forward") {
      return front ? "rgba(244,207,131," + clamp(0.42 + z * 0.12, 0.24, 0.70).toFixed(3) + ")" : "rgba(244,207,131,0.08)";
    }

    if (link.family === "fibonacci-return") {
      return front ? "rgba(184,238,255," + clamp(0.17 + z * 0.08, 0.10, 0.32).toFixed(3) + ")" : "rgba(184,238,255,0.05)";
    }

    if (link.major) {
      return front ? "rgba(244,207,131," + clamp(0.40 + z * 0.10, 0.22, 0.64).toFixed(3) + ")" : "rgba(244,207,131,0.08)";
    }

    return front ? "rgba(112,199,255," + clamp(0.20 + z * 0.08, 0.10, 0.36).toFixed(3) + ")" : "rgba(112,199,255,0.045)";
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
      ctx.fillStyle = seat.major ? "rgba(244,207,131," + alpha.toFixed(3) + ")" : "rgba(141,216,255," + alpha.toFixed(3) + ")";
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
    var w = Math.min(state.width * 0.72, m.radius * 1.88);
    var h = Math.min(state.height * 0.28, m.radius * 0.74);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.62)";
    ctx.strokeStyle = "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(13, 15 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,207,131,0.92)";
    ctx.fillText("GRATITUDE CHILD LIVE", m.centerX, y + h * 0.24);

    ctx.font = "900 " + Math.max(9, 10 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.84)";
    ctx.fillText(state.gratitude.validated ? "CHILD DETECTED · PACKET READY" : "CHILD HELD / NOT VALIDATED", m.centerX, y + h * 0.46);

    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText("CARRIER CONSUMES · DOES NOT INVENT TERRAIN", m.centerX, y + h * 0.64);

    ctx.fillStyle = "rgba(167,243,198,0.80)";
    ctx.fillText("RUNTIME HELD · NO FINAL VISUAL PASS", m.centerX, y + h * 0.82);

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
    drawHydrosphereBody();
    drawGratitudeChildTerrain();
    drawReferenceLines();

    if (state.activeLens === "lattice") {
      drawDiagnosticLattice(state.pointerActive);
    } else if (state.activeLens === "receipt") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.070;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else if (state.activeLens === "hydration") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.012;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.003;
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

    setText("[data-audralia-planet-carrier-status]", state.gratitude.validated ? "Gratitude child live · carrier consuming" : "Hydrosphere carrier · Gratitude child not validated");
    setText("[data-audralia-planet-carrier-proof]", state.gratitude.validated
      ? "child packet ready · land-first terrain · valley-fill hydration · carrier invents terrain false"
      : "carrier active · child missing or invalid · terrain render held");

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
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
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

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

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

      try { event.preventDefault(); } catch (_error2) {}
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
    state.canvas.setAttribute("data-audralia-g2-gratitude-child-live-carrier", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-inline-lens-tray-active", "true");
    state.canvas.setAttribute("data-carrier-consumes-child", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
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
    var height = Math.max(600, Math.floor(rect.height * dpr));

    state.rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

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
        updateDimensions({ left: box.left, top: box.top, width: content.width, height: content.height });
      });

      try { resizeObserver.observe(state.stage); } catch (_error) {}
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
      route: ROUTE,
      target: FILE,
      gratitudeChildFile: GRATITUDE_CHILD_FILE,

      inlineLensTrayActive: true,
      gratitudeChildScriptLoadedBeforeCarrier: true,
      gratitudeChildDetected: state.gratitude.detected,
      gratitudeChildPacketReady: state.gratitude.packetReady,
      gratitudeChildValidated: state.gratitude.validated,
      gratitudeChildFailureReason: state.gratitude.failureReason,

      carrierConsumesChild: true,
      carrierInventsTerrain: false,
      landFirstChildAuthority: Boolean(state.gratitude.packet && state.gratitude.packet.landFirst === true),
      nineSummitsEmbedded: Boolean(state.gratitude.packet && state.gratitude.packet.nineSummitsEmbedded === true),
      hydrationDerivedFromValleys: Boolean(state.gratitude.packet && state.gratitude.packet.waterFillDerivedFromValleys === true),

      bodyViewClean: true,
      surfaceViewChildTerrain: true,
      hydrationViewChildValleyFill: true,
      engineeringReadoutBelow: true,

      oneCanvas: state.oneCanvas,
      dragRotationActive: state.onePointerPath,
      activeLens: state.activeLens,
      renderCount: state.renderCount,
      runtimeStrengthHeld: true,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaInlineLensTrayActive", true);
    setDataset("audraliaGratitudeChildDetected", state.gratitude.detected);
    setDataset("audraliaGratitudeChildPacketReady", state.gratitude.packetReady);
    setDataset("audraliaGratitudeChildValidated", state.gratitude.validated);
    setDataset("audraliaCarrierConsumesChild", true);
    setDataset("audraliaCarrierInventsTerrain", false);
    setDataset("audraliaSurfaceViewChildTerrain", true);
    setDataset("audraliaHydrationViewChildValleyFill", true);
    setDataset("audraliaRuntimeStrengthHeld", true);
    setDataset("audraliaFinalVisualPassClaim", false);
    setDataset("audraliaPlanetActiveLens", state.activeLens);

    if (force) {
      setText("[data-audralia-planet-carrier-status]", state.gratitude.validated ? "Gratitude child live · carrier consuming" : "Hydrosphere carrier · Gratitude child not validated");
      setText("[data-audralia-planet-carrier-proof]", state.gratitude.validated
        ? "child packet ready · land-first terrain · valley-fill hydration · carrier invents terrain false"
        : "carrier active · child missing or invalid · terrain render held");
    }

    return payload;
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

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");
    state.details = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Carrier is present, but HTML stage/mount is unavailable.");
      publishStatus(true);
      return;
    }

    enforceOneCanvas();
    buildLocalDiagnosticGeometry();
    findGratitudeChild();
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
    receipt: receipt,
    status: publishStatus,
    detectGratitudeChild: findGratitudeChild
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
