// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_CARRIER_BASELINE_RESTORED_PACKET_HANDOFF_DRAW_RENEWAL_TNT_v1
// Full-file replacement.
// Scope: runtime carrier only.
// Purpose: restore the stronger packet-handoff draw baseline, preserve the land-body compositor, and correct authority posture without stripping the working connections.
// Recovery base: AUDRALIA_CARRIER_NARROW_RELIEF_LANDFORM_DEFINITION_CONSUMPTION_TNT_v1
// Preserves: dry terrain fallback, ethical bump field, land influence field, continuous land-body compositor, relief/landform overlay drawing, zoom, drag, pinch, wheel, lenses, lattice, receipt, hydration hold.
// Adds: renderable fallback node-point mapping so landform IDs can draw even when they do not exactly match relief sample parent IDs.
// Does not own: terrain truth, elevation truth, relief truth, landform truth, hydration truth, climate, ecology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_CARRIER_BASELINE_RESTORED_PACKET_HANDOFF_DRAW_RENEWAL_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_CARRIER_NARROW_RELIEF_LANDFORM_DEFINITION_CONSUMPTION_TNT_v1";
  var RECOVERY_BASELINE = "AUDRALIA_CARRIER_NARROW_RELIEF_LANDFORM_DEFINITION_CONSUMPTION_TNT_v1";
  var STRIPPED_HELD_CONTRACT = "AUDRALIA_PLANET_BODY_INSPECTION_CARRIER_HANDOFF_ONLY_RENEWAL_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;
  var MIN_BUMP_ANCHOR_COUNT = 768;

  var LAND_FIELD_COLS = 120;
  var LAND_FIELD_ROWS = 60;

  var ZOOM = Object.freeze({
    min: 0.72,
    defaultValue: 1.0,
    max: 2.45
  });

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
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

  var LENSES = Object.freeze({
    body: "Body",
    surface: "Surface",
    hydration: "Hydration",
    "sixth-sense": "Sixth Sense",
    lattice: "Lattice",
    receipt: "Receipt"
  });

  var SIZE_CLASSES = Object.freeze({
    MICRO: Object.freeze({ key: "MICRO", name: "Micro Node", invariantRadius: 0.42, jurisdiction: "surface_grain" }),
    FIELD: Object.freeze({ key: "FIELD", name: "Field Node", invariantRadius: 0.74, jurisdiction: "local_continuity" }),
    STRUCTURAL: Object.freeze({ key: "STRUCTURAL", name: "Structural Node", invariantRadius: 1.18, jurisdiction: "landform_system" }),
    ANCHOR: Object.freeze({ key: "ANCHOR", name: "Anchor Node", invariantRadius: 1.76, jurisdiction: "major_terrain_authority" })
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,

    activeLens: "body",
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
    dryFailureReason: "dry terrain not checked",

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

    carrierConsumesReliefPacket: false,
    carrierConsumesLandformPacket: false,
    definitionConsumptionReady: false,
    definitionField: null,
    definitionFieldReady: false,

    reliefSampleByNodeId: {},
    definitionNodePointById: {},
    definitionNodePointFallbackActive: false,
    definitionNodePointFallbackHits: 0,
    definitionNodePointExactHits: 0,

    ethicalProfiles: [],
    ethicalBumpAnchors: [],
    continentBumpGroups: {},
    continentDisplacementFields: [],
    ethicalBumpFieldReady: false,

    dynamicSurfaceRows: [],
    landInfluenceField: [],
    landFieldIndex: [],
    visibleLandBodyPacket: null,
    landBodyCompositorReady: false,

    latticeSeats: [],
    latticeLinks: [],
    latticeReady: false,

    errors: []
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try { window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop(); } catch (_error) {}
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

  function clamp(value, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
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

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function landFieldToLonLat(x, y) {
    return {
      lon: -180 + ((x % LAND_FIELD_COLS + LAND_FIELD_COLS) % LAND_FIELD_COLS) / LAND_FIELD_COLS * 360,
      lat: 82 - (clamp(y, 0, LAND_FIELD_ROWS - 1) / (LAND_FIELD_ROWS - 1)) * 164
    };
  }

  function rotate(point) {
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;

    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);
    var y1 = y * cp - z1 * sp;
    var z2 = y * sp + z1 * cp;

    return { x: x1, y: y1, z: z2 };
  }

  function metrics() {
    var min = Math.min(state.width, state.height);
    var baseRadius = min * 0.405;
    var radius = baseRadius * state.zoom;

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      r: radius,
      baseRadius: baseRadius,
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
      front: p.z >= -0.06,
      scale: scale
    };
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.003, 0, TAU);
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

  function setZoom(nextZoom) {
    state.zoom = clamp(nextZoom, ZOOM.min, ZOOM.max);
    publishStatus();
    requestRender();
  }

  function resetCamera() {
    state.yaw = -0.62;
    state.pitch = -0.16;
    state.vx = 0;
    state.vy = 0;
    state.zoom = ZOOM.defaultValue;
    requestRender();
  }

  function pointerDistance() {
    var points = Array.from(state.pointers.values());
    if (points.length < 2) return 0;

    var dx = points[0].x - points[1].x;
    var dy = points[0].y - points[1].y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function gridDistance(ax, ay, bx, by) {
    var dx = Math.abs(Number(ax) - Number(bx));
    dx = Math.min(dx, RADIAL_NODES - dx);
    var dy = Number(ay) - Number(by);
    return Math.sqrt(dx * dx + dy * dy);
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
    state.dryTerrainValidated = false;

    if (!state.dryTerrainDetected) {
      state.dryFailureReason = "dry revealed terrain atlas missing";
      rebuildDerivedFields();
      publishStatus();
      requestRender();
      return false;
    }

    if (!state.dryTerrainApiComplete) {
      state.dryFailureReason = "dry revealed terrain atlas API incomplete";
      rebuildDerivedFields();
      publishStatus();
      requestRender();
      return false;
    }

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-runtime-carrier", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-runtime-carrier", { compact: false });

    state.dryTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true &&
      state.dryCarrierPacket &&
      state.dryCarrierPacket.carrierTerrainPacketReady === true &&
      state.dryCarrierPacket.carrierInventsTerrain === false &&
      state.dryCarrierPacket.finalVisualPassClaim === false
    );

    state.dryFailureReason = state.dryTerrainValidated ? "" : "dry terrain atlas validation failed";

    rebuildDerivedFields();
    publishStatus();
    requestRender();

    return state.dryTerrainValidated;
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
      rebuildDefinitionField();
      publishStatus();
      requestRender();
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierReliefPacket !== "function") {
      state.reliefFailureReason = "relief expression API incomplete";
      rebuildDefinitionField();
      publishStatus();
      requestRender();
      return false;
    }

    state.reliefStatus = safeCall("reliefExpression", api, "status");
    state.reliefCarrierPacket = safeCall("reliefExpression", api, "getCarrierReliefPacket", "audralia-runtime-carrier", { compact: false });

    state.reliefValidated = Boolean(
      state.reliefCarrierPacket &&
      state.reliefCarrierPacket.reliefExpressionReady === true &&
      state.reliefCarrierPacket.carrierMayConsume === true &&
      state.reliefCarrierPacket.carrierShouldNotOwnReliefTruth === true &&
      state.reliefCarrierPacket.carrierShouldNotOwnElevationTruth === true &&
      state.reliefCarrierPacket.childDrawsVisuals === false &&
      state.reliefCarrierPacket.hydrationHeld === true &&
      state.reliefCarrierPacket.activeHydration === false &&
      state.reliefCarrierPacket.finalVisualPassClaim === false
    );

    state.reliefFailureReason = state.reliefValidated ? "" : "relief expression packet validation failed";
    state.carrierConsumesReliefPacket = state.reliefValidated;

    rebuildDefinitionField();
    publishStatus();
    requestRender();

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
      rebuildDefinitionField();
      publishStatus();
      requestRender();
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierLandformPacket !== "function") {
      state.landformFailureReason = "landform systems API incomplete";
      rebuildDefinitionField();
      publishStatus();
      requestRender();
      return false;
    }

    state.landformStatus = safeCall("landformSystems", api, "status");
    state.landformCarrierPacket = safeCall("landformSystems", api, "getCarrierLandformPacket", "audralia-runtime-carrier", { compact: false });

    state.landformValidated = Boolean(
      state.landformCarrierPacket &&
      state.landformCarrierPacket.landformSystemsReady === true &&
      state.landformCarrierPacket.carrierMayConsume === true &&
      state.landformCarrierPacket.carrierShouldNotOwnLandformTruth === true &&
      state.landformCarrierPacket.carrierShouldNotOwnReliefTruth === true &&
      state.landformCarrierPacket.carrierShouldNotOwnElevationTruth === true &&
      state.landformCarrierPacket.childDrawsVisuals === false &&
      state.landformCarrierPacket.hydrationHeld === true &&
      state.landformCarrierPacket.activeHydration === false &&
      state.landformCarrierPacket.finalVisualPassClaim === false
    );

    state.landformFailureReason = state.landformValidated ? "" : "landform systems packet validation failed";
    state.carrierConsumesLandformPacket = state.landformValidated;

    rebuildDefinitionField();
    publishStatus();
    requestRender();

    return state.landformValidated;
  }

  function refreshDownstreamPackets() {
    detectDryTerrain();
    detectReliefExpression();
    detectLandformSystems();
    rebuildDefinitionField();
    rebuildDefinitionNodePointIndex();
    publishStatus();
    requestRender();
  }

  function dryPacket() {
    return state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;
  }

  function dryNodes() {
    var packet = dryPacket();
    return packet && Array.isArray(packet.nodes) ? packet.nodes : [];
  }

  function buildNineContinentEthicalProfiles() {
    return Object.freeze([
      Object.freeze({
        continentId: "gratitude",
        continentName: "Gratitude",
        summitEthic: "receptivity_stabilizing_response",
        centerX: 4.65,
        centerY: 4.65,
        color: { r: 123, g: 152, b: 93 },
        climateSeed: "temperate_receiving_basin",
        ecologySeed: "symbiotic_restoration_biome",
        technologySeed: "water_memory_storage_systems",
        terrainSignature: "receiving_basins_fertile_bowls_stable_shelves",
        metricWeights: { receptivity: 1.0, continuity: 0.72, repair: 0.42, clarity: 0.22, discipline: 0.22, restraint: 0.18, timeDepth: 0.36, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "generosity",
        continentName: "Generosity",
        summitEthic: "outward_flow_distribution",
        centerX: 10.9,
        centerY: 3.8,
        color: { r: 154, g: 146, b: 83 },
        climateSeed: "wind_distribution_corridor",
        ecologySeed: "migratory_abundance_belt",
        technologySeed: "distribution_exchange_infrastructure",
        terrainSignature: "radial_ridges_branching_channels_outward_plateaus",
        metricWeights: { receptivity: 0.24, continuity: 0.48, repair: 0.20, clarity: 0.28, discipline: 0.32, restraint: 0.22, timeDepth: 0.28, expansion: 1.0 }
      }),
      Object.freeze({
        continentId: "dependability",
        continentName: "Dependability",
        summitEthic: "load_bearing_continuity",
        centerX: 2.9,
        centerY: 8.1,
        color: { r: 104, g: 126, b: 84 },
        climateSeed: "stable_inland_plateau",
        ecologySeed: "resilient_grass_forest_matrix",
        technologySeed: "load_bearing_foundation_network",
        terrainSignature: "stable_cratons_durable_plateaus_long_mountain_bases",
        metricWeights: { receptivity: 0.28, continuity: 1.0, repair: 0.22, clarity: 0.38, discipline: 0.54, restraint: 0.34, timeDepth: 0.52, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "accountability",
        continentName: "Accountability",
        summitEthic: "boundary_clarity_consequence",
        centerX: 8.25,
        centerY: 7.35,
        color: { r: 148, g: 121, b: 84 },
        climateSeed: "rain_shadow_boundary",
        ecologySeed: "edge_specialist_ecology",
        technologySeed: "governance_measurement_engineering",
        terrainSignature: "sharp_ridges_escarpments_fault_boundaries",
        metricWeights: { receptivity: 0.16, continuity: 0.44, repair: 0.18, clarity: 0.72, discipline: 1.0, restraint: 0.64, timeDepth: 0.30, expansion: 0.18 }
      }),
      Object.freeze({
        continentId: "forgiveness",
        continentName: "Forgiveness",
        summitEthic: "repair_release_restored_continuity",
        centerX: 12.3,
        centerY: 8.9,
        color: { r: 118, g: 142, b: 104 },
        climateSeed: "recovery_monsoon_later",
        ecologySeed: "regeneration_successive_ecology",
        technologySeed: "remediation_recycling_systems",
        terrainSignature: "soft_valleys_repaired_fractures_sediment_basins",
        metricWeights: { receptivity: 0.50, continuity: 0.46, repair: 1.0, clarity: 0.24, discipline: 0.24, restraint: 0.36, timeDepth: 0.58, expansion: 0.30 }
      }),
      Object.freeze({
        continentId: "humility",
        continentName: "Humility",
        summitEthic: "lowland_wisdom_depth_without_collapse",
        centerX: 5.6,
        centerY: 12.0,
        color: { r: 91, g: 116, b: 91 },
        climateSeed: "protected_lowland_microclimate",
        ecologySeed: "understory_root_network",
        technologySeed: "low_impact_subsurface_resilience",
        terrainSignature: "valleys_low_plateaus_sheltered_basins",
        metricWeights: { receptivity: 0.72, continuity: 0.48, repair: 0.62, clarity: 0.24, discipline: 0.18, restraint: 0.62, timeDepth: 0.72, expansion: 0.10 }
      }),
      Object.freeze({
        continentId: "self-control",
        continentName: "Self-Control",
        summitEthic: "restraint_channel_discipline",
        centerX: 10.25,
        centerY: 12.55,
        color: { r: 126, g: 113, b: 78 },
        climateSeed: "regulated_dry_channel_climate",
        ecologySeed: "drought_adapted_precision_biome",
        technologySeed: "energy_flow_control_systems",
        terrainSignature: "controlled_channels_narrow_ridges_disciplined_trenches",
        metricWeights: { receptivity: 0.18, continuity: 0.40, repair: 0.24, clarity: 0.40, discipline: 0.72, restraint: 1.0, timeDepth: 0.38, expansion: 0.12 }
      }),
      Object.freeze({
        continentId: "patience",
        continentName: "Patience",
        summitEthic: "slow_formation_time_depth",
        centerX: 13.7,
        centerY: 5.6,
        color: { r: 151, g: 130, b: 91 },
        climateSeed: "long_cycle_sedimentary_climate",
        ecologySeed: "ancient_layered_soil_ecology",
        technologySeed: "archives_seed_vault_temporal_systems",
        terrainSignature: "terraces_shelves_layered_basins_stratified_plains",
        metricWeights: { receptivity: 0.46, continuity: 0.64, repair: 0.54, clarity: 0.34, discipline: 0.40, restraint: 0.48, timeDepth: 1.0, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "purity",
        continentName: "Purity",
        summitEthic: "clarity_clean_signal_refinement",
        centerX: 7.9,
        centerY: 2.05,
        color: { r: 168, g: 159, b: 118 },
        climateSeed: "clear_highland_atmospheric_flow",
        ecologySeed: "alpine_clarity_biome",
        technologySeed: "precision_optics_purification_standards",
        terrainSignature: "clear_highlands_bright_ridges_defined_basins",
        metricWeights: { receptivity: 0.18, continuity: 0.42, repair: 0.16, clarity: 1.0, discipline: 0.56, restraint: 0.44, timeDepth: 0.30, expansion: 0.18 }
      })
    ]);
  }

  function findProfile(continentId) {
    for (var i = 0; i < state.ethicalProfiles.length; i += 1) {
      if (state.ethicalProfiles[i].continentId === continentId) return state.ethicalProfiles[i];
    }
    return null;
  }

  function maxKey(obj) {
    var best = null;
    var bestValue = -Infinity;

    Object.keys(obj || {}).forEach(function (key) {
      if (obj[key] > bestValue) {
        best = key;
        bestValue = obj[key];
      }
    });

    return best;
  }

  function localNeighborInfluence(node, allNodes) {
    var x = Number(node.x || 0);
    var y = Number(node.y || 0);
    var total = 0;
    var count = 0;

    allNodes.forEach(function (other) {
      var d = gridDistance(x, y, Number(other.x || 0), Number(other.y || 0));
      if (d > 0 && d <= 2.25) {
        total += Number(other.dryElevation || other.elevation || 0.5);
        count += 1;
      }
    });

    return {
      neighborInfluence: count ? clamp(total / count, 0, 1) : 0.5,
      neighborCount: count
    };
  }

  function assignContinentForTerrainPoint(point, node) {
    var profiles = state.ethicalProfiles.length ? state.ethicalProfiles : buildNineContinentEthicalProfiles();
    var best = profiles[0];
    var bestScore = -Infinity;
    var x = Number(point.x || node.x || 0);
    var y = Number(point.y || node.y || 0);

    profiles.forEach(function (profile) {
      var d = gridDistance(x, y, profile.centerX, profile.centerY);
      var closeness = 1 / (0.68 + d);
      var regionBonus = String(node.regionSeed || "").toLowerCase() === profile.continentId ? 0.38 : 0;
      var pressureBonus =
        Number(node.summitPressure || 0) * profile.metricWeights.clarity * 0.08 +
        Number(node.ridgePressure || 0) * profile.metricWeights.discipline * 0.06 +
        Number(node.basinPressure || 0) * profile.metricWeights.receptivity * 0.07 +
        Number(node.gapPressure || 0) * profile.metricWeights.repair * 0.05;

      var score = closeness + regionBonus + pressureBonus;

      if (score > bestScore) {
        best = profile;
        bestScore = score;
      }
    });

    return best;
  }

  function buildEthicalMetricProfile(continent, node) {
    var weights = continent.metricWeights;
    var ridge = Number(node.ridgePressure || 0);
    var mountain = Number(node.mountainPressure || 0);
    var summit = Number(node.summitPressure || 0);
    var basin = Number(node.basinPressure || 0);
    var valley = Number(node.valleyPressure || 0);
    var trench = Number(node.trenchPressure || 0);
    var shelf = Number(node.shelfPressure || 0);
    var escarpment = Number(node.escarpmentPressure || 0);
    var gap = Number(node.gapPressure || 0);
    var carving = Number(node.formerHydrosphereCarvingValue || 0);
    var elevation = Number(node.dryElevation || node.elevation || 0.5);

    var profile = {
      receptivityPressure: clamp((basin + gap + valley + shelf * 0.42) * weights.receptivity, 0, 1),
      expansionPressure: clamp((ridge * 0.34 + shelf * 0.34 + Math.max(0, elevation - 0.45)) * weights.expansion, 0, 1),
      continuityPressure: clamp((1 - Math.abs(elevation - 0.55) + ridge * 0.24 + mountain * 0.14) * weights.continuity, 0, 1),
      disciplinePressure: clamp((ridge + escarpment + trench * 0.56) * weights.discipline, 0, 1),
      repairPressure: clamp((carving + basin * 0.46 + valley * 0.42 + gap * 0.34) * weights.repair, 0, 1),
      restraintPressure: clamp((trench + valley + escarpment * 0.38) * weights.restraint, 0, 1),
      timeDepthPressure: clamp((shelf + carving + basin * 0.38) * weights.timeDepth, 0, 1),
      clarityPressure: clamp((summit + mountain * 0.42 + ridge * 0.26 - gap * 0.12) * weights.clarity, 0, 1)
    };

    var ethicalCoherenceScore = clamp(
      profile.receptivityPressure * 0.12 +
      profile.expansionPressure * 0.10 +
      profile.continuityPressure * 0.16 +
      profile.disciplinePressure * 0.13 +
      profile.repairPressure * 0.12 +
      profile.restraintPressure * 0.12 +
      profile.timeDepthPressure * 0.12 +
      profile.clarityPressure * 0.13,
      0,
      1
    );

    profile.ethicalCoherenceScore = round(ethicalCoherenceScore, 4);

    Object.keys(profile).forEach(function (key) {
      profile[key] = round(profile[key], 4);
    });

    return Object.freeze(profile);
  }

  function classifyInvariantBumpSize(continent, node, localIndex) {
    var role = String(node.primaryTerrainRole || node.terrainClass || "");
    var summit = Number(node.summitPressure || 0);
    var ridge = Number(node.ridgePressure || 0);
    var mountain = Number(node.mountainPressure || 0);
    var basin = Number(node.basinPressure || 0);
    var trench = Number(node.trenchPressure || 0);
    var shelf = Number(node.shelfPressure || 0);
    var gap = Number(node.gapPressure || 0);

    if (
      localIndex === 2 &&
      (
        summit > 0.50 ||
        mountain > 0.54 ||
        (continent.continentId === "purity" && summit > 0.32) ||
        (continent.continentId === "humility" && basin + gap > 0.82) ||
        (continent.continentId === "gratitude" && basin + shelf > 0.72)
      )
    ) {
      return SIZE_CLASSES.ANCHOR;
    }

    if (
      localIndex === 1 &&
      (
        ridge > 0.38 ||
        trench > 0.38 ||
        shelf > 0.48 ||
        role.indexOf("ridge") >= 0 ||
        role.indexOf("trench") >= 0 ||
        role.indexOf("shelf") >= 0 ||
        role.indexOf("escarpment") >= 0
      )
    ) {
      return SIZE_CLASSES.STRUCTURAL;
    }

    if (localIndex === 0 || role.indexOf("seabed") >= 0 || gap > 0.56) {
      return SIZE_CLASSES.MICRO;
    }

    return SIZE_CLASSES.FIELD;
  }

  function calculateVariantNarrativeHeight(continent, node, sizeClass, neighbors) {
    var metricsProfile = buildEthicalMetricProfile(continent, node);
    var elevation = Number(node.dryElevation || node.elevation || 0.5);
    var ridge = Number(node.ridgePressure || 0);
    var mountain = Number(node.mountainPressure || 0);
    var summit = Number(node.summitPressure || 0);
    var basin = Number(node.basinPressure || 0);
    var valley = Number(node.valleyPressure || 0);
    var trench = Number(node.trenchPressure || 0);
    var shelf = Number(node.shelfPressure || 0);
    var escarpment = Number(node.escarpmentPressure || 0);
    var gap = Number(node.gapPressure || 0);
    var carving = Number(node.formerHydrosphereCarvingValue || 0);

    var neighborInfluence = Number(neighbors && neighbors.neighborInfluence || 0.5);
    var height = elevation * 0.34 + metricsProfile.ethicalCoherenceScore * 0.28 + neighborInfluence * 0.08;

    if (continent.continentId === "gratitude") {
      height += metricsProfile.receptivityPressure * 0.18 + ridge * 0.06 - gap * 0.10;
    } else if (continent.continentId === "generosity") {
      height += metricsProfile.expansionPressure * 0.22 + ridge * 0.08 - basin * 0.04;
    } else if (continent.continentId === "dependability") {
      height += metricsProfile.continuityPressure * 0.22 + mountain * 0.08 + ridge * 0.06;
    } else if (continent.continentId === "accountability") {
      height += metricsProfile.disciplinePressure * 0.24 + escarpment * 0.12 + ridge * 0.08;
    } else if (continent.continentId === "forgiveness") {
      height += metricsProfile.repairPressure * 0.12 + valley * 0.08 - carving * 0.08;
    } else if (continent.continentId === "humility") {
      height += metricsProfile.restraintPressure * 0.06 + metricsProfile.receptivityPressure * 0.08 - basin * 0.18 - gap * 0.12;
    } else if (continent.continentId === "self-control") {
      height += metricsProfile.restraintPressure * 0.24 + trench * 0.10 + ridge * 0.06 - gap * 0.04;
    } else if (continent.continentId === "patience") {
      height += metricsProfile.timeDepthPressure * 0.18 + shelf * 0.12 + carving * 0.04;
    } else if (continent.continentId === "purity") {
      height += metricsProfile.clarityPressure * 0.26 + summit * 0.12 + mountain * 0.08;
    }

    if (sizeClass.key === "MICRO") height += Math.sin(Number(node.x || 0) * 1.7 + Number(node.y || 0) * 0.9) * 0.025;
    if (sizeClass.key === "FIELD") height += (valley + shelf) * 0.035;
    if (sizeClass.key === "STRUCTURAL") height += (ridge + escarpment + trench) * 0.055;
    if (sizeClass.key === "ANCHOR") height += (summit + mountain + basin * 0.36) * 0.075;

    height = clamp(height, 0.08, 0.96);

    var narrative = "ethical_pressure_height";
    if (height > 0.72) narrative = "high_coherence_rise";
    else if (height > 0.54) narrative = "stable_midland_continuity";
    else if (height > 0.36) narrative = "lowland_transition_or_repair";
    else narrative = "future_fill_depth_or_humility_floor";

    return Object.freeze({
      height: round(height, 4),
      heightNarrative: narrative,
      ethicalMetricProfile: metricsProfile,
      ethicalCoherenceScore: metricsProfile.ethicalCoherenceScore
    });
  }

  function buildEthicalBumpAnchors(nodes) {
    if (!state.ethicalProfiles.length) {
      state.ethicalProfiles = buildNineContinentEthicalProfiles();
    }

    var offsets = [
      { x: -0.24, y: -0.18 },
      { x: 0.28, y: 0.02 },
      { x: 0.02, y: 0.30 }
    ];

    var anchors = [];

    nodes.forEach(function (node, sourceIndex) {
      var neighbor = localNeighborInfluence(node, nodes);

      for (var localIndex = 0; localIndex < 3; localIndex += 1) {
        var offset = offsets[localIndex];
        var point = {
          x: Number(node.x || 0) + offset.x + Math.sin((sourceIndex + localIndex) * 0.73) * 0.045,
          y: clamp(Number(node.y || 0) + offset.y + Math.cos((sourceIndex + localIndex) * 0.61) * 0.045, 0, FIBONACCI_BANDS - 1)
        };

        point.x = (point.x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES;

        var continent = assignContinentForTerrainPoint(point, node);
        var sizeClass = classifyInvariantBumpSize(continent, node, localIndex);
        var heightData = calculateVariantNarrativeHeight(continent, node, sizeClass, neighbor);
        var ll = terrainSeatToLonLat(point.x, point.y);

        anchors.push(Object.freeze({
          bumpId: "AUDRALIA-ETHICAL-BUMP-" + String(sourceIndex).padStart(3, "0") + "-" + String(localIndex),
          sourceSeatIndex: Number(node.seatIndex || node.nodeIndex || sourceIndex),
          sourceNodeId: node.nodeId || node.seatKey || "source-" + sourceIndex,

          x: round(point.x, 4),
          y: round(point.y, 4),
          lon: ll.lon,
          lat: ll.lat,
          point: lonLatPoint(ll.lon, ll.lat),

          continentId: continent.continentId,
          continentName: continent.continentName,
          summitEthic: continent.summitEthic,

          sizeClass: sizeClass.key,
          sizeClassName: sizeClass.name,
          invariantRadius: sizeClass.invariantRadius,
          jurisdiction: sizeClass.jurisdiction,

          height: heightData.height,
          heightNarrative: heightData.heightNarrative,
          ethicalMetricProfile: heightData.ethicalMetricProfile,
          ethicalCoherenceScore: heightData.ethicalCoherenceScore,

          terrainRole: node.primaryTerrainRole || node.terrainClass || "stable_core",
          climateSeed: continent.climateSeed,
          ecologySeed: continent.ecologySeed,
          technologySeed: continent.technologySeed,

          futureFillEligible: Boolean(node.futureFillEligible),
          neighborInfluence: round(neighbor.neighborInfluence, 4),
          neighborCount: neighbor.neighborCount,

          renderAsFinalDot: false,
          renderAsDisplacementAnchor: true,
          carrierMayConsume: true,
          finalVisualPassClaim: false
        }));
      }
    });

    return Object.freeze(anchors);
  }

  function groupBumpsByContinent(bumps) {
    var groups = {};

    state.ethicalProfiles.forEach(function (profile) {
      groups[profile.continentId] = {
        continentId: profile.continentId,
        continentName: profile.continentName,
        summitEthic: profile.summitEthic,
        climateSeed: profile.climateSeed,
        ecologySeed: profile.ecologySeed,
        technologySeed: profile.technologySeed,
        terrainSignature: profile.terrainSignature,
        bumps: [],
        microNodeCount: 0,
        fieldNodeCount: 0,
        structuralNodeCount: 0,
        anchorNodeCount: 0,
        totalBumpAnchorCount: 0,
        averageNarrativeHeight: 0,
        heightVariance: 0,
        ethicalCoherenceScore: 0
      };
    });

    bumps.forEach(function (bump) {
      var group = groups[bump.continentId];
      if (!group) return;

      group.bumps.push(bump);
      group.totalBumpAnchorCount += 1;

      if (bump.sizeClass === "MICRO") group.microNodeCount += 1;
      if (bump.sizeClass === "FIELD") group.fieldNodeCount += 1;
      if (bump.sizeClass === "STRUCTURAL") group.structuralNodeCount += 1;
      if (bump.sizeClass === "ANCHOR") group.anchorNodeCount += 1;

      group.averageNarrativeHeight += Number(bump.height || 0);
      group.ethicalCoherenceScore += Number(bump.ethicalCoherenceScore || 0);
    });

    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var count = group.totalBumpAnchorCount || 1;
      group.averageNarrativeHeight = round(group.averageNarrativeHeight / count, 4);
      group.ethicalCoherenceScore = round(group.ethicalCoherenceScore / count, 4);

      var variance = 0;
      group.bumps.forEach(function (bump) {
        variance += Math.pow(Number(bump.height || 0) - group.averageNarrativeHeight, 2);
      });

      group.heightVariance = round(Math.sqrt(variance / count), 4);
      group.bumps = Object.freeze(group.bumps);
      Object.freeze(group);
    });

    return Object.freeze(groups);
  }

  function buildContinentDisplacementFields(bumps) {
    var groups = groupBumpsByContinent(bumps);
    var fields = [];

    Object.keys(groups).forEach(function (key) {
      var group = groups[key];

      fields.push(Object.freeze({
        continentId: group.continentId,
        continentName: group.continentName,
        summitEthic: group.summitEthic,
        climateSeed: group.climateSeed,
        ecologySeed: group.ecologySeed,
        technologySeed: group.technologySeed,
        terrainSignature: group.terrainSignature,
        nodeDistributionProfile: {
          microNodeCount: group.microNodeCount,
          fieldNodeCount: group.fieldNodeCount,
          structuralNodeCount: group.structuralNodeCount,
          anchorNodeCount: group.anchorNodeCount,
          totalBumpAnchorCount: group.totalBumpAnchorCount
        },
        averageNarrativeHeight: group.averageNarrativeHeight,
        heightVariance: group.heightVariance,
        ethicalCoherenceScore: group.ethicalCoherenceScore,
        finalVisualPassClaim: false
      }));
    });

    state.continentBumpGroups = groups;
    return Object.freeze(fields);
  }

  function buildDynamicSurfaceRows() {
    var rows = [];

    for (var i = 0; i < LAND_FIELD_ROWS; i += 1) {
      var sourceBand = (i / (LAND_FIELD_ROWS - 1)) * (FIBONACCI_BANDS - 1);
      var normalized = sourceBand / (FIBONACCI_BANDS - 1);
      var latitude = 80 - normalized * 160;
      var latitudeCompression = 0.62 + Math.cos((normalized - 0.5) * Math.PI) * 0.42;

      rows.push(Object.freeze({
        rowId: "LAND-BODY-ROW-" + String(i).padStart(2, "0"),
        sourceBand: round(sourceBand, 4),
        latitude: round(latitude, 3),
        rowCompression: round(clamp(latitudeCompression, 0.45, 1.18), 4),
        rowOffset: round(((i % 2) * 0.5 + Math.sin(i * 1.618) * 0.22) % RADIAL_NODES, 4),
        rowWeaveAngle: round((i % 4 - 1.5) * 0.08, 4)
      }));
    }

    return Object.freeze(rows);
  }

  function weightedBumpSample(xf, yf) {
    if (!state.ethicalBumpFieldReady) {
      return {
        landPresence: 0,
        height: 0.5,
        ethicalCoherenceScore: 0,
        continentId: "unassigned",
        continentName: "Unassigned",
        color: { r: 110, g: 125, b: 88 },
        boundaryPressure: 0,
        futureFillPressure: 0,
        sizeClassInfluence: "FIELD"
      };
    }

    var total = 0;
    var height = 0;
    var coherence = 0;
    var futureFill = 0;
    var continentScores = {};
    var classScores = {};
    var highestContribution = 0;

    state.ethicalBumpAnchors.forEach(function (bump) {
      var d = gridDistance(xf, yf, Number(bump.x || 0), Number(bump.y || 0));
      if (d > 3.65) return;

      var radius = Number(bump.invariantRadius || 1);
      var heightValue = Number(bump.height || 0.5);
      var weight = Math.pow(radius, 0.92) / Math.pow(0.46 + d, 2.28);

      weight *= 0.86 + Number(bump.ethicalCoherenceScore || 0.5) * 0.32;
      weight *= 0.90 + heightValue * 0.18;

      total += weight;
      highestContribution = Math.max(highestContribution, weight);
      height += heightValue * weight;
      coherence += Number(bump.ethicalCoherenceScore || 0.5) * weight;
      futureFill += (bump.futureFillEligible ? 1 : 0) * weight;

      continentScores[bump.continentId] = (continentScores[bump.continentId] || 0) + weight;
      classScores[bump.sizeClass] = (classScores[bump.sizeClass] || 0) + weight;
    });

    if (!total) {
      return {
        landPresence: 0,
        height: 0.5,
        ethicalCoherenceScore: 0,
        continentId: "unassigned",
        continentName: "Unassigned",
        color: { r: 110, g: 125, b: 88 },
        boundaryPressure: 0,
        futureFillPressure: 0,
        sizeClassInfluence: "FIELD"
      };
    }

    var continentId = maxKey(continentScores);
    var sizeClass = maxKey(classScores);
    var profile = findProfile(continentId);
    var sorted = Object.keys(continentScores).map(function (key) {
      return continentScores[key];
    }).sort(function (a, b) { return b - a; });

    var first = sorted[0] || 0;
    var second = sorted[1] || 0;
    var boundaryPressure = first ? clamp(second / first, 0, 1) : 0;

    return {
      landPresence: round(clamp(total / 1.88, 0, 1), 4),
      height: round(height / total, 4),
      ethicalCoherenceScore: round(coherence / total, 4),
      continentId: continentId,
      continentName: profile ? profile.continentName : "Unassigned",
      color: profile ? profile.color : { r: 110, g: 125, b: 88 },
      boundaryPressure: round(boundaryPressure, 4),
      futureFillPressure: round(futureFill / total, 4),
      sizeClassInfluence: sizeClass || "FIELD",
      highestContribution: round(highestContribution, 4)
    };
  }

  function buildLandInfluenceField() {
    var samples = [];
    var index = [];

    for (var y = 0; y < LAND_FIELD_ROWS; y += 1) {
      index[y] = [];

      for (var x = 0; x < LAND_FIELD_COLS; x += 1) {
        var gx = (x / LAND_FIELD_COLS) * RADIAL_NODES;
        var gy = (y / (LAND_FIELD_ROWS - 1)) * (FIBONACCI_BANDS - 1);
        var sample = weightedBumpSample(gx, gy);
        var ll = landFieldToLonLat(x + 0.5, y + 0.5);

        var landPresence = clamp(
          sample.landPresence * (0.94 - sample.boundaryPressure * 0.16) +
          sample.ethicalCoherenceScore * 0.13,
          0,
          1
        );

        var item = {
          sampleId: "LAND-BODY-SAMPLE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(3, "0"),
          x: x,
          y: y,
          gridX: round(gx, 4),
          gridY: round(gy, 4),
          lon: ll.lon,
          lat: ll.lat,
          point: lonLatPoint(ll.lon, ll.lat),

          continentId: sample.continentId,
          continentName: sample.continentName,
          color: sample.color,
          sizeClassInfluence: sample.sizeClassInfluence,

          landPresence: round(landPresence, 4),
          height: sample.height,
          slope: 0,
          relief: 0,
          ethicalCoherenceScore: sample.ethicalCoherenceScore,
          boundaryPressure: sample.boundaryPressure,
          futureFillPressure: sample.futureFillPressure,

          nodesHiddenFromSurface: true,
          existingNodesUsedAsLandMappingScaffold: true,
          surfaceRenderIsDerived: true,
          renderAsFinalDot: false,
          finalVisualPassClaim: false
        };

        samples.push(item);
        index[y][x] = item;
      }
    }

    for (var yy = 0; yy < LAND_FIELD_ROWS; yy += 1) {
      for (var xx = 0; xx < LAND_FIELD_COLS; xx += 1) {
        var current = index[yy][xx];
        var left = index[yy][(xx - 1 + LAND_FIELD_COLS) % LAND_FIELD_COLS];
        var right = index[yy][(xx + 1) % LAND_FIELD_COLS];
        var up = index[Math.max(0, yy - 1)][xx];
        var down = index[Math.min(LAND_FIELD_ROWS - 1, yy + 1)][xx];

        var dx = Number(right.height || 0) - Number(left.height || 0);
        var dy = Number(down.height || 0) - Number(up.height || 0);
        current.slope = round(clamp(Math.sqrt(dx * dx + dy * dy), 0, 1), 4);
        current.relief = round(clamp(current.slope * 0.86 + Number(current.height || 0.5) * 0.14, 0, 1), 4);
      }
    }

    state.landFieldIndex = index;
    return Object.freeze(samples);
  }

  function sampleNearestLandField(x, y) {
    if (!state.landFieldIndex.length) return null;

    var xx = ((Math.round(x) % LAND_FIELD_COLS) + LAND_FIELD_COLS) % LAND_FIELD_COLS;
    var yy = clamp(Math.round(y), 0, LAND_FIELD_ROWS - 1);

    return state.landFieldIndex[yy] && state.landFieldIndex[yy][xx] ? state.landFieldIndex[yy][xx] : null;
  }

  function sampleLandPresenceAt(x, y) {
    var sample = sampleNearestLandField(x, y);
    return sample ? sample.landPresence : 0;
  }

  function sampleContinentInfluenceAt(x, y) {
    var sample = sampleNearestLandField(x, y);
    return sample ? {
      continentId: sample.continentId,
      continentName: sample.continentName,
      color: sample.color,
      boundaryPressure: sample.boundaryPressure
    } : null;
  }

  function sampleHeightDisplacementAt(x, y) {
    var sample = sampleNearestLandField(x, y);
    return sample ? sample.height : 0.5;
  }

  function sampleSlopeReliefAt(x, y) {
    var sample = sampleNearestLandField(x, y);
    return sample ? {
      slope: sample.slope,
      relief: sample.relief,
      futureFillPressure: sample.futureFillPressure
    } : { slope: 0, relief: 0, futureFillPressure: 0 };
  }

  function buildVisibleLandBodyPacket() {
    var samples = state.landInfluenceField || [];
    var continentCounts = {};

    samples.forEach(function (sample) {
      if (!continentCounts[sample.continentId]) continentCounts[sample.continentId] = 0;
      if (sample.landPresence > 0.12) continentCounts[sample.continentId] += 1;
    });

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      packetType: "runtime_derived_visible_land_body_packet_with_packet_handoff_draw",
      sourceSeatCount: SOURCE_SEAT_COUNT,
      ethicalBumpAnchorCount: state.ethicalBumpAnchors.length,
      fieldSampleCount: samples.length,
      landFieldCols: LAND_FIELD_COLS,
      landFieldRows: LAND_FIELD_ROWS,
      continentCounts: continentCounts,
      terrainAtlasRemainsSource: true,
      existingNodesUsedAsLandMappingScaffold: true,
      nodesHiddenFromSurface: true,
      surfaceRenderIsDerived: true,
      carrierInventsTerrain: false,
      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,
      carrierConsumesReliefPacket: state.carrierConsumesReliefPacket,
      carrierConsumesLandformPacket: state.carrierConsumesLandformPacket,
      definitionFieldReady: state.definitionFieldReady,
      definitionNodePointFallbackActive: state.definitionNodePointFallbackActive,
      raw256VisibleOnlyInLattice: true,
      finalVisualPassClaim: false
    });
  }

  function rebuildDerivedFields() {
    var nodes = dryNodes();

    state.ethicalProfiles = buildNineContinentEthicalProfiles();

    if (!state.dryTerrainValidated || !nodes.length) {
      state.ethicalBumpAnchors = [];
      state.continentBumpGroups = {};
      state.continentDisplacementFields = [];
      state.ethicalBumpFieldReady = false;
      state.dynamicSurfaceRows = [];
      state.landInfluenceField = [];
      state.landFieldIndex = [];
      state.visibleLandBodyPacket = null;
      state.landBodyCompositorReady = false;
      rebuildDefinitionNodePointIndex();
      return;
    }

    state.ethicalBumpAnchors = buildEthicalBumpAnchors(nodes);
    state.continentBumpGroups = groupBumpsByContinent(state.ethicalBumpAnchors);
    state.continentDisplacementFields = buildContinentDisplacementFields(state.ethicalBumpAnchors);
    state.ethicalBumpFieldReady = state.ethicalBumpAnchors.length >= MIN_BUMP_ANCHOR_COUNT;

    state.dynamicSurfaceRows = buildDynamicSurfaceRows();
    state.landInfluenceField = buildLandInfluenceField();
    state.visibleLandBodyPacket = buildVisibleLandBodyPacket();
    state.landBodyCompositorReady = Boolean(state.visibleLandBodyPacket && state.landInfluenceField.length);

    rebuildDefinitionNodePointIndex();
  }

  function rebuildDefinitionField() {
    var relief = state.reliefValidated ? state.reliefCarrierPacket : null;
    var landform = state.landformValidated ? state.landformCarrierPacket : null;

    state.reliefSampleByNodeId = {};

    if (relief && Array.isArray(relief.reliefSamples)) {
      relief.reliefSamples.forEach(function (sample) {
        if (sample && sample.parentNodeId) {
          state.reliefSampleByNodeId[sample.parentNodeId] = sample;
        }
      });
    }

    state.definitionField = {
      reliefSamples: relief && Array.isArray(relief.reliefSamples) ? relief.reliefSamples : [],
      ridgeReliefExpressions: relief && Array.isArray(relief.ridgeReliefExpressions) ? relief.ridgeReliefExpressions : [],
      basinDepthExpressions: relief && Array.isArray(relief.basinDepthExpressions) ? relief.basinDepthExpressions : [],
      valleyFlowExpressions: relief && Array.isArray(relief.valleyFlowExpressions) ? relief.valleyFlowExpressions : [],
      summitReliefExpressions: relief && Array.isArray(relief.summitReliefExpressions) ? relief.summitReliefExpressions : [],
      highlandReliefExpressions: relief && Array.isArray(relief.highlandReliefExpressions) ? relief.highlandReliefExpressions : [],
      lowlandReliefExpressions: relief && Array.isArray(relief.lowlandReliefExpressions) ? relief.lowlandReliefExpressions : [],
      shelfReliefExpressions: relief && Array.isArray(relief.shelfReliefExpressions) ? relief.shelfReliefExpressions : [],
      futureFillReliefExpressions: relief && Array.isArray(relief.futureFillReliefExpressions) ? relief.futureFillReliefExpressions : [],

      mountainRanges: landform && Array.isArray(landform.mountainRanges) ? landform.mountainRanges : [],
      landmarks: landform && Array.isArray(landform.landmarks) ? landform.landmarks : [],
      plateaus: landform && Array.isArray(landform.plateaus) ? landform.plateaus : [],
      landformBasins: landform && Array.isArray(landform.landformBasins) ? landform.landformBasins : [],
      cliffSystems: landform && Array.isArray(landform.cliffSystems) ? landform.cliffSystems : [],
      continentLandformProfiles: landform && Array.isArray(landform.continentLandformProfiles) ? landform.continentLandformProfiles : []
    };

    state.definitionConsumptionReady = Boolean(state.reliefValidated || state.landformValidated);
    state.definitionFieldReady = Boolean(
      state.definitionField &&
      (
        state.definitionField.ridgeReliefExpressions.length ||
        state.definitionField.basinDepthExpressions.length ||
        state.definitionField.mountainRanges.length ||
        state.definitionField.cliffSystems.length ||
        state.definitionField.plateaus.length ||
        state.definitionField.landmarks.length
      )
    );

    rebuildDefinitionNodePointIndex();

    return state.definitionFieldReady;
  }

  function indexDefinitionPoint(index, key, point) {
    if (!key || !point) return;
    index[String(key)] = point;
  }

  function nodePointFromReliefSample(sample) {
    if (!sample) return null;

    var x = Number(sample.x || 0);
    var y = Number(sample.y || 0);
    var ll = terrainSeatToLonLat(x, y);

    return {
      source: "relief-sample",
      sourcePriority: 1,
      nodeId: sample.parentNodeId || sample.nodeId || sample.seatKey || "",
      x: round(x, 4),
      y: round(y, 4),
      lon: round(ll.lon, 4),
      lat: round(ll.lat, 4),
      point: lonLatPoint(ll.lon, ll.lat),
      continentId: sample.continentId || "unassigned",
      continentName: sample.continentName || "Unassigned",
      elevation: Number(sample.elevation || 0.5),
      reliefIntensity: Number(sample.reliefIntensity || 0),
      ridgeHighlight: Number(sample.ridgeHighlight || 0),
      basinShadow: Number(sample.basinShadow || 0),
      summitEmphasis: Number(sample.summitEmphasis || 0),
      futureFillPressure: Number(sample.futureFillPressure || 0),
      carrierVisualRole: sample.carrierVisualRole || "relief"
    };
  }

  function nodePointFromDryNode(node, index) {
    if (!node) return null;

    var x = Number(node.x || node.radial || (index % RADIAL_NODES));
    var y = Number(node.y || node.band || Math.floor(index / RADIAL_NODES));
    var ll = terrainSeatToLonLat(x, y);

    return {
      source: "dry-terrain-node",
      sourcePriority: 2,
      nodeId: node.nodeId || node.seatKey || "source-" + index,
      x: round(x, 4),
      y: round(y, 4),
      lon: round(ll.lon, 4),
      lat: round(ll.lat, 4),
      point: lonLatPoint(ll.lon, ll.lat),
      continentId: node.regionSeed || node.continentId || "unassigned",
      continentName: node.regionName || node.continentName || "Unassigned",
      elevation: Number(node.dryElevation || node.elevation || 0.5),
      reliefIntensity: Number(node.ridgePressure || node.mountainPressure || node.summitPressure || node.basinPressure || 0),
      ridgeHighlight: Number(node.ridgePressure || node.mountainPressure || 0),
      basinShadow: Number(node.basinPressure || node.gapPressure || 0),
      summitEmphasis: Number(node.summitPressure || 0),
      futureFillPressure: Number(node.gapPressure || node.basinPressure || 0),
      carrierVisualRole: node.primaryTerrainRole || node.terrainClass || "dry-terrain"
    };
  }

  function nodePointFromBumpAnchor(anchor) {
    if (!anchor) return null;

    return {
      source: "ethical-bump-anchor",
      sourcePriority: 3,
      nodeId: anchor.sourceNodeId || anchor.bumpId,
      x: Number(anchor.x || 0),
      y: Number(anchor.y || 0),
      lon: Number(anchor.lon || 0),
      lat: Number(anchor.lat || 0),
      point: anchor.point || lonLatPoint(anchor.lon || 0, anchor.lat || 0),
      continentId: anchor.continentId || "unassigned",
      continentName: anchor.continentName || "Unassigned",
      elevation: Number(anchor.height || 0.5),
      reliefIntensity: Number(anchor.height || 0),
      ridgeHighlight: anchor.sizeClass === "STRUCTURAL" || anchor.sizeClass === "ANCHOR" ? Number(anchor.height || 0) : 0,
      basinShadow: anchor.height < 0.42 ? 1 - Number(anchor.height || 0.5) : 0,
      summitEmphasis: anchor.sizeClass === "ANCHOR" ? Number(anchor.height || 0) : 0,
      futureFillPressure: anchor.futureFillEligible ? 1 : 0,
      carrierVisualRole: anchor.terrainRole || "bump-anchor"
    };
  }

  function nodePointFromLandInfluenceSample(sample) {
    if (!sample) return null;

    return {
      source: "land-influence-sample",
      sourcePriority: 4,
      nodeId: sample.sampleId,
      x: Number(sample.gridX || sample.x || 0),
      y: Number(sample.gridY || sample.y || 0),
      lon: Number(sample.lon || 0),
      lat: Number(sample.lat || 0),
      point: sample.point || lonLatPoint(sample.lon || 0, sample.lat || 0),
      continentId: sample.continentId || "unassigned",
      continentName: sample.continentName || "Unassigned",
      elevation: Number(sample.height || 0.5),
      reliefIntensity: Number(sample.relief || 0),
      ridgeHighlight: Number(sample.relief || 0),
      basinShadow: Number(sample.futureFillPressure || 0),
      summitEmphasis: Number(sample.height > 0.72 ? sample.height : 0),
      futureFillPressure: Number(sample.futureFillPressure || 0),
      carrierVisualRole: sample.sizeClassInfluence || "land-field"
    };
  }

  function rebuildDefinitionNodePointIndex() {
    var index = {};

    if (state.reliefValidated && state.reliefCarrierPacket && Array.isArray(state.reliefCarrierPacket.reliefSamples)) {
      state.reliefCarrierPacket.reliefSamples.forEach(function (sample, i) {
        var point = nodePointFromReliefSample(sample);
        if (!point) return;

        indexDefinitionPoint(index, sample.parentNodeId, point);
        indexDefinitionPoint(index, sample.nodeId, point);
        indexDefinitionPoint(index, sample.seatKey, point);
        indexDefinitionPoint(index, "relief-" + i, point);
        indexDefinitionPoint(index, "source-" + i, point);
      });
    }

    dryNodes().forEach(function (node, i) {
      var point = nodePointFromDryNode(node, i);
      if (!point) return;

      indexDefinitionPoint(index, node.nodeId, point);
      indexDefinitionPoint(index, node.seatKey, point);
      indexDefinitionPoint(index, node.id, point);
      indexDefinitionPoint(index, node.nodeIndex, point);
      indexDefinitionPoint(index, node.seatIndex, point);
      indexDefinitionPoint(index, "node-" + i, point);
      indexDefinitionPoint(index, "source-" + i, point);
      indexDefinitionPoint(index, String(i), point);
    });

    state.ethicalBumpAnchors.forEach(function (anchor) {
      var point = nodePointFromBumpAnchor(anchor);
      if (!point) return;

      indexDefinitionPoint(index, anchor.sourceNodeId, point);
      indexDefinitionPoint(index, anchor.bumpId, point);
      indexDefinitionPoint(index, "source-" + anchor.sourceSeatIndex, point);
      indexDefinitionPoint(index, anchor.sourceSeatIndex, point);
    });

    state.landInfluenceField.forEach(function (sample) {
      var point = nodePointFromLandInfluenceSample(sample);
      if (!point) return;

      indexDefinitionPoint(index, sample.sampleId, point);
      indexDefinitionPoint(index, "land-" + sample.y + "-" + sample.x, point);
    });

    state.definitionNodePointById = index;
    state.definitionNodePointFallbackActive = true;

    return index;
  }

  function numericTokenFromNodeId(nodeId) {
    var match = String(nodeId || "").match(/(\d+)(?!.*\d)/);
    if (!match) return null;

    var value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  }

  function fallbackRenderablePointFromNumericNodeId(nodeId) {
    var value = numericTokenFromNodeId(nodeId);
    if (value === null) return null;

    var nodes = dryNodes();
    if (nodes.length) {
      var dryIndex = ((value % nodes.length) + nodes.length) % nodes.length;
      var dryPoint = nodePointFromDryNode(nodes[dryIndex], dryIndex);
      if (dryPoint) {
        dryPoint.source = "fallback-dry-node";
        return dryPoint;
      }
    }

    if (state.landInfluenceField.length) {
      var fieldIndex = ((value % state.landInfluenceField.length) + state.landInfluenceField.length) % state.landInfluenceField.length;
      var fieldPoint = nodePointFromLandInfluenceSample(state.landInfluenceField[fieldIndex]);
      if (fieldPoint) {
        fieldPoint.source = "fallback-land-influence";
        return fieldPoint;
      }
    }

    return null;
  }

  function nodeIdToRenderablePoint(nodeId) {
    if (nodeId === undefined || nodeId === null) return null;

    var key = String(nodeId);
    var exact = state.definitionNodePointById[key];

    if (exact) {
      state.definitionNodePointExactHits += 1;
      return exact;
    }

    var fallback = fallbackRenderablePointFromNumericNodeId(key);

    if (fallback) {
      state.definitionNodePointFallbackHits += 1;
      return fallback;
    }

    return null;
  }

  function nodeIdsToRenderablePoints(nodeIds, limit) {
    var points = [];

    (Array.isArray(nodeIds) ? nodeIds : []).slice(0, limit || 24).forEach(function (nodeId) {
      var point = nodeIdToRenderablePoint(nodeId);
      if (point) points.push(point);
    });

    return points;
  }

  function getEthicalBumpFieldReceipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      nineContinentEthicalFieldActive: state.ethicalBumpFieldReady,
      nineContinentCount: state.ethicalProfiles.length,
      bumpAnchorCount: state.ethicalBumpAnchors.length,
      minimumBumpAnchorCount: MIN_BUMP_ANCHOR_COUNT,
      fourInvariantSizeClassesActive: true,
      sizeEqualsHeight: false,
      heightVariantByEthicalMetric: true,
      climateSeedOnly: true,
      ecologySeedOnly: true,
      technologySeedOnly: true,
      raw256VisibleOnlyInLattice: true,
      hydrationHeld: true,
      carrierInventsTerrain: false,
      finalVisualPassClaim: false
    };
  }

  function getLandBodyCompositorReceipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      landBodyCompositorActive: state.landBodyCompositorReady,
      existingNodesUsedAsLandMappingScaffold: true,
      nodesHiddenFromSurface: true,
      visibleLandBodyPacketReady: Boolean(state.visibleLandBodyPacket),
      fieldSampleCount: state.landInfluenceField.length,
      landFieldRows: LAND_FIELD_ROWS,
      landFieldCols: LAND_FIELD_COLS,
      nineContinentFieldActive: state.ethicalBumpFieldReady,
      surfaceRenderIsDerived: true,
      raw256VisibleOnlyInLattice: true,
      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,
      carrierInventsTerrain: false,
      hydrationHeld: true,
      finalVisualPassClaim: false
    };
  }

  function getDefinitionConsumptionReceipt() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      reliefExpressionDetected: state.reliefDetected,
      reliefExpressionValidated: state.reliefValidated,
      reliefFailureReason: state.reliefFailureReason,
      landformSystemsDetected: state.landformDetected,
      landformSystemsValidated: state.landformValidated,
      landformFailureReason: state.landformFailureReason,
      carrierConsumesReliefPacket: state.carrierConsumesReliefPacket,
      carrierConsumesLandformPacket: state.carrierConsumesLandformPacket,
      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,
      definitionConsumptionReady: state.definitionConsumptionReady,
      definitionFieldReady: state.definitionFieldReady,
      definitionNodePointFallbackActive: state.definitionNodePointFallbackActive,
      definitionNodePointIndexCount: Object.keys(state.definitionNodePointById || {}).length,
      definitionNodePointExactHits: state.definitionNodePointExactHits,
      definitionNodePointFallbackHits: state.definitionNodePointFallbackHits,
      carrierDoesNotOwnTerrainTruth: true,
      carrierDoesNotOwnElevationTruth: true,
      carrierDoesNotOwnReliefTruth: true,
      carrierDoesNotOwnLandformTruth: true,
      carrierDoesNotMutateUpstreamMeaning: true,
      carrierShouldNotOwnElevationTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnLandformTruth: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
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

  function drawPlanetShadowBody() {
    var ctx = state.ctx;
    var m = metrics();

    var base = ctx.createRadialGradient(m.cx - m.r * 0.28, m.cy - m.r * 0.38, 0, m.cx, m.cy, m.r * 1.18);
    base.addColorStop(0.00, "rgba(60,76,84,0.98)");
    base.addColorStop(0.20, "rgba(35,50,61,0.98)");
    base.addColorStop(0.48, "rgba(11,24,42,1)");
    base.addColorStop(0.78, "rgba(4,11,24,1)");
    base.addColorStop(1.00, "rgba(1,5,14,1)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r, 0, TAU);
    ctx.fillStyle = base;
    ctx.fill();

    ctx.save();
    clipSphere();

    var directional = ctx.createLinearGradient(m.cx - m.r, m.cy - m.r, m.cx + m.r, m.cy + m.r);
    directional.addColorStop(0.00, "rgba(255,255,255,0.052)");
    directional.addColorStop(0.34, "rgba(255,255,255,0.014)");
    directional.addColorStop(0.70, "rgba(0,0,0,0.28)");
    directional.addColorStop(1.00, "rgba(0,0,0,0.56)");
    ctx.fillStyle = directional;
    ctx.fillRect(m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);

    ctx.restore();
  }

  function drawHydrosphereMemoryUnderlayer() {
    var ctx = state.ctx;
    var m = metrics();
    var reduced = state.definitionConsumptionReady ? 0.62 : 1;

    ctx.save();
    clipSphere();

    var memory = ctx.createRadialGradient(m.cx - m.r * 0.34, m.cy - m.r * 0.28, 0, m.cx, m.cy, m.r * 1.08);
    memory.addColorStop(0.00, "rgba(105,184,212," + (0.19 * reduced).toFixed(3) + ")");
    memory.addColorStop(0.28, "rgba(37,101,148," + (0.145 * reduced).toFixed(3) + ")");
    memory.addColorStop(0.58, "rgba(8,42,91," + (0.115 * reduced).toFixed(3) + ")");
    memory.addColorStop(1.00, "rgba(0,12,38," + (0.155 * reduced).toFixed(3) + ")");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 0.995, 0, TAU);
    ctx.fillStyle = memory;
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphereRim() {
    var ctx = state.ctx;
    var m = metrics();
    var wash = state.definitionConsumptionReady ? 0.78 : 1;

    var rim = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.93, m.cx, m.cy, m.r * 1.105);
    rim.addColorStop(0.00, "rgba(141,216,255,0.000)");
    rim.addColorStop(0.62, "rgba(141,216,255," + (0.018 * wash).toFixed(3) + ")");
    rim.addColorStop(0.84, "rgba(141,216,255," + (0.115 * wash).toFixed(3) + ")");
    rim.addColorStop(1.00, "rgba(141,216,255,0.000)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.11, 0, TAU);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,0.20)";
    ctx.lineWidth = Math.max(0.75, state.dpr * 0.72);
    ctx.stroke();
  }

  function mixColor(color, target, amount) {
    return {
      r: Math.floor(color.r * (1 - amount) + target.r * amount),
      g: Math.floor(color.g * (1 - amount) + target.g * amount),
      b: Math.floor(color.b * (1 - amount) + target.b * amount)
    };
  }

  function rgba(rgb, alpha) {
    return "rgba(" + Math.floor(rgb.r) + "," + Math.floor(rgb.g) + "," + Math.floor(rgb.b) + "," + alpha.toFixed(3) + ")";
  }

  function landSampleColor(sample, pass) {
    var base = sample.color || { r: 112, g: 130, b: 88 };
    var height = Number(sample.height || 0.5);
    var relief = Number(sample.relief || 0);
    var futureFill = Number(sample.futureFillPressure || 0);
    var boundary = Number(sample.boundaryPressure || 0);

    var high = { r: 210, g: 183, b: 121 };
    var low = { r: 42, g: 61, b: 48 };
    var edge = { r: 92, g: 74, b: 54 };
    var color = base;

    color = mixColor(color, height > 0.58 ? high : low, height > 0.58 ? (height - 0.58) * 0.56 : (0.58 - height) * 0.42);
    color = mixColor(color, edge, boundary * 0.24);
    color = mixColor(color, { r: 16, g: 26, b: 30 }, futureFill * 0.28);

    if (pass === "relief") {
      color = mixColor(color, high, clamp(relief * 0.56, 0, 0.42));
    }

    return color;
  }

  function drawLandBlob(sample, mode, pass) {
    var ctx = state.ctx;
    var p = project(sample.point);

    if (!p.front) return;

    var m = metrics();
    var presence = Number(sample.landPresence || 0);
    if (presence <= 0.030) return;

    var height = Number(sample.height || 0.5);
    var slope = Number(sample.slope || 0);
    var boundary = Number(sample.boundaryPressure || 0);
    var futureFill = Number(sample.futureFillPressure || 0);
    var relief = Number(sample.relief || 0);

    var color = landSampleColor(sample, pass);
    var definitionTighten = state.definitionConsumptionReady ? 0.84 : 1;
    var baseRadius = m.r * (pass === "under" ? 0.054 : pass === "relief" ? 0.024 : 0.041) * definitionTighten;
    var radius = Math.max(4.2, baseRadius * p.scale * (0.86 + presence * 0.38 + height * 0.12));
    var alphaBase = mode === "body" ? 0.092 : mode === "sixth-sense" ? 0.235 : 0.295;
    var alpha = clamp(alphaBase * (0.56 + presence * 0.74 + height * 0.18), 0.030, 0.52);

    if (pass === "under") alpha *= 0.40;
    if (pass === "relief") alpha *= clamp(0.34 + relief * 1.55 + slope * 1.28 + boundary * 0.34, 0.18, 0.86);

    var gradient = ctx.createRadialGradient(
      p.x - radius * 0.22,
      p.y - radius * 0.18,
      radius * 0.04,
      p.x,
      p.y,
      radius
    );

    if (futureFill > 0.38 && pass !== "relief") {
      gradient.addColorStop(0.00, rgba(color, alpha * 0.84));
      gradient.addColorStop(0.42, "rgba(17,28,30," + clamp(alpha * 0.96, 0, 0.40).toFixed(3) + ")");
      gradient.addColorStop(1.00, "rgba(17,28,30,0.000)");
    } else {
      gradient.addColorStop(0.00, rgba(color, alpha));
      gradient.addColorStop(0.50, rgba(color, alpha * (0.44 + boundary * 0.12)));
      gradient.addColorStop(1.00, rgba(color, 0.000));
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawContinuousLandBodySurface(mode) {
    if (!state.landBodyCompositorReady) return;

    var samples = state.landInfluenceField;

    state.ctx.save();
    clipSphere();

    for (var i = 0; i < samples.length; i += 1) {
      drawLandBlob(samples[i], mode, "under");
    }

    for (var j = 0; j < samples.length; j += 1) {
      drawLandBlob(samples[j], mode, "main");
    }

    if (mode === "surface" || mode === "sixth-sense") {
      for (var k = 0; k < samples.length; k += 1) {
        var sample = samples[k];
        if (sample.relief > 0.15 || sample.height > 0.60 || sample.boundaryPressure > 0.44) {
          drawLandBlob(sample, mode, "relief");
        }
      }
    }

    state.ctx.restore();
  }

  function projectedRenderablePoint(renderablePoint) {
    return renderablePoint && renderablePoint.point ? project(renderablePoint.point) : null;
  }

  function drawDefinitionNode(renderablePoint, alpha, radiusScale, rgb, stroke) {
    if (!renderablePoint) return;

    var p = projectedRenderablePoint(renderablePoint);
    if (!p || !p.front) return;

    var ctx = state.ctx;
    var m = metrics();
    var intensity = clamp(
      Number(renderablePoint.reliefIntensity || 0) +
      Number(renderablePoint.ridgeHighlight || 0) * 0.42 +
      Number(renderablePoint.basinShadow || 0) * 0.36 +
      Number(renderablePoint.summitEmphasis || 0) * 0.30,
      0,
      1.35
    );

    var radius = Math.max(0.9, m.r * radiusScale * p.scale * (0.72 + intensity * 0.42));

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);

    if (stroke) {
      ctx.strokeStyle = rgba(rgb, alpha);
      ctx.lineWidth = Math.max(0.55, state.dpr * radiusScale * 40);
      ctx.stroke();
    } else {
      ctx.fillStyle = rgba(rgb, alpha);
      ctx.fill();
    }
  }

  function drawDefinitionLineFromNodeIds(nodeIds, alpha, widthScale, rgb, maxNodes) {
    if (!Array.isArray(nodeIds) || nodeIds.length < 2) return;

    var ctx = state.ctx;
    var m = metrics();
    var renderablePoints = nodeIdsToRenderablePoints(nodeIds, maxNodes || 16);
    var points = renderablePoints.map(projectedRenderablePoint).filter(function (p) {
      return p && p.front;
    });

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; i += 1) {
      var prev = points[i - 1];
      var next = points[i];
      var dx = Math.abs(next.x - prev.x);
      var dy = Math.abs(next.y - prev.y);

      if (dx > m.r * 0.42 || dy > m.r * 0.42) {
        ctx.moveTo(next.x, next.y);
      } else {
        ctx.lineTo(next.x, next.y);
      }
    }

    ctx.strokeStyle = rgba(rgb, alpha);
    ctx.lineWidth = Math.max(0.65, m.r * widthScale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawRidgeDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField) return;

    var strength = mode === "body" ? 0.20 : mode === "surface" ? 0.42 : mode === "sixth-sense" ? 0.52 : 0.28;
    var width = mode === "sixth-sense" ? 0.0035 : 0.0025;

    (state.definitionField.ridgeReliefExpressions || []).forEach(function (ridge) {
      var ridgeAlpha = strength * clamp(Number(ridge.ridgeReliefStrength || ridge.ridgeHighlight || 0.45), 0.22, 1);
      drawDefinitionLineFromNodeIds(ridge.nodeIds, ridgeAlpha, width, { r: 226, g: 197, b: 134 }, 18);
    });
  }

  function drawMountainRangeDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField) return;

    var strength = mode === "body" ? 0.18 : mode === "surface" ? 0.40 : mode === "sixth-sense" ? 0.58 : 0.25;

    (state.definitionField.mountainRanges || []).forEach(function (range) {
      var alpha = strength * clamp(Number(range.watershedAuthority || range.averageReliefIntensity || 0.45), 0.24, 1);
      drawDefinitionLineFromNodeIds(range.nodeIds, alpha, 0.0029, { r: 244, g: 207, b: 131 }, 20);

      (range.summitNodeIds || []).slice(0, 4).forEach(function (nodeId) {
        drawDefinitionNode(nodeIdToRenderablePoint(nodeId), alpha * 0.70, 0.007, { r: 255, g: 226, b: 159 }, false);
      });
    });
  }

  function drawBasinDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField) return;

    var strength = mode === "body" ? 0.13 : mode === "surface" ? 0.32 : mode === "hydration" ? 0.38 : mode === "sixth-sense" ? 0.42 : 0.20;

    (state.definitionField.basinDepthExpressions || []).forEach(function (basin) {
      var alpha = strength * clamp(Number(basin.basinDepthStrength || basin.basinShadow || 0.40), 0.20, 1);

      (basin.nodeIds || []).slice(0, 14).forEach(function (nodeId) {
        drawDefinitionNode(nodeIdToRenderablePoint(nodeId), alpha, 0.010, { r: 28, g: 46, b: 43 }, false);
      });
    });

    (state.definitionField.landformBasins || []).forEach(function (basin) {
      var alpha = strength * clamp(Number(basin.basinDepthStrength || basin.futureFillPriority || 0.36), 0.18, 1);

      (basin.nodeIds || []).slice(0, 10).forEach(function (nodeId) {
        drawDefinitionNode(nodeIdToRenderablePoint(nodeId), alpha * 0.82, 0.011, { r: 48, g: 70, b: 66 }, false);
      });
    });
  }

  function drawCliffDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField) return;

    var strength = mode === "body" ? 0.12 : mode === "surface" ? 0.48 : mode === "sixth-sense" ? 0.58 : 0.18;

    (state.definitionField.cliffSystems || []).forEach(function (cliff) {
      var alpha = strength * clamp(Number(cliff.reliefBreakStrength || 0.45), 0.22, 1);
      drawDefinitionLineFromNodeIds(cliff.nodeIds, alpha, 0.0038, { r: 81, g: 58, b: 42 }, 18);
      drawDefinitionLineFromNodeIds(cliff.nodeIds, alpha * 0.40, 0.0062, { r: 12, g: 18, b: 20 }, 18);
    });
  }

  function drawPlateauDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField) return;

    var strength = mode === "body" ? 0.07 : mode === "surface" ? 0.22 : mode === "sixth-sense" ? 0.30 : 0.12;

    (state.definitionField.plateaus || []).forEach(function (plateau) {
      var alpha = strength * clamp(Number(plateau.surfaceContinuity || plateau.slopeStability || 0.42), 0.22, 1);

      (plateau.nodeIds || []).slice(0, 14).forEach(function (nodeId) {
        drawDefinitionNode(nodeIdToRenderablePoint(nodeId), alpha, 0.0095, { r: 159, g: 139, b: 91 }, false);
      });
    });
  }

  function drawLandmarkDefinitionLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField || mode === "body") return;

    var strength = mode === "surface" ? 0.38 : mode === "sixth-sense" ? 0.72 : 0.18;

    (state.definitionField.landmarks || []).slice(0, 80).forEach(function (landmark) {
      var renderablePoint = nodeIdToRenderablePoint(landmark.anchorNodeId);
      var alpha = strength * clamp(Number(landmark.landmarkStrength || 0.45), 0.22, 1);

      drawDefinitionNode(renderablePoint, alpha, 0.006, { r: 250, g: 231, b: 177 }, false);
      drawDefinitionNode(renderablePoint, alpha * 0.42, 0.014, { r: 250, g: 231, b: 177 }, true);
    });
  }

  function drawFutureFillReliefLayer(mode) {
    if (!state.definitionFieldReady || !state.definitionField || (mode !== "hydration" && mode !== "surface" && mode !== "sixth-sense")) return;

    var strength = mode === "hydration" ? 0.34 : mode === "surface" ? 0.16 : 0.22;

    (state.definitionField.futureFillReliefExpressions || []).forEach(function (fill) {
      var alpha = strength * clamp(Number(fill.futureFillReliefStrength || fill.futureFillPriority || 0.42), 0.20, 1);

      (fill.nodeIds || []).slice(0, 12).forEach(function (nodeId) {
        drawDefinitionNode(nodeIdToRenderablePoint(nodeId), alpha, 0.008, { r: 88, g: 129, b: 143 }, false);
      });
    });
  }

  function drawDefinitionOverlay(mode) {
    if (!state.definitionFieldReady) return;

    state.ctx.save();
    clipSphere();

    drawBasinDefinitionLayer(mode);
    drawPlateauDefinitionLayer(mode);
    drawFutureFillReliefLayer(mode);
    drawRidgeDefinitionLayer(mode);
    drawMountainRangeDefinitionLayer(mode);
    drawCliffDefinitionLayer(mode);
    drawLandmarkDefinitionLayer(mode);

    state.ctx.restore();
  }

  function drawFutureFillDepressions(mode) {
    if (!state.landBodyCompositorReady || mode === "body") return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    state.landInfluenceField.forEach(function (sample) {
      if (sample.futureFillPressure < 0.42) return;

      var p = project(sample.point);
      if (!p.front) return;

      var radius = Math.max(2.2, metrics().r * 0.0125 * p.scale);
      var alpha = mode === "hydration" ? 0.20 : 0.10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = "rgba(100,146,160," + alpha.toFixed(3) + ")";
      ctx.fill();
    });

    ctx.restore();
  }

  function drawSixthSenseNodeScaffold(mode) {
    if (!state.ethicalBumpFieldReady || mode !== "sixth-sense") return;

    var ctx = state.ctx;
    var m = metrics();
    var drawn = 0;

    ctx.save();
    clipSphere();

    state.ethicalBumpAnchors.forEach(function (bump, index) {
      if (index % 7 !== 0 && bump.sizeClass !== "ANCHOR") return;
      if (drawn > 210) return;

      var p = project(bump.point);
      if (!p.front) return;

      var profile = findProfile(bump.continentId);
      var color = profile ? profile.color : { r: 180, g: 210, b: 180 };
      var radius = Math.max(0.9, m.r * 0.0044 * Number(bump.invariantRadius || 1) * p.scale);
      var alpha = bump.sizeClass === "ANCHOR" ? 0.30 : bump.sizeClass === "STRUCTURAL" ? 0.16 : 0.08;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = rgba(color, alpha);
      ctx.fill();

      if (bump.sizeClass === "ANCHOR") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.4, 0, TAU);
        ctx.strokeStyle = rgba(color, 0.12);
        ctx.lineWidth = Math.max(0.4, state.dpr * 0.42);
        ctx.stroke();
      }

      drawn += 1;
    });

    ctx.restore();
  }

  function latticeColor(link, avgZ, layer) {
    var isBack = layer === "back";
    var major = Boolean(link.major);

    if (isBack) {
      return major ? "rgba(141,216,255,0.070)" : "rgba(141,216,255,0.040)";
    }

    if (link.family === "fibonacci") {
      return major ? "rgba(244,207,131,0.62)" : "rgba(244,207,131,0.32)";
    }

    return major
      ? "rgba(244,207,131," + clamp(0.42 + avgZ * 0.14, 0.28, 0.68).toFixed(3) + ")"
      : "rgba(141,216,255," + clamp(0.22 + avgZ * 0.08, 0.14, 0.38).toFixed(3) + ")";
  }

  function drawLatticeLayer(layer) {
    if (!state.latticeReady) return;

    var ctx = state.ctx;

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

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = latticeColor(link, avgZ, layer);
      ctx.lineWidth = link.major ? Math.max(0.60, state.dpr * 0.62) : Math.max(0.34, state.dpr * 0.36);
      ctx.stroke();
    }

    for (var j = 0; j < state.latticeSeats.length; j += 1) {
      var seat = state.latticeSeats[j];
      var p = project(seat);
      var front = p.z >= 0;

      if (layer === "back" && front) continue;
      if (layer === "front" && !front) continue;

      var radius = seat.major ? 1.7 : seat.secondary ? 1.15 : 0.86;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.72, state.dpr * radius * p.scale), 0, TAU);
      ctx.fillStyle = layer === "back"
        ? (seat.major ? "rgba(141,216,255,0.100)" : "rgba(141,216,255,0.055)")
        : (seat.major ? "rgba(244,207,131,0.76)" : "rgba(141,216,255,0.48)");
      ctx.fill();
    }

    ctx.restore();
  }

  function drawReceipt() {
    var ctx = state.ctx;
    var m = metrics();
    var ethicalReceipt = getEthicalBumpFieldReceipt();
    var landReceipt = getLandBodyCompositorReceipt();
    var definitionReceipt = getDefinitionConsumptionReceipt();
    var w = Math.min(state.width * 0.88, m.baseRadius * 2.60);
    var h = Math.min(state.height * 0.58, m.baseRadius * 1.52);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,.80)";
    ctx.strokeStyle = state.definitionFieldReady ? "rgba(167,243,198,.48)" : "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.definitionFieldReady ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText("BASELINE RESTORED · PACKET HANDOFF DRAW", m.cx, y + h * 0.08);

    ctx.font = "900 " + Math.max(8, 9.2 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("DRY " + String(state.dryTerrainValidated).toUpperCase() + " · LAND FIELD " + landReceipt.fieldSampleCount, m.cx, y + h * 0.20);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("RELIEF " + String(definitionReceipt.reliefExpressionValidated).toUpperCase() + " · LANDFORM " + String(definitionReceipt.landformSystemsValidated).toUpperCase(), m.cx, y + h * 0.32);

    ctx.fillStyle = "rgba(244,207,131,.86)";
    ctx.fillText("CARRIER DRAWS PACKET HANDOFFS · DOES NOT OWN TRUTH", m.cx, y + h * 0.44);

    ctx.fillStyle = "rgba(167,243,198,.84)";
    ctx.fillText("NODE FALLBACK " + String(definitionReceipt.definitionNodePointFallbackActive).toUpperCase() + " · INDEX " + definitionReceipt.definitionNodePointIndexCount, m.cx, y + h * 0.56);

    ctx.fillStyle = "rgba(182,245,255,.76)";
    ctx.fillText("RIDGES · MOUNTAINS · BASINS · CLIFFS · PLATEAUS · LANDMARKS", m.cx, y + h * 0.68);

    ctx.fillStyle = "rgba(182,245,255,.76)";
    ctx.fillText("HYDRATION HELD · ACTIVE WATER FALSE", m.cx, y + h * 0.80);

    ctx.fillStyle = "rgba(238,244,255,.72)";
    ctx.fillText("FINAL VISUAL PASS: FALSE · BUMPS " + ethicalReceipt.bumpAnchorCount, m.cx, y + h * 0.92);

    ctx.restore();
  }

  function drawHydrationHeld() {
    if (state.activeLens !== "hydration") return;

    drawFutureFillDepressions("hydration");

    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(182,245,255,0.76)";
    ctx.fillText("HYDRATION HELD · DRY FUTURE-FILL READINESS ONLY", m.cx, m.cy + m.r * 0.74);
    ctx.restore();
  }

  function drawMaterialStackBase() {
    drawPlanetShadowBody();
    drawHydrosphereMemoryUnderlayer();
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

    state.ctx.clearRect(0, 0, state.width, state.height);

    drawMaterialStackBase();

    if (state.activeLens === "lattice") {
      drawLatticeLayer("back");
      drawContinuousLandBodySurface("body");
      drawDefinitionOverlay("lattice");
      drawLatticeLayer("front");
    } else if (state.activeLens === "body") {
      drawContinuousLandBodySurface("body");
      drawDefinitionOverlay("body");
    } else if (state.activeLens === "surface") {
      drawContinuousLandBodySurface("surface");
      drawDefinitionOverlay("surface");
      drawFutureFillDepressions("surface");
    } else if (state.activeLens === "hydration") {
      drawContinuousLandBodySurface("body");
      drawDefinitionOverlay("hydration");
      drawHydrationHeld();
    } else if (state.activeLens === "sixth-sense") {
      drawContinuousLandBodySurface("sixth-sense");
      drawDefinitionOverlay("sixth-sense");
      drawSixthSenseNodeScaffold("sixth-sense");
    } else if (state.activeLens === "receipt") {
      drawContinuousLandBodySurface("body");
      drawDefinitionOverlay("body");
      drawReceipt();
    }

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

  function setLens(value) {
    var lens = String(value || "body");

    if (!LENSES[lens]) lens = "body";

    state.activeLens = lens;

    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaPlanetLens === lens ? "true" : "false");
    });

    var label = document.querySelector("[data-audralia-planet-stage-label]");
    if (label) {
      if (lens === "surface") {
        label.innerHTML = "<strong>Surface</strong> → restored compositor + packet-handoff definition draw";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / dry future-fill readiness only";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → scaffold plus packet-derived handoff structure";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → full-globe raw 256 inspection";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → restored packet-handoff draw proof";
      } else {
        label.innerHTML = "<strong>Body</strong> → restored baseline with fallback node mapping";
      }
    }

    requestRender();
  }

  function bindControls() {
    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaPlanetLens);
      });
    });

    state.stage.addEventListener("pointerdown", function (event) {
      var now = Date.now();

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size === 2) {
        state.pinching = true;
        state.dragging = false;
        state.pinchStartDistance = pointerDistance();
        state.pinchStartZoom = state.zoom;
      } else if (state.pointers.size === 1) {
        if (now - state.lastTap < 320) resetCamera();
        state.lastTap = now;

        state.dragging = true;
        state.pinching = false;
        state.px = event.clientX;
        state.py = event.clientY;
        state.vx = 0;
        state.vy = 0;
      }

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

      event.preventDefault();
      requestRender();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointers.has(event.pointerId)) return;

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size >= 2 && state.pinching) {
        var distance = pointerDistance();
        if (state.pinchStartDistance > 0) {
          setZoom(state.pinchStartZoom * (distance / state.pinchStartDistance));
        }
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

      try { state.stage.releasePointerCapture(event.pointerId); } catch (_error) {}

      if (state.pointers.size < 2) {
        state.pinching = false;
        state.pinchStartDistance = 0;
      }

      if (state.pointers.size === 0) {
        state.dragging = false;
      }

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

  function publishStatus() {
    var ethicalReceipt = getEthicalBumpFieldReceipt();
    var landReceipt = getLandBodyCompositorReceipt();
    var definitionReceipt = getDefinitionConsumptionReceipt();

    var payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      recoveryBaseline: RECOVERY_BASELINE,
      heldNonGoverningContract: STRIPPED_HELD_CONTRACT,
      target: FILE,
      route: ROUTE,

      sameFileRenewal: true,
      shellPreserved: true,
      carrierIsRuntime: true,
      carrierIsDisplayEndpoint: true,
      directCarrierConsumption: true,

      dryRevealedTerrainDetected: state.dryTerrainDetected,
      dryRevealedTerrainApiComplete: state.dryTerrainApiComplete,
      dryRevealedTerrainValidated: state.dryTerrainValidated,
      dryRevealedTerrainFailureReason: state.dryFailureReason,

      carrierConsumes: "dry terrain + relief-expression packet + landform-systems packet as display handoffs",
      carrierConsumesDryTerrainAtlas: state.dryTerrainValidated,
      carrierConsumesReliefPacket: definitionReceipt.carrierConsumesReliefPacket,
      carrierConsumesLandformPacket: definitionReceipt.carrierConsumesLandformPacket,
      carrierConsumesPacketsForDisplayOnly: true,
      carrierDrawsPacketHandoffs: true,

      reliefExpressionDetected: definitionReceipt.reliefExpressionDetected,
      reliefExpressionValidated: definitionReceipt.reliefExpressionValidated,
      reliefFailureReason: definitionReceipt.reliefFailureReason,

      landformSystemsDetected: definitionReceipt.landformSystemsDetected,
      landformSystemsValidated: definitionReceipt.landformSystemsValidated,
      landformFailureReason: definitionReceipt.landformFailureReason,

      definitionConsumptionReady: definitionReceipt.definitionConsumptionReady,
      definitionFieldReady: definitionReceipt.definitionFieldReady,
      definitionNodePointFallbackActive: definitionReceipt.definitionNodePointFallbackActive,
      definitionNodePointIndexCount: definitionReceipt.definitionNodePointIndexCount,
      definitionNodePointExactHits: definitionReceipt.definitionNodePointExactHits,
      definitionNodePointFallbackHits: definitionReceipt.definitionNodePointFallbackHits,

      carrierInventsTerrain: false,
      terrainAtlasRemainsSource: true,
      carrierDoesNotOwnTerrainTruth: true,
      carrierDoesNotOwnElevationTruth: true,
      carrierDoesNotOwnReliefTruth: true,
      carrierDoesNotOwnLandformTruth: true,
      carrierDoesNotMutateUpstreamMeaning: true,
      carrierShouldNotOwnElevationTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnLandformTruth: true,

      nineContinentEthicalFieldActive: ethicalReceipt.nineContinentEthicalFieldActive,
      nineContinentCount: ethicalReceipt.nineContinentCount,
      bumpAnchorCount: ethicalReceipt.bumpAnchorCount,
      fourInvariantSizeClassesActive: true,
      sizeEqualsHeight: false,
      heightVariantByEthicalMetric: true,

      landBodyCompositorActive: landReceipt.landBodyCompositorActive,
      existingNodesUsedAsLandMappingScaffold: true,
      nodesHiddenFromSurface: true,
      visibleLandBodyPacketReady: landReceipt.visibleLandBodyPacketReady,
      fieldSampleCount: landReceipt.fieldSampleCount,
      landFieldCols: LAND_FIELD_COLS,
      landFieldRows: LAND_FIELD_ROWS,

      climateSeedOnly: true,
      ecologySeedOnly: true,
      technologySeedOnly: true,

      materialLayerSeparationActive: true,
      surfaceRenderIsDerived: true,
      raw256VisibleOnlyInLattice: true,

      atmosphereSeparatedFromHydrosphere: true,
      hydrosphereMemoryIsUnderlayer: true,
      hydrosphereWashReducedWhenDefinitionReady: state.definitionConsumptionReady,
      dryCrustAboveHydrosphereMemory: true,

      zoomInspectionActive: true,
      zoom: Number(state.zoom.toFixed(4)),
      zoomMin: ZOOM.min,
      zoomMax: ZOOM.max,
      zoomMutatesTerrainTruth: false,

      fullGlobeLatticeActive: true,
      latticeSeatCount: state.latticeSeats.length,
      latticeWrapsEntireGlobe: true,

      audraliaLevelTerrainAuthority: true,
      gratitudeIsIsland: false,
      gratitudeIslandRead: false,

      activeHydration: false,
      hydrationHeld: true,
      futureFillOnly: true,
      edgeDetailsHeld: true,

      surfaceUsesContinuousLandBodySkin: state.landBodyCompositorReady,
      surfaceUsesPacketDefinitionOverlay: state.definitionFieldReady,
      sixthSenseExposesNodeScaffold: true,
      latticeRaw256InspectionPreserved: true,

      activeLens: state.activeLens,
      renderCount: state.renderCount,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_CARRIER_BASELINE_RESTORED_PACKET_HANDOFF_DRAW_RENEWAL_DEPLOY_MARKER_v1"
    };

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
      document.documentElement.dataset.audraliaSameFileRenewal = "true";
      document.documentElement.dataset.audraliaShellPreserved = "true";
      document.documentElement.dataset.audraliaCarrierConsumesPacketsForDisplayOnly = "true";
      document.documentElement.dataset.audraliaCarrierDrawsPacketHandoffs = "true";
      document.documentElement.dataset.audraliaCarrierConsumesReliefPacket = String(state.carrierConsumesReliefPacket);
      document.documentElement.dataset.audraliaCarrierConsumesLandformPacket = String(state.carrierConsumesLandformPacket);
      document.documentElement.dataset.audraliaDefinitionConsumptionReady = String(state.definitionConsumptionReady);
      document.documentElement.dataset.audraliaDefinitionFieldReady = String(state.definitionFieldReady);
      document.documentElement.dataset.audraliaDefinitionNodePointFallbackActive = String(state.definitionNodePointFallbackActive);
      document.documentElement.dataset.audraliaCarrierDoesNotOwnTerrainTruth = "true";
      document.documentElement.dataset.audraliaCarrierDoesNotOwnElevationTruth = "true";
      document.documentElement.dataset.audraliaCarrierDoesNotOwnReliefTruth = "true";
      document.documentElement.dataset.audraliaCarrierDoesNotOwnLandformTruth = "true";
      document.documentElement.dataset.audraliaCarrierDoesNotMutateUpstreamMeaning = "true";
      document.documentElement.dataset.audraliaCarrierInventsTerrain = "false";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
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

    state.canvas = document.createElement("canvas");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-previous-contract", PREVIOUS_CONTRACT);
    state.canvas.setAttribute("data-recovery-baseline", RECOVERY_BASELINE);
    state.canvas.setAttribute("data-same-file-renewal", "true");
    state.canvas.setAttribute("data-shell-preserved", "true");
    state.canvas.setAttribute("data-land-body-compositor-active", "true");
    state.canvas.setAttribute("data-packet-handoff-draw-layer", "true");
    state.canvas.setAttribute("data-definition-node-point-fallback-active", "true");
    state.canvas.setAttribute("data-carrier-consumes-packets-for-display-only", "true");
    state.canvas.setAttribute("data-carrier-draws-packet-handoffs", "true");
    state.canvas.setAttribute("data-carrier-does-not-own-terrain-truth", "true");
    state.canvas.setAttribute("data-carrier-does-not-own-elevation-truth", "true");
    state.canvas.setAttribute("data-carrier-does-not-own-relief-truth", "true");
    state.canvas.setAttribute("data-carrier-does-not-own-landform-truth", "true");
    state.canvas.setAttribute("data-carrier-does-not-mutate-upstream-meaning", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-active-hydration", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);
    state.ctx = state.canvas.getContext("2d", { alpha: true });

    buildLatticeGeometry();
    resize();
    bindControls();
    refreshDownstreamPackets();

    setTimeout(refreshDownstreamPackets, 180);
    setTimeout(refreshDownstreamPackets, 640);
    setTimeout(refreshDownstreamPackets, 1200);
    setTimeout(refreshDownstreamPackets, 1800);

    window.addEventListener("resize", resize, { passive: true });

    setLens("body");
    publishStatus();
    requestRender();
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    recoveryBaseline: RECOVERY_BASELINE,
    status: publishStatus,
    detectDryTerrain: detectDryTerrain,
    detectReliefExpression: detectReliefExpression,
    detectLandformSystems: detectLandformSystems,
    refreshDownstreamPackets: refreshDownstreamPackets,
    rebuildDefinitionNodePointIndex: rebuildDefinitionNodePointIndex,
    nodeIdToRenderablePoint: nodeIdToRenderablePoint,
    setZoom: setZoom,
    resetCamera: resetCamera,
    getEthicalBumpFieldReceipt: getEthicalBumpFieldReceipt,
    getLandBodyCompositorReceipt: getLandBodyCompositorReceipt,
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
