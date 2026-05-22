// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_TNT_v1
// Full-file replacement.
// Scope: renew the Audralia clean planet carrier as a packet-shape adapter and multistream visual-expression consumer.
// Purpose: preserve carrier boot/drag/lens behavior while adapting current Gratitude packets that publish nodes, surfaceUnits,
// terrainDatumPacket, hydration maps, and streamRegistry instead of the older continentMap.seats-only shape.
// Protected: HTML, script tags, cache keys, Gratitude terrain child, hydration child, surface-habitability child, hybrid core child.
// Rule: carrier consumes, adapts, projects, and renders packet data only. Carrier does not invent terrain truth.
// Runtime / Strength remains held. No final terrain, hydration, ecology, settlement, or visual pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_TNT_v1";
  var HTML_COLLABORATIVE_CONTRACT = "AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_TNT_v1";
  var SPEC_OPS = "AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_SPEC_OPS_v1";

  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var HYDRATION_CHILD_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration.child.js";
  var SURFACE_HABITABILITY_CHILD_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js";
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
      copy: "Clean body view keeps Audralia hydrosphere-first while showing only a faint terrain read from child packet data."
    },
    surface: {
      title: "Surface View",
      anchor: "East · Gratitude Surface",
      copy: "Surface view renders the Continent of Gratitude from adapted child nodes and surface units. The carrier does not invent terrain."
    },
    hydration: {
      title: "Hydration View",
      anchor: "South · Valley-Fill Hydration",
      copy: "Hydration view renders terrain context first, then water from child hydration seats/nodes and terrain-datum alignment."
    },
    lattice: {
      title: "Lattice View",
      anchor: "West · 16 × 16 / 256",
      copy: "Lattice view reveals the 256 inspection field while preserving the child-authority boundary."
    },
    receipt: {
      title: "Receipt View",
      anchor: "Northwest · Adapter Receipt",
      copy: "Receipt view proves packet-shape adaptation, node consumption, surface-unit consumption, hydration consumption, datum consumption, and no local terrain invention."
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
    staleHydrosphereHeldReceiptRemoved: true,

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
      surfaceMap: null,
      nodeMap: null,
      elevationMap: null,
      hydrationMap: null,
      summitMap: null,
      terrainDatumPacket: null,
      streamRegistry: null,

      continentSeats: [],
      terrainNodes: [],
      surfaceUnits: [],
      hydrationSeats: [],
      terrainDatumNodes: [],
      summits: [],

      hydrationChildApi: null,
      hydrationChildDetected: false,
      surfaceHabitabilityApi: null,
      surfaceHabitabilityDetected: false,

      adapterMode: "not_checked",
      adapterWarnings: [],
      packetShape: "unknown",
      nodesConsumed: 0,
      surfaceUnitsConsumed: 0,
      hydrationConsumed: 0,
      terrainDatumConsumed: 0,
      streamRegistryConsumed: false,

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

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function resolveArray() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (Array.isArray(arguments[i]) && arguments[i].length) return arguments[i];
    }
    return [];
  }

  function resolveValue() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (arguments[i] !== null && arguments[i] !== undefined) return arguments[i];
    }
    return null;
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

  function makeSurfaceUnitCellPoints(unit) {
    var rx = finite(unit.rx, 0.155);
    var ry = finite(unit.ry, 0.125);
    var points = safeArray(unit.hexRectVertices);

    if (points.length >= 4) {
      return points.map(function (point) {
        var ll = terrainSeatToLonLat(finite(point.x, unit.x), finite(point.y, unit.y));
        return [ll.lon, ll.lat];
      });
    }

    var westNorth = terrainSeatToLonLat(unit.x - rx, unit.y - ry);
    var eastSouth = terrainSeatToLonLat(unit.x + rx, unit.y + ry);

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

  function normalizeTerrainNodeForCarrier(raw, fallbackIndex) {
    if (!raw || typeof raw !== "object") return null;

    var x = finite(resolveValue(raw.x, raw.radial, fallbackIndex % RADIAL_NODES), fallbackIndex % RADIAL_NODES);
    var y = finite(resolveValue(raw.y, raw.band, Math.floor(fallbackIndex / RADIAL_NODES)), Math.floor(fallbackIndex / RADIAL_NODES));
    var elevation = clamp(resolveValue(raw.elevation, raw.surfaceExpressionDatum, raw.baseElevation, 0), 0, 1);
    var terrainDatum = raw.terrainDatum || {};

    var continentMembership = Boolean(
      raw.continentMembership === true ||
      raw.land === true ||
      raw.aboveSeaLevelMass === true ||
      terrainDatum.aboveSeaLevelMass === true
    );

    var ridgePressure = clamp(resolveValue(raw.ridgePressure, raw.categoryStrengths && raw.categoryStrengths.ridge, 0), 0, 1);
    var basinPressure = clamp(resolveValue(raw.basinPressure, raw.categoryStrengths && raw.categoryStrengths.basin, 0), 0, 1);
    var valleyPressure = clamp(resolveValue(raw.valleyPressure, raw.categoryStrengths && raw.categoryStrengths.valley, 0), 0, 1);
    var hydrationDepth = clamp(resolveValue(raw.hydrationDepth, raw.hydrationPressure, raw.waterDepth, 0), 0, 1);

    return Object.freeze({
      sourceId: raw.nodeId || raw.sourceNodeId || raw.seatKey || ("adapted-terrain-" + fallbackIndex),
      seatIndex: finite(resolveValue(raw.seatIndex, raw.nodeIndex, fallbackIndex), fallbackIndex),
      seatKey: raw.seatKey || ("G-" + String(Math.round(y)).padStart(2, "0") + "-" + String(Math.round(x)).padStart(2, "0")),
      x: x,
      y: y,
      centerX: finite(resolveValue(raw.centerX, x + 0.5), x + 0.5),
      centerY: finite(resolveValue(raw.centerY, y + 0.5), y + 0.5),

      continentMembership: continentMembership,
      continentCore: Boolean(raw.continentCore || (continentMembership && elevation > 0.48 && clamp(raw.coastPressure, 0, 1) < 0.45)),
      elevation: round(elevation, 4),
      baseElevation: round(clamp(resolveValue(raw.baseElevation, terrainDatum.baseElevationDatum, elevation), 0, 1), 4),

      terrainClass: String(raw.terrainClass || terrainDatum.terrainDatumClass || "surface_expression_datum"),
      hydrationClass: String(raw.hydrationClass || "dry_land"),
      primaryCategory: String(raw.primaryCategory || ""),

      ridgeStatus: Boolean(raw.ridgeStatus || ridgePressure > 0.50 || raw.terrainClass === "ridge_highland"),
      basinStatus: Boolean(raw.basinStatus || basinPressure > 0.50 || raw.terrainClass === "basin_floor"),
      valleyStatus: Boolean(raw.valleyStatus || valleyPressure > 0.48 || raw.terrainClass === "valley_corridor"),
      coastEligible: Boolean(raw.coastEligible || clamp(raw.coastPressure, 0, 1) > 0.50 || raw.terrainClass === "coastal_edge"),

      ridgePressure: round(ridgePressure, 4),
      basinPressure: round(basinPressure, 4),
      valleyPressure: round(valleyPressure, 4),
      coastPressure: round(clamp(resolveValue(raw.coastPressure, 0), 0, 1), 4),
      shelfPressure: round(clamp(resolveValue(raw.shelfPressure, 0), 0, 1), 4),
      hydrationPressure: round(clamp(resolveValue(raw.hydrationPressure, 0), 0, 1), 4),
      hydrationDepth: round(hydrationDepth, 4),
      waterFillEligible: Boolean(raw.waterFillEligible || hydrationDepth > 0.045),
      waterTableDatumHeld: terrainDatum.waterTableDatumHeld,

      mountainRangeReserved: Boolean(raw.mountainRangeReserved || terrainDatum.mountainRangeReserved),
      desertLandReserved: Boolean(raw.desertLandReserved || terrainDatum.desertLandReserved),
      rainShadowZoneReserved: Boolean(raw.rainShadowZoneReserved || terrainDatum.rainShadowZoneReserved),
      newsComplete: raw.newsComplete !== false,
      coherenceScore: finite(raw.coherenceScore, 1),
      renderEligible: raw.renderEligible !== false
    });
  }

  function normalizeHydrationNodeForCarrier(raw, fallbackIndex) {
    if (!raw || typeof raw !== "object") return null;

    var adapted = normalizeTerrainNodeForCarrier(raw, fallbackIndex);
    if (!adapted) return null;

    var channelPressure = clamp(resolveValue(raw.channelPressure, raw.hydrationPressure, raw.flowPotential, 0), 0, 1);
    var lakePressure = clamp(resolveValue(raw.lakePressure, raw.basinPressure, 0), 0, 1);
    var marshPressure = clamp(resolveValue(raw.marshWetlandPressure, raw.marshPressure, raw.wetlandPressure, 0), 0, 1);
    var aquiferPressure = clamp(resolveValue(raw.aquiferPressure, raw.waterTable, 0), 0, 1);
    var depth = clamp(resolveValue(raw.hydrationDepth, raw.waterAvailability, raw.hydrationPressure, channelPressure, lakePressure, marshPressure, 0), 0, 1);

    return Object.freeze({
      sourceId: raw.hydrationNodeId || adapted.sourceId,
      seatIndex: adapted.seatIndex,
      seatKey: adapted.seatKey,
      x: adapted.x,
      y: adapted.y,
      centerX: adapted.centerX,
      centerY: adapted.centerY,

      continentMembership: adapted.continentMembership,
      terrainClass: adapted.terrainClass,
      hydrationClass: String(raw.hydrationClass || raw.hydrationCategory || adapted.hydrationClass),
      bloodstreamRole: String(raw.bloodstreamRole || "terrain_child_hydration_read"),

      elevation: adapted.elevation,
      ridgeStatus: adapted.ridgeStatus,
      basinStatus: adapted.basinStatus,
      valleyStatus: adapted.valleyStatus,
      coastEligible: adapted.coastEligible,

      channelPressure: round(channelPressure, 4),
      lakePressure: round(lakePressure, 4),
      marshWetlandPressure: round(marshPressure, 4),
      aquiferPressure: round(aquiferPressure, 4),
      hydrationDepth: round(depth, 4),
      waterFillEligible: Boolean(raw.waterFillEligible || depth > 0.045 || channelPressure > 0.28 || lakePressure > 0.28 || marshPressure > 0.30),

      renderEligible: raw.renderEligible !== false
    });
  }

  function normalizeSurfaceUnitForCarrier(raw, fallbackIndex) {
    if (!raw || typeof raw !== "object") return null;

    var x = finite(raw.x, 0);
    var y = finite(raw.y, 0);
    var elevation = clamp(resolveValue(raw.elevation, 0.45), 0, 1);
    var hydrationDepth = clamp(resolveValue(raw.hydrationDepth, raw.moisturePotential, 0), 0, 1);

    return Object.freeze({
      tileId: raw.tileId || raw.terrainUnitId || ("adapted-surface-unit-" + fallbackIndex),
      parentNodeId: raw.parentNodeId || "",
      x: x,
      y: y,
      rx: finite(raw.rx, 0.155),
      ry: finite(raw.ry, 0.125),
      hexRectVertices: safeArray(raw.hexRectVertices),

      elevation: round(elevation, 4),
      ridgePressure: round(clamp(raw.ridgePressure, 0, 1), 4),
      basinPressure: round(clamp(raw.basinPressure, 0, 1), 4),
      valleyPressure: round(clamp(raw.valleyPressure, 0, 1), 4),
      marshPressure: round(clamp(raw.marshPressure, 0, 1), 4),
      wetlandPressure: round(clamp(raw.wetlandPressure, 0, 1), 4),
      coastPressure: round(clamp(raw.coastPressure, 0, 1), 4),
      hydrationDepth: round(hydrationDepth, 4),

      terrainClass: String(raw.terrainClass || "surface_expression_unit"),
      hydrationClass: String(raw.hydrationClass || "dry_land"),
      waterFillEligible: Boolean(raw.waterFillEligible || hydrationDepth > 0.045),
      textureChannels: raw.textureChannels || {},
      renderEligible: raw.renderEligible !== false
    });
  }

  function resolveGratitudeNodes(packet, continentMap, surfaceMap, nodeMap) {
    var nodes = resolveArray(
      continentMap && continentMap.seats,
      continentMap && continentMap.nodes,
      surfaceMap && surfaceMap.nodes,
      packet && packet.surfaceMap && packet.surfaceMap.nodes,
      nodeMap && nodeMap.nodes,
      packet && packet.nodeMap && packet.nodeMap.nodes
    );

    return nodes
      .map(normalizeTerrainNodeForCarrier)
      .filter(function (node) {
        return Boolean(node && node.renderEligible && node.continentMembership);
      });
  }

  function resolveGratitudeSurfaceUnits(packet, continentMap, surfaceMap) {
    var units = resolveArray(
      continentMap && continentMap.surfaceUnits,
      surfaceMap && surfaceMap.surfaceUnits,
      packet && packet.surfaceMap && packet.surfaceMap.surfaceUnits
    );

    return units
      .map(normalizeSurfaceUnitForCarrier)
      .filter(function (unit) {
        return Boolean(unit && unit.renderEligible);
      });
  }

  function resolveHydrationSeats(packet, hydrationMap) {
    var nodes = resolveArray(
      hydrationMap && hydrationMap.seats,
      hydrationMap && hydrationMap.nodes,
      packet && packet.hydrationMap && packet.hydrationMap.seats,
      packet && packet.hydrationMap && packet.hydrationMap.nodes
    );

    return nodes
      .map(normalizeHydrationNodeForCarrier)
      .filter(function (node) {
        return Boolean(node && node.renderEligible && node.waterFillEligible);
      });
  }

  function resolveTerrainDatumNodes(api, packet) {
    var datumPacket = null;

    try {
      if (api && typeof api.getTerrainDatumPacket === "function") {
        datumPacket = api.getTerrainDatumPacket("audralia-carrier-adapter", { compact: false });
      }
    } catch (error) {
      recordError("resolveTerrainDatumNodes.getTerrainDatumPacket", error);
    }

    if (!datumPacket && packet && packet.terrainDatumPacket) datumPacket = packet.terrainDatumPacket;
    if (!datumPacket && window.AUDRALIA_GRATITUDE_TERRAIN_DATUM_PACKET) datumPacket = window.AUDRALIA_GRATITUDE_TERRAIN_DATUM_PACKET;

    return {
      packet: datumPacket,
      nodes: resolveArray(datumPacket && datumPacket.datumNodes)
    };
  }

  function resolveStreamRegistry(api, packet) {
    var registry = null;

    try {
      if (api && typeof api.getStreamRegistry === "function") {
        registry = api.getStreamRegistry({ compact: false });
      }
    } catch (error) {
      recordError("resolveStreamRegistry.getStreamRegistry", error);
    }

    if (!registry && packet && packet.streamRegistry) registry = packet.streamRegistry;
    if (!registry && window.AUDRALIA_GRATITUDE_STREAM_REGISTRY) registry = window.AUDRALIA_GRATITUDE_STREAM_REGISTRY;

    return registry;
  }

  function detectOptionalDownstreamChildren() {
    state.gratitude.hydrationChildApi = window.AUDRALIA_GRATITUDE_HYDRATION_CHILD || null;
    state.gratitude.hydrationChildDetected = Boolean(state.gratitude.hydrationChildApi);
    state.gratitude.surfaceHabitabilityApi = window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD || null;
    state.gratitude.surfaceHabitabilityDetected = Boolean(state.gratitude.surfaceHabitabilityApi);
  }

  function validateGratitudeChild() {
    state.gratitude.attempts += 1;
    state.gratitude.checkedAt = new Date().toISOString();
    state.gratitude.adapterWarnings = [];

    detectOptionalDownstreamChildren();

    var api = window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD || null;

    state.gratitude.api = api;
    state.gratitude.detected = Boolean(api);
    state.gratitude.apiComplete = false;
    state.gratitude.packetReady = false;
    state.gratitude.validated = false;
    state.gratitude.packet = null;
    state.gratitude.status = null;
    state.gratitude.continentMap = null;
    state.gratitude.surfaceMap = null;
    state.gratitude.nodeMap = null;
    state.gratitude.elevationMap = null;
    state.gratitude.hydrationMap = null;
    state.gratitude.summitMap = null;
    state.gratitude.terrainDatumPacket = null;
    state.gratitude.streamRegistry = null;
    state.gratitude.continentSeats = [];
    state.gratitude.terrainNodes = [];
    state.gratitude.surfaceUnits = [];
    state.gratitude.hydrationSeats = [];
    state.gratitude.terrainDatumNodes = [];
    state.gratitude.summits = [];
    state.gratitude.packetShape = "unknown";
    state.gratitude.adapterMode = "not_validated";
    state.gratitude.nodesConsumed = 0;
    state.gratitude.surfaceUnitsConsumed = 0;
    state.gratitude.hydrationConsumed = 0;
    state.gratitude.terrainDatumConsumed = 0;
    state.gratitude.streamRegistryConsumed = false;

    if (!api) {
      state.gratitude.failureReason = "Gratitude child missing / invalid · terrain render held";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }

    state.gratitude.apiComplete = Boolean(
      typeof api.status === "function" &&
      typeof api.getChildReceivePacket === "function" &&
      (
        typeof api.getContinentMap === "function" ||
        typeof api.getSurfaceMap === "function" ||
        typeof api.getNodeMap === "function"
      )
    );

    if (!state.gratitude.apiComplete) {
      state.gratitude.failureReason = "Gratitude child API incomplete · adapter render held";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }

    try {
      var status = api.status();
      var packet = api.getChildReceivePacket("audralia-carrier-packet-shape-adapter", { compact: false });

      var continentMap = null;
      var surfaceMap = null;
      var nodeMap = null;
      var elevationMap = null;
      var hydrationMap = null;
      var summitMap = null;

      if (typeof api.getContinentMap === "function") {
        continentMap = api.getContinentMap({ compact: false });
      }

      if (typeof api.getSurfaceMap === "function") {
        surfaceMap = api.getSurfaceMap({ compact: false });
      } else if (continentMap) {
        surfaceMap = continentMap;
      }

      if (typeof api.getNodeMap === "function") {
        nodeMap = api.getNodeMap({ compact: false });
      } else if (packet && packet.nodeMap) {
        nodeMap = packet.nodeMap;
      }

      if (typeof api.getElevationMap === "function") {
        elevationMap = api.getElevationMap({ compact: false });
      }

      if (typeof api.getHydrationMap === "function") {
        hydrationMap = api.getHydrationMap({ compact: false });
      } else if (packet && packet.hydrationMap) {
        hydrationMap = packet.hydrationMap;
      }

      if (typeof api.getSummitMap === "function") {
        summitMap = api.getSummitMap({ compact: false });
      } else if (packet && packet.summitMap) {
        summitMap = packet.summitMap;
      }

      var datum = resolveTerrainDatumNodes(api, packet);
      var streamRegistry = resolveStreamRegistry(api, packet);

      var terrainNodes = resolveGratitudeNodes(packet, continentMap, surfaceMap, nodeMap);
      var surfaceUnits = resolveGratitudeSurfaceUnits(packet, continentMap, surfaceMap);
      var hydrationSeats = resolveHydrationSeats(packet, hydrationMap);
      var terrainDatumNodes = datum.nodes;

      var packetReady = Boolean(packet && packet.childReceivePacketReady === true);
      var adaptedReady = Boolean(terrainNodes.length > 0 || surfaceUnits.length > 0);

      state.gratitude.status = status;
      state.gratitude.packet = packet;
      state.gratitude.continentMap = continentMap;
      state.gratitude.surfaceMap = surfaceMap;
      state.gratitude.nodeMap = nodeMap;
      state.gratitude.elevationMap = elevationMap;
      state.gratitude.hydrationMap = hydrationMap;
      state.gratitude.summitMap = summitMap;
      state.gratitude.terrainDatumPacket = datum.packet;
      state.gratitude.streamRegistry = streamRegistry;

      state.gratitude.continentSeats = terrainNodes;
      state.gratitude.terrainNodes = terrainNodes;
      state.gratitude.surfaceUnits = surfaceUnits;
      state.gratitude.hydrationSeats = hydrationSeats;
      state.gratitude.terrainDatumNodes = terrainDatumNodes;
      state.gratitude.summits = summitMap && Array.isArray(summitMap.summits) ? summitMap.summits : [];

      state.gratitude.packetReady = packetReady;
      state.gratitude.nodesConsumed = terrainNodes.length;
      state.gratitude.surfaceUnitsConsumed = surfaceUnits.length;
      state.gratitude.hydrationConsumed = hydrationSeats.length;
      state.gratitude.terrainDatumConsumed = terrainDatumNodes.length;
      state.gratitude.streamRegistryConsumed = Boolean(streamRegistry && (Array.isArray(streamRegistry.streams) || streamRegistry.streamRegistryReady === true));

      if (continentMap && Array.isArray(continentMap.seats) && continentMap.seats.length) {
        state.gratitude.packetShape = "legacy_seats";
      } else if (terrainNodes.length && surfaceUnits.length) {
        state.gratitude.packetShape = "nodes_plus_surface_units";
      } else if (terrainNodes.length) {
        state.gratitude.packetShape = "nodes_only";
      } else if (surfaceUnits.length) {
        state.gratitude.packetShape = "surface_units_only";
      } else {
        state.gratitude.packetShape = "unresolved_packet_shape";
      }

      if (!terrainNodes.length) state.gratitude.adapterWarnings.push("terrain nodes not consumed");
      if (!surfaceUnits.length) state.gratitude.adapterWarnings.push("surface units not consumed");
      if (!hydrationSeats.length) state.gratitude.adapterWarnings.push("hydration seats/nodes not consumed");
      if (!terrainDatumNodes.length) state.gratitude.adapterWarnings.push("terrain datum nodes not consumed");
      if (!state.gratitude.streamRegistryConsumed) state.gratitude.adapterWarnings.push("stream registry not consumed");

      state.gratitude.validated = Boolean(
        packetReady &&
        adaptedReady &&
        packet.finalVisualPassClaim === false
      );

      state.gratitude.adapterMode = state.gratitude.validated
        ? "packet_shape_adapted_multistream_expression_ready"
        : "packet_shape_adapter_held";

      state.gratitude.failureReason = state.gratitude.validated
        ? ""
        : "Gratitude packet adapter failed · terrain render held";

      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(12);

      return state.gratitude.validated;
    } catch (error) {
      recordError("validateGratitudeChild.adapter", error);
      state.gratitude.failureReason = "Gratitude child packet adapter exception · terrain render held";
      state.gratitude.adapterMode = "adapter_exception";
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }
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

    var bandAlpha = hydration ? 0.36 : body ? 0.09 : 0.12;
    var currentAlpha = hydration ? 0.38 : body ? 0.10 : 0.15;

    for (var i = 0; i < HYDRO_DEPTH_BANDS.length; i += 1) {
      drawProjectedPath(
        HYDRO_DEPTH_BANDS[i],
        "rgba(85,201,236,0.34)",
        Math.max(0.65, state.dpr * (hydration ? 1.0 : 0.50)),
        bandAlpha
      );
    }

    for (var j = 0; j < HYDRO_CURRENT_ARCS.length; j += 1) {
      drawProjectedPath(
        HYDRO_CURRENT_ARCS[j],
        "rgba(182,245,255,0.26)",
        Math.max(0.62, state.dpr * (hydration ? 0.92 : 0.44)),
        currentAlpha
      );
    }
  }

  function terrainColorForSeat(seat, mode) {
    var elevation = clamp(seat.elevation, 0, 1);
    var warm = Math.floor(72 + elevation * 72);
    var green = Math.floor(92 + elevation * 80);
    var blue = Math.floor(62 + elevation * 44);

    if (seat.ridgeStatus || seat.mountainRangeReserved) {
      warm += 28;
      green += 20;
      blue += 6;
    }

    if (seat.basinStatus || seat.valleyStatus) {
      green += 16;
      blue += 18;
    }

    if (seat.coastEligible) {
      green += 8;
      blue += 14;
    }

    if (seat.desertLandReserved || seat.rainShadowZoneReserved) {
      warm += 28;
      green += 10;
      blue -= 14;
    }

    warm = clamp(warm, 0, 255);
    green = clamp(green, 0, 255);
    blue = clamp(blue, 0, 255);

    var alpha = mode === "hydration" ? 0.34 : mode === "body" ? 0.095 : 0.58;

    return "rgba(" + warm + "," + green + "," + blue + "," + alpha.toFixed(3) + ")";
  }

  function drawTerrainCell(seat, mode) {
    if (!seat || !seat.continentMembership) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var isBody = mode === "body";

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = terrainColorForSeat(seat, mode);
    ctx.fill();

    if (!isBody && (seat.ridgeStatus || seat.basinStatus || seat.valleyStatus || seat.coastEligible)) {
      ctx.strokeStyle = seat.ridgeStatus
        ? "rgba(255,232,168,0.20)"
        : seat.coastEligible
          ? "rgba(182,245,255,0.16)"
          : "rgba(238,244,255,0.10)";
      ctx.lineWidth = Math.max(0.25, state.dpr * 0.30);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSurfaceUnit(unit, mode) {
    if (!unit) return;

    var ctx = state.ctx;
    var result = projectedCell(makeSurfaceUnitCellPoints(unit));
    if (result.front < 2) return;

    var elevation = clamp(unit.elevation, 0, 1);
    var rock = clamp(unit.textureChannels && unit.textureChannels.rock, 0, 1);
    var wetland = clamp(unit.textureChannels && unit.textureChannels.wetland, 0, 1);
    var coast = clamp(unit.textureChannels && unit.textureChannels.coast, unit.coastPressure || 0, 1);

    var warm = Math.floor(70 + elevation * 70 + rock * 26);
    var green = Math.floor(88 + elevation * 70 + wetland * 24);
    var blue = Math.floor(58 + coast * 38 + wetland * 34);

    var alpha = mode === "surface" ? 0.34 : mode === "hydration" ? 0.12 : 0.045;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = "rgba(" + clamp(warm, 0, 255) + "," + clamp(green, 0, 255) + "," + clamp(blue, 0, 255) + "," + alpha.toFixed(3) + ")";
    ctx.fill();

    if (mode === "surface" && (unit.ridgePressure > 0.35 || unit.basinPressure > 0.35 || unit.valleyPressure > 0.35)) {
      ctx.strokeStyle = "rgba(255,244,216,0.10)";
      ctx.lineWidth = Math.max(0.18, state.dpr * 0.18);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawHydrationCell(seat) {
    if (!seat || !seat.waterFillEligible) return;

    var ctx = state.ctx;
    var result = projectedCell(makeTerrainCellPoints(seat));
    if (result.front < 2) return;

    var depth = clamp(seat.hydrationDepth, 0, 1);
    var channel = clamp(seat.channelPressure, 0, 1);
    var lake = clamp(seat.lakePressure, 0, 1);
    var marsh = clamp(seat.marshWetlandPressure, 0, 1);
    var alpha = state.activeLens === "hydration" ? 0.42 : 0.16;

    var intensity = clamp(depth * 0.42 + channel * 0.25 + lake * 0.20 + marsh * 0.16, 0.16, 0.88);

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < result.projected.length; i += 1) {
      var p = result.projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = "rgba(76,194,232," + (alpha * intensity).toFixed(3) + ")";
    ctx.fill();

    ctx.strokeStyle = "rgba(182,245,255," + clamp(0.12 + intensity * 0.16, 0.12, 0.30).toFixed(3) + ")";
    ctx.lineWidth = Math.max(0.28, state.dpr * 0.30);
    ctx.stroke();

    ctx.restore();
  }

  function drawHydrationThread(seat) {
    if (!seat || !(seat.channelPressure > 0.18 || seat.basinStatus || seat.valleyStatus)) return;

    var center = terrainSeatToLonLat(seat.x, seat.y);
    var dx = seat.valleyStatus ? 0.40 : seat.basinStatus ? 0.25 : 0.18;
    var dy = seat.basinStatus ? 0.26 : 0.34;

    drawProjectedPath(
      [
        [center.lon - dx * 2.3, center.lat + dy * 1.4],
        [center.lon - dx, center.lat + dy * 0.4],
        [center.lon + dx * 0.6, center.lat - dy * 0.3],
        [center.lon + dx * 1.7, center.lat - dy * 0.9]
      ],
      "rgba(174,244,255,0.34)",
      Math.max(0.28, state.dpr * 0.32),
      state.activeLens === "hydration" ? 0.28 : 0.10
    );
  }

  function drawSummitMarkers() {
    if (!state.gratitude.validated || state.activeLens !== "surface") return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < state.gratitude.summits.length; i += 1) {
      var summit = state.gratitude.summits[i];
      var location = terrainSeatToLonLat(summit.x, summit.y);
      var p = projectPoint(lonLatPoint(location.lon, location.lat));

      if (!p.frontFacing) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.9, state.dpr * 1.55 * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(244,207,131,0.66)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.9, state.dpr * 3.05 * p.perspective), 0, TAU);
      ctx.strokeStyle = "rgba(244,207,131,0.22)";
      ctx.lineWidth = Math.max(0.32, state.dpr * 0.42);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDatumHints() {
    if (!state.gratitude.validated || state.activeLens !== "hydration") return;

    var nodes = state.gratitude.terrainDatumNodes;
    if (!nodes.length) return;

    var count = 0;

    for (var i = 0; i < nodes.length; i += 1) {
      var datum = nodes[i];
      if (count > 80) break;

      var shouldDraw = datum.basinRimRequired ||
        datum.valleyFloorRequired ||
        datum.coastDatumRequired ||
        datum.rainShadowZoneReserved ||
        datum.dryBasinReserved;

      if (!shouldDraw) continue;

      var ll = terrainSeatToLonLat(datum.x, datum.y);
      var p = projectPoint(lonLatPoint(ll.lon, ll.lat));
      if (!p.frontFacing) continue;

      var ctx = state.ctx;
      var radius = datum.coastDatumRequired ? 1.65 : datum.basinRimRequired ? 1.35 : 1.0;

      ctx.save();
      clipSphere();
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, state.dpr * radius * p.perspective), 0, TAU);
      ctx.fillStyle = datum.rainShadowZoneReserved || datum.dryBasinReserved
        ? "rgba(244,190,112,0.24)"
        : "rgba(182,245,255,0.18)";
      ctx.fill();
      ctx.restore();

      count += 1;
    }
  }

  function drawGratitudeChildTerrain() {
    if (!state.gratitude.validated) return;

    var i;

    if (state.activeLens === "surface") {
      for (i = 0; i < state.gratitude.terrainNodes.length; i += 1) {
        drawTerrainCell(state.gratitude.terrainNodes[i], "surface");
      }

      for (i = 0; i < state.gratitude.surfaceUnits.length; i += 1) {
        drawSurfaceUnit(state.gratitude.surfaceUnits[i], "surface");
      }

      drawSummitMarkers();
    }

    if (state.activeLens === "hydration") {
      for (i = 0; i < state.gratitude.terrainNodes.length; i += 1) {
        drawTerrainCell(state.gratitude.terrainNodes[i], "hydration");
      }

      for (i = 0; i < state.gratitude.surfaceUnits.length; i += 1) {
        drawSurfaceUnit(state.gratitude.surfaceUnits[i], "hydration");
      }

      for (i = 0; i < state.gratitude.hydrationSeats.length; i += 1) {
        drawHydrationCell(state.gratitude.hydrationSeats[i]);
        drawHydrationThread(state.gratitude.hydrationSeats[i]);
      }

      drawDatumHints();
    }

    if (state.activeLens === "body") {
      for (i = 0; i < state.gratitude.terrainNodes.length; i += 1) {
        drawTerrainCell(state.gratitude.terrainNodes[i], "body");
      }

      if (state.gratitude.surfaceUnits.length > 0) {
        for (i = 0; i < state.gratitude.surfaceUnits.length; i += 1) {
          drawSurfaceUnit(state.gratitude.surfaceUnits[i], "body");
        }
      }
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
    ctx.globalAlpha = state.activeLens === "body" ? 0.04 : 0.22;
    strokeLine(equator, "rgba(244,207,131,0.12)", Math.max(0.36, state.dpr * 0.30));
    strokeLine(meridian, "rgba(141,216,255,0.06)", Math.max(0.30, state.dpr * 0.24));
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
    var w = Math.min(state.width * 0.82, m.radius * 2.12);
    var h = Math.min(state.height * 0.38, m.radius * 0.98);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.70)";
    ctx.strokeStyle = state.gratitude.validated ? "rgba(167,243,198,0.42)" : "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.gratitude.validated ? "rgba(167,243,198,0.92)" : "rgba(244,207,131,0.92)";
    ctx.fillText(state.gratitude.validated ? "PACKET SHAPE ADAPTED" : "PACKET ADAPTER HELD", m.centerX, y + h * 0.17);

    ctx.font = "900 " + Math.max(8, 9.4 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.86)";
    ctx.fillText(
      "NODES " + state.gratitude.nodesConsumed +
      " · SURFACE UNITS " + state.gratitude.surfaceUnitsConsumed +
      " · HYDRATION " + state.gratitude.hydrationConsumed,
      m.centerX,
      y + h * 0.35
    );

    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText(
      "DATUM " + state.gratitude.terrainDatumConsumed +
      " · STREAM REGISTRY " + (state.gratitude.streamRegistryConsumed ? "YES" : "HELD"),
      m.centerX,
      y + h * 0.51
    );

    ctx.fillStyle = "rgba(244,207,131,0.80)";
    ctx.fillText("SHAPE " + state.gratitude.packetShape.toUpperCase(), m.centerX, y + h * 0.66);

    ctx.fillStyle = "rgba(167,243,198,0.82)";
    ctx.fillText("CARRIER CONSUMES · INVENTS TERRAIN FALSE · FINAL VISUAL PASS FALSE", m.centerX, y + h * 0.82);

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
      state.ctx.globalAlpha = 0.010;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = 0.002;
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
    var statusText = state.gratitude.validated
      ? "Gratitude packet adapted · carrier consuming nodes, surface units, hydration, datum"
      : "Gratitude child missing / adapter held · terrain render held";

    var proofText = state.gratitude.validated
      ? "packet shape " + state.gratitude.packetShape +
        " · nodes " + state.gratitude.nodesConsumed +
        " · surface units " + state.gratitude.surfaceUnitsConsumed +
        " · hydration " + state.gratitude.hydrationConsumed +
        " · datum " + state.gratitude.terrainDatumConsumed +
        " · carrier invents terrain false"
      : state.gratitude.failureReason || "bounded failure · terrain render held";

    var wroteStatus = setText("[data-audralia-planet-carrier-status]", statusText);
    var wroteProof = setText("[data-audralia-planet-carrier-proof]", proofText);

    state.visibleReadoutUpdated = Boolean(wroteStatus || wroteProof || force);

    setText("[data-audralia-planet-stage-label]", state.gratitude.validated
      ? "Packet-shape adapter live → Surface and Hydration read adapted child data"
      : "Clean Inspection → Gratitude packet adapter not validated"
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
    state.canvas.setAttribute("data-audralia-carrier-adapter-contract", CONTRACT);
    state.canvas.setAttribute("data-active-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-html-collaborative-contract", HTML_COLLABORATIVE_CONTRACT);
    state.canvas.setAttribute("data-carrier-consumes-child", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-packet-shape-adapter", "true");
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
      htmlCollaborativeContract: HTML_COLLABORATIVE_CONTRACT,
      specOps: SPEC_OPS,
      route: ROUTE,
      target: FILE,
      gratitudeChildFile: GRATITUDE_CHILD_FILE,
      hydrationChildFile: HYDRATION_CHILD_FILE,
      surfaceHabitabilityChildFile: SURFACE_HABITABILITY_CHILD_FILE,
      coreChildFile: CORE_CHILD_FILE,

      gratitudeChildDetected: state.gratitude.detected,
      gratitudeChildApiComplete: state.gratitude.apiComplete,
      gratitudeChildPacketReady: state.gratitude.packetReady,
      gratitudeChildValidated: state.gratitude.validated,
      gratitudeChildFailureReason: state.gratitude.failureReason,
      gratitudeChildAttempts: state.gratitude.attempts,
      gratitudeChildCheckedAt: state.gratitude.checkedAt,

      packetShapeAdapted: state.gratitude.validated,
      adapterMode: state.gratitude.adapterMode,
      packetShape: state.gratitude.packetShape,
      adapterWarnings: state.gratitude.adapterWarnings.slice(),
      nodesConsumed: state.gratitude.nodesConsumed,
      surfaceUnitsConsumed: state.gratitude.surfaceUnitsConsumed,
      hydrationConsumed: state.gratitude.hydrationConsumed,
      terrainDatumConsumed: state.gratitude.terrainDatumConsumed,
      streamRegistryConsumed: state.gratitude.streamRegistryConsumed,

      optionalHydrationChildDetected: state.gratitude.hydrationChildDetected,
      optionalSurfaceHabitabilityChildDetected: state.gratitude.surfaceHabitabilityDetected,

      carrierConsumesChild: true,
      carrierInventsTerrain: false,
      visibleReadoutUpdated: state.visibleReadoutUpdated,
      staleHydrosphereHeldReceiptRemoved: true,

      landFirstChildAuthority: Boolean(state.gratitude.packet && state.gratitude.packet.landFirst === true),
      nineSummitsEmbedded: Boolean(state.gratitude.packet && state.gratitude.packet.nineSummitsEmbedded === true),
      hydrationDerivedFromValleys: Boolean(state.gratitude.packet && state.gratitude.packet.waterFillDerivedFromValleys === true),

      bodyViewClean: true,
      surfaceViewChildTerrain: state.gratitude.nodesConsumed > 0 || state.gratitude.surfaceUnitsConsumed > 0,
      hydrationViewChildValleyFill: state.gratitude.hydrationConsumed > 0,
      latticeViewPreserved: true,
      receiptViewAdapterAligned: true,

      oneCanvas: state.oneCanvas,
      dragRotationActive: state.onePointerPath,
      activeLens: state.activeLens,
      renderCount: state.renderCount,

      htmlUntouched: true,
      gratitudeChildUntouched: true,
      hydrationChildUntouched: true,
      surfaceHabitabilityChildUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      localTerrainArraysRestored: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_PLANET_CARRIER_GRATITUDE_PACKET_SHAPE_AND_MULTISTREAM_EXPRESSION_ADAPTER_STATUS = payload;
    window.AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_STATUS = payload;
    window.AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaCarrierActiveContract", CONTRACT);
    setDataset("audraliaHtmlCollaborativeContract", HTML_COLLABORATIVE_CONTRACT);
    setDataset("audraliaGratitudeChildDetected", state.gratitude.detected);
    setDataset("audraliaGratitudeChildPacketReady", state.gratitude.packetReady);
    setDataset("audraliaGratitudeChildValidated", state.gratitude.validated);
    setDataset("audraliaPacketShapeAdapted", state.gratitude.validated);
    setDataset("audraliaPacketShape", state.gratitude.packetShape);
    setDataset("audraliaNodesConsumed", state.gratitude.nodesConsumed);
    setDataset("audraliaSurfaceUnitsConsumed", state.gratitude.surfaceUnitsConsumed);
    setDataset("audraliaHydrationConsumed", state.gratitude.hydrationConsumed);
    setDataset("audraliaTerrainDatumConsumed", state.gratitude.terrainDatumConsumed);
    setDataset("audraliaStreamRegistryConsumed", state.gratitude.streamRegistryConsumed);
    setDataset("audraliaCarrierConsumesChild", true);
    setDataset("audraliaCarrierInventsTerrain", false);
    setDataset("audraliaVisibleReadoutUpdated", state.visibleReadoutUpdated);
    setDataset("audraliaSurfaceViewChildTerrain", state.gratitude.nodesConsumed > 0 || state.gratitude.surfaceUnitsConsumed > 0);
    setDataset("audraliaHydrationViewChildValleyFill", state.gratitude.hydrationConsumed > 0);
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
      recordError("init", "Carrier adapter is present, but HTML stage/mount is unavailable.");
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
    validateGratitudeChild: validateGratitudeChild
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
