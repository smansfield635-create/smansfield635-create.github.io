// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_TNT_v1
// Full-file replacement.
// Scope: Audralia clean planet inspection carrier.
// Purpose: preserve the 256 parcel scaffold under hood while naturalizing terrain, hydration, edge, and Sixth Sense expression.
// Owns: canvas mount, lens controls, drag inspection, child-scope consumption, parcel-role extraction,
// naturalized visual translation, visible receipt/status publication.
// Does not own: HTML source, script tags, Gratitude terrain child, hydration child, hydration-edge child,
// temperature child, atmosphere child, climate child, chemistry child, ecology activation, settlement activation,
// urban activation, final terrain pass, final hydration pass, final edge pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_PLANET_FOUR_SIGN_NATURAL_VISUAL_LANGUAGE_CARRIER_TNT_v1";
  var HTML_COLLABORATIVE_CONTRACT = "AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_CACHE_KEY_HTML_ONLY_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_NEWS_v1";
  var CCR = "AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_CCR_v1";

  var ROUTE = "/showroom/globe/audralia/planet/";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var GRATITUDE_CHILD_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var HYDRATION_EDGE_CHILD_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js";
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

  var FOUR_SIGNS = Object.freeze({
    terrain: Object.freeze({
      heroSign: "terrain_body",
      scope: "terrainScope256",
      buildMeaning: "Terrain is the body of Audralia.",
      renderedAs: "naturalized_living_planetary_material"
    }),
    water: Object.freeze({
      heroSign: "hydration_bloodstream",
      scope: "hydrationScope256",
      buildMeaning: "Water is the bloodstream of Audralia.",
      renderedAs: "naturalized_embedded_flow"
    }),
    air: Object.freeze({
      heroSign: "atmosphere_breath_held",
      scope: "temperature_atmosphere_climate_held_scopes",
      buildMeaning: "Air is the breath of Audralia.",
      renderedAs: "held_breath_socket_not_fake_atmosphere"
    }),
    relationship: Object.freeze({
      heroSign: "sixth_sense_relationship",
      scope: "sixthSenseChronologicalComposite",
      buildMeaning: "Relationship is the sense of Audralia.",
      renderedAs: "naturalized_unified_perception"
    })
  });

  var PARCEL_ROLES = Object.freeze([
    "summit_parcel",
    "ridge_parcel",
    "mountain_parcel",
    "basin_parcel",
    "valley_parcel",
    "plain_parcel",
    "coast_parcel",
    "beach_candidate_parcel",
    "cliff_candidate_parcel",
    "waterfall_candidate_parcel",
    "shelf_parcel",
    "pool_parcel",
    "river_feed_parcel",
    "stream_parcel",
    "gully_parcel",
    "wetland_parcel",
    "marsh_parcel",
    "desert_reserve_parcel",
    "dry_basin_parcel",
    "relationship_parcel",
    "held_future_socket_parcel"
  ]);

  var CHRONOLOGY = Object.freeze([
    "datum",
    "elevation",
    "terrain_role",
    "hydration_permission",
    "edge_condition",
    "narrative_role",
    "visual_translation"
  ]);

  var LENSES = Object.freeze({
    body: Object.freeze({
      title: "Body View",
      anchor: "North · Hydrosphere Body",
      copy: "Body view preserves the sea-level hydrosphere baseline. Terrain and hydration stay subtle. Parcel blocks remain hidden."
    }),
    surface: Object.freeze({
      title: "Surface View",
      anchor: "East · Naturalized Terrain Body",
      copy: "Surface view uses elevation parcels as hidden sockets, then blends them into one living land body."
    }),
    hydration: Object.freeze({
      title: "Hydration View",
      anchor: "South · Naturalized Water Bloodstream",
      copy: "Hydration view uses water-permitted parcels to draw rivers, streams, gullies, pools, wetlands, and basin-fill without square water tiles."
    }),
    sixth: Object.freeze({
      title: "The Sixth Sense",
      anchor: "Center · Naturalized Relationship Sense",
      copy: "The Sixth Sense combines terrain body, water bloodstream, edge condition, and held air awareness as one natural planetary perception."
    }),
    lattice: Object.freeze({
      title: "Lattice View",
      anchor: "West · Parcel Scaffold / 256 Proof",
      copy: "Lattice view is the lawful place to inspect the parcel grid, diagnostic geometry, and 256 scaffold."
    }),
    receipt: Object.freeze({
      title: "Receipt View",
      anchor: "Northwest · Parcel Naturalization Receipt",
      copy: "Receipt view proves parcel roles, naturalization status, child authority, and no final visual pass claim."
    })
  });

  var LENS_ALIASES = Object.freeze({
    body: "body",
    surface: "surface",
    hydration: "hydration",
    lattice: "lattice",
    receipt: "receipt",
    sixth: "sixth",
    "sixth-sense": "sixth",
    "the-sixth-sense": "sixth",
    sixthsense: "sixth",
    sixthSense: "sixth",
    relationship: "sixth",
    composite: "sixth"
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

  function clamp(value, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = min;
    return Math.max(min, Math.min(max, number));
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

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function createScope(scopeId, source, authority) {
    return {
      scopeId: scopeId,
      source: source,
      authority: authority,
      ready: false,
      held: true,
      addressSpaceCount: LATTICE_STATES,
      nodeCount: LATTICE_STATES,
      activeNodeCount: 0,
      chronologyState: "not_initialized",
      pressureMapReady: false,
      renderEligibilityMapReady: false,
      receiptMapReady: false,
      parcelRoleMapReady: false,
      drawPacket: null,
      receipt: {
        scopeId: scopeId,
        source: source,
        authority: authority,
        ready: false,
        held: true,
        addressSpaceCount: LATTICE_STATES,
        activeNodeCount: 0,
        finalPassClaim: false
      }
    };
  }

  function makeHeldScope(scopeId, source, authority, reason) {
    var scope = createScope(scopeId, source, authority);
    scope.ready = false;
    scope.held = true;
    scope.chronologyState = "held";
    scope.receiptMapReady = true;
    scope.drawPacket = { ready: false, held: true, items: [], reason: reason || "held" };
    scope.receipt = {
      scopeId: scopeId,
      source: source,
      authority: authority,
      ready: false,
      held: true,
      status: reason || "held",
      addressSpaceCount: LATTICE_STATES,
      nodeCount: LATTICE_STATES,
      activeNodeCount: 0,
      finalPassClaim: false
    };
    return scope;
  }

  function createInitialScopes() {
    return {
      terrainScope256: createScope("terrainScope256", "gratitude_terrain_child", "child_read_only"),
      hydrationScope256: createScope("hydrationScope256", "gratitude_hydration_packet", "child_read_only"),
      hydrationEdgeScope256: createScope("hydrationEdgeScope256", "hydration_edge_child_optional", "child_read_only_held_when_missing"),
      temperatureScope256Held: createScope("temperatureScope256Held", "future_temperature_child", "held_socket_only"),
      atmosphereScope256Held: createScope("atmosphereScope256Held", "future_atmosphere_child", "held_socket_only"),
      climateScope256Held: createScope("climateScope256Held", "future_climate_child", "held_socket_only"),
      chemistryScope256Held: createScope("chemistryScope256Held", "future_chemistry_soil_material_child", "held_socket_only"),
      habitabilityScope256Held: createScope("habitabilityScope256Held", "future_habitability_child", "held_socket_only")
    };
  }

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

    fourSignGrammarRegistered: false,
    fourSignGrammarActive: false,
    unifiedFourSignVisualLanguageActive: false,
    parcelRoleNaturalizationActive: false,
    parcelGridDetected: false,
    parcelGridPreservedUnderHood: true,
    elevationParcelSystemActive: false,
    visibleSquareParcelSuppressionActive: true,
    naturalPhysicsChemistryAlignmentActive: true,
    diagnosticMarkerLanguageSuppressedInSixthSense: true,

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
      surfaceMap: null,
      continentMap: null,
      elevationMap: null,
      hydrationMap: null,
      summitMap: null,
      datumPacket: null,
      streamRegistry: null,
      failureReason: "Gratitude child not checked",
      attempts: 0,
      checkedAt: null
    },

    edgeChild: {
      api: null,
      detected: false,
      apiComplete: false,
      packetReady: false,
      validated: false,
      map: null,
      status: null,
      failureReason: "Hydration edge child not checked",
      attempts: 0,
      checkedAt: null
    },

    parcelRoleCounts: {},
    scopes: createInitialScopes()
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

  function normalizeLensName(value) {
    var raw = String(value || "body");
    var compact = raw.replace(/[^a-zA-Z0-9-]/g, "");
    var lower = compact.toLowerCase();
    return LENS_ALIASES[raw] || LENS_ALIASES[compact] || LENS_ALIASES[lower] || "body";
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
      lon: -142 + (clamp(x, -2, 18) / 15) * 108,
      lat: 56 - (clamp(y, -2, 18) / 15) * 112
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
    atmosphere.addColorStop(0.72, "rgba(141,216,255,0.020)");
    atmosphere.addColorStop(0.92, "rgba(141,216,255,0.095)");
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
    var sixth = state.activeLens === "sixth";
    var body = state.activeLens === "body";

    var bandAlpha = hydration ? 0.18 : sixth ? 0.08 : body ? 0.06 : 0.08;
    var currentAlpha = hydration ? 0.22 : sixth ? 0.10 : body ? 0.07 : 0.09;

    for (var i = 0; i < HYDRO_DEPTH_BANDS.length; i += 1) {
      drawProjectedPath(
        HYDRO_DEPTH_BANDS[i],
        "rgba(85,201,236,0.34)",
        Math.max(0.65, state.dpr * (hydration ? 0.90 : 0.46)),
        bandAlpha
      );
    }

    for (var j = 0; j < HYDRO_CURRENT_ARCS.length; j += 1) {
      drawProjectedPath(
        HYDRO_CURRENT_ARCS[j],
        "rgba(182,245,255,0.26)",
        Math.max(0.62, state.dpr * (hydration ? 0.82 : 0.40)),
        currentAlpha
      );
    }
  }

  function normalizeTerrainSeats(map) {
    if (!map) return [];
    if (Array.isArray(map.seats)) return map.seats;
    if (Array.isArray(map.nodes)) return map.nodes;
    return [];
  }

  function normalizeSurfaceUnits(map) {
    if (!map) return [];
    if (Array.isArray(map.surfaceUnits)) return map.surfaceUnits;
    if (Array.isArray(map.units)) return map.units;
    return [];
  }

  function normalizeHydrationSeats(map) {
    if (!map) return [];
    if (Array.isArray(map.seats)) return map.seats;
    if (Array.isArray(map.nodes)) return map.nodes;
    return [];
  }

  function normalizeSummits(map) {
    if (!map) return [];
    if (Array.isArray(map.summits)) return map.summits;
    if (Array.isArray(map.summitNodes)) return map.summitNodes;
    return [];
  }

  function normalizeStreamList(registry) {
    if (!registry) return [];
    if (Array.isArray(registry.streams)) return registry.streams;
    if (registry.streamRegistry && Array.isArray(registry.streamRegistry.streams)) return registry.streamRegistry.streams;
    return [];
  }

  function isLandSeat(seat) {
    return Boolean(seat && (seat.continentMembership === true || seat.land === true || seat.continentId === "gratitude"));
  }

  function seatHydrationPermission(seat) {
    if (!seat) return false;
    if (seat.waterFillEligible === true) return true;
    if (Number(seat.hydrationDepth) > 0.015) return true;
    if (Number(seat.hydrationPressure) > 0.30) return true;

    var h = String(seat.hydrationClass || "");
    return h.indexOf("lake") >= 0 ||
      h.indexOf("fill") >= 0 ||
      h.indexOf("wetland") >= 0 ||
      h.indexOf("marsh") >= 0 ||
      h.indexOf("coastal") >= 0;
  }

  function seatIsWetland(seat) {
    var h = String(seat && seat.hydrationClass || "");
    return h.indexOf("wetland") >= 0 || h.indexOf("marsh") >= 0;
  }

  function seatIsMarsh(seat) {
    var h = String(seat && seat.hydrationClass || "");
    return h.indexOf("marsh") >= 0;
  }

  function seatIsBasinWater(seat) {
    var h = String(seat && seat.hydrationClass || "");
    return h.indexOf("lake") >= 0 || Boolean(seat && seat.basinStatus && seatHydrationPermission(seat));
  }

  function seatIsValleyFlow(seat) {
    var h = String(seat && seat.hydrationClass || "");
    return h.indexOf("fill") >= 0 || Boolean(seat && seat.valleyStatus && seatHydrationPermission(seat));
  }

  function terrainSeatRole(seat) {
    if (!seat) return "held_future_socket_parcel";

    var terrainClass = String(seat.terrainClass || "");
    var hydrationClass = String(seat.hydrationClass || "");
    var elevation = Number(seat.elevation);
    if (!Number.isFinite(elevation)) elevation = Number(seat.surfaceExpressionDatum);
    if (!Number.isFinite(elevation)) elevation = 0.48;

    if (seat.primaryCategory === "shelf" || terrainClass.indexOf("shelf") >= 0) return "shelf_parcel";
    if (seat.summitPressure > 0.62 || terrainClass.indexOf("summit") >= 0) return "summit_parcel";
    if (seat.mountainRangeReserved || elevation > 0.68) return "mountain_parcel";
    if (seat.ridgeStatus || terrainClass.indexOf("ridge") >= 0) return "ridge_parcel";
    if (seat.desertLandReserved || seat.rainShadowZoneReserved) return "desert_reserve_parcel";
    if (seat.dryBasinReserved) return "dry_basin_parcel";
    if (seat.basinStatus || terrainClass.indexOf("basin") >= 0) return "basin_parcel";
    if (seat.valleyStatus || terrainClass.indexOf("valley") >= 0) return "valley_parcel";
    if (seat.coastEligible || terrainClass.indexOf("coast") >= 0 || hydrationClass.indexOf("coastal") >= 0) return "coast_parcel";
    if (seatIsMarsh(seat)) return "marsh_parcel";
    if (seatIsWetland(seat)) return "wetland_parcel";
    if (seatHydrationPermission(seat)) return "relationship_parcel";
    if (isLandSeat(seat)) return "plain_parcel";
    return "held_future_socket_parcel";
  }

  function hydrationSeatRole(seat) {
    if (!seatHydrationPermission(seat)) return "held_future_socket_parcel";
    if (seatIsMarsh(seat)) return "marsh_parcel";
    if (seatIsWetland(seat)) return "wetland_parcel";
    if (seatIsBasinWater(seat)) return "pool_parcel";
    if (seatIsValleyFlow(seat)) return "stream_parcel";
    if (Number(seat.hydrationDepth) > 0.22) return "river_feed_parcel";
    return "gully_parcel";
  }

  function edgeItemRole(item) {
    var type = String(item && (item.edgeType || item.edgeClass || item.primaryCategory || "") || "");
    if (type.indexOf("waterfall") >= 0) return "waterfall_candidate_parcel";
    if (type.indexOf("cliff") >= 0) return "cliff_candidate_parcel";
    if (type.indexOf("beach") >= 0) return "beach_candidate_parcel";
    if (type.indexOf("shelf") >= 0) return "shelf_parcel";
    return "coast_parcel";
  }

  function countRoles(items, roleGetter) {
    var counts = {};
    PARCEL_ROLES.forEach(function (role) {
      counts[role] = 0;
    });

    for (var i = 0; i < items.length; i += 1) {
      var role = roleGetter(items[i]);
      counts[role] = (counts[role] || 0) + 1;
    }

    return counts;
  }

  function mergeRoleCounts() {
    var merged = {};
    PARCEL_ROLES.forEach(function (role) {
      merged[role] = 0;
    });

    var scopes = [
      state.scopes.terrainScope256,
      state.scopes.hydrationScope256,
      state.scopes.hydrationEdgeScope256
    ];

    scopes.forEach(function (scope) {
      var counts = scope && scope.receipt && scope.receipt.parcelRoleCounts ? scope.receipt.parcelRoleCounts : {};
      Object.keys(counts).forEach(function (key) {
        merged[key] = (merged[key] || 0) + counts[key];
      });
    });

    state.parcelRoleCounts = merged;
    return merged;
  }

  function cellProjectedFromCenter(x, y) {
    var loc = terrainSeatToLonLat(x, y);
    return projectPoint(lonLatPoint(loc.lon, loc.lat));
  }

  function drawSoftParcelMass(seat, mode) {
    if (!seat || !isLandSeat(seat)) return;

    var ctx = state.ctx;
    var x = Number(seat.x);
    var y = Number(seat.y);
    if (!Number.isFinite(x)) x = Number(seat.centerX) || 0;
    if (!Number.isFinite(y)) y = Number(seat.centerY) || 0;

    var p = cellProjectedFromCenter(x, y);
    if (!p.frontFacing) return;

    var elevation = Number(seat.elevation);
    if (!Number.isFinite(elevation)) elevation = Number(seat.surfaceExpressionDatum);
    if (!Number.isFinite(elevation)) elevation = 0.48;

    var role = seat.parcelRole || terrainSeatRole(seat);
    var baseAlpha = mode === "surface" ? 0.36 : mode === "sixth" ? 0.23 : 0.035;
    var size = mode === "surface" ? 9.2 : mode === "sixth" ? 8.0 : 5.6;

    if (role === "summit_parcel" || role === "mountain_parcel" || role === "ridge_parcel") size *= 0.86;
    if (role === "basin_parcel" || role === "valley_parcel") size *= 1.10;
    if (role === "coast_parcel") size *= 1.03;

    var rx = Math.max(2.8, state.dpr * size * p.perspective);
    var ry = Math.max(2.0, state.dpr * size * 0.62 * p.perspective);

    var warm = 72 + elevation * 54;
    var green = 98 + elevation * 58;
    var blue = 72 + elevation * 28;

    if (role === "summit_parcel" || role === "mountain_parcel" || role === "ridge_parcel") {
      warm += 22;
      green += 12;
      blue += 3;
    }

    if (role === "basin_parcel" || role === "valley_parcel") {
      green += 14;
      blue += 12;
    }

    if (role === "desert_reserve_parcel" || role === "dry_basin_parcel") {
      warm += 34;
      green += 18;
      blue -= 16;
    }

    if (role === "coast_parcel") {
      warm += 10;
      green += 10;
      blue += 12;
    }

    warm = Math.floor(clamp(warm, 0, 255));
    green = Math.floor(clamp(green, 0, 255));
    blue = Math.floor(clamp(blue, 0, 255));

    ctx.save();
    clipSphere();

    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx * 1.85);
    gradient.addColorStop(0.00, "rgba(" + warm + "," + green + "," + blue + "," + (baseAlpha * 0.92).toFixed(3) + ")");
    gradient.addColorStop(0.42, "rgba(" + warm + "," + green + "," + blue + "," + (baseAlpha * 0.48).toFixed(3) + ")");
    gradient.addColorStop(1.00, "rgba(" + warm + "," + green + "," + blue + ",0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx * 1.72, ry * 1.30, (x + y) * 0.08, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawNaturalRidgeLine(seats, mode) {
    var ridgeSeats = seats.filter(function (seat) {
      var role = seat.parcelRole || terrainSeatRole(seat);
      return role === "ridge_parcel" || role === "summit_parcel" || role === "mountain_parcel";
    });

    ridgeSeats.sort(function (a, b) {
      return (Number(a.y) || 0) - (Number(b.y) || 0) || (Number(a.x) || 0) - (Number(b.x) || 0);
    });

    if (ridgeSeats.length < 2) return;

    var ctx = state.ctx;
    var projected = ridgeSeats.slice(0, 12).map(function (seat) {
      return cellProjectedFromCenter(Number(seat.x) || 0, Number(seat.y) || 0);
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 2) return;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      if (i === 0) ctx.moveTo(projected[i].x, projected[i].y);
      else {
        var prev = projected[i - 1];
        var cur = projected[i];
        ctx.quadraticCurveTo((prev.x + cur.x) / 2, (prev.y + cur.y) / 2, cur.x, cur.y);
      }
    }

    ctx.strokeStyle = "rgba(231,219,178," + (mode === "surface" ? "0.145" : "0.070") + ")";
    ctx.lineWidth = Math.max(0.45, state.dpr * (mode === "surface" ? 0.84 : 0.48));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawNaturalCoastLine(seats, mode) {
    var coastSeats = seats.filter(function (seat) {
      var role = seat.parcelRole || terrainSeatRole(seat);
      return role === "coast_parcel" || role === "shelf_parcel";
    });

    if (coastSeats.length < 3) return;

    var centerX = coastSeats.reduce(function (total, seat) { return total + (Number(seat.x) || 0); }, 0) / coastSeats.length;
    var centerY = coastSeats.reduce(function (total, seat) { return total + (Number(seat.y) || 0); }, 0) / coastSeats.length;

    coastSeats.sort(function (a, b) {
      var aa = Math.atan2((Number(a.y) || 0) - centerY, (Number(a.x) || 0) - centerX);
      var bb = Math.atan2((Number(b.y) || 0) - centerY, (Number(b.x) || 0) - centerX);
      return aa - bb;
    });

    var ctx = state.ctx;
    var projected = coastSeats.map(function (seat) {
      return cellProjectedFromCenter(Number(seat.x) || 0, Number(seat.y) || 0);
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 2) return;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      var p = projected[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else {
        var prev = projected[i - 1];
        ctx.quadraticCurveTo((prev.x + p.x) / 2, (prev.y + p.y) / 2, p.x, p.y);
      }
    }

    ctx.closePath();
    ctx.strokeStyle = "rgba(219,205,156," + (mode === "surface" ? "0.25" : "0.13") + ")";
    ctx.lineWidth = Math.max(0.48, state.dpr * (mode === "surface" ? 0.86 : 0.46));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawNaturalTerrainBody(mode) {
    var scope = state.scopes.terrainScope256;
    if (!scope || !scope.ready || !scope.drawPacket) return;

    var packet = scope.drawPacket;
    var seats = normalizeArray(packet.landSeats);
    var units = normalizeArray(packet.surfaceUnits);

    for (var u = 0; u < units.length; u += mode === "surface" ? 2 : 5) {
      drawSoftSurfaceUnit(units[u], mode);
    }

    for (var i = 0; i < seats.length; i += 1) {
      drawSoftParcelMass(seats[i], mode);
    }

    drawNaturalCoastLine(seats, mode);
    drawNaturalRidgeLine(seats, mode);

    if (mode === "surface") drawSummitMarkers(0.30);
    if (mode === "sixth") drawSummitMarkers(0.14);
  }

  function drawSoftSurfaceUnit(unit, mode) {
    if (!unit) return;

    var ctx = state.ctx;
    var x = Number(unit.x);
    var y = Number(unit.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    var p = cellProjectedFromCenter(x, y);
    if (!p.frontFacing) return;

    var elevation = Number(unit.elevation);
    if (!Number.isFinite(elevation)) elevation = 0.48;

    var alpha = mode === "surface" ? 0.075 : mode === "sixth" ? 0.040 : 0.012;
    var rx = Math.max(1.6, state.dpr * 4.6 * p.perspective);
    var ry = Math.max(1.1, state.dpr * 2.9 * p.perspective);

    var warm = Math.floor(clamp(76 + elevation * 42, 0, 255));
    var green = Math.floor(clamp(96 + elevation * 54, 0, 255));
    var blue = Math.floor(clamp(78 + elevation * 22, 0, 255));

    ctx.save();
    clipSphere();

    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx * 1.65);
    gradient.addColorStop(0.00, "rgba(" + warm + "," + green + "," + blue + "," + alpha.toFixed(3) + ")");
    gradient.addColorStop(0.70, "rgba(" + warm + "," + green + "," + blue + "," + (alpha * 0.24).toFixed(3) + ")");
    gradient.addColorStop(1.00, "rgba(" + warm + "," + green + "," + blue + ",0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx * 1.4, ry, (x + y) * 0.11, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawSummitMarkers(alpha) {
    var scope = state.scopes.terrainScope256;
    if (!scope || !scope.ready || !scope.drawPacket) return;

    var summits = normalizeArray(scope.drawPacket.summits);
    if (!summits.length) return;

    var ctx = state.ctx;
    ctx.save();
    clipSphere();

    for (var i = 0; i < summits.length; i += 1) {
      var summit = summits[i];
      var p = cellProjectedFromCenter(Number(summit.x) || 0, Number(summit.y) || 0);
      if (!p.frontFacing) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, state.dpr * 1.35 * p.perspective), 0, TAU);
      ctx.fillStyle = "rgba(218,201,150," + clamp(alpha, 0, 1).toFixed(3) + ")";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawWaterPoolSpot(seat, mode) {
    if (!seat || !seatHydrationPermission(seat)) return;

    var ctx = state.ctx;
    var x = Number(seat.x);
    var y = Number(seat.y);
    if (!Number.isFinite(x)) x = Number(seat.centerX) || 0;
    if (!Number.isFinite(y)) y = Number(seat.centerY) || 0;

    var p = cellProjectedFromCenter(x, y);
    if (!p.frontFacing) return;

    var role = seat.parcelRole || hydrationSeatRole(seat);
    var depth = Number(seat.hydrationDepth);
    if (!Number.isFinite(depth)) depth = Number(seat.hydrationPressure);
    if (!Number.isFinite(depth)) depth = 0.16;

    var alpha = mode === "hydration" ? 0.30 : mode === "sixth" ? 0.16 : 0.06;
    var size = 4.8;

    if (role === "pool_parcel") size = 7.2;
    if (role === "wetland_parcel" || role === "marsh_parcel") size = 8.4;
    if (role === "gully_parcel") size = 3.6;

    var rx = Math.max(1.5, state.dpr * size * (0.75 + depth) * p.perspective);
    var ry = Math.max(1.1, state.dpr * size * 0.48 * (0.75 + depth) * p.perspective);

    ctx.save();
    clipSphere();

    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx * 1.62);
    gradient.addColorStop(0.00, "rgba(128,218,232," + (alpha * 0.66).toFixed(3) + ")");
    gradient.addColorStop(0.50, "rgba(60,154,185," + (alpha * 0.34).toFixed(3) + ")");
    gradient.addColorStop(1.00, "rgba(60,154,185,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx * 1.25, ry, x * 0.19 + y * 0.04, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function nearestSeat(origin, candidates) {
    var winner = null;
    var best = Infinity;

    for (var i = 0; i < candidates.length; i += 1) {
      var c = candidates[i];
      var dx = (Number(origin.x) || 0) - (Number(c.x) || 0);
      var dy = (Number(origin.y) || 0) - (Number(c.y) || 0);
      var d = dx * dx + dy * dy;

      if (d < best && d > 0) {
        best = d;
        winner = c;
      }
    }

    return winner;
  }

  function buildFlowPackets(hydrationSeats) {
    var active = hydrationSeats.filter(seatHydrationPermission).slice();

    active.sort(function (a, b) {
      var ay = Number(a.y) || 0;
      var by = Number(b.y) || 0;
      if (ay !== by) return ay - by;
      return (Number(a.x) || 0) - (Number(b.x) || 0);
    });

    var flows = [];
    var valleys = active.filter(seatIsValleyFlow);
    var basins = active.filter(seatIsBasinWater);
    var wet = active.filter(seatIsWetland);

    if (valleys.length >= 2) {
      flows.push({
        flowId: "hydrationScope256-natural-main-bloodstream",
        kind: "river",
        major: true,
        points: valleys.slice(0, Math.min(10, valleys.length)).map(function (seat) {
          return { x: Number(seat.x) || 0, y: Number(seat.y) || 0 };
        })
      });
    }

    if (basins.length && valleys.length) {
      for (var i = 0; i < Math.min(6, basins.length); i += 1) {
        var basin = basins[i];
        var near = nearestSeat(basin, valleys);

        if (near) {
          flows.push({
            flowId: "hydrationScope256-natural-basin-feed-" + String(i + 1).padStart(2, "0"),
            kind: i === 0 ? "stream" : "gully",
            major: false,
            points: [
              { x: Number(near.x) || 0, y: Number(near.y) || 0 },
              {
                x: ((Number(near.x) || 0) + (Number(basin.x) || 0)) / 2,
                y: ((Number(near.y) || 0) + (Number(basin.y) || 0)) / 2 + 0.15
              },
              { x: Number(basin.x) || 0, y: Number(basin.y) || 0 }
            ]
          });
        }
      }
    }

    if (wet.length >= 2) {
      flows.push({
        flowId: "hydrationScope256-wetland-slow-drainage",
        kind: "wetland",
        major: false,
        points: wet.slice(0, Math.min(8, wet.length)).map(function (seat) {
          return { x: Number(seat.x) || 0, y: Number(seat.y) || 0 };
        })
      });
    }

    if (flows.length === 0 && active.length >= 2) {
      flows.push({
        flowId: "hydrationScope256-natural-gully-chain",
        kind: "gully",
        major: false,
        points: active.slice(0, Math.min(8, active.length)).map(function (seat) {
          return { x: Number(seat.x) || 0, y: Number(seat.y) || 0 };
        })
      });
    }

    return flows;
  }

  function drawNaturalFlowLine(flow, mode) {
    if (!flow || !Array.isArray(flow.points) || flow.points.length < 2) return;

    var ctx = state.ctx;
    var projected = flow.points.map(function (point) {
      return cellProjectedFromCenter(Number(point.x) || 0, Number(point.y) || 0);
    });

    if (projected.filter(function (p) { return p.frontFacing; }).length < 2) return;

    var alpha = mode === "hydration" ? 0.54 : mode === "sixth" ? 0.30 : 0.10;
    var width = mode === "hydration" ? 0.94 : 0.58;

    if (flow.kind === "river") width *= 1.45;
    if (flow.kind === "stream") width *= 0.98;
    if (flow.kind === "gully") width *= 0.62;
    if (flow.kind === "wetland") width *= 0.46;

    ctx.save();
    clipSphere();
    ctx.beginPath();

    for (var i = 0; i < projected.length; i += 1) {
      var p = projected[i];

      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        var prev = projected[i - 1];
        var mx = (prev.x + p.x) / 2;
        var my = (prev.y + p.y) / 2;
        ctx.quadraticCurveTo(mx, my, p.x, p.y);
      }
    }

    ctx.strokeStyle = "rgba(135,220,236," + alpha.toFixed(3) + ")";
    ctx.lineWidth = Math.max(0.42, state.dpr * width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(86,180,205,0.24)";
    ctx.shadowBlur = Math.max(0.8, state.dpr * 1.8);
    ctx.stroke();
    ctx.restore();
  }

  function drawNaturalHydration(mode) {
    var scope = state.scopes.hydrationScope256;
    if (!scope || !scope.ready || !scope.drawPacket) return;

    var packet = scope.drawPacket;
    var active = normalizeArray(packet.activeHydrationSeats);

    for (var i = 0; i < active.length; i += 1) {
      drawWaterPoolSpot(active[i], mode);
    }

    var flows = normalizeArray(packet.flows);
    for (var f = 0; f < flows.length; f += 1) {
      drawNaturalFlowLine(flows[f], mode);
    }
  }

  function normalizeEdgeItems(map) {
    if (!map) return [];

    var raw = [];
    if (Array.isArray(map.edges)) raw = map.edges;
    else if (Array.isArray(map.edgeNodes)) raw = map.edgeNodes;
    else if (Array.isArray(map.nodes)) raw = map.nodes;

    return raw.map(function (item, index) {
      if (Array.isArray(item.points)) {
        item.parcelRole = item.parcelRole || edgeItemRole(item);
        return item;
      }

      var x = Number(item.x);
      var y = Number(item.y);
      if (!Number.isFinite(x)) x = Number(item.centerX) || 0;
      if (!Number.isFinite(y)) y = Number(item.centerY) || 0;

      var a = terrainSeatToLonLat(x - 0.30, y);
      var b = terrainSeatToLonLat(x + 0.30, y);

      return {
        edgeId: item.edgeId || item.nodeId || "hydration-edge-" + String(index + 1).padStart(2, "0"),
        edgeType: item.edgeType || item.primaryCategory || item.edgeClass || "edge",
        parcelRole: edgeItemRole(item),
        x: x,
        y: y,
        points: [[a.lon, a.lat], [b.lon, b.lat]]
      };
    });
  }

  function drawNaturalEdgeItem(item, mode) {
    if (!item || !item.points || item.points.length < 2) return;

    var type = String(item.edgeType || item.edgeClass || item.primaryCategory || "");
    var role = item.parcelRole || edgeItemRole(item);
    var alpha = mode === "sixth" ? 0.26 : mode === "surface" ? 0.24 : 0.20;
    var stroke = "rgba(220,204,160,0.40)";
    var width = Math.max(0.36, state.dpr * 0.48);

    if (role === "beach_candidate_parcel" || type.indexOf("beach") >= 0) {
      stroke = "rgba(220,198,142,0.34)";
      width = Math.max(0.42, state.dpr * 0.54);
    } else if (role === "cliff_candidate_parcel" || type.indexOf("cliff") >= 0) {
      stroke = "rgba(180,174,156,0.42)";
      width = Math.max(0.40, state.dpr * 0.52);
    } else if (role === "waterfall_candidate_parcel" || type.indexOf("waterfall") >= 0) {
      stroke = "rgba(144,224,238,0.48)";
      width = Math.max(0.46, state.dpr * 0.64);
    }

    drawProjectedPath(item.points, stroke, width, alpha);
  }

  function drawNaturalEdge(mode) {
    var scope = state.scopes.hydrationEdgeScope256;
    if (!scope || !scope.ready || !scope.drawPacket) return;
    if (mode !== "surface" && mode !== "hydration" && mode !== "sixth") return;

    var items = normalizeArray(scope.drawPacket.edgeItems);
    for (var i = 0; i < items.length; i += 1) {
      drawNaturalEdgeItem(items[i], mode);
    }
  }

  function drawHeldAirBreathSocket(mode) {
    if (mode !== "sixth" && mode !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    var breath = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.26, r * 0.45, cx, cy, r * 1.10);
    breath.addColorStop(0.00, "rgba(184,238,255,0)");
    breath.addColorStop(0.50, "rgba(184,238,255,0.012)");
    breath.addColorStop(0.82, "rgba(184,238,255,0.038)");
    breath.addColorStop(1.00, "rgba(184,238,255,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.055, 0, TAU);
    ctx.fillStyle = breath;
    ctx.fill();

    ctx.restore();
  }

  function drawNaturalizedExpression() {
    if (state.activeLens === "body") {
      drawNaturalTerrainBody("body");
      return;
    }

    if (state.activeLens === "surface") {
      drawNaturalTerrainBody("surface");
      drawNaturalEdge("surface");
      return;
    }

    if (state.activeLens === "hydration") {
      drawNaturalTerrainBody("sixth");
      drawNaturalHydration("hydration");
      drawNaturalEdge("hydration");
      return;
    }

    if (state.activeLens === "sixth") {
      drawNaturalTerrainBody("sixth");
      drawNaturalHydration("sixth");
      drawNaturalEdge("sixth");
      drawHeldAirBreathSocket("sixth");
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
    ctx.globalAlpha = state.activeLens === "lattice" ? 0.22 : state.activeLens === "body" ? 0.030 : 0.062;
    strokeLine(equator, "rgba(244,207,131,0.10)", Math.max(0.34, state.dpr * 0.28));
    strokeLine(meridian, "rgba(141,216,255,0.055)", Math.max(0.30, state.dpr * 0.23));
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

  function drawParcelScaffoldInLattice() {
    if (state.activeLens !== "lattice") return;

    var scope = state.scopes.terrainScope256;
    if (!scope || !scope.ready || !scope.drawPacket) return;

    var seats = normalizeArray(scope.drawPacket.landSeats);
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      var x = Number(seat.x) || 0;
      var y = Number(seat.y) || 0;
      var p = cellProjectedFromCenter(x, y);
      if (!p.frontFacing) continue;

      var size = Math.max(1.8, state.dpr * 3.4 * p.perspective);
      ctx.strokeStyle = "rgba(244,207,131,0.18)";
      ctx.lineWidth = Math.max(0.26, state.dpr * 0.28);
      ctx.strokeRect(p.x - size, p.y - size * 0.72, size * 2, size * 1.44);
    }

    ctx.restore();
  }

  function receiptLines() {
    var terrain = state.scopes.terrainScope256.receipt;
    var hydration = state.scopes.hydrationScope256.receipt;
    var edge = state.scopes.hydrationEdgeScope256.receipt;

    return {
      headline: state.gratitude.validated ? "PARCEL ROLES NATURALIZED" : "PARCEL NATURALIZATION HELD",
      line1: "TERRAIN " + (terrain.activeNodeCount || 0) + " · WATER " + (hydration.activeNodeCount || 0) + " · EDGE " + (edge.activeNodeCount || 0),
      line2: "GRID UNDER HOOD · VISIBLE SQUARES SUPPRESSED",
      line3: "SURFACE NATURAL · HYDRATION NATURAL · SIXTH SENSE NATURAL",
      line4: "SIGNS DO NOT OVERRIDE PHYSICS · FINAL VISUAL PASS FALSE"
    };
  }

  function drawReceiptOverlay() {
    if (state.activeLens !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var lines = receiptLines();
    var w = Math.min(state.width * 0.82, m.radius * 2.18);
    var h = Math.min(state.height * 0.35, m.radius * 0.88);
    var x = m.centerX - w / 2;
    var y = m.centerY - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,0.67)";
    ctx.strokeStyle = state.gratitude.validated ? "rgba(167,243,198,0.40)" : "rgba(244,207,131,0.34)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12.4 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.gratitude.validated ? "rgba(167,243,198,0.94)" : "rgba(244,207,131,0.92)";
    ctx.fillText(lines.headline, m.centerX, y + h * 0.18);

    ctx.font = "900 " + Math.max(8, 8.7 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,0.84)";
    ctx.fillText(lines.line1, m.centerX, y + h * 0.36);
    ctx.fillStyle = "rgba(141,216,255,0.82)";
    ctx.fillText(lines.line2, m.centerX, y + h * 0.52);
    ctx.fillStyle = "rgba(244,207,131,0.80)";
    ctx.fillText(lines.line3, m.centerX, y + h * 0.68);
    ctx.fillStyle = "rgba(167,243,198,0.84)";
    ctx.fillText(lines.line4, m.centerX, y + h * 0.84);

    ctx.restore();
  }

  function buildTerrainScope() {
    var surfaceMap = state.gratitude.surfaceMap || state.gratitude.continentMap;
    var seats = normalizeTerrainSeats(surfaceMap);
    var landSeats = seats.filter(isLandSeat).map(function (seat) {
      var copy = Object.assign({}, seat);
      copy.parcelRole = terrainSeatRole(copy);
      return copy;
    });

    var surfaceUnits = normalizeSurfaceUnits(surfaceMap);
    var summits = normalizeSummits(state.gratitude.summitMap);
    var streams = normalizeStreamList(state.gratitude.streamRegistry);
    var roleCounts = countRoles(landSeats, function (seat) { return seat.parcelRole || terrainSeatRole(seat); });

    var scope = createScope("terrainScope256", "window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD", "child_read_only");
    scope.ready = state.gratitude.validated && landSeats.length > 0;
    scope.held = !scope.ready;
    scope.activeNodeCount = landSeats.length;
    scope.chronologyState = scope.ready ? "datum_to_elevation_to_terrain_role_to_naturalized_body" : "held_until_gratitude_child_validates";
    scope.pressureMapReady = scope.ready;
    scope.renderEligibilityMapReady = scope.ready;
    scope.receiptMapReady = true;
    scope.parcelRoleMapReady = scope.ready;
    scope.drawPacket = {
      ready: scope.ready,
      held: !scope.ready,
      sign: FOUR_SIGNS.terrain,
      landSeats: landSeats,
      surfaceUnits: surfaceUnits,
      summits: summits,
      streams: streams,
      parcelRoleCounts: roleCounts,
      landNodeCount: landSeats.length,
      surfaceUnitCount: surfaceUnits.length,
      ridgeCount: landSeats.filter(function (seat) { return seat.parcelRole === "ridge_parcel"; }).length,
      basinCount: landSeats.filter(function (seat) { return seat.parcelRole === "basin_parcel"; }).length,
      valleyCount: landSeats.filter(function (seat) { return seat.parcelRole === "valley_parcel"; }).length,
      coastCount: landSeats.filter(function (seat) { return seat.parcelRole === "coast_parcel"; }).length,
      mountainCount: landSeats.filter(function (seat) { return seat.parcelRole === "mountain_parcel" || seat.parcelRole === "summit_parcel"; }).length,
      desertReservationCount: landSeats.filter(function (seat) { return seat.parcelRole === "desert_reserve_parcel" || seat.parcelRole === "dry_basin_parcel"; }).length,
      renderSource: "terrain_scope_child_packet_naturalized"
    };

    scope.receipt = {
      scopeId: scope.scopeId,
      source: scope.source,
      authority: scope.authority,
      heroSign: FOUR_SIGNS.terrain.heroSign,
      ready: scope.ready,
      held: scope.held,
      addressSpaceCount: LATTICE_STATES,
      nodeCount: LATTICE_STATES,
      activeNodeCount: landSeats.length,
      landNodeCount: landSeats.length,
      surfaceUnitCount: surfaceUnits.length,
      parcelRoleCounts: roleCounts,
      terrainParcelsNaturalized: true,
      visibleSquareParcelSuppressionActive: true,
      parcelGridPreservedUnderHood: true,
      terrainRenderedAsBody: true,
      carrierInventsTerrain: false,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false
    };

    return scope;
  }

  function buildHydrationScope() {
    var hydrationMap = state.gratitude.hydrationMap;
    var seats = normalizeHydrationSeats(hydrationMap);
    var hydrationSeats = seats.filter(function (seat) {
      return isLandSeat(seat) || seatHydrationPermission(seat);
    }).map(function (seat) {
      var copy = Object.assign({}, seat);
      copy.parcelRole = hydrationSeatRole(copy);
      return copy;
    });

    var active = hydrationSeats.filter(seatHydrationPermission);
    var flows = buildFlowPackets(active);
    var roleCounts = countRoles(active, function (seat) { return seat.parcelRole || hydrationSeatRole(seat); });

    var typeCounts = {
      pools: roleCounts.pool_parcel || 0,
      rivers: roleCounts.river_feed_parcel || 0,
      streams: roleCounts.stream_parcel || 0,
      gullies: roleCounts.gully_parcel || 0,
      wetlands: roleCounts.wetland_parcel || 0,
      marshes: roleCounts.marsh_parcel || 0
    };

    typeCounts.rivers = Math.max(typeCounts.rivers, flows.filter(function (flow) { return flow.kind === "river"; }).length);
    typeCounts.streams = Math.max(typeCounts.streams, flows.filter(function (flow) { return flow.kind === "stream"; }).length);

    var scope = createScope("hydrationScope256", "window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD.getHydrationMap", "child_read_only");
    scope.ready = state.gratitude.validated && active.length > 0;
    scope.held = !scope.ready;
    scope.activeNodeCount = active.length;
    scope.chronologyState = scope.ready ? "terrain_permission_to_hydration_role_to_naturalized_bloodstream" : "held_until_hydration_packet_validates";
    scope.pressureMapReady = scope.ready;
    scope.renderEligibilityMapReady = scope.ready;
    scope.receiptMapReady = true;
    scope.parcelRoleMapReady = scope.ready;
    scope.drawPacket = {
      ready: scope.ready,
      held: !scope.ready,
      sign: FOUR_SIGNS.water,
      hydrationSeats: hydrationSeats,
      activeHydrationSeats: active,
      flows: flows,
      parcelRoleCounts: roleCounts,
      pools: typeCounts.pools,
      rivers: typeCounts.rivers,
      streams: typeCounts.streams,
      gullies: typeCounts.gullies,
      wetlands: typeCounts.wetlands,
      marshes: typeCounts.marshes,
      hydrationNodeCount: active.length,
      renderSource: "hydration_scope_child_packet_naturalized"
    };

    scope.receipt = {
      scopeId: scope.scopeId,
      source: scope.source,
      authority: scope.authority,
      heroSign: FOUR_SIGNS.water.heroSign,
      ready: scope.ready,
      held: scope.held,
      addressSpaceCount: LATTICE_STATES,
      nodeCount: LATTICE_STATES,
      activeNodeCount: active.length,
      hydrationNodeCount: active.length,
      parcelRoleCounts: roleCounts,
      pools: typeCounts.pools,
      rivers: typeCounts.rivers,
      streams: typeCounts.streams,
      gullies: typeCounts.gullies,
      wetlands: typeCounts.wetlands,
      marshes: typeCounts.marshes,
      hydrationParcelsNaturalized: true,
      visibleSquareParcelSuppressionActive: true,
      parcelGridPreservedUnderHood: true,
      waterRenderedAsBloodstream: true,
      carrierInventsHydration: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    return scope;
  }

  function detectHydrationEdgeChild() {
    state.edgeChild.attempts += 1;
    state.edgeChild.checkedAt = new Date().toISOString();

    var api = window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD ||
      window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD ||
      window.AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD ||
      null;

    state.edgeChild.api = api;
    state.edgeChild.detected = Boolean(api);
    state.edgeChild.apiComplete = false;
    state.edgeChild.packetReady = false;
    state.edgeChild.validated = false;
    state.edgeChild.map = null;
    state.edgeChild.status = null;

    if (!api) {
      state.edgeChild.failureReason = "Hydration edge child not loaded · edge scope held";
      return false;
    }

    state.edgeChild.apiComplete = Boolean(
      typeof api.status === "function" ||
      typeof api.getHydrationEdgeMap === "function" ||
      typeof api.getEdgeMap === "function" ||
      typeof api.getChildReceivePacket === "function"
    );

    if (!state.edgeChild.apiComplete) {
      state.edgeChild.failureReason = "Hydration edge child API incomplete · edge scope held";
      return false;
    }

    try {
      var status = typeof api.status === "function" ? api.status() : null;
      var map = null;

      if (typeof api.getHydrationEdgeMap === "function") map = api.getHydrationEdgeMap({ compact: false });
      else if (typeof api.getEdgeMap === "function") map = api.getEdgeMap({ compact: false });
      else if (typeof api.getChildReceivePacket === "function") map = api.getChildReceivePacket("audralia-parcel-naturalization-carrier", { compact: false });

      state.edgeChild.status = status;
      state.edgeChild.map = map;
      state.edgeChild.packetReady = Boolean(map);
      state.edgeChild.validated = Boolean(
        map &&
        (Array.isArray(map.edges) || Array.isArray(map.nodes) || Array.isArray(map.edgeNodes) || map.childReceivePacketReady === true)
      );
      state.edgeChild.failureReason = state.edgeChild.validated ? "" : "Hydration edge child packet unavailable · edge scope held";

      return state.edgeChild.validated;
    } catch (error) {
      recordError("detectHydrationEdgeChild", error);
      state.edgeChild.failureReason = "Hydration edge child exception · edge scope held";
      return false;
    }
  }

  function buildHydrationEdgeScope() {
    var validated = detectHydrationEdgeChild();

    if (!validated) {
      return makeHeldScope(
        "hydrationEdgeScope256",
        "hydration_edge_child_optional",
        "child_read_only_held_when_missing",
        "held_child_not_loaded"
      );
    }

    var edgeItems = normalizeEdgeItems(state.edgeChild.map);
    var roleCounts = countRoles(edgeItems, function (item) { return item.parcelRole || edgeItemRole(item); });

    var scope = createScope("hydrationEdgeScope256", "window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD", "child_read_only");
    scope.ready = edgeItems.length > 0;
    scope.held = !scope.ready;
    scope.activeNodeCount = edgeItems.length;
    scope.chronologyState = scope.ready ? "terrain_and_hydration_to_edge_role_to_naturalized_transition" : "held_until_edge_child_publishes";
    scope.pressureMapReady = scope.ready;
    scope.renderEligibilityMapReady = scope.ready;
    scope.receiptMapReady = true;
    scope.parcelRoleMapReady = scope.ready;
    scope.drawPacket = {
      ready: scope.ready,
      held: !scope.ready,
      edgeItems: edgeItems,
      parcelRoleCounts: roleCounts,
      beachCount: roleCounts.beach_candidate_parcel || 0,
      cliffCount: roleCounts.cliff_candidate_parcel || 0,
      waterfallCount: roleCounts.waterfall_candidate_parcel || 0,
      shelfCount: roleCounts.shelf_parcel || 0,
      renderSource: "hydration_edge_child_packet_naturalized"
    };

    scope.receipt = {
      scopeId: scope.scopeId,
      source: scope.source,
      authority: scope.authority,
      ready: scope.ready,
      held: scope.held,
      addressSpaceCount: LATTICE_STATES,
      nodeCount: LATTICE_STATES,
      activeNodeCount: edgeItems.length,
      parcelRoleCounts: roleCounts,
      beachCount: scope.drawPacket.beachCount,
      cliffCount: scope.drawPacket.cliffCount,
      waterfallCount: scope.drawPacket.waterfallCount,
      shelfCount: scope.drawPacket.shelfCount,
      edgeParcelsNaturalized: true,
      visibleSquareParcelSuppressionActive: true,
      carrierInventsEdge: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    };

    return scope;
  }

  function rebuildScopes() {
    state.scopes.terrainScope256 = buildTerrainScope();
    state.scopes.hydrationScope256 = buildHydrationScope();
    state.scopes.hydrationEdgeScope256 = buildHydrationEdgeScope();

    state.scopes.temperatureScope256Held = makeHeldScope("temperatureScope256Held", "future_temperature_child", "held_socket_only", "temperature_child_not_loaded");
    state.scopes.atmosphereScope256Held = makeHeldScope("atmosphereScope256Held", "future_atmosphere_child", "held_socket_only", "atmosphere_child_not_loaded");
    state.scopes.climateScope256Held = makeHeldScope("climateScope256Held", "future_climate_child", "held_socket_only", "climate_child_not_loaded");
    state.scopes.chemistryScope256Held = makeHeldScope("chemistryScope256Held", "future_chemistry_soil_material_child", "held_socket_only", "chemistry_child_not_loaded");
    state.scopes.habitabilityScope256Held = makeHeldScope("habitabilityScope256Held", "future_habitability_child", "held_socket_only", "habitability_child_not_loaded");

    state.fourSignGrammarRegistered = true;
    state.fourSignGrammarActive = true;
    state.unifiedFourSignVisualLanguageActive = true;
    state.parcelRoleNaturalizationActive = true;
    state.parcelGridDetected = Boolean(state.scopes.terrainScope256.activeNodeCount > 0);
    state.elevationParcelSystemActive = state.parcelGridDetected;
    state.visibleSquareParcelSuppressionActive = true;
    mergeRoleCounts();
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
    state.gratitude.surfaceMap = null;
    state.gratitude.continentMap = null;
    state.gratitude.elevationMap = null;
    state.gratitude.hydrationMap = null;
    state.gratitude.summitMap = null;
    state.gratitude.datumPacket = null;
    state.gratitude.streamRegistry = null;

    if (!api) {
      state.gratitude.failureReason = "Gratitude child missing / invalid · parcel naturalization held";
      rebuildScopes();
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }

    state.gratitude.apiComplete = Boolean(
      typeof api.status === "function" &&
      typeof api.getChildReceivePacket === "function" &&
      (typeof api.getSurfaceMap === "function" || typeof api.getContinentMap === "function") &&
      typeof api.getHydrationMap === "function" &&
      typeof api.getSummitMap === "function"
    );

    if (!state.gratitude.apiComplete) {
      state.gratitude.failureReason = "Gratitude child API incomplete · parcel naturalization held";
      rebuildScopes();
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }

    try {
      var status = api.status();
      var packet = api.getChildReceivePacket("audralia-elevation-parcel-role-naturalization-carrier", { compact: false });
      var surfaceMap = typeof api.getSurfaceMap === "function" ? api.getSurfaceMap({ compact: false }) : null;
      var continentMap = typeof api.getContinentMap === "function" ? api.getContinentMap({ compact: false }) : surfaceMap;
      var elevationMap = typeof api.getElevationMap === "function" ? api.getElevationMap({ compact: false }) : null;
      var hydrationMap = api.getHydrationMap({ compact: false });
      var summitMap = api.getSummitMap({ compact: false });
      var datumPacket = typeof api.getTerrainDatumPacket === "function" ? api.getTerrainDatumPacket("audralia-parcel-naturalization-carrier", { compact: false }) : null;
      var streamRegistry = typeof api.getStreamRegistry === "function" ? api.getStreamRegistry({ compact: false }) : null;

      state.gratitude.status = status;
      state.gratitude.packet = packet;
      state.gratitude.surfaceMap = surfaceMap || continentMap;
      state.gratitude.continentMap = continentMap || surfaceMap;
      state.gratitude.elevationMap = elevationMap;
      state.gratitude.hydrationMap = hydrationMap;
      state.gratitude.summitMap = summitMap;
      state.gratitude.datumPacket = datumPacket;
      state.gratitude.streamRegistry = streamRegistry;
      state.gratitude.packetReady = Boolean(packet && packet.childReceivePacketReady === true);

      var terrainSeats = normalizeTerrainSeats(surfaceMap || continentMap).filter(isLandSeat);
      var hydrationSeats = normalizeHydrationSeats(hydrationMap).filter(seatHydrationPermission);

      state.gratitude.validated = Boolean(
        state.gratitude.packetReady &&
        packet.landFirst === true &&
        packet.nineSummitsEmbedded === true &&
        packet.hydrationIsConsequence === true &&
        packet.waterFillDerivedFromValleys === true &&
        packet.finalVisualPassClaim === false &&
        terrainSeats.length > 0 &&
        hydrationSeats.length > 0
      );

      state.gratitude.failureReason = state.gratitude.validated
        ? ""
        : "Gratitude child validation failed · parcel naturalization held";

      rebuildScopes();
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(12);

      return state.gratitude.validated;
    } catch (error) {
      recordError("validateGratitudeChild", error);
      state.gratitude.failureReason = "Gratitude child packet exception · parcel naturalization held";
      rebuildScopes();
      updateVisibleReadout(true);
      publishStatus(true);
      requestRender(8);
      return false;
    }
  }

  function terrainSignReady() {
    return Boolean(state.scopes.terrainScope256.ready);
  }

  function waterSignReady() {
    return Boolean(state.scopes.hydrationScope256.ready);
  }

  function airSignHeld() {
    return Boolean(
      state.scopes.temperatureScope256Held.held &&
      state.scopes.atmosphereScope256Held.held &&
      state.scopes.climateScope256Held.held
    );
  }

  function sixthSenseReady() {
    return Boolean(terrainSignReady() && waterSignReady());
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
    drawNaturalizedExpression();
    drawReferenceLines();

    if (state.activeLens === "lattice") {
      drawDiagnosticLattice(state.pointerActive);
      drawParcelScaffoldInLattice();
    } else if (state.activeLens === "receipt") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.070;
      drawDiagnosticLattice(true);
      state.ctx.restore();
      drawHeldAirBreathSocket("receipt");
    } else if (state.activeLens === "hydration") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.006;
      drawDiagnosticLattice(true);
      state.ctx.restore();
    } else if (state.activeLens === "sixth") {
      state.ctx.save();
      state.ctx.globalAlpha = 0.004;
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
    var naturalized = Boolean(state.parcelRoleNaturalizationActive && terrainSignReady() && waterSignReady());

    var statusText = naturalized
      ? "Parcel roles naturalized · terrain body + water bloodstream + edge transition"
      : "Parcel naturalization held · child scope validation pending";

    var proofText = naturalized
      ? "parcel grid preserved under hood · visible square suppression active · surface/hydration/sixth sense naturalized"
      : state.gratitude.failureReason || "bounded hold · parcel roles not ready";

    var wroteStatus = setText("[data-audralia-planet-carrier-status]", statusText);
    var wroteProof = setText("[data-audralia-planet-carrier-proof]", proofText);

    state.visibleReadoutUpdated = Boolean(wroteStatus || wroteProof || force);

    var label = naturalized
      ? "Parcel Naturalization → rectangles are sockets; elevation is truth; role is job; carrier naturalizes expression."
      : "Clean Inspection → parcel naturalization pending";

    setText("[data-audralia-planet-stage-label]", label);

    return state.visibleReadoutUpdated;
  }

  function setLens(nextLens) {
    var lens = normalizeLensName(nextLens);
    state.activeLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-planet-lens]")).forEach(function (button) {
      button.setAttribute("aria-pressed", normalizeLensName(button.dataset.audraliaPlanetLens) === lens ? "true" : "false");
    });

    setText("[data-audralia-planet-lens-anchor]", LENSES[lens].anchor);
    setText("[data-audralia-planet-lens-title]", LENSES[lens].title);
    setText("[data-audralia-planet-lens-copy]", LENSES[lens].copy);

    updateVisibleReadout(true);
    setDataset("audraliaPlanetActiveLens", lens);
    publishStatus(true);
    requestRender(lens === "body" ? 10 : 16);
  }

  function ensureSixthSenseControls() {
    function makeButton(className, label) {
      var button = document.createElement("button");
      button.className = className;
      button.type = "button";
      button.setAttribute("data-audralia-planet-lens", "sixth");
      button.setAttribute("aria-pressed", "false");
      button.textContent = label;
      return button;
    }

    var tray = query(".inline-lens-tray");
    if (tray && !tray.querySelector('[data-audralia-planet-lens="sixth"],[data-audralia-planet-lens="sixth-sense"],[data-audralia-planet-lens="the-sixth-sense"]')) {
      tray.appendChild(makeButton("inline-lens-button", "Sixth Sense"));
      tray.setAttribute("data-sixth-sense-lens-injected", "true");
    }

    var engineeringRows = Array.prototype.slice.call(document.querySelectorAll(".lens-row"));
    engineeringRows.forEach(function (row) {
      if (!row.querySelector('[data-audralia-planet-lens="sixth"],[data-audralia-planet-lens="sixth-sense"],[data-audralia-planet-lens="the-sixth-sense"]')) {
        row.appendChild(makeButton("lens-button", "The Sixth Sense"));
        row.setAttribute("data-sixth-sense-lens-injected", "true");
      }
    });
  }

  function bindLensControls() {
    ensureSixthSenseControls();

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
    state.canvas.setAttribute("data-audralia-g2-elevation-parcel-role-naturalization", CONTRACT);
    state.canvas.setAttribute("data-active-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-html-collaborative-contract", HTML_COLLABORATIVE_CONTRACT);
    state.canvas.setAttribute("data-parcel-role-naturalization-active", "true");
    state.canvas.setAttribute("data-parcel-grid-preserved-under-hood", "true");
    state.canvas.setAttribute("data-visible-square-parcel-suppression-active", "true");
    state.canvas.setAttribute("data-terrain-parcels-naturalized", "true");
    state.canvas.setAttribute("data-hydration-parcels-naturalized", "true");
    state.canvas.setAttribute("data-edge-parcels-naturalized", "true");
    state.canvas.setAttribute("data-sixth-sense-parcels-naturalized", "true");
    state.canvas.setAttribute("data-lattice-may-show-parcels", "true");
    state.canvas.setAttribute("data-receipt-may-report-parcels", "true");
    state.canvas.setAttribute("data-four-sign-grammar-active", "true");
    state.canvas.setAttribute("data-terrain-hero-sign", FOUR_SIGNS.terrain.heroSign);
    state.canvas.setAttribute("data-water-hero-sign", FOUR_SIGNS.water.heroSign);
    state.canvas.setAttribute("data-air-hero-sign", FOUR_SIGNS.air.heroSign);
    state.canvas.setAttribute("data-relationship-hero-sign", FOUR_SIGNS.relationship.heroSign);
    state.canvas.setAttribute("data-natural-physics-chemistry-alignment-active", "true");
    state.canvas.setAttribute("data-signs-do-not-override-physics", "true");
    state.canvas.setAttribute("data-relationship-overrides-physics", "false");
    state.canvas.setAttribute("data-carrier-consumes-child", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-carrier-invents-hydration", "false");
    state.canvas.setAttribute("data-carrier-invents-edge", "false");
    state.canvas.setAttribute("data-carrier-invents-air", "false");
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

  function compactScope(scope) {
    return {
      scopeId: scope.scopeId,
      source: scope.source,
      authority: scope.authority,
      ready: scope.ready,
      held: scope.held,
      addressSpaceCount: scope.addressSpaceCount,
      nodeCount: scope.nodeCount,
      activeNodeCount: scope.activeNodeCount,
      chronologyState: scope.chronologyState,
      pressureMapReady: scope.pressureMapReady,
      renderEligibilityMapReady: scope.renderEligibilityMapReady,
      receiptMapReady: scope.receiptMapReady,
      parcelRoleMapReady: scope.parcelRoleMapReady,
      receipt: deepClone(scope.receipt)
    };
  }

  function receipt() {
    var terrainScope = state.scopes.terrainScope256;
    var hydrationScope = state.scopes.hydrationScope256;
    var edgeScope = state.scopes.hydrationEdgeScope256;
    var roleCounts = mergeRoleCounts();

    return {
      activeContract: CONTRACT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlCollaborativeContract: HTML_COLLABORATIVE_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      route: ROUTE,
      target: FILE,
      gratitudeChildFile: GRATITUDE_CHILD_FILE,
      hydrationEdgeChildFile: HYDRATION_EDGE_CHILD_FILE,
      coreChildFile: CORE_CHILD_FILE,

      parcelRoleNaturalizationActive: true,
      parcelGridDetected: state.parcelGridDetected,
      parcelGridPreservedUnderHood: true,
      elevationParcelSystemActive: state.elevationParcelSystemActive,
      parcelRoleExtractionReady: true,
      visibleSquareParcelSuppressionActive: true,
      visibleRectanglesNotFinalExpression: true,
      parcelGridNotDeleted: true,

      terrainParcelsNaturalized: true,
      hydrationParcelsNaturalized: true,
      edgeParcelsNaturalized: true,
      sixthSenseParcelsNaturalized: true,
      latticeMayShowParcels: true,
      receiptMayReportParcels: true,

      fourSignGrammarActive: true,
      fourSignGrammarRegistered: state.fourSignGrammarRegistered,
      terrainHeroSign: FOUR_SIGNS.terrain.heroSign,
      waterHeroSign: FOUR_SIGNS.water.heroSign,
      airHeroSign: FOUR_SIGNS.air.heroSign,
      relationshipHeroSign: FOUR_SIGNS.relationship.heroSign,

      terrainSignReady: terrainSignReady(),
      waterSignReady: waterSignReady(),
      airSignHeld: airSignHeld(),
      relationshipSignReady: sixthSenseReady(),

      unifiedFourSignVisualLanguageActive: true,
      terrainRenderedAsBody: true,
      waterRenderedAsBloodstream: true,
      airRenderedAsHeldBreathSocket: true,
      sixthSenseRenderedAsRelationship: true,

      naturalPhysicsChemistryAlignmentActive: true,
      signsDoNotOverridePhysics: true,
      relationshipDoesNotOverrideNaturalLaw: true,
      relationshipOverridesPhysics: false,
      waterStillFollowsElevation: true,
      edgeStillRequiresPermission: true,
      diagnosticMarkerLanguageSuppressedInSixthSense: true,

      chronology: CHRONOLOGY.slice(),
      multiScopeCompositorActive: true,
      chronologicalCompositeActive: true,

      gratitudeChildDetected: state.gratitude.detected,
      gratitudeChildApiComplete: state.gratitude.apiComplete,
      gratitudeChildPacketReady: state.gratitude.packetReady,
      gratitudeChildValidated: state.gratitude.validated,
      gratitudeChildFailureReason: state.gratitude.failureReason,
      gratitudeChildAttempts: state.gratitude.attempts,
      gratitudeChildCheckedAt: state.gratitude.checkedAt,

      hydrationEdgeChildDetected: state.edgeChild.detected,
      hydrationEdgeChildApiComplete: state.edgeChild.apiComplete,
      hydrationEdgeChildPacketReady: state.edgeChild.packetReady,
      hydrationEdgeChildValidated: state.edgeChild.validated,
      hydrationEdgeChildFailureReason: state.edgeChild.failureReason,

      terrainBodyCount: terrainScope.activeNodeCount,
      waterBloodstreamCount: hydrationScope.activeNodeCount,
      edgeCount: edgeScope.activeNodeCount,
      parcelRoleCounts: roleCounts,

      terrainScope256Ready: terrainScope.ready,
      hydrationScope256Ready: hydrationScope.ready,
      hydrationEdgeScope256Ready: edgeScope.ready,
      hydrationEdgeScope256Held: edgeScope.held,
      temperatureScope256Held: state.scopes.temperatureScope256Held.held,
      atmosphereScope256Held: state.scopes.atmosphereScope256Held.held,
      climateScope256Held: state.scopes.climateScope256Held.held,
      chemistryScope256Held: state.scopes.chemistryScope256Held.held,
      habitabilityScope256Held: state.scopes.habitabilityScope256Held.held,
      sixthSenseCompositeReady: sixthSenseReady(),

      terrainScope256: compactScope(terrainScope),
      hydrationScope256: compactScope(hydrationScope),
      hydrationEdgeScope256: compactScope(edgeScope),
      temperatureScope256: compactScope(state.scopes.temperatureScope256Held),
      atmosphereScope256: compactScope(state.scopes.atmosphereScope256Held),
      climateScope256: compactScope(state.scopes.climateScope256Held),
      chemistryScope256: compactScope(state.scopes.chemistryScope256Held),
      habitabilityScope256: compactScope(state.scopes.habitabilityScope256Held),

      carrierConsumesChild: true,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,
      carrierInventsAir: false,
      carrierInventsAtmosphere: false,
      carrierInventsChemistry: false,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      temperatureAuthoritySeized: false,
      chemistryAuthoritySeized: false,
      ecologyAuthoritySeized: false,
      settlementAuthoritySeized: false,
      urbanAuthoritySeized: false,

      bodyViewClean: true,
      surfaceViewNaturalizedTerrain: true,
      hydrationViewNaturalizedWater: true,
      sixthSenseNaturalizedRelationshipComposite: true,
      latticeViewParcelScaffoldAllowed: true,
      receiptViewParcelCountsAllowed: true,

      oneCanvas: state.oneCanvas,
      dragRotationActive: state.onePointerPath,
      activeLens: state.activeLens,
      renderCount: state.renderCount,
      visibleReadoutUpdated: state.visibleReadoutUpdated,

      htmlUntouched: true,
      gratitudeChildUntouched: true,
      hydrationChildUntouched: true,
      hydrationEdgeChildUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalAirPassClaim: false,
      finalChemistryPassClaim: false,
      finalHabitabilityPassClaim: false,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_CARRIER_DEPLOY_MARKER_v1"
    };
  }

  function publishStatus(force) {
    var payload = receipt();

    window.AUDRALIA_G2_PLANET_ELEVATION_PARCEL_ROLE_NATURALIZATION_STATUS = payload;
    window.AUDRALIA_G2_PLANET_FOUR_SIGN_NATURAL_VISUAL_LANGUAGE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_MULTI_SCOPE_CHRONOLOGICAL_COMPOSITOR_STATUS = payload;
    window.AUDRALIA_G2_PLANET_CARRIER_BOOT_ALIGNMENT_JS_ONLY_STATUS = payload;
    window.AUDRALIA_G2_PLANET_HTML_INLINE_LENS_TRAY_GRATITUDE_CHILD_LIVE_STATUS = payload;
    window.AUDRALIA_G2_PLANET_BODY_CLEAN_CANVAS_TEMPLATE_PAIR_STATUS = payload;
    window.AUDRALIA_G2_JS_FEMALE_CANVAS_CARRIER_STATUS = payload;

    setDataset("audraliaCarrierActiveContract", CONTRACT);
    setDataset("audraliaHtmlCollaborativeContract", HTML_COLLABORATIVE_CONTRACT);

    setDataset("audraliaParcelRoleNaturalizationActive", true);
    setDataset("audraliaParcelGridDetected", state.parcelGridDetected);
    setDataset("audraliaParcelGridPreservedUnderHood", true);
    setDataset("audraliaElevationParcelSystemActive", state.elevationParcelSystemActive);
    setDataset("audraliaParcelRoleExtractionReady", true);
    setDataset("audraliaVisibleSquareParcelSuppressionActive", true);
    setDataset("audraliaVisibleRectanglesNotFinalExpression", true);
    setDataset("audraliaParcelGridNotDeleted", true);

    setDataset("audraliaTerrainParcelsNaturalized", true);
    setDataset("audraliaHydrationParcelsNaturalized", true);
    setDataset("audraliaEdgeParcelsNaturalized", true);
    setDataset("audraliaSixthSenseParcelsNaturalized", true);
    setDataset("audraliaLatticeMayShowParcels", true);
    setDataset("audraliaReceiptMayReportParcels", true);

    setDataset("audraliaFourSignGrammarActive", true);
    setDataset("audraliaFourSignGrammarRegistered", state.fourSignGrammarRegistered);
    setDataset("audraliaTerrainHeroSign", FOUR_SIGNS.terrain.heroSign);
    setDataset("audraliaWaterHeroSign", FOUR_SIGNS.water.heroSign);
    setDataset("audraliaAirHeroSign", FOUR_SIGNS.air.heroSign);
    setDataset("audraliaRelationshipHeroSign", FOUR_SIGNS.relationship.heroSign);

    setDataset("audraliaTerrainSignReady", terrainSignReady());
    setDataset("audraliaWaterSignReady", waterSignReady());
    setDataset("audraliaAirSignHeld", airSignHeld());
    setDataset("audraliaRelationshipSignReady", sixthSenseReady());

    setDataset("audraliaUnifiedFourSignVisualLanguageActive", true);
    setDataset("audraliaTerrainRenderedAsBody", true);
    setDataset("audraliaWaterRenderedAsBloodstream", true);
    setDataset("audraliaAirRenderedAsHeldBreathSocket", true);
    setDataset("audraliaSixthSenseRenderedAsRelationship", true);

    setDataset("audraliaNaturalPhysicsChemistryAlignmentActive", true);
    setDataset("audraliaSignsDoNotOverridePhysics", true);
    setDataset("audraliaRelationshipDoesNotOverrideNaturalLaw", true);
    setDataset("audraliaRelationshipOverridesPhysics", false);
    setDataset("audraliaWaterStillFollowsElevation", true);
    setDataset("audraliaEdgeStillRequiresPermission", true);

    setDataset("audraliaTerrainBodyCount", payload.terrainBodyCount);
    setDataset("audraliaWaterBloodstreamCount", payload.waterBloodstreamCount);
    setDataset("audraliaEdgeCount", payload.edgeCount);

    setDataset("audraliaMultiScopeCompositorActive", true);
    setDataset("audraliaChronologicalCompositeActive", true);
    setDataset("audraliaGratitudeChildDetected", state.gratitude.detected);
    setDataset("audraliaGratitudeChildPacketReady", state.gratitude.packetReady);
    setDataset("audraliaGratitudeChildValidated", state.gratitude.validated);
    setDataset("audraliaTerrainScope256Ready", state.scopes.terrainScope256.ready);
    setDataset("audraliaHydrationScope256Ready", state.scopes.hydrationScope256.ready);
    setDataset("audraliaHydrationEdgeScope256Ready", state.scopes.hydrationEdgeScope256.ready);
    setDataset("audraliaHydrationEdgeScope256Held", state.scopes.hydrationEdgeScope256.held);
    setDataset("audraliaTemperatureScope256Held", true);
    setDataset("audraliaAtmosphereScope256Held", true);
    setDataset("audraliaClimateScope256Held", true);
    setDataset("audraliaChemistryScope256Held", true);
    setDataset("audraliaHabitabilityScope256Held", true);
    setDataset("audraliaSixthSenseCompositeReady", sixthSenseReady());

    setDataset("audraliaCarrierConsumesChild", true);
    setDataset("audraliaCarrierInventsTerrain", false);
    setDataset("audraliaCarrierInventsHydration", false);
    setDataset("audraliaCarrierInventsEdge", false);
    setDataset("audraliaCarrierInventsAir", false);
    setDataset("audraliaCarrierInventsAtmosphere", false);
    setDataset("audraliaCarrierInventsChemistry", false);
    setDataset("audraliaVisibleReadoutUpdated", state.visibleReadoutUpdated);
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
      recordError("init", "Elevation parcel role naturalization carrier is present, but HTML stage/mount is unavailable.");
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
    news: NEWS,
    ccr: CCR,
    fourSigns: FOUR_SIGNS,
    parcelRoles: PARCEL_ROLES,
    chronology: CHRONOLOGY,
    receipt: receipt,
    status: publishStatus,
    validateGratitudeChild: validateGratitudeChild,
    rebuildScopes: rebuildScopes,
    setLens: setLens
  };

  if (hasDOM()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
    } else {
      init();
    }
  }
})();
