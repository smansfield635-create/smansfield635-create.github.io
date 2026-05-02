/* G1 PLANET 1 TRI-DOMAIN 256 WHOLE-WORLD CONTAINER HEX BRIDGE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1
   LAYER_VERSION: G1_PLANET_1_TRI_DOMAIN_256_WHOLE_WORLD_CONTAINER_TNT_v1

   LAW:
   One whole-world container contains three internal domains:
   WATER_256, LAND_256, AIR_256.

   The three domains are not separate planets.
   They are internal scopes inside one planetary whole.

   Whole-world 256 coordinates the three domain 256s.
   Water remains sovereign.
   Land receives life but not total authority.
   Air completes the cycle through pressure, humidity, wind, and exchange.
*/

(function attachPlanetOneTriDomain256HexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1";
  var LAYER_VERSION = "G1_PLANET_1_TRI_DOMAIN_256_WHOLE_WORLD_CONTAINER_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var DOMAIN_COUNT = 3;
  var DOMAIN_SHARE = 33.3333;
  var SEED = 256451;

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * m) / m;
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function hash2(a, b, seed) {
    var x = Math.sin(a * 127.1 + b * 311.7 + (seed || SEED) * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function noise(lon, lat, scale, seed) {
    return hash2(Math.round(lon * scale), Math.round(lat * scale), seed || SEED);
  }

  function fbm(lon, lat, seed) {
    return (
      noise(lon, lat, 0.34, seed + 11) * 0.34 +
      noise(lon, lat, 0.76, seed + 29) * 0.26 +
      noise(lon, lat, 1.48, seed + 47) * 0.20 +
      noise(lon, lat, 2.96, seed + 83) * 0.13 +
      noise(lon, lat, 5.92, seed + 131) * 0.07
    );
  }

  function ridgeSignal(lon, lat, seed) {
    var n = fbm(lon * 1.18 + 17.2, lat * 1.08 - 8.4, seed + 606);
    return 1 - Math.abs(n * 2 - 1);
  }

  function stateId(a, b, c, d) {
    return (((a * 4 + b) * 4 + c) * 4 + d);
  }

  function buildStateSpaceReceipt(label, axisA, axisB, axisC, axisD) {
    var states = [];
    var a;
    var b;
    var c;
    var d;

    for (a = 0; a < 4; a += 1) {
      for (b = 0; b < 4; b += 1) {
        for (c = 0; c < 4; c += 1) {
          for (d = 0; d < 4; d += 1) {
            states.push({
              state_id: stateId(a, b, c, d),
              axisA: axisA[a],
              axisB: axisB[b],
              axisC: axisC[c],
              axisD: axisD[d],
              a: a,
              b: b,
              c: c,
              d: d
            });
          }
        }
      }
    }

    return {
      label: label,
      ok: states.length === STATE_COUNT,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      axisA: axisA,
      axisB: axisB,
      axisC: axisC,
      axisD: axisD,
      states: states
    };
  }

  function buildTriDomainReceipts() {
    return {
      wholeWorld256: buildStateSpaceReceipt(
        "WHOLE_WORLD_256",
        ["CONTAINER_SOURCE", "DOMAIN_BALANCE", "CYCLE_EXCHANGE", "VISIBLE_COHERENCE"],
        ["WATER_DOMINANT", "LAND_DOMINANT", "AIR_DOMINANT", "TRI_DOMAIN_BALANCED"],
        ["BOUNDARY_HELD", "CONTACT_ACTIVE", "EXCHANGE_ACTIVE", "COHERENCE_ACTIVE"],
        ["HIDDEN", "SUBTLE", "READABLE", "DOMINANT_RESTRAINED"]
      ),
      water256: buildStateSpaceReceipt(
        "WATER_256",
        ["OCEAN_BASIN", "REEF_SHELF", "BEACH_THRESHOLD", "ICE_STORAGE"],
        ["LIQUID", "WET_EDGE", "MOISTURE", "FROZEN_PHASE"],
        ["BASIN", "FLOW", "CIRCULATION", "DIVIDE_RESPONSE"],
        ["HIDDEN", "SUBTLE", "READABLE", "DOMINANT_RESTRAINED"]
      ),
      land256: buildStateSpaceReceipt(
        "LAND_256",
        ["NO_LAND", "BEACH_STARTLINE", "LOWLAND", "ELEVATED_TERRAIN"],
        ["SOIL_MOISTURE", "LIVING_TERRAIN", "RIDGE", "WATER_DIVIDE"],
        ["SOFT_MATERIAL", "STONE_HINT", "SLOPE_HINT", "ICE_BEARING_HEIGHT"],
        ["HIDDEN", "SUBTLE", "READABLE", "DOMINANT_RESTRAINED"]
      ),
      air256: buildStateSpaceReceipt(
        "AIR_256",
        ["ATMOSPHERE_HELD", "HUMIDITY", "WIND_EXCHANGE", "PRESSURE_SYSTEM"],
        ["CLEAR_AIR", "MIST", "CLOUD_HINT", "STORM_PRESSURE_HELD"],
        ["OCEAN_AIR", "LAND_AIR", "RIDGE_AIR", "ICE_AIR"],
        ["HIDDEN", "SUBTLE", "READABLE", "DOMINANT_RESTRAINED"]
      )
    };
  }

  function bodyScore(lon, lat, centerLon, centerLat, rx, ry, weight, wrap) {
    var dx = Math.abs(normalizeLon(lon - centerLon)) / rx;
    var dy = (lat - centerLat) / ry;
    var curve = Math.cos(degToRad(lon - centerLon)) * wrap;
    return weight * (1 - (dx * dx + dy * dy)) + curve;
  }

  function landPotential(lon, lat, seed) {
    var west = bodyScore(lon, lat, -92, 4, 72, 78, 1.03, 0.15);
    var east = bodyScore(lon, lat, 96, -6, 66, 72, 0.98, 0.13);
    var north = bodyScore(lon, lat, 28, 38, 36, 28, 0.66, 0.04);
    var south = bodyScore(lon, lat, -22, -38, 42, 30, 0.64, 0.04);
    var far = bodyScore(lon, lat, 178, 14, 34, 42, 0.58, 0.10);
    var grain = (fbm(lon, lat, seed + 300) - 0.5) * 0.24;

    return Math.max(west, east, north, south, far) + grain;
  }

  function nodalIndex256(lon, lat) {
    var lonBand = Math.floor(((normalizeLon(lon) + 180) / 360) * 16);
    var latBand = Math.floor(((clamp(lat, -90, 90) + 90) / 180) * 16);
    return clamp(latBand, 0, 15) * 16 + clamp(lonBand, 0, 15);
  }

  function cardinalNode(lon, lat) {
    var absLon = Math.abs(normalizeLon(lon));
    var absLat = Math.abs(lat);

    if (absLat >= absLon * 0.55) return lat >= 0 ? "NORTH" : "SOUTH";
    return normalizeLon(lon) >= 0 ? "EAST" : "WEST";
  }

  function sampleBridge(lon, lat, options) {
    options = options || {};
    var seed = Number(options.seed || SEED);

    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;
    var potential = landPotential(lon, lat, seed);
    var ridge = ridgeSignal(lon, lat, seed);
    var texture = fbm(lon * 2.8, lat * 2.35, seed + 840);
    var fine = fbm(lon * 6.4, lat * 5.7, seed + 1210);
    var airNoise = fbm(lon * 1.4 + 55, lat * 1.2 - 21, seed + 2200);

    var outline = smoothstep(0.055, 0.34, potential);
    var shelf = clamp(1 - Math.abs(potential - 0.055) / 0.30, 0, 1);
    var coastContact = clamp(1 - Math.abs(potential - 0.13) / 0.15, 0, 1);

    var reefNoise = fbm(lon * 2.5, lat * 2.1, seed + 909);
    var reef = clamp(shelf * coastContact * smoothstep(0.42, 0.92, reefNoise) * (1 - polar), 0, 1);
    var shallow = clamp(shelf * (1 - smoothstep(0.38, 0.75, potential)), 0, 1);
    var wetEdge = clamp(coastContact * outline * 0.88, 0, 1);

    var beachCandidate = clamp(
      wetEdge *
      smoothstep(0.12, 0.44, potential) *
      (1 - reef * 0.25),
      0,
      1
    );

    var beachLock = clamp(
      beachCandidate *
      smoothstep(0.38, 0.72, coastContact) *
      smoothstep(0.22, 0.50, outline),
      0,
      1
    );

    var shorelineDistance = clamp(1 - coastContact, 0, 1);

    var terrainPermission = clamp(
      beachLock * 0.42 +
      outline * smoothstep(0.48, 0.84, potential) * 0.58,
      0,
      1
    );

    var lowlandValue = clamp(
      terrainPermission *
      (wetEdge * 0.42 + shallow * 0.24 + (1 - smoothstep(0.56, 0.78, potential)) * 0.46),
      0,
      1
    );

    var livingTerrainValue = clamp(
      terrainPermission *
      smoothstep(0.50, 0.88, potential) *
      (0.54 + texture * 0.34) *
      (1 - reef * 0.50),
      0,
      1
    );

    var ridgeValue = clamp(
      terrainPermission *
      ridge *
      smoothstep(0.66, 0.98, potential) *
      (0.36 + fine * 0.28),
      0,
      1
    );

    var waterDivideValue = clamp(
      ridgeValue * 0.72 +
      terrainPermission * ridge * smoothstep(0.74, 1.00, potential) * 0.28,
      0,
      1
    );

    var highElevationIceState = clamp(
      waterDivideValue *
      (0.34 + absLat / 130) *
      (1 - reef * 0.86),
      0,
      1
    );

    var futureMeltPermission = clamp(
      highElevationIceState * 0.62 +
      waterDivideValue * terrainPermission * 0.22,
      0,
      1
    );

    var moistureValue = clamp(
      shallow * 0.24 +
      wetEdge * 0.28 +
      beachLock * 0.16 +
      lowlandValue * 0.25 +
      highElevationIceState * 0.18,
      0,
      1
    );

    var elevationValue = clamp(
      terrainPermission * 0.36 +
      livingTerrainValue * 0.20 +
      ridgeValue * 0.26 +
      highElevationIceState * 0.18,
      0,
      1
    );

    var reefShelfRelation = clamp(reef * 0.56 + shelf * 0.44, 0, 1);

    var materialTone = clamp(
      beachLock * 0.24 +
      lowlandValue * 0.22 +
      livingTerrainValue * 0.26 +
      ridgeValue * 0.14 +
      highElevationIceState * 0.14,
      0,
      1
    );

    var terrainIdentity = clamp(
      lowlandValue * 0.22 +
      livingTerrainValue * 0.34 +
      ridgeValue * 0.26 +
      highElevationIceState * 0.18,
      0,
      1
    );

    var landVisualWeight = clamp(
      beachLock * 0.24 +
      lowlandValue * 0.18 +
      livingTerrainValue * 0.28 +
      ridgeValue * 0.16 +
      highElevationIceState * 0.18,
      0,
      1
    );

    var waterDepth = clamp(
      0.78 -
      potential * 0.45 -
      shelf * 0.18 -
      reef * 0.12 -
      beachLock * 0.04 +
      highElevationIceState * 0.05,
      0.08,
      0.96
    );

    if (polar) {
      waterDepth = clamp(waterDepth * 0.70 + highElevationIceState * 0.10, 0.10, 0.66);
    }

    var waterDomainValue = clamp(
      waterDepth * 0.48 +
      shelf * 0.14 +
      reef * 0.12 +
      wetEdge * 0.12 +
      highElevationIceState * 0.14,
      0,
      1
    );

    var landDomainValue = clamp(
      terrainPermission * 0.28 +
      lowlandValue * 0.18 +
      livingTerrainValue * 0.24 +
      ridgeValue * 0.16 +
      highElevationIceState * 0.14,
      0,
      1
    );

    var humidityValue = clamp(
      waterDomainValue * 0.34 +
      moistureValue * 0.30 +
      wetEdge * 0.16 +
      airNoise * 0.20,
      0,
      1
    );

    var windExchangeValue = clamp(
      Math.abs(Math.sin(degToRad(lon * 1.7 + lat * 0.8))) * 0.22 +
      ridgeValue * 0.22 +
      coastContact * 0.20 +
      airNoise * 0.36,
      0,
      1
    );

    var pressureValue = clamp(
      0.28 +
      absLat / 220 +
      ridgeValue * 0.16 +
      highElevationIceState * 0.14 +
      airNoise * 0.28,
      0,
      1
    );

    var cloudPotential = clamp(
      humidityValue * 0.42 +
      windExchangeValue * 0.20 +
      pressureValue * 0.18 +
      highElevationIceState * 0.20,
      0,
      1
    );

    var airDomainValue = clamp(
      humidityValue * 0.30 +
      windExchangeValue * 0.26 +
      pressureValue * 0.24 +
      cloudPotential * 0.20,
      0,
      1
    );

    var waterLandExchange = clamp(beachLock * 0.42 + wetEdge * 0.30 + lowlandValue * 0.28, 0, 1);
    var landAirExchange = clamp(elevationValue * 0.34 + ridgeValue * 0.28 + windExchangeValue * 0.38, 0, 1);
    var airWaterExchange = clamp(humidityValue * 0.36 + cloudPotential * 0.30 + waterDepth * 0.20 + highElevationIceState * 0.14, 0, 1);

    var triDomainCycleValue = clamp(
      waterLandExchange * 0.34 +
      landAirExchange * 0.33 +
      airWaterExchange * 0.33,
      0,
      1
    );

    var wholeWorldCoherence = clamp(
      waterDomainValue * 0.25 +
      landDomainValue * 0.25 +
      airDomainValue * 0.25 +
      triDomainCycleValue * 0.25,
      0,
      1
    );

    var sourceAuthorityState = 0;
    if (reefShelfRelation > 0.24) sourceAuthorityState = 1;
    if (beachLock > 0.32 || terrainPermission > 0.22) sourceAuthorityState = 2;
    if (waterDivideValue > 0.30 || highElevationIceState > 0.24) sourceAuthorityState = 3;

    var waterPhaseStateIndex = 0;
    if (moistureValue > 0.30 || lowlandValue > 0.18) waterPhaseStateIndex = 1;
    if (livingTerrainValue > 0.26 || ridgeValue > 0.20) waterPhaseStateIndex = 2;
    if (highElevationIceState > 0.22) waterPhaseStateIndex = 3;

    var landIdentityState = 0;
    if (lowlandValue > 0.18) landIdentityState = 1;
    if (livingTerrainValue > 0.26) landIdentityState = 2;
    if (ridgeValue > 0.24 || waterDivideValue > 0.24) landIdentityState = 3;

    var visualWeightState = 0;
    if (landVisualWeight > 0.18) visualWeightState = 1;
    if (landVisualWeight > 0.34) visualWeightState = 2;
    if (landVisualWeight > 0.56) visualWeightState = 3;

    var waterState = stateId(
      waterDepth > 0.64 ? 0 : shelf > 0.34 ? 1 : beachLock > 0.22 ? 2 : 3,
      waterPhaseStateIndex,
      wetEdge > 0.22 ? 1 : reef > 0.22 ? 2 : highElevationIceState > 0.22 ? 3 : 0,
      visualWeightState
    );

    var landState = stateId(
      terrainPermission > 0.44 ? 3 : terrainPermission > 0.22 ? 2 : beachLock > 0.16 ? 1 : 0,
      lowlandValue > 0.22 ? 1 : livingTerrainValue > 0.28 ? 2 : ridgeValue > 0.24 ? 3 : 0,
      materialTone > 0.42 ? 2 : highElevationIceState > 0.24 ? 3 : 1,
      visualWeightState
    );

    var airState = stateId(
      humidityValue > 0.42 ? 1 : windExchangeValue > 0.42 ? 2 : pressureValue > 0.52 ? 3 : 0,
      cloudPotential > 0.50 ? 2 : humidityValue > 0.36 ? 1 : pressureValue > 0.58 ? 3 : 0,
      landAirExchange > 0.44 ? 2 : airWaterExchange > 0.44 ? 1 : highElevationIceState > 0.24 ? 3 : 0,
      cloudPotential > 0.58 ? 2 : airDomainValue > 0.42 ? 1 : pressureValue > 0.70 ? 3 : 0
    );

    var wholeState = stateId(
      wholeWorldCoherence > 0.64 ? 3 : wholeWorldCoherence > 0.44 ? 2 : wholeWorldCoherence > 0.24 ? 1 : 0,
      waterDomainValue >= landDomainValue && waterDomainValue >= airDomainValue ? 0 :
        landDomainValue >= waterDomainValue && landDomainValue >= airDomainValue ? 1 :
        airDomainValue >= waterDomainValue && airDomainValue >= landDomainValue ? 2 : 3,
      triDomainCycleValue > 0.62 ? 3 : triDomainCycleValue > 0.42 ? 2 : triDomainCycleValue > 0.22 ? 1 : 0,
      visualWeightState
    );

    var sourceTraceValid = (
      waterDomainValue >= 0 &&
      landDomainValue >= 0 &&
      airDomainValue >= 0 &&
      wholeWorldCoherence >= 0 &&
      (
        landIdentityState === 0 ||
        beachLock > 0.14 ||
        moistureValue > 0.16 ||
        elevationValue > 0.18 ||
        highElevationIceState > 0.12
      )
    );

    var unauthorizedPaint = !sourceTraceValid || (visualWeightState >= 2 && landIdentityState === 0);
    var authorizedVisualWeight = unauthorizedPaint ? 0 : landVisualWeight;

    return {
      VERSION: VERSION,
      version: VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,
      nodalIndex256: nodalIndex256(lon, lat),
      nodal_index_256: nodalIndex256(lon, lat),
      cardinalNode: cardinalNode(lon, lat),
      cardinal_node: cardinalNode(lon, lat),

      wholeWorldContainerActive: true,
      triDomain256Active: true,
      water256Active: true,
      land256Active: true,
      air256Active: true,
      wholeWorld256Active: true,
      domainShare: DOMAIN_SHARE,
      domain_share: DOMAIN_SHARE,

      triDomainCycleActive: true,
      domainContactZonesActive: true,
      waterLandExchangeActive: true,
      landAirExchangeActive: true,
      airWaterExchangeActive: true,

      landValueMapActive: true,
      invertedBacktraceActive: true,
      sourceTraceValidationActive: true,

      terrainPermissionFieldActive: true,
      elevationValueFieldActive: true,
      moistureValueFieldActive: true,
      shorelineDistanceFieldActive: true,
      reefShelfRelationFieldActive: true,
      lowlandValueFieldActive: true,
      livingTerrainValueFieldActive: true,
      ridgeValueFieldActive: true,
      waterDivideValueFieldActive: true,
      waterPhaseStateFieldActive: true,
      highElevationIceStateFieldActive: true,
      futureMeltPermissionFieldActive: true,
      materialToneFieldActive: true,
      visualWeightFieldActive: true,
      terrainIdentityFieldActive: true,

      visualWeightBacktraceFieldActive: true,
      terrainIdentityBacktraceFieldActive: true,
      waterPhaseBacktraceFieldActive: true,
      sourceAuthorityBacktraceFieldActive: true,
      forwardValueFieldActive: true,
      reverseValidationFieldActive: true,
      unauthorizedPaintBlocked: true,

      terrainLifeLowReliefActive: true,
      lowEmergentLandFieldActive: true,
      wetLowlandFieldActive: true,
      dryLowlandFieldActive: true,
      softLandToneFieldActive: true,
      earlyStoneToneFieldActive: true,
      microReliefFieldActive: true,
      waterResponseFieldActive: true,
      highElevationFrozenWaterCandidateFieldActive: true,
      watershedDivideCandidateFieldActive: true,
      futureMeltPathPermissionFieldActive: true,

      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,
      waterSovereigntyPreserved: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepth: round(waterDepth, 4),
      water_depth: round(waterDepth, 4),
      terrainOutline: round(outline, 4),
      terrain_outline: round(outline, 4),
      officialCoastline: round(coastContact, 4),
      official_coastline: round(coastContact, 4),
      shorelineDistance: round(shorelineDistance, 4),
      shoreline_distance: round(shorelineDistance, 4),

      shelfField: round(shelf, 4),
      shelf_field: round(shelf, 4),
      reefField: round(reef, 4),
      reef_field: round(reef, 4),
      reefShelfRelation: round(reefShelfRelation, 4),
      reef_shelf_relation: round(reefShelfRelation, 4),
      shallowWaterField: round(shallow, 4),
      shallow_water_field: round(shallow, 4),
      wetEdge: round(wetEdge, 4),
      wet_edge: round(wetEdge, 4),

      beachCandidate: round(beachCandidate, 4),
      beach_candidate: round(beachCandidate, 4),
      beachLock: round(beachLock, 4),
      beach_lock: round(beachLock, 4),

      terrainPermission: round(terrainPermission, 4),
      terrain_permission: round(terrainPermission, 4),
      elevationValue: round(elevationValue, 4),
      elevation_value: round(elevationValue, 4),
      moistureValue: round(moistureValue, 4),
      moisture_value: round(moistureValue, 4),

      lowlandValue: round(lowlandValue, 4),
      lowland_value: round(lowlandValue, 4),
      livingTerrainValue: round(livingTerrainValue, 4),
      living_terrain_value: round(livingTerrainValue, 4),
      ridgeValue: round(ridgeValue, 4),
      ridge_value: round(ridgeValue, 4),
      waterDivideValue: round(waterDivideValue, 4),
      water_divide_value: round(waterDivideValue, 4),

      highElevationIceState: round(highElevationIceState, 4),
      high_elevation_ice_state: round(highElevationIceState, 4),
      highElevationFrozenWaterCandidate: round(highElevationIceState, 4),
      high_elevation_frozen_water_candidate: round(highElevationIceState, 4),
      futureMeltPermission: round(futureMeltPermission, 4),
      future_melt_permission: round(futureMeltPermission, 4),
      futureMeltPathPermission: round(futureMeltPermission, 4),
      future_melt_path_permission: round(futureMeltPermission, 4),

      materialTone: round(materialTone, 4),
      material_tone: round(materialTone, 4),
      visualWeight: round(authorizedVisualWeight, 4),
      visual_weight: round(authorizedVisualWeight, 4),
      terrainIdentity: round(terrainIdentity, 4),
      terrain_identity: round(terrainIdentity, 4),

      waterDomainValue: round(waterDomainValue, 4),
      water_domain_value: round(waterDomainValue, 4),
      landDomainValue: round(landDomainValue, 4),
      land_domain_value: round(landDomainValue, 4),
      airDomainValue: round(airDomainValue, 4),
      air_domain_value: round(airDomainValue, 4),
      humidityValue: round(humidityValue, 4),
      humidity_value: round(humidityValue, 4),
      windExchangeValue: round(windExchangeValue, 4),
      wind_exchange_value: round(windExchangeValue, 4),
      pressureValue: round(pressureValue, 4),
      pressure_value: round(pressureValue, 4),
      cloudPotential: round(cloudPotential, 4),
      cloud_potential: round(cloudPotential, 4),
      waterLandExchange: round(waterLandExchange, 4),
      water_land_exchange: round(waterLandExchange, 4),
      landAirExchange: round(landAirExchange, 4),
      land_air_exchange: round(landAirExchange, 4),
      airWaterExchange: round(airWaterExchange, 4),
      air_water_exchange: round(airWaterExchange, 4),
      triDomainCycleValue: round(triDomainCycleValue, 4),
      tri_domain_cycle_value: round(triDomainCycleValue, 4),
      wholeWorldCoherence: round(wholeWorldCoherence, 4),
      whole_world_coherence: round(wholeWorldCoherence, 4),

      sourceAuthorityState: sourceAuthorityState,
      waterPhaseStateIndex: waterPhaseStateIndex,
      landIdentityState: landIdentityState,
      visualWeightState: visualWeightState,

      waterStateId: waterState,
      water_state_id: waterState,
      landStateId: landState,
      land_state_id: landState,
      airStateId: airState,
      air_state_id: airState,
      wholeStateId: wholeState,
      whole_state_id: wholeState,

      sourceTraceValid: sourceTraceValid,
      source_trace_valid: sourceTraceValid,
      reverseValidation: sourceTraceValid,
      reverse_validation: sourceTraceValid,
      unauthorizedPaint: unauthorizedPaint,
      unauthorized_paint: unauthorizedPaint,
      unauthorizedDominantVisualBlocked: true,

      terrainFill: 0,
      terrain_fill: 0,
      mountainRelief: 0,
      mountain_relief: 0,
      riverNetwork: 0,
      river_network: 0,
      fullGlacierSystem: 0,
      full_glacier_system: 0,

      state_id: wholeState,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      domainStateTotal: STATE_COUNT * 4,

      visualPassClaimed: false
    };
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c;
    var sinC;
    var cosC;
    var lat0;
    var lon0;
    var lat;
    var lon;

    if (rho > 1) return null;
    if (rho < 0.000001) return { lon: normalizeLon(viewLon), lat: viewLat || 0, limb: 1 };

    c = Math.asin(rho);
    sinC = Math.sin(c);
    cosC = Math.cos(c);
    lat0 = degToRad(viewLat || 0);
    lon0 = degToRad(viewLon || 0);

    lat = Math.asin(cosC * Math.sin(lat0) + (y * sinC * Math.cos(lat0)) / rho);
    lon = lon0 + Math.atan2(
      x * sinC,
      rho * Math.cos(lat0) * cosC - y * Math.sin(lat0) * sinC
    );

    return {
      lon: normalizeLon(radToDeg(lon)),
      lat: clamp(radToDeg(lat), -90, 90),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function getHydration() {
    return global.DGBPlanetOneHydrationRender || null;
  }

  function blendPixel(base, over, alpha) {
    return [
      Math.round(mix(base[0], over[0], alpha)),
      Math.round(mix(base[1], over[1], alpha)),
      Math.round(mix(base[2], over[2], alpha)),
      255
    ];
  }

  function colorFromBridge(sample, hydration, limb) {
    var water = hydration && hydration.waterColor ? hydration.waterColor : { r: 12, g: 70, b: 130 };
    var out = [water.r, water.g, water.b, 255];

    var shelfTone = [46, 148, 178, 255];
    var reefTone = [82, 190, 188, 255];
    var beachTone = [232, 214, 154, 255];

    var wetLowlandTone = [96, 142, 92, 255];
    var livingTerrainTone = [82, 130, 74, 255];
    var ridgeTone = [126, 132, 118, 255];
    var iceTone = [184, 228, 234, 255];

    var airBlueTone = [150, 188, 235, 255];
    var cloudTone = [205, 222, 234, 255];

    out = blendPixel(out, shelfTone, clamp(sample.reefShelfRelation * 0.11, 0, 0.11));
    out = blendPixel(out, reefTone, clamp(sample.reefField * 0.17, 0, 0.17));
    out = blendPixel(out, beachTone, clamp(sample.beachLock * 0.26 + sample.beachCandidate * 0.10, 0, 0.30));

    out = blendPixel(out, wetLowlandTone, clamp(sample.lowlandValue * 0.24, 0, 0.24));
    out = blendPixel(out, livingTerrainTone, clamp(sample.livingTerrainValue * 0.32, 0, 0.32));
    out = blendPixel(out, ridgeTone, clamp(sample.ridgeValue * 0.22, 0, 0.22));
    out = blendPixel(out, iceTone, clamp(sample.highElevationIceState * 0.34, 0, 0.34));

    out = blendPixel(out, airBlueTone, clamp(sample.airDomainValue * 0.06, 0, 0.06));
    out = blendPixel(out, cloudTone, clamp(sample.cloudPotential * sample.airDomainValue * 0.055, 0, 0.055));

    var shade = clamp(0.54 + limb * 0.48, 0.38, 1.10);
    out[0] = Math.round(clamp(out[0] * shade, 0, 255));
    out[1] = Math.round(clamp(out[1] * shade, 0, 255));
    out[2] = Math.round(clamp(out[2] * shade, 0, 255));

    return out;
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    return null;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    if (!ctx) {
      return {
        ok: false,
        reason: "NO_CANVAS_CONTEXT",
        version: VERSION,
        layerVersion: LAYER_VERSION,
        visualPassClaimed: false
      };
    }

    var options = gridOrOptions && gridOrOptions.cells ? maybeOptions || {} : gridOrOptions || {};
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.80), 0.52, 1);
    var offW = Math.max(260, Math.round(canvas.width * scale));
    var offH = Math.max(260, Math.round(canvas.height * scale));
    var off = document.createElement("canvas");
    var offCtx;
    var img;
    var data;
    var cx = offW / 2;
    var cy = offH / 2;
    var radius = Number(options.radius || Math.min(canvas.width, canvas.height) * 0.43) * scale;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var seed = Number(options.seed || SEED);
    var hydrationEngine = getHydration();

    var x;
    var y;
    var dx;
    var dy;
    var geo;
    var sample;
    var hydration;
    var color;
    var i;

    off.width = offW;
    off.height = offH;
    offCtx = off.getContext("2d");
    img = offCtx.createImageData(offW, offH);
    data = img.data;

    for (y = 0; y < offH; y += 1) {
      for (x = 0; x < offW; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
        i = (y * offW + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[i + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, viewLon, viewLat);
        if (!geo) {
          data[i + 3] = 0;
          continue;
        }

        sample = sampleBridge(geo.lon, geo.lat, { seed: seed });
        hydration = hydrationEngine && hydrationEngine.sampleHydrationDepth
          ? hydrationEngine.sampleHydrationDepth(geo.lon, geo.lat, sample)
          : null;

        color = colorFromBridge(sample, hydration, geo.limb);

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = color[3];
      }
    }

    offCtx.putImageData(img, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = Number(options.surfaceAlpha == null ? 0.99 : options.surfaceAlpha);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      VERSION: VERSION,
      layerVersion: LAYER_VERSION,
      LAYER_VERSION: LAYER_VERSION,

      wholeWorldContainerRendered: true,
      triDomain256Rendered: true,
      water256Rendered: true,
      land256Rendered: true,
      air256Rendered: true,
      wholeWorld256Rendered: true,
      triDomainCycleRendered: true,
      domainContactZonesRendered: true,
      waterLandExchangeRendered: true,
      landAirExchangeRendered: true,
      airWaterExchangeRendered: true,

      landValueMapRendered: true,
      invertedBacktraceRendered: true,
      sourceTraceValidationRendered: true,
      visibleTerrainBacktracedToSource: true,
      unauthorizedPaintBlocked: true,
      waterPhaseContinuityVisible: true,

      terrainLifeRendered: true,
      lowReliefRendered: true,
      wetDryTerrainVariationRendered: true,
      waterDivideRendered: true,
      phaseStateDivideRendered: true,
      highElevationIceStateRendered: true,
      highElevationFrozenWaterCandidateRendered: true,
      watershedDivideHintRendered: true,
      futureMeltPathHeld: true,

      waterRemainsSovereign: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepthPreserved: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      terrainFillBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,
      noPublicHoneycomb: true,
      noPublicDotGrid: true,

      rendererConsumesHydration: Boolean(hydrationEngine),
      rendererConsumesHexBridge: true,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return lastDraw;
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};
    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var cells = [];
    var lon;
    var lat;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(sampleBridge(lon, lat, options));
      }
    }

    lastGrid = {
      version: VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      domainStateTotal: STATE_COUNT * 4,
      domainShare: DOMAIN_SHARE,
      cellCount: cells.length,
      cells: cells,
      visualPassClaimed: false
    };

    return lastGrid;
  }

  function getHexgridStatus() {
    var receipts = buildTriDomainReceipts();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      wholeWorldContainerActive: true,
      triDomain256Active: true,
      water256Active: true,
      land256Active: true,
      air256Active: true,
      wholeWorld256Active: true,
      triDomainCycleActive: true,
      domainContactZonesActive: true,
      waterLandExchangeActive: true,
      landAirExchangeActive: true,
      airWaterExchangeActive: true,
      domainShare: DOMAIN_SHARE,

      landValueMapActive: true,
      invertedBacktraceActive: true,
      sourceTraceValidationActive: true,

      terrainPermissionFieldActive: true,
      elevationValueFieldActive: true,
      moistureValueFieldActive: true,
      shorelineDistanceFieldActive: true,
      reefShelfRelationFieldActive: true,
      lowlandValueFieldActive: true,
      livingTerrainValueFieldActive: true,
      ridgeValueFieldActive: true,
      waterDivideValueFieldActive: true,
      waterPhaseStateFieldActive: true,
      highElevationIceStateFieldActive: true,
      futureMeltPermissionFieldActive: true,
      materialToneFieldActive: true,
      visualWeightFieldActive: true,
      terrainIdentityFieldActive: true,

      visualWeightBacktraceFieldActive: true,
      terrainIdentityBacktraceFieldActive: true,
      waterPhaseBacktraceFieldActive: true,
      sourceAuthorityBacktraceFieldActive: true,
      forwardValueFieldActive: true,
      reverseValidationFieldActive: true,
      unauthorizedPaintBlocked: true,

      terrainLifeLowReliefActive: true,
      lowEmergentLandFieldActive: true,
      wetLowlandFieldActive: true,
      dryLowlandFieldActive: true,
      softLandToneFieldActive: true,
      earlyStoneToneFieldActive: true,
      microReliefFieldActive: true,
      waterResponseFieldActive: true,
      highElevationFrozenWaterCandidateFieldActive: true,
      watershedDivideCandidateFieldActive: true,
      futureMeltPathPermissionFieldActive: true,

      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,
      waterSovereigntyPreserved: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      domainStateTotal: STATE_COUNT * 4,
      wholeWorld256Receipt: receipts.wholeWorld256,
      water256Receipt: receipts.water256,
      land256Receipt: receipts.land256,
      air256Receipt: receipts.air256,

      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      lastGrid: lastGrid ? { cellCount: lastGrid.cellCount, version: lastGrid.version, layerVersion: lastGrid.layerVersion } : null,
      lastDraw: lastDraw,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    LAYER_VERSION: LAYER_VERSION,
    layerVersion: LAYER_VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,
    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    requiredStateCount: STATE_COUNT,

    sampleBridge: sampleBridge,
    samplePlanetSurface: sampleBridge,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: getHexgridStatus,
    getLatticeReceipt: buildTriDomainReceipts,
    getStateSpaceReceipt: buildTriDomainReceipts
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:tri-domain-256-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
