// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_SURFACE_HYDRATION_SIXTH_SENSE_TNT_v1
// Full-file replacement.
// Scope: Audralia clean planet inspection carrier.
// Purpose: consume Gratitude terrain, hydration-edge, and unified landform compositor; draw Surface, Hydration,
// and The Sixth Sense from compositor packets instead of raw parcel blobs.
// Preserves: drag inspection, one canvas, Body lens, Lattice raw 256 inspection, Receipt proof.
// Does not own: terrain source truth, hydration-edge behavior truth, landform composition truth, HTML load order,
// Runtime / Strength activation, final terrain pass, final hydration pass, final composite pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_SURFACE_HYDRATION_SIXTH_SENSE_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_TNT_v1";
  var HTML_LOAD_ORDER_CONTRACT = "AUDRALIA_PLANET_HTML_LOAD_ORDER_COMPOSITOR_CHILDREN_BEFORE_CARRIER_TNT_v1";
  var SPEC_OPS = "AUDRALIA_PLANET_HTML_LOAD_ORDER_AND_CARRIER_COMPOSITOR_CONSUMPTION_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_PLANET_HTML_LOAD_ORDER_AND_CARRIER_COMPOSITOR_CONSUMPTION_NEWS_v1";
  var CCR = "AUDRALIA_PLANET_HTML_LOAD_ORDER_AND_CARRIER_COMPOSITOR_CONSUMPTION_CCR_v1";

  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var HYDRATION_EDGE_CHILD_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js";
  var LANDFORM_COMPOSITOR_CHILD_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js";
  var CORE_CHILD_FILE = "/assets/audralia/clean/core/audralia.planet-core.child.js";

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
      copy: "Clean hydrosphere view preserves the planet body. Unified landform expression may appear faintly without taking over the carrier."
    },
    surface: {
      title: "Surface View",
      anchor: "East · Unified Gratitude Landform",
      copy: "Surface now draws from the landform compositor: one merged mass, one coastline, blended elevation, and Nine Summits as internal anchors."
    },
    hydration: {
      title: "Hydration View",
      anchor: "South · Flow Through Unified Mass",
      copy: "Hydration now draws from compositor flow fields and edge relationships instead of disconnected raw hydration cells."
    },
    "sixth-sense": {
      title: "The Sixth Sense",
      anchor: "Relationship · Terrain + Water + Edge",
      copy: "The Sixth Sense consumes the collaborative compositor packet: terrain, hydration, edge, material, and summit influence as one relationship expression."
    },
    lattice: {
      title: "Lattice View",
      anchor: "West · Raw 16 × 16 / 256 Inspection",
      copy: "Lattice preserves the raw 256 inspection structure. Raw parcels belong here, not as the primary Surface or Hydration expression."
    },
    receipt: {
      title: "Receipt View",
      anchor: "Northwest · Compositor Consumption Receipt",
      copy: "Receipt proves terrain child, hydration-edge child, compositor child, carrier consumption, raw parcels held outside Lattice, and no final visual pass."
    }
  });

  var HYDRO_CURRENT_ARCS = Object.freeze([
    Object.freeze([[-170, 18], [-136, 12], [-101, 8], [-66, 10], [-31, 18], [4, 23]]),
    Object.freeze([[-150, -22], [-116, -29], [-82, -31], [-47, -25], [-10, -15], [26, -7]]),
    Object.freeze([[22, 42], [58, 38], [94, 28], [128, 14], [156, -3]]),
    Object.freeze([[-32, 56], [5, 51], [44, 43], [81, 30], [111, 12]]),
    Object.freeze([[42, -48], [75, -43], [106, -34], [135, -20], [158, -4]]),
    Object.freeze([[-178, 62], [-135, 66], [-92, 65], [-49, 60], [-8, 52], [31, 42]])
  ]);

  var HYDRO_DEPTH_BANDS = Object.freeze([
    Object.freeze([[-180, -52], [-135, -56], [-90, -55], [-45, -49], [0, -40], [45, -31], [90, -26], [135, -30], [180, -39]]),
    Object.freeze([[-180, -10], [-138, -16], [-96, -18], [-54, -14], [-12, -7], [30, -2], [72, -5], [114, -12], [156, -16], [180, -13]]),
    Object.freeze([[-180, 24], [-140, 30], [-99, 34], [-58, 32], [-17, 25], [24, 18], [65, 15], [106, 18], [147, 25], [180, 30]]),
    Object.freeze([[-180, 48], [-130, 53], [-80, 54], [-30, 50], [20, 43], [70, 38], [120, 40], [170, 47]])
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
    visibleReadoutUpdated: false,

    datasetCache: {},
    errors: [],

    gratitude: {
      api: null,
      detected: false,
      apiComplete: false,
      packetReady: false,
      validated: false,
      packet: null,
      status: null,
      continentMap: null,
      elevationMap: null,
      hydrationMap: null,
      summitMap: null,
      continentSeats: [],
      hydrationSeats: [],
      summits: [],
      failureReason: "Gratitude child not checked",
      attempts: 0,
      checkedAt: null
    },

    hydrationEdge: {
      api: null,
      detected: false,
      apiComplete: false,
      packetReady: false,
      validated: false,
      status: null,
      receivePacket: null,
      waterBehaviorPacket: null,
      edgeMap: null,
      failureReason: "Hydration-edge child not checked",
      attempts: 0,
      checkedAt: null
    },

    compositor: {
      api: null,
      detected: false,
      apiComplete: false,
      packetReady: false,
      validated: false,
      status: null,
      carrierPacket: null,
      unifiedPacket: null,
      surfacePacket: null,
      hydrationPacket: null,
      sixthSensePacket: null,
      continentMask: null,
      coastlinePath: null,
      elevationField: null,
      summitInfluenceField: null,
      hydrationFlowField: null,
      edgeRelationshipField: null,
      failureReason: "Landform compositor not checked",
      attempts: 0,
      checkedAt: null
    }
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop();
    } catch (_stopError) {}
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

  function deepClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function lensKey(value) {
    var key = String(value || "body").trim();
    if (key === "sixthSense" || key === "sixthsense" || key === "sixth_sense") key = "sixth-sense";
    return Object.prototype.hasOwnProperty.call(LENSES, key) ? key : "body";
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
    return {
      lon: -142 + (x / 15) * 108,
      lat: 56 - (y / 15) * 112
    };
  }

  function makeTerrainCellPoints(seat) {
    var westNorth = terrainSeatToLonLat(seat.x - 0.46, seat.y - 0.46);
    var eastSouth = terrainSeatToLonLat(seat.x + 0.46, seat.y + 0.46);

    return [
      [westNorth.lon, westNorth.lat],
      [eastSouth.lon, westNorth.lat],
      [eastSouth.lon, eastSouth.lat],
      [westNorth.lon, eastSouth.lat]
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

  function pointFromPathEntry(entry) {
    if (Array.isArray(entry)) return lonLatPoint(entry[0], entry[1]);
    return lonLatPoint(entry.lon, entry.lat);
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
    ctx.arcTo(x, y + height, x, y + height, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
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

    var bandAlpha = hydration ? 0.43 : body ? 0.10 : 0.14;
    var currentAlpha = hydration ? 0.48 : body ? 0.12 : 0.18;

    for (var i = 0; i < HYDRO_DEPTH_BANDS.length; i += 1) {
      drawProjectedPath(
        HYDRO_DEPTH_BANDS[i],
        "rgba(85,201,236,0.34)",
        Math.max(0.65, state.dpr * (hydration ? 1.18 : 0.58)),
        bandAlpha
      );
    }

    for (var j = 0; j < HYDRO_CURRENT_ARCS.length; j += 1) {
      drawProjectedPath(
        HYDRO_CURRENT_ARCS[j],
        "rgba(182,245,255,0.26)",
        Math.max(0.62, state.dpr * (hydration ? 1.08 : 0.50)),
        currentAlpha
      );
    }
  }

  function validateGratitudeChild() {
    state.gratitude.attempts += 1;
    state.gratitude.checkedAt = new Date().toISOString();

    var api = window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD || null;

    state.gratitude.api = api;
    state.gratitude.detected = Boolean(api);
    state.gratitude.apiComplete = false;
    state.gratitude.packetReady = false;
    state.gratitude.validated = false;
    state.gratitude.packet = null;
    state.gratitude.status = null;
    state.gratitude.continentMap = null;
    state.gratitude.elevationMap = null;
    state.gratitude.hydrationMap = null;
    state.gratitude.summitMap = null;
    state.gratitude.continentSeats = [];
    state.gratitude.hydrationSeats = [];
    state.gratitude.summits = [];

    if (!api) {
      state.gratitude.failureReason = "Gratitude child missing / invalid · terrain fallback held";
      return false;
    }

    state.gratitude.apiComplete = Boolean(
      typeof api.status === "function" &&
      typeof api.getChildReceivePacket === "function" &&
      typeof api.getContinentMap === "function" &&
      typeof api.getHydrationMap === "function" &&
      typeof api.getSummitMap === "function"
    );

    if (!state.gratitude.apiComplete) {
      state.gratitude.failureReason = "Gratitude child API incomplete · terrain fallback held";
      return false;
    }

    try {
      var status = api.status();
      var packet = api.getChildReceivePacket("audralia-carrier-compositor-consumption", { compact: false });
      var continentMap = api.getContinentMap({ compact: false });
      var elevationMap = typeof api.getElevationMap === "function" ? api.getElevationMap({ compact: false }) : null;
      var hydrationMap = api.getHydrationMap({ compact: false });
      var summitMap = api.getSummitMap({ compact: false });

      state.gratitude.status = status;
      state.gratitude.packet = packet;
      state.gratitude.continentMap = continentMap;
      state.gratitude.elevationMap = elevationMap;
      state.gratitude.hydrationMap = hydrationMap;
      state.gratitude.summitMap = summitMap;

      state.gratitude.continentSeats = continentMap && Array.isArray(continentMap.seats)
        ? continentMap.seats
        : continentMap && Array.isArray(continentMap.nodes)
          ? continentMap.nodes
          : [];

      state.gratitude.hydrationSeats = hydrationMap && Array.isArray(hydrationMap.seats)
        ? hydrationMap.seats
        : hydrationMap && Array.isArray(hydrationMap.nodes)
          ? hydrationMap.nodes
          : [];

      state.gratitude.summits = summitMap && Array.isArray(summitMap.summits) ? summitMap.summits : [];

      state.gratitude.packetReady = Boolean(packet && packet.childReceivePacketReady === true);
      state.gratitude.validated = Boolean(
        state.gratitude.packetReady &&
        packet.landFirst === true &&
        packet.nineSummitsEmbedded === true &&
        packet.hydrationIsConsequence === true &&
        packet.waterFillDerivedFromValleys === true &&
        packet.finalVisualPassClaim === false
      );

      state.gratitude.failureReason = state.gratitude.validated
        ? ""
        : "Gratitude child validation failed · fallback held";

      return state.gratitude.validated;
    } catch (error) {
      recordError("validateGratitudeChild", error);
      state.gratitude.failureReason = "Gratitude child packet exception · fallback held";
      return false;
    }
  }

  function validateHydrationEdgeChild() {
    state.hydrationEdge.attempts += 1;
    state.hydrationEdge.checkedAt = new Date().toISOString();

    var api = window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD ||
      window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD ||
      window.AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD ||
      null;

    state.hydrationEdge.api = api;
    state.hydrationEdge.detected = Boolean(api);
    state.hydrationEdge.apiComplete = false;
    state.hydrationEdge.packetReady = false;
    state.hydrationEdge.validated = false;
    state.hydrationEdge.status = null;
    state.hydrationEdge.receivePacket = null;
    state.hydrationEdge.waterBehaviorPacket = null;
    state.hydrationEdge.edgeMap = null;

    if (!api) {
      state.hydrationEdge.failureReason = "Hydration-edge child missing · compositor may fallback";
      return false;
    }

    state.hydrationEdge.apiComplete = Boolean(
      typeof api.status === "function" &&
      typeof api.getChildReceivePacket === "function" &&
      typeof api.getHydrationEdgeMap === "function" &&
      typeof api.getWaterBehaviorPacket === "function"
    );

    if (!state.hydrationEdge.apiComplete) {
      state.hydrationEdge.failureReason = "Hydration-edge child API incomplete";
      return false;
    }

    try {
      var status = api.status();
      var receivePacket = api.getChildReceivePacket("audralia-carrier-compositor-consumption", { compact: false });
      var waterPacket = api.getWaterBehaviorPacket("audralia-carrier-compositor-consumption", { compact: false });
      var edgeMap = api.getHydrationEdgeMap({ compact: false });

      state.hydrationEdge.status = status;
      state.hydrationEdge.receivePacket = receivePacket;
      state.hydrationEdge.waterBehaviorPacket = waterPacket;
      state.hydrationEdge.edgeMap = edgeMap;
      state.hydrationEdge.packetReady = Boolean(receivePacket && receivePacket.childReceivePacketReady === true);
      state.hydrationEdge.validated = Boolean(
        state.hydrationEdge.packetReady &&
        receivePacket.waterBehaviorAuthorityActive === true &&
        receivePacket.carrierInventsWaterBehavior === false &&
        receivePacket.finalVisualPassClaim === false
      );

      state.hydrationEdge.failureReason = state.hydrationEdge.validated
        ? ""
        : "Hydration-edge child validation failed";

      return state.hydrationEdge.validated;
    } catch (error) {
      recordError("validateHydrationEdgeChild", error);
      state.hydrationEdge.failureReason = "Hydration-edge child packet exception";
      return false;
    }
  }

  function validateLandformCompositorChild() {
    state.compositor.attempts += 1;
    state.compositor.checkedAt = new Date().toISOString();

    var api = window.AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_CHILD ||
      window.AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_CHILD ||
      window.AUDRALIA_G2_GRATITUDE_LANDFORM_COMPOSITOR_CHILD ||
      null;

    state.compositor.api = api;
    state.compositor.detected = Boolean(api);
    state.compositor.apiComplete = false;
    state.compositor.packetReady = false;
    state.compositor.validated = false;
    state.compositor.status = null;
    state.compositor.carrierPacket = null;
    state.compositor.unifiedPacket = null;
    state.compositor.surfacePacket = null;
    state.compositor.hydrationPacket = null;
    state.compositor.sixthSensePacket = null;
    state.compositor.continentMask = null;
    state.compositor.coastlinePath = null;
    state.compositor.elevationField = null;
    state.compositor.summitInfluenceField = null;
    state.compositor.hydrationFlowField = null;
    state.compositor.edgeRelationshipField = null;

    if (!api) {
      state.compositor.failureReason = "Landform compositor child missing · raw fallback only";
      return false;
    }

    state.compositor.apiComplete = Boolean(
      typeof api.status === "function" &&
      typeof api.getCarrierReceivePacket === "function" &&
      typeof api.getUnifiedLandformPacket === "function" &&
      typeof api.getSurfaceCompositePacket === "function" &&
      typeof api.getHydrationCompositePacket === "function" &&
      typeof api.getSixthSenseCompositePacket === "function"
    );

    if (!state.compositor.apiComplete) {
      state.compositor.failureReason = "Landform compositor API incomplete · raw fallback only";
      return false;
    }

    try {
      var status = api.status();
      var carrierPacket = api.getCarrierReceivePacket("audralia-planet-inspection-carrier", { compact: false });
      var unifiedPacket = api.getUnifiedLandformPacket("audralia-planet-inspection-carrier", { compact: false });
      var surfacePacket = api.getSurfaceCompositePacket("audralia-planet-surface-lens", { compact: false });
      var hydrationPacket = api.getHydrationCompositePacket("audralia-planet-hydration-lens", { compact: false });
      var sixthSensePacket = api.getSixthSenseCompositePacket("audralia-planet-sixth-sense-lens", { compact: false });
      var continentMask = typeof api.getContinentMask === "function" ? api.getContinentMask({ compact: false }) : null;
      var coastlinePath = typeof api.getCoastlinePath === "function" ? api.getCoastlinePath({ compact: false }) : null;
      var elevationField = typeof api.getElevationField === "function" ? api.getElevationField({ compact: false }) : null;
      var summitInfluenceField = typeof api.getSummitInfluenceField === "function" ? api.getSummitInfluenceField({ compact: false }) : null;
      var hydrationFlowField = typeof api.getHydrationFlowField === "function" ? api.getHydrationFlowField({ compact: false }) : null;
      var edgeRelationshipField = typeof api.getEdgeRelationshipField === "function" ? api.getEdgeRelationshipField({ compact: false }) : null;

      state.compositor.status = status;
      state.compositor.carrierPacket = carrierPacket;
      state.compositor.unifiedPacket = unifiedPacket;
      state.compositor.surfacePacket = surfacePacket;
      state.compositor.hydrationPacket = hydrationPacket;
      state.compositor.sixthSensePacket = sixthSensePacket;
      state.compositor.continentMask = continentMask;
      state.compositor.coastlinePath = coastlinePath;
      state.compositor.elevationField = elevationField;
      state.compositor.summitInfluenceField = summitInfluenceField;
      state.compositor.hydrationFlowField = hydrationFlowField;
      state.compositor.edgeRelationshipField = edgeRelationshipField;

      state.compositor.packetReady = Boolean(
        carrierPacket &&
        carrierPacket.carrierReceivePacketReady === true &&
        unifiedPacket &&
        unifiedPacket.unifiedLandformPacketReady === true
      );

      state.compositor.validated = Boolean(
        state.compositor.packetReady &&
        carrierPacket.carrierInventsLandform === false &&
        carrierPacket.carrierInventsTerrain === false &&
        carrierPacket.carrierInventsHydration === false &&
        carrierPacket.carrierInventsEdge === false &&
        carrierPacket.finalVisualPassClaim === false
      );

      state.compositor.failureReason = state.compositor.validated
        ? ""
        : "Landform compositor validation failed · raw fallback only";

      return state.compositor.validated;
    } catch (error) {
      recordError("validateLandformCompositorChild", error);
      state.compositor.failureReason = "Landform compositor packet exception · raw fallback only";
      return false;
    }
  }

  function validateChildChain() {
    var terrain = validateGratitudeChild();
    var edge = validateHydrationEdgeChild();
    var compositor = validateLandformCompositorChild();

    updateVisibleReadout(true);
    publishStatus(true);
    requestRender(16);

    return terrain && edge && compositor;
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

  function drawTerrainCellFallback(seat, mode) {
    if (!seat || !seat.continentMembership) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var elevation = clamp(seat.elevation, 0, 1);
    var isHydration = mode === "hydration";
    var isBody = mode === "body";
    var alpha = isHydration ? 0.26 : isBody ? 0.055 : 0.34;

    var warm = Math.floor(76 + elevation * 54);
    var green = Math.floor(96 + elevation * 74);
    var blue = Math.floor(76 + elevation * 34);

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
    ctx.restore();
  }

  function drawHydrationCellFallback(seat) {
    if (!seat || !seat.waterFillEligible || !(seat.hydrationDepth > 0)) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var depth = clamp(seat.hydrationDepth, 0, 1);
    var alpha = state.activeLens === "hydration" ? 0.34 : 0.16;

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
    ctx.restore();
  }

  function drawFallbackRawParcels(mode) {
    if (!state.gratitude.validated) return;

    var i;

    if (mode === "surface") {
      for (i = 0; i < state.gratitude.continentSeats.length; i += 1) {
        drawTerrainCellFallback(state.gratitude.continentSeats[i], "surface");
      }
    }

    if (mode === "hydration") {
      for (i = 0; i < state.gratitude.continentSeats.length; i += 1) {
        drawTerrainCellFallback(state.gratitude.continentSeats[i], "hydration");
      }

      for (i = 0; i < state.gratitude.hydrationSeats.length; i += 1) {
        drawHydrationCellFallback(state.gratitude.hydrationSeats[i]);
      }
    }

    if (mode === "body") {
      for (i = 0; i < state.gratitude.continentSeats.length; i += 1) {
        drawTerrainCellFallback(state.gratitude.continentSeats[i], "body");
      }
    }
  }

  function getCoastlinePoints() {
    var path = state.compositor.coastlinePath ||
      (state.compositor.unifiedPacket && state.compositor.unifiedPacket.coastlinePath) ||
      (state.compositor.surfacePacket && state.compositor.surfacePacket.coastlinePath) ||
      null;

    if (!path || !Array.isArray(path.points)) return [];
    return path.points;
  }

  function drawProjectedPolygon(points, fillStyle, strokeStyle, lineWidth, alpha) {
    if (!points || points.length < 3) return false;

    var ctx = state.ctx;
    var projected = [];
    var front = 0;

    for (var i = 0; i < points.length; i += 1) {
      var p = projectPoint(pointFromPathEntry(points[i]));
      projected.push(p);
      if (p.frontFacing) front += 1;
    }

    if (front < 3) return false;

    ctx.save();
    clipSphere();
    ctx.globalAlpha = alpha;
    ctx.beginPath();

    for (var j = 0; j < projected.length; j += 1) {
      if (j === 0) ctx.moveTo(projected[j].x, projected[j].y);
      else ctx.lineTo(projected[j].x, projected[j].y);
    }

    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();
    return true;
  }

  function drawProjectedCompositorLine(points, strokeStyle, lineWidth, alpha) {
    if (!points || points.length < 2) return false;

    var ctx = state.ctx;
    var projected = [];
    var front = 0;

    for (var i = 0; i < points.length; i += 1) {
      var p = projectPoint(pointFromPathEntry(points[i]));
      projected.push(p);
      if (p.frontFacing) front += 1;
    }

    if (front < 2) return false;

    ctx.save();
    clipSphere();
    ctx.globalAlpha = alpha;
    ctx.beginPath();

    for (var j = 0; j < projected.length; j += 1) {
      if (j === 0) ctx.moveTo(projected[j].x, projected[j].y);
      else ctx.lineTo(projected[j].x, projected[j].y);
    }

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawCompositorMass(mode) {
    if (!state.compositor.validated) return false;

    var points = getCoastlinePoints();
    if (!points.length) return false;

    var fill;
    var stroke;
    var alpha;

    if (mode === "body") {
      fill = "rgba(91,130,84,0.10)";
      stroke = "rgba(244,207,131,0.10)";
      alpha = 0.72;
    } else if (mode === "hydration") {
      fill = "rgba(83,136,96,0.26)";
      stroke = "rgba(182,245,255,0.28)";
      alpha = 0.86;
    } else if (mode === "sixth-sense") {
      fill = "rgba(112,151,96,0.42)";
      stroke = "rgba(244,207,131,0.44)";
      alpha = 0.94;
    } else {
      fill = "rgba(117,146,83,0.52)";
      stroke = "rgba(244,207,131,0.34)";
      alpha = 0.92;
    }

    return drawProjectedPolygon(points, fill, stroke, Math.max(0.75, state.dpr * 0.84), alpha);
  }

  function drawCompositorCoastline(alphaBoost) {
    var points = getCoastlinePoints();
    if (!points.length) return;

    drawProjectedCompositorLine(
      points,
      "rgba(255,226,162,0.72)",
      Math.max(0.72, state.dpr * 1.10),
      alphaBoost || 0.82
    );
  }

  function drawCompositorElevationField(mode) {
    if (!state.compositor.validated) return;

    var field = state.compositor.elevationField ||
      (state.compositor.surfacePacket && state.compositor.surfacePacket.elevationField) ||
      null;

    var nodes = field && Array.isArray(field.nodes) ? field.nodes : [];
    if (!nodes.length) return;

    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];

      if (!node.mergedLandformMembership && !node.summitInfluence) continue;
      if (mode !== "sixth-sense" && drawn > 46) break;
      if (mode === "body" && drawn > 16) break;

      var elevation = clamp(node.unifiedElevation || node.elevation || 0, 0, 1);
      var loc = terrainSeatToLonLat((node.x || 0) + 0.5, (node.y || 0) + 0.5);
      var p = projectPoint(lonLatPoint(loc.lon, loc.lat));

      if (!p.frontFacing) continue;

      var radius = Math.max(3.5, state.dpr * (5.0 + elevation * 10.0) * p.perspective);
      var alpha = mode === "sixth-sense" ? 0.065 : mode === "surface" ? 0.052 : 0.020;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = "rgba(255,226,162," + alpha.toFixed(3) + ")";
      ctx.fill();

      drawn += 1;
    }

    ctx.restore();
  }

  function drawCompositorSummitInfluence(mode) {
    if (!state.compositor.validated) return;

    var field = state.compositor.summitInfluenceField ||
      (state.compositor.surfacePacket && state.compositor.surfacePacket.summitInfluenceField) ||
      null;

    var nodes = field && Array.isArray(field.nodes) ? field.nodes : [];
    if (!nodes.length || mode === "body") return;

    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (!(node.summitInfluence > 0.32)) continue;

      var loc = terrainSeatToLonLat((node.x || 0) + 0.5, (node.y || 0) + 0.5);
      var p = projectPoint(lonLatPoint(loc.lon, loc.lat));
      if (!p.frontFacing) continue;

      var r = Math.max(1.7, state.dpr * (2.0 + (node.summitInfluence || 0) * 2.4) * p.perspective);

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fillStyle = "rgba(244,207,131,0.60)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3.2, 0, TAU);
      ctx.strokeStyle = "rgba(244,207,131,0.13)";
      ctx.lineWidth = Math.max(0.45, state.dpr * 0.42);
      ctx.stroke();

      drawn += 1;
      if (drawn >= 9) break;
    }

    ctx.restore();
  }

  function drawCompositorHydrationField(mode) {
    if (!state.compositor.validated) return;

    var field = state.compositor.hydrationFlowField ||
      (state.compositor.hydrationPacket && state.compositor.hydrationPacket.hydrationFlowField) ||
      (state.compositor.sixthSensePacket && state.compositor.sixthSensePacket.hydrationFlowField) ||
      null;

    if (!field) return;

    var flowPaths = Array.isArray(field.flowPaths) ? field.flowPaths : [];
    var lineAlpha = mode === "sixth-sense" ? 0.74 : 0.70;
    var lineWidth = Math.max(0.80, state.dpr * (mode === "sixth-sense" ? 1.18 : 1.00));

    for (var i = 0; i < flowPaths.length; i += 1) {
      var path = flowPaths[i];
      if (!path || !Array.isArray(path.points)) continue;

      drawProjectedCompositorLine(
        path.points,
        "rgba(139,231,255,0.78)",
        lineWidth,
        lineAlpha
      );
    }

    var nodes = Array.isArray(field.nodes) ? field.nodes : [];
    if (!nodes.length) return;

    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere();

    for (var j = 0; j < nodes.length; j += 1) {
      var node = nodes[j];
      if (drawn > 28) break;

      var loc = terrainSeatToLonLat((node.x || 0) + 0.5, (node.y || 0) + 0.5);
      var p = projectPoint(lonLatPoint(loc.lon, loc.lat));
      if (!p.frontFacing) continue;

      var size = mode === "sixth-sense" ? 2.5 : 2.0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.1, state.dpr * size * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(182,245,255,0.32)";
      ctx.fill();

      drawn += 1;
    }

    ctx.restore();
  }

  function drawCompositorEdgeField(mode) {
    if (!state.compositor.validated) return;

    var field = state.compositor.edgeRelationshipField ||
      (state.compositor.hydrationPacket && state.compositor.hydrationPacket.edgeRelationshipField) ||
      (state.compositor.sixthSensePacket && state.compositor.sixthSensePacket.edgeRelationshipField) ||
      null;

    var nodes = field && Array.isArray(field.nodes) ? field.nodes : [];
    if (!nodes.length) return;

    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (drawn > 34) break;

      var loc = terrainSeatToLonLat((node.x || 0) + 0.5, (node.y || 0) + 0.5);
      var p = projectPoint(lonLatPoint(loc.lon, loc.lat));
      if (!p.frontFacing) continue;

      var behavior = String(node.edgeBehavior || node.primaryBehavior || "");
      var fill = "rgba(244,207,131,0.30)";
      var radius = 1.6;

      if (behavior.indexOf("beach") >= 0) {
        fill = "rgba(255,226,162,0.44)";
        radius = 1.8;
      } else if (behavior.indexOf("cliff") >= 0 || behavior.indexOf("rock") >= 0) {
        fill = "rgba(235,238,231,0.34)";
        radius = 1.65;
      } else if (behavior.indexOf("waterfall") >= 0) {
        fill = "rgba(182,245,255,0.52)";
        radius = 2.0;
      } else if (behavior.indexOf("shelf") >= 0) {
        fill = "rgba(141,216,255,0.28)";
        radius = 1.6;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.9, state.dpr * radius * p.perspective), 0, TAU);
      ctx.fillStyle = fill;
      ctx.fill();

      drawn += 1;
    }

    ctx.restore();
  }

  function drawCompositorExpression() {
    var lens = state.activeLens;

    if (!state.compositor.validated) {
      if (lens === "surface" || lens === "hydration" || lens === "body") drawFallbackRawParcels(lens);
      return;
    }

    if (lens === "body") {
      drawCompositorMass("body");
      return;
    }

    if (lens === "surface") {
      drawCompositorMass("surface");
      drawCompositorElevationField("surface");
      drawCompositorSummitInfluence("surface");
      drawCompositorCoastline(0.88);
      return;
    }

    if (lens === "hydration") {
      drawCompositorMass("hydration");
      drawCompositorHydrationField("hydration");
      drawCompositorEdgeField("hydration");
      drawCompositorCoastline(0.74);
      return;
    }

    if (lens === "sixth-sense") {
      drawCompositorMass("sixth-sense");
      drawCompositorElevationField("sixth-sense");
      drawCompositorHydrationField("sixth-sense");
      drawCompositorEdgeField("sixth-sense");
      drawCompositorSummitInfluence("sixth-sense");
      drawCompositorCoastline(0.96);
      return;
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
    ctx.globalAlpha = state.activeLens === "body" ? 0.052 : 0.24;
    strokeLine(equator, "rgba(244,207,131,0.13)", Math.max(0.42, state.dpr * 0.34));
    strokeLine(meridian, "rgba(141,216,255,0.075)", Math.max(0.34, state.dpr * 0.28));
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
    var w = Math.min(state.width * 0.78, m.radius * 2.0);
    var h = Math.min(state.height * 0.38, m.radius * 0.96);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    var validated = state.compositor.validated;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.68)";
    ctx.strokeStyle = validated ? "rgba(167,243,198,0.40)" : "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = validated ? "rgba(167,243,198,0.92)" : "rgba(244,207,131,0.92)";
    ctx.fillText(validated ? "COMPOSITOR LIVE" : "COMPOSITOR HELD", m.centerX, y + h * 0.18);

    ctx.font = "900 " + Math.max(8, 9.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.84)";
    ctx.fillText(
      "TERRAIN " + (state.gratitude.validated ? "PASS" : "HELD") +
      " · EDGE " + (state.hydrationEdge.validated ? "PASS" : "HELD") +
      " · COMPOSITOR " + (state.compositor.validated ? "PASS" : "HELD"),
      m.centerX,
      y + h * 0.36
    );

    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText("SURFACE / HYDRATION / SIXTH SENSE CONSUME COMPOSITOR", m.centerX, y + h * 0.52);

    ctx.fillStyle = "rgba(244,207,131,0.82)";
    ctx.fillText("RAW 256 PARCELS REMAIN LATTICE ONLY", m.centerX, y + h * 0.66);

    ctx.fillStyle = "rgba(238,244,255,0.76)";
    ctx.fillText("CARRIER DRAWS · CARRIER DOES NOT INVENT LANDFORM", m.centerX, y + h * 0.80);

    ctx.fillStyle = "rgba(244,207,131,0.80)";
    ctx.fillText("NO FINAL VISUAL PASS · RUNTIME / STRENGTH HELD", m.centerX, y + h * 0.92);

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
    drawCompositorExpression();
    drawReferenceLines();

    if (state.activeLens === "lattice") {
      if (!state.compositor.validated && state.gratitude.validated) drawFallbackRawParcels("surface");
      drawDiagnosticLattice(state.pointerActive);
    } else if (state.activeLens === "receipt") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.070;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else if (state.activeLens === "hydration" || state.activeLens === "sixth-sense") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.009;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.0025;
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

  function updateVisibleReadout(force) {
    var statusText = state.compositor.validated
      ? "Compositor live · carrier consuming unified landform"
      : state.gratitude.validated
        ? "Terrain live · compositor missing / invalid · fallback held"
        : "Terrain child missing / invalid · expression held";

    var proofText = state.compositor.validated
      ? "terrain child ready · hydration-edge ready · landform compositor ready · raw parcels lattice only"
      : state.compositor.failureReason || state.gratitude.failureReason || "bounded failure · expression held";

    var wroteStatus = setText("[data-audralia-planet-carrier-status]", statusText);
    var wroteProof = setText("[data-audralia-planet-carrier-proof]", proofText);

    state.visibleReadoutUpdated = Boolean(wroteStatus || wroteProof || force);

    setText("[data-audralia-planet-stage-label]", state.compositor.validated
      ? "Unified Inspection → Surface, Hydration, and Sixth Sense consume compositor"
      : "Clean Inspection → compositor not validated yet"
    );

    return state.visibleReadoutUpdated;
  }

  function setLens(nextLens) {
    var lens = lensKey(nextLens);
    state.activeLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-planet-lens]")).forEach(function (button) {
      button.setAttribute("aria-pressed", lensKey(button.dataset.audraliaPlanetLens) === lens ? "true" : "false");
    });

    setText("[data-audralia-planet-lens-anchor]", LENSES[lens].anchor);
    setText("[data-audralia-planet-lens-title]", LENSES[lens].title);
    setText("[data-audralia-planet-lens-copy]", LENSES[lens].copy);

    updateVisibleReadout(true);
    setDataset("audraliaPlanetActiveLens", lens);
    publishStatus(true);
    requestRender(lens === "body" ? 10 : 18);
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
    state.canvas.setAttribute("data-audralia-carrier-compositor-consumption", CONTRACT);
    state.canvas.setAttribute("data-active-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-html-load-order-contract", HTML_LOAD_ORDER_CONTRACT);
    state.canvas.setAttribute("data-carrier-consumes-compositor", "true");
    state.canvas.setAttribute("data-raw-parcels-lattice-only", "true");
    state.canvas.setAttribute("data-sixth-sense-compositor-ready", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-carrier-invents-hydration", "false");
    state.canvas.setAttribute("data-carrier-invents-edge", "false");
    state.canvas.setAttribute("data-carrier-invents-landform", "false");
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
      activeContract: CONTRACT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlLoadOrderContract: HTML_LOAD_ORDER_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      route: ROUTE,
      target: FILE,

      gratitudeChildFile: GRATITUDE_CHILD_FILE,
      hydrationEdgeChildFile: HYDRATION_EDGE_CHILD_FILE,
      landformCompositorChildFile: LANDFORM_COMPOSITOR_CHILD_FILE,
      coreChildFile: CORE_CHILD_FILE,

      gratitudeChildDetected: state.gratitude.detected,
      gratitudeChildApiComplete: state.gratitude.apiComplete,
      gratitudeChildPacketReady: state.gratitude.packetReady,
      gratitudeChildValidated: state.gratitude.validated,
      gratitudeChildFailureReason: state.gratitude.failureReason,
      gratitudeChildAttempts: state.gratitude.attempts,
      gratitudeChildCheckedAt: state.gratitude.checkedAt,

      hydrationEdgeChildDetected: state.hydrationEdge.detected,
      hydrationEdgeChildApiComplete: state.hydrationEdge.apiComplete,
      hydrationEdgeChildPacketReady: state.hydrationEdge.packetReady,
      hydrationEdgeChildValidated: state.hydrationEdge.validated,
      hydrationEdgeChildFailureReason: state.hydrationEdge.failureReason,
      hydrationEdgeChildAttempts: state.hydrationEdge.attempts,
      hydrationEdgeChildCheckedAt: state.hydrationEdge.checkedAt,

      landformCompositorChildDetected: state.compositor.detected,
      landformCompositorChildApiComplete: state.compositor.apiComplete,
      landformCompositorChildPacketReady: state.compositor.packetReady,
      landformCompositorChildValidated: state.compositor.validated,
      landformCompositorChildFailureReason: state.compositor.failureReason,
      landformCompositorChildAttempts: state.compositor.attempts,
      landformCompositorChildCheckedAt: state.compositor.checkedAt,

      carrierConsumesChild: true,
      carrierConsumesHydrationEdge: true,
      carrierConsumesLandformCompositor: state.compositor.validated,
      carrierPrefersCompositorWhenValid: true,
      rawParcelsLatticeOnly: true,
      sixthSenseLensActive: true,

      surfaceDrawsFromCompositor: state.compositor.validated,
      hydrationDrawsFromCompositor: state.compositor.validated,
      sixthSenseDrawsFromCompositor: state.compositor.validated,
      latticeRawInspectionPreserved: true,

      bodyViewClean: true,
      surfaceViewUnifiedLandform: true,
      hydrationViewUnifiedFlow: true,
      sixthSenseViewCollaborativeExpression: true,
      latticeViewPreserved: true,
      receiptViewBootAligned: true,

      oneCanvas: state.oneCanvas,
      dragRotationActive: state.onePointerPath,
      activeLens: state.activeLens,
      renderCount: state.renderCount,

      visibleReadoutUpdated: state.visibleReadoutUpdated,
      htmlUntouched: true,
      gratitudeChildUntouched: true,
      hydrationEdgeChildUntouched: true,
      landformCompositorChildUntouched: true,
      coreChildUntouched: true,

      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      localTerrainArraysPrimary: false,
      rawTerrainFallbackOnly: true,
      earthSubstitution: false,
      australiaNameDrift: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_SURFACE_HYDRATION_SIXTH_SENSE_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_STATUS = payload;
    window.AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_STATUS = payload;
    window.AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaCarrierActiveContract", CONTRACT);
    setDataset("audraliaHtmlLoadOrderContract", HTML_LOAD_ORDER_CONTRACT);
    setDataset("audraliaGratitudeChildDetected", state.gratitude.detected);
    setDataset("audraliaGratitudeChildPacketReady", state.gratitude.packetReady);
    setDataset("audraliaGratitudeChildValidated", state.gratitude.validated);
    setDataset("audraliaHydrationEdgeChildDetected", state.hydrationEdge.detected);
    setDataset("audraliaHydrationEdgeChildPacketReady", state.hydrationEdge.packetReady);
    setDataset("audraliaHydrationEdgeChildValidated", state.hydrationEdge.validated);
    setDataset("audraliaLandformCompositorChildDetected", state.compositor.detected);
    setDataset("audraliaLandformCompositorChildPacketReady", state.compositor.packetReady);
    setDataset("audraliaLandformCompositorChildValidated", state.compositor.validated);
    setDataset("audraliaCarrierConsumesCompositor", state.compositor.validated);
    setDataset("audraliaRawParcelsLatticeOnly", true);
    setDataset("audraliaSixthSenseLensActive", true);
    setDataset("audraliaCarrierInventsTerrain", false);
    setDataset("audraliaCarrierInventsHydration", false);
    setDataset("audraliaCarrierInventsEdge", false);
    setDataset("audraliaCarrierInventsLandform", false);
    setDataset("audraliaRuntimeStrengthHeld", true);
    setDataset("audraliaFinalVisualPassClaim", false);
    setDataset("audraliaPlanetActiveLens", state.activeLens);

    if (force) updateVisibleReadout(true);

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

  function retryChildDetection() {
    validateChildChain();

    setTimeout(function () {
      if (!state.compositor.validated && !state.stopped) validateChildChain();
    }, 180);

    setTimeout(function () {
      if (!state.compositor.validated && !state.stopped) validateChildChain();
    }, 640);

    setTimeout(function () {
      if (!state.compositor.validated && !state.stopped) validateChildChain();
    }, 1200);
  }

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");
    state.details = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Carrier compositor consumption is present, but HTML stage/mount is unavailable.");
      publishStatus(true);
      return;
    }

    enforceOneCanvas();
    buildLocalDiagnosticGeometry();
    setupResize();
    bindLensControls();
    bindPointer();

    updateVisibleReadout(true);
    retryChildDetection();

    setLens("body");
    publishStatus(true);
    requestRender(14);
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    activeContract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlLoadOrderContract: HTML_LOAD_ORDER_CONTRACT,
    specOps: SPEC_OPS,
    news: NEWS,
    ccr: CCR,
    receipt: receipt,
    status: publishStatus,
    validateChildChain: validateChildChain,
    validateGratitudeChild: validateGratitudeChild,
    validateHydrationEdgeChild: validateHydrationEdgeChild,
    validateLandformCompositorChild: validateLandformCompositorChild
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
