// /assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js
// AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_TNT_v1
// Full-file creation/replacement.
// Scope: downstream Gratitude surface-habitability field-blueprint child.
// Purpose: consume the Gratitude terrain engine and Gratitude hydration bloodstream child, then compute
// terrain, hydration, thermal, pressure, atmosphere, air-quality, carbon/oxygen, stability, and viability fields.
// Core law: few strong primary fields -> many lawful natural expressions.
// Does not own: HTML, carrier rendering, core physics, upstream terrain engine, hydration child,
// final climate authority, final atmosphere authority, ecology activation, settlement activation,
// urban activation, Runtime / Strength, final terrain pass, final hydration pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_TNT_v1";
  var SPEC_OPS = "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_SPEC_OPS_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js";
  var TERRAIN_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var HYDRATION_FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var CHILD_CLASS = "downstream_surface_habitability_field_blueprint_child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;

  var FINAL_TERRAIN_PASS_CLAIM = false;
  var FINAL_HYDRATION_PASS_CLAIM = false;
  var FINAL_ECOLOGY_PASS_CLAIM = false;
  var FINAL_SETTLEMENT_PASS_CLAIM = false;
  var FINAL_VISUAL_PASS_CLAIM = false;
  var RUNTIME_STRENGTH_HELD = true;

  var NEWS_ORDER = Object.freeze(["north", "east", "west", "south"]);

  var RENDER_TIERS = Object.freeze({
    T0: "tier_0_receipt_only",
    T1: "tier_1_field_map",
    T2: "tier_2_natural_readout_map",
    T3: "tier_3_reciprocal_blueprint_map",
    T4: "tier_4_downstream_field_composite_held",
    T5: "tier_5_full_surface_habitability_render_held"
  });

  var NATURAL_EXPRESSION = Object.freeze({
    RIVER_PERSISTENCE: "river_persistence",
    LAKE_PERSISTENCE: "lake_persistence",
    MARSH_PERSISTENCE: "marsh_persistence",
    WETLAND_PERSISTENCE: "wetland_persistence",
    DESERT_CLASS: "desert_class",
    SNOWPACK_CLASS: "snowpack_class",
    FROST_LINE_CLASS: "frost_line_class",
    RAINFALL_ROUTING: "rainfall_routing",
    STORM_FORMATION: "storm_formation",
    FRONTAL_BOUNDARY: "frontal_boundary",
    WIND_CORRIDOR: "wind_corridor",
    AIR_QUALITY: "air_quality",
    BREATHABILITY: "breathability",
    ECOLOGY_HELD: "ecology_readiness_held",
    SETTLEMENT_HELD: "settlement_readiness_held"
  });

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

  function key(x, y) {
    return String(x) + "," + String(y);
  }

  function nodeId(x, y) {
    return "GRATITUDE-HABITABILITY-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function normalizeTerrainNode(node, index) {
    var x = Number.isFinite(Number(node.x)) ? Number(node.x) : index % RADIAL_NODES;
    var y = Number.isFinite(Number(node.y)) ? Number(node.y) : Math.floor(index / RADIAL_NODES);

    return {
      sourceNodeId: node.nodeId || node.seatKey || ("TERRAIN-" + index),
      nodeIndex: Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : index,
      seatIndex: Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : index,
      seatKey: node.seatKey || ("G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0")),
      x: x,
      y: y,
      centerX: Number.isFinite(Number(node.centerX)) ? Number(node.centerX) : x + 0.5,
      centerY: Number.isFinite(Number(node.centerY)) ? Number(node.centerY) : y + 0.5,

      continentMembership: node.continentMembership === true,
      primaryCategory: String(node.primaryCategory || "outside_continent"),
      secondaryCategories: safeArray(node.secondaryCategories),
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
      futureBiomeClassHeld: node.futureBiomeClassHeld || "biome_held",
      futureSettlementEligibilityHeld: node.futureSettlementEligibilityHeld || "settlement_held",
      coherenceScore: Number.isFinite(Number(node.coherenceScore)) ? Number(node.coherenceScore) : 1,
      hardFail: node.hardFail === true
    };
  }

  function normalizeHydrationNode(node, index) {
    var x = Number.isFinite(Number(node.x)) ? Number(node.x) : index % RADIAL_NODES;
    var y = Number.isFinite(Number(node.y)) ? Number(node.y) : Math.floor(index / RADIAL_NODES);

    return {
      hydrationNodeId: node.hydrationNodeId || node.nodeId || ("HYDRATION-" + index),
      sourceNodeId: node.sourceNodeId || "",
      nodeIndex: Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : index,
      x: x,
      y: y,
      centerX: Number.isFinite(Number(node.centerX)) ? Number(node.centerX) : x + 0.5,
      centerY: Number.isFinite(Number(node.centerY)) ? Number(node.centerY) : y + 0.5,

      continentMembership: node.continentMembership === true,
      terrainClass: String(node.terrainClass || "outside_gratitude_field"),
      upstreamHydrationClass: String(node.upstreamHydrationClass || node.hydrationClass || "outside_hydration_context"),
      hydrationCategory: String(node.hydrationCategory || "outside_hydration_context"),
      hydrationClass: String(node.hydrationClass || "outside_hydration_context"),
      bloodstreamRole: String(node.bloodstreamRole || "dry_tissue"),

      elevation: clamp(node.elevation, 0, 1),
      summitPressure: clamp(node.summitPressure, 0, 1),
      ridgePressure: clamp(node.ridgePressure, 0, 1),
      basinPressure: clamp(node.basinPressure, 0, 1),
      valleyPressure: clamp(node.valleyPressure, 0, 1),
      marshPressure: clamp(node.marshPressure, 0, 1),
      wetlandPressure: clamp(node.wetlandPressure, 0, 1),
      coastPressure: clamp(node.coastPressure, 0, 1),
      shelfPressure: clamp(node.shelfPressure, 0, 1),
      hydrationPressure: clamp(node.hydrationPressure, 0, 1),
      drainagePressure: clamp(node.drainagePressure, 0, 1),
      runoffPressure: clamp(node.runoffPressure, 0, 1),
      wetnessPressure: clamp(node.wetnessPressure, 0, 1),

      desertPressure: clamp(node.desertPressure, 0, 1),
      rainShadowPressure: clamp(node.rainShadowPressure, 0, 1),
      sourcePressure: clamp(node.sourcePressure, 0, 1),
      channelPressure: clamp(node.channelPressure, 0, 1),
      lakePressure: clamp(node.lakePressure, 0, 1),
      marshWetlandPressure: clamp(node.marshWetlandPressure, 0, 1),
      coastReturnPressure: clamp(node.coastReturnPressure, 0, 1),
      waterfallPressure: clamp(node.waterfallPressure, 0, 1),
      aquiferPressure: clamp(node.aquiferPressure, 0, 1),

      mountainRangeReserved: node.mountainRangeReserved === true,
      desertLandMapped: node.desertLandMapped === true,
      waterPaintForbidden: node.waterPaintForbidden !== false,
      waterObeysTerrain: node.waterObeysTerrain !== false,
      oceanContextOnly: node.oceanContextOnly === true,

      coherenceScore: Number.isFinite(Number(node.coherenceScore)) ? Number(node.coherenceScore) : 1,
      hardFail: node.hardFail === true
    };
  }

  function detectTerrainUpstream() {
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
      result.failureReason = "terrain upstream missing";
      return result;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getNodeMap !== "function" ||
      typeof api.getChildReceivePacket !== "function"
    ) {
      result.failureReason = "terrain upstream API incomplete";
      return result;
    }

    try {
      result.status = api.status();
      result.packet = api.getChildReceivePacket("surface-habitability-field-blueprint", { compact: false });
      result.nodeMap = api.getNodeMap({ compact: false });
      result.nodes = safeArray(result.nodeMap && result.nodeMap.nodes).map(normalizeTerrainNode);
      result.packetReady = Boolean(result.packet && result.packet.childReceivePacketReady === true && result.nodes.length === NODE_COUNT);
      if (!result.packetReady) result.failureReason = "terrain upstream packet not ready or node count mismatch";
      return result;
    } catch (error) {
      result.failureReason = error && error.message ? error.message : String(error || "terrain upstream exception");
      return result;
    }
  }

  function detectHydrationUpstream() {
    var api = window.AUDRALIA_GRATITUDE_HYDRATION_CHILD || null;
    var result = {
      api: api,
      detected: Boolean(api),
      packetReady: false,
      status: null,
      packet: null,
      nodeMap: null,
      nodes: [],
      nodeByKey: Object.create(null),
      metrics: null,
      failureReason: ""
    };

    if (!api) {
      result.failureReason = "hydration upstream missing";
      return result;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getHydrationNodeMap !== "function" ||
      typeof api.getHydrationReceivePacket !== "function"
    ) {
      result.failureReason = "hydration upstream API incomplete";
      return result;
    }

    try {
      result.status = api.status();
      result.packet = api.getHydrationReceivePacket("surface-habitability-field-blueprint", { compact: false });
      result.nodeMap = api.getHydrationNodeMap({ compact: false });
      result.nodes = safeArray(result.nodeMap && result.nodeMap.nodes).map(normalizeHydrationNode);
      result.metrics = typeof api.getHydrationRuntimeMetrics === "function" ? api.getHydrationRuntimeMetrics() : null;
      result.packetReady = Boolean(result.packet && result.packet.childReceivePacketReady === true && result.nodes.length === NODE_COUNT);

      result.nodes.forEach(function (node) {
        result.nodeByKey[key(node.x, node.y)] = node;
      });

      if (!result.packetReady) result.failureReason = "hydration upstream packet not ready or node count mismatch";
      return result;
    } catch (error) {
      result.failureReason = error && error.message ? error.message : String(error || "hydration upstream exception");
      return result;
    }
  }

  var TERRAIN_UPSTREAM = detectTerrainUpstream();
  var HYDRATION_UPSTREAM = detectHydrationUpstream();

  function boundedStatus() {
    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      terrainFile: TERRAIN_FILE,
      hydrationFile: HYDRATION_FILE,
      childType: "surface_habitability_field_blueprint_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      childClass: CHILD_CLASS,

      surfaceHabitabilityFieldBlueprint: true,
      terrainUpstreamDetected: TERRAIN_UPSTREAM.detected,
      hydrationUpstreamDetected: HYDRATION_UPSTREAM.detected,
      terrainUpstreamPacketReady: TERRAIN_UPSTREAM.packetReady,
      hydrationUpstreamPacketReady: HYDRATION_UPSTREAM.packetReady,
      terrainFailureReason: TERRAIN_UPSTREAM.failureReason,
      hydrationFailureReason: HYDRATION_UPSTREAM.failureReason,

      terrainCoordinatesConsumed: false,
      hydrationBloodstreamConsumed: false,
      surfaceHabitabilityReady: false,
      reciprocalBlueprintReady: false,

      runtimeStrengthHeld: true,
      carrierRenderAuthorized: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      boundedFailure: true
    };
  }

  function elevationBand(elevation) {
    if (elevation >= 0.78) return "summit_band";
    if (elevation >= 0.64) return "highland_band";
    if (elevation >= 0.50) return "upland_band";
    if (elevation >= 0.36) return "lowland_band";
    if (elevation > 0.00) return "basin_floor_band";
    return "outside_or_ocean_context";
  }

  function temperatureBand(celsius) {
    if (celsius <= -4) return "freezing_band";
    if (celsius <= 4) return "cold_band";
    if (celsius <= 14) return "cool_band";
    if (celsius <= 24) return "temperate_band";
    if (celsius <= 34) return "warm_band";
    return "hot_band";
  }

  function pressureBand(kpa) {
    if (kpa < 83) return "thin_highland_pressure";
    if (kpa < 92) return "reduced_upland_pressure";
    if (kpa < 99) return "normalizing_pressure";
    if (kpa < 103) return "standard_surface_pressure";
    return "heavy_lowland_pressure";
  }

  function classifyWaterState(tempC, waterAvailability, snowpack, evaporation) {
    if (snowpack > 0.52 && tempC <= 3) return "snow_or_ice_held";
    if (waterAvailability > 0.58 && evaporation < 0.48) return "liquid_persistent";
    if (waterAvailability > 0.34 && evaporation < 0.66) return "liquid_seasonal";
    if (waterAvailability > 0.18) return "intermittent_or_evaporating";
    return "dry_or_vapor_limited";
  }

  function buildTerrainField(tn) {
    var slopePressure = clamp(tn.ridgePressure * 0.32 + tn.valleyPressure * 0.24 + Math.abs(tn.elevation - tn.baseElevation) * 0.60, 0, 1);
    var mountainReservation = clamp(tn.summitPressure * 0.42 + tn.ridgePressure * 0.38 + (tn.elevation > 0.66 ? 0.20 : 0), 0, 1);
    var desertPotential = clamp((1 - tn.wetnessPressure) * 0.22 + (1 - tn.hydrationPressure) * 0.24 + tn.ridgePressure * 0.10 + (tn.basinPressure > 0.34 && tn.hydrationPressure < 0.28 ? 0.18 : 0), 0, 1);
    var coastBoundary = clamp(tn.coastPressure * 0.70 + tn.shelfPressure * 0.30, 0, 1);

    return Object.freeze({
      ready: true,
      elevation: round(tn.elevation, 4),
      baseElevation: round(tn.baseElevation, 4),
      elevationBand: elevationBand(tn.elevation),
      slopePressure: round(slopePressure, 4),
      ridgePressure: round(tn.ridgePressure, 4),
      basinPressure: round(tn.basinPressure, 4),
      valleyPressure: round(tn.valleyPressure, 4),
      coastPressure: round(tn.coastPressure, 4),
      shelfPressure: round(tn.shelfPressure, 4),
      coastBoundaryPressure: round(coastBoundary, 4),
      desertPotential: round(desertPotential, 4),
      mountainReservation: round(mountainReservation, 4),
      terrainClass: tn.terrainClass,
      primaryCategory: tn.primaryCategory,
      continentMembership: tn.continentMembership,
      terrainAuthorityRetained: true
    });
  }

  function buildHydrationField(tn, hn) {
    var waterAvailability = clamp(
      tn.hydrationPressure * 0.24 +
      tn.wetnessPressure * 0.20 +
      hn.hydrationPressure * 0.24 +
      hn.channelPressure * 0.12 +
      hn.lakePressure * 0.12 +
      hn.marshWetlandPressure * 0.10 -
      hn.desertPressure * 0.16,
      0,
      1
    );

    var waterTable = clamp(
      tn.basinPressure * 0.22 +
      tn.valleyPressure * 0.18 +
      hn.aquiferPressure * 0.26 +
      waterAvailability * 0.22 +
      tn.soilPressure * 0.12,
      0,
      1
    );

    var retention = clamp(tn.basinPressure * 0.30 + hn.lakePressure * 0.24 + hn.marshWetlandPressure * 0.20 + waterTable * 0.18, 0, 1);
    var flowPotential = clamp(hn.channelPressure * 0.32 + tn.valleyPressure * 0.24 + tn.runoffPressure * 0.20 + hn.sourcePressure * 0.14, 0, 1);
    var evaporationLoss = clamp(hn.desertPressure * 0.24 + (1 - waterTable) * 0.18 + tn.coastPressure * 0.05, 0, 1);

    return Object.freeze({
      ready: true,
      hydrationCategory: hn.hydrationCategory,
      hydrationClass: hn.hydrationClass,
      bloodstreamRole: hn.bloodstreamRole,
      waterAvailability: round(waterAvailability, 4),
      runoffPotential: round(clamp(tn.runoffPressure * 0.44 + hn.runoffPressure * 0.34 + tn.ridgePressure * 0.12, 0, 1), 4),
      waterTable: round(waterTable, 4),
      flowPotential: round(flowPotential, 4),
      retentionPotential: round(retention, 4),
      aquiferPressure: round(hn.aquiferPressure, 4),
      evaporationLoss: round(evaporationLoss, 4),
      riverPersistencePressure: round(clamp(flowPotential * 0.44 + waterAvailability * 0.24 + (1 - evaporationLoss) * 0.16, 0, 1), 4),
      lakePersistencePressure: round(clamp(retention * 0.46 + waterAvailability * 0.24 + tn.basinPressure * 0.18 - evaporationLoss * 0.18, 0, 1), 4),
      marshPersistencePressure: round(clamp(hn.marshWetlandPressure * 0.42 + waterTable * 0.22 + tn.soilPressure * 0.16 - evaporationLoss * 0.12, 0, 1), 4),
      waterObeysTerrain: hn.waterObeysTerrain !== false,
      waterPaintForbidden: true,
      hydrationAuthorityRetained: true
    });
  }

  function buildThermalField(tn, terrainField, hydrationField) {
    var latitudeHeat = clamp((tn.y - 2) / 14, 0, 1);
    var altitudeCooling = tn.elevation * 22;
    var desertHeat = terrainField.desertPotential * 10;
    var waterModeration = hydrationField.waterAvailability * 7;
    var coastModeration = terrainField.coastBoundaryPressure * 4;
    var baseTempC = 27 + latitudeHeat * 7 - altitudeCooling + desertHeat - waterModeration - coastModeration;
    var seasonalShift = clamp(8 + tn.ridgePressure * 6 + terrainField.desertPotential * 5 - terrainField.coastBoundaryPressure * 4, 3, 22);
    var heatPressure = clamp((baseTempC - 20) / 24 + terrainField.desertPotential * 0.26, 0, 1);
    var frostLine = clamp((tn.elevation - 0.58) * 1.8 + (10 - baseTempC) * 0.055, 0, 1);
    var snowpack = clamp(frostLine * 0.58 + tn.summitPressure * 0.24 + hydrationField.waterAvailability * 0.10 - heatPressure * 0.18, 0, 1);
    var meltwater = clamp(snowpack * 0.44 + tn.summitPressure * 0.22 + hydrationField.runoffPotential * 0.20, 0, 1);
    var waterState = classifyWaterState(baseTempC, hydrationField.waterAvailability, snowpack, hydrationField.evaporationLoss);

    return Object.freeze({
      ready: true,
      temperatureC: round(baseTempC, 2),
      temperatureBand: temperatureBand(baseTempC),
      seasonalTemperatureShift: round(seasonalShift, 4),
      heatPressure: round(heatPressure, 4),
      frostLinePressure: round(frostLine, 4),
      snowpackPotential: round(snowpack, 4),
      highlandMeltwaterPotential: round(meltwater, 4),
      waterState: waterState,
      temperatureRegulatesWaterState: true
    });
  }

  function buildPressureField(tn, terrainField, hydrationField, thermalField) {
    var barometricKpa = clamp(101.325 - tn.elevation * 18.0 - thermalField.heatPressure * 1.2 + terrainField.basinPressure * 1.6, 76, 104);
    var pressureGradient = clamp(
      tn.ridgePressure * 0.24 +
      tn.valleyPressure * 0.18 +
      terrainField.coastBoundaryPressure * 0.16 +
      Math.abs(thermalField.temperatureC - 20) * 0.012,
      0,
      1
    );

    var altitudePressure = clamp(1 - tn.elevation * 0.42, 0, 1);
    var stormPressure = clamp(pressureGradient * 0.32 + hydrationField.waterAvailability * 0.22 + thermalField.heatPressure * 0.18 + terrainField.coastBoundaryPressure * 0.12, 0, 1);

    return Object.freeze({
      ready: true,
      barometricPressureKpa: round(barometricKpa, 3),
      barometricPressureBand: pressureBand(barometricKpa),
      atmosphericPressureGradient: round(pressureGradient, 4),
      altitudePressure: round(altitudePressure, 4),
      stormPressure: round(stormPressure, 4),
      basinPressure: terrainField.basinPressure,
      coastalPressure: terrainField.coastBoundaryPressure,
      pressureRegulatesWeather: true
    });
  }

  function buildAtmosphereField(tn, terrainField, hydrationField, thermalField, pressureField) {
    var airDensity = clamp((pressureField.barometricPressureKpa / 101.325) * (293 / (273 + thermalField.temperatureC)), 0.58, 1.16);
    var humidity = clamp(hydrationField.waterAvailability * 0.34 + hydrationField.waterTable * 0.20 + terrainField.coastBoundaryPressure * 0.18 + hydrationField.marshPersistencePressure * 0.18 - terrainField.desertPotential * 0.20, 0, 1);
    var windX = round((terrainField.coastBoundaryPressure - tn.ridgePressure) * 0.72 + pressureField.atmosphericPressureGradient * 0.24, 4);
    var windY = round((tn.valleyPressure - terrainField.desertPotential) * 0.62 + pressureField.stormPressure * 0.16, 4);
    var windSpeed = clamp(Math.sqrt(windX * windX + windY * windY), 0, 1);
    var condensation = clamp(humidity * 0.44 + pressureField.atmosphericPressureGradient * 0.18 + thermalField.frostLinePressure * 0.12 - thermalField.heatPressure * 0.18, 0, 1);
    var rainfallRouting = clamp(condensation * 0.34 + windSpeed * 0.16 + tn.valleyPressure * 0.16 + tn.ridgePressure * 0.12, 0, 1);
    var frontalPotential = clamp(pressureField.atmosphericPressureGradient * 0.38 + humidity * 0.22 + windSpeed * 0.22 + thermalField.seasonalTemperatureShift / 28, 0, 1);
    var stability = clamp(1 - pressureField.stormPressure * 0.34 - frontalPotential * 0.24 + airDensity * 0.18 - windSpeed * 0.10, 0, 1);

    return Object.freeze({
      ready: true,
      airDensity: round(airDensity, 4),
      humidityIndex: round(humidity, 4),
      windVector: Object.freeze({ x: windX, y: windY, speed: round(windSpeed, 4) }),
      windCorridorPressure: round(windSpeed, 4),
      condensationPotential: round(condensation, 4),
      rainfallRoutingPressure: round(rainfallRouting, 4),
      frontalSystemPressure: round(frontalPotential, 4),
      atmosphericStability: round(stability, 4),
      solarExposure: round(clamp(thermalField.heatPressure * 0.34 + (1 - humidity) * 0.20 + (1 - terrainField.coastBoundaryPressure) * 0.12, 0, 1), 4),
      evaporationPressure: round(clamp(thermalField.heatPressure * 0.36 + (1 - humidity) * 0.28 + hydrationField.evaporationLoss * 0.24, 0, 1), 4),
      atmosphereBecomesBreathEnvelope: true
    });
  }

  function buildAirQualityField(tn, terrainField, atmosphereField, thermalField) {
    var particulate = clamp(terrainField.desertPotential * 0.28 + atmosphereField.windVector.speed * 0.18 + (1 - atmosphereField.humidityIndex) * 0.16 + tn.sedimentPressure * 0.12, 0, 1);
    var smokeDust = clamp(terrainField.desertPotential * 0.28 + thermalField.heatPressure * 0.18 + atmosphereField.windVector.speed * 0.14, 0, 1);
    var toxicityHeld = clamp(tn.mineralPressure * 0.08 + tn.sedimentPressure * 0.08 + particulate * 0.12, 0, 1);
    var clarity = clamp(1 - particulate * 0.38 - smokeDust * 0.24 - toxicityHeld * 0.22, 0, 1);
    var breathableAirReadiness = clamp(clarity * 0.38 + atmosphereField.airDensity * 0.24 + atmosphereField.atmosphericStability * 0.18 - toxicityHeld * 0.18, 0, 1);

    return Object.freeze({
      ready: true,
      particulateIndex: round(particulate, 4),
      smokeDustIndex: round(smokeDust, 4),
      toxicityHeldIndex: round(toxicityHeld, 4),
      clarityIndex: round(clarity, 4),
      airQualityClass: airQualityClass(clarity, toxicityHeld, particulate),
      breathableAirReadiness: round(breathableAirReadiness, 4),
      toxicityParticulateSmokeDustHeld: true,
      airQualityRegulatesViability: true
    });
  }

  function airQualityClass(clarity, toxicity, particulate) {
    if (toxicity > 0.58 || particulate > 0.72) return "air_quality_constrained";
    if (clarity > 0.78) return "clear_air_candidate";
    if (clarity > 0.58) return "moderate_air_candidate";
    return "dust_or_particulate_pressure";
  }

  function buildCarbonOxygenField(tn, terrainField, hydrationField, atmosphereField, airQualityField) {
    var vegetationReadiness = clamp(hydrationField.waterAvailability * 0.25 + atmosphereField.humidityIndex * 0.18 + terrainField.elevation * 0.08 + tn.soilPressure * 0.22 - terrainField.desertPotential * 0.18, 0, 1);
    var oxygen = clamp(atmosphereField.airDensity * 0.32 + vegetationReadiness * 0.24 + airQualityField.clarityIndex * 0.20 - tn.elevation * 0.12, 0, 1);
    var carbon = clamp(terrainField.desertPotential * 0.16 + airQualityField.smokeDustIndex * 0.18 + airQualityField.toxicityHeldIndex * 0.12 + (1 - vegetationReadiness) * 0.16, 0, 1);
    var respiration = clamp(oxygen * 0.52 + airQualityField.breathableAirReadiness * 0.30 - carbon * 0.20, 0, 1);
    var carbonCycle = clamp(vegetationReadiness * 0.34 + hydrationField.waterAvailability * 0.18 + tn.soilPressure * 0.18 + atmosphereField.humidityIndex * 0.12, 0, 1);

    return Object.freeze({
      ready: true,
      oxygenIndex: round(oxygen, 4),
      carbonIndex: round(carbon, 4),
      vegetationReadinessPressure: round(vegetationReadiness, 4),
      respirationViability: round(respiration, 4),
      carbonCyclePressure: round(carbonCycle, 4),
      carbonOxygenRegulatesViability: true
    });
  }

  function buildStabilityField(tn, terrainField, hydrationField, thermalField, pressureField, atmosphereField) {
    var stormVolatility = clamp(pressureField.stormPressure * 0.36 + atmosphereField.frontalSystemPressure * 0.26 + atmosphereField.humidityIndex * 0.16 + atmosphereField.windVector.speed * 0.12, 0, 1);
    var erosionRisk = clamp(tn.slopePressure * 0.18 + terrainField.slopePressure * 0.28 + hydrationField.runoffPotential * 0.22 + stormVolatility * 0.18, 0, 1);
    var floodRisk = clamp(hydrationField.retentionPotential * 0.18 + hydrationField.flowPotential * 0.22 + atmosphereField.rainfallRoutingPressure * 0.24 + terrainField.basinPressure * 0.18, 0, 1);
    var droughtRisk = clamp(terrainField.desertPotential * 0.32 + atmosphereField.evaporationPressure * 0.22 + (1 - hydrationField.waterAvailability) * 0.24 + thermalField.heatPressure * 0.12, 0, 1);
    var thermalShock = clamp(thermalField.seasonalTemperatureShift / 25 + pressureField.atmosphericPressureGradient * 0.12, 0, 1);
    var pressureInstability = clamp(pressureField.atmosphericPressureGradient * 0.46 + pressureField.stormPressure * 0.26 + atmosphereField.windVector.speed * 0.16, 0, 1);

    return Object.freeze({
      ready: true,
      atmosphericStability: atmosphereField.atmosphericStability,
      stormVolatility: round(stormVolatility, 4),
      erosionRisk: round(erosionRisk, 4),
      floodRisk: round(floodRisk, 4),
      droughtRisk: round(droughtRisk, 4),
      thermalShock: round(thermalShock, 4),
      pressureInstability: round(pressureInstability, 4),
      stabilityRegulatesPersistence: true
    });
  }

  function buildViabilityField(tn, terrainField, hydrationField, thermalField, atmosphereField, airQualityField, carbonOxygenField, stabilityField) {
    var breathability = clamp(carbonOxygenField.oxygenIndex * 0.34 + carbonOxygenField.respirationViability * 0.28 + airQualityField.breathableAirReadiness * 0.24 + atmosphereField.airDensity * 0.12 - carbonOxygenField.carbonIndex * 0.16, 0, 1);
    var ecologyReadiness = clamp(terrainField.continentMembership ? (hydrationField.waterAvailability * 0.22 + carbonOxygenField.vegetationReadinessPressure * 0.24 + airQualityField.clarityIndex * 0.16 + stabilityField.atmosphericStability * 0.12 + (1 - stabilityField.droughtRisk) * 0.12) : 0, 0, 1);
    var biomeReadiness = clamp(ecologyReadiness * 0.62 + terrainField.elevation * 0.05 + hydrationField.waterTable * 0.12 + atmosphereField.humidityIndex * 0.10, 0, 1);
    var settlementReadiness = clamp(terrainField.continentMembership ? (breathability * 0.22 + stabilityField.atmosphericStability * 0.18 + (1 - stabilityField.floodRisk) * 0.12 + (1 - stabilityField.erosionRisk) * 0.12 + airQualityField.breathableAirReadiness * 0.16 - terrainField.mountainReservation * 0.12) : 0, 0, 1);
    var urbanReadiness = clamp(settlementReadiness * 0.46 + (1 - stabilityField.pressureInstability) * 0.14 + (1 - stabilityField.droughtRisk) * 0.10, 0, 1);
    var surfaceViability = clamp(breathability * 0.20 + ecologyReadiness * 0.18 + biomeReadiness * 0.12 + stabilityField.atmosphericStability * 0.16 + (1 - stabilityField.stormVolatility) * 0.10 + (1 - thermalField.heatPressure) * 0.08, 0, 1);

    return Object.freeze({
      ready: true,
      breathabilityScore: round(breathability, 4),
      surfaceHabitabilityViability: round(surfaceViability, 4),
      ecologyReadinessHeld: round(ecologyReadiness, 4),
      biomeReadinessHeld: round(biomeReadiness, 4),
      settlementReadinessHeld: round(settlementReadiness, 4),
      urbanLayerReadinessHeld: round(urbanReadiness, 4),
      ecologySocketHeld: true,
      biomeSocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function riverPersistenceClass(hydrationField, thermalField, stabilityField) {
    if (hydrationField.riverPersistencePressure > 0.68 && thermalField.waterState === "liquid_persistent") return "perennial_river_candidate";
    if (hydrationField.riverPersistencePressure > 0.50 && thermalField.highlandMeltwaterPotential > 0.34) return "seasonal_meltwater_river_candidate";
    if (hydrationField.riverPersistencePressure > 0.32) return "intermittent_river_candidate";
    return "river_not_primary";
  }

  function lakePersistenceClass(hydrationField, thermalField, atmosphereField) {
    if (hydrationField.lakePersistencePressure > 0.68 && atmosphereField.evaporationPressure < 0.52) return "permanent_lake_candidate";
    if (hydrationField.lakePersistencePressure > 0.50) return "seasonal_lake_candidate";
    if (hydrationField.lakePersistencePressure > 0.38 && atmosphereField.evaporationPressure > 0.58) return "salt_lake_or_dry_lake_bed_candidate";
    return "lake_not_primary";
  }

  function marshPersistenceClass(hydrationField, atmosphereField, airQualityField) {
    if (hydrationField.marshPersistencePressure > 0.64 && atmosphereField.humidityIndex > 0.48 && airQualityField.toxicityHeldIndex < 0.42) return "marsh_viable_held";
    if (hydrationField.marshPersistencePressure > 0.48) return "seasonal_marsh_candidate";
    return "marsh_not_primary";
  }

  function wetlandPersistenceClass(hydrationField, atmosphereField, stabilityField) {
    if (hydrationField.marshPersistencePressure > 0.54 && atmosphereField.humidityIndex > 0.42 && stabilityField.droughtRisk < 0.58) return "wetland_candidate_held";
    if (hydrationField.waterTable > 0.52) return "riparian_wetland_candidate";
    return "wetland_not_primary";
  }

  function desertClass(terrainField, hydrationField, atmosphereField, thermalField) {
    if (terrainField.desertPotential > 0.70 && atmosphereField.humidityIndex < 0.34) return "rain_shadow_desert_candidate";
    if (terrainField.desertPotential > 0.56 && thermalField.heatPressure > 0.48) return "dry_interior_plain_candidate";
    if (terrainField.desertPotential > 0.46 && hydrationField.flowPotential > 0.24) return "seasonal_wash_field_candidate";
    return "desert_not_primary";
  }

  function snowpackClass(terrainField, thermalField) {
    if (thermalField.snowpackPotential > 0.64) return "snowpack_source_held";
    if (thermalField.frostLinePressure > 0.54) return "frost_line_held";
    if (terrainField.mountainReservation > 0.54 && thermalField.temperatureC <= 8) return "cold_highland_source_held";
    return "snowpack_not_primary";
  }

  function rainfallRoutingClass(atmosphereField, terrainField) {
    if (atmosphereField.rainfallRoutingPressure > 0.66 && terrainField.ridgePressure > 0.38) return "orographic_rainfall_route";
    if (atmosphereField.rainfallRoutingPressure > 0.54 && terrainField.valleyPressure > 0.34) return "valley_rainfall_route";
    if (atmosphereField.rainfallRoutingPressure > 0.44) return "distributed_rainfall_candidate";
    return "rainfall_not_primary";
  }

  function stormFormationClass(pressureField, atmosphereField, stabilityField) {
    if (stabilityField.stormVolatility > 0.70 && atmosphereField.humidityIndex > 0.48) return "storm_candidate";
    if (pressureField.stormPressure > 0.56 && atmosphereField.frontalSystemPressure > 0.48) return "frontal_storm_candidate";
    if (stabilityField.pressureInstability > 0.54) return "unstable_pressure_weather_candidate";
    return "storm_not_primary";
  }

  function frontalBoundaryClass(atmosphereField, pressureField) {
    if (atmosphereField.frontalSystemPressure > 0.64) return "active_frontal_boundary_candidate";
    if (pressureField.atmosphericPressureGradient > 0.48) return "pressure_gradient_boundary_candidate";
    return "front_not_primary";
  }

  function windCorridorClass(atmosphereField, terrainField) {
    if (atmosphereField.windVector.speed > 0.62 && terrainField.valleyPressure > 0.35) return "valley_wind_corridor";
    if (atmosphereField.windVector.speed > 0.54 && terrainField.coastBoundaryPressure > 0.40) return "coastal_wind_corridor";
    if (atmosphereField.windVector.speed > 0.46) return "general_circulation_corridor";
    return "wind_corridor_not_primary";
  }

  function breathabilityClass(viabilityField, airQualityField, carbonOxygenField) {
    if (viabilityField.breathabilityScore > 0.74 && airQualityField.toxicityHeldIndex < 0.26) return "breathable_candidate";
    if (viabilityField.breathabilityScore > 0.56) return "limited_breathability_candidate";
    if (carbonOxygenField.oxygenIndex < 0.42) return "oxygen_constraint";
    if (airQualityField.particulateIndex > 0.58) return "particulate_constraint";
    return "breathability_constrained";
  }

  function buildNaturalExpressionMapForNode(fields) {
    return Object.freeze({
      riverPersistenceClass: riverPersistenceClass(fields.hydrationField, fields.thermalField, fields.stabilityField),
      lakePersistenceClass: lakePersistenceClass(fields.hydrationField, fields.thermalField, fields.atmosphereField),
      marshPersistenceClass: marshPersistenceClass(fields.hydrationField, fields.atmosphereField, fields.airQualityField),
      wetlandPersistenceClass: wetlandPersistenceClass(fields.hydrationField, fields.atmosphereField, fields.stabilityField),
      desertClass: desertClass(fields.terrainField, fields.hydrationField, fields.atmosphereField, fields.thermalField),
      snowpackClass: snowpackClass(fields.terrainField, fields.thermalField),
      frostLineClass: fields.thermalField.frostLinePressure > 0.52 ? "frost_line_held" : "frost_line_not_primary",
      rainfallRoutingClass: rainfallRoutingClass(fields.atmosphereField, fields.terrainField),
      stormFormationClass: stormFormationClass(fields.pressureField, fields.atmosphereField, fields.stabilityField),
      frontalBoundaryClass: frontalBoundaryClass(fields.atmosphereField, fields.pressureField),
      windCorridorClass: windCorridorClass(fields.atmosphereField, fields.terrainField),
      airQualityClass: fields.airQualityField.airQualityClass,
      breathabilityClass: breathabilityClass(fields.viabilityField, fields.airQualityField, fields.carbonOxygenField),
      ecologyReadinessHeldClass: fields.viabilityField.ecologyReadinessHeld > 0.62 ? "ecology_candidate_held" : "ecology_held_pending_field_agreement",
      settlementReadinessHeldClass: fields.viabilityField.settlementReadinessHeld > 0.62 ? "settlement_candidate_held" : "settlement_held_pending_ecology_core_and_downstream"
    });
  }

  function cohereNode(tn, hn, fields, expressions) {
    var failures = [];
    var warnings = [];

    if (tn.terrainClass === "summit_highland" && fields.hydrationField.marshPersistencePressure > 0.56) {
      failures.push("summit_cannot_be_marsh_primary");
    }

    if (fields.terrainField.desertPotential > 0.62 && fields.hydrationField.waterAvailability > 0.62 && expressions.desertClass !== "seasonal_wash_field_candidate") {
      warnings.push("hydration_may_be_erasing_desert_classification");
    }

    if (expressions.lakePersistenceClass !== "lake_not_primary") {
      if (fields.terrainField.basinPressure < 0.38 || fields.hydrationField.retentionPotential < 0.38) {
        failures.push("lake_requires_basin_capture_and_retention");
      }
      if (fields.atmosphereField.evaporationPressure > 0.72) {
        warnings.push("lake_persistence_high_evaporation_check");
      }
    }

    if (expressions.marshPersistenceClass !== "marsh_not_primary") {
      if (fields.terrainField.slopePressure > 0.66 || fields.hydrationField.retentionPotential < 0.36 || fields.atmosphereField.humidityIndex < 0.34) {
        failures.push("marsh_requires_low_gradient_retention_humidity_and_sediment");
      }
    }

    if (expressions.rainfallRoutingClass !== "rainfall_not_primary") {
      if (!(fields.atmosphereField.humidityIndex > 0.32 && (fields.atmosphereField.condensationPotential > 0.26 || fields.atmosphereField.frontalSystemPressure > 0.30))) {
        failures.push("rainfall_requires_humidity_condensation_pressure_or_frontal_lift");
      }
    }

    if (expressions.stormFormationClass !== "storm_not_primary") {
      if (!(fields.atmosphereField.humidityIndex > 0.30 && fields.pressureField.atmosphericPressureGradient > 0.18 && fields.atmosphereField.windVector.speed > 0.10)) {
        failures.push("storms_require_humidity_instability_pressure_gradient_and_wind");
      }
    }

    if (expressions.breathabilityClass === "breathable_candidate") {
      if (fields.carbonOxygenField.oxygenIndex < 0.54 || fields.carbonOxygenField.carbonIndex > 0.62 || fields.airQualityField.toxicityHeldIndex > 0.42) {
        failures.push("breathability_requires_oxygen_carbon_air_quality_and_toxicity_constraints");
      }
    }

    if (fields.viabilityField.ecologyReadinessHeld > 0.68) {
      warnings.push("ecology_remains_held_until_downstream_ecology_file_exists");
    }

    if (fields.viabilityField.settlementReadinessHeld > 0.62) {
      warnings.push("settlement_remains_held_until_core_ecology_hydration_and_downstream_readiness");
    }

    if (fields.viabilityField.urbanLayerReadinessHeld > 0.58) {
      warnings.push("urban_layer_remains_held_until_settlement_and_core_readiness");
    }

    var coherenceScore = clamp(1 - failures.length * 0.22 - warnings.length * 0.035, 0, 1);

    return {
      hardFail: failures.length > 0,
      failures: failures,
      warnings: warnings,
      coherenceScore: round(coherenceScore, 4)
    };
  }

  function makeNEWS(tn, hn, fields, expressions, coherence) {
    return Object.freeze({
      complete: true,
      north: Object.freeze({
        defined: true,
        role: "source_condition",
        terrainSource: tn.sourceNodeId,
        hydrationSource: hn.hydrationNodeId,
        sourceTypes: [
          "terrain_source",
          "hydration_source",
          "thermal_source",
          "pressure_source",
          "atmosphere_source",
          "air_quality_source",
          "carbon_oxygen_source"
        ],
        elevationBand: fields.terrainField.elevationBand,
        hydrationClass: fields.hydrationField.hydrationClass
      }),
      east: Object.freeze({
        defined: true,
        role: "field_expression",
        naturalExpressions: deepClone(expressions),
        viability: fields.viabilityField.surfaceHabitabilityViability,
        breathabilityClass: expressions.breathabilityClass
      }),
      west: Object.freeze({
        defined: true,
        role: "field_correction",
        correction: coherence.hardFail ? "hard_constraint_failure" : coherence.warnings.length ? "held_warning_correction" : "coherent",
        failures: coherence.failures.slice(),
        warnings: coherence.warnings.slice(),
        waterMustObeyTerrain: true,
        temperatureRegulatesWaterState: true,
        pressureRegulatesWeather: true,
        airQualityRegulatesViability: true,
        desertMustRemainClassified: true,
        mountainsRemainReserved: true,
        ecologyHeld: true,
        urbanHeld: true
      }),
      south: Object.freeze({
        defined: true,
        role: "grounding",
        downstreamOwner: "gratitude.surface-habitability.child.js",
        renderTier: RENDER_TIERS.T3,
        runtimeMetricsOnly: true,
        ecologyHeld: true,
        settlementHeld: true,
        urbanHeld: true,
        finalVisualPassClaim: false
      })
    });
  }

  function makeHabitabilityNode(tn) {
    var hn = HYDRATION_UPSTREAM.nodeByKey[key(tn.x, tn.y)] || normalizeHydrationNode({}, tn.nodeIndex);

    var terrainField = buildTerrainField(tn);
    var hydrationField = buildHydrationField(tn, hn);
    var thermalField = buildThermalField(tn, terrainField, hydrationField);
    var pressureField = buildPressureField(tn, terrainField, hydrationField, thermalField);
    var atmosphereField = buildAtmosphereField(tn, terrainField, hydrationField, thermalField, pressureField);
    var airQualityField = buildAirQualityField(tn, terrainField, atmosphereField, thermalField);
    var carbonOxygenField = buildCarbonOxygenField(tn, terrainField, hydrationField, atmosphereField, airQualityField);
    var stabilityField = buildStabilityField(tn, terrainField, hydrationField, thermalField, pressureField, atmosphereField);
    var viabilityField = buildViabilityField(tn, terrainField, hydrationField, thermalField, atmosphereField, airQualityField, carbonOxygenField, stabilityField);

    var fields = {
      terrainField: terrainField,
      hydrationField: hydrationField,
      thermalField: thermalField,
      pressureField: pressureField,
      atmosphereField: atmosphereField,
      airQualityField: airQualityField,
      carbonOxygenField: carbonOxygenField,
      stabilityField: stabilityField,
      viabilityField: viabilityField
    };

    var naturalExpressions = buildNaturalExpressionMapForNode(fields);
    var coherence = cohereNode(tn, hn, fields, naturalExpressions);
    var NEWS = makeNEWS(tn, hn, fields, naturalExpressions, coherence);

    return Object.freeze({
      habitabilityNodeId: nodeId(tn.x, tn.y),
      sourceTerrainNodeId: tn.sourceNodeId,
      sourceHydrationNodeId: hn.hydrationNodeId,
      nodeIndex: tn.nodeIndex,
      seatIndex: tn.seatIndex,
      seatKey: tn.seatKey,
      x: tn.x,
      y: tn.y,
      centerX: tn.centerX,
      centerY: tn.centerY,
      continentMembership: tn.continentMembership,

      terrainField: terrainField,
      hydrationField: hydrationField,
      thermalField: thermalField,
      pressureField: pressureField,
      atmosphereField: atmosphereField,
      airQualityField: airQualityField,
      carbonOxygenField: carbonOxygenField,
      stabilityField: stabilityField,
      viabilityField: viabilityField,

      naturalExpressions: naturalExpressions,

      NEWS: NEWS,
      newsComplete: true,
      north: NEWS.north,
      east: NEWS.east,
      west: NEWS.west,
      south: NEWS.south,

      coherenceScore: coherence.coherenceScore,
      hardFail: coherence.hardFail,
      constraintFailures: coherence.failures,
      constraintWarnings: coherence.warnings,

      reciprocalBlueprintEligible: tn.continentMembership || tn.shelfPressure > 0.30 || tn.coastPressure > 0.30,
      carrierRenderAuthorized: false,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function buildHabitabilityNodes() {
    if (!TERRAIN_UPSTREAM.packetReady || !HYDRATION_UPSTREAM.packetReady) return Object.freeze([]);

    return Object.freeze(TERRAIN_UPSTREAM.nodes.map(makeHabitabilityNode));
  }

  var HABITABILITY_NODES = buildHabitabilityNodes();

  function countNodes(predicate) {
    var count = 0;
    for (var i = 0; i < HABITABILITY_NODES.length; i += 1) {
      if (predicate(HABITABILITY_NODES[i])) count += 1;
    }
    return count;
  }

  function average(getter) {
    if (!HABITABILITY_NODES.length) return 0;

    var total = 0;
    for (var i = 0; i < HABITABILITY_NODES.length; i += 1) {
      total += Number(getter(HABITABILITY_NODES[i])) || 0;
    }

    return round(total / HABITABILITY_NODES.length, 4);
  }

  function hardFailCount() {
    return countNodes(function (node) { return node.hardFail; });
  }

  function warningCount() {
    var warnings = 0;

    for (var i = 0; i < HABITABILITY_NODES.length; i += 1) {
      warnings += HABITABILITY_NODES[i].constraintWarnings.length;
    }

    return warnings;
  }

  function allNEWSComplete() {
    return HABITABILITY_NODES.every(function (node) {
      return Boolean(
        node.newsComplete === true &&
        node.NEWS &&
        node.NEWS.complete === true &&
        node.north && node.north.defined === true &&
        node.east && node.east.defined === true &&
        node.west && node.west.defined === true &&
        node.south && node.south.defined === true
      );
    });
  }

  function surfaceHabitabilityRuntimeMetrics() {
    return Object.freeze({
      runtimeMetricsReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      runtimeStrengthHeld: true,
      runtimeActivationAuthorized: false,

      surfaceHabitabilityNodeCount: HABITABILITY_NODES.length,

      terrainFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      hydrationFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      thermalFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      pressureFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      atmosphereFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      airQualityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      carbonOxygenFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      stabilityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      viabilityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,

      waterStateCoherenceScore: average(function (node) {
        return node.thermalField.waterState === "liquid_persistent" || node.thermalField.waterState === "liquid_seasonal" ? node.hydrationField.waterAvailability : 1 - node.hydrationField.waterAvailability * 0.35;
      }),
      desertPreservationScore: average(function (node) {
        return node.terrainField.desertPotential > 0.54 ? clamp(1 - node.hydrationField.waterAvailability * 0.58, 0, 1) : 1;
      }),
      mountainReservationScore: average(function (node) {
        return node.terrainField.mountainReservation > 0.54 ? clamp(1 - node.hydrationField.marshPersistencePressure * 0.62, 0, 1) : 1;
      }),
      lakePersistenceScore: average(function (node) {
        return node.hydrationField.lakePersistencePressure;
      }),
      marshPersistenceScore: average(function (node) {
        return node.hydrationField.marshPersistencePressure;
      }),
      snowpackCoherenceScore: average(function (node) {
        return node.thermalField.snowpackPotential;
      }),
      rainfallRoutingScore: average(function (node) {
        return node.atmosphereField.rainfallRoutingPressure;
      }),
      barometricContinuityScore: average(function (node) {
        return clamp(1 - Math.abs(101.325 - node.pressureField.barometricPressureKpa) / 28, 0, 1);
      }),
      humidityBalanceScore: average(function (node) {
        return node.atmosphereField.humidityIndex;
      }),
      airDensityCoherenceScore: average(function (node) {
        return clamp(1 - Math.abs(1 - node.atmosphereField.airDensity), 0, 1);
      }),
      oxygenCarbonViabilityScore: average(function (node) {
        return clamp(node.carbonOxygenField.oxygenIndex * 0.58 + (1 - node.carbonOxygenField.carbonIndex) * 0.42, 0, 1);
      }),
      airQualityViabilityScore: average(function (node) {
        return node.airQualityField.breathableAirReadiness;
      }),
      stormStabilityScore: average(function (node) {
        return clamp(1 - node.stabilityField.stormVolatility, 0, 1);
      }),
      breathabilityScore: average(function (node) {
        return node.viabilityField.breathabilityScore;
      }),
      surfaceHabitabilityCoherenceAverage: average(function (node) {
        return node.coherenceScore;
      }),
      surfaceHabitabilityHardFailCount: hardFailCount(),
      surfaceHabitabilityWarningCount: warningCount(),

      authorizedRenderTiers: [RENDER_TIERS.T0, RENDER_TIERS.T1, RENDER_TIERS.T2, RENDER_TIERS.T3],
      heldRenderTiers: [RENDER_TIERS.T4, RENDER_TIERS.T5],
      recommendedRenderTier: RENDER_TIERS.T3
    });
  }

  var RUNTIME_METRICS = surfaceHabitabilityRuntimeMetrics();

  function compactNode(node) {
    return {
      habitabilityNodeId: node.habitabilityNodeId,
      sourceTerrainNodeId: node.sourceTerrainNodeId,
      sourceHydrationNodeId: node.sourceHydrationNodeId,
      x: node.x,
      y: node.y,
      continentMembership: node.continentMembership,
      elevationBand: node.terrainField.elevationBand,
      hydrationClass: node.hydrationField.hydrationClass,
      temperatureBand: node.thermalField.temperatureBand,
      barometricPressureBand: node.pressureField.barometricPressureBand,
      humidityIndex: node.atmosphereField.humidityIndex,
      oxygenIndex: node.carbonOxygenField.oxygenIndex,
      carbonIndex: node.carbonOxygenField.carbonIndex,
      breathabilityClass: node.naturalExpressions.breathabilityClass,
      coherenceScore: node.coherenceScore
    };
  }

  function fieldNode(fieldName, node) {
    return {
      habitabilityNodeId: node.habitabilityNodeId,
      x: node.x,
      y: node.y,
      field: deepClone(node[fieldName])
    };
  }

  function getNodes(compact) {
    return compact ? HABITABILITY_NODES.map(compactNode) : HABITABILITY_NODES.map(deepClone);
  }

  function getFieldNodes(fieldName, compact) {
    if (compact) {
      return HABITABILITY_NODES.map(function (node) {
        return fieldNode(fieldName, node);
      });
    }

    return HABITABILITY_NODES.map(deepClone);
  }

  function zonePacket(name, threshold, getter, classGetter) {
    var zones = [];

    for (var i = 0; i < HABITABILITY_NODES.length; i += 1) {
      var node = HABITABILITY_NODES[i];
      var pressure = clamp(getter(node), 0, 1);

      if (pressure >= threshold) {
        zones.push({
          zoneId: name + "-" + node.habitabilityNodeId,
          habitabilityNodeId: node.habitabilityNodeId,
          sourceTerrainNodeId: node.sourceTerrainNodeId,
          sourceHydrationNodeId: node.sourceHydrationNodeId,
          x: node.x,
          y: node.y,
          pressure: round(pressure, 4),
          class: classGetter ? classGetter(node) : name,
          advisoryOnly: true,
          finalAuthority: false
        });
      }
    }

    return zones;
  }

  function getSurfaceHabitabilityBlueprintPacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: target || "unassigned-downstream-consumer",
      blueprintPacketReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      reciprocalBlueprintReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      advisoryPressureOnly: true,
      terrainAuthorityRetained: true,
      hydrationAuthorityRetained: true,
      ecologyAuthorityHeld: true,
      settlementAuthorityHeld: true,
      urbanAuthorityHeld: true,

      requiredElevationBands: zonePacket("requiredElevationBands", compact ? 0.70 : 0.50, function (node) { return node.terrainField.elevation; }, function (node) { return node.terrainField.elevationBand; }),
      requiredSlopeBands: zonePacket("requiredSlopeBands", 0.46, function (node) { return node.terrainField.slopePressure; }, function (node) { return "slope_pressure"; }),
      requiredTemperatureBands: zonePacket("requiredTemperatureBands", 0.30, function (node) { return Math.abs(node.thermalField.temperatureC - 18) / 34; }, function (node) { return node.thermalField.temperatureBand; }),
      requiredPressureBands: zonePacket("requiredPressureBands", 0.34, function (node) { return node.pressureField.atmosphericPressureGradient; }, function (node) { return "pressure_gradient"; }),
      requiredBarometricPressureBands: zonePacket("requiredBarometricPressureBands", 0.30, function (node) { return clamp(1 - Math.abs(101.325 - node.pressureField.barometricPressureKpa) / 30, 0, 1); }, function (node) { return node.pressureField.barometricPressureBand; }),
      requiredHumidityBands: zonePacket("requiredHumidityBands", 0.42, function (node) { return node.atmosphereField.humidityIndex; }, function () { return "humidity_band"; }),
      requiredAirDensityBands: zonePacket("requiredAirDensityBands", 0.42, function (node) { return node.atmosphereField.airDensity; }, function () { return "air_density_band"; }),
      requiredOxygenIndexBands: zonePacket("requiredOxygenIndexBands", 0.46, function (node) { return node.carbonOxygenField.oxygenIndex; }, function () { return "oxygen_index_band"; }),
      requiredCarbonIndexBands: zonePacket("requiredCarbonIndexBands", 0.28, function (node) { return node.carbonOxygenField.carbonIndex; }, function () { return "carbon_index_band"; }),
      requiredAirQualityBands: zonePacket("requiredAirQualityBands", 0.40, function (node) { return node.airQualityField.breathableAirReadiness; }, function (node) { return node.airQualityField.airQualityClass; }),
      requiredWindCorridors: zonePacket("requiredWindCorridors", 0.42, function (node) { return node.atmosphereField.windVector.speed; }, function (node) { return node.naturalExpressions.windCorridorClass; }),
      requiredFrontalBoundaries: zonePacket("requiredFrontalBoundaries", 0.42, function (node) { return node.atmosphereField.frontalSystemPressure; }, function (node) { return node.naturalExpressions.frontalBoundaryClass; }),
      requiredAtmosphericStabilityZones: zonePacket("requiredAtmosphericStabilityZones", 0.44, function (node) { return node.atmosphereField.atmosphericStability; }, function () { return "atmospheric_stability_zone"; }),
      requiredEvaporationZones: zonePacket("requiredEvaporationZones", 0.46, function (node) { return node.atmosphereField.evaporationPressure; }, function () { return "evaporation_zone"; }),
      requiredCondensationZones: zonePacket("requiredCondensationZones", 0.40, function (node) { return node.atmosphereField.condensationPotential; }, function () { return "condensation_zone"; }),
      requiredRainfallRoutingZones: zonePacket("requiredRainfallRoutingZones", 0.42, function (node) { return node.atmosphereField.rainfallRoutingPressure; }, function (node) { return node.naturalExpressions.rainfallRoutingClass; }),
      requiredSnowpackZones: zonePacket("requiredSnowpackZones", 0.38, function (node) { return node.thermalField.snowpackPotential; }, function (node) { return node.naturalExpressions.snowpackClass; }),
      requiredFrostLineZones: zonePacket("requiredFrostLineZones", 0.38, function (node) { return node.thermalField.frostLinePressure; }, function (node) { return node.naturalExpressions.frostLineClass; }),
      requiredStormSurgeZones: zonePacket("requiredStormSurgeZones", 0.42, function (node) { return node.pressureField.stormPressure; }, function (node) { return node.naturalExpressions.stormFormationClass; }),
      requiredBreathabilityZones: zonePacket("requiredBreathabilityZones", 0.50, function (node) { return node.viabilityField.breathabilityScore; }, function (node) { return node.naturalExpressions.breathabilityClass; }),
      requiredDesertHeatZones: zonePacket("requiredDesertHeatZones", 0.44, function (node) { return node.terrainField.desertPotential * 0.55 + node.thermalField.heatPressure * 0.45; }, function (node) { return node.naturalExpressions.desertClass; }),
      requiredMarshHumidityZones: zonePacket("requiredMarshHumidityZones", 0.42, function (node) { return node.hydrationField.marshPersistencePressure * 0.55 + node.atmosphereField.humidityIndex * 0.45; }, function (node) { return node.naturalExpressions.marshPersistenceClass; }),
      requiredLakeRetentionZones: zonePacket("requiredLakeRetentionZones", 0.42, function (node) { return node.hydrationField.lakePersistencePressure; }, function (node) { return node.naturalExpressions.lakePersistenceClass; }),
      requiredAquiferRechargeZones: zonePacket("requiredAquiferRechargeZones", 0.42, function (node) { return node.hydrationField.aquiferPressure; }, function () { return "aquifer_recharge_zone"; }),
      requiredEcologyReadinessHeldZones: zonePacket("requiredEcologyReadinessHeldZones", 0.48, function (node) { return node.viabilityField.ecologyReadinessHeld; }, function (node) { return node.naturalExpressions.ecologyReadinessHeldClass; }),
      requiredSettlementHeldZones: zonePacket("requiredSettlementHeldZones", 0.48, function (node) { return node.viabilityField.settlementReadinessHeld; }, function (node) { return node.naturalExpressions.settlementReadinessHeldClass; }),

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function status() {
    if (!TERRAIN_UPSTREAM.packetReady || !HYDRATION_UPSTREAM.packetReady) return boundedStatus();

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: FILE,
      terrainFile: TERRAIN_FILE,
      hydrationFile: HYDRATION_FILE,

      childType: "surface_habitability_field_blueprint_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      childClass: CHILD_CLASS,

      surfaceHabitabilityFieldBlueprint: true,
      terrainUpstreamDetected: TERRAIN_UPSTREAM.detected,
      hydrationUpstreamDetected: HYDRATION_UPSTREAM.detected,
      terrainUpstreamPacketReady: TERRAIN_UPSTREAM.packetReady,
      hydrationUpstreamPacketReady: HYDRATION_UPSTREAM.packetReady,
      terrainCoordinatesConsumed: true,
      hydrationBloodstreamConsumed: true,

      elevationFieldMapped: true,
      temperatureFieldMapped: true,
      thermalFieldMapped: true,
      barometricPressureMapped: true,
      atmosphericPressureGradientMapped: true,
      airDensityMapped: true,
      humidityMapped: true,
      atmosphericStabilityMapped: true,
      frontalSystemsMapped: true,
      windCirculationMapped: true,
      solarExposureMapped: true,
      evaporationMapped: true,
      condensationMapped: true,
      rainfallRoutingMapped: true,
      snowpackFrostLineMapped: true,
      stormPressureMapped: true,
      oxygenIndexMapped: true,
      carbonIndexMapped: true,
      airQualityMapped: true,
      breathabilityMapped: true,
      toxicityParticulateSmokeDustHeld: true,

      naturalExpressionReadoutsReady: true,
      reciprocalBlueprintReady: true,

      ecologySocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,

      runtimeStrengthHeld: true,
      carrierRenderAuthorized: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      terrainChildUntouched: true,
      hydrationChildUntouched: true,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      nodeCount: HABITABILITY_NODES.length,
      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: allNEWSComplete(),
      coherenceAverage: RUNTIME_METRICS.surfaceHabitabilityCoherenceAverage,
      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      runtimeMetrics: deepClone(RUNTIME_METRICS),

      deployMarker: "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_DEPLOY_MARKER_v1"
    };
  }

  function getSurfaceHabitabilityNodeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      nodeMapReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      nodeCount: HABITABILITY_NODES.length,
      nodes: getNodes(compact)
    };
  }

  function getFieldMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      fieldMapReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      fieldStack: [
        "terrainField",
        "hydrationField",
        "thermalField",
        "pressureField",
        "atmosphereField",
        "airQualityField",
        "carbonOxygenField",
        "stabilityField",
        "viabilityField"
      ],
      nodes: compact ? HABITABILITY_NODES.map(compactNode) : HABITABILITY_NODES.map(function (node) {
        return {
          habitabilityNodeId: node.habitabilityNodeId,
          x: node.x,
          y: node.y,
          terrainField: deepClone(node.terrainField),
          hydrationField: deepClone(node.hydrationField),
          thermalField: deepClone(node.thermalField),
          pressureField: deepClone(node.pressureField),
          atmosphereField: deepClone(node.atmosphereField),
          airQualityField: deepClone(node.airQualityField),
          carbonOxygenField: deepClone(node.carbonOxygenField),
          stabilityField: deepClone(node.stabilityField),
          viabilityField: deepClone(node.viabilityField)
        };
      })
    };
  }

  function getTerrainFieldMap(options) {
    return {
      contract: CONTRACT,
      terrainFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      nodes: getFieldNodes("terrainField", Boolean(options && options.compact))
    };
  }

  function getHydrationFieldMap(options) {
    return {
      contract: CONTRACT,
      hydrationFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      nodes: getFieldNodes("hydrationField", Boolean(options && options.compact))
    };
  }

  function getThermalFieldMap(options) {
    return {
      contract: CONTRACT,
      thermalFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      temperatureFieldMapped: true,
      nodes: getFieldNodes("thermalField", Boolean(options && options.compact))
    };
  }

  function getPressureFieldMap(options) {
    return {
      contract: CONTRACT,
      pressureFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      barometricPressureMapped: true,
      atmosphericPressureGradientMapped: true,
      nodes: getFieldNodes("pressureField", Boolean(options && options.compact))
    };
  }

  function getAtmosphereFieldMap(options) {
    return {
      contract: CONTRACT,
      atmosphereFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      airDensityMapped: true,
      humidityMapped: true,
      atmosphericStabilityMapped: true,
      frontalSystemsMapped: true,
      windCirculationMapped: true,
      nodes: getFieldNodes("atmosphereField", Boolean(options && options.compact))
    };
  }

  function getAirQualityFieldMap(options) {
    return {
      contract: CONTRACT,
      airQualityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      airQualityMapped: true,
      toxicityParticulateSmokeDustHeld: true,
      nodes: getFieldNodes("airQualityField", Boolean(options && options.compact))
    };
  }

  function getCarbonOxygenFieldMap(options) {
    return {
      contract: CONTRACT,
      carbonOxygenFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      oxygenIndexMapped: true,
      carbonIndexMapped: true,
      nodes: getFieldNodes("carbonOxygenField", Boolean(options && options.compact))
    };
  }

  function getStabilityFieldMap(options) {
    return {
      contract: CONTRACT,
      stabilityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      nodes: getFieldNodes("stabilityField", Boolean(options && options.compact))
    };
  }

  function getViabilityFieldMap(options) {
    return {
      contract: CONTRACT,
      viabilityFieldReady: HABITABILITY_NODES.length === NODE_COUNT,
      ecologySocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,
      nodes: getFieldNodes("viabilityField", Boolean(options && options.compact))
    };
  }

  function getNaturalExpressionMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      naturalExpressionReadoutsReady: HABITABILITY_NODES.length === NODE_COUNT,
      expressionsAreReadoutsNotCauses: true,
      nodes: HABITABILITY_NODES.map(function (node) {
        if (compact) {
          return {
            habitabilityNodeId: node.habitabilityNodeId,
            x: node.x,
            y: node.y,
            naturalExpressions: deepClone(node.naturalExpressions)
          };
        }

        return {
          habitabilityNodeId: node.habitabilityNodeId,
          x: node.x,
          y: node.y,
          terrainField: deepClone(node.terrainField),
          hydrationField: deepClone(node.hydrationField),
          thermalField: deepClone(node.thermalField),
          atmosphereField: deepClone(node.atmosphereField),
          naturalExpressions: deepClone(node.naturalExpressions)
        };
      })
    };
  }

  function getSurfaceHabitabilityNEWSMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: allNEWSComplete(),
      nodes: HABITABILITY_NODES.map(function (node) {
        if (compact) {
          return {
            habitabilityNodeId: node.habitabilityNodeId,
            north: node.north.defined,
            east: node.east.defined,
            west: node.west.defined,
            south: node.south.defined,
            coherenceScore: node.coherenceScore
          };
        }

        return {
          habitabilityNodeId: node.habitabilityNodeId,
          NEWS: deepClone(node.NEWS)
        };
      })
    };
  }

  function getSurfaceHabitabilityCoherenceMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      coherenceActive: true,
      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      coherenceAverage: RUNTIME_METRICS.surfaceHabitabilityCoherenceAverage,
      rules: [
        "summit_cannot_be_marsh_primary",
        "desert_must_not_be_erased_by_hydration",
        "lake_requires_basin_capture_retention_temperature_and_evaporation_logic",
        "marsh_requires_low_gradient_retention_humidity_sediment_and_air_temperature_support",
        "rainfall_requires_humidity_condensation_pressure_or_frontal_lift",
        "storms_require_humidity_instability_pressure_gradient_and_wind",
        "breathability_requires_oxygen_carbon_air_quality_and_toxicity_constraints",
        "ecology_settlement_and_urban_remain_held"
      ],
      nodes: HABITABILITY_NODES.map(function (node) {
        if (compact) {
          return {
            habitabilityNodeId: node.habitabilityNodeId,
            coherenceScore: node.coherenceScore,
            hardFail: node.hardFail,
            warningCount: node.constraintWarnings.length
          };
        }

        return {
          habitabilityNodeId: node.habitabilityNodeId,
          coherenceScore: node.coherenceScore,
          hardFail: node.hardFail,
          failures: node.constraintFailures,
          warnings: node.constraintWarnings
        };
      })
    };
  }

  function getSurfaceHabitabilityRuntimeMetrics() {
    return deepClone(RUNTIME_METRICS);
  }

  function getSurfaceHabitabilityReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      target: target || "unassigned-downstream-consumer",
      childReceivePacketReady: TERRAIN_UPSTREAM.packetReady && HYDRATION_UPSTREAM.packetReady,
      childType: "surface_habitability_field_blueprint_child",

      surfaceHabitabilityFieldBlueprint: true,
      terrainUpstreamDetected: TERRAIN_UPSTREAM.detected,
      hydrationUpstreamDetected: HYDRATION_UPSTREAM.detected,
      terrainUpstreamPacketReady: TERRAIN_UPSTREAM.packetReady,
      hydrationUpstreamPacketReady: HYDRATION_UPSTREAM.packetReady,
      terrainCoordinatesConsumed: TERRAIN_UPSTREAM.packetReady,
      hydrationBloodstreamConsumed: HYDRATION_UPSTREAM.packetReady,

      elevationFieldMapped: true,
      temperatureFieldMapped: true,
      thermalFieldMapped: true,
      barometricPressureMapped: true,
      atmosphericPressureGradientMapped: true,
      airDensityMapped: true,
      humidityMapped: true,
      atmosphericStabilityMapped: true,
      frontalSystemsMapped: true,
      windCirculationMapped: true,
      solarExposureMapped: true,
      evaporationMapped: true,
      condensationMapped: true,
      rainfallRoutingMapped: true,
      snowpackFrostLineMapped: true,
      stormPressureMapped: true,
      oxygenIndexMapped: true,
      carbonIndexMapped: true,
      airQualityMapped: true,
      breathabilityMapped: true,
      toxicityParticulateSmokeDustHeld: true,

      naturalExpressionReadoutsReady: true,
      reciprocalBlueprintReady: true,
      ecologySocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,

      runtimeStrengthHeld: true,
      carrierRenderAuthorized: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      status: status(),
      runtimeMetrics: getSurfaceHabitabilityRuntimeMetrics(),
      nodeMap: getSurfaceHabitabilityNodeMap({ compact: compact }),
      fieldMap: getFieldMap({ compact: compact }),
      naturalExpressionMap: getNaturalExpressionMap({ compact: compact }),
      NEWSMap: getSurfaceHabitabilityNEWSMap({ compact: compact }),
      coherenceMap: getSurfaceHabitabilityCoherenceMap({ compact: compact }),
      blueprintPacket: getSurfaceHabitabilityBlueprintPacket(target || "receive-packet-blueprint", { compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    specOps: SPEC_OPS,
    file: FILE,
    terrainFile: TERRAIN_FILE,
    hydrationFile: HYDRATION_FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    childClass: CHILD_CLASS,

    status: status,
    getSurfaceHabitabilityNodeMap: getSurfaceHabitabilityNodeMap,
    getFieldMap: getFieldMap,
    getTerrainFieldMap: getTerrainFieldMap,
    getHydrationFieldMap: getHydrationFieldMap,
    getThermalFieldMap: getThermalFieldMap,
    getPressureFieldMap: getPressureFieldMap,
    getAtmosphereFieldMap: getAtmosphereFieldMap,
    getAirQualityFieldMap: getAirQualityFieldMap,
    getCarbonOxygenFieldMap: getCarbonOxygenFieldMap,
    getStabilityFieldMap: getStabilityFieldMap,
    getViabilityFieldMap: getViabilityFieldMap,
    getNaturalExpressionMap: getNaturalExpressionMap,
    getSurfaceHabitabilityNEWSMap: getSurfaceHabitabilityNEWSMap,
    getSurfaceHabitabilityCoherenceMap: getSurfaceHabitabilityCoherenceMap,
    getSurfaceHabitabilityRuntimeMetrics: getSurfaceHabitabilityRuntimeMetrics,
    getSurfaceHabitabilityBlueprintPacket: getSurfaceHabitabilityBlueprintPacket,
    getSurfaceHabitabilityReceivePacket: getSurfaceHabitabilityReceivePacket,

    // Compatibility aliases.
    getChildReceivePacket: getSurfaceHabitabilityReceivePacket,
    getRuntimeMetrics: getSurfaceHabitabilityRuntimeMetrics
  });

  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD = API;
  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_STATUS = status();
  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_BLUEPRINT_PACKET = getSurfaceHabitabilityBlueprintPacket("published-static-surface-habitability-blueprint", { compact: true });
  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_RUNTIME_METRICS = getSurfaceHabitabilityRuntimeMetrics();
})();
