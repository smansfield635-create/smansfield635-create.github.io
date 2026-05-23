// /assets/audralia/clean/runtime/audralia.terrain-expression.canvas.child.js
// AUDRALIA_TERRAIN_EXPRESSION_LENS_AUTHORITY_SPLIT_TNT_v1
// Full-file replacement.
// Scope: terrain-expression canvas only.
// Purpose: split visual authority into Surface, Hydration, Boundary, Lattice, and Full.
// Governing lock: this file does not own terrain truth; it owns terrain visibility.
// Does not own: terrain truth, elevation truth, relief truth, landform truth, beach truth, triangulation truth, hydration truth, carrier runtime, controls, HTML, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_TERRAIN_EXPRESSION_LENS_AUTHORITY_SPLIT_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.terrain-expression.canvas.child.js";
  var ROUTE = "/showroom/globe/audralia/planet/";
  var CARRIER_GLOBAL = "__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__";
  var DEPLOY_MARKER = "AUDRALIA_TERRAIN_EXPRESSION_LENS_AUTHORITY_SPLIT_DEPLOY_MARKER_v1";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var MAX_CACHE_SAMPLES = 2600;

  var DRY_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var ELEVATION_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_TRACK_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_CHILD",
    "AUDRALIA_G2_ELEVATION_TRACK_CHILD"
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

  var BEACH_GLOBALS = Object.freeze([
    "AUDRALIA_BEACH_COASTAL_READINESS_CHILD",
    "AUDRALIA_PLANET_BEACH_COASTAL_READINESS_CHILD",
    "AUDRALIA_G2_BEACH_COASTAL_READINESS_CHILD"
  ]);

  var TRIANGLE_GLOBALS = Object.freeze([
    "AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD",
    "AUDRALIA_PLANET_TRIANGULAR_TERRAIN_MESH_CHILD",
    "AUDRALIA_G2_TRIANGULAR_TERRAIN_MESH_CHILD"
  ]);

  var LENS_RULES = Object.freeze({
    surface: Object.freeze({
      name: "Surface",
      authority: "land_visibility",
      budget: 1800,
      surfaceThreshold: 0.115,
      hydrationThreshold: 9,
      boundaryThreshold: 9,
      alpha: 0.38,
      detailAlpha: 0.18,
      radiusScale: 1.05
    }),
    hydration: Object.freeze({
      name: "Hydration",
      authority: "future_water_placement_visibility",
      budget: 1550,
      surfaceThreshold: 9,
      hydrationThreshold: 0.175,
      boundaryThreshold: 9,
      alpha: 0.24,
      detailAlpha: 0.13,
      radiusScale: 0.96
    }),
    boundary: Object.freeze({
      name: "Boundary",
      authority: "land_water_interface_visibility",
      budget: 1450,
      surfaceThreshold: 9,
      hydrationThreshold: 9,
      boundaryThreshold: 0.155,
      alpha: 0.30,
      detailAlpha: 0.25,
      radiusScale: 0.72
    }),
    lattice: Object.freeze({
      name: "Lattice",
      authority: "diagnostic_structure_visibility",
      budget: 2200,
      surfaceThreshold: 9,
      hydrationThreshold: 9,
      boundaryThreshold: 9,
      alpha: 0.20,
      detailAlpha: 0.16,
      radiusScale: 0.58
    }),
    full: Object.freeze({
      name: "Full",
      authority: "composite_preview",
      budget: 2400,
      surfaceThreshold: 0.105,
      hydrationThreshold: 0.195,
      boundaryThreshold: 0.160,
      alpha: 0.30,
      detailAlpha: 0.16,
      radiusScale: 0.94
    })
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,

    parentCarrierDetected: false,
    parentCarrierValidated: false,
    carrierPreserved: true,
    carrierRewritten: false,

    expressionCanvasMounted: false,
    expressionCanvasAboveCarrier: false,
    expressionCanvasPointerEventsNone: true,

    readsCarrierState: false,
    readsDryTerrain: false,
    readsElevationTrack: false,
    readsReliefMetadata: false,
    readsLandformMetadata: false,
    readsBeachReadiness: false,
    readsTriangularMesh: false,

    dryApi: null,
    dryStatus: null,
    dryPacket: null,
    dryCarrierPacket: null,
    dryNodes: [],

    elevationApi: null,
    elevationStatus: null,
    elevationPacket: null,

    reliefApi: null,
    reliefStatus: null,
    reliefPacket: null,

    landformApi: null,
    landformStatus: null,
    landformPacket: null,

    beachApi: null,
    beachStatus: null,
    beachPacket: null,

    triangleApi: null,
    triangleStatus: null,
    trianglePacket: null,

    terrainExpressionSamples: [],
    terrainExpressionActive: false,

    lensAuthoritySplitActive: true,
    surfaceLandMaskActive: false,
    hydrationFutureFillMaskActive: false,
    boundaryInterfaceMaskActive: false,
    latticeDiagnosticMaskActive: false,
    fullCompositeMaskActive: false,

    organicLandMaskActive: false,
    nodeRegisteredExpressionActive: false,
    terrainIlluminationCanvasActive: false,
    surfaceGridSuppressionActive: false,
    voidTransparencyActive: true,
    futureFillTransparencyActive: true,

    hydrationHeld: true,
    activeHydration: false,
    activeWater: false,

    terrainTruthMutated: false,
    elevationTruthMutated: false,
    reliefTruthMutated: false,
    landformTruthMutated: false,
    beachTruthMutated: false,
    triangulationTruthMutated: false,
    hydrationTruthMutated: false,
    carrierControlsMutated: false,

    finalTerrainPassClaim: false,
    finalHydrationPassClaim: false,
    finalVisualPassClaim: false,

    activeLens: "surface",
    renderCount: 0,
    cacheBuildCount: 0,
    lastCacheReason: "not built",
    raf: 0,
    stopped: false,
    errors: []
  };

  if (
    window.__AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_CONTROLLER__ &&
    typeof window.__AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_CONTROLLER__.stop === "function"
  ) {
    try { window.__AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_CONTROLLER__.stop(); } catch (_error) {}
  }

  function clamp(value, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
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

  function normalizeLens(value) {
    var lens = String(value || "surface").toLowerCase();

    if (lens === "body") return "surface";
    if (lens === "sixth-sense" || lens === "sixthsense" || lens === "sixth_sense") return "lattice";
    if (lens === "receipt") return "full";

    return LENS_RULES[lens] ? lens : "surface";
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

  function carrier() {
    return window[CARRIER_GLOBAL] || null;
  }

  function carrierState() {
    var controller = carrier();
    return controller && controller.state ? controller.state : null;
  }

  function currentLens() {
    var cs = carrierState();
    return normalizeLens(cs && cs.activeLens ? cs.activeLens : state.activeLens);
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = Number(lonDeg) * Math.PI / 180;
    var lat = Number(latDeg) * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((Number(x) % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(Number(y), 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function carrierMetrics() {
    var cs = carrierState();
    var width = Math.max(320, Number(cs && cs.width || state.width || 0));
    var height = Math.max(600, Number(cs && cs.height || state.height || 0));
    var zoom = clamp(Number(cs && cs.zoom || 1), 0.72, 2.45);
    var min = Math.min(width, height);
    var baseRadius = min * 0.405;

    return {
      cx: width / 2,
      cy: height * 0.365,
      r: baseRadius * zoom,
      baseRadius: baseRadius,
      camera: 3.92
    };
  }

  function rotate(point) {
    var cs = carrierState() || {};
    var yaw = Number(cs.yaw || 0);
    var pitch = Number(cs.pitch || 0);

    var x = Number(point.x || 0);
    var y = Number(point.y || 0);
    var z = Number(point.z || 0);

    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;

    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = y * cp - z1 * sp;
    var z2 = y * sp + z1 * cp;

    return { x: x1, y: y1, z: z2 };
  }

  function project(point) {
    var m = carrierMetrics();
    var p = rotate(point);
    var scale = m.camera / Math.max(0.72, m.camera - p.z);

    return {
      x: m.cx + p.x * m.r * scale,
      y: m.cy - p.y * m.r * scale,
      z: p.z,
      front: p.z >= -0.06,
      scale: scale
    };
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = carrierMetrics();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.clip();
  }

  function rgba(rgb, alpha) {
    return "rgba(" +
      Math.floor(clamp(rgb.r, 0, 255)) + "," +
      Math.floor(clamp(rgb.g, 0, 255)) + "," +
      Math.floor(clamp(rgb.b, 0, 255)) + "," +
      clamp(alpha, 0, 1).toFixed(3) +
    ")";
  }

  function mixColor(color, target, amount) {
    amount = clamp(amount, 0, 1);

    return {
      r: color.r * (1 - amount) + target.r * amount,
      g: color.g * (1 - amount) + target.g * amount,
      b: color.b * (1 - amount) + target.b * amount
    };
  }

  function readPacketNodes(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.nodes)) return packet.nodes;
    if (packet.planetPhysicalTerrainPacket && Array.isArray(packet.planetPhysicalTerrainPacket.nodes)) return packet.planetPhysicalTerrainPacket.nodes;
    if (packet.dryRevealedTerrainPacket && Array.isArray(packet.dryRevealedTerrainPacket.nodes)) return packet.dryRevealedTerrainPacket.nodes;
    if (packet.terrainPacket && Array.isArray(packet.terrainPacket.nodes)) return packet.terrainPacket.nodes;
    if (packet.sourcePacket && Array.isArray(packet.sourcePacket.nodes)) return packet.sourcePacket.nodes;
    return [];
  }

  function readDryTerrain() {
    var api = firstGlobal(DRY_GLOBALS);

    state.dryApi = api;
    state.dryStatus = null;
    state.dryPacket = null;
    state.dryCarrierPacket = null;
    state.dryNodes = [];
    state.readsDryTerrain = false;

    if (!api) return false;

    state.dryStatus = typeof api.status === "function" ? safeCall("dryTerrain", api, "status") : null;

    if (typeof api.getCarrierTerrainPacket === "function") {
      state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    if (typeof api.getDryRevealedTerrainPacket === "function") {
      state.dryPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    } else if (typeof api.getPlanetPhysicalTerrainPacket === "function") {
      state.dryPacket = safeCall("dryTerrain", api, "getPlanetPhysicalTerrainPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    if (!state.dryPacket && state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) {
      state.dryPacket = state.dryCarrierPacket.planetPhysicalTerrainPacket;
    }

    state.dryNodes = readPacketNodes(state.dryPacket).length ? readPacketNodes(state.dryPacket) : readPacketNodes(state.dryCarrierPacket);
    state.readsDryTerrain = state.dryNodes.length > 0;

    return state.readsDryTerrain;
  }

  function readElevationTrack() {
    var api = firstGlobal(ELEVATION_GLOBALS);

    state.elevationApi = api;
    state.elevationStatus = null;
    state.elevationPacket = null;
    state.readsElevationTrack = false;

    if (!api) return false;

    state.elevationStatus = typeof api.status === "function" ? safeCall("elevationTrack", api, "status") : null;

    if (typeof api.getCarrierElevationPacket === "function") {
      state.elevationPacket = safeCall("elevationTrack", api, "getCarrierElevationPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    } else if (typeof api.getElevationTrackPacket === "function") {
      state.elevationPacket = safeCall("elevationTrack", api, "getElevationTrackPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    state.readsElevationTrack = Boolean(state.elevationPacket || state.elevationStatus);
    return state.readsElevationTrack;
  }

  function readReliefMetadata() {
    var api = firstGlobal(RELIEF_GLOBALS);

    state.reliefApi = api;
    state.reliefStatus = null;
    state.reliefPacket = null;
    state.readsReliefMetadata = false;

    if (!api) return false;

    state.reliefStatus = typeof api.status === "function" ? safeCall("reliefMetadata", api, "status") : null;

    if (typeof api.getCarrierReliefPacket === "function") {
      state.reliefPacket = safeCall("reliefMetadata", api, "getCarrierReliefPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    state.readsReliefMetadata = Boolean(state.reliefPacket);
    return state.readsReliefMetadata;
  }

  function readLandformMetadata() {
    var api = firstGlobal(LANDFORM_GLOBALS);

    state.landformApi = api;
    state.landformStatus = null;
    state.landformPacket = null;
    state.readsLandformMetadata = false;

    if (!api) return false;

    state.landformStatus = typeof api.status === "function" ? safeCall("landformMetadata", api, "status") : null;

    if (typeof api.getCarrierLandformPacket === "function") {
      state.landformPacket = safeCall("landformMetadata", api, "getCarrierLandformPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    state.readsLandformMetadata = Boolean(state.landformPacket);
    return state.readsLandformMetadata;
  }

  function readBeachReadiness() {
    var api = firstGlobal(BEACH_GLOBALS);

    state.beachApi = api;
    state.beachStatus = null;
    state.beachPacket = null;
    state.readsBeachReadiness = false;

    if (!api) return false;

    state.beachStatus = typeof api.status === "function" ? safeCall("beachReadiness", api, "status") : null;

    if (typeof api.getCarrierBeachPacket === "function") {
      state.beachPacket = safeCall("beachReadiness", api, "getCarrierBeachPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    } else if (typeof api.getBeachCoastalReadinessPacket === "function") {
      state.beachPacket = safeCall("beachReadiness", api, "getBeachCoastalReadinessPacket", "audralia-terrain-expression-lens-authority-split", { compact: false });
    }

    state.readsBeachReadiness = Boolean(state.beachPacket || state.beachStatus);
    return state.readsBeachReadiness;
  }

  function readTriangularMesh() {
    var api = firstGlobal(TRIANGLE_GLOBALS);

    state.triangleApi = api;
    state.triangleStatus = null;
    state.trianglePacket = null;
    state.readsTriangularMesh = false;

    if (!api) return false;

    state.triangleStatus = typeof api.status === "function" ? safeCall("triangularMesh", api, "status") : null;

    if (typeof api.getCarrierTriangleMeshPacket === "function") {
      state.trianglePacket = safeCall("triangularMesh", api, "getCarrierTriangleMeshPacket", "audralia-terrain-expression-lens-authority-split", { compact: true });
    } else if (typeof api.getTriangularTerrainMeshPacket === "function") {
      state.trianglePacket = safeCall("triangularMesh", api, "getTriangularTerrainMeshPacket", "audralia-terrain-expression-lens-authority-split", { compact: true });
    }

    state.readsTriangularMesh = Boolean(state.trianglePacket || state.triangleStatus);
    return state.readsTriangularMesh;
  }

  function refreshReads() {
    var cs = carrierState();

    state.parentCarrierDetected = Boolean(carrier());
    state.parentCarrierValidated = Boolean(state.parentCarrierDetected && cs && cs.mount && cs.canvas);
    state.readsCarrierState = state.parentCarrierValidated;

    readDryTerrain();
    readElevationTrack();
    readReliefMetadata();
    readLandformMetadata();
    readBeachReadiness();
    readTriangularMesh();

    state.hydrationHeld = true;
    state.activeHydration = false;
    state.activeWater = false;

    return state.parentCarrierValidated;
  }

  function carrierLandField() {
    var cs = carrierState();
    return cs && Array.isArray(cs.landInfluenceField) ? cs.landInfluenceField : [];
  }

  function normalizePointFromSample(sample) {
    if (
      sample &&
      sample.point &&
      Number.isFinite(Number(sample.point.x)) &&
      Number.isFinite(Number(sample.point.y)) &&
      Number.isFinite(Number(sample.point.z))
    ) {
      return { x: Number(sample.point.x), y: Number(sample.point.y), z: Number(sample.point.z) };
    }

    if (sample && Number.isFinite(Number(sample.lon)) && Number.isFinite(Number(sample.lat))) {
      return lonLatPoint(Number(sample.lon), Number(sample.lat));
    }

    if (sample && Number.isFinite(Number(sample.gridX)) && Number.isFinite(Number(sample.gridY))) {
      var ll = terrainSeatToLonLat(Number(sample.gridX), Number(sample.gridY));
      return lonLatPoint(ll.lon, ll.lat);
    }

    if (sample && Number.isFinite(Number(sample.x)) && Number.isFinite(Number(sample.y))) {
      var ll2 = terrainSeatToLonLat(Number(sample.x), Number(sample.y));
      return lonLatPoint(ll2.lon, ll2.lat);
    }

    return null;
  }

  function sampleColorHint(sample) {
    var raw = sample && sample.color ? sample.color : null;

    if (raw && Number.isFinite(Number(raw.r)) && Number.isFinite(Number(raw.g)) && Number.isFinite(Number(raw.b))) {
      return { r: Number(raw.r), g: Number(raw.g), b: Number(raw.b) };
    }

    return { r: 126, g: 143, b: 94 };
  }

  function expressionSampleFromCarrierSample(sample, index) {
    var point = normalizePointFromSample(sample);
    if (!point) return null;

    var land = clamp(Number(sample.landPresence || 0), 0, 1);
    var height = clamp(Number(sample.height || 0.5), 0, 1);
    var relief = clamp(Number(sample.relief || sample.slope || 0), 0, 1);
    var slope = clamp(Number(sample.slope || 0), 0, 1);
    var boundary = clamp(Number(sample.boundaryPressure || 0), 0, 1);
    var future = clamp(Number(sample.futureFillPressure || 0), 0, 1);

    var surfaceScore = clamp(
      land * 0.86 +
      relief * 0.12 +
      height * 0.08 -
      future * 0.78,
      0,
      1
    );

    var hydrationScore = clamp(
      future * 0.76 +
      (1 - height) * 0.10 +
      slope * 0.08 +
      boundary * 0.06,
      0,
      1
    );

    var boundaryScore = clamp(
      boundary * 0.44 +
      future * land * 0.36 +
      relief * 0.12 +
      slope * 0.08,
      0,
      1
    );

    var latticeScore = clamp(
      land * 0.34 +
      future * 0.24 +
      relief * 0.20 +
      boundary * 0.22,
      0,
      1
    );

    var fullScore = clamp(
      surfaceScore * 0.46 +
      hydrationScore * 0.20 +
      boundaryScore * 0.22 +
      latticeScore * 0.12,
      0,
      1
    );

    return Object.freeze({
      sampleId: sample.sampleId || "AUDRALIA-LENS-SAMPLE-" + String(index).padStart(4, "0"),
      source: "carrier-land-influence-field",
      x: Number(sample.gridX || sample.x || 0),
      y: Number(sample.gridY || sample.y || 0),
      lon: Number(sample.lon || 0),
      lat: Number(sample.lat || 0),
      point: point,

      landPresence: round(land, 4),
      elevation: round(height, 4),
      reliefStrength: round(relief, 4),
      slopeStrength: round(slope, 4),
      boundaryPressure: round(boundary, 4),
      futureFillPressure: round(future, 4),
      voidPressure: round(clamp((1 - land) * 0.50 + future * 0.42, 0, 1), 4),

      surfaceScore: round(surfaceScore, 4),
      hydrationScore: round(hydrationScore, 4),
      boundaryScore: round(boundaryScore, 4),
      latticeScore: round(latticeScore, 4),
      fullScore: round(fullScore, 4),

      continentId: sample.continentId || "unassigned",
      continentName: sample.continentName || "Unassigned",
      colorHint: sampleColorHint(sample),

      terrainTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function expressionSampleFromDryNode(node, index, offsetIndex) {
    if (!node) return null;

    var ox = [0, -0.24, 0.25][offsetIndex || 0] || 0;
    var oy = [0, 0.18, -0.16][offsetIndex || 0] || 0;

    var x = Number(node.x !== undefined ? node.x : node.radial !== undefined ? node.radial : index % RADIAL_NODES) + ox;
    var y = Number(node.y !== undefined ? node.y : node.band !== undefined ? node.band : Math.floor(index / RADIAL_NODES)) + oy;

    x = ((x % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    y = clamp(y, 0, FIBONACCI_BANDS - 1);

    var ll = terrainSeatToLonLat(x, y);
    var point = lonLatPoint(ll.lon, ll.lat);

    var elevation = clamp(Number(node.dryElevation || node.elevation || 0.5), 0, 1);
    var ridge = clamp(Number(node.ridgePressure || 0), 0, 1);
    var mountain = clamp(Number(node.mountainPressure || 0), 0, 1);
    var basin = clamp(Number(node.basinPressure || 0), 0, 1);
    var valley = clamp(Number(node.valleyPressure || 0), 0, 1);
    var trench = clamp(Number(node.trenchPressure || 0), 0, 1);
    var shelf = clamp(Number(node.shelfPressure || 0), 0, 1);
    var summit = clamp(Number(node.summitPressure || 0), 0, 1);
    var gap = clamp(Number(node.gapPressure || 0), 0, 1);

    var future = node.futureFillEligible ? clamp(0.48 + basin * 0.20 + valley * 0.12 + gap * 0.16, 0, 1) : clamp(gap * 0.34, 0, 1);
    var land = clamp(elevation * 0.52 + ridge * 0.13 + mountain * 0.16 + summit * 0.12 + shelf * 0.08 - future * 0.48, 0, 1);
    var relief = clamp(ridge * 0.26 + mountain * 0.24 + summit * 0.20 + trench * 0.14 + shelf * 0.08 + Math.abs(elevation - 0.5) * 0.16, 0, 1);
    var boundary = clamp(shelf * 0.34 + trench * 0.18 + future * land * 0.34 + ridge * 0.10, 0, 1);
    var reduction = offsetIndex ? 0.72 : 1;

    var surfaceScore = clamp((land * 0.84 + relief * 0.12 - future * 0.76) * reduction, 0, 1);
    var hydrationScore = clamp((future * 0.72 + basin * 0.16 + valley * 0.10 + trench * 0.08) * reduction, 0, 1);
    var boundaryScore = clamp((boundary * 0.50 + future * land * 0.36 + relief * 0.08) * reduction, 0, 1);
    var latticeScore = clamp((land * 0.32 + future * 0.24 + relief * 0.24 + boundary * 0.20) * reduction, 0, 1);
    var fullScore = clamp(surfaceScore * 0.46 + hydrationScore * 0.20 + boundaryScore * 0.22 + latticeScore * 0.12, 0, 1);

    var color = { r: 124, g: 142, b: 92 };
    if (elevation > 0.66 || summit > 0.34) color = { r: 178, g: 160, b: 106 };
    if (basin > 0.42 || future > 0.50) color = { r: 72, g: 92, b: 74 };
    if (ridge > 0.42 || mountain > 0.42) color = { r: 152, g: 129, b: 82 };

    return Object.freeze({
      sampleId: "AUDRALIA-LENS-DRY-NODE-" + String(index).padStart(3, "0") + "-" + String(offsetIndex || 0),
      source: "dry-terrain-node",
      x: round(x, 4),
      y: round(y, 4),
      lon: round(ll.lon, 4),
      lat: round(ll.lat, 4),
      point: point,

      landPresence: round(land * reduction, 4),
      elevation: round(elevation, 4),
      reliefStrength: round(relief, 4),
      slopeStrength: round(clamp(trench * 0.22 + ridge * 0.18 + shelf * 0.12, 0, 1), 4),
      boundaryPressure: round(boundary, 4),
      futureFillPressure: round(future, 4),
      voidPressure: round(clamp((1 - land) * 0.42 + future * 0.44, 0, 1), 4),

      surfaceScore: round(surfaceScore, 4),
      hydrationScore: round(hydrationScore, 4),
      boundaryScore: round(boundaryScore, 4),
      latticeScore: round(latticeScore, 4),
      fullScore: round(fullScore, 4),

      continentId: node.regionSeed || node.continentId || "unassigned",
      continentName: node.regionSeedName || node.continentName || "Unassigned",
      colorHint: color,

      terrainTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function shouldIncludeCarrierSample(sample, index, total) {
    var land = Number(sample.landPresence || 0);
    var relief = Number(sample.relief || sample.slope || 0);
    var future = Number(sample.futureFillPressure || 0);
    var boundary = Number(sample.boundaryPressure || 0);

    if (land > 0.18) return true;
    if (future > 0.24 && land > 0.055) return true;
    if (boundary > 0.30 && land > 0.045) return true;
    if (relief > 0.28 && land > 0.050) return true;

    var stride = Math.max(1, Math.ceil(total / 1200));
    return index % stride === 0 && (land > 0.045 || future > 0.18 || boundary > 0.18);
  }

  function buildCacheFromCarrierField() {
    var field = carrierLandField();
    var samples = [];

    for (var i = 0; i < field.length; i += 1) {
      if (!shouldIncludeCarrierSample(field[i], i, field.length)) continue;
      var sample = expressionSampleFromCarrierSample(field[i], i);
      if (sample) samples.push(sample);
    }

    return samples;
  }

  function buildCacheFromDryNodes() {
    var samples = [];

    state.dryNodes.forEach(function (node, index) {
      for (var offset = 0; offset < 3; offset += 1) {
        var sample = expressionSampleFromDryNode(node, index, offset);
        if (sample && (sample.surfaceScore > 0.05 || sample.hydrationScore > 0.12 || sample.boundaryScore > 0.10 || sample.latticeScore > 0.12)) {
          samples.push(sample);
        }
      }
    });

    return samples;
  }

  function rebuildExpressionCache(reason) {
    refreshReads();

    var samples = buildCacheFromCarrierField();

    if (!samples.length && state.readsDryTerrain) {
      samples = buildCacheFromDryNodes();
    }

    samples = samples.filter(function (sample) {
      if (!sample) return false;
      if (sample.activeWater === true || sample.activeHydration === true || sample.finalVisualPassClaim === true) return false;
      return sample.surfaceScore > 0.035 || sample.hydrationScore > 0.090 || sample.boundaryScore > 0.080 || sample.latticeScore > 0.090;
    });

    samples.sort(function (a, b) {
      return Number(b.fullScore || 0) - Number(a.fullScore || 0);
    });

    if (samples.length > MAX_CACHE_SAMPLES) {
      samples = samples.slice(0, MAX_CACHE_SAMPLES);
    }

    state.terrainExpressionSamples = Object.freeze(samples);
    state.terrainExpressionActive = samples.length > 0;

    state.surfaceLandMaskActive = samples.some(function (sample) { return sample.surfaceScore > 0.115; });
    state.hydrationFutureFillMaskActive = samples.some(function (sample) { return sample.hydrationScore > 0.175; });
    state.boundaryInterfaceMaskActive = samples.some(function (sample) { return sample.boundaryScore > 0.155; });
    state.latticeDiagnosticMaskActive = samples.some(function (sample) { return sample.latticeScore > 0.120; });
    state.fullCompositeMaskActive = samples.length > 0;

    state.organicLandMaskActive = state.surfaceLandMaskActive;
    state.nodeRegisteredExpressionActive = samples.length > 0;
    state.terrainIlluminationCanvasActive = samples.length > 0;
    state.surfaceGridSuppressionActive = state.surfaceLandMaskActive;

    state.cacheBuildCount += 1;
    state.lastCacheReason = reason || "manual";

    publishStatus();
    return state.terrainExpressionSamples;
  }

  function lensRule() {
    var lens = currentLens();
    return LENS_RULES[lens] || LENS_RULES.surface;
  }

  function sampleScore(sample, lens) {
    if (lens === "surface") return Number(sample.surfaceScore || 0);
    if (lens === "hydration") return Number(sample.hydrationScore || 0);
    if (lens === "boundary") return Number(sample.boundaryScore || 0);
    if (lens === "lattice") return Number(sample.latticeScore || 0);
    if (lens === "full") return Number(sample.fullScore || 0);
    return 0;
  }

  function sampleAllowed(sample, lens, rule) {
    if (!sample) return false;

    if (lens === "surface") {
      return sample.surfaceScore >= rule.surfaceThreshold &&
        sample.futureFillPressure < 0.58 &&
        sample.voidPressure < 0.72;
    }

    if (lens === "hydration") {
      return sample.hydrationScore >= rule.hydrationThreshold &&
        sample.futureFillPressure > 0.14;
    }

    if (lens === "boundary") {
      return sample.boundaryScore >= rule.boundaryThreshold &&
        sample.landPresence > 0.035 &&
        sample.futureFillPressure > 0.060;
    }

    if (lens === "lattice") {
      return sample.latticeScore > 0.100;
    }

    if (lens === "full") {
      return sample.fullScore > 0.090;
    }

    return false;
  }

  function colorFor(sample, lens, pass) {
    var base = sample.colorHint || { r: 126, g: 143, b: 94 };
    var high = { r: 216, g: 190, b: 124 };
    var low = { r: 48, g: 66, b: 52 };
    var waterMemory = { r: 70, g: 136, b: 160 };
    var edge = { r: 231, g: 199, b: 132 };
    var diagnostic = { r: 142, g: 216, b: 255 };

    var elevation = Number(sample.elevation || 0.5);
    var relief = Number(sample.reliefStrength || 0);
    var future = Number(sample.futureFillPressure || 0);
    var boundary = Number(sample.boundaryScore || 0);

    var color = base;

    if (lens === "surface") {
      if (elevation > 0.58) color = mixColor(color, high, clamp((elevation - 0.58) * 0.76 + relief * 0.12, 0, 0.42));
      if (elevation < 0.42) color = mixColor(color, low, clamp((0.42 - elevation) * 0.62, 0, 0.35));
    } else if (lens === "hydration") {
      color = mixColor(low, waterMemory, clamp(0.48 + future * 0.36, 0, 0.82));
    } else if (lens === "boundary") {
      color = mixColor(edge, waterMemory, clamp(future * 0.20, 0, 0.24));
    } else if (lens === "lattice") {
      color = diagnostic;
    } else if (lens === "full") {
      color = mixColor(base, waterMemory, clamp(future * 0.16, 0, 0.18));
      color = mixColor(color, edge, clamp(boundary * 0.18, 0, 0.20));
    }

    if (pass === "shadow") color = mixColor(color, { r: 10, g: 16, b: 18 }, 0.44);
    if (pass === "definition") color = mixColor(color, high, clamp(relief * 0.26, 0, 0.28));

    return color;
  }

  function alphaFor(sample, lens, rule, pass) {
    var score = sampleScore(sample, lens);
    var relief = Number(sample.reliefStrength || 0);
    var boundary = Number(sample.boundaryScore || 0);
    var future = Number(sample.futureFillPressure || 0);

    var alpha = rule.alpha * clamp(score * 0.86 + relief * 0.10 + boundary * 0.08, 0, 1);

    if (pass === "shadow") alpha *= 0.42;
    if (pass === "definition") alpha = rule.detailAlpha * clamp(score * 0.42 + relief * 0.36 + boundary * 0.22, 0, 1);

    if (lens === "surface") alpha *= clamp(1 - future * 0.88, 0, 1);
    if (lens === "hydration") alpha *= 0.72;
    if (lens === "boundary") alpha *= 0.92;
    if (lens === "lattice") alpha *= 0.82;
    if (lens === "full") alpha *= 0.74;

    return clamp(alpha, 0, 0.48);
  }

  function drawBlob(sample, lens, rule, pass) {
    var p = project(sample.point);
    if (!p.front) return false;

    var alpha = alphaFor(sample, lens, rule, pass);
    if (alpha <= 0.006) return false;

    var ctx = state.ctx;
    var m = carrierMetrics();
    var color = colorFor(sample, lens, pass);
    var score = sampleScore(sample, lens);
    var baseRadius = m.r * (0.011 + score * 0.010) * rule.radiusScale;
    var radius = Math.max(2.0, baseRadius * p.scale);

    if (lens === "surface") radius *= 1.08;
    if (lens === "hydration") radius *= 0.94;
    if (lens === "boundary") radius *= 0.50;
    if (lens === "lattice") radius *= 0.42;
    if (pass === "definition") radius *= 0.42;
    if (pass === "shadow") radius *= 0.88;

    var gradient = ctx.createRadialGradient(
      p.x - radius * 0.18,
      p.y - radius * 0.16,
      radius * 0.02,
      p.x,
      p.y,
      radius
    );

    gradient.addColorStop(0.00, rgba(color, alpha));
    gradient.addColorStop(0.48, rgba(color, alpha * 0.42));
    gradient.addColorStop(1.00, rgba(color, 0));

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();

    return true;
  }

  function drawBoundaryStroke(sample, lens, rule) {
    if (lens !== "boundary" && lens !== "full") return false;
    if (sample.boundaryScore < 0.155) return false;

    var p = project(sample.point);
    if (!p.front) return false;

    var ctx = state.ctx;
    var m = carrierMetrics();
    var color = colorFor(sample, "boundary", "definition");
    var alpha = rule.detailAlpha * clamp(Number(sample.boundaryScore || 0), 0, 1);

    if (lens === "full") alpha *= 0.58;

    if (alpha <= 0.010) return false;

    var length = Math.max(2.2, m.r * 0.010 * p.scale * (0.70 + sample.boundaryScore));
    var tilt = (Number(sample.x || 0) * 0.53 + Number(sample.y || 0) * 0.31) % TAU;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.moveTo(-length * 0.52, 0);
    ctx.quadraticCurveTo(0, -length * 0.22, length * 0.52, 0);
    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = Math.max(0.38, m.r * 0.00092 * p.scale);
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawLatticePoint(sample, lens, rule) {
    if (lens !== "lattice" && lens !== "full") return false;
    if (lens === "full" && sample.latticeScore < 0.34) return false;

    var p = project(sample.point);
    if (!p.front) return false;

    var ctx = state.ctx;
    var m = carrierMetrics();
    var color = colorFor(sample, "lattice", "definition");
    var alpha = lens === "lattice" ? 0.20 : 0.070;
    var radius = Math.max(0.72, m.r * 0.0026 * p.scale);

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = rgba(color, alpha);
    ctx.fill();

    return true;
  }

  function drawExpressionField() {
    if (!state.ctx || !state.terrainExpressionSamples.length) return;

    var lens = currentLens();
    var rule = lensRule();
    var samples = state.terrainExpressionSamples;
    var drawn = 0;
    var detailDrawn = 0;
    var latticeDrawn = 0;

    state.ctx.save();
    clipSphere();

    for (var i = 0; i < samples.length && drawn < rule.budget; i += 1) {
      if (!sampleAllowed(samples[i], lens, rule)) continue;
      if (lens === "boundary") continue;
      if (drawBlob(samples[i], lens, rule, "shadow")) drawn += 1;
    }

    drawn = 0;

    for (var j = 0; j < samples.length && drawn < rule.budget; j += 1) {
      if (!sampleAllowed(samples[j], lens, rule)) continue;

      if (lens === "boundary") {
        if (drawBoundaryStroke(samples[j], lens, rule)) drawn += 1;
      } else {
        if (drawBlob(samples[j], lens, rule, "illumination")) drawn += 1;
      }
    }

    var detailBudget = lens === "surface" ? 420 : lens === "hydration" ? 220 : lens === "boundary" ? 560 : lens === "lattice" ? 900 : 520;

    for (var k = 0; k < samples.length && detailDrawn < detailBudget; k += 1) {
      if (!sampleAllowed(samples[k], lens, rule)) continue;

      if (lens === "lattice") {
        if (drawLatticePoint(samples[k], lens, rule)) detailDrawn += 1;
      } else if (lens === "full") {
        drawBoundaryStroke(samples[k], lens, rule);
        if (drawLatticePoint(samples[k], lens, rule)) latticeDrawn += 1;
        if (drawBlob(samples[k], lens, rule, "definition")) detailDrawn += 1;
      } else {
        if (drawBlob(samples[k], lens, rule, "definition")) detailDrawn += 1;
      }
    }

    state.ctx.restore();
  }

  function syncCanvasSize() {
    var cs = carrierState();
    if (!state.canvas || !cs) return false;

    var nextWidth = Math.max(320, Math.floor(Number(cs.width || 0)));
    var nextHeight = Math.max(600, Math.floor(Number(cs.height || 0)));
    var nextDpr = Math.max(1, Math.min(2.25, Number(cs.dpr || window.devicePixelRatio || 1)));

    if (!nextWidth || !nextHeight) {
      var rect = state.mount ? state.mount.getBoundingClientRect() : { width: 0, height: 0 };
      nextWidth = Math.max(320, Math.floor(rect.width * nextDpr));
      nextHeight = Math.max(600, Math.floor(rect.height * nextDpr));
    }

    var changed = state.width !== nextWidth || state.height !== nextHeight || state.dpr !== nextDpr;

    state.width = nextWidth;
    state.height = nextHeight;
    state.dpr = nextDpr;

    if (state.canvas.width !== nextWidth) state.canvas.width = nextWidth;
    if (state.canvas.height !== nextHeight) state.canvas.height = nextHeight;

    return changed;
  }

  function mount() {
    if (!routeAllowed()) return false;

    refreshReads();

    var cs = carrierState();
    if (!cs || !cs.mount || !cs.canvas) {
      publishStatus();
      return false;
    }

    state.stage = cs.stage || document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = cs.mount;
    state.parentCarrierDetected = true;
    state.parentCarrierValidated = true;

    if (!state.canvas) {
      state.canvas = document.createElement("canvas");
      state.canvas.setAttribute("data-contract", CONTRACT);
      state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
      state.canvas.setAttribute("data-file", FILE);
      state.canvas.setAttribute("data-audralia-terrain-expression-canvas", "true");
      state.canvas.setAttribute("data-lens-authority-split-active", "true");
      state.canvas.setAttribute("data-surface-land-mask-active", "true");
      state.canvas.setAttribute("data-hydration-future-fill-mask-active", "true");
      state.canvas.setAttribute("data-boundary-interface-mask-active", "true");
      state.canvas.setAttribute("data-lattice-diagnostic-mask-active", "true");
      state.canvas.setAttribute("data-full-composite-mask-active", "true");
      state.canvas.setAttribute("data-pointer-events-none", "true");
      state.canvas.setAttribute("data-carrier-preserved", "true");
      state.canvas.setAttribute("data-carrier-rewritten", "false");
      state.canvas.setAttribute("data-hydration-held", "true");
      state.canvas.setAttribute("data-active-water", "false");
      state.canvas.setAttribute("data-final-visual-pass-claim", "false");

      state.canvas.style.position = "absolute";
      state.canvas.style.inset = "0";
      state.canvas.style.width = "100%";
      state.canvas.style.height = "100%";
      state.canvas.style.pointerEvents = "none";
      state.canvas.style.background = "transparent";
      state.canvas.style.zIndex = "12";
      state.canvas.style.display = "block";
    }

    try {
      var computed = window.getComputedStyle(state.mount);
      if (computed && computed.position === "static") {
        state.mount.style.position = "relative";
      }
    } catch (_error) {}

    if (state.canvas.parentNode !== state.mount) {
      state.mount.appendChild(state.canvas);
    }

    state.ctx = state.canvas.getContext("2d", { alpha: true });

    syncCanvasSize();

    state.expressionCanvasMounted = Boolean(state.canvas.parentNode === state.mount);
    state.expressionCanvasAboveCarrier = Boolean(state.expressionCanvasMounted);
    state.expressionCanvasPointerEventsNone = state.canvas.style.pointerEvents === "none";
    state.carrierPreserved = true;
    state.carrierRewritten = false;
    state.carrierControlsMutated = false;

    rebuildExpressionCache("mount");

    publishStatus();
    return state.expressionCanvasMounted;
  }

  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function frame() {
    if (state.stopped) return;

    state.raf = 0;

    if (!state.canvas || !state.ctx || !carrierState()) {
      mount();
    }

    syncCanvasSize();
    state.activeLens = currentLens();

    clearCanvas();

    if (state.parentCarrierValidated && state.terrainExpressionSamples.length) {
      drawExpressionField();
    }

    state.renderCount += 1;

    if (state.renderCount % 12 === 0) publishStatus();

    requestFrame();
  }

  function requestFrame() {
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function refresh() {
    refreshReads();
    rebuildExpressionCache("refresh");
    mount();
    publishStatus();
    return status();
  }

  function unmount() {
    if (state.canvas && state.canvas.parentNode) {
      try { state.canvas.parentNode.removeChild(state.canvas); } catch (_error) {}
    }

    state.expressionCanvasMounted = false;
    state.expressionCanvasAboveCarrier = false;
    publishStatus();
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try { window.cancelAnimationFrame(state.raf); } catch (_error) {}
    }

    state.raf = 0;
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,

      parentCarrierDetected: state.parentCarrierDetected,
      parentCarrierValidated: state.parentCarrierValidated,
      carrierPreserved: true,
      carrierRewritten: false,

      expressionCanvasMounted: state.expressionCanvasMounted,
      expressionCanvasAboveCarrier: state.expressionCanvasAboveCarrier,
      expressionCanvasPointerEventsNone: state.expressionCanvasPointerEventsNone,

      readsCarrierState: state.readsCarrierState,
      readsDryTerrain: state.readsDryTerrain,
      readsElevationTrack: state.readsElevationTrack,
      readsReliefMetadata: state.readsReliefMetadata,
      readsLandformMetadata: state.readsLandformMetadata,
      readsBeachReadiness: state.readsBeachReadiness,
      readsTriangularMesh: state.readsTriangularMesh,

      lensAuthoritySplitActive: true,
      surfaceLensAuthority: "land_visibility",
      hydrationLensAuthority: "future_water_placement_visibility",
      boundaryLensAuthority: "land_water_interface_visibility",
      latticeLensAuthority: "diagnostic_structure_visibility",
      fullLensAuthority: "composite_preview",

      terrainExpressionActive: state.terrainExpressionActive,
      terrainExpressionSampleCount: state.terrainExpressionSamples.length,

      surfaceLandMaskActive: state.surfaceLandMaskActive,
      hydrationFutureFillMaskActive: state.hydrationFutureFillMaskActive,
      boundaryInterfaceMaskActive: state.boundaryInterfaceMaskActive,
      latticeDiagnosticMaskActive: state.latticeDiagnosticMaskActive,
      fullCompositeMaskActive: state.fullCompositeMaskActive,

      organicLandMaskActive: state.organicLandMaskActive,
      nodeRegisteredExpressionActive: state.nodeRegisteredExpressionActive,
      terrainIlluminationCanvasActive: state.terrainIlluminationCanvasActive,
      surfaceGridSuppressionActive: state.surfaceGridSuppressionActive,
      voidTransparencyActive: true,
      futureFillTransparencyActive: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,

      terrainTruthMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      triangulationTruthMutated: false,
      hydrationTruthMutated: false,
      carrierControlsMutated: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      activeLens: state.activeLens,
      renderCount: state.renderCount,
      cacheBuildCount: state.cacheBuildCount,
      lastCacheReason: state.lastCacheReason,

      width: state.width,
      height: state.height,
      dpr: state.dpr,

      errors: state.errors.slice(),
      deployMarker: DEPLOY_MARKER
    };
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_STATUS = payload;
    window.AUDRALIA_TERRAIN_EXPRESSION_LENS_AUTHORITY_SPLIT_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaTerrainExpressionCanvasChild = CONTRACT;
      document.documentElement.dataset.audraliaLensAuthoritySplitActive = "true";
      document.documentElement.dataset.audraliaSurfaceLensAuthority = "land_visibility";
      document.documentElement.dataset.audraliaHydrationLensAuthority = "future_water_placement_visibility";
      document.documentElement.dataset.audraliaBoundaryLensAuthority = "land_water_interface_visibility";
      document.documentElement.dataset.audraliaLatticeLensAuthority = "diagnostic_structure_visibility";
      document.documentElement.dataset.audraliaFullLensAuthority = "composite_preview";

      document.documentElement.dataset.audraliaSurfaceLandMaskActive = String(state.surfaceLandMaskActive);
      document.documentElement.dataset.audraliaHydrationFutureFillMaskActive = String(state.hydrationFutureFillMaskActive);
      document.documentElement.dataset.audraliaBoundaryInterfaceMaskActive = String(state.boundaryInterfaceMaskActive);
      document.documentElement.dataset.audraliaLatticeDiagnosticMaskActive = String(state.latticeDiagnosticMaskActive);
      document.documentElement.dataset.audraliaFullCompositeMaskActive = String(state.fullCompositeMaskActive);

      document.documentElement.dataset.audraliaTerrainExpressionCanvasActive = String(state.expressionCanvasMounted);
      document.documentElement.dataset.audraliaTerrainIlluminationCanvasActive = String(state.terrainIlluminationCanvasActive);
      document.documentElement.dataset.audraliaNodeRegisteredExpressionActive = String(state.nodeRegisteredExpressionActive);
      document.documentElement.dataset.audraliaSurfaceGridSuppressionActive = String(state.surfaceGridSuppressionActive);
      document.documentElement.dataset.audraliaOrganicLandMaskActive = String(state.organicLandMaskActive);
      document.documentElement.dataset.audraliaExpressionCanvasAfterCarrier = String(state.expressionCanvasAboveCarrier);
      document.documentElement.dataset.audraliaTerrainExpressionSampleCount = String(state.terrainExpressionSamples.length);

      document.documentElement.dataset.audraliaCarrierPreserved = "true";
      document.documentElement.dataset.audraliaCarrierRewritten = "false";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaActiveWater = "false";
      document.documentElement.dataset.audraliaTerrainTruthMutated = "false";
      document.documentElement.dataset.audraliaElevationTruthMutated = "false";
      document.documentElement.dataset.audraliaReliefTruthMutated = "false";
      document.documentElement.dataset.audraliaLandformTruthMutated = "false";
      document.documentElement.dataset.audraliaBeachTruthMutated = "false";
      document.documentElement.dataset.audraliaTriangulationTruthMutated = "false";
      document.documentElement.dataset.audraliaHydrationTruthMutated = "false";
      document.documentElement.dataset.audraliaCarrierControlsMutated = "false";
      document.documentElement.dataset.audraliaFinalTerrainPassClaim = "false";
      document.documentElement.dataset.audraliaFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function boot() {
    if (!routeAllowed()) return;

    mount();
    requestFrame();

    setTimeout(function () { refresh(); }, 180);
    setTimeout(function () { refresh(); }, 640);
    setTimeout(function () { refresh(); }, 1200);
    setTimeout(function () { refresh(); }, 1800);
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    status: status,
    refresh: refresh,
    rebuildExpressionCache: rebuildExpressionCache,
    mount: mount,
    unmount: unmount,
    stop: stop
  });

  window.AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD = API;
  window.__AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_CONTROLLER__ = API;

  publishStatus();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
