// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_CARRIER_LAND_WATER_CONSTRUCT_VISIBILITY_ADAPTER_TNT_v1
// Full-file replacement.
// Scope: carrier-side land/water construct visibility adapter for already-consumed Gratitude packets.
// Purpose: preserve the achieved sea-level baseline and organic expression baseline while making existing
// land formations and water constructs visibly readable through render-only visibility registries.
// Does not own: HTML, script tags, Gratitude terrain truth, hydration child truth, surface-habitability truth,
// planet core truth, climate authority, atmosphere authority, ecology, settlement, Runtime / Strength activation,
// final terrain pass, final hydration pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_CARRIER_LAND_WATER_CONSTRUCT_VISIBILITY_ADAPTER_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_PLANET_CARRIER_TERRAIN_HYDRATION_ORGANIC_EXPRESSION_ADAPTER_TNT_v1";
  var HTML_COLLABORATIVE_CONTRACT = "AUDRALIA_PLANET_HTML_CARRIER_ADAPTER_CACHE_KEY_AND_CHILD_CONTRACT_ALIGNMENT_TNT_v1";
  var SPEC_OPS = "AUDRALIA_PLANET_CARRIER_LAND_WATER_CONSTRUCT_VISIBILITY_ADAPTER_SPEC_OPS_v1";

  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var CORE_CHILD_FILE = "/assets/audralia/clean/core/audralia.planet-core.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  var SEA_LEVEL_BASELINE_ACHIEVED = true;
  var FINAL_TERRAIN_PASS_CLAIM = false;
  var FINAL_HYDRATION_PASS_CLAIM = false;
  var FINAL_VISUAL_PASS_CLAIM = false;
  var RUNTIME_STRENGTH_HELD = true;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  var LENSES = Object.freeze({
    body: {
      title: "Body View",
      anchor: "North · Hydrosphere Body",
      copy: "Clean body view keeps Audralia hydrosphere-first. Land and water constructs remain faint."
    },
    surface: {
      title: "Surface View",
      anchor: "East · Land Formation Visibility",
      copy: "Surface view separates ridges, basins, valleys, dry zones, and coast from the achieved sea-level body."
    },
    hydration: {
      title: "Hydration View",
      anchor: "South · Water Construct Visibility",
      copy: "Hydration view separates pools, rivers, streams, gullies, wetlands, marshes, and waterfall candidates."
    },
    lattice: {
      title: "Lattice View",
      anchor: "West · 16 × 16 / 256",
      copy: "Lattice view preserves the diagnostic 256 inspection field."
    },
    receipt: {
      title: "Receipt View",
      anchor: "Northwest · Construct Visibility Receipt",
      copy: "Receipt view proves land/water construct visibility while preserving child authority and final-pass holds."
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
      terrainDatumPacket: null,
      streamRegistry: null,

      terrainNodes: [],
      surfaceUnits: [],
      hydrationSeats: [],
      terrainDatumNodes: [],
      summits: [],

      organicTerrainMass: null,
      surfaceBlendUnits: [],
      hydrationFlowGraph: null,
      basinPools: [],
      riverPaths: [],
      streamPaths: [],
      gullyHints: [],
      waterfallHints: [],
      desertHints: [],
      mountainReserveHints: [],
      valleyCorridorHints: [],
      basinDepressionHints: [],
      coastHull: [],

      landFormationVisibilityMap: null,
      waterConstructVisibilityMap: null,
      ridgeSpineVisibility: [],
      basinDepressionVisibility: [],
      valleyCorridorVisibility: [],
      dryZoneVisibility: [],
      poolVisibilityRegistry: [],
      riverVisibilityRegistry: [],
      streamVisibilityRegistry: [],
      gullyVisibilityRegistry: [],
      waterfallVisibilityRegistry: [],

      visualExpressionReady: false,
      landWaterConstructVisibilityReady: false,
      packetShapeAdapted: false,
      consumedShape: "none",
      failureReason: "Gratitude child not checked",
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

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function deepClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
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
    state.errors.push({
      scope: scope,
      message: error && error.message ? error.message : String(error || "unknown"),
      time: new Date().toISOString()
    });
  }

  function distance2D(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
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
      lon: -142 + (finite(x, 0) / 15) * 108,
      lat: 56 - (finite(y, 0) / 15) * 112
    };
  }

  function gridPointToSpherePoint(item) {
    var ll = terrainSeatToLonLat(finite(item.x, 0), finite(item.y, 0));
    return lonLatPoint(ll.lon, ll.lat);
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

  function drawHydrosphereBody() {
    var hydration = state.activeLens === "hydration";
    var body = state.activeLens === "body";

    var bandAlpha = hydration ? 0.36 : body ? 0.10 : 0.12;
    var currentAlpha = hydration ? 0.38 : body ? 0.12 : 0.16;

    for (var i = 0; i < HYDRO_DEPTH_BANDS.length; i += 1) {
      drawProjectedPath(
        HYDRO_DEPTH_BANDS[i],
        "rgba(85,201,236,0.34)",
        Math.max(0.65, state.dpr * (hydration ? 1.02 : 0.54)),
        bandAlpha
      );
    }

    for (var j = 0; j < HYDRO_CURRENT_ARCS.length; j += 1) {
      drawProjectedPath(
        HYDRO_CURRENT_ARCS[j],
        "rgba(182,245,255,0.26)",
        Math.max(0.62, state.dpr * (hydration ? 0.90 : 0.48)),
        currentAlpha
      );
    }
  }

  function getGlobalAPI() {
    return window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD ||
      window.AUDRALIA_GRATITUDE_CONTINENT_CHILD ||
      null;
  }

  function normalizeTerrainNodeForCarrier(raw, fallbackIndex) {
    raw = raw || {};
    var seatIndex = finite(raw.seatIndex, finite(raw.nodeIndex, fallbackIndex || 0));
    var x = finite(raw.x, finite(raw.centerX, seatIndex % 16));
    var y = finite(raw.y, finite(raw.centerY, Math.floor(seatIndex / 16)));
    var terrainDatum = raw.terrainDatum || {};
    var terrainDatumClass = String(terrainDatum.terrainDatumClass || raw.terrainDatumClass || "");

    var land = Boolean(
      raw.continentMembership === true ||
      raw.land === true ||
      raw.continentId === "gratitude" ||
      raw.aboveSeaLevelMass === true ||
      terrainDatum.aboveSeaLevelMass === true
    );

    var elevation = finite(
      raw.elevation,
      finite(raw.surfaceExpressionDatum, finite(terrainDatum.surfaceExpressionDatum, land ? 0.48 : 0))
    );

    var hydrationDepth = finite(raw.hydrationDepth, finite(raw.waterDepth, finite(raw.hydrationPressure, 0)));
    var terrainClass = String(raw.terrainClass || terrainDatumClass || "surface_expression_datum");
    var hydrationClass = String(raw.hydrationClass || "dry_land");
    var primaryCategory = String(raw.primaryCategory || raw.category || "surface");

    var ridgePressure = finite(raw.ridgePressure, terrainClass.indexOf("ridge") >= 0 || terrainDatumClass.indexOf("ridge") >= 0 ? 0.72 : 0);
    var basinPressure = finite(raw.basinPressure, terrainClass.indexOf("basin") >= 0 || terrainDatumClass.indexOf("basin") >= 0 ? 0.72 : 0);
    var valleyPressure = finite(raw.valleyPressure, terrainClass.indexOf("valley") >= 0 || terrainDatumClass.indexOf("valley") >= 0 ? 0.72 : 0);
    var coastPressure = finite(raw.coastPressure, terrainClass.indexOf("coast") >= 0 || terrainDatumClass.indexOf("coast") >= 0 ? 0.72 : 0);
    var summitPressure = finite(raw.summitPressure, terrainClass.indexOf("summit") >= 0 ? 0.74 : 0);
    var marshPressure = finite(raw.marshPressure, terrainClass.indexOf("marsh") >= 0 || hydrationClass.indexOf("marsh") >= 0 ? 0.70 : 0);
    var wetlandPressure = finite(raw.wetlandPressure, terrainClass.indexOf("wetland") >= 0 || hydrationClass.indexOf("wetland") >= 0 ? 0.70 : 0);
    var desertPressure = finite(raw.desertReservationPressure, terrainDatum.desertReservationDatum || 0);
    var rainShadowPressure = finite(raw.rainShadowPressure, terrainDatum.rainShadowReservationDatum || 0);
    var waterTable = finite(raw.waterTableDatumHeld, finite(terrainDatum.waterTableDatumHeld, 0));
    var basinFloor = finite(raw.basinFloorDatum, finite(terrainDatum.basinFloorDatum, 0));
    var valleyFloor = finite(raw.valleyFloorDatum, finite(terrainDatum.valleyFloorDatum, 0));

    return {
      source: raw,
      nodeId: String(raw.nodeId || raw.sourceNodeId || raw.seatKey || ("carrier-node-" + (fallbackIndex || 0))),
      seatIndex: seatIndex,
      seatKey: String(raw.seatKey || ("G-" + String(Math.floor(y)).padStart(2, "0") + "-" + String(Math.floor(x)).padStart(2, "0"))),
      x: x,
      y: y,
      land: land,
      continentMembership: land,
      terrainClass: terrainClass,
      hydrationClass: hydrationClass,
      primaryCategory: primaryCategory,
      terrainDatumClass: terrainDatumClass,
      elevation: clamp(elevation, 0, 1),
      baseElevation: clamp(finite(raw.baseElevation, elevation), 0, 1),
      hydrationDepth: clamp(hydrationDepth, 0, 1),
      waterFillEligible: Boolean(raw.waterFillEligible === true || hydrationDepth > 0.035 || hydrationClass.indexOf("lake") >= 0 || hydrationClass.indexOf("wet") >= 0 || hydrationClass.indexOf("marsh") >= 0),
      ridgePressure: clamp(ridgePressure, 0, 1),
      basinPressure: clamp(basinPressure, 0, 1),
      valleyPressure: clamp(valleyPressure, 0, 1),
      coastPressure: clamp(coastPressure, 0, 1),
      shelfPressure: clamp(finite(raw.shelfPressure, 0), 0, 1),
      summitPressure: clamp(summitPressure, 0, 1),
      marshPressure: clamp(marshPressure, 0, 1),
      wetlandPressure: clamp(wetlandPressure, 0, 1),
      hydrationPressure: clamp(finite(raw.hydrationPressure, hydrationDepth), 0, 1),
      drainagePressure: clamp(finite(raw.drainagePressure, valleyPressure), 0, 1),
      runoffPressure: clamp(finite(raw.runoffPressure, 0), 0, 1),
      texturePressure: clamp(finite(raw.texturePressure, 0.36), 0, 1),
      soilPressure: clamp(finite(raw.soilPressure, 0.34), 0, 1),
      mineralPressure: clamp(finite(raw.mineralPressure, 0.12), 0, 1),
      desertReservationPressure: clamp(desertPressure, 0, 1),
      rainShadowPressure: clamp(rainShadowPressure, 0, 1),
      waterTableDatumHeld: clamp(waterTable, 0, 1),
      basinFloorDatum: clamp(basinFloor, 0, 1),
      valleyFloorDatum: clamp(valleyFloor, 0, 1),
      ridgeStatus: Boolean(raw.ridgeStatus === true || ridgePressure > 0.54),
      basinStatus: Boolean(raw.basinStatus === true || basinPressure > 0.44),
      valleyStatus: Boolean(raw.valleyStatus === true || valleyPressure > 0.46),
      coastEligible: Boolean(raw.coastEligible === true || coastPressure > 0.50),
      mountainRangeReserved: Boolean(raw.mountainRangeReserved === true || terrainDatum.mountainRangeReserved === true || summitPressure > 0.52 || ridgePressure > 0.56),
      desertLandReserved: Boolean(raw.desertLandReserved === true || terrainDatum.desertLandReserved === true || desertPressure > 0.46 || rainShadowPressure > 0.50),
      dryBasinReserved: Boolean(raw.dryBasinReserved === true || terrainDatum.dryBasinReserved === true || (basinPressure > 0.38 && hydrationDepth < 0.05)),
      terrainDatum: terrainDatum
    };
  }

  function normalizeSurfaceUnitForCarrier(raw, fallbackIndex) {
    raw = raw || {};
    var channels = raw.textureChannels || {};
    var elevation = clamp(finite(raw.elevation, 0.44), 0, 1);
    var hydrationDepth = clamp(finite(raw.hydrationDepth, 0), 0, 1);

    return {
      source: raw,
      tileId: String(raw.tileId || raw.terrainUnitId || ("surface-unit-" + (fallbackIndex || 0))),
      parentNodeId: String(raw.parentNodeId || ""),
      x: finite(raw.x, 0),
      y: finite(raw.y, 0),
      rx: clamp(finite(raw.rx, 0.13), 0.04, 0.28),
      ry: clamp(finite(raw.ry, 0.11), 0.04, 0.26),
      elevation: elevation,
      hydrationDepth: hydrationDepth,
      terrainClass: String(raw.terrainClass || "surface_expression"),
      hydrationClass: String(raw.hydrationClass || "dry_land"),
      waterFillEligible: Boolean(raw.waterFillEligible === true || hydrationDepth > 0.04),
      rock: clamp(finite(channels.rock, elevation * 0.42), 0, 1),
      soil: clamp(finite(channels.soil, 0.44), 0, 1),
      mineral: clamp(finite(channels.mineral, 0.18), 0, 1),
      wetland: clamp(finite(channels.wetland, hydrationDepth), 0, 1),
      ridge: clamp(finite(channels.ridge, raw.ridgePressure || 0), 0, 1),
      basin: clamp(finite(channels.basin, raw.basinPressure || 0), 0, 1),
      coast: clamp(finite(channels.coast, raw.coastPressure || 0), 0, 1),
      texturePressure: clamp(finite(raw.texturePressure, 0.18 + elevation * 0.10), 0, 1)
    };
  }

  function normalizeDatumNodeForCarrier(raw, fallbackIndex) {
    raw = raw || {};
    return {
      source: raw,
      datumNodeId: String(raw.datumNodeId || raw.sourceNodeId || ("datum-" + (fallbackIndex || 0))),
      sourceNodeId: String(raw.sourceNodeId || ""),
      x: finite(raw.x, (fallbackIndex || 0) % 16),
      y: finite(raw.y, Math.floor((fallbackIndex || 0) / 16)),
      terrainDatumClass: String(raw.terrainDatumClass || "surface_expression_datum"),
      seaLevelDatum: clamp(finite(raw.seaLevelDatum, 0.32), 0, 1),
      aboveSeaLevelMass: Boolean(raw.aboveSeaLevelMass),
      surfaceExpressionDatum: clamp(finite(raw.surfaceExpressionDatum, 0.44), 0, 1),
      ridgeCrestDatum: clamp(finite(raw.ridgeCrestDatum, 0.50), 0, 1),
      valleyFloorDatum: clamp(finite(raw.valleyFloorDatum, 0.36), 0, 1),
      basinFloorDatum: clamp(finite(raw.basinFloorDatum, 0.34), 0, 1),
      basinRimDatum: clamp(finite(raw.basinRimDatum, 0.45), 0, 1),
      coastDatum: clamp(finite(raw.coastDatum, 0.32), 0, 1),
      waterTableDatumHeld: clamp(finite(raw.waterTableDatumHeld, 0.30), 0, 1),
      mountainRangeReserved: Boolean(raw.mountainRangeReserved),
      desertLandReserved: Boolean(raw.desertLandReserved),
      dryBasinReserved: Boolean(raw.dryBasinReserved),
      rainShadowZoneReserved: Boolean(raw.rainShadowZoneReserved)
    };
  }

  function normalizeSummitForCarrier(raw, fallbackIndex) {
    raw = raw || {};
    return {
      source: raw,
      id: String(raw.id || raw.summitId || ("summit-" + (fallbackIndex || 0))),
      name: String(raw.name || ("Summit " + ((fallbackIndex || 0) + 1))),
      x: finite(raw.x, 8),
      y: finite(raw.y, 8),
      elevationPressure: clamp(finite(raw.elevationPressure, 0.8), 0, 1.3)
    };
  }

  function compactStreamRegistry(raw) {
    if (!raw) return { available: false, streams: [] };
    if (Array.isArray(raw.streams)) {
      return {
        available: true,
        streams: raw.streams.map(function (stream) {
          return {
            streamId: String(stream.streamId || stream.id || "stream"),
            category: String(stream.category || ""),
            nodeCount: finite(stream.nodeCount, 0),
            renderEligible: Boolean(stream.renderEligible),
            downstreamFile: String(stream.downstreamFile || "")
          };
        })
      };
    }
    return { available: true, streams: [] };
  }

  function resolveGratitudeNodes(continentMap, packet) {
    var nodes = [];
    if (continentMap) {
      if (Array.isArray(continentMap.nodes)) nodes = nodes.concat(continentMap.nodes);
      if (Array.isArray(continentMap.seats)) nodes = nodes.concat(continentMap.seats);
    }
    if (!nodes.length && packet && packet.surfaceMap) {
      if (Array.isArray(packet.surfaceMap.nodes)) nodes = nodes.concat(packet.surfaceMap.nodes);
      if (Array.isArray(packet.surfaceMap.seats)) nodes = nodes.concat(packet.surfaceMap.seats);
    }

    return nodes.map(normalizeTerrainNodeForCarrier).filter(function (node) {
      return node.land || node.continentMembership;
    });
  }

  function resolveSurfaceUnits(continentMap, packet) {
    var units = [];
    if (continentMap && Array.isArray(continentMap.surfaceUnits)) units = units.concat(continentMap.surfaceUnits);
    if (!units.length && packet && packet.surfaceMap && Array.isArray(packet.surfaceMap.surfaceUnits)) {
      units = units.concat(packet.surfaceMap.surfaceUnits);
    }
    return units.map(normalizeSurfaceUnitForCarrier);
  }

  function resolveHydrationSeats(hydrationMap, terrainNodes, packet) {
    var raw = [];

    if (hydrationMap) {
      if (Array.isArray(hydrationMap.seats)) raw = raw.concat(hydrationMap.seats);
      if (Array.isArray(hydrationMap.nodes)) raw = raw.concat(hydrationMap.nodes);
    }

    if (!raw.length && packet && packet.hydrationMap) {
      if (Array.isArray(packet.hydrationMap.seats)) raw = raw.concat(packet.hydrationMap.seats);
      if (Array.isArray(packet.hydrationMap.nodes)) raw = raw.concat(packet.hydrationMap.nodes);
    }

    var normalized = raw.map(normalizeTerrainNodeForCarrier).filter(function (node) {
      return node.land && (
        node.waterFillEligible ||
        node.hydrationDepth > 0.018 ||
        node.basinStatus ||
        node.valleyStatus ||
        node.marshPressure > 0.36 ||
        node.wetlandPressure > 0.36
      );
    });

    if (!normalized.length) {
      normalized = terrainNodes.filter(function (node) {
        return node.waterFillEligible || node.hydrationDepth > 0.025 || node.basinPressure > 0.36 || node.valleyPressure > 0.42;
      });
    }

    var seen = {};
    var deduped = [];
    normalized.forEach(function (node) {
      var key = node.seatKey || node.nodeId;
      if (seen[key]) return;
      seen[key] = true;
      deduped.push(node);
    });

    return deduped;
  }

  function resolveTerrainDatumNodes(api, packet) {
    var datum = null;
    try {
      if (api && typeof api.getTerrainDatumPacket === "function") {
        datum = api.getTerrainDatumPacket("audralia-carrier-land-water-construct-visibility", { compact: false });
      }
    } catch (error) {
      recordError("getTerrainDatumPacket", error);
    }

    if (!datum && packet && packet.terrainDatumPacket) datum = packet.terrainDatumPacket;
    var nodes = datum && Array.isArray(datum.datumNodes) ? datum.datumNodes : [];

    state.gratitude.terrainDatumPacket = datum;
    return nodes.map(normalizeDatumNodeForCarrier);
  }

  function resolveSummits(summitMap, packet) {
    var summits = [];
    if (summitMap && Array.isArray(summitMap.summits)) summits = summits.concat(summitMap.summits);
    if (!summits.length && packet && packet.summitMap && Array.isArray(packet.summitMap.summits)) {
      summits = summits.concat(packet.summitMap.summits);
    }
    return summits.map(normalizeSummitForCarrier);
  }

  function convexHull(points) {
    if (points.length <= 3) return points.slice();

    var sorted = points.slice().sort(function (a, b) {
      return a.x === b.x ? a.y - b.y : a.x - b.x;
    });

    function cross(o, a, b) {
      return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }

    var lower = [];
    var i;
    for (i = 0; i < sorted.length; i += 1) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], sorted[i]) <= 0) {
        lower.pop();
      }
      lower.push(sorted[i]);
    }

    var upper = [];
    for (i = sorted.length - 1; i >= 0; i -= 1) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], sorted[i]) <= 0) {
        upper.pop();
      }
      upper.push(sorted[i]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }

  function buildOrganicTerrainMass(nodes) {
    if (!nodes.length) return null;

    var totalX = 0;
    var totalY = 0;
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    var elevationTotal = 0;

    nodes.forEach(function (node) {
      totalX += node.x;
      totalY += node.y;
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
      elevationTotal += node.elevation;
    });

    return {
      ready: true,
      nodeCount: nodes.length,
      centroid: { x: totalX / nodes.length, y: totalY / nodes.length },
      bounds: { minX: minX, maxX: maxX, minY: minY, maxY: maxY },
      averageElevation: elevationTotal / nodes.length,
      hull: convexHull(nodes.map(function (node) { return { x: node.x, y: node.y }; })),
      organicRadiusX: Math.max(0.62, (maxX - minX) / 10),
      organicRadiusY: Math.max(0.42, (maxY - minY) / 10)
    };
  }

  function buildSurfaceBlendUnits(surfaceUnits) {
    var maxUnits = 280;
    var step = surfaceUnits.length > maxUnits ? Math.ceil(surfaceUnits.length / maxUnits) : 1;
    var result = [];

    for (var i = 0; i < surfaceUnits.length; i += step) {
      var unit = surfaceUnits[i];
      var wet = unit.hydrationDepth > 0.05 || unit.wetland > 0.22;
      var ridge = unit.ridge > 0.30 || unit.terrainClass.indexOf("ridge") >= 0;
      var basin = unit.basin > 0.25 || unit.terrainClass.indexOf("basin") >= 0;
      var textureAlpha = clamp(0.08 + unit.texturePressure * 0.14 + unit.soil * 0.06, 0.08, 0.23);

      result.push({
        x: unit.x,
        y: unit.y,
        rx: unit.rx,
        ry: unit.ry,
        elevation: unit.elevation,
        hydrationDepth: unit.hydrationDepth,
        wet: wet,
        ridge: ridge,
        basin: basin,
        coast: unit.coast > 0.28,
        textureAlpha: textureAlpha,
        terrainClass: unit.terrainClass
      });
    }

    return result;
  }

  function rankPoolCandidate(node) {
    var hClass = String(node.hydrationClass || "");
    var dClass = String(node.terrainDatumClass || "");
    var lowland = clamp(1 - node.elevation, 0, 1);
    var waterTableSupport = node.waterTableDatumHeld > 0 ? clamp(node.waterTableDatumHeld + lowland * 0.22, 0, 1) : 0;
    var datumSupport = dClass.indexOf("basin") >= 0 || dClass.indexOf("valley") >= 0 ? 0.28 : 0;
    var classSupport = hClass.indexOf("lake") >= 0 ? 0.40 : hClass.indexOf("marsh") >= 0 || hClass.indexOf("wetland") >= 0 ? 0.34 : 0;

    return clamp(
      node.basinPressure * 0.36 +
      node.valleyPressure * 0.14 +
      node.hydrationDepth * 0.28 +
      node.hydrationPressure * 0.18 +
      node.marshPressure * 0.24 +
      node.wetlandPressure * 0.24 +
      waterTableSupport * 0.16 +
      datumSupport +
      classSupport +
      lowland * 0.06,
      0,
      1.5
    );
  }

  function nearestLowerHydrationCandidate(node, candidates) {
    var best = null;
    var bestScore = Infinity;

    for (var i = 0; i < candidates.length; i += 1) {
      var other = candidates[i];
      if (other.nodeId === node.nodeId) continue;

      var d = distance2D(node.x, node.y, other.x, other.y);
      if (d < 0.1 || d > 3.45) continue;

      var lowerBias = other.elevation <= node.elevation + 0.06 ? 0 : 0.95;
      var valleyBias = other.valleyPressure > 0.34 || other.basinPressure > 0.34 ? -0.42 : 0.18;
      var depthBias = -other.hydrationDepth * 0.48;
      var poolBias = -rankPoolCandidate(other) * 0.38;
      var score = d + lowerBias + valleyBias + depthBias + poolBias;

      if (score < bestScore) {
        best = other;
        bestScore = score;
      }
    }

    return best;
  }

  function buildHydrationFlowGraph(hydrationNodes, terrainNodes) {
    var candidates = hydrationNodes.length ? hydrationNodes.slice() : terrainNodes.filter(function (node) {
      return node.waterFillEligible || node.valleyPressure > 0.42 || node.basinPressure > 0.34 || node.marshPressure > 0.32 || node.wetlandPressure > 0.32;
    });

    candidates.sort(function (a, b) {
      return b.elevation - a.elevation;
    });

    var poolCandidates = terrainNodes.map(function (node) {
      return { node: node, score: rankPoolCandidate(node) };
    }).filter(function (entry) {
      return entry.score > 0.34 ||
        entry.node.basinPressure > 0.36 ||
        entry.node.marshPressure > 0.34 ||
        entry.node.wetlandPressure > 0.34 ||
        entry.node.hydrationClass.indexOf("lake") >= 0 ||
        entry.node.hydrationClass.indexOf("wetland") >= 0 ||
        entry.node.hydrationClass.indexOf("marsh") >= 0 ||
        entry.node.terrainDatumClass.indexOf("basin") >= 0 ||
        entry.node.terrainDatumClass.indexOf("valley") >= 0;
    }).sort(function (a, b) {
      return b.score - a.score;
    });

    var pools = [];
    var poolSeen = {};

    poolCandidates.slice(0, 18).forEach(function (entry) {
      var node = entry.node;
      var key = node.seatKey || node.nodeId;
      if (poolSeen[key]) return;
      poolSeen[key] = true;

      var kind = node.hydrationClass.indexOf("marsh") >= 0 || node.marshPressure > 0.48
        ? "marsh_pool"
        : node.hydrationClass.indexOf("wetland") >= 0 || node.wetlandPressure > 0.48
          ? "wetland_pool"
          : node.basinPressure > 0.42 || node.terrainDatumClass.indexOf("basin") >= 0
            ? "basin_lake_pool"
            : "lowland_pool";

      pools.push({
        node: node,
        score: entry.score,
        radius: clamp(0.28 + entry.score * 0.52 + node.basinPressure * 0.22, 0.26, 0.96),
        kind: kind
      });
    });

    if (!pools.length && terrainNodes.length) {
      var fallback = terrainNodes.slice().sort(function (a, b) {
        return rankPoolCandidate(b) - rankPoolCandidate(a);
      }).slice(0, 3);

      fallback.forEach(function (node) {
        if (rankPoolCandidate(node) <= 0.20 && !(node.basinPressure > 0.24 || node.valleyPressure > 0.34)) return;
        pools.push({
          node: node,
          score: Math.max(0.24, rankPoolCandidate(node)),
          radius: clamp(0.28 + rankPoolCandidate(node) * 0.48, 0.24, 0.72),
          kind: "lowland_retention_pool"
        });
      });
    }

    var edges = [];
    var rivers = [];
    var streams = [];
    var gullies = [];
    var waterfalls = [];
    var seenEdges = {};

    candidates.forEach(function (node) {
      var next = nearestLowerHydrationCandidate(node, candidates);
      if (!next) return;

      var key = node.nodeId < next.nodeId ? node.nodeId + "::" + next.nodeId : next.nodeId + "::" + node.nodeId;
      if (seenEdges[key]) return;
      seenEdges[key] = true;

      var drop = node.elevation - next.elevation;
      var pressure = clamp(
        node.hydrationDepth * 0.34 +
        node.valleyPressure * 0.28 +
        node.basinPressure * 0.14 +
        next.basinPressure * 0.18 +
        rankPoolCandidate(next) * 0.15 +
        Math.max(0, drop) * 0.46,
        0,
        1
      );

      var edge = {
        from: node,
        to: next,
        drop: drop,
        pressure: pressure,
        width: clamp(0.52 + pressure * 2.35, 0.48, 3.10),
        major: pressure > 0.42 || node.basinPressure > 0.46 || next.basinPressure > 0.46,
        kind: pressure > 0.46 ? "river" : pressure > 0.24 ? "stream" : "gully"
      };

      edges.push(edge);
      if (edge.kind === "river") rivers.push(edge);
      else if (edge.kind === "stream") streams.push(edge);
      else gullies.push(edge);

      if (drop > 0.12 && (node.ridgePressure > 0.28 || node.summitPressure > 0.30) && next.valleyPressure > 0.22) {
        waterfalls.push({
          from: node,
          to: next,
          drop: drop,
          pressure: pressure,
          kind: "waterfall_candidate"
        });
      }
    });

    var ridgeSources = terrainNodes.filter(function (node) {
      return node.mountainRangeReserved && (node.ridgePressure > 0.42 || node.summitPressure > 0.42);
    }).slice(0, 18);

    ridgeSources.forEach(function (source) {
      var nearest = null;
      var best = Infinity;
      candidates.concat(pools.map(function (pool) { return pool.node; })).forEach(function (target) {
        var d = distance2D(source.x, source.y, target.x, target.y);
        var drop = source.elevation - target.elevation;
        if (d < 0.3 || d > 3.8 || drop < 0.015) return;
        var score = d - target.valleyPressure * 0.35 - target.basinPressure * 0.35 - rankPoolCandidate(target) * 0.30 - drop * 0.55;
        if (score < best) {
          best = score;
          nearest = target;
        }
      });

      if (nearest) {
        gullies.push({
          from: source,
          to: nearest,
          drop: source.elevation - nearest.elevation,
          pressure: 0.20 + nearest.hydrationDepth * 0.18 + nearest.basinPressure * 0.08,
          width: 0.58,
          major: false,
          kind: "summit_gully"
        });
      }
    });

    return {
      ready: true,
      candidateCount: candidates.length,
      edges: edges,
      pools: pools,
      rivers: rivers,
      streams: streams,
      gullies: gullies,
      waterfalls: waterfalls
    };
  }

  function buildTerrainHints(nodes) {
    var mountains = [];
    var deserts = [];
    var valleys = [];
    var basins = [];

    nodes.forEach(function (node) {
      if (node.mountainRangeReserved || node.ridgePressure > 0.50 || node.summitPressure > 0.46) {
        mountains.push({
          node: node,
          pressure: clamp(node.ridgePressure * 0.48 + node.summitPressure * 0.50 + node.elevation * 0.16, 0, 1)
        });
      }

      if (node.desertLandReserved || node.desertReservationPressure > 0.42 || node.rainShadowPressure > 0.44 || node.dryBasinReserved) {
        deserts.push({
          node: node,
          pressure: clamp(node.desertReservationPressure * 0.55 + node.rainShadowPressure * 0.35 + (1 - node.hydrationDepth) * 0.15, 0, 1)
        });
      }

      if (node.valleyStatus || node.valleyPressure > 0.40 || node.terrainDatumClass.indexOf("valley") >= 0) {
        valleys.push({
          node: node,
          pressure: clamp(node.valleyPressure * 0.72 + node.drainagePressure * 0.20 + (1 - node.elevation) * 0.08, 0, 1)
        });
      }

      if (node.basinStatus || node.basinPressure > 0.34 || node.terrainDatumClass.indexOf("basin") >= 0) {
        basins.push({
          node: node,
          pressure: clamp(node.basinPressure * 0.74 + rankPoolCandidate(node) * 0.18 + (1 - node.elevation) * 0.08, 0, 1)
        });
      }
    });

    return {
      mountains: mountains.sort(function (a, b) { return b.pressure - a.pressure; }).slice(0, 34),
      deserts: deserts.sort(function (a, b) { return b.pressure - a.pressure; }).slice(0, 28),
      valleys: valleys.sort(function (a, b) { return b.pressure - a.pressure; }).slice(0, 34),
      basins: basins.sort(function (a, b) { return b.pressure - a.pressure; }).slice(0, 28)
    };
  }

  function buildLandWaterConstructVisibilityMaps() {
    var hints = buildTerrainHints(state.gratitude.terrainNodes);
    var graph = state.gratitude.hydrationFlowGraph || { pools: [], rivers: [], streams: [], gullies: [], waterfalls: [] };

    state.gratitude.ridgeSpineVisibility = hints.mountains;
    state.gratitude.basinDepressionVisibility = hints.basins;
    state.gratitude.valleyCorridorVisibility = hints.valleys;
    state.gratitude.dryZoneVisibility = hints.deserts;
    state.gratitude.poolVisibilityRegistry = graph.pools;
    state.gratitude.riverVisibilityRegistry = graph.rivers;
    state.gratitude.streamVisibilityRegistry = graph.streams;
    state.gratitude.gullyVisibilityRegistry = graph.gullies;
    state.gratitude.waterfallVisibilityRegistry = graph.waterfalls;

    state.gratitude.landFormationVisibilityMap = {
      active: true,
      ridgeSpineCount: state.gratitude.ridgeSpineVisibility.length,
      basinDepressionCount: state.gratitude.basinDepressionVisibility.length,
      valleyCorridorCount: state.gratitude.valleyCorridorVisibility.length,
      dryZoneCount: state.gratitude.dryZoneVisibility.length,
      coastHullCount: state.gratitude.coastHull.length,
      seaLevelBaselinePreserved: true,
      terrainTruthInvented: false
    };

    state.gratitude.waterConstructVisibilityMap = {
      active: true,
      poolCount: state.gratitude.poolVisibilityRegistry.length,
      riverCount: state.gratitude.riverVisibilityRegistry.length,
      streamCount: state.gratitude.streamVisibilityRegistry.length,
      gullyCount: state.gratitude.gullyVisibilityRegistry.length,
      waterfallCount: state.gratitude.waterfallVisibilityRegistry.length,
      seaLevelBaselinePreserved: true,
      hydrationTruthInvented: false
    };

    state.gratitude.landWaterConstructVisibilityReady = Boolean(
      state.gratitude.visualExpressionReady &&
      state.gratitude.landFormationVisibilityMap.active &&
      state.gratitude.waterConstructVisibilityMap.active
    );
  }

  function buildOrganicVisualExpression() {
    var nodes = state.gratitude.terrainNodes;
    var units = state.gratitude.surfaceUnits;
    var hydration = state.gratitude.hydrationSeats;

    state.gratitude.organicTerrainMass = buildOrganicTerrainMass(nodes);
    state.gratitude.surfaceBlendUnits = buildSurfaceBlendUnits(units);
    state.gratitude.hydrationFlowGraph = buildHydrationFlowGraph(hydration, nodes);

    state.gratitude.basinPools = state.gratitude.hydrationFlowGraph.pools;
    state.gratitude.riverPaths = state.gratitude.hydrationFlowGraph.rivers;
    state.gratitude.streamPaths = state.gratitude.hydrationFlowGraph.streams;
    state.gratitude.gullyHints = state.gratitude.hydrationFlowGraph.gullies;
    state.gratitude.waterfallHints = state.gratitude.hydrationFlowGraph.waterfalls;

    var hints = buildTerrainHints(nodes);
    state.gratitude.mountainReserveHints = hints.mountains;
    state.gratitude.desertHints = hints.deserts;
    state.gratitude.valleyCorridorHints = hints.valleys;
    state.gratitude.basinDepressionHints = hints.basins;
    state.gratitude.coastHull = state.gratitude.organicTerrainMass ? state.gratitude.organicTerrainMass.hull : [];
    state.gratitude.visualExpressionReady = Boolean(nodes.length && state.gratitude.organicTerrainMass && state.gratitude.hydrationFlowGraph.ready);

    buildLandWaterConstructVisibilityMaps();
  }

  function validateGratitudeChild() {
    state.gratitude.attempts += 1;
    state.gratitude.checkedAt = new Date().toISOString();

    var api = getGlobalAPI();

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
    state.gratitude.streamRegistry = null;
    state.gratitude.terrainNodes = [];
    state.gratitude.surfaceUnits = [];
    state.gratitude.hydrationSeats = [];
    state.gratitude.terrainDatumNodes = [];
    state.gratitude.summits = [];
    state.gratitude.packetShapeAdapted = false;
    state.gratitude.visualExpressionReady = false;
    state.gratitude.landWaterConstructVisibilityReady = false;

    if (!api) {
      state.gratitude.failureReason = "Gratitude child missing / invalid · land/water visibility held";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
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
      state.gratitude.failureReason = "Gratitude child API incomplete · land/water visibility held";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }

    try {
      var status = api.status();
      var packet = api.getChildReceivePacket("audralia-clean-planet-carrier-land-water-construct-visibility", { compact: false });
      var continentMap = api.getContinentMap({ compact: false });
      var elevationMap = typeof api.getElevationMap === "function" ? api.getElevationMap({ compact: false }) : null;
      var hydrationMap = api.getHydrationMap({ compact: false });
      var summitMap = api.getSummitMap({ compact: false });
      var streamRegistry = typeof api.getStreamRegistry === "function" ? api.getStreamRegistry({ compact: true }) : null;

      state.gratitude.status = status;
      state.gratitude.packet = packet;
      state.gratitude.continentMap = continentMap;
      state.gratitude.elevationMap = elevationMap;
      state.gratitude.hydrationMap = hydrationMap;
      state.gratitude.summitMap = summitMap;
      state.gratitude.streamRegistry = compactStreamRegistry(streamRegistry);

      state.gratitude.packetReady = Boolean(packet && packet.childReceivePacketReady === true);
      state.gratitude.terrainNodes = resolveGratitudeNodes(continentMap, packet);
      state.gratitude.surfaceUnits = resolveSurfaceUnits(continentMap, packet);
      state.gratitude.hydrationSeats = resolveHydrationSeats(hydrationMap, state.gratitude.terrainNodes, packet);
      state.gratitude.terrainDatumNodes = resolveTerrainDatumNodes(api, packet);
      state.gratitude.summits = resolveSummits(summitMap, packet);

      state.gratitude.packetShapeAdapted = Boolean(
        state.gratitude.packetReady &&
        state.gratitude.terrainNodes.length > 0 &&
        state.gratitude.surfaceUnits.length > 0 &&
        state.gratitude.terrainDatumNodes.length >= 128
      );

      state.gratitude.consumedShape = state.gratitude.surfaceUnits.length
        ? "nodes_plus_surface_units"
        : state.gratitude.terrainNodes.length
          ? "nodes_only"
          : "none";

      state.gratitude.validated = Boolean(
        state.gratitude.packetReady &&
        packet.landFirst === true &&
        packet.nineSummitsEmbedded === true &&
        packet.hydrationIsConsequence === true &&
        packet.waterFillDerivedFromValleys === true &&
        packet.finalVisualPassClaim === false &&
        state.gratitude.packetShapeAdapted === true
      );

      if (state.gratitude.validated) buildOrganicVisualExpression();

      state.gratitude.failureReason = state.gratitude.validated
        ? ""
        : "Gratitude child packet validation failed · land/water visibility held";

      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(12);

      return state.gratitude.validated;
    } catch (error) {
      recordError("validateGratitudeChild", error);
      state.gratitude.failureReason = "Gratitude child packet exception · land/water visibility held";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }
  }

  function drawOrganicBlob(item, options) {
    var ctx = state.ctx;
    var p = projectPoint(gridPointToSpherePoint(item));
    if (!p.frontFacing) return;

    var m = metrics();
    var radius = m.radius * clamp(options.radius || 0.075, 0.012, 0.22) * p.perspective;
    var rx = radius * clamp(options.rxScale || 1.0, 0.5, 3.2);
    var ry = radius * clamp(options.ryScale || 0.82, 0.30, 2.4);
    var alpha = clamp(options.alpha || 0.25, 0, 1);
    var rotation = finite(options.rotation, state.roll * 0.8);

    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(rx, ry));
    gradient.addColorStop(0.00, options.center || "rgba(126,157,94,0.60)");
    gradient.addColorStop(0.58, options.mid || "rgba(103,139,82,0.34)");
    gradient.addColorStop(1.00, options.edge || "rgba(103,139,82,0)");

    ctx.save();
    clipSphere();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    try {
      ctx.ellipse(p.x, p.y, rx, ry, rotation, 0, TAU);
    } catch (_ellipseError) {
      ctx.arc(p.x, p.y, Math.max(rx, ry), 0, TAU);
    }
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function drawOrganicTerrainMass(mode) {
    if (!state.gratitude.visualExpressionReady) return;

    var nodes = state.gratitude.terrainNodes;
    var bodyMode = mode === "body";
    var hydrationMode = mode === "hydration";
    var baseAlpha = bodyMode ? 0.070 : hydrationMode ? 0.16 : 0.34;
    var radius = bodyMode ? 0.054 : hydrationMode ? 0.066 : 0.080;

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var elevation = node.elevation;
      var wet = node.hydrationDepth > 0.055 || node.wetlandPressure > 0.42;
      var dry = node.desertLandReserved || node.desertReservationPressure > 0.44;
      var ridge = node.ridgePressure > 0.50 || node.summitPressure > 0.50;
      var basin = node.basinPressure > 0.40;

      var center = dry
        ? "rgba(166,134,78,0.62)"
        : ridge
          ? "rgba(154,147,101,0.62)"
          : basin
            ? "rgba(84,124,88,0.60)"
            : wet
              ? "rgba(96,149,105,0.62)"
              : "rgba(" +
                Math.floor(86 + elevation * 54) + "," +
                Math.floor(116 + elevation * 48) + "," +
                Math.floor(72 + elevation * 26) + ",0.62)";

      var mid = dry
        ? "rgba(138,114,70,0.34)"
        : ridge
          ? "rgba(135,132,94,0.32)"
          : basin
            ? "rgba(74,111,82,0.32)"
            : wet
              ? "rgba(84,132,95,0.34)"
              : "rgba(96,132,79,0.32)";

      drawOrganicBlob(node, {
        radius: radius + node.coastPressure * 0.010,
        rxScale: 1.22 + node.coastPressure * 0.20,
        ryScale: 0.84 + node.basinPressure * 0.12,
        alpha: baseAlpha + node.texturePressure * 0.035,
        center: center,
        mid: mid,
        edge: "rgba(86,120,75,0)"
      });
    }
  }

  function drawSurfaceBlendUnits() {
    if (!state.gratitude.visualExpressionReady || state.activeLens !== "surface") return;

    var units = state.gratitude.surfaceBlendUnits;
    for (var i = 0; i < units.length; i += 1) {
      var unit = units[i];
      var colorCenter = unit.ridge
        ? "rgba(193,174,118,0.46)"
        : unit.basin
          ? "rgba(73,103,76,0.38)"
          : unit.wet
            ? "rgba(82,144,110,0.38)"
            : "rgba(116,148,86,0.35)";

      drawOrganicBlob(unit, {
        radius: 0.022 + unit.elevation * 0.012,
        rxScale: 1.18,
        ryScale: 0.74,
        alpha: unit.textureAlpha,
        center: colorCenter,
        mid: "rgba(105,137,86,0.12)",
        edge: "rgba(105,137,86,0)"
      });
    }
  }

  function drawOrganicCoastSoftEdge() {
    if (!state.gratitude.coastHull || state.gratitude.coastHull.length < 3) return;

    var ctx = state.ctx;
    var projected = state.gratitude.coastHull.map(function (point) {
      return projectPoint(gridPointToSpherePoint(point));
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 3) return;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      var p = projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else {
        var prev = projected[i - 1];
        var mx = (prev.x + p.x) / 2;
        var my = (prev.y + p.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
    }

    ctx.closePath();
    ctx.strokeStyle = "rgba(223,232,169,0.24)";
    ctx.lineWidth = Math.max(0.80, state.dpr * 1.02);
    ctx.globalAlpha = state.activeLens === "surface" ? 0.82 : 0.32;
    ctx.stroke();

    ctx.strokeStyle = "rgba(141,216,255,0.15)";
    ctx.lineWidth = Math.max(1.4, state.dpr * 1.75);
    ctx.globalAlpha = state.activeLens === "surface" ? 0.40 : 0.20;
    ctx.stroke();

    ctx.restore();
  }

  function gridPathSamples(a, b, count, curveScale) {
    var samples = [];
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var curve = Math.sin((a.x + b.y) * 0.9) * finite(curveScale, 0.18);

    for (var i = 0; i <= count; i += 1) {
      var t = i / count;
      var bend = Math.sin(Math.PI * t) * curve;
      samples.push({
        x: a.x + dx * t + bend,
        y: a.y + dy * t - bend * 0.55
      });
    }

    return samples;
  }

  function drawGridPath(samples, options) {
    var ctx = state.ctx;
    var projected = samples.map(function (sample) {
      return projectPoint(gridPointToSpherePoint(sample));
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 2) return;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      var p = projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = options.stroke;
    ctx.lineWidth = Math.max(0.32, state.dpr * finite(options.width, 1));
    ctx.globalAlpha = clamp(finite(options.alpha, 0.5), 0, 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    if (options.glow) {
      ctx.strokeStyle = options.glow;
      ctx.lineWidth = Math.max(0.62, state.dpr * finite(options.width, 1) * 2.5);
      ctx.globalAlpha = clamp(finite(options.alpha, 0.5) * 0.16, 0, 1);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRidgeSpineVisibility() {
    if (state.activeLens !== "surface") return;

    var ctx = state.ctx;
    var hints = state.gratitude.ridgeSpineVisibility;

    for (var i = 0; i < hints.length; i += 1) {
      var hint = hints[i];
      var node = hint.node;
      var p = projectPoint(gridPointToSpherePoint(node));
      if (!p.frontFacing) continue;

      var size = Math.max(1.5, state.dpr * (1.8 + hint.pressure * 2.8) * p.perspective);

      ctx.save();
      clipSphere();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - size * 1.05);
      ctx.lineTo(p.x + size * 0.80, p.y + size * 0.62);
      ctx.lineTo(p.x - size * 0.80, p.y + size * 0.62);
      ctx.closePath();
      ctx.fillStyle = "rgba(245,220,158,0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p.x - size * 1.55, p.y + size * 0.38);
      ctx.lineTo(p.x + size * 1.55, p.y - size * 0.12);
      ctx.strokeStyle = "rgba(255,244,216,0.22)";
      ctx.lineWidth = Math.max(0.38, state.dpr * 0.48);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawBasinDepressionVisibility() {
    if (state.activeLens !== "surface") return;

    var hints = state.gratitude.basinDepressionVisibility;
    for (var i = 0; i < hints.length; i += 1) {
      drawOrganicBlob(hints[i].node, {
        radius: 0.050 + hints[i].pressure * 0.018,
        rxScale: 1.42,
        ryScale: 0.78,
        alpha: 0.22 + hints[i].pressure * 0.12,
        center: "rgba(49,76,62,0.42)",
        mid: "rgba(35,55,48,0.22)",
        edge: "rgba(35,55,48,0)"
      });
    }
  }

  function drawValleyCorridorVisibility() {
    if (state.activeLens !== "surface") return;

    var valleys = state.gratitude.valleyCorridorVisibility;
    var sorted = valleys.slice().sort(function (a, b) {
      return a.node.y === b.node.y ? a.node.x - b.node.x : a.node.y - b.node.y;
    });

    for (var i = 0; i < sorted.length - 1; i += 1) {
      var a = sorted[i].node;
      var b = sorted[i + 1].node;
      if (distance2D(a.x, a.y, b.x, b.y) > 2.4) continue;
      drawGridPath(gridPathSamples(a, b, 10, 0.11), {
        stroke: "rgba(62,91,68,0.42)",
        glow: "rgba(83,128,91,0.22)",
        width: 1.2 + Math.max(sorted[i].pressure, sorted[i + 1].pressure) * 1.2,
        alpha: 0.42
      });
    }
  }

  function drawDryZoneVisibility() {
    if (state.activeLens !== "surface") return;

    var hints = state.gratitude.dryZoneVisibility;
    for (var i = 0; i < hints.length; i += 1) {
      drawOrganicBlob(hints[i].node, {
        radius: 0.046 + hints[i].pressure * 0.014,
        rxScale: 1.38,
        ryScale: 0.70,
        alpha: 0.18 + hints[i].pressure * 0.14,
        center: "rgba(204,164,91,0.38)",
        mid: "rgba(170,132,74,0.18)",
        edge: "rgba(170,132,74,0)"
      });
    }
  }

  function drawFlowEdge(edge, options) {
    drawGridPath(gridPathSamples(edge.from, edge.to, 14, 0.18), {
      stroke: options.stroke,
      glow: options.glow,
      width: edge.width * options.widthScale,
      alpha: options.alpha
    });
  }

  function drawPoolVisibilityRegistry() {
    var pools = state.gratitude.poolVisibilityRegistry;
    for (var i = 0; i < pools.length; i += 1) {
      var pool = pools[i];
      var node = pool.node;
      var color = pool.kind === "marsh_pool"
        ? "rgba(86,190,151,0.58)"
        : pool.kind === "wetland_pool"
          ? "rgba(105,207,178,0.54)"
          : "rgba(101,219,246,0.62)";

      drawOrganicBlob(node, {
        radius: 0.036 + pool.radius * 0.040,
        rxScale: 1.55,
        ryScale: 0.76,
        alpha: state.activeLens === "hydration" ? 0.74 : 0.24,
        center: color,
        mid: "rgba(74,197,228,0.24)",
        edge: "rgba(74,197,228,0)"
      });

      if (state.activeLens === "hydration") {
        drawOrganicBlob(node, {
          radius: 0.020 + pool.radius * 0.026,
          rxScale: 1.40,
          ryScale: 0.62,
          alpha: 0.42,
          center: "rgba(226,255,255,0.40)",
          mid: "rgba(226,255,255,0.12)",
          edge: "rgba(226,255,255,0)"
        });
      }
    }
  }

  function drawRiverStreamVisibility() {
    var rivers = state.gratitude.riverVisibilityRegistry;
    var streams = state.gratitude.streamVisibilityRegistry;

    for (var i = 0; i < rivers.length; i += 1) {
      drawFlowEdge(rivers[i], {
        stroke: "rgba(118,232,251,0.84)",
        glow: "rgba(118,232,251,0.58)",
        widthScale: 1.20,
        alpha: state.activeLens === "hydration" ? 0.92 : 0.26
      });
    }

    for (var j = 0; j < streams.length; j += 1) {
      drawFlowEdge(streams[j], {
        stroke: "rgba(156,239,255,0.68)",
        glow: "rgba(156,239,255,0.42)",
        widthScale: 0.86,
        alpha: state.activeLens === "hydration" ? 0.76 : 0.20
      });
    }
  }

  function drawGullyWaterfallVisibility() {
    var gullies = state.gratitude.gullyVisibilityRegistry;
    var waterfalls = state.gratitude.waterfallVisibilityRegistry;

    for (var i = 0; i < gullies.length; i += 1) {
      drawFlowEdge(gullies[i], {
        stroke: "rgba(191,246,255,0.44)",
        glow: "rgba(191,246,255,0.26)",
        widthScale: 0.58,
        alpha: state.activeLens === "hydration" ? 0.54 : 0.12
      });
    }

    if (state.activeLens !== "hydration") return;

    var ctx = state.ctx;
    ctx.save();
    clipSphere();

    for (var k = 0; k < waterfalls.length; k += 1) {
      var hint = waterfalls[k];
      var mid = { x: (hint.from.x + hint.to.x) / 2, y: (hint.from.y + hint.to.y) / 2 };
      var p = projectPoint(gridPointToSpherePoint(mid));
      if (!p.frontFacing) continue;

      var len = Math.max(2, state.dpr * (2.6 + hint.drop * 9) * p.perspective);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - len * 0.55);
      ctx.lineTo(p.x, p.y + len * 0.55);
      ctx.strokeStyle = "rgba(226,252,255,0.66)";
      ctx.lineWidth = Math.max(0.45, state.dpr * 0.52);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y + len * 0.66, Math.max(0.75, state.dpr * 1.05), 0, TAU);
      ctx.fillStyle = "rgba(226,252,255,0.42)";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawWetlandMarshVisibility() {
    if (state.activeLens !== "hydration") return;

    state.gratitude.poolVisibilityRegistry.forEach(function (pool) {
      if (pool.kind !== "marsh_pool" && pool.kind !== "wetland_pool") return;
      drawOrganicBlob(pool.node, {
        radius: 0.060 + pool.radius * 0.026,
        rxScale: 1.72,
        ryScale: 0.86,
        alpha: 0.24,
        center: pool.kind === "marsh_pool" ? "rgba(76,174,130,0.34)" : "rgba(100,197,165,0.32)",
        mid: "rgba(74,142,122,0.14)",
        edge: "rgba(74,142,122,0)"
      });
    });
  }

  function drawSummitMarkers() {
    if (!state.gratitude.validated || state.activeLens !== "surface") return;

    var ctx = state.ctx;
    ctx.save();
    clipSphere();

    for (var i = 0; i < state.gratitude.summits.length; i += 1) {
      var summit = state.gratitude.summits[i];
      var p = projectPoint(gridPointToSpherePoint(summit));
      if (!p.frontFacing) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, state.dpr * 1.45 * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(244,207,131,0.58)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.8, state.dpr * 3.1 * p.perspective), 0, TAU);
      ctx.strokeStyle = "rgba(244,207,131,0.22)";
      ctx.lineWidth = Math.max(0.35, state.dpr * 0.42);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGratitudeConstructVisibility() {
    if (!state.gratitude.validated || !state.gratitude.visualExpressionReady) return;

    if (state.activeLens === "body") {
      drawOrganicTerrainMass("body");
      return;
    }

    if (state.activeLens === "surface") {
      drawOrganicTerrainMass("surface");
      drawBasinDepressionVisibility();
      drawValleyCorridorVisibility();
      drawDryZoneVisibility();
      drawOrganicCoastSoftEdge();
      drawSurfaceBlendUnits();
      drawRidgeSpineVisibility();
      drawSummitMarkers();
      return;
    }

    if (state.activeLens === "hydration") {
      drawOrganicTerrainMass("hydration");
      drawOrganicCoastSoftEdge();
      drawWetlandMarshVisibility();
      drawPoolVisibilityRegistry();
      drawRiverStreamVisibility();
      drawGullyWaterfallVisibility();
    }
  }

  function drawReferenceLines() {
    if (state.activeLens === "receipt" || state.activeLens === "surface") return;

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
    ctx.globalAlpha = state.activeLens === "body" ? 0.05 : 0.14;
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
    var w = Math.min(state.width * 0.80, m.radius * 2.10);
    var h = Math.min(state.height * 0.38, m.radius * 0.96);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    var visibility = state.gratitude.landWaterConstructVisibilityReady;
    var lineOne = visibility ? "LAND/WATER VISIBILITY ACTIVE" : "LAND/WATER VISIBILITY HELD";
    var lineTwo = "NODES " + state.gratitude.terrainNodes.length +
      " · SURFACE " + state.gratitude.surfaceUnits.length +
      " · HYDRATION " + state.gratitude.hydrationSeats.length;
    var lineThree = "RIDGES " + state.gratitude.ridgeSpineVisibility.length +
      " · BASINS " + state.gratitude.basinDepressionVisibility.length +
      " · VALLEYS " + state.gratitude.valleyCorridorVisibility.length;
    var lineFour = "POOLS " + state.gratitude.poolVisibilityRegistry.length +
      " · RIVERS " + state.gratitude.riverVisibilityRegistry.length +
      " · STREAMS " + state.gratitude.streamVisibilityRegistry.length +
      " · GULLIES " + state.gratitude.gullyVisibilityRegistry.length;
    var lineFive = "SEA LEVEL PRESERVED · CHILD AUTHORITY PRESERVED";
    var lineSix = "FINAL TERRAIN/HYDRATION/VISUAL PASS FALSE";

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.68)";
    ctx.strokeStyle = visibility ? "rgba(167,243,198,0.42)" : "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(11, 12.8 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = visibility ? "rgba(167,243,198,0.94)" : "rgba(244,207,131,0.92)";
    ctx.fillText(lineOne, m.centerX, y + h * 0.15);

    ctx.font = "900 " + Math.max(7.5, 8.2 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.86)";
    ctx.fillText(lineTwo, m.centerX, y + h * 0.31);

    ctx.fillStyle = "rgba(244,207,131,0.84)";
    ctx.fillText(lineThree, m.centerX, y + h * 0.46);

    ctx.fillStyle = "rgba(141,216,255,0.86)";
    ctx.fillText(lineFour, m.centerX, y + h * 0.61);

    ctx.fillStyle = "rgba(167,243,198,0.82)";
    ctx.fillText(lineFive, m.centerX, y + h * 0.76);

    ctx.fillStyle = "rgba(238,244,255,0.76)";
    ctx.fillText(lineSix, m.centerX, y + h * 0.90);

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
    drawGratitudeConstructVisibility();
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
      state.ctx.globalAlpha = 0.004;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.0012;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    }

    drawReceiptOverlay();
    state.renderCount += 1;
    publishStatus(false);

    if (state.settleFrames > 0) state.settleFrames -= 1;
    if (state.pointerActive || state.settleFrames > 0 || Math.abs(state.velocityYaw) > 0 || Math.abs(state.velocityPitch) > 0) {
      state.raf = window.requestAnimationFrame(drawFrame);
    }
  }

  function requestRender(settleFrames) {
    if (settleFrames) state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) state.raf = window.requestAnimationFrame(drawFrame);
  }

  function updateVisibleReadout(force) {
    var statusText = state.gratitude.landWaterConstructVisibilityReady
      ? "Land/water construct visibility active · sea-level baseline preserved"
      : state.gratitude.visualExpressionReady
        ? "Organic expression active · construct visibility pending"
        : state.gratitude.validated
          ? "Packet adapted · expression pending"
          : "Gratitude child missing / invalid · land/water visibility held";

    var proofText = state.gratitude.landWaterConstructVisibilityReady
      ? "ridges basins valleys dry zones pools rivers streams gullies visible · child authority preserved · final visual pass false"
      : state.gratitude.failureReason || "bounded failure · construct visibility held";

    var wroteStatus = setText("[data-audralia-planet-carrier-status]", statusText);
    var wroteProof = setText("[data-audralia-planet-carrier-proof]", proofText);

    state.visibleReadoutUpdated = Boolean(wroteStatus || wroteProof || force);

    setText("[data-audralia-planet-stage-label]", state.gratitude.landWaterConstructVisibilityReady
      ? "Land/water constructs live → Surface and Hydration reveal authored categories"
      : "Clean Inspection → Land/water constructs not fully visible"
    );

    return state.visibleReadoutUpdated;
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

    updateVisibleReadout(true);
    setDataset("audraliaPlanetActiveLens", lens);
    publishStatus(true);
    requestRender(lens === "body" ? 10 : 16);
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
    state.canvas.setAttribute("data-audralia-carrier-land-water-construct-visibility", CONTRACT);
    state.canvas.setAttribute("data-active-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-html-collaborative-contract", HTML_COLLABORATIVE_CONTRACT);
    state.canvas.setAttribute("data-carrier-consumes-child", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-land-water-construct-visibility-adapter-active", "true");
    state.canvas.setAttribute("data-sea-level-baseline-preserved", "true");
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
      htmlCollaborativeContract: HTML_COLLABORATIVE_CONTRACT,
      specOps: SPEC_OPS,
      route: ROUTE,
      target: FILE,
      gratitudeChildFile: GRATITUDE_CHILD_FILE,
      coreChildFile: CORE_CHILD_FILE,

      seaLevelBaselineAchieved: SEA_LEVEL_BASELINE_ACHIEVED,
      seaLevelBaselinePreserved: true,
      organicExpressionAdapterActive: true,
      landWaterConstructVisibilityAdapterActive: true,

      gratitudeChildDetected: state.gratitude.detected,
      gratitudeChildApiComplete: state.gratitude.apiComplete,
      gratitudeChildPacketReady: state.gratitude.packetReady,
      gratitudeChildValidated: state.gratitude.validated,
      gratitudeChildFailureReason: state.gratitude.failureReason,
      gratitudeChildAttempts: state.gratitude.attempts,
      gratitudeChildCheckedAt: state.gratitude.checkedAt,

      packetShapeAdapted: state.gratitude.packetShapeAdapted,
      consumedShape: state.gratitude.consumedShape,
      consumedTerrainNodeCount: state.gratitude.terrainNodes.length,
      consumedSurfaceUnitCount: state.gratitude.surfaceUnits.length,
      consumedHydrationSeatCount: state.gratitude.hydrationSeats.length,
      consumedTerrainDatumNodeCount: state.gratitude.terrainDatumNodes.length,
      streamRegistryAvailable: Boolean(state.gratitude.streamRegistry && state.gratitude.streamRegistry.available),

      landFormationVisibilityMapActive: Boolean(state.gratitude.landFormationVisibilityMap && state.gratitude.landFormationVisibilityMap.active),
      waterConstructVisibilityMapActive: Boolean(state.gratitude.waterConstructVisibilityMap && state.gratitude.waterConstructVisibilityMap.active),
      ridgeSpineVisibilityActive: state.gratitude.ridgeSpineVisibility.length > 0,
      basinDepressionVisibilityActive: state.gratitude.basinDepressionVisibility.length > 0,
      valleyCorridorVisibilityActive: state.gratitude.valleyCorridorVisibility.length > 0,
      dryZoneVisibilityActive: state.gratitude.dryZoneVisibility.length > 0,
      poolVisibilityRegistryActive: state.gratitude.poolVisibilityRegistry.length > 0,
      riverStreamVisibilityActive: state.gratitude.riverVisibilityRegistry.length + state.gratitude.streamVisibilityRegistry.length > 0,
      gullyWaterfallVisibilityActive: state.gratitude.gullyVisibilityRegistry.length + state.gratitude.waterfallVisibilityRegistry.length > 0,

      visualExpressionReady: state.gratitude.visualExpressionReady,
      landWaterConstructVisibilityReady: state.gratitude.landWaterConstructVisibilityReady,
      ridgeSpineCount: state.gratitude.ridgeSpineVisibility.length,
      basinDepressionCount: state.gratitude.basinDepressionVisibility.length,
      valleyCorridorCount: state.gratitude.valleyCorridorVisibility.length,
      dryZoneCount: state.gratitude.dryZoneVisibility.length,
      poolVisibilityCount: state.gratitude.poolVisibilityRegistry.length,
      riverVisibilityCount: state.gratitude.riverVisibilityRegistry.length,
      streamVisibilityCount: state.gratitude.streamVisibilityRegistry.length,
      gullyVisibilityCount: state.gratitude.gullyVisibilityRegistry.length,
      waterfallVisibilityCount: state.gratitude.waterfallVisibilityRegistry.length,

      carrierConsumesChild: true,
      carrierInventsTerrain: false,
      terrainTruthInvented: false,
      hydrationTruthInvented: false,
      childAuthorityPreserved: true,
      visibleReadoutUpdated: state.visibleReadoutUpdated,

      bodyViewClean: true,
      surfaceViewChildTerrain: true,
      hydrationViewChildValleyFill: true,
      latticeViewPreserved: true,
      receiptViewLandWaterConstructVisibility: true,

      oneCanvas: state.oneCanvas,
      dragRotationActive: state.onePointerPath,
      activeLens: state.activeLens,
      renderCount: state.renderCount,

      htmlUntouched: true,
      gratitudeChildUntouched: true,
      coreChildUntouched: true,
      hydrationChildUntouched: true,
      surfaceHabitabilityChildUntouched: true,
      runtimeStrengthHeld: RUNTIME_STRENGTH_HELD,
      finalTerrainPassClaim: FINAL_TERRAIN_PASS_CLAIM,
      finalHydrationPassClaim: FINAL_HYDRATION_PASS_CLAIM,
      finalVisualPassClaim: FINAL_VISUAL_PASS_CLAIM,
      generatedImage: false,
      graphicBox: false,
      localTerrainTruthCreated: false,
      localHydrationTruthCreated: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_CARRIER_LAND_WATER_CONSTRUCT_VISIBILITY_ADAPTER_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_PLANET_CARRIER_LAND_WATER_CONSTRUCT_VISIBILITY_ADAPTER_STATUS = payload;
    window.AUDRALIA_PLANET_CARRIER_TERRAIN_HYDRATION_ORGANIC_EXPRESSION_ADAPTER_STATUS = payload;
    window.AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_STATUS = payload;
    window.AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_STATUS = payload;
    window.AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaCarrierActiveContract", CONTRACT);
    setDataset("audraliaCarrierPreviousContract", PREVIOUS_CONTRACT);
    setDataset("audraliaHtmlCollaborativeContract", HTML_COLLABORATIVE_CONTRACT);
    setDataset("audraliaSeaLevelBaselineAchieved", true);
    setDataset("audraliaSeaLevelBaselinePreserved", true);
    setDataset("audraliaGratitudeChildDetected", state.gratitude.detected);
    setDataset("audraliaGratitudeChildPacketReady", state.gratitude.packetReady);
    setDataset("audraliaGratitudeChildValidated", state.gratitude.validated);
    setDataset("audraliaPacketShapeAdapted", state.gratitude.packetShapeAdapted);
    setDataset("audraliaVisualExpressionReady", state.gratitude.visualExpressionReady);
    setDataset("audraliaLandWaterConstructVisibilityReady", state.gratitude.landWaterConstructVisibilityReady);
    setDataset("audraliaLandWaterConstructVisibilityAdapterActive", true);
    setDataset("audraliaLandFormationVisibilityMapActive", Boolean(state.gratitude.landFormationVisibilityMap));
    setDataset("audraliaWaterConstructVisibilityMapActive", Boolean(state.gratitude.waterConstructVisibilityMap));
    setDataset("audraliaPoolVisibilityCount", state.gratitude.poolVisibilityRegistry.length);
    setDataset("audraliaRiverStreamVisibilityCount", state.gratitude.riverVisibilityRegistry.length + state.gratitude.streamVisibilityRegistry.length);
    setDataset("audraliaCarrierConsumesChild", true);
    setDataset("audraliaCarrierInventsTerrain", false);
    setDataset("audraliaTerrainTruthInvented", false);
    setDataset("audraliaHydrationTruthInvented", false);
    setDataset("audraliaChildAuthorityPreserved", true);
    setDataset("audraliaVisibleReadoutUpdated", state.visibleReadoutUpdated);
    setDataset("audraliaRuntimeStrengthHeld", true);
    setDataset("audraliaFinalTerrainPassClaim", false);
    setDataset("audraliaFinalHydrationPassClaim", false);
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
    validateGratitudeChild();

    setTimeout(function () {
      if (!state.gratitude.validated && !state.stopped) validateGratitudeChild();
    }, 180);

    setTimeout(function () {
      if (!state.gratitude.validated && !state.stopped) validateGratitudeChild();
    }, 640);
  }

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");
    state.details = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Carrier land/water visibility adapter is present, but HTML stage/mount is unavailable.");
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
    htmlCollaborativeContract: HTML_COLLABORATIVE_CONTRACT,
    specOps: SPEC_OPS,
    receipt: receipt,
    status: publishStatus,
    validateGratitudeChild: validateGratitudeChild,
    buildOrganicVisualExpression: buildOrganicVisualExpression,
    buildLandWaterConstructVisibilityMaps: buildLandWaterConstructVisibilityMaps
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
