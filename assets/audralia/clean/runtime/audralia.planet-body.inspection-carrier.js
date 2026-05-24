// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_BODY_CARRIER_DRY_TERRAIN_FORM_RENEWAL_TNT_v1
//
// Previous:
// AUDRALIA_CARRIER_VISUAL_TUNING_SOCKET_EXTRACTION_TNT_v1
//
// Recovery base:
// AUDRALIA_CARRIER_VISUAL_WEIGHTING_TERRAIN_RELIEF_READABILITY_RENEWAL_TNT_v1
//
// GCR target:
// AUDRALIA_PLANET_FORMLESS_RUNTIME_GCR_v1
//
// Purpose:
// - Renew the carrier runtime as the visible dry-terrain form endpoint.
// - Convert the existing dry terrain packet into a strong continuous visible planetary surface.
// - Stop the formless-planet condition without touching HTML, route JS, or upstream terrain truth.
// - Preserve one visible planet, carrier-only rendering, zoom/drag inspection, and carrier-compatible lenses.
// - Keep hydration held and active water false.
// - Keep raw 256 lattice visibility out of normal Body/Surface lenses.
// - Keep triangle/relief/landform packets as display handoffs only.
// - Claim no final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_BODY_CARRIER_DRY_TERRAIN_FORM_RENEWAL_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_CARRIER_VISUAL_TUNING_SOCKET_EXTRACTION_TNT_v1";
  var RECOVERY_BASELINE = "AUDRALIA_CARRIER_VISUAL_WEIGHTING_TERRAIN_RELIEF_READABILITY_RENEWAL_TNT_v1";
  var GCR = "AUDRALIA_PLANET_FORMLESS_RUNTIME_GCR_v1";

  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

  var TEXTURE_WIDTH = 384;
  var TEXTURE_HEIGHT = 192;
  var STATUS_THROTTLE_MS = 240;

  var ZOOM = Object.freeze({
    min: 0.72,
    defaultValue: 1.0,
    max: 2.65
  });

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var ELEVATION_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_TRACK_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_CHILD",
    "AUDRALIA_G2_ELEVATION_TRACK_CHILD",
    "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_DOWNSTREAM_CHILD"
  ]);

  var RELIEF_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD"
  ]);

  var LANDFORM_GLOBALS = Object.freeze([
    "AUDRALIA_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD"
  ]);

  var TRIANGULAR_MESH_GLOBALS = Object.freeze([
    "AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD",
    "AUDRALIA_PLANET_TRIANGULAR_TERRAIN_MESH_CHILD",
    "AUDRALIA_G2_TRIANGULAR_TERRAIN_MESH_CHILD"
  ]);

  var VISUAL_TUNING_GLOBALS = Object.freeze([
    "AUDRALIA_PLANET_BODY_VISUAL_TUNING_CHILD",
    "AUDRALIA_CARRIER_VISUAL_TUNING_CHILD",
    "AUDRALIA_G2_PLANET_BODY_VISUAL_TUNING_CHILD"
  ]);

  var LENSES = Object.freeze({
    body: "Body",
    surface: "Surface",
    hydration: "Hydration",
    "sixth-sense": "Sixth Sense",
    lattice: "Lattice",
    receipt: "Receipt"
  });

  var LENS_ALIAS = Object.freeze({
    full: "surface",
    boundary: "lattice",
    sixth: "sixth-sense",
    sixthsense: "sixth-sense",
    "sixth-sense": "sixth-sense",
    body: "body",
    surface: "surface",
    hydration: "hydration",
    lattice: "lattice",
    receipt: "receipt"
  });

  var CLASS_COLORS = Object.freeze({
    summit_pressure_zone: Object.freeze({ r: 223, g: 195, b: 118 }),
    mountain_belt: Object.freeze({ r: 180, g: 158, b: 104 }),
    ridge_chain: Object.freeze({ r: 158, g: 143, b: 91 }),
    trench_corridor: Object.freeze({ r: 59, g: 52, b: 46 }),
    dry_basin_floor: Object.freeze({ r: 82, g: 92, b: 68 }),
    valley_corridor: Object.freeze({ r: 92, g: 111, b: 72 }),
    shelf_terrace: Object.freeze({ r: 119, g: 124, b: 82 }),
    escarpment_rim: Object.freeze({ r: 126, g: 96, b: 68 }),
    planetary_highland: Object.freeze({ r: 143, g: 135, b: 93 }),
    upland_plateau: Object.freeze({ r: 112, g: 126, b: 78 }),
    former_seabed: Object.freeze({ r: 48, g: 67, b: 67 }),
    lowland_gap: Object.freeze({ r: 58, g: 74, b: 62 }),
    stable_craton: Object.freeze({ r: 96, g: 120, b: 76 })
  });

  var REGION_TINTS = Object.freeze({
    gratitude: Object.freeze({ r: 124, g: 153, b: 92 }),
    generosity: Object.freeze({ r: 154, g: 146, b: 83 }),
    dependability: Object.freeze({ r: 104, g: 126, b: 84 }),
    accountability: Object.freeze({ r: 148, g: 121, b: 84 }),
    forgiveness: Object.freeze({ r: 118, g: 142, b: 104 }),
    humility: Object.freeze({ r: 91, g: 116, b: 91 }),
    "self-control": Object.freeze({ r: 126, g: 113, b: 78 }),
    patience: Object.freeze({ r: 151, g: 130, b: 91 }),
    purity: Object.freeze({ r: 168, g: 159, b: 118 })
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    sphereCanvas: null,
    sphereCtx: null,

    width: 0,
    height: 0,
    dpr: 1,

    activeLens: "surface",
    yaw: -0.62,
    pitch: -0.16,
    vx: 0,
    vy: 0,
    zoom: ZOOM.defaultValue,

    pointers: new Map(),
    dragging: false,
    pinching: false,
    px: 0,
    py: 0,
    pinchStartDistance: 0,
    pinchStartZoom: ZOOM.defaultValue,
    lastTap: 0,

    raf: 0,
    renderCount: 0,
    stopped: false,

    dryTerrainApi: null,
    dryTerrainDetected: false,
    dryTerrainApiComplete: false,
    dryTerrainValidated: false,
    dryTerrainStatus: null,
    dryCarrierPacket: null,
    dryTerrainPacket: null,
    dryTerrainNodes: [],
    dryNodeGrid: [],
    dryFailureReason: "dry terrain not checked",

    elevationApi: null,
    elevationDetected: false,
    elevationValidated: false,
    elevationStatus: null,
    elevationCarrierPacket: null,
    elevationFailureReason: "elevation track not checked",

    reliefApi: null,
    reliefDetected: false,
    reliefValidated: false,
    reliefStatus: null,
    reliefCarrierPacket: null,
    reliefFailureReason: "relief expression not checked",

    landformApi: null,
    landformDetected: false,
    landformValidated: false,
    landformStatus: null,
    landformCarrierPacket: null,
    landformFailureReason: "landform systems not checked",

    triangularMeshApi: null,
    triangularMeshDetected: false,
    triangularMeshValidated: false,
    triangularMeshCarrierPacket: null,
    triangularMeshFailureReason: "triangular mesh not checked",
    triangleMeshFaceCount: 0,
    triangleMeshVertexCount: 0,
    triangleMeshEdgeBreakCount: 0,

    visualTuningApi: null,
    visualTuningDetected: false,
    visualTuningValidated: false,
    visualTuningStatus: null,
    visualTuningPacket: null,
    visualTuningFailureReason: "visual tuning child absent; using internal carrier weights",

    textureCache: {},
    textureBuilt: false,
    textureBuildCount: 0,
    lastTextureLens: "",
    textureLandCoverageRatio: 0,
    textureReliefCoverageRatio: 0,
    textureFutureFillCoverageRatio: 0,
    textureContrastAverage: 0,
    dryTerrainFormStrength: 0,

    latticeSeats: [],
    latticeLinks: [],
    latticeReady: false,

    lastStatusPublishedAt: 0,
    lastStatusPayload: null,
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

  function normalizeRoute(value) {
    var text = String(value || "");
    return text.endsWith("/") ? text : text + "/";
  }

  function routeAllowed() {
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

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value || null));
    } catch (_error) {
      return value;
    }
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mixColor(a, b, t) {
    var k = clamp01(t);
    return {
      r: Math.round(mix(a.r, b.r, k)),
      g: Math.round(mix(a.g, b.g, k)),
      b: Math.round(mix(a.b, b.b, k))
    };
  }

  function rgba(rgb, alpha) {
    return "rgba(" +
      Math.round(clamp(rgb.r, 0, 255)) + "," +
      Math.round(clamp(rgb.g, 0, 255)) + "," +
      Math.round(clamp(rgb.b, 0, 255)) + "," +
      clamp01(alpha).toFixed(3) + ")";
  }

  function shadeColor(color, amount) {
    return {
      r: Math.round(clamp(color.r + amount, 0, 255)),
      g: Math.round(clamp(color.g + amount, 0, 255)),
      b: Math.round(clamp(color.b + amount, 0, 255))
    };
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(finite(x, 0) * 127.1 + finite(y, 0) * 311.7 + finite(seed, 0) * 74.7) * 43758.5453123);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp01((finite(value, 0) - finite(edge0, 0)) / Math.max(0.000001, finite(edge1, 1) - finite(edge0, 0)));
    return t * t * (3 - 2 * t);
  }

  function noise2(x, y, seed) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = fract(x);
    var fy = fract(y);

    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);

    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    var total = 0;
    var amp = 0.58;
    var freq = 1;
    var norm = 0;

    for (var i = 0; i < (octaves || 4); i += 1) {
      total += noise2(x * freq, y * freq, seed + i * 31.77) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 1.618033988749895;
    }

    return total / Math.max(0.000001, norm);
  }

  function firstGlobal(names) {
    for (var i = 0; i < names.length; i += 1) {
      if (window[names[i]]) return window[names[i]];
    }
    return null;
  }

  function safeCall(scope, api, method) {
    if (!api || typeof api[method] !== "function") return null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 3));
    } catch (error) {
      state.errors.push({
        scope: scope + "." + method,
        message: error && error.message ? error.message : String(error),
        time: new Date().toISOString()
      });
      return null;
    }
  }

  function normalizeLens(value) {
    var key = String(value || "surface").toLowerCase().replace(/\s+/g, "-");
    return LENS_ALIAS[key] || "surface";
  }

  function pointerDistance() {
    var points = Array.from(state.pointers.values());
    if (points.length < 2) return 0;

    var dx = points[0].x - points[1].x;
    var dy = points[0].y - points[1].y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function resetCamera() {
    state.yaw = -0.62;
    state.pitch = -0.16;
    state.vx = 0;
    state.vy = 0;
    state.zoom = ZOOM.defaultValue;
    publishStatus({ force: true });
    requestRender();
  }

  function setZoom(nextZoom) {
    state.zoom = clamp(nextZoom, ZOOM.min, ZOOM.max);
    publishStatus({ force: true });
    requestRender();
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = lonDeg * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function rotate(point) {
    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);

    var x1 = point.x * cy + point.z * sy;
    var z1 = -point.x * sy + point.z * cy;

    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);

    return {
      x: x1,
      y: point.y * cp - z1 * sp,
      z: point.y * sp + z1 * cp
    };
  }

  function metrics() {
    var min = Math.min(state.width, state.height);
    var baseRadius = min * 0.405;

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      baseRadius: baseRadius,
      r: baseRadius * state.zoom,
      camera: 3.92
    };
  }

  function project(point) {
    var m = metrics();
    var p = rotate(point);
    var scale = m.camera / Math.max(0.72, m.camera - p.z);

    return {
      x: m.cx + p.x * m.r * scale,
      y: m.cy - p.y * m.r * scale,
      z: p.z,
      front: p.z >= -0.055,
      scale: scale
    };
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.clip();
  }

  function terrainPacket() {
    return state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;
  }

  function terrainNodes() {
    var packet = terrainPacket();
    return packet && Array.isArray(packet.nodes) ? packet.nodes : [];
  }

  function buildDryNodeGrid(nodes) {
    var grid = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      grid[y] = [];
    }

    nodes.forEach(function (node, index) {
      var x = Math.round(clamp(finite(node.x, finite(node.radial, index % RADIAL_NODES)), 0, RADIAL_NODES - 1));
      var y = Math.round(clamp(finite(node.y, finite(node.band, Math.floor(index / RADIAL_NODES))), 0, FIBONACCI_BANDS - 1));
      grid[y][x] = node;
    });

    return grid;
  }

  function nodeAt(x, y) {
    if (!state.dryNodeGrid.length) return null;

    var xx = ((Math.round(x) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    var yy = Math.round(clamp(y, 0, FIBONACCI_BANDS - 1));

    return state.dryNodeGrid[yy] ? state.dryNodeGrid[yy][xx] || null : null;
  }

  function detectDryTerrain() {
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryTerrainApi = api;
    state.dryTerrainDetected = Boolean(api);
    state.dryTerrainApiComplete = Boolean(
      api &&
      typeof api.status === "function" &&
      typeof api.getCarrierTerrainPacket === "function" &&
      typeof api.getDryRevealedTerrainPacket === "function"
    );

    state.dryTerrainStatus = null;
    state.dryCarrierPacket = null;
    state.dryTerrainPacket = null;
    state.dryTerrainNodes = [];
    state.dryNodeGrid = [];
    state.dryTerrainValidated = false;

    if (!state.dryTerrainDetected) {
      state.dryFailureReason = "dry revealed physical terrain child missing";
      return false;
    }

    if (!state.dryTerrainApiComplete) {
      state.dryFailureReason = "dry revealed physical terrain child API incomplete";
      return false;
    }

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-runtime-carrier", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-runtime-carrier", { compact: false });
    state.dryTerrainNodes = terrainNodes();
    state.dryNodeGrid = buildDryNodeGrid(state.dryTerrainNodes);

    state.dryTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true &&
      state.dryCarrierPacket &&
      state.dryCarrierPacket.carrierTerrainPacketReady === true &&
      state.dryCarrierPacket.carrierInventsTerrain === false &&
      state.dryCarrierPacket.finalVisualPassClaim === false &&
      state.dryTerrainNodes.length === SOURCE_SEAT_COUNT
    );

    state.dryFailureReason = state.dryTerrainValidated ? "" : "dry terrain validation failed or 256-node packet unavailable";
    return state.dryTerrainValidated;
  }

  function detectVisualTuningChild() {
    var api = firstGlobal(VISUAL_TUNING_GLOBALS);

    state.visualTuningApi = api;
    state.visualTuningDetected = Boolean(api);
    state.visualTuningValidated = false;
    state.visualTuningStatus = null;
    state.visualTuningPacket = null;

    if (!api) {
      state.visualTuningFailureReason = "visual tuning child absent; using internal carrier weights";
      return false;
    }

    state.visualTuningStatus = typeof api.status === "function" ? safeCall("visualTuning", api, "status") : null;

    if (typeof api.getCarrierVisualTuningPacket === "function") {
      state.visualTuningPacket = safeCall("visualTuning", api, "getCarrierVisualTuningPacket", "audralia-runtime-carrier", { compact: false });
    } else if (typeof api.getVisualTuningPacket === "function") {
      state.visualTuningPacket = safeCall("visualTuning", api, "getVisualTuningPacket", "audralia-runtime-carrier", { compact: false });
    }

    state.visualTuningValidated = Boolean(
      state.visualTuningPacket &&
      state.visualTuningPacket.activeHydration !== true &&
      state.visualTuningPacket.activeWater !== true &&
      state.visualTuningPacket.finalVisualPassClaim !== true &&
      state.visualTuningPacket.tuningOwnsTerrainTruth !== true &&
      state.visualTuningPacket.tuningDrawsVisuals !== true
    );

    state.visualTuningFailureReason = state.visualTuningValidated ? "" : "visual tuning packet unavailable or unsafe";
    return state.visualTuningValidated;
  }

  function detectElevationTrack() {
    var api = firstGlobal(ELEVATION_GLOBALS);
    var packet = null;

    state.elevationApi = api;
    state.elevationDetected = Boolean(api);
    state.elevationValidated = false;
    state.elevationStatus = null;
    state.elevationCarrierPacket = null;

    if (!api) {
      state.elevationFailureReason = "elevation track child missing";
      return false;
    }

    state.elevationStatus = typeof api.status === "function" ? safeCall("elevationTrack", api, "status") : null;

    if (typeof api.getCarrierElevationPacket === "function") {
      packet = safeCall("elevationTrack", api, "getCarrierElevationPacket", "audralia-runtime-carrier", { compact: false });
    } else if (typeof api.getElevationTrackPacket === "function") {
      packet = safeCall("elevationTrack", api, "getElevationTrackPacket", "audralia-runtime-carrier", { compact: false });
    }

    state.elevationCarrierPacket = packet;
    state.elevationValidated = Boolean(
      packet &&
      packet.activeHydration !== true &&
      packet.activeWater !== true &&
      packet.finalVisualPassClaim !== true &&
      packet.carrierShouldNotOwnElevationTruth !== false
    );

    state.elevationFailureReason = state.elevationValidated ? "" : "elevation track packet unavailable or unsafe";
    return state.elevationValidated;
  }

  function detectReliefExpression() {
    var api = firstGlobal(RELIEF_GLOBALS);

    state.reliefApi = api;
    state.reliefDetected = Boolean(api);
    state.reliefStatus = null;
    state.reliefCarrierPacket = null;
    state.reliefValidated = false;

    if (!api) {
      state.reliefFailureReason = "relief expression child missing";
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierReliefPacket !== "function") {
      state.reliefFailureReason = "relief expression API incomplete";
      return false;
    }

    state.reliefStatus = safeCall("reliefExpression", api, "status");
    state.reliefCarrierPacket = safeCall("reliefExpression", api, "getCarrierReliefPacket", "audralia-runtime-carrier", { compact: false });

    state.reliefValidated = Boolean(
      state.reliefCarrierPacket &&
      state.reliefCarrierPacket.carrierMayConsume === true &&
      state.reliefCarrierPacket.carrierShouldNotOwnReliefTruth === true &&
      state.reliefCarrierPacket.activeHydration === false &&
      state.reliefCarrierPacket.finalVisualPassClaim === false
    );

    state.reliefFailureReason = state.reliefValidated ? "" : "relief expression packet validation failed";
    return state.reliefValidated;
  }

  function detectLandformSystems() {
    var api = firstGlobal(LANDFORM_GLOBALS);

    state.landformApi = api;
    state.landformDetected = Boolean(api);
    state.landformStatus = null;
    state.landformCarrierPacket = null;
    state.landformValidated = false;

    if (!api) {
      state.landformFailureReason = "landform systems child missing";
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierLandformPacket !== "function") {
      state.landformFailureReason = "landform systems API incomplete";
      return false;
    }

    state.landformStatus = safeCall("landformSystems", api, "status");
    state.landformCarrierPacket = safeCall("landformSystems", api, "getCarrierLandformPacket", "audralia-runtime-carrier", { compact: false });

    state.landformValidated = Boolean(
      state.landformCarrierPacket &&
      state.landformCarrierPacket.carrierMayConsume === true &&
      state.landformCarrierPacket.carrierShouldNotOwnLandformTruth === true &&
      state.landformCarrierPacket.activeHydration === false &&
      state.landformCarrierPacket.finalVisualPassClaim === false
    );

    state.landformFailureReason = state.landformValidated ? "" : "landform systems packet validation failed";
    return state.landformValidated;
  }

  function normalizeTriangleFaces(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.meshFaces)) return packet.meshFaces;
    if (Array.isArray(packet.triangleFaces)) return packet.triangleFaces;
    if (Array.isArray(packet.triangleFacets)) return packet.triangleFacets;
    if (Array.isArray(packet.landFacets) || Array.isArray(packet.edgeFacets) || Array.isArray(packet.transitionFacets)) {
      return []
        .concat(Array.isArray(packet.landFacets) ? packet.landFacets : [])
        .concat(Array.isArray(packet.edgeFacets) ? packet.edgeFacets : [])
        .concat(Array.isArray(packet.transitionFacets) ? packet.transitionFacets : []);
    }
    return [];
  }

  function normalizeTriangleVertices(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.meshVertices)) return packet.meshVertices;
    if (Array.isArray(packet.vertices)) return packet.vertices;
    if (Array.isArray(packet.triangleVertices)) return packet.triangleVertices;
    return [];
  }

  function normalizeTriangleEdges(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.meshEdgeBreaks)) return packet.meshEdgeBreaks;
    if (Array.isArray(packet.triangleEdgeBreaks)) return packet.triangleEdgeBreaks;
    if (Array.isArray(packet.edgeBreaks)) return packet.edgeBreaks;
    if (Array.isArray(packet.triangleAdjacency)) return packet.triangleAdjacency;
    return [];
  }

  function detectTriangularMesh() {
    var api = firstGlobal(TRIANGULAR_MESH_GLOBALS);
    var packet = null;

    state.triangularMeshApi = api;
    state.triangularMeshDetected = Boolean(api);
    state.triangularMeshValidated = false;
    state.triangularMeshCarrierPacket = null;
    state.triangularMeshFailureReason = "triangular mesh not checked";
    state.triangleMeshFaceCount = 0;
    state.triangleMeshVertexCount = 0;
    state.triangleMeshEdgeBreakCount = 0;

    if (!api) {
      state.triangularMeshFailureReason = "triangular mesh child missing";
      return false;
    }

    if (typeof api.getCarrierTriangleMeshPacket === "function") {
      packet = safeCall("triangularMesh", api, "getCarrierTriangleMeshPacket", "audralia-runtime-carrier", { compact: false });
    } else if (typeof api.getTriangularTerrainMeshPacket === "function") {
      packet = safeCall("triangularMesh", api, "getTriangularTerrainMeshPacket", "audralia-runtime-carrier", { compact: false });
    } else if (typeof api.getTriangleMeshPacket === "function") {
      packet = safeCall("triangularMesh", api, "getTriangleMeshPacket", "audralia-runtime-carrier", { compact: false });
    } else {
      state.triangularMeshFailureReason = "triangular mesh API incomplete";
      return false;
    }

    state.triangularMeshCarrierPacket = packet;

    var faces = normalizeTriangleFaces(packet);
    var vertices = normalizeTriangleVertices(packet);
    var edges = normalizeTriangleEdges(packet);

    state.triangularMeshValidated = Boolean(
      packet &&
      faces.length &&
      packet.activeHydration !== true &&
      packet.activeWater !== true &&
      packet.finalVisualPassClaim !== true &&
      packet.carrierOwnsTriangulation !== true &&
      packet.carrierGeneratesMesh !== true &&
      packet.triangleLogicIsMaterialAuthority !== true
    );

    state.triangleMeshFaceCount = faces.length;
    state.triangleMeshVertexCount = vertices.length;
    state.triangleMeshEdgeBreakCount = edges.length;
    state.triangularMeshFailureReason = state.triangularMeshValidated ? "" : "triangular mesh packet unavailable or display-only validation failed";

    return state.triangularMeshValidated;
  }

  function blendNodeProperties(a, b, c, d, tx, ty) {
    function value(node, key, fallback) {
      return finite(node && node[key], fallback);
    }

    function interp(key, fallback) {
      var ab = mix(value(a, key, fallback), value(b, key, fallback), tx);
      var cd = mix(value(c, key, fallback), value(d, key, fallback), tx);
      return mix(ab, cd, ty);
    }

    var weights = [
      { node: a, weight: (1 - tx) * (1 - ty) },
      { node: b, weight: tx * (1 - ty) },
      { node: c, weight: (1 - tx) * ty },
      { node: d, weight: tx * ty }
    ].sort(function (x, y) {
      return y.weight - x.weight;
    });

    var main = weights[0].node || a || b || c || d || {};

    return {
      terrainClass: main.terrainClass || "stable_craton",
      primaryTerrainRole: main.primaryTerrainRole || "stable_core",
      regionSeed: main.regionSeed || "gratitude",
      dryElevation: interp("dryElevation", 0.5),
      elevation: interp("elevation", 0.5),
      relativeRelief: interp("relativeRelief", 0),
      ridgePressure: interp("ridgePressure", 0),
      mountainPressure: interp("mountainPressure", 0),
      basinPressure: interp("basinPressure", 0),
      valleyPressure: interp("valleyPressure", 0),
      trenchPressure: interp("trenchPressure", 0),
      shelfPressure: interp("shelfPressure", 0),
      escarpmentPressure: interp("escarpmentPressure", 0),
      summitPressure: interp("summitPressure", 0),
      gapPressure: interp("gapPressure", 0),
      formerHydrosphereCarvingValue: interp("formerHydrosphereCarvingValue", 0),
      futureFillEligible:
        Boolean((a && a.futureFillEligible) || (b && b.futureFillEligible) || (c && c.futureFillEligible) || (d && d.futureFillEligible)),
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function sampleTerrainAtLonLat(lon, lat) {
    if (!state.dryTerrainValidated || !state.dryNodeGrid.length) {
      return null;
    }

    var gx = ((lon + 180) / 360) * RADIAL_NODES - 0.5;
    var gy = ((80 - lat) / 160) * (FIBONACCI_BANDS - 1) - 0.5;

    gy = clamp(gy, 0, FIBONACCI_BANDS - 1);

    var x0 = Math.floor(gx);
    var y0 = Math.floor(gy);
    var x1 = x0 + 1;
    var y1 = Math.min(FIBONACCI_BANDS - 1, y0 + 1);

    var tx = gx - x0;
    var ty = gy - y0;

    var a = nodeAt(x0, y0);
    var b = nodeAt(x1, y0);
    var c = nodeAt(x0, y1);
    var d = nodeAt(x1, y1);

    if (!a && !b && !c && !d) return null;

    return blendNodeProperties(a, b, c, d, tx, ty);
  }

  function colorForTerrain(sample, lens, grain, fracture) {
    var base = CLASS_COLORS[sample.terrainClass] || CLASS_COLORS.stable_craton;
    var region = REGION_TINTS[sample.regionSeed] || REGION_TINTS.gratitude;

    var elevation = clamp01(sample.dryElevation);
    var ridge = clamp01(sample.ridgePressure + sample.mountainPressure * 0.85 + sample.summitPressure * 0.70);
    var basin = clamp01(sample.basinPressure + sample.valleyPressure * 0.54);
    var trench = clamp01(sample.trenchPressure);
    var shelf = clamp01(sample.shelfPressure);
    var gap = clamp01(sample.gapPressure + (sample.futureFillEligible ? 0.28 : 0));
    var carving = clamp01(sample.formerHydrosphereCarvingValue);
    var escarpment = clamp01(sample.escarpmentPressure);

    var color = mixColor(base, region, 0.18);
    color = mixColor(color, { r: 226, g: 200, b: 126 }, ridge * 0.30);
    color = mixColor(color, { r: 53, g: 61, b: 52 }, basin * 0.20);
    color = mixColor(color, { r: 36, g: 31, b: 30 }, trench * 0.34);
    color = mixColor(color, { r: 131, g: 126, b: 84 }, shelf * 0.18);
    color = mixColor(color, { r: 73, g: 61, b: 45 }, escarpment * 0.20);
    color = mixColor(color, { r: 36, g: 54, b: 58 }, gap * 0.28);
    color = mixColor(color, { r: 55, g: 75, b: 75 }, carving * 0.10);

    var heightShade = (elevation - 0.50) * 44;
    var reliefShade = (ridge - basin - trench * 0.50) * 25;
    var grainShade = (grain - 0.5) * 18 + (fracture - 0.5) * 14;

    color = shadeColor(color, heightShade + reliefShade + grainShade);

    if (lens === "body") {
      color = mixColor(color, { r: 34, g: 43, b: 40 }, 0.15);
    } else if (lens === "surface") {
      color = shadeColor(color, 14);
      color = mixColor(color, { r: 235, g: 214, b: 145 }, ridge * 0.10);
    } else if (lens === "hydration") {
      color = mixColor(color, { r: 45, g: 83, b: 96 }, clamp(gap * 0.40 + carving * 0.18, 0, 0.46));
      color = mixColor(color, { r: 20, g: 29, b: 31 }, 0.12);
    } else if (lens === "sixth-sense") {
      color = mixColor(color, { r: 141, g: 216, b: 255 }, clamp((ridge + gap + escarpment) * 0.16, 0, 0.30));
      color = shadeColor(color, 6);
    } else if (lens === "lattice") {
      color = mixColor(color, { r: 15, g: 25, b: 42 }, 0.38);
    } else if (lens === "receipt") {
      color = mixColor(color, { r: 20, g: 29, b: 38 }, 0.32);
    }

    return color;
  }

  function buildTerrainTexture(lens) {
    var mode = normalizeLens(lens);

    if (state.textureCache[mode]) {
      return state.textureCache[mode];
    }

    var data = new Uint8ClampedArray(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4);

    var landPixels = 0;
    var reliefPixels = 0;
    var futureFillPixels = 0;
    var contrastTotal = 0;

    for (var y = 0; y < TEXTURE_HEIGHT; y += 1) {
      var v = y / Math.max(1, TEXTURE_HEIGHT - 1);
      var lat = 90 - v * 180;

      for (var x = 0; x < TEXTURE_WIDTH; x += 1) {
        var u = x / TEXTURE_WIDTH;
        var lon = -180 + u * 360;
        var sample = sampleTerrainAtLonLat(lon, lat);

        var index = (y * TEXTURE_WIDTH + x) * 4;

        var color;

        if (!sample) {
          color = { r: 18, g: 31, b: 40 };
        } else {
          var grain = fbm(u * 22.0 + 0.13, v * 13.0 - 0.07, 9101, 4);
          var fracture = fbm(u * 48.0 - 0.31, v * 24.0 + 0.19, 9107, 3);
          color = colorForTerrain(sample, mode, grain, fracture);

          var relief = clamp01(
            sample.ridgePressure +
            sample.mountainPressure +
            sample.summitPressure +
            sample.escarpmentPressure +
            sample.trenchPressure
          );

          if (sample.dryElevation > 0.20) landPixels += 1;
          if (relief > 0.36) reliefPixels += 1;
          if (sample.futureFillEligible || sample.gapPressure > 0.42) futureFillPixels += 1;

          contrastTotal += Math.abs(sample.dryElevation - 0.5) + relief * 0.35;
        }

        data[index] = clamp(Math.round(color.r), 0, 255);
        data[index + 1] = clamp(Math.round(color.g), 0, 255);
        data[index + 2] = clamp(Math.round(color.b), 0, 255);
        data[index + 3] = 255;
      }
    }

    var total = Math.max(1, TEXTURE_WIDTH * TEXTURE_HEIGHT);

    state.textureLandCoverageRatio = round(landPixels / total, 4);
    state.textureReliefCoverageRatio = round(reliefPixels / total, 4);
    state.textureFutureFillCoverageRatio = round(futureFillPixels / total, 4);
    state.textureContrastAverage = round(contrastTotal / total, 4);
    state.dryTerrainFormStrength = round(
      clamp(
        state.textureLandCoverageRatio * 0.48 +
        state.textureReliefCoverageRatio * 0.24 +
        state.textureContrastAverage * 0.42,
        0,
        1
      ),
      4
    );

    var texture = {
      width: TEXTURE_WIDTH,
      height: TEXTURE_HEIGHT,
      data: data,
      lens: mode,
      builtAt: new Date().toISOString(),
      contract: CONTRACT,
      source: "dry-terrain-packet",
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };

    state.textureCache[mode] = texture;
    state.textureBuilt = true;
    state.textureBuildCount += 1;
    state.lastTextureLens = mode;

    return texture;
  }

  function textureSample(texture, u, v) {
    if (!texture || !texture.data) return [30, 42, 48];

    var x = Math.floor((((u % 1) + 1) % 1) * texture.width) % texture.width;
    var y = Math.floor(clamp01(v) * (texture.height - 1));
    var index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    ];
  }

  function inverseProjectedLonLat(nx, ny, z) {
    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);

    var y1 = -ny * cp + z * sp;
    var z1 = ny * sp + z * cp;
    var x1 = nx;

    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);

    var x0 = x1 * cy - z1 * sy;
    var z0 = x1 * sy + z1 * cy;

    var lat = Math.asin(clamp(y1, -1, 1));
    var lon = Math.atan2(z0, x0);

    return {
      lon: lon,
      lat: lat
    };
  }

  function drawBackground() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.clearRect(0, 0, state.width, state.height);

    var bg = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.15, m.cx, m.cy, Math.max(state.width, state.height) * 0.74);
    bg.addColorStop(0.00, "rgba(21,40,54,0.92)");
    bg.addColorStop(0.36, "rgba(5,13,31,0.98)");
    bg.addColorStop(1.00, "rgba(1,4,12,1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.save();
    ctx.globalAlpha = 0.34;

    for (var i = 0; i < 58; i += 1) {
      var x = hash2(i, 11, 301) * state.width;
      var y = hash2(i, 19, 302) * state.height;
      var r = 0.45 + hash2(i, 29, 303) * 1.4;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(214,244,238,0.14)";
      ctx.fill();
    }

    ctx.restore();

    var glow = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.36, m.cx, m.cy, m.r * 1.62);
    glow.addColorStop(0.00, "rgba(143,240,195,0.025)");
    glow.addColorStop(0.58, "rgba(141,216,255,0.075)");
    glow.addColorStop(0.86, "rgba(243,200,111,0.050)");
    glow.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.62, 0, TAU);
    ctx.fill();
  }

  function drawSphere() {
    if (!state.sphereCanvas || !state.sphereCtx) return;

    var m = metrics();
    var diameter = Math.max(240, Math.min(720, Math.floor(m.r * 2)));
    var radius = diameter / 2;

    if (state.sphereCanvas.width !== diameter) state.sphereCanvas.width = diameter;
    if (state.sphereCanvas.height !== diameter) state.sphereCanvas.height = diameter;

    var texture = buildTerrainTexture(state.activeLens);
    var image = state.sphereCtx.createImageData(diameter, diameter);
    var out = image.data;

    var light = { x: -0.42, y: 0.34, z: 0.84 };
    var mode = state.activeLens;

    for (var y = 0; y < diameter; y += 1) {
      var ny = (y + 0.5 - radius) / radius;

      for (var x = 0; x < diameter; x += 1) {
        var nx = (x + 0.5 - radius) / radius;
        var d2 = nx * nx + ny * ny;
        var index = (y * diameter + x) * 4;

        if (d2 > 1) {
          out[index + 3] = 0;
          continue;
        }

        var z = Math.sqrt(1 - d2);
        var ll = inverseProjectedLonLat(nx, ny, z);
        var u = ll.lon / TAU + 0.5;
        var v = 0.5 - ll.lat / Math.PI;

        var color = textureSample(texture, u, v);

        var lightDot = clamp(nx * light.x + (-ny) * light.y + z * light.z, -1, 1);
        var daylight = 0.38 + Math.max(0, lightDot) * 0.88;
        var night = smoothstep(-0.48, 0.12, lightDot);
        var limb = Math.pow(1 - z, 1.70);
        var rim = Math.pow(1 - z, 3.25);

        var r = color[0] * daylight;
        var g = color[1] * daylight;
        var b = color[2] * daylight;

        r = mix(r * 0.45, r, night);
        g = mix(g * 0.50, g, night);
        b = mix(b * 0.62, b, night);

        if (mode === "surface") {
          r *= 1.08;
          g *= 1.08;
          b *= 1.04;
        }

        if (mode === "hydration") {
          var diagnostic = fbm(u * 14.0, v * 9.0, 7601, 3);
          var trace = smoothstep(0.70, 0.92, diagnostic) * 0.08;
          r = mix(r, 94, trace);
          g = mix(g, 169, trace);
          b = mix(b, 188, trace);
        }

        if (mode === "sixth-sense") {
          var sense = fbm(u * 28.0, v * 16.0, 7611, 3);
          var pulse = smoothstep(0.72, 0.95, sense) * 0.10;
          r = mix(r, 141, pulse);
          g = mix(g, 216, pulse);
          b = mix(b, 255, pulse);
        }

        r = mix(r, 96, limb * 0.18);
        g = mix(g, 178, limb * 0.16);
        b = mix(b, 222, limb * 0.20);

        r = mix(r, 154, rim * 0.34);
        g = mix(g, 224, rim * 0.30);
        b = mix(b, 236, rim * 0.32);

        out[index] = clamp(Math.round(r), 0, 255);
        out[index + 1] = clamp(Math.round(g), 0, 255);
        out[index + 2] = clamp(Math.round(b), 0, 255);
        out[index + 3] = clamp(Math.round(255 * smoothstep(1.006, 0.984, d2)), 0, 255);
      }
    }

    state.sphereCtx.putImageData(image, 0, 0);

    state.ctx.drawImage(state.sphereCanvas, m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);
  }

  function drawAtmosphereRim() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    var halo = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.88, m.cx, m.cy, m.r * 1.14);
    halo.addColorStop(0.00, "rgba(141,216,255,0)");
    halo.addColorStop(0.50, "rgba(141,216,255,0.030)");
    halo.addColorStop(0.82, "rgba(141,216,255,0.120)");
    halo.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.14, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,0.22)";
    ctx.lineWidth = Math.max(0.75, state.dpr * 0.72);
    ctx.stroke();

    ctx.restore();
  }

  function buildLatticeGeometry() {
    var seats = [];
    var links = [];

    function makeSeat(band, radial) {
      var v = (band + 0.5) / FIBONACCI_BANDS;
      var lat = Math.asin(1 - 2 * v);
      var lon = (radial / RADIAL_NODES) * TAU - Math.PI;
      var clat = Math.cos(lat);
      var index = band * RADIAL_NODES + radial;

      return {
        index: index,
        band: band,
        radial: radial,
        x: clat * Math.cos(lon),
        y: Math.sin(lat),
        z: clat * Math.sin(lon),
        major: radial % 4 === 0 || band % 4 === 0,
        secondary: radial % 2 === 0 || band % 2 === 0
      };
    }

    function seat(band, radial) {
      return seats[band * RADIAL_NODES + ((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function addLink(a, b, family, major) {
      links.push({ a: a, b: b, family: family, major: Boolean(major) });
    }

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (var radial = 0; radial < RADIAL_NODES; radial += 1) {
        seats.push(makeSeat(band, radial));
      }
    }

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        addLink(seat(y, x), seat(y, x + 1), "ring", y % 4 === 0 || x % 4 === 0);
        if (y < FIBONACCI_BANDS - 1) {
          addLink(seat(y, x), seat(y + 1, x), "spine", x % 4 === 0);
          addLink(seat(y, x), seat(y + 1, x + [1, 2, 3, 5, 8, 13][y % 6]), "fibonacci", y % 4 === 0 || x % 4 === 0);
        }
      }
    }

    state.latticeSeats = Object.freeze(seats);
    state.latticeLinks = Object.freeze(links);
    state.latticeReady = state.latticeSeats.length === SOURCE_SEAT_COUNT;
  }

  function drawLatticeLayer(layer) {
    if (!state.latticeReady) return;

    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    clipSphere();

    for (var i = 0; i < state.latticeLinks.length; i += 1) {
      var link = state.latticeLinks[i];
      var a = project(link.a);
      var b = project(link.b);
      var avgZ = (a.z + b.z) / 2;
      var isFront = avgZ >= 0;

      if (layer === "back" && isFront) continue;
      if (layer === "front" && !isFront) continue;

      var alpha = layer === "front" ? (link.major ? 0.52 : 0.22) : (link.major ? 0.080 : 0.040);
      var color = link.family === "fibonacci" ? "244,207,131" : "141,216,255";

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(" + color + "," + alpha.toFixed(3) + ")";
      ctx.lineWidth = link.major ? Math.max(0.62, state.dpr * 0.64) : Math.max(0.32, state.dpr * 0.34);
      ctx.stroke();
    }

    for (var j = 0; j < state.latticeSeats.length; j += 1) {
      var seat = state.latticeSeats[j];
      var p = project(seat);
      var front = p.z >= 0;

      if (layer === "back" && front) continue;
      if (layer === "front" && !front) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.62, state.dpr * (seat.major ? 1.50 : seat.secondary ? 1.05 : 0.78) * p.scale), 0, TAU);
      ctx.fillStyle = layer === "front"
        ? (seat.major ? "rgba(244,207,131,0.72)" : "rgba(141,216,255,0.42)")
        : (seat.major ? "rgba(141,216,255,0.080)" : "rgba(141,216,255,0.040)");
      ctx.fill();
    }

    ctx.restore();
  }

  function drawTerrainDefinitionPoints(mode) {
    if (!state.dryTerrainValidated || !state.dryTerrainNodes.length) return;
    if (mode !== "surface" && mode !== "sixth-sense" && mode !== "hydration" && mode !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var stride = mode === "sixth-sense" ? 1 : mode === "surface" ? 2 : 3;

    ctx.save();
    clipSphere();

    for (var i = 0; i < state.dryTerrainNodes.length; i += stride) {
      var node = state.dryTerrainNodes[i];
      var role = String(node.primaryTerrainRole || "");
      var ridge = finite(node.ridgePressure, 0) + finite(node.mountainPressure, 0) + finite(node.summitPressure, 0);
      var gap = finite(node.gapPressure, 0) + (node.futureFillEligible ? 0.35 : 0);
      var draw = mode === "sixth-sense" || ridge > 0.40 || gap > 0.55 || role.indexOf("ridge") >= 0 || role.indexOf("mountain") >= 0;

      if (!draw) continue;

      var point = lonLatPoint(finite(node.lon, 0), finite(node.lat, 0));
      var p = project(point);

      if (!p.front) continue;

      var alpha = mode === "sixth-sense" ? 0.36 : mode === "surface" ? 0.070 : mode === "hydration" ? 0.090 : 0.060;
      var radius = Math.max(0.75, m.r * (mode === "sixth-sense" ? 0.0048 : 0.0031) * p.scale);

      var color = ridge > gap ? { r: 236, g: 204, b: 132 } : { r: 100, g: 152, b: 166 };

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = rgba(color, alpha);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawHydrationHeld() {
    if (state.activeLens !== "hydration") return;

    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(182,245,255,0.78)";
    ctx.fillText("HYDRATION HELD · FUTURE-FILL DIAGNOSTIC ONLY · ACTIVE WATER FALSE", m.cx, m.cy + m.r * 0.76);
    ctx.restore();
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

  function drawReceipt() {
    if (state.activeLens !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var w = Math.min(state.width * 0.91, m.baseRadius * 2.86);
    var h = Math.min(state.height * 0.68, m.baseRadius * 1.86);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();

    ctx.fillStyle = "rgba(2,8,20,.86)";
    ctx.strokeStyle = "rgba(167,243,198,.54)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "900 " + Math.max(10, 12.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(167,243,198,.94)";
    ctx.fillText("DRY TERRAIN FORM RENEWAL · CARRIER ONLY", m.cx, y + h * 0.075);

    ctx.font = "900 " + Math.max(7, 8.2 * state.dpr) + "px ui-monospace, monospace";

    var rows = [
      "CONTRACT " + CONTRACT,
      "DRY VALIDATED " + String(state.dryTerrainValidated).toUpperCase() + " · NODES " + state.dryTerrainNodes.length,
      "TEXTURE BUILT " + String(state.textureBuilt).toUpperCase() + " · FORM STRENGTH " + state.dryTerrainFormStrength,
      "LAND " + state.textureLandCoverageRatio + " · RELIEF " + state.textureReliefCoverageRatio + " · FUTURE-FILL " + state.textureFutureFillCoverageRatio,
      "ELEVATION " + String(state.elevationValidated).toUpperCase() + " · RELIEF PACKET " + String(state.reliefValidated).toUpperCase(),
      "LANDFORM " + String(state.landformValidated).toUpperCase() + " · TRIANGLE DISPLAY " + String(state.triangularMeshValidated).toUpperCase(),
      "TRIANGLE MATERIAL AUTHORITY FALSE · DISPLAY HANDOFF ONLY",
      "HYDRATION HELD TRUE · ACTIVE WATER FALSE",
      "RAW 256 GRID VISIBLE ONLY IN LATTICE",
      "FINAL VISUAL PASS FALSE"
    ];

    rows.forEach(function (text, index) {
      ctx.fillStyle = index === 0 ? "rgba(244,207,131,.90)" : index % 2 ? "rgba(238,244,255,.78)" : "rgba(141,216,255,.78)";
      ctx.fillText(text, m.cx, y + h * (0.18 + index * 0.074));
    });

    ctx.restore();
  }

  function frame() {
    if (state.stopped || !state.ctx) return;

    state.raf = 0;

    if (!state.dragging && !state.pinching) {
      state.yaw += state.vx;
      state.pitch = clamp(state.pitch + state.vy, -1.16, 1.16);
      state.vx *= 0.94;
      state.vy *= 0.94;
      if (Math.abs(state.vx) < 0.00008) state.vx = 0;
      if (Math.abs(state.vy) < 0.00008) state.vy = 0;
    }

    drawBackground();

    if (state.activeLens === "lattice") {
      drawLatticeLayer("back");
      drawSphere();
      drawTerrainDefinitionPoints("lattice");
      drawLatticeLayer("front");
    } else {
      drawSphere();
      drawTerrainDefinitionPoints(state.activeLens);
      if (state.activeLens === "sixth-sense") {
        drawLatticeLayer("front");
      }
    }

    drawHydrationHeld();
    drawReceipt();
    drawAtmosphereRim();

    state.renderCount += 1;
    publishStatus();

    if (state.dragging || state.pinching || Math.abs(state.vx) > 0 || Math.abs(state.vy) > 0) {
      requestRender();
    }
  }

  function requestRender() {
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function resize() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(2.25, window.devicePixelRatio || 1));

    state.dpr = dpr;
    state.width = Math.max(320, Math.floor(rect.width * dpr));
    state.height = Math.max(600, Math.floor(rect.height * dpr));
    state.canvas.width = state.width;
    state.canvas.height = state.height;

    requestRender();
  }

  function setLens(value) {
    var lens = normalizeLens(value);

    if (!LENSES[lens]) lens = "surface";

    state.activeLens = lens;

    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      var buttonLens = normalizeLens(button.dataset.audraliaPlanetLens);
      button.setAttribute("aria-pressed", buttonLens === lens ? "true" : "false");
    });

    var label = document.querySelector("[data-audralia-planet-stage-label]");

    if (label) {
      if (lens === "body") {
        label.innerHTML = "<strong>Body</strong> → continuous dry physical form; normal grid suppressed";
      } else if (lens === "surface") {
        label.innerHTML = "<strong>Surface</strong> → dry terrain packet converted into readable planetary surface";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / future-fill diagnostic only; active water false";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → diagnostic scaffold over dry-terrain carrier form";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → raw 256 inspection only; not a second planet";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → carrier dry-terrain form renewal proof";
      }
    }

    publishStatus({ force: true });
    requestRender();
  }

  function bindControls() {
    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaPlanetLens);
      });
    });

    state.stage.addEventListener("pointerdown", function (event) {
      var tapTime = Date.now();

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size === 2) {
        state.pinching = true;
        state.dragging = false;
        state.pinchStartDistance = pointerDistance();
        state.pinchStartZoom = state.zoom;
      } else if (state.pointers.size === 1) {
        if (tapTime - state.lastTap < 320) resetCamera();
        state.lastTap = tapTime;

        state.dragging = true;
        state.pinching = false;
        state.px = event.clientX;
        state.py = event.clientY;
        state.vx = 0;
        state.vy = 0;
      }

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
      requestRender();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointers.has(event.pointerId)) return;

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size >= 2 && state.pinching) {
        var distance = pointerDistance();
        if (state.pinchStartDistance > 0) setZoom(state.pinchStartZoom * (distance / state.pinchStartDistance));
        event.preventDefault();
        return;
      }

      if (!state.dragging) return;

      var dx = event.clientX - state.px;
      var dy = event.clientY - state.py;

      state.px = event.clientX;
      state.py = event.clientY;
      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.16, 1.16);
      state.vx = clamp(dx * 0.0022, -0.048, 0.048);
      state.vy = clamp(dy * 0.0014, -0.038, 0.038);

      event.preventDefault();
      requestRender();
    }, { passive: false });

    function release(event) {
      state.pointers.delete(event.pointerId);

      try {
        state.stage.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.pointers.size < 2) {
        state.pinching = false;
        state.pinchStartDistance = 0;
      }

      if (state.pointers.size === 0) state.dragging = false;

      requestRender();
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });

    state.stage.addEventListener("wheel", function (event) {
      var factor = Math.exp(-event.deltaY * 0.0012);
      setZoom(state.zoom * factor);
      event.preventDefault();
    }, { passive: false });

    state.stage.addEventListener("dblclick", function (event) {
      resetCamera();
      event.preventDefault();
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      var target = event.target && String(event.target.tagName || "").toLowerCase();
      if (target === "input" || target === "textarea" || target === "select") return;

      if (event.key === "+" || event.key === "=") {
        setZoom(state.zoom * 1.10);
        event.preventDefault();
      } else if (event.key === "-" || event.key === "_") {
        setZoom(state.zoom / 1.10);
        event.preventDefault();
      } else if (event.key === "0") {
        resetCamera();
        event.preventDefault();
      }
    }, { passive: false });
  }

  function refreshDownstreamPackets() {
    detectVisualTuningChild();
    detectDryTerrain();
    detectElevationTrack();
    detectReliefExpression();
    detectLandformSystems();
    detectTriangularMesh();

    state.textureCache = {};
    state.textureBuilt = false;

    publishStatus({ force: true });
    requestRender();
  }

  function getDryTerrainFormReceipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      gcr: GCR,

      dryTerrainFormRenewalActive: true,
      formlessPlanetConditionAddressed: true,
      carrierVisibleFormEndpoint: true,

      dryTerrainDetected: state.dryTerrainDetected,
      dryTerrainApiComplete: state.dryTerrainApiComplete,
      dryTerrainValidated: state.dryTerrainValidated,
      dryFailureReason: state.dryFailureReason,
      dryTerrainNodeCount: state.dryTerrainNodes.length,

      textureBuilt: state.textureBuilt,
      textureBuildCount: state.textureBuildCount,
      textureWidth: TEXTURE_WIDTH,
      textureHeight: TEXTURE_HEIGHT,
      textureLandCoverageRatio: state.textureLandCoverageRatio,
      textureReliefCoverageRatio: state.textureReliefCoverageRatio,
      textureFutureFillCoverageRatio: state.textureFutureFillCoverageRatio,
      textureContrastAverage: state.textureContrastAverage,
      dryTerrainFormStrength: state.dryTerrainFormStrength,

      raw256VisibleOnlyInLattice: true,
      bodyGridSuppressed: true,
      surfaceGridSuppressed: true,
      visibleDryTerrainStrengthened: true,

      carrierInventsTerrain: false,
      carrierDisplaysOnly: true,
      carrierConsumesPacketsForDisplayOnly: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function getDefinitionConsumptionReceipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,

      elevationDetected: state.elevationDetected,
      elevationValidated: state.elevationValidated,
      elevationFailureReason: state.elevationFailureReason,

      reliefExpressionDetected: state.reliefDetected,
      reliefExpressionValidated: state.reliefValidated,
      reliefFailureReason: state.reliefFailureReason,

      landformSystemsDetected: state.landformDetected,
      landformSystemsValidated: state.landformValidated,
      landformFailureReason: state.landformFailureReason,

      triangularMeshDetected: state.triangularMeshDetected,
      triangularMeshValidated: state.triangularMeshValidated,
      triangleMeshFailureReason: state.triangularMeshFailureReason,
      triangleMeshVertexCount: state.triangleMeshVertexCount,
      triangleMeshFaceCount: state.triangleMeshFaceCount,
      triangleMeshEdgeBreakCount: state.triangleMeshEdgeBreakCount,

      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,
      triangleLogicIsAdapter: true,
      triangleLogicIsMaterialAuthority: false,

      carrierDoesNotOwnTerrainTruth: true,
      carrierDoesNotOwnElevationTruth: true,
      carrierDoesNotOwnReliefTruth: true,
      carrierDoesNotOwnLandformTruth: true,
      carrierDoesNotOwnBeachTruth: true,
      carrierDoesNotOwnHydrationTruth: true,
      carrierDoesNotMutateUpstreamMeaning: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function sampleLandPresenceAt(x, y) {
    var node = nodeAt(x, y);
    if (!node) return 0;

    return round(clamp(
      finite(node.dryElevation, 0.5) * 0.54 +
      finite(node.ridgePressure, 0) * 0.18 +
      finite(node.mountainPressure, 0) * 0.16 -
      finite(node.gapPressure, 0) * 0.10,
      0,
      1
    ), 4);
  }

  function sampleContinentInfluenceAt(x, y) {
    var node = nodeAt(x, y);
    if (!node) return null;

    return {
      continentId: node.regionSeed || "unassigned",
      continentName: node.regionSeedName || node.nearestSummitName || "Unassigned",
      color: REGION_TINTS[node.regionSeed] || REGION_TINTS.gratitude,
      boundaryPressure: round(finite(node.escarpmentPressure, 0) + finite(node.shelfPressure, 0) * 0.35, 4)
    };
  }

  function sampleHeightDisplacementAt(x, y) {
    var node = nodeAt(x, y);
    return node ? finite(node.dryElevation, 0.5) : 0.5;
  }

  function sampleSlopeReliefAt(x, y) {
    var node = nodeAt(x, y);
    if (!node) return { slope: 0, relief: 0, futureFillPressure: 0 };

    var relief = clamp(
      finite(node.ridgePressure, 0) +
      finite(node.mountainPressure, 0) +
      finite(node.summitPressure, 0) +
      finite(node.escarpmentPressure, 0) +
      finite(node.trenchPressure, 0),
      0,
      1
    );

    return {
      slope: round(relief * 0.64, 4),
      relief: round(relief, 4),
      futureFillPressure: round(finite(node.gapPressure, 0) + (node.futureFillEligible ? 0.30 : 0), 4)
    };
  }

  function publishStatus(options) {
    var force = Boolean(options && options.force);
    var time = window.performance && typeof window.performance.now === "function" ? window.performance.now() : Date.now();

    if (!force && state.lastStatusPayload && time - state.lastStatusPublishedAt < STATUS_THROTTLE_MS) {
      return state.lastStatusPayload;
    }

    var dryReceipt = getDryTerrainFormReceipt();
    var definitionReceipt = getDefinitionConsumptionReceipt();

    var payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      gcr: GCR,
      target: FILE,
      route: ROUTE,

      sameFileRenewal: true,
      shellPreserved: true,
      carrierIsRuntime: true,
      carrierIsDisplayEndpoint: true,
      carrierVisibleFormEndpoint: true,

      formlessPlanetConditionAddressed: true,
      dryTerrainFormRenewalActive: true,
      visibleDryTerrainStrengthened: true,
      textureAtlasSurfaceRendererActive: true,
      terrainPacketToVisibleSurfaceBridgeActive: true,

      dryTerrainDetected: state.dryTerrainDetected,
      dryTerrainApiComplete: state.dryTerrainApiComplete,
      dryTerrainValidated: state.dryTerrainValidated,
      dryRevealedTerrainFailureReason: state.dryFailureReason,
      dryTerrainNodeCount: state.dryTerrainNodes.length,

      textureBuilt: state.textureBuilt,
      textureBuildCount: state.textureBuildCount,
      textureLandCoverageRatio: state.textureLandCoverageRatio,
      textureReliefCoverageRatio: state.textureReliefCoverageRatio,
      textureFutureFillCoverageRatio: state.textureFutureFillCoverageRatio,
      textureContrastAverage: state.textureContrastAverage,
      dryTerrainFormStrength: state.dryTerrainFormStrength,

      elevationDetected: definitionReceipt.elevationDetected,
      elevationValidated: definitionReceipt.elevationValidated,
      reliefExpressionDetected: definitionReceipt.reliefExpressionDetected,
      reliefExpressionValidated: definitionReceipt.reliefExpressionValidated,
      landformSystemsDetected: definitionReceipt.landformSystemsDetected,
      landformSystemsValidated: definitionReceipt.landformSystemsValidated,
      triangularMeshDetected: definitionReceipt.triangularMeshDetected,
      triangularMeshValidated: definitionReceipt.triangularMeshValidated,
      triangleMeshFaceCount: definitionReceipt.triangleMeshFaceCount,

      visualTuningSocketActive: true,
      visualTuningChildOptional: true,
      visualTuningChildDetected: state.visualTuningDetected,
      visualTuningChildValidated: state.visualTuningValidated,
      visualTuningFailureReason: state.visualTuningFailureReason,

      activeLens: state.activeLens,
      carrierLensRegistry: Object.keys(LENSES),
      unsupportedBoundaryFullButtonsRequired: false,

      zoomInspectionActive: true,
      zoom: round(state.zoom, 4),
      zoomMin: ZOOM.min,
      zoomMax: ZOOM.max,
      zoomMutatesTerrainTruth: false,

      raw256VisibleOnlyInLattice: true,
      bodyGridSuppressed: true,
      surfaceGridSuppressed: true,
      normalLensGridDominanceReduced: true,
      latticeRaw256InspectionPreserved: true,

      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,
      carrierInventsTerrain: false,
      carrierGeneratesMesh: false,
      carrierOwnsTriangulation: false,
      triangleLogicIsAdapter: true,
      triangleLogicIsMaterialAuthority: false,

      carrierDoesNotOwnTerrainTruth: true,
      carrierDoesNotOwnElevationTruth: true,
      carrierDoesNotOwnReliefTruth: true,
      carrierDoesNotOwnLandformTruth: true,
      carrierDoesNotOwnBeachTruth: true,
      carrierDoesNotOwnHydrationTruth: true,
      carrierDoesNotMutateUpstreamMeaning: true,

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      triangulationTruthMutated: false,
      hydrationTruthMutated: false,

      hydrosphereMemoryLensGated: true,
      hydrosphereMemorySuppressedInBody: true,
      hydrosphereMemorySuppressedInSurface: true,
      futureFillSuppressedInSurface: true,
      futureFillHydrationLensOnly: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      futureFillOnly: true,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      renderCount: state.renderCount,
      statusThrottleActive: true,
      statusThrottleMs: STATUS_THROTTLE_MS,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_BODY_CARRIER_DRY_TERRAIN_FORM_RENEWAL_DEPLOY_MARKER_v1"
    };

    state.lastStatusPublishedAt = time;
    state.lastStatusPayload = payload;

    window.AUDRALIA_PLANET_BODY_CARRIER_DRY_TERRAIN_FORM_RENEWAL_STATUS = payload;
    window.AUDRALIA_CARRIER_VISUAL_TUNING_SOCKET_EXTRACTION_STATUS = payload;
    window.AUDRALIA_CARRIER_TRIANGULAR_READABILITY_ADAPTER_PRESERVATION_STATUS = payload;
    window.AUDRALIA_CARRIER_TRIANGULAR_MESH_DISPLAY_CONSUMPTION_STATUS = payload;
    window.AUDRALIA_CARRIER_VISUAL_WEIGHTING_TERRAIN_RELIEF_READABILITY_RENEWAL_STATUS = payload;
    window.AUDRALIA_CARRIER_BASELINE_RESTORED_PACKET_HANDOFF_DRAW_RENEWAL_STATUS = payload;
    window.AUDRALIA_CARRIER_NARROW_RELIEF_LANDFORM_DEFINITION_CONSUMPTION_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_EXISTING_NODE_LAND_BODY_COMPOSITOR_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_NINE_CONTINENT_ETHICAL_METRIC_BUMP_FIELD_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_DYNAMIC_ROW_OVERLAP_WEAVE_SURFACE_RENDER_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaRuntimeContract = CONTRACT;
      document.documentElement.dataset.audraliaRuntimePreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.audraliaCarrierDryTerrainFormRenewalActive = "true";
      document.documentElement.dataset.audraliaFormlessPlanetConditionAddressed = "true";
      document.documentElement.dataset.audraliaVisibleDryTerrainStrengthened = "true";
      document.documentElement.dataset.audraliaTextureAtlasSurfaceRendererActive = "true";
      document.documentElement.dataset.audraliaDryTerrainValidated = String(state.dryTerrainValidated);
      document.documentElement.dataset.audraliaDryTerrainFormStrength = String(state.dryTerrainFormStrength);
      document.documentElement.dataset.audraliaTextureLandCoverageRatio = String(state.textureLandCoverageRatio);
      document.documentElement.dataset.audraliaTextureReliefCoverageRatio = String(state.textureReliefCoverageRatio);
      document.documentElement.dataset.audraliaBodyGridSuppressed = "true";
      document.documentElement.dataset.audraliaSurfaceGridSuppressed = "true";
      document.documentElement.dataset.audraliaRaw256VisibleOnlyInLattice = "true";
      document.documentElement.dataset.audraliaCarrierInventsTerrain = "false";
      document.documentElement.dataset.audraliaCarrierConsumesPacketsForDisplayOnly = "true";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaActiveWater = "false";
      document.documentElement.dataset.audraliaFinalTerrainPassClaim = "false";
      document.documentElement.dataset.audraliaFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function stop() {
    state.stopped = true;
    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");

    if (!state.stage || !state.mount) return;

    state.stage.style.touchAction = "none";

    state.canvas = document.createElement("canvas");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-recovery-baseline", RECOVERY_BASELINE);
    state.canvas.setAttribute("data-gcr", GCR);
    state.canvas.setAttribute("data-same-file-renewal", "true");
    state.canvas.setAttribute("data-shell-preserved", "true");
    state.canvas.setAttribute("data-carrier-dry-terrain-form-renewal-active", "true");
    state.canvas.setAttribute("data-formless-planet-condition-addressed", "true");
    state.canvas.setAttribute("data-visible-dry-terrain-strengthened", "true");
    state.canvas.setAttribute("data-texture-atlas-surface-renderer-active", "true");
    state.canvas.setAttribute("data-terrain-packet-to-visible-surface-bridge-active", "true");
    state.canvas.setAttribute("data-body-grid-suppressed", "true");
    state.canvas.setAttribute("data-surface-grid-suppressed", "true");
    state.canvas.setAttribute("data-raw-256-visible-only-in-lattice", "true");
    state.canvas.setAttribute("data-carrier-consumes-packets-for-display-only", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-carrier-generates-mesh", "false");
    state.canvas.setAttribute("data-carrier-owns-triangulation", "false");
    state.canvas.setAttribute("data-triangle-logic-is-adapter", "true");
    state.canvas.setAttribute("data-triangle-logic-is-material-authority", "false");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-active-hydration", "false");
    state.canvas.setAttribute("data-active-water", "false");
    state.canvas.setAttribute("data-final-terrain-pass-claim", "false");
    state.canvas.setAttribute("data-final-hydration-pass-claim", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");
    state.canvas.setAttribute("aria-label", "Audralia carrier dry-terrain form renewal planet renderer");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.sphereCanvas = document.createElement("canvas");
    state.sphereCtx = state.sphereCanvas.getContext("2d", { alpha: true, willReadFrequently: false });

    buildLatticeGeometry();
    resize();
    bindControls();
    refreshDownstreamPackets();

    setTimeout(refreshDownstreamPackets, 180);
    setTimeout(refreshDownstreamPackets, 640);
    setTimeout(refreshDownstreamPackets, 1200);
    setTimeout(refreshDownstreamPackets, 1800);

    window.addEventListener("resize", resize, { passive: true });

    setLens("surface");
    publishStatus({ force: true });
    requestRender();
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    recoveryBaseline: RECOVERY_BASELINE,
    gcr: GCR,
    status: function () { return publishStatus({ force: true }); },
    refreshDownstreamPackets: refreshDownstreamPackets,
    detectDryTerrain: detectDryTerrain,
    detectElevationTrack: detectElevationTrack,
    detectReliefExpression: detectReliefExpression,
    detectLandformSystems: detectLandformSystems,
    detectTriangularMesh: detectTriangularMesh,
    detectVisualTuningChild: detectVisualTuningChild,
    setLens: setLens,
    setZoom: setZoom,
    resetCamera: resetCamera,
    getDryTerrainFormReceipt: getDryTerrainFormReceipt,
    getDefinitionConsumptionReceipt: getDefinitionConsumptionReceipt,
    sampleLandPresenceAt: sampleLandPresenceAt,
    sampleContinentInfluenceAt: sampleContinentInfluenceAt,
    sampleHeightDisplacementAt: sampleHeightDisplacementAt,
    sampleSlopeReliefAt: sampleSlopeReliefAt
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
