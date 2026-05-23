// /assets/audralia/clean/runtime/audralia.terrain-expression.canvas.child.js
// AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_TNT_v1
// Full-file creation.
// Scope: transparent node-registered terrain illumination canvas only.
// Purpose: reveal what has already been written by the dry terrain / elevation / relief / landform / readiness / triangle / carrier stack.
// Owns: expression canvas, terrain illumination, organic land mask, Surface grid suppression, lens-aware visual definition.
// Does not own: terrain truth, elevation truth, relief truth, landform truth, beach truth, triangulation truth, hydration truth, controls, carrier runtime, parent HTML, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.terrain-expression.canvas.child.js";
  var ROUTE = "/showroom/globe/audralia/planet/";
  var CARRIER_GLOBAL = "__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__";
  var DEPLOY_MARKER = "AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_DEPLOY_MARKER_v1";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var MAX_CACHE_SAMPLES = 2400;

  var DRY_TERRAIN_GLOBALS = Object.freeze([
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
    body: Object.freeze({
      alpha: 0.135,
      detailAlpha: 0.060,
      radiusScale: 1.10,
      threshold: 0.120,
      futureFillSuppression: 0.92,
      budget: 720
    }),
    surface: Object.freeze({
      alpha: 0.315,
      detailAlpha: 0.150,
      radiusScale: 0.96,
      threshold: 0.070,
      futureFillSuppression: 0.96,
      budget: 1750
    }),
    hydration: Object.freeze({
      alpha: 0.080,
      detailAlpha: 0.060,
      radiusScale: 0.88,
      threshold: 0.095,
      futureFillSuppression: 0.40,
      budget: 950
    }),
    "sixth-sense": Object.freeze({
      alpha: 0.235,
      detailAlpha: 0.190,
      radiusScale: 0.92,
      threshold: 0.045,
      futureFillSuppression: 0.55,
      budget: 1900
    }),
    lattice: Object.freeze({
      alpha: 0.045,
      detailAlpha: 0.030,
      radiusScale: 0.82,
      threshold: 0.140,
      futureFillSuppression: 0.96,
      budget: 460
    }),
    receipt: Object.freeze({
      alpha: 0.050,
      detailAlpha: 0.030,
      radiusScale: 0.82,
      threshold: 0.140,
      futureFillSuppression: 0.96,
      budget: 460
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

    activeLens: "body",
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
    try {
      window.__AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_CONTROLLER__.stop();
    } catch (_error) {}
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
    var lens = cs && cs.activeLens ? String(cs.activeLens) : state.activeLens || "body";
    return LENS_RULES[lens] ? lens : "body";
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
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryApi = api;
    state.dryStatus = null;
    state.dryPacket = null;
    state.dryCarrierPacket = null;
    state.dryNodes = [];
    state.readsDryTerrain = false;

    if (!api) return false;

    state.dryStatus = typeof api.status === "function" ? safeCall("dryTerrain", api, "status") : null;

    if (typeof api.getCarrierTerrainPacket === "function") {
      state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    if (typeof api.getDryRevealedTerrainPacket === "function") {
      state.dryPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    } else if (typeof api.getPlanetPhysicalTerrainPacket === "function") {
      state.dryPacket = safeCall("dryTerrain", api, "getPlanetPhysicalTerrainPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    if (!state.dryPacket && state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) {
      state.dryPacket = state.dryCarrierPacket.planetPhysicalTerrainPacket;
    }

    state.dryNodes = readPacketNodes(state.dryPacket).length ? readPacketNodes(state.dryPacket) : readPacketNodes(state.dryCarrierPacket);

    state.readsDryTerrain = Boolean(
      state.dryNodes.length &&
      (
        !state.dryStatus ||
        state.dryStatus.activeHydration !== true
      )
    );

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
      state.elevationPacket = safeCall("elevationTrack", api, "getCarrierElevationPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    } else if (typeof api.getElevationTrackPacket === "function") {
      state.elevationPacket = safeCall("elevationTrack", api, "getElevationTrackPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    state.readsElevationTrack = Boolean(
      state.elevationPacket ||
      (state.elevationStatus && state.elevationStatus.elevationTrackReady === true)
    );

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
      state.reliefPacket = safeCall("reliefMetadata", api, "getCarrierReliefPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    state.readsReliefMetadata = Boolean(
      state.reliefPacket &&
      state.reliefPacket.activeHydration !== true &&
      state.reliefPacket.finalVisualPassClaim !== true
    );

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
      state.landformPacket = safeCall("landformMetadata", api, "getCarrierLandformPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    state.readsLandformMetadata = Boolean(
      state.landformPacket &&
      state.landformPacket.activeHydration !== true &&
      state.landformPacket.finalVisualPassClaim !== true
    );

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
      state.beachPacket = safeCall("beachReadiness", api, "getCarrierBeachPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    } else if (typeof api.getBeachCoastalReadinessPacket === "function") {
      state.beachPacket = safeCall("beachReadiness", api, "getBeachCoastalReadinessPacket", "audralia-terrain-expression-canvas-child", { compact: false });
    }

    state.readsBeachReadiness = Boolean(
      state.beachPacket ||
      (state.beachStatus && state.beachStatus.activeWater !== true)
    );

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
      state.trianglePacket = safeCall("triangularMesh", api, "getCarrierTriangleMeshPacket", "audralia-terrain-expression-canvas-child", { compact: true });
    } else if (typeof api.getTriangularTerrainMeshPacket === "function") {
      state.trianglePacket = safeCall("triangularMesh", api, "getTriangularTerrainMeshPacket", "audralia-terrain-expression-canvas-child", { compact: true });
    }

    state.readsTriangularMesh = Boolean(
      state.trianglePacket &&
      state.trianglePacket.activeHydration !== true &&
      state.trianglePacket.finalVisualPassClaim !== true &&
      state.trianglePacket.carrierOwnsTriangulation !== true
    );

    return state.readsTriangularMesh;
  }

  function refreshReads() {
    state.parentCarrierDetected = Boolean(carrier());
    state.parentCarrierValidated = Boolean(
      state.parentCarrierDetected &&
      carrierState() &&
      carrierState().mount &&
      carrierState().canvas
    );
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
      return {
        x: Number(sample.point.x),
        y: Number(sample.point.y),
        z: Number(sample.point.z)
      };
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
      return {
        r: Number(raw.r),
        g: Number(raw.g),
        b: Number(raw.b)
      };
    }

    return { r: 126, g: 143, b: 94 };
  }

  function expressionSampleFromCarrierSample(sample, index) {
    var point = normalizePointFromSample(sample);
    if (!point) return null;

    var landPresence = clamp(Number(sample.landPresence || 0), 0, 1);
    var height = clamp(Number(sample.height || 0.5), 0, 1);
    var relief = clamp(Number(sample.relief || sample.slope || 0), 0, 1);
    var slope = clamp(Number(sample.slope || 0), 0, 1);
    var boundary = clamp(Number(sample.boundaryPressure || 0), 0, 1);
    var futureFill = clamp(Number(sample.futureFillPressure || 0), 0, 1);
    var voidPressure = clamp((1 - landPresence) * 0.52 + futureFill * 0.42, 0, 1);
    var expressionStrength = clamp(
      landPresence * 0.70 +
      height * 0.08 +
      relief * 0.12 +
      boundary * 0.05 -
      futureFill * 0.30,
      0,
      1
    );

    var renderPriority = clamp(
      expressionStrength * 0.66 +
      relief * 0.18 +
      boundary * 0.10 +
      height * 0.06,
      0,
      1
    );

    return Object.freeze({
      sampleId: sample.sampleId || "AUDRALIA-TERRAIN-EXPRESSION-CARRIER-SAMPLE-" + String(index).padStart(4, "0"),
      source: "carrier-land-influence-field",
      x: Number(sample.gridX || sample.x || 0),
      y: Number(sample.gridY || sample.y || 0),
      lon: Number(sample.lon || 0),
      lat: Number(sample.lat || 0),
      point: point,

      landPresence: round(landPresence, 4),
      expressionStrength: round(expressionStrength, 4),
      elevation: round(height, 4),
      elevationBand: sample.elevationBand || "carrier_expression",
      reliefStrength: round(relief, 4),
      ridgeStrength: round(clamp(relief * 0.52 + slope * 0.34, 0, 1), 4),
      basinStrength: round(clamp(futureFill * 0.46 + (1 - height) * 0.18, 0, 1), 4),
      slopeStrength: round(slope, 4),
      futureFillPressure: round(futureFill, 4),
      voidPressure: round(voidPressure, 4),
      boundaryPressure: round(boundary, 4),

      continentId: sample.continentId || "unassigned",
      continentName: sample.continentName || "Unassigned",
      colorHint: sampleColorHint(sample),

      opacityHint: round(clamp(expressionStrength * 0.90 + relief * 0.16, 0, 1), 4),
      radiusHint: round(clamp(0.010 + landPresence * 0.010 + boundary * 0.003, 0.007, 0.024), 4),
      renderPriority: round(renderPriority, 4),

      renderInBody: landPresence > 0.13 && futureFill < 0.72,
      renderInSurface: landPresence > 0.065 && futureFill < 0.82,
      renderInHydration: futureFill > 0.20 || landPresence > 0.22,
      renderInSixthSense: landPresence > 0.040 || relief > 0.18,
      renderInLattice: landPresence > 0.18 && futureFill < 0.68,

      terrainTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function expressionSampleFromDryNode(node, index, offsetIndex) {
    if (!node) return null;

    var ox = [0, -0.23, 0.25][offsetIndex || 0] || 0;
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
    var futureFill = node.futureFillEligible ? clamp(0.42 + basin * 0.22 + valley * 0.12 + gap * 0.18, 0, 1) : clamp(gap * 0.34, 0, 1);

    var role = String(node.primaryTerrainRole || node.terrainClass || "");
    var solidRoleBonus = /mountain|ridge|plateau|highland|stable|summit|escarpment|shelf|valley|basin/.test(role) ? 0.18 : 0;
    var landPresence = clamp(
      elevation * 0.44 +
      ridge * 0.14 +
      mountain * 0.15 +
      shelf * 0.10 +
      summit * 0.12 +
      solidRoleBonus -
      futureFill * 0.38,
      0,
      1
    );

    var relief = clamp(
      ridge * 0.26 +
      mountain * 0.24 +
      summit * 0.20 +
      trench * 0.12 +
      shelf * 0.08 +
      Math.abs(elevation - 0.5) * 0.16,
      0,
      1
    );

    var expressionStrength = clamp(
      landPresence * 0.72 +
      relief * 0.16 +
      elevation * 0.10 -
      futureFill * 0.26,
      0,
      1
    );

    var color = { r: 124, g: 142, b: 92 };
    if (elevation > 0.66 || summit > 0.34) color = { r: 178, g: 160, b: 106 };
    if (basin > 0.42 || futureFill > 0.50) color = { r: 72, g: 92, b: 74 };
    if (ridge > 0.42 || mountain > 0.42) color = { r: 152, g: 129, b: 82 };

    var reduction = offsetIndex ? 0.74 : 1;

    return Object.freeze({
      sampleId: "AUDRALIA-TERRAIN-EXPRESSION-DRY-NODE-" + String(index).padStart(3, "0") + "-" + String(offsetIndex || 0),
      source: "dry-terrain-node",
      x: round(x, 4),
      y: round(y, 4),
      lon: round(ll.lon, 4),
      lat: round(ll.lat, 4),
      point: point,

      landPresence: round(landPresence * reduction, 4),
      expressionStrength: round(expressionStrength * reduction, 4),
      elevation: round(elevation, 4),
      elevationBand: node.terrainClass || "dry_terrain",
      reliefStrength: round(relief, 4),
      ridgeStrength: round(clamp(ridge + mountain * 0.38 + summit * 0.28, 0, 1), 4),
      basinStrength: round(clamp(basin + valley * 0.28 + gap * 0.22, 0, 1), 4),
      slopeStrength: round(clamp(trench * 0.24 + ridge * 0.18 + shelf * 0.12, 0, 1), 4),
      futureFillPressure: round(futureFill, 4),
      voidPressure: round(clamp((1 - landPresence) * 0.40 + futureFill * 0.44, 0, 1), 4),
      boundaryPressure: round(clamp(shelf * 0.30 + ridge * 0.18 + trench * 0.16, 0, 1), 4),

      continentId: node.regionSeed || node.continentId || "unassigned",
      continentName: node.regionSeedName || node.continentName || "Unassigned",
      colorHint: color,

      opacityHint: round(clamp(expressionStrength * reduction, 0, 1), 4),
      radiusHint: round(clamp(0.026 * reduction, 0.012, 0.028), 4),
      renderPriority: round(clamp(expressionStrength + relief * 0.18, 0, 1), 4),

      renderInBody: landPresence > 0.18 && futureFill < 0.72,
      renderInSurface: landPresence > 0.10 && futureFill < 0.82,
      renderInHydration: futureFill > 0.20 || landPresence > 0.24,
      renderInSixthSense: landPresence > 0.070 || relief > 0.16,
      renderInLattice: landPresence > 0.20 && futureFill < 0.68,

      terrainTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function shouldIncludeCarrierSample(sample, index, totalLength) {
    var presence = Number(sample.landPresence || 0);
    var relief = Number(sample.relief || sample.slope || 0);
    var futureFill = Number(sample.futureFillPressure || 0);
    var boundary = Number(sample.boundaryPressure || 0);

    if (presence > 0.20) return true;
    if (presence > 0.08 && (index % 2 === 0)) return true;
    if (relief > 0.30 && presence > 0.06) return true;
    if (boundary > 0.50 && presence > 0.05 && index % 3 === 0) return true;
    if (futureFill > 0.44 && presence > 0.10 && index % 5 === 0) return true;

    var stride = Math.max(1, Math.ceil(totalLength / 1200));
    return presence > 0.055 && index % stride === 0;
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
        if (sample && (sample.landPresence > 0.08 || sample.renderInHydration || sample.renderInSixthSense)) {
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
      return sample.landPresence > 0.035 || sample.futureFillPressure > 0.22 || sample.reliefStrength > 0.14;
    });

    samples.sort(function (a, b) {
      return Number(b.renderPriority || 0) - Number(a.renderPriority || 0);
    });

    if (samples.length > MAX_CACHE_SAMPLES) {
      samples = samples.slice(0, MAX_CACHE_SAMPLES);
    }

    state.terrainExpressionSamples = Object.freeze(samples);
    state.terrainExpressionActive = samples.length > 0;
    state.organicLandMaskActive = samples.length > 0;
    state.nodeRegisteredExpressionActive = samples.length > 0;
    state.terrainIlluminationCanvasActive = samples.length > 0;
    state.surfaceGridSuppressionActive = samples.length > 0;
    state.cacheBuildCount += 1;
    state.lastCacheReason = reason || "manual";

    publishStatus();

    return state.terrainExpressionSamples;
  }

  function lensRule() {
    var lens = currentLens();
    return LENS_RULES[lens] || LENS_RULES.body;
  }

  function sampleAllowedInLens(sample, lens, rule) {
    if (!sample) return false;

    var land = Number(sample.landPresence || 0);
    var future = Number(sample.futureFillPressure || 0);
    var voidPressure = Number(sample.voidPressure || 0);

    if (lens === "body") {
      return sample.renderInBody && land >= rule.threshold && future < 0.74 && voidPressure < 0.74;
    }

    if (lens === "surface") {
      return sample.renderInSurface && land >= rule.threshold && future < 0.82 && voidPressure < 0.82;
    }

    if (lens === "hydration") {
      return sample.renderInHydration && (future > 0.22 || land > 0.20);
    }

    if (lens === "sixth-sense") {
      return sample.renderInSixthSense;
    }

    if (lens === "lattice") {
      return sample.renderInLattice && land >= rule.threshold && future < 0.70;
    }

    if (lens === "receipt") {
      return sample.renderInBody && land >= rule.threshold && future < 0.70;
    }

    return land >= rule.threshold;
  }

  function colorForSample(sample, lens, pass) {
    var base = sample.colorHint || { r: 126, g: 143, b: 94 };
    var elevation = Number(sample.elevation || 0.5);
    var relief = Number(sample.reliefStrength || 0);
    var future = Number(sample.futureFillPressure || 0);
    var basin = Number(sample.basinStrength || 0);

    var high = { r: 214, g: 190, b: 124 };
    var low = { r: 52, g: 70, b: 54 };
    var shadow = { r: 18, g: 25, b: 22 };
    var diagnostic = { r: 126, g: 170, b: 178 };

    var color = base;

    if (elevation > 0.58) color = mixColor(color, high, clamp((elevation - 0.58) * 0.70 + relief * 0.12, 0, 0.44));
    if (elevation < 0.42) color = mixColor(color, low, clamp((0.42 - elevation) * 0.72 + basin * 0.10, 0, 0.42));

    if (pass === "definition") {
      color = mixColor(color, high, clamp(relief * 0.32, 0, 0.34));
    }

    if (pass === "shadow") {
      color = mixColor(color, shadow, 0.48);
    }

    if (lens === "hydration" || lens === "sixth-sense") {
      color = mixColor(color, diagnostic, clamp(future * 0.22, 0, 0.22));
    }

    return color;
  }

  function alphaForSample(sample, lens, rule, pass) {
    var expression = Number(sample.expressionStrength || 0);
    var land = Number(sample.landPresence || 0);
    var relief = Number(sample.reliefStrength || 0);
    var future = Number(sample.futureFillPressure || 0);
    var voidPressure = Number(sample.voidPressure || 0);

    var alpha = rule.alpha * clamp(expression * 0.72 + land * 0.34 + relief * 0.12, 0, 1);

    if (pass === "definition") alpha = rule.detailAlpha * clamp(relief * 0.58 + land * 0.34, 0, 1);
    if (pass === "shadow") alpha = rule.detailAlpha * clamp(voidPressure * 0.22 + relief * 0.18, 0, 0.52);

    if (lens === "body") alpha *= 0.72;
    if (lens === "surface") alpha *= 1.0;
    if (lens === "hydration") alpha *= future > 0.20 ? 0.58 : 0.28;
    if (lens === "sixth-sense") alpha *= 0.92;
    if (lens === "lattice" || lens === "receipt") alpha *= 0.50;

    if (lens === "body" || lens === "surface" || lens === "lattice" || lens === "receipt") {
      alpha *= clamp(1 - future * rule.futureFillSuppression, 0, 1);
    }

    return clamp(alpha, 0, 0.42);
  }

  function drawExpressionSample(sample, lens, rule, pass) {
    var p = project(sample.point);
    if (!p.front) return false;

    var alpha = alphaForSample(sample, lens, rule, pass);
    if (alpha <= 0.006) return false;

    var ctx = state.ctx;
    var m = carrierMetrics();
    var color = colorForSample(sample, lens, pass);
    var baseRadius = m.r * Number(sample.radiusHint || 0.014) * rule.radiusScale;
    var radius = Math.max(2.2, baseRadius * p.scale);

    if (pass === "definition") radius *= 0.48;
    if (pass === "shadow") radius *= 0.74;
    if (lens === "surface") radius *= 1.04;
    if (lens === "body") radius *= 1.18;

    var gradient = ctx.createRadialGradient(
      p.x - radius * 0.18,
      p.y - radius * 0.16,
      radius * 0.02,
      p.x,
      p.y,
      radius
    );

    if (pass === "shadow") {
      gradient.addColorStop(0.00, rgba(color, alpha * 0.64));
      gradient.addColorStop(0.58, rgba(color, alpha * 0.26));
      gradient.addColorStop(1.00, rgba(color, 0));
    } else {
      gradient.addColorStop(0.00, rgba(color, alpha));
      gradient.addColorStop(0.45, rgba(color, alpha * 0.44));
      gradient.addColorStop(1.00, rgba(color, 0));
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();

    return true;
  }

  function drawDefinitionStroke(sample, lens, rule) {
    if (lens !== "surface" && lens !== "sixth-sense") return false;

    var relief = Number(sample.reliefStrength || 0);
    var ridge = Number(sample.ridgeStrength || 0);
    var boundary = Number(sample.boundaryPressure || 0);

    if (relief < 0.22 && ridge < 0.24 && boundary < 0.34) return false;

    var p = project(sample.point);
    if (!p.front) return false;

    var ctx = state.ctx;
    var m = carrierMetrics();
    var color = colorForSample(sample, lens, "definition");
    var alpha = rule.detailAlpha * clamp(relief * 0.44 + ridge * 0.30 + boundary * 0.18, 0, 1);

    if (lens === "surface") alpha *= 0.72;
    if (lens === "sixth-sense") alpha *= 1.08;

    if (alpha <= 0.010) return false;

    var length = Math.max(2.4, m.r * 0.010 * p.scale * (0.72 + relief));
    var tilt = (Number(sample.x || 0) * 0.41 + Number(sample.y || 0) * 0.77) % TAU;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.moveTo(-length * 0.48, 0);
    ctx.quadraticCurveTo(0, -length * 0.16, length * 0.48, 0);
    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = Math.max(0.34, m.r * 0.00072 * p.scale);
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawExpressionField() {
    if (!state.ctx || !state.terrainExpressionSamples.length) return;

    var lens = currentLens();
    var rule = lensRule();
    var samples = state.terrainExpressionSamples;
    var drawn = 0;
    var detailDrawn = 0;
    var budget = rule.budget;

    state.ctx.save();
    clipSphere();

    for (var i = 0; i < samples.length && drawn < budget; i += 1) {
      var sample = samples[i];
      if (!sampleAllowedInLens(sample, lens, rule)) continue;

      if (drawExpressionSample(sample, lens, rule, "shadow")) drawn += 1;
    }

    drawn = 0;

    for (var j = 0; j < samples.length && drawn < budget; j += 1) {
      var sample2 = samples[j];
      if (!sampleAllowedInLens(sample2, lens, rule)) continue;

      if (drawExpressionSample(sample2, lens, rule, "illumination")) drawn += 1;
    }

    var detailBudget = lens === "surface" ? 360 : lens === "sixth-sense" ? 520 : lens === "hydration" ? 160 : 80;

    for (var k = 0; k < samples.length && detailDrawn < detailBudget; k += 1) {
      var sample3 = samples[k];
      if (!sampleAllowedInLens(sample3, lens, rule)) continue;

      if (drawExpressionSample(sample3, lens, rule, "definition")) detailDrawn += 1;
      drawDefinitionStroke(sample3, lens, rule);
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
      state.canvas.setAttribute("data-file", FILE);
      state.canvas.setAttribute("data-audralia-terrain-expression-canvas", "true");
      state.canvas.setAttribute("data-terrain-illumination-canvas-active", "true");
      state.canvas.setAttribute("data-node-registered-expression-active", "true");
      state.canvas.setAttribute("data-carrier-preserved", "true");
      state.canvas.setAttribute("data-carrier-rewritten", "false");
      state.canvas.setAttribute("data-pointer-events-none", "true");
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

    var dimensionChanged = syncCanvasSize();

    state.activeLens = currentLens();

    if (dimensionChanged && state.terrainExpressionSamples.length === 0) {
      rebuildExpressionCache("dimension-change");
    }

    clearCanvas();

    if (state.parentCarrierValidated && state.terrainExpressionSamples.length) {
      drawExpressionField();
    }

    state.renderCount += 1;

    if (state.renderCount % 12 === 0) {
      publishStatus();
    }

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
      try {
        state.canvas.parentNode.removeChild(state.canvas);
      } catch (_error) {}
    }

    state.expressionCanvasMounted = false;
    state.expressionCanvasAboveCarrier = false;
    publishStatus();
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    state.raf = 0;
  }

  function status() {
    var payload = {
      contract: CONTRACT,
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

      terrainExpressionActive: state.terrainExpressionActive,
      terrainExpressionSampleCount: state.terrainExpressionSamples.length,
      organicLandMaskActive: state.organicLandMaskActive,
      nodeRegisteredExpressionActive: state.nodeRegisteredExpressionActive,
      terrainIlluminationCanvasActive: state.terrainIlluminationCanvasActive,
      surfaceGridSuppressionActive: state.surfaceGridSuppressionActive,
      voidTransparencyActive: state.voidTransparencyActive,
      futureFillTransparencyActive: state.futureFillTransparencyActive,

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

    return payload;
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_TERRAIN_EXPRESSION_CANVAS_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaTerrainExpressionCanvasChild = CONTRACT;
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
