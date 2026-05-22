// /assets/audralia/clean/terrain/gratitude/gratitude.hydration.child.js
// AUDRALIA_GRATITUDE_HYDRATION_BLOODSTREAM_SYSTEM_MAP_TNT_v1
// Full-file creation/replacement.
// Scope: downstream Gratitude hydration bloodstream system.
// Purpose: consume upstream Gratitude 256-node terrain engine and map hydration as source, artery, vein,
// capillary, basin, lake, marsh, wetland, coast-return, aquifer-held, desert, gully, wash, and waterfall systems.
// Does not own: HTML, carrier rendering, core physics, upstream terrain engine, final ocean rendering,
// Runtime / Strength activation, final hydration pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_HYDRATION_BLOODSTREAM_SYSTEM_MAP_TNT_v1";
  var SPEC_OPS = "AUDRALIA_GRATITUDE_HYDRATION_BLOODSTREAM_SYSTEM_MAP_SPEC_OPS_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration.child.js";
  var UPSTREAM_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var CHILD_CLASS = "downstream_hydration_bloodstream_system_map";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;

  var FINAL_HYDRATION_PASS_CLAIM = false;
  var FINAL_VISUAL_PASS_CLAIM = false;
  var RUNTIME_STRENGTH_HELD = true;

  var NEWS_ORDER = Object.freeze(["north", "east", "west", "south"]);

  var HYDRATION_CATEGORY = Object.freeze({
    OUTSIDE: "outside_hydration_context",
    DRY: "dry_land",
    MOUNTAIN_SOURCE: "mountain_source",
    HEADWATER: "headwater_source",
    SPRING: "spring_source_candidate",
    ARTERIAL_RIVER: "arterial_river",
    TRIBUTARY_STREAM: "tributary_stream",
    SEASONAL_STREAM: "seasonal_stream",
    GULLY: "gully",
    DRY_GULLY: "dry_gully",
    FLASH_FLOOD_WASH: "flash_flood_wash",
    DESERT_WASH: "desert_wash",
    WATERFALL: "waterfall_candidate",
    LAKE: "lake",
    SEASONAL_LAKE: "seasonal_lake",
    BASIN_LAKE: "basin_lake_candidate",
    SALT_LAKE: "salt_lake_candidate",
    MARSH: "marsh",
    WETLAND: "wetland",
    RIPARIAN: "riparian_zone",
    DELTA: "delta_candidate",
    ESTUARY: "estuary_candidate",
    COAST_RETURN: "coast_return",
    AQUIFER_HELD: "aquifer_recharge_held",
    DESERT_DRY_ZONE: "desert_dry_zone",
    RAIN_SHADOW_DESERT: "rain_shadow_desert"
  });

  var FLOW_TYPE = Object.freeze({
    ARTERY: "artery",
    VEIN: "vein",
    CAPILLARY: "capillary",
    RETURN: "return",
    HELD: "held"
  });

  var RENDER_TIERS = Object.freeze({
    T0: "tier_0_hydration_receipt",
    T1: "tier_1_source_and_basin_map",
    T2: "tier_2_river_artery_map",
    T3: "tier_3_stream_and_gully_map",
    T4: "tier_4_lake_marsh_wetland_map",
    T5: "tier_5_full_hydration_bloodstream_render_held"
  });

  var RIVER_BLUEPRINTS = Object.freeze([
    Object.freeze({
      riverId: "north_crown_river",
      name: "North Crown River",
      role: "northern summit chain to central basin",
      sourcePreference: ["summit_highland", "ridge_highland"],
      channelPreference: ["ridge_highland", "upland_slope", "valley_corridor", "basin_floor"],
      mouthPreference: ["basin_floor", "wetland_candidate", "valley_corridor"],
      directionBias: { x: 0.03, y: 1.00 },
      seasonality: "perennial_headwater_with_seasonal_branches"
    }),
    Object.freeze({
      riverId: "central_gratitude_river",
      name: "Central Gratitude River",
      role: "main internal arterial river",
      sourcePreference: ["ridge_highland", "summit_highland", "upland_slope"],
      channelPreference: ["valley_corridor", "basin_floor", "interior_plain"],
      mouthPreference: ["basin_floor", "wetland_candidate", "coastal_edge"],
      directionBias: { x: 0.14, y: 0.96 },
      seasonality: "primary_perennial"
    }),
    Object.freeze({
      riverId: "south_valley_river",
      name: "South Valley River",
      role: "southern valley and marsh-feed artery",
      sourcePreference: ["upland_slope", "ridge_highland"],
      channelPreference: ["valley_corridor", "wetland_candidate", "marsh_candidate"],
      mouthPreference: ["wetland_candidate", "marsh_candidate", "coast_return"],
      directionBias: { x: 0.07, y: 1.00 },
      seasonality: "perennial_to_seasonal_lowland"
    }),
    Object.freeze({
      riverId: "east_shelf_river",
      name: "East Shelf River",
      role: "eastern shelf and coast-return artery",
      sourcePreference: ["ridge_highland", "upland_slope", "interior_plain"],
      channelPreference: ["interior_plain", "valley_corridor", "coastal_edge"],
      mouthPreference: ["coastal_edge", "shelf_candidate", "coast_return"],
      directionBias: { x: 0.88, y: 0.30 },
      seasonality: "coast_return_perennial"
    }),
    Object.freeze({
      riverId: "west_shoulder_river",
      name: "West Shoulder River",
      role: "western highland shoulder into central basin",
      sourcePreference: ["ridge_highland", "upland_slope"],
      channelPreference: ["upland_slope", "valley_corridor", "basin_floor"],
      mouthPreference: ["basin_floor", "central_basin", "wetland_candidate"],
      directionBias: { x: 0.78, y: 0.42 },
      seasonality: "seasonal_to_perennial"
    })
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nodeId(x, y) {
    return "GRATITUDE-HYDRATION-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function edgeId(fromNodeId, toNodeId, type) {
    return "HYDRO-EDGE-" + type + "-" + fromNodeId + "-TO-" + toNodeId;
  }

  function normalizeTerrainNode(node, index) {
    var x = Number.isFinite(Number(node.x)) ? Number(node.x) : index % RADIAL_NODES;
    var y = Number.isFinite(Number(node.y)) ? Number(node.y) : Math.floor(index / RADIAL_NODES);

    return {
      sourceNodeId: node.nodeId || node.seatKey || ("UPSTREAM-" + index),
      nodeIndex: Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : index,
      seatIndex: Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : index,
      x: x,
      y: y,
      centerX: Number.isFinite(Number(node.centerX)) ? Number(node.centerX) : x + 0.5,
      centerY: Number.isFinite(Number(node.centerY)) ? Number(node.centerY) : y + 0.5,
      continentMembership: node.continentMembership === true,
      primaryCategory: String(node.primaryCategory || "unknown"),
      terrainClass: String(node.terrainClass || "outside_gratitude_field"),
      hydrationClass: String(node.hydrationClass || "outside_gratitude_field"),
      elevation: clamp(node.elevation, 0, 1),
      baseElevation: clamp(node.baseElevation, 0, 1),
      summitPressure: clamp(node.summitPressure || node.summitInfluence, 0, 1),
      ridgePressure: clamp(node.ridgePressure, 0, 1),
      basinPressure: clamp(node.basinPressure, 0, 1),
      valleyPressure: clamp(node.valleyPressure, 0, 1),
      marshPressure: clamp(node.marshPressure, 0, 1),
      wetlandPressure: clamp(node.wetlandPressure, 0, 1),
      coastPressure: clamp(node.coastPressure, 0, 1),
      shelfPressure: clamp(node.shelfPressure, 0, 1),
      hydrationPressure: clamp(node.hydrationPressure || node.hydrationDepth, 0, 1),
      drainagePressure: clamp(node.drainagePressure || node.runoffPressure, 0, 1),
      runoffPressure: clamp(node.runoffPressure, 0, 1),
      wetnessPressure: clamp(node.wetnessPressure || node.hydrationDepth, 0, 1),
      soilPressure: clamp(node.soilPressure, 0, 1),
      mineralPressure: clamp(node.mineralPressure, 0, 1),
      sedimentPressure: clamp(node.sedimentPressure, 0, 1),
      texturePressure: clamp(node.texturePressure, 0, 1),
      waterFillEligible: node.waterFillEligible === true,
      coastEligible: node.coastEligible === true || clamp(node.coastPressure, 0, 1) > 0.55,
      hardFail: node.hardFail === true,
      coherenceScore: Number.isFinite(Number(node.coherenceScore)) ? Number(node.coherenceScore) : 1
    };
  }

  function detectUpstream() {
    var api = window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD || null;
    var result = {
      api: api,
      detected: Boolean(api),
      packetReady: false,
      status: null,
      packet: null,
      nodeMap: null,
      nodes: [],
      failureReason: ""
    };

    if (!api) {
      result.failureReason = "upstream Gratitude continent engine missing";
      return result;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getNodeMap !== "function" ||
      typeof api.getChildReceivePacket !== "function"
    ) {
      result.failureReason = "upstream API incomplete";
      return result;
    }

    try {
      result.status = api.status();
      result.packet = api.getChildReceivePacket("gratitude-hydration-bloodstream-system", { compact: false });
      result.nodeMap = api.getNodeMap({ compact: false });
      result.nodes = safeArray(result.nodeMap && result.nodeMap.nodes).map(normalizeTerrainNode);
      result.packetReady = Boolean(result.packet && result.packet.childReceivePacketReady === true && result.nodes.length === NODE_COUNT);
      if (!result.packetReady) result.failureReason = "upstream packet not ready or node count mismatch";
      return result;
    } catch (error) {
      result.failureReason = error && error.message ? error.message : String(error || "upstream exception");
      return result;
    }
  }

  var UPSTREAM = detectUpstream();

  function boundedStatus() {
    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      upstreamFile: UPSTREAM_FILE,
      childType: "hydration_bloodstream_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      childClass: CHILD_CLASS,

      hydrationBloodstreamSystem: true,
      upstreamDetected: UPSTREAM.detected,
      upstreamPacketReady: UPSTREAM.packetReady,
      upstreamFailureReason: UPSTREAM.failureReason,

      terrainCoordinatesConsumed: false,
      hydrationMapReady: false,
      waterPaintForbidden: true,
      bloodstreamModelActive: false,

      carrierConsumptionAllowedAfterValidation: false,
      carrierRenderAuthorized: false,
      runtimeStrengthHeld: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      boundedFailure: true,
      failureReason: UPSTREAM.failureReason || "upstream unavailable"
    };
  }

  function terrainPermission(node) {
    return node.continentMembership === true || node.shelfPressure > 0.36 || node.coastPressure > 0.48;
  }

  function isMountainSource(node) {
    return node.continentMembership &&
      (
        node.terrainClass === "summit_highland" ||
        node.terrainClass === "ridge_highland" ||
        node.summitPressure > 0.58 ||
        node.ridgePressure > 0.64
      );
  }

  function isRidgeBarrier(node) {
    return node.continentMembership && (node.ridgePressure > 0.62 || node.terrainClass === "ridge_highland");
  }

  function rainShadowPressure(node) {
    var eastDry = node.x >= 9 && node.ridgePressure > 0.38 ? 0.18 : 0;
    var highDry = node.elevation > 0.55 && node.wetnessPressure < 0.30 ? 0.22 : 0;
    var basinDry = node.basinPressure > 0.32 && node.hydrationPressure < 0.24 ? 0.20 : 0;
    var lowWetPenalty = node.marshPressure * 0.28 + node.wetlandPressure * 0.26;

    return clamp(eastDry + highDry + basinDry + (1 - node.hydrationPressure) * 0.22 - lowWetPenalty, 0, 1);
  }

  function desertPressure(node) {
    if (!node.continentMembership) return 0;

    var dry = clamp(
      (1 - node.wetnessPressure) * 0.30 +
      (1 - node.hydrationPressure) * 0.26 +
      rainShadowPressure(node) * 0.32 +
      (node.elevation > 0.50 ? 0.08 : 0) -
      node.basinPressure * 0.08 -
      node.valleyPressure * 0.08,
      0,
      1
    );

    return dry;
  }

  function sourcePressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.summitPressure * 0.34 +
      node.ridgePressure * 0.28 +
      node.runoffPressure * 0.20 +
      (node.elevation > 0.58 ? 0.14 : 0) -
      desertPressure(node) * 0.10,
      0,
      1
    );
  }

  function channelPressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.valleyPressure * 0.34 +
      node.drainagePressure * 0.26 +
      node.runoffPressure * 0.20 +
      node.hydrationPressure * 0.16 +
      node.basinPressure * 0.08,
      0,
      1
    );
  }

  function lakePressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.basinPressure * 0.46 +
      node.hydrationPressure * 0.24 +
      node.wetnessPressure * 0.18 -
      node.summitPressure * 0.18 -
      node.ridgePressure * 0.12,
      0,
      1
    );
  }

  function marshWetlandPressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.marshPressure * 0.32 +
      node.wetlandPressure * 0.30 +
      node.basinPressure * 0.14 +
      node.valleyPressure * 0.12 +
      node.hydrationPressure * 0.16 -
      node.elevation * 0.08,
      0,
      1
    );
  }

  function coastReturnPressure(node) {
    return clamp(
      node.coastPressure * 0.52 +
      node.shelfPressure * 0.32 +
      node.valleyPressure * 0.10 +
      node.hydrationPressure * 0.08,
      0,
      1
    );
  }

  function waterfallPressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.ridgePressure * 0.32 +
      node.valleyPressure * 0.22 +
      sourcePressure(node) * 0.18 +
      node.elevation * 0.16 -
      node.basinPressure * 0.18,
      0,
      1
    );
  }

  function aquiferPressure(node) {
    if (!node.continentMembership) return 0;

    return clamp(
      node.basinPressure * 0.24 +
      node.valleyPressure * 0.20 +
      node.soilPressure * 0.20 +
      node.sedimentPressure * 0.16 +
      node.hydrationPressure * 0.16,
      0,
      1
    );
  }

  function classifyHydrationNode(node) {
    var dry = desertPressure(node);
    var source = sourcePressure(node);
    var channel = channelPressure(node);
    var lake = lakePressure(node);
    var marshWetland = marshWetlandPressure(node);
    var coast = coastReturnPressure(node);
    var waterfall = waterfallPressure(node);
    var aquifer = aquiferPressure(node);

    if (!terrainPermission(node)) return HYDRATION_CATEGORY.OUTSIDE;

    if (node.shelfPressure > 0.50 && !node.continentMembership) return HYDRATION_CATEGORY.COAST_RETURN;
    if (coast > 0.62 && node.coastPressure > 0.56) return HYDRATION_CATEGORY.COAST_RETURN;

    if (source > 0.72 && node.summitPressure > 0.58) return HYDRATION_CATEGORY.MOUNTAIN_SOURCE;
    if (source > 0.58 && node.ridgePressure > 0.48) return HYDRATION_CATEGORY.HEADWATER;
    if (source > 0.48 && node.hydrationPressure > 0.24) return HYDRATION_CATEGORY.SPRING;

    if (waterfall > 0.62 && node.elevation > 0.52 && node.valleyPressure > 0.24) return HYDRATION_CATEGORY.WATERFALL;

    if (lake > 0.68 && node.basinPressure > 0.56 && dry < 0.36) return HYDRATION_CATEGORY.LAKE;
    if (lake > 0.54 && node.basinPressure > 0.44 && dry < 0.52) return HYDRATION_CATEGORY.BASIN_LAKE;
    if (lake > 0.46 && dry > 0.56) return HYDRATION_CATEGORY.SALT_LAKE;

    if (marshWetland > 0.66 && node.marshPressure > node.wetlandPressure) return HYDRATION_CATEGORY.MARSH;
    if (marshWetland > 0.56) return HYDRATION_CATEGORY.WETLAND;

    if (channel > 0.72 && node.valleyPressure > 0.50 && dry < 0.38) return HYDRATION_CATEGORY.ARTERIAL_RIVER;
    if (channel > 0.56 && dry < 0.48) return HYDRATION_CATEGORY.TRIBUTARY_STREAM;
    if (channel > 0.44 && dry < 0.62) return HYDRATION_CATEGORY.SEASONAL_STREAM;

    if (channel > 0.34 && dry >= 0.62) return HYDRATION_CATEGORY.DESERT_WASH;
    if (channel > 0.30 && node.valleyPressure > 0.28) return HYDRATION_CATEGORY.GULLY;
    if (dry > 0.68 && node.valleyPressure > 0.20) return HYDRATION_CATEGORY.DRY_GULLY;

    if (aquifer > 0.44 && dry < 0.62) return HYDRATION_CATEGORY.AQUIFER_HELD;

    if (dry > 0.72 && rainShadowPressure(node) > 0.42) return HYDRATION_CATEGORY.RAIN_SHADOW_DESERT;
    if (dry > 0.58) return HYDRATION_CATEGORY.DESERT_DRY_ZONE;

    return HYDRATION_CATEGORY.DRY;
  }

  function hydrationClassFromCategory(category) {
    var map = {};
    map[HYDRATION_CATEGORY.OUTSIDE] = "outside_hydration_context";
    map[HYDRATION_CATEGORY.DRY] = "dry_land";
    map[HYDRATION_CATEGORY.MOUNTAIN_SOURCE] = "mountain_snowpack_held";
    map[HYDRATION_CATEGORY.HEADWATER] = "headwater_source";
    map[HYDRATION_CATEGORY.SPRING] = "spring_source_candidate";
    map[HYDRATION_CATEGORY.ARTERIAL_RIVER] = "arterial_river";
    map[HYDRATION_CATEGORY.TRIBUTARY_STREAM] = "tributary_stream";
    map[HYDRATION_CATEGORY.SEASONAL_STREAM] = "seasonal_stream";
    map[HYDRATION_CATEGORY.GULLY] = "wet_gully";
    map[HYDRATION_CATEGORY.DRY_GULLY] = "dry_gully";
    map[HYDRATION_CATEGORY.FLASH_FLOOD_WASH] = "flash_flood_wash";
    map[HYDRATION_CATEGORY.DESERT_WASH] = "desert_wash";
    map[HYDRATION_CATEGORY.WATERFALL] = "waterfall_candidate";
    map[HYDRATION_CATEGORY.LAKE] = "permanent_lake";
    map[HYDRATION_CATEGORY.SEASONAL_LAKE] = "seasonal_lake";
    map[HYDRATION_CATEGORY.BASIN_LAKE] = "basin_lake_candidate";
    map[HYDRATION_CATEGORY.SALT_LAKE] = "salt_lake_candidate";
    map[HYDRATION_CATEGORY.MARSH] = "river_marsh";
    map[HYDRATION_CATEGORY.WETLAND] = "wetland_candidate";
    map[HYDRATION_CATEGORY.RIPARIAN] = "riparian_wetland";
    map[HYDRATION_CATEGORY.DELTA] = "delta_candidate";
    map[HYDRATION_CATEGORY.ESTUARY] = "estuary_candidate";
    map[HYDRATION_CATEGORY.COAST_RETURN] = "coast_return";
    map[HYDRATION_CATEGORY.AQUIFER_HELD] = "aquifer_recharge_held";
    map[HYDRATION_CATEGORY.DESERT_DRY_ZONE] = "dry_interior_plain";
    map[HYDRATION_CATEGORY.RAIN_SHADOW_DESERT] = "rain_shadow_desert";
    return map[category] || "dry_land";
  }

  function expressionFromCategory(category) {
    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER) return "river";
    if (category === HYDRATION_CATEGORY.TRIBUTARY_STREAM) return "stream";
    if (category === HYDRATION_CATEGORY.SEASONAL_STREAM) return "stream";
    if (category === HYDRATION_CATEGORY.GULLY) return "gully";
    if (category === HYDRATION_CATEGORY.DRY_GULLY) return "gully";
    if (category === HYDRATION_CATEGORY.DESERT_WASH) return "desert_wash";
    if (category === HYDRATION_CATEGORY.LAKE || category === HYDRATION_CATEGORY.BASIN_LAKE || category === HYDRATION_CATEGORY.SALT_LAKE) return "lake";
    if (category === HYDRATION_CATEGORY.MARSH) return "marsh";
    if (category === HYDRATION_CATEGORY.WETLAND) return "wetland";
    if (category === HYDRATION_CATEGORY.COAST_RETURN) return "coast_delta";
    if (category === HYDRATION_CATEGORY.MOUNTAIN_SOURCE || category === HYDRATION_CATEGORY.HEADWATER || category === HYDRATION_CATEGORY.SPRING) return "source";
    if (category === HYDRATION_CATEGORY.AQUIFER_HELD) return "aquifer_source_held";
    return "dry_land";
  }

  function sourceFromCategory(category) {
    if (category === HYDRATION_CATEGORY.MOUNTAIN_SOURCE) return "mountain_source";
    if (category === HYDRATION_CATEGORY.HEADWATER) return "ridge_runoff";
    if (category === HYDRATION_CATEGORY.SPRING) return "spring_source";
    if (category === HYDRATION_CATEGORY.LAKE || category === HYDRATION_CATEGORY.BASIN_LAKE) return "basin_capture";
    if (category === HYDRATION_CATEGORY.COAST_RETURN) return "coastal_inflow";
    if (category === HYDRATION_CATEGORY.AQUIFER_HELD) return "aquifer_source_held";
    return "dry_source_none";
  }

  function downstreamOwnerForCategory(category) {
    if (category === HYDRATION_CATEGORY.LAKE || category === HYDRATION_CATEGORY.BASIN_LAKE || category === HYDRATION_CATEGORY.SALT_LAKE) return "gratitude.basins.child.js";
    if (category === HYDRATION_CATEGORY.MARSH || category === HYDRATION_CATEGORY.WETLAND || category === HYDRATION_CATEGORY.RIPARIAN) return "gratitude.marshes.child.js";
    if (category === HYDRATION_CATEGORY.COAST_RETURN || category === HYDRATION_CATEGORY.DELTA || category === HYDRATION_CATEGORY.ESTUARY) return "gratitude.coast.child.js";
    if (category === HYDRATION_CATEGORY.MOUNTAIN_SOURCE || category === HYDRATION_CATEGORY.WATERFALL || category === HYDRATION_CATEGORY.HEADWATER) return "gratitude.ridges.child.js";
    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER || category === HYDRATION_CATEGORY.TRIBUTARY_STREAM || category === HYDRATION_CATEGORY.SEASONAL_STREAM) return "gratitude.hydration.child.js";
    if (category === HYDRATION_CATEGORY.GULLY || category === HYDRATION_CATEGORY.DRY_GULLY || category === HYDRATION_CATEGORY.DESERT_WASH) return "gratitude.valleys.child.js";
    if (category === HYDRATION_CATEGORY.DESERT_DRY_ZONE || category === HYDRATION_CATEGORY.RAIN_SHADOW_DESERT) return "gratitude.desert.child.js";
    return "gratitude.hydration.child.js";
  }

  function constraintCheck(node, category) {
    var failures = [];
    var warnings = [];

    if (category === HYDRATION_CATEGORY.MARSH && (node.summitPressure > 0.66 || node.terrainClass === "summit_highland")) {
      failures.push("summit_cannot_be_marsh_primary");
    }

    if ((category === HYDRATION_CATEGORY.LAKE || category === HYDRATION_CATEGORY.BASIN_LAKE) && node.ridgePressure > 0.70) {
      failures.push("ridge_cannot_be_lake_primary");
    }

    if ((category === HYDRATION_CATEGORY.LAKE || category === HYDRATION_CATEGORY.BASIN_LAKE) && node.basinPressure < 0.38) {
      failures.push("lake_requires_basin_or_capture_logic");
    }

    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER && !(node.valleyPressure > 0.42 || node.drainagePressure > 0.42)) {
      failures.push("river_requires_gradient_path");
    }

    if (category === HYDRATION_CATEGORY.WATERFALL && !(node.elevation > 0.50 && node.ridgePressure > 0.38 && node.valleyPressure > 0.18)) {
      failures.push("waterfall_requires_steep_elevation_drop");
    }

    if (category === HYDRATION_CATEGORY.MARSH && !(node.marshPressure > 0.45 && node.wetnessPressure > 0.32 && node.basinPressure + node.valleyPressure > 0.50)) {
      failures.push("marsh_requires_low_gradient_wetness_sediment_and_retention");
    }

    if (category === HYDRATION_CATEGORY.DESERT_WASH && node.hydrationPressure > 0.60) {
      failures.push("desert_wash_cannot_classify_as_permanent_river");
    }

    if (category === HYDRATION_CATEGORY.COAST_RETURN && !(node.coastPressure > 0.45 || node.shelfPressure > 0.45)) {
      failures.push("coast_delta_or_estuary_requires_boundary_adjacency");
    }

    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER && desertPressure(node) > 0.70) {
      failures.push("permanent_river_cannot_cross_primary_desert_without_channel_proof");
    }

    if (category === HYDRATION_CATEGORY.DRY && node.hydrationPressure > 0.65) {
      warnings.push("high_hydration_pressure_classified_dry_check_downstream_channel");
    }

    if (category === HYDRATION_CATEGORY.LAKE && desertPressure(node) > 0.52) {
      warnings.push("lake_in_dry_zone_should_be_salt_or_seasonal_candidate");
    }

    if (category === HYDRATION_CATEGORY.COAST_RETURN) {
      warnings.push("ocean_is_return_context_not_inland_hydration_ownership");
    }

    return {
      hardFail: failures.length > 0,
      failures: failures,
      warnings: warnings,
      coherenceScore: round(clamp(1 - failures.length * 0.22 - warnings.length * 0.04, 0, 1), 4)
    };
  }

  function makeNEWS(hNode, constraint) {
    return Object.freeze({
      complete: true,
      north: Object.freeze({
        defined: true,
        role: "source",
        source: sourceFromCategory(hNode.hydrationCategory),
        terrainSourceNodeId: hNode.sourceNodeId,
        mountainRangeReserved: hNode.mountainRangeReserved,
        desertSourceNone: hNode.hydrationCategory === HYDRATION_CATEGORY.DESERT_DRY_ZONE ||
          hNode.hydrationCategory === HYDRATION_CATEGORY.RAIN_SHADOW_DESERT
      }),
      east: Object.freeze({
        defined: true,
        role: "expression",
        expression: expressionFromCategory(hNode.hydrationCategory),
        hydrationCategory: hNode.hydrationCategory,
        hydrationClass: hNode.hydrationClass,
        bloodstreamRole: hNode.bloodstreamRole
      }),
      west: Object.freeze({
        defined: true,
        role: "correction",
        correction: constraint.hardFail ? "hard_constraint_failure" : constraint.warnings.length ? "held_warning_correction" : "coherent",
        failures: constraint.failures.slice(),
        warnings: constraint.warnings.slice(),
        waterPaintForbidden: true,
        waterMustObeyTerrain: true
      }),
      south: Object.freeze({
        defined: true,
        role: "grounding",
        downstreamOwner: hNode.downstreamOwner,
        renderTier: hNode.renderTier,
        renderHeld: true,
        runtimeStrengthHeld: true,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      })
    });
  }

  function bloodstreamRole(category) {
    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER) return "artery";
    if (category === HYDRATION_CATEGORY.TRIBUTARY_STREAM || category === HYDRATION_CATEGORY.SEASONAL_STREAM) return "vein";
    if (
      category === HYDRATION_CATEGORY.GULLY ||
      category === HYDRATION_CATEGORY.DRY_GULLY ||
      category === HYDRATION_CATEGORY.DESERT_WASH ||
      category === HYDRATION_CATEGORY.SPRING ||
      category === HYDRATION_CATEGORY.HEADWATER
    ) return "capillary";
    if (
      category === HYDRATION_CATEGORY.LAKE ||
      category === HYDRATION_CATEGORY.BASIN_LAKE ||
      category === HYDRATION_CATEGORY.MARSH ||
      category === HYDRATION_CATEGORY.WETLAND
    ) return "organ";
    if (category === HYDRATION_CATEGORY.COAST_RETURN) return "return";
    if (category === HYDRATION_CATEGORY.AQUIFER_HELD) return "held_groundwater";
    return "dry_tissue";
  }

  function renderTierForCategory(category) {
    if (category === HYDRATION_CATEGORY.OUTSIDE) return RENDER_TIERS.T0;
    if (
      category === HYDRATION_CATEGORY.MOUNTAIN_SOURCE ||
      category === HYDRATION_CATEGORY.HEADWATER ||
      category === HYDRATION_CATEGORY.BASIN_LAKE ||
      category === HYDRATION_CATEGORY.LAKE
    ) return RENDER_TIERS.T1;
    if (category === HYDRATION_CATEGORY.ARTERIAL_RIVER) return RENDER_TIERS.T2;
    if (
      category === HYDRATION_CATEGORY.TRIBUTARY_STREAM ||
      category === HYDRATION_CATEGORY.SEASONAL_STREAM ||
      category === HYDRATION_CATEGORY.GULLY ||
      category === HYDRATION_CATEGORY.DRY_GULLY ||
      category === HYDRATION_CATEGORY.DESERT_WASH ||
      category === HYDRATION_CATEGORY.WATERFALL
    ) return RENDER_TIERS.T3;
    if (
      category === HYDRATION_CATEGORY.MARSH ||
      category === HYDRATION_CATEGORY.WETLAND ||
      category === HYDRATION_CATEGORY.COAST_RETURN
    ) return RENDER_TIERS.T4;
    return RENDER_TIERS.T1;
  }

  function makeHydrationNode(sourceNode) {
    var category = classifyHydrationNode(sourceNode);
    var constraint = constraintCheck(sourceNode, category);
    var hNode = {
      hydrationNodeId: nodeId(sourceNode.x, sourceNode.y),
      sourceNodeId: sourceNode.sourceNodeId,
      nodeIndex: sourceNode.nodeIndex,
      seatIndex: sourceNode.seatIndex,
      x: sourceNode.x,
      y: sourceNode.y,
      centerX: sourceNode.centerX,
      centerY: sourceNode.centerY,

      continentMembership: sourceNode.continentMembership,
      terrainClass: sourceNode.terrainClass,
      upstreamHydrationClass: sourceNode.hydrationClass,
      elevation: sourceNode.elevation,
      summitPressure: sourceNode.summitPressure,
      ridgePressure: sourceNode.ridgePressure,
      basinPressure: sourceNode.basinPressure,
      valleyPressure: sourceNode.valleyPressure,
      marshPressure: sourceNode.marshPressure,
      wetlandPressure: sourceNode.wetlandPressure,
      coastPressure: sourceNode.coastPressure,
      shelfPressure: sourceNode.shelfPressure,
      hydrationPressure: sourceNode.hydrationPressure,
      drainagePressure: sourceNode.drainagePressure,
      runoffPressure: sourceNode.runoffPressure,
      wetnessPressure: sourceNode.wetnessPressure,

      desertPressure: round(desertPressure(sourceNode), 4),
      rainShadowPressure: round(rainShadowPressure(sourceNode), 4),
      sourcePressure: round(sourcePressure(sourceNode), 4),
      channelPressure: round(channelPressure(sourceNode), 4),
      lakePressure: round(lakePressure(sourceNode), 4),
      marshWetlandPressure: round(marshWetlandPressure(sourceNode), 4),
      coastReturnPressure: round(coastReturnPressure(sourceNode), 4),
      waterfallPressure: round(waterfallPressure(sourceNode), 4),
      aquiferPressure: round(aquiferPressure(sourceNode), 4),

      hydrationCategory: category,
      hydrationClass: hydrationClassFromCategory(category),
      bloodstreamRole: bloodstreamRole(category),

      mountainRangeReserved: isMountainSource(sourceNode) || isRidgeBarrier(sourceNode),
      desertLandMapped: desertPressure(sourceNode) > 0.48,
      waterPaintForbidden: true,
      waterObeysTerrain: true,
      oceanContextOnly: category === HYDRATION_CATEGORY.COAST_RETURN,

      downstreamOwner: downstreamOwnerForCategory(category),
      renderTier: renderTierForCategory(category),
      renderAuthorized: false,

      hardFail: constraint.hardFail,
      coherenceScore: constraint.coherenceScore,
      constraintFailures: constraint.failures,
      constraintWarnings: constraint.warnings,

      runtimeStrengthHeld: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    hNode.NEWS = makeNEWS(hNode, constraint);
    hNode.newsComplete = true;
    hNode.north = hNode.NEWS.north;
    hNode.east = hNode.NEWS.east;
    hNode.west = hNode.NEWS.west;
    hNode.south = hNode.NEWS.south;

    return Object.freeze(hNode);
  }

  function buildHydrationNodes() {
    if (!UPSTREAM.packetReady) return Object.freeze([]);
    return Object.freeze(UPSTREAM.nodes.map(makeHydrationNode));
  }

  var HYDRATION_NODES = buildHydrationNodes();

  function nodeByXY(x, y) {
    if (x < 0 || y < 0 || x >= RADIAL_NODES || y >= FIBONACCI_BANDS) return null;
    return HYDRATION_NODES[y * RADIAL_NODES + x] || null;
  }

  function neighborsOf(node) {
    var neighbors = [
      nodeByXY(node.x - 1, node.y),
      nodeByXY(node.x + 1, node.y),
      nodeByXY(node.x, node.y - 1),
      nodeByXY(node.x, node.y + 1),
      nodeByXY(node.x - 1, node.y + 1),
      nodeByXY(node.x + 1, node.y + 1)
    ];

    return neighbors.filter(Boolean);
  }

  function channelEligible(node) {
    return node &&
      node.continentMembership &&
      (
        node.hydrationCategory === HYDRATION_CATEGORY.MOUNTAIN_SOURCE ||
        node.hydrationCategory === HYDRATION_CATEGORY.HEADWATER ||
        node.hydrationCategory === HYDRATION_CATEGORY.SPRING ||
        node.hydrationCategory === HYDRATION_CATEGORY.ARTERIAL_RIVER ||
        node.hydrationCategory === HYDRATION_CATEGORY.TRIBUTARY_STREAM ||
        node.hydrationCategory === HYDRATION_CATEGORY.SEASONAL_STREAM ||
        node.hydrationCategory === HYDRATION_CATEGORY.GULLY ||
        node.hydrationCategory === HYDRATION_CATEGORY.DESERT_WASH ||
        node.hydrationCategory === HYDRATION_CATEGORY.WATERFALL ||
        node.hydrationCategory === HYDRATION_CATEGORY.LAKE ||
        node.hydrationCategory === HYDRATION_CATEGORY.BASIN_LAKE ||
        node.hydrationCategory === HYDRATION_CATEGORY.MARSH ||
        node.hydrationCategory === HYDRATION_CATEGORY.WETLAND ||
        node.hydrationCategory === HYDRATION_CATEGORY.COAST_RETURN
      );
  }

  function chooseDownhillNeighbor(node) {
    var neighbors = neighborsOf(node).filter(function (candidate) {
      return candidate.continentMembership || candidate.hydrationCategory === HYDRATION_CATEGORY.COAST_RETURN;
    });

    var best = null;
    var bestScore = -Infinity;

    for (var i = 0; i < neighbors.length; i += 1) {
      var target = neighbors[i];
      var gradient = node.elevation - target.elevation;
      var targetWet = target.channelPressure + target.basinPressure + target.valleyPressure + target.coastReturnPressure;
      var southBias = target.y >= node.y ? 0.08 : -0.06;
      var coastBias = target.coastPressure > 0.52 || target.shelfPressure > 0.52 ? 0.12 : 0;
      var score = gradient * 0.58 + targetWet * 0.24 + southBias + coastBias;

      if (score > bestScore) {
        bestScore = score;
        best = target;
      }
    }

    return best;
  }

  function flowTypeForNode(node) {
    if (node.hydrationCategory === HYDRATION_CATEGORY.ARTERIAL_RIVER) return FLOW_TYPE.ARTERY;
    if (
      node.hydrationCategory === HYDRATION_CATEGORY.TRIBUTARY_STREAM ||
      node.hydrationCategory === HYDRATION_CATEGORY.SEASONAL_STREAM
    ) return FLOW_TYPE.VEIN;
    if (
      node.hydrationCategory === HYDRATION_CATEGORY.GULLY ||
      node.hydrationCategory === HYDRATION_CATEGORY.DRY_GULLY ||
      node.hydrationCategory === HYDRATION_CATEGORY.DESERT_WASH ||
      node.hydrationCategory === HYDRATION_CATEGORY.SPRING ||
      node.hydrationCategory === HYDRATION_CATEGORY.HEADWATER ||
      node.hydrationCategory === HYDRATION_CATEGORY.WATERFALL
    ) return FLOW_TYPE.CAPILLARY;
    if (node.hydrationCategory === HYDRATION_CATEGORY.COAST_RETURN) return FLOW_TYPE.RETURN;
    return FLOW_TYPE.HELD;
  }

  function seasonalityForNode(node) {
    if (node.hydrationCategory === HYDRATION_CATEGORY.ARTERIAL_RIVER) return "perennial";
    if (node.hydrationCategory === HYDRATION_CATEGORY.TRIBUTARY_STREAM) return "mostly_perennial";
    if (node.hydrationCategory === HYDRATION_CATEGORY.SEASONAL_STREAM) return "seasonal";
    if (node.hydrationCategory === HYDRATION_CATEGORY.DESERT_WASH) return "flash_seasonal";
    if (node.hydrationCategory === HYDRATION_CATEGORY.DRY_GULLY) return "dry_seasonal";
    if (node.hydrationCategory === HYDRATION_CATEGORY.MARSH || node.hydrationCategory === HYDRATION_CATEGORY.WETLAND) return "slow_persistent";
    if (node.hydrationCategory === HYDRATION_CATEGORY.LAKE) return "retained";
    if (node.hydrationCategory === HYDRATION_CATEGORY.BASIN_LAKE) return "seasonal_retention";
    return "held";
  }

  function buildChannelEdges() {
    if (!UPSTREAM.packetReady) return Object.freeze([]);

    var edges = [];
    var seen = Object.create(null);

    for (var i = 0; i < HYDRATION_NODES.length; i += 1) {
      var from = HYDRATION_NODES[i];
      if (!channelEligible(from)) continue;

      var to = chooseDownhillNeighbor(from);
      if (!to || from.hydrationNodeId === to.hydrationNodeId) continue;

      var type = flowTypeForNode(from);
      if (type === FLOW_TYPE.HELD) continue;

      var gradient = from.elevation - to.elevation;
      var downhill = gradient >= -0.035;
      var flowStrength = clamp(
        from.sourcePressure * 0.26 +
        from.channelPressure * 0.30 +
        from.hydrationPressure * 0.18 +
        from.runoffPressure * 0.20 +
        to.basinPressure * 0.10,
        0,
        1
      );

      var id = edgeId(from.hydrationNodeId, to.hydrationNodeId, type);
      if (seen[id]) continue;
      seen[id] = true;

      var failure = downhill ? "" : "flow_edge_not_downhill_compliant";
      var coherence = downhill ? 1 : 0.58;

      edges.push(Object.freeze({
        edgeId: id,
        fromNodeId: from.hydrationNodeId,
        toNodeId: to.hydrationNodeId,
        fromSourceNodeId: from.sourceNodeId,
        toSourceNodeId: to.sourceNodeId,
        flowType: type,
        category: from.hydrationCategory,
        gradient: round(gradient, 4),
        flowStrength: round(flowStrength, 4),
        seasonality: seasonalityForNode(from),
        downhillCompliant: downhill,
        coherenceScore: round(coherence, 4),
        failureReason: failure,
        downstreamOwner: from.downstreamOwner,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      }));
    }

    return Object.freeze(edges);
  }

  var CHANNEL_EDGES = buildChannelEdges();

  function nodesByPredicate(predicate) {
    var list = [];
    for (var i = 0; i < HYDRATION_NODES.length; i += 1) {
      if (predicate(HYDRATION_NODES[i])) list.push(HYDRATION_NODES[i]);
    }
    return list;
  }

  function edgeByFromNodeId(nodeIdValue) {
    return CHANNEL_EDGES.filter(function (edge) {
      return edge.fromNodeId === nodeIdValue;
    });
  }

  function selectNodesForRiver(blueprint) {
    var sourceCandidates = nodesByPredicate(function (node) {
      return node.continentMembership &&
        blueprint.sourcePreference.indexOf(node.terrainClass) >= 0 &&
        (
          node.hydrationCategory === HYDRATION_CATEGORY.MOUNTAIN_SOURCE ||
          node.hydrationCategory === HYDRATION_CATEGORY.HEADWATER ||
          node.hydrationCategory === HYDRATION_CATEGORY.SPRING ||
          node.sourcePressure > 0.46
        );
    }).sort(function (a, b) {
      return b.sourcePressure - a.sourcePressure;
    }).slice(0, 3);

    var channelCandidates = nodesByPredicate(function (node) {
      return node.continentMembership &&
        blueprint.channelPreference.indexOf(node.terrainClass) >= 0 &&
        (
          node.hydrationCategory === HYDRATION_CATEGORY.ARTERIAL_RIVER ||
          node.hydrationCategory === HYDRATION_CATEGORY.TRIBUTARY_STREAM ||
          node.hydrationCategory === HYDRATION_CATEGORY.SEASONAL_STREAM ||
          node.channelPressure > 0.42
        );
    }).sort(function (a, b) {
      var aBias = directionalBias(a, blueprint.directionBias);
      var bBias = directionalBias(b, blueprint.directionBias);
      return (b.channelPressure + bBias) - (a.channelPressure + aBias);
    }).slice(0, 8);

    var basinCandidates = nodesByPredicate(function (node) {
      return node.continentMembership &&
        (
          node.hydrationCategory === HYDRATION_CATEGORY.LAKE ||
          node.hydrationCategory === HYDRATION_CATEGORY.BASIN_LAKE ||
          node.basinPressure > 0.44
        );
    }).sort(function (a, b) {
      return b.lakePressure - a.lakePressure;
    }).slice(0, 4);

    var mouthCandidates = nodesByPredicate(function (node) {
      return blueprint.mouthPreference.indexOf(node.terrainClass) >= 0 ||
        node.hydrationCategory === HYDRATION_CATEGORY.COAST_RETURN ||
        node.coastReturnPressure > 0.50 ||
        node.marshWetlandPressure > 0.50;
    }).sort(function (a, b) {
      return (b.coastReturnPressure + b.marshWetlandPressure) - (a.coastReturnPressure + a.marshWetlandPressure);
    }).slice(0, 3);

    return {
      sources: sourceCandidates,
      channels: channelCandidates,
      basins: basinCandidates,
      mouths: mouthCandidates
    };
  }

  function directionalBias(node, direction) {
    var dx = (node.x - 7.5) / 7.5;
    var dy = (node.y - 7.5) / 7.5;
    return dx * direction.x * 0.10 + dy * direction.y * 0.10;
  }

  function buildRiverSystems() {
    if (!UPSTREAM.packetReady) return Object.freeze([]);

    var systems = [];

    for (var i = 0; i < RIVER_BLUEPRINTS.length; i += 1) {
      var blueprint = RIVER_BLUEPRINTS[i];
      var selected = selectNodesForRiver(blueprint);

      var allNodeIds = []
        .concat(selected.sources.map(function (node) { return node.hydrationNodeId; }))
        .concat(selected.channels.map(function (node) { return node.hydrationNodeId; }))
        .concat(selected.basins.map(function (node) { return node.hydrationNodeId; }))
        .concat(selected.mouths.map(function (node) { return node.hydrationNodeId; }));

      var unique = [];
      var seen = Object.create(null);
      for (var j = 0; j < allNodeIds.length; j += 1) {
        if (!seen[allNodeIds[j]]) {
          unique.push(allNodeIds[j]);
          seen[allNodeIds[j]] = true;
        }
      }

      var relatedEdges = CHANNEL_EDGES.filter(function (edge) {
        return unique.indexOf(edge.fromNodeId) >= 0 || unique.indexOf(edge.toNodeId) >= 0;
      });

      var continuity = relatedEdges.length ? clamp(relatedEdges.length / Math.max(4, unique.length), 0, 1) : 0;
      var downhillEdges = relatedEdges.filter(function (edge) { return edge.downhillCompliant; }).length;
      var downhillScore = relatedEdges.length ? downhillEdges / relatedEdges.length : 0;

      systems.push(Object.freeze({
        riverId: blueprint.riverId,
        name: blueprint.name,
        role: blueprint.role,
        sourceNodeIds: selected.sources.map(function (node) { return node.hydrationNodeId; }),
        mainChannelNodeIds: selected.channels.map(function (node) { return node.hydrationNodeId; }),
        tributaryNodeIds: relatedEdges
          .filter(function (edge) { return edge.flowType === FLOW_TYPE.VEIN || edge.flowType === FLOW_TYPE.CAPILLARY; })
          .map(function (edge) { return edge.fromNodeId; }),
        basinNodeIds: selected.basins.map(function (node) { return node.hydrationNodeId; }),
        mouthNodeIds: selected.mouths.map(function (node) { return node.hydrationNodeId; }),
        channelEdgeIds: relatedEdges.map(function (edge) { return edge.edgeId; }),
        flowContinuityScore: round(continuity, 4),
        downhillComplianceScore: round(downhillScore, 4),
        seasonality: blueprint.seasonality,
        renderTier: RENDER_TIERS.T2,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      }));
    }

    return Object.freeze(systems);
  }

  var RIVER_SYSTEMS = buildRiverSystems();

  function allNEWSComplete() {
    return HYDRATION_NODES.every(function (node) {
      return Boolean(
        node.newsComplete === true &&
        node.north && node.north.defined === true &&
        node.east && node.east.defined === true &&
        node.west && node.west.defined === true &&
        node.south && node.south.defined === true &&
        node.NEWS && node.NEWS.complete === true
      );
    });
  }

  function countNodes(predicate) {
    var count = 0;
    for (var i = 0; i < HYDRATION_NODES.length; i += 1) {
      if (predicate(HYDRATION_NODES[i])) count += 1;
    }
    return count;
  }

  function averageNodes(getter) {
    if (!HYDRATION_NODES.length) return 0;
    var total = 0;
    for (var i = 0; i < HYDRATION_NODES.length; i += 1) {
      total += Number(getter(HYDRATION_NODES[i])) || 0;
    }
    return round(total / HYDRATION_NODES.length, 4);
  }

  function hydrationHardFailCount() {
    return countNodes(function (node) { return node.hardFail; }) +
      CHANNEL_EDGES.filter(function (edge) { return !edge.downhillCompliant; }).length;
  }

  function hydrationWarningCount() {
    var warnings = 0;
    for (var i = 0; i < HYDRATION_NODES.length; i += 1) {
      warnings += HYDRATION_NODES[i].constraintWarnings.length;
    }
    return warnings;
  }

  function metricCountForCategories(categories) {
    return countNodes(function (node) {
      return categories.indexOf(node.hydrationCategory) >= 0;
    });
  }

  function flowContinuityScore() {
    if (!RIVER_SYSTEMS.length) return 0;
    var total = 0;
    for (var i = 0; i < RIVER_SYSTEMS.length; i += 1) {
      total += RIVER_SYSTEMS[i].flowContinuityScore;
    }
    return round(total / RIVER_SYSTEMS.length, 4);
  }

  function downhillComplianceScore() {
    if (!CHANNEL_EDGES.length) return 0;
    var good = CHANNEL_EDGES.filter(function (edge) { return edge.downhillCompliant; }).length;
    return round(good / CHANNEL_EDGES.length, 4);
  }

  function basinCaptureScore() {
    var basinNodes = nodesByPredicate(function (node) {
      return node.basinPressure > 0.44 || node.hydrationCategory === HYDRATION_CATEGORY.BASIN_LAKE || node.hydrationCategory === HYDRATION_CATEGORY.LAKE;
    });

    if (!basinNodes.length) return 0;

    var total = 0;
    for (var i = 0; i < basinNodes.length; i += 1) {
      total += clamp(basinNodes[i].lakePressure + basinNodes[i].hydrationPressure * 0.30, 0, 1);
    }

    return round(total / basinNodes.length, 4);
  }

  function desertSeparationScore() {
    var desertNodes = metricCountForCategories([
      HYDRATION_CATEGORY.DESERT_DRY_ZONE,
      HYDRATION_CATEGORY.RAIN_SHADOW_DESERT,
      HYDRATION_CATEGORY.DESERT_WASH,
      HYDRATION_CATEGORY.DRY_GULLY
    ]);

    var wetNodes = metricCountForCategories([
      HYDRATION_CATEGORY.ARTERIAL_RIVER,
      HYDRATION_CATEGORY.TRIBUTARY_STREAM,
      HYDRATION_CATEGORY.LAKE,
      HYDRATION_CATEGORY.BASIN_LAKE,
      HYDRATION_CATEGORY.MARSH,
      HYDRATION_CATEGORY.WETLAND
    ]);

    if (!HYDRATION_NODES.length) return 0;

    var desertRatio = desertNodes / HYDRATION_NODES.length;
    var wetRatio = wetNodes / HYDRATION_NODES.length;

    return round(clamp(desertRatio * 1.6 + wetRatio * 0.5, 0, 1), 4);
  }

  function mountainSourceScore() {
    var mountainNodes = metricCountForCategories([
      HYDRATION_CATEGORY.MOUNTAIN_SOURCE,
      HYDRATION_CATEGORY.HEADWATER,
      HYDRATION_CATEGORY.SPRING,
      HYDRATION_CATEGORY.WATERFALL
    ]);

    return round(clamp(mountainNodes / 10, 0, 1), 4);
  }

  function coastReturnScore() {
    var coastNodes = metricCountForCategories([HYDRATION_CATEGORY.COAST_RETURN]);
    return round(clamp(coastNodes / 6, 0, 1), 4);
  }

  function marshTransitionScore() {
    var marshNodes = metricCountForCategories([
      HYDRATION_CATEGORY.MARSH,
      HYDRATION_CATEGORY.WETLAND,
      HYDRATION_CATEGORY.RIPARIAN
    ]);

    return round(clamp(marshNodes / 8, 0, 1), 4);
  }

  function hydrationRuntimeMetrics() {
    var estimatedDrawUnits = HYDRATION_NODES.length + CHANNEL_EDGES.length + RIVER_SYSTEMS.length * 4;
    var mobileClass = estimatedDrawUnits <= 300 ? "mobile_safe" : estimatedDrawUnits <= 520 ? "mobile_medium" : "mobile_high";
    var desktopClass = estimatedDrawUnits <= 540 ? "desktop_safe" : estimatedDrawUnits <= 900 ? "desktop_medium" : "desktop_high";

    return {
      runtimeMetricsReady: UPSTREAM.packetReady,
      runtimeStrengthHeld: true,
      runtimeActivationAuthorized: false,

      hydrationNodeCount: HYDRATION_NODES.length,
      sourceNodeCount: metricCountForCategories([
        HYDRATION_CATEGORY.MOUNTAIN_SOURCE,
        HYDRATION_CATEGORY.HEADWATER,
        HYDRATION_CATEGORY.SPRING
      ]),
      mountainSourceNodeCount: metricCountForCategories([HYDRATION_CATEGORY.MOUNTAIN_SOURCE]),
      riverNodeCount: metricCountForCategories([HYDRATION_CATEGORY.ARTERIAL_RIVER]),
      streamNodeCount: metricCountForCategories([
        HYDRATION_CATEGORY.TRIBUTARY_STREAM,
        HYDRATION_CATEGORY.SEASONAL_STREAM
      ]),
      gullyNodeCount: metricCountForCategories([
        HYDRATION_CATEGORY.GULLY,
        HYDRATION_CATEGORY.DRY_GULLY,
        HYDRATION_CATEGORY.DESERT_WASH,
        HYDRATION_CATEGORY.FLASH_FLOOD_WASH
      ]),
      lakeNodeCount: metricCountForCategories([
        HYDRATION_CATEGORY.LAKE,
        HYDRATION_CATEGORY.SEASONAL_LAKE,
        HYDRATION_CATEGORY.BASIN_LAKE,
        HYDRATION_CATEGORY.SALT_LAKE
      ]),
      basinNodeCount: countNodes(function (node) {
        return node.basinPressure > 0.44;
      }),
      marshNodeCount: metricCountForCategories([HYDRATION_CATEGORY.MARSH]),
      wetlandNodeCount: metricCountForCategories([HYDRATION_CATEGORY.WETLAND]),
      desertNodeCount: metricCountForCategories([
        HYDRATION_CATEGORY.DESERT_DRY_ZONE,
        HYDRATION_CATEGORY.RAIN_SHADOW_DESERT,
        HYDRATION_CATEGORY.DESERT_WASH,
        HYDRATION_CATEGORY.DRY_GULLY
      ]),
      waterfallCandidateCount: metricCountForCategories([HYDRATION_CATEGORY.WATERFALL]),
      coastReturnNodeCount: metricCountForCategories([HYDRATION_CATEGORY.COAST_RETURN]),
      aquiferHeldNodeCount: metricCountForCategories([HYDRATION_CATEGORY.AQUIFER_HELD]),

      channelEdgeCount: CHANNEL_EDGES.length,
      riverSystemCount: RIVER_SYSTEMS.length,

      flowContinuityScore: flowContinuityScore(),
      downhillComplianceScore: downhillComplianceScore(),
      basinCaptureScore: basinCaptureScore(),
      desertSeparationScore: desertSeparationScore(),
      mountainSourceScore: mountainSourceScore(),
      coastReturnScore: coastReturnScore(),
      marshTransitionScore: marshTransitionScore(),
      hydrationCoherenceAverage: averageNodes(function (node) { return node.coherenceScore; }),
      hydrationHardFailCount: hydrationHardFailCount(),
      hydrationWarningCount: hydrationWarningCount(),

      hydrationRenderTier: RENDER_TIERS.T4,
      authorizedRenderTiers: [RENDER_TIERS.T0, RENDER_TIERS.T1, RENDER_TIERS.T2, RENDER_TIERS.T3, RENDER_TIERS.T4],
      heldRenderTiers: [RENDER_TIERS.T5],
      estimatedHydrationDrawUnits: estimatedDrawUnits,
      mobileHydrationCostClass: mobileClass,
      desktopHydrationCostClass: desktopClass
    };
  }

  var HYDRATION_RUNTIME_METRICS = Object.freeze(hydrationRuntimeMetrics());

  function compactHydrationNode(node) {
    return {
      hydrationNodeId: node.hydrationNodeId,
      sourceNodeId: node.sourceNodeId,
      x: node.x,
      y: node.y,
      terrainClass: node.terrainClass,
      elevation: node.elevation,
      hydrationCategory: node.hydrationCategory,
      hydrationClass: node.hydrationClass,
      bloodstreamRole: node.bloodstreamRole,
      coherenceScore: node.coherenceScore,
      renderTier: node.renderTier
    };
  }

  function compactEdge(edge) {
    return {
      edgeId: edge.edgeId,
      fromNodeId: edge.fromNodeId,
      toNodeId: edge.toNodeId,
      flowType: edge.flowType,
      category: edge.category,
      gradient: edge.gradient,
      flowStrength: edge.flowStrength,
      seasonality: edge.seasonality,
      downhillCompliant: edge.downhillCompliant
    };
  }

  function status() {
    if (!UPSTREAM.packetReady) return boundedStatus();

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      upstreamFile: UPSTREAM_FILE,

      childType: "hydration_bloodstream_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      childClass: CHILD_CLASS,

      hydrationBloodstreamSystem: true,
      upstreamDetected: UPSTREAM.detected,
      upstreamPacketReady: UPSTREAM.packetReady,
      terrainCoordinatesConsumed: true,

      mountainRangesReserved: true,
      desertLandMapped: true,
      lakesMapped: true,
      oceansMappedAsReturnContext: true,
      riversMapped: true,
      streamsMapped: true,
      gulliesMapped: true,
      waterfallsMapped: true,
      marshesMapped: true,
      wetlandsMapped: true,
      aquiferHeldMapped: true,
      coastReturnMapped: true,

      waterPaintForbidden: true,
      bloodstreamModelActive: true,
      hydrationNewsProtocolActive: true,
      hydrationNewsOrder: NEWS_ORDER.slice(),
      hydrationNewsComplete: allNEWSComplete(),
      runtimeMetricsReady: true,
      downstreamCategoryReady: true,

      hydrationNodeCount: HYDRATION_NODES.length,
      channelEdgeCount: CHANNEL_EDGES.length,
      riverSystemCount: RIVER_SYSTEMS.length,
      runtimeMetrics: deepClone(HYDRATION_RUNTIME_METRICS),

      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      runtimeStrengthHeld: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      upstreamTerrainEngineUntouched: true,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      deployMarker: "AUDRALIA_GRATITUDE_HYDRATION_BLOODSTREAM_SYSTEM_MAP_DEPLOY_MARKER_v1"
    };
  }

  function getHydrationNodeMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      upstreamDetected: UPSTREAM.detected,
      upstreamPacketReady: UPSTREAM.packetReady,
      hydrationNodeMapReady: UPSTREAM.packetReady,
      nodeCount: HYDRATION_NODES.length,
      nodes: compact ? HYDRATION_NODES.map(compactHydrationNode) : HYDRATION_NODES.map(deepClone)
    };
  }

  function getHydrationNEWSMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      hydrationNewsProtocolActive: true,
      hydrationNewsComplete: allNEWSComplete(),
      newsOrder: NEWS_ORDER.slice(),
      nodes: compact ? HYDRATION_NODES.map(function (node) {
        return {
          hydrationNodeId: node.hydrationNodeId,
          north: node.north.defined,
          east: node.east.defined,
          west: node.west.defined,
          south: node.south.defined,
          category: node.hydrationCategory
        };
      }) : HYDRATION_NODES.map(function (node) {
        return {
          hydrationNodeId: node.hydrationNodeId,
          NEWS: deepClone(node.NEWS)
        };
      })
    };
  }

  function getHydrationCoherenceMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      hydrationCoherenceActive: true,
      hydrationHardFailCount: hydrationHardFailCount(),
      hydrationWarningCount: hydrationWarningCount(),
      hydrationCoherenceAverage: HYDRATION_RUNTIME_METRICS.hydrationCoherenceAverage,
      rules: [
        "water_must_flow_downhill",
        "summit_cannot_be_marsh_primary",
        "ridge_cannot_be_lake_primary",
        "lake_requires_basin_or_capture_logic",
        "river_requires_gradient_path",
        "waterfall_requires_steep_elevation_drop",
        "marsh_requires_low_gradient_wetness_sediment_and_retention",
        "desert_wash_cannot_classify_as_permanent_river",
        "coast_delta_or_estuary_requires_boundary_adjacency",
        "ocean_is_return_context_not_inland_hydration_ownership",
        "urban_remains_held"
      ],
      nodes: compact ? HYDRATION_NODES.map(function (node) {
        return {
          hydrationNodeId: node.hydrationNodeId,
          category: node.hydrationCategory,
          coherenceScore: node.coherenceScore,
          hardFail: node.hardFail,
          warningCount: node.constraintWarnings.length
        };
      }) : HYDRATION_NODES.map(function (node) {
        return {
          hydrationNodeId: node.hydrationNodeId,
          category: node.hydrationCategory,
          coherenceScore: node.coherenceScore,
          hardFail: node.hardFail,
          failures: node.constraintFailures,
          warnings: node.constraintWarnings
        };
      }),
      channelEdges: CHANNEL_EDGES.map(function (edge) {
        return {
          edgeId: edge.edgeId,
          downhillCompliant: edge.downhillCompliant,
          coherenceScore: edge.coherenceScore,
          failureReason: edge.failureReason
        };
      })
    };
  }

  function getHydrationRuntimeMetrics() {
    return deepClone(HYDRATION_RUNTIME_METRICS);
  }

  function mapByCategories(categories, compact) {
    var nodes = HYDRATION_NODES.filter(function (node) {
      return categories.indexOf(node.hydrationCategory) >= 0;
    });

    return compact ? nodes.map(compactHydrationNode) : nodes.map(deepClone);
  }

  function getWaterSourceMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      waterSourceMapReady: UPSTREAM.packetReady,
      mountainRangesReserved: true,
      sourceNodes: mapByCategories([
        HYDRATION_CATEGORY.MOUNTAIN_SOURCE,
        HYDRATION_CATEGORY.HEADWATER,
        HYDRATION_CATEGORY.SPRING
      ], compact),
      waterfallCandidates: mapByCategories([HYDRATION_CATEGORY.WATERFALL], compact)
    };
  }

  function getRiverSystemMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      riverSystemMapReady: UPSTREAM.packetReady,
      riverSystemCount: RIVER_SYSTEMS.length,
      riverSystems: compact ? RIVER_SYSTEMS.map(function (river) {
        return {
          riverId: river.riverId,
          name: river.name,
          sourceNodeIds: river.sourceNodeIds,
          mainChannelNodeIds: river.mainChannelNodeIds,
          mouthNodeIds: river.mouthNodeIds,
          flowContinuityScore: river.flowContinuityScore,
          downhillComplianceScore: river.downhillComplianceScore
        };
      }) : RIVER_SYSTEMS.map(deepClone),
      channelEdges: compact ? CHANNEL_EDGES.map(compactEdge) : CHANNEL_EDGES.map(deepClone)
    };
  }

  function getStreamMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      streamMapReady: UPSTREAM.packetReady,
      streamsMapped: true,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.TRIBUTARY_STREAM,
        HYDRATION_CATEGORY.SEASONAL_STREAM,
        HYDRATION_CATEGORY.HEADWATER,
        HYDRATION_CATEGORY.SPRING
      ], compact),
      channelEdges: CHANNEL_EDGES.filter(function (edge) {
        return edge.flowType === FLOW_TYPE.VEIN || edge.flowType === FLOW_TYPE.CAPILLARY;
      }).map(compact ? compactEdge : deepClone)
    };
  }

  function getGullyMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      gullyMapReady: UPSTREAM.packetReady,
      gulliesMapped: true,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.GULLY,
        HYDRATION_CATEGORY.DRY_GULLY,
        HYDRATION_CATEGORY.FLASH_FLOOD_WASH,
        HYDRATION_CATEGORY.DESERT_WASH
      ], compact)
    };
  }

  function getLakeMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      lakeMapReady: UPSTREAM.packetReady,
      lakesMapped: true,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.LAKE,
        HYDRATION_CATEGORY.SEASONAL_LAKE,
        HYDRATION_CATEGORY.BASIN_LAKE,
        HYDRATION_CATEGORY.SALT_LAKE
      ], compact)
    };
  }

  function getBasinHydrationMap(options) {
    var compact = Boolean(options && options.compact);
    var nodes = HYDRATION_NODES.filter(function (node) {
      return node.basinPressure > 0.42 ||
        node.hydrationCategory === HYDRATION_CATEGORY.LAKE ||
        node.hydrationCategory === HYDRATION_CATEGORY.BASIN_LAKE ||
        node.hydrationCategory === HYDRATION_CATEGORY.SALT_LAKE;
    });

    return {
      contract: CONTRACT,
      basinHydrationMapReady: UPSTREAM.packetReady,
      basinNodeCount: nodes.length,
      nodes: compact ? nodes.map(compactHydrationNode) : nodes.map(deepClone)
    };
  }

  function getMarshWetlandMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      marshWetlandMapReady: UPSTREAM.packetReady,
      marshesMapped: true,
      wetlandsMapped: true,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.MARSH,
        HYDRATION_CATEGORY.WETLAND,
        HYDRATION_CATEGORY.RIPARIAN
      ], compact)
    };
  }

  function getDesertDrynessMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      desertDrynessMapReady: UPSTREAM.packetReady,
      desertLandMapped: true,
      desertSeparationScore: HYDRATION_RUNTIME_METRICS.desertSeparationScore || 0,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.DESERT_DRY_ZONE,
        HYDRATION_CATEGORY.RAIN_SHADOW_DESERT,
        HYDRATION_CATEGORY.DESERT_WASH,
        HYDRATION_CATEGORY.DRY_GULLY
      ], compact)
    };
  }

  function getWaterfallMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      waterfallMapReady: UPSTREAM.packetReady,
      waterfallsMapped: true,
      nodes: mapByCategories([HYDRATION_CATEGORY.WATERFALL], compact)
    };
  }

  function getCoastReturnMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      coastReturnMapReady: UPSTREAM.packetReady,
      coastReturnMapped: true,
      oceansMappedAsReturnContext: true,
      oceanOwnedByHydrosphereCarrier: true,
      inlandHydrationOwnsOcean: false,
      nodes: mapByCategories([
        HYDRATION_CATEGORY.COAST_RETURN,
        HYDRATION_CATEGORY.DELTA,
        HYDRATION_CATEGORY.ESTUARY
      ], compact)
    };
  }

  function getAquiferHeldMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      aquiferHeldMapReady: UPSTREAM.packetReady,
      aquiferHeldMapped: true,
      nodes: mapByCategories([HYDRATION_CATEGORY.AQUIFER_HELD], compact)
    };
  }

  function getHydrationReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: target || "unassigned-downstream-consumer",
      childReceivePacketReady: UPSTREAM.packetReady,
      childType: "hydration_bloodstream_child",

      upstreamDetected: UPSTREAM.detected,
      upstreamPacketReady: UPSTREAM.packetReady,
      upstreamFailureReason: UPSTREAM.failureReason,

      hydrationBloodstreamSystem: true,
      terrainCoordinatesConsumed: UPSTREAM.packetReady,
      mountainRangesReserved: UPSTREAM.packetReady,
      desertLandMapped: UPSTREAM.packetReady,
      lakesMapped: UPSTREAM.packetReady,
      oceansMappedAsReturnContext: UPSTREAM.packetReady,
      riversMapped: UPSTREAM.packetReady,
      streamsMapped: UPSTREAM.packetReady,
      gulliesMapped: UPSTREAM.packetReady,
      waterfallsMapped: UPSTREAM.packetReady,
      marshesMapped: UPSTREAM.packetReady,
      wetlandsMapped: UPSTREAM.packetReady,
      aquiferHeldMapped: UPSTREAM.packetReady,
      coastReturnMapped: UPSTREAM.packetReady,
      waterPaintForbidden: true,
      bloodstreamModelActive: UPSTREAM.packetReady,

      hydrationNewsProtocolActive: true,
      hydrationNewsComplete: allNEWSComplete(),
      runtimeMetricsReady: UPSTREAM.packetReady,
      downstreamCategoryReady: UPSTREAM.packetReady,

      carrierConsumptionAllowedAfterValidation: UPSTREAM.packetReady,
      carrierRenderAuthorized: false,
      runtimeStrengthHeld: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      status: status(),
      hydrationRuntimeMetrics: getHydrationRuntimeMetrics(),
      hydrationNodeMap: getHydrationNodeMap({ compact: compact }),
      hydrationNEWSMap: getHydrationNEWSMap({ compact: compact }),
      hydrationCoherenceMap: getHydrationCoherenceMap({ compact: compact }),
      waterSourceMap: getWaterSourceMap({ compact: compact }),
      riverSystemMap: getRiverSystemMap({ compact: compact }),
      streamMap: getStreamMap({ compact: compact }),
      gullyMap: getGullyMap({ compact: compact }),
      lakeMap: getLakeMap({ compact: compact }),
      basinHydrationMap: getBasinHydrationMap({ compact: compact }),
      marshWetlandMap: getMarshWetlandMap({ compact: compact }),
      desertDrynessMap: getDesertDrynessMap({ compact: compact }),
      waterfallMap: getWaterfallMap({ compact: compact }),
      coastReturnMap: getCoastReturnMap({ compact: compact }),
      aquiferHeldMap: getAquiferHeldMap({ compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    specOps: SPEC_OPS,
    file: FILE,
    upstreamFile: UPSTREAM_FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    childClass: CHILD_CLASS,

    status: status,
    getHydrationNodeMap: getHydrationNodeMap,
    getHydrationNEWSMap: getHydrationNEWSMap,
    getHydrationCoherenceMap: getHydrationCoherenceMap,
    getHydrationRuntimeMetrics: getHydrationRuntimeMetrics,
    getWaterSourceMap: getWaterSourceMap,
    getRiverSystemMap: getRiverSystemMap,
    getStreamMap: getStreamMap,
    getGullyMap: getGullyMap,
    getLakeMap: getLakeMap,
    getBasinHydrationMap: getBasinHydrationMap,
    getMarshWetlandMap: getMarshWetlandMap,
    getDesertDrynessMap: getDesertDrynessMap,
    getWaterfallMap: getWaterfallMap,
    getCoastReturnMap: getCoastReturnMap,
    getAquiferHeldMap: getAquiferHeldMap,
    getHydrationReceivePacket: getHydrationReceivePacket,

    // Consumer compatibility aliases.
    getChildReceivePacket: getHydrationReceivePacket,
    getHydrationMap: getHydrationNodeMap
  });

  window.AUDRALIA_GRATITUDE_HYDRATION_CHILD = API;
  window.AUDRALIA_GRATITUDE_HYDRATION_CHILD_STATUS = status();
  window.AUDRALIA_GRATITUDE_HYDRATION_RECEIVE_PACKET = getHydrationReceivePacket("published-static-hydration-bloodstream-system", { compact: true });
  window.AUDRALIA_GRATITUDE_HYDRATION_RUNTIME_METRICS = getHydrationRuntimeMetrics();
})();
