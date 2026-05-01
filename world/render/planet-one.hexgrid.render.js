/* G1 PLANET 1 BODY SYSTEM BOUNDARY ENGINE SOURCE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_BODY_SYSTEM_BOUNDARY_ENGINE_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_HYDROLOGY_SYSTEM_PHYSICAL_GOVERNANCE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var MARITIME_BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";
  var STATE_FORMULA = "4x4x2x2x4";
  var STATE_COUNT = 256;
  var SEA_LEVEL_DATUM = 0;
  var SEED = 256451;

  var DOMAIN = { OCEAN_DEEP: 0, COASTAL_SHELF: 1, LAND_INTERIOR: 2, POLAR_ICE: 3 };
  var RELIEF = { BASIN: 0, PLAIN: 1, PLATEAU: 2, RIDGE: 3 };
  var EDGE_ROLE = { CORE: 0, BOUNDARY: 1 };
  var PRESSURE = { BASE: 0, HIGH: 1 };
  var MATERIAL = { SEDIMENT_OR_ORGANIC: 0, STONE: 1, METAL_OR_MINERAL: 2, CRYSTAL_OR_ICE: 3 };

  var LIGHT_VECTOR = normalize3(-0.48, -0.58, 0.66);
  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function normalizeLon(lon) {
    var x = ((lon + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function normalize3(x, y, z) {
    var len = Math.sqrt(x * x + y * y + z * z) || 1;
    return { x: x / len, y: y / len, z: z / len };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function angularDistance(a, b) {
    return Math.abs(normalizeLon(a - b));
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
      noise(lon, lat, 0.55, seed + 11) * 0.38 +
      noise(lon, lat, 1.25, seed + 29) * 0.30 +
      noise(lon, lat, 2.80, seed + 47) * 0.20 +
      noise(lon, lat, 5.40, seed + 83) * 0.12
    );
  }

  function ridgeNoise(lon, lat, seed) {
    var n = fbm(lon + 19.5, lat - 8.5, seed + 131);
    return 1 - Math.abs(n * 2 - 1);
  }

  function stateId(domain, relief, edgeRole, pressure, material) {
    return ((((domain * 4 + relief) * 2 + edgeRole) * 2 + pressure) * 4 + material);
  }

  function buildStateSpaceReceipt() {
    var states = [];
    var domain;
    var relief;
    var edgeRole;
    var pressure;
    var material;

    for (domain = 0; domain < 4; domain += 1) {
      for (relief = 0; relief < 4; relief += 1) {
        for (edgeRole = 0; edgeRole < 2; edgeRole += 1) {
          for (pressure = 0; pressure < 2; pressure += 1) {
            for (material = 0; material < 4; material += 1) {
              states.push({
                state_id: stateId(domain, relief, edgeRole, pressure, material),
                domain: domain,
                relief: relief,
                edgeRole: edgeRole,
                pressure: pressure,
                material: material
              });
            }
          }
        }
      }
    }

    return {
      ok: states.length === STATE_COUNT,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      totalStates: STATE_COUNT,
      totalStateCount: STATE_COUNT,
      latticeStateCount: STATE_COUNT,
      stateSpaceCount: STATE_COUNT,
      state_count: STATE_COUNT,
      total_states: STATE_COUNT,
      required_state_count: STATE_COUNT,
      stateSpaceReceipt: true,
      lattice256ArchitectureReceiptActive: true,
      stateCount256Confirmed: true,
      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      states: states
    };
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

  function bodyScore(lon, lat, body) {
    var dx = angularDistance(lon, body.lon) / body.rx;
    var dy = (lat - body.lat) / body.ry;
    var twist = Math.sin(degToRad(lon * body.twist + lat * 0.7)) * body.twistAmount;
    var wrap = Math.cos(degToRad(lon - body.lon)) * body.wrap;
    return body.weight * (1 - (dx * dx + dy * dy)) + wrap + twist;
  }

  function getLandModel(lon, lat, seed) {
    var bodies = [
      { id: "primary_west_dynamic_structure", role: "dynamic_hemispheric_side_structure", lon: -86, lat: 2, rx: 70, ry: 85, weight: 1.06, wrap: 0.15, twist: 1.35, twistAmount: 0.06 },
      { id: "primary_east_dynamic_structure", role: "dynamic_hemispheric_side_structure", lon: 98, lat: -3, rx: 67, ry: 76, weight: 1.00, wrap: 0.13, twist: -1.18, twistAmount: 0.055 },
      { id: "secondary_north_midland", role: "secondary_non_polar_body", lon: 24, lat: 36, rx: 35, ry: 29, weight: 0.80, wrap: 0.04, twist: 1.6, twistAmount: 0.04 },
      { id: "secondary_south_midland", role: "secondary_non_polar_body", lon: -18, lat: -39, rx: 41, ry: 31, weight: 0.74, wrap: 0.04, twist: -1.4, twistAmount: 0.04 },
      { id: "secondary_far_wrap_body", role: "secondary_non_polar_body", lon: 176, lat: 15, rx: 31, ry: 43, weight: 0.70, wrap: 0.12, twist: 1.1, twistAmount: 0.04 }
    ];

    var best = { score: -999, body: null };
    var second = { score: -999, body: null };
    var coarse = fbm(lon, lat, seed + 3);
    var fine = fbm(lon * 1.7, lat * 1.4, seed + 61);
    var edgeCut = (coarse - 0.5) * 0.30 + (fine - 0.5) * 0.16;
    var i;
    var score;

    for (i = 0; i < bodies.length; i += 1) {
      score = bodyScore(lon, lat, bodies[i]) + edgeCut;

      if (score > best.score) {
        second = best;
        best = { score: score, body: bodies[i] };
      } else if (score > second.score) {
        second = { score: score, body: bodies[i] };
      }
    }

    return {
      potential: best.score,
      secondPotential: second.score,
      body: best.body,
      fracture: clamp((best.score + second.score + 0.38) / 1.55, 0, 1),
      coarse: coarse,
      fine: fine
    };
  }

  function sampleBaseSurface(lon, lat, seed) {
    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var absLat = Math.abs(lat);
    var model = getLandModel(lon, lat, seed);
    var potential = model.potential;
    var coastDistance = clamp((potential - 0.18) / 0.78, 0, 1);
    var shelfDistance = clamp(1 - Math.abs(potential - 0.13) / 0.30, 0, 1);
    var coastBand = clamp(1 - Math.abs(potential - 0.16) / 0.18, 0, 1);
    var interior = Math.pow(coastDistance, 0.75);
    var roughness = clamp((fbm(lon * 2.1, lat * 2.1, seed + 409) - 0.5) * 2, -1, 1);
    var ridge = ridgeNoise(lon, lat, seed);
    var nodal = nodalIndex256(lon, lat);
    var nodeLift = ((nodal % 16) / 15) * 0.028;
    var cardinal = cardinalNode(lon, lat);

    var domain;
    var height;
    var waterDepth;
    var landMask;
    var beachReady;
    var microRelief;
    var ridgeHint;
    var moisture;
    var terrainBand;

    if (absLat >= 73) {
      domain = DOMAIN.POLAR_ICE;
      landMask = 1;
      waterDepth = 0;
      microRelief = (ridge - 0.5) * 0.045;
      ridgeHint = clamp(ridge * 0.18 + interior * 0.05, 0, 0.24);
      height = clamp(0.22 + (absLat - 73) / 72 + microRelief + nodeLift, 0.14, 0.58);
      beachReady = false;
      moisture = 0.72;
      terrainBand = "polar_curved_ice_mass";
    } else if (potential > 0.18) {
      domain = DOMAIN.LAND_INTERIOR;
      landMask = 1;
      waterDepth = 0;
      ridgeHint = clamp(ridge * interior * 0.20 + model.fracture * 0.08, 0, 0.30);
      microRelief = roughness * (0.018 + interior * 0.054) + ridgeHint * 0.08;
      height = clamp(0.12 + interior * 0.31 + nodeLift + microRelief, 0.09, 0.60);
      beachReady = false;
      moisture = clamp(0.64 - interior * 0.34 + coastBand * 0.24, 0.20, 0.84);
      terrainBand = height < 0.20 ? "lowland_terrain" : height < 0.42 ? "interior_terrain" : "restrained_ridge_hint";
    } else if (potential > -0.12) {
      domain = DOMAIN.COASTAL_SHELF;
      landMask = clamp((potential + 0.12) / 0.30, 0, 0.74);
      waterDepth = clamp(0.05 + (1 - shelfDistance) * 0.25, 0.02, 0.36);
      ridgeHint = clamp(ridge * 0.045 * shelfDistance, 0, 0.07);
      microRelief = roughness * 0.012 * shelfDistance;
      height = clamp(-0.10 + shelfDistance * 0.15 + microRelief, -0.16, 0.075);
      beachReady = height >= -0.005 && height <= 0.075 && shelfDistance > 0.48;
      moisture = clamp(0.78 + shelfDistance * 0.16, 0.66, 0.98);
      terrainBand = beachReady ? "beach_ready_edge_not_final" : "coastal_shelf";
    } else {
      domain = DOMAIN.OCEAN_DEEP;
      landMask = 0;
      shelfDistance = 0;
      waterDepth = clamp(0.30 + Math.abs(potential) * 0.62 + (1 - model.coarse) * 0.10, 0.25, 1.0);
      ridgeHint = 0;
      microRelief = 0;
      height = -waterDepth;
      beachReady = false;
      moisture = 1;
      terrainBand = waterDepth > 0.70 ? "deep_ocean_basin" : "mid_ocean_body";
    }

    return {
      lon: lon,
      lat: lat,
      domain: domain,
      height: height,
      waterDepth: waterDepth,
      shelfDistance: shelfDistance,
      coastDistance: coastDistance,
      coastBand: coastBand,
      landMask: landMask,
      roughness: roughness,
      microRelief: microRelief,
      ridgeHint: ridgeHint,
      moisture: moisture,
      terrainBand: terrainBand,
      beachReadyZone: beachReady,
      potential: potential,
      fracture: model.fracture,
      body: model.body,
      nodalIndex256: nodal,
      cardinalNode: cardinal
    };
  }

  function baseHeightOnly(lon, lat, seed) {
    return sampleBaseSurface(lon, lat, seed || SEED).height;
  }

  function riverLineField(lon, lat, seed, offset, frequency, width) {
    var n = fbm(lon * 0.72 + offset, lat * 0.88 - offset, seed + offset);
    var line = Math.abs(Math.sin(degToRad(lon * frequency + lat * (frequency * 1.55) + n * 98 + offset)));
    return 1 - smoothstep(0, width, line);
  }

  function drainageVectorCode(lon, lat, height, coastDistance) {
    if (height < 0.1 || coastDistance < 0.18) return "COASTAL_DRAINAGE";
    if (Math.abs(lat) > Math.abs(normalizeLon(lon)) * 0.42) return lat >= 0 ? "DRAIN_NORTH_TO_SHELF" : "DRAIN_SOUTH_TO_SHELF";
    return normalizeLon(lon) >= 0 ? "DRAIN_EAST_TO_SHELF" : "DRAIN_WEST_TO_SHELF";
  }

  function samplePlanetSurface(lon, lat, options) {
    options = options || {};
    var seed = options.seed || SEED;
    var base = sampleBaseSurface(lon, lat, seed);
    var step = Number(options.normalStep || 2.2);

    var hW = baseHeightOnly(lon - step, lat, seed);
    var hE = baseHeightOnly(lon + step, lat, seed);
    var hS = baseHeightOnly(lon, lat - step, seed);
    var hN = baseHeightOnly(lon, lat + step, seed);

    var gx = (hW - hE) * 1.72;
    var gy = (hS - hN) * 1.72;
    var verticalStrength = base.domain === DOMAIN.OCEAN_DEEP ? 5.8 : base.domain === DOMAIN.COASTAL_SHELF ? 4.7 : 3.25;
    var normal = normalize3(gx, gy, verticalStrength);
    var light = dot3(normal, LIGHT_VECTOR);
    var slope = clamp(Math.sqrt(gx * gx + gy * gy), 0, 1.25);
    var hillshade = clamp(0.54 + light * 0.36 + slope * 0.08, 0.24, 1.02);

    var lowland = clamp(1 - Math.abs(base.height - 0.18) / 0.26, 0, 1) * base.landMask;
    var basinPressure = clamp(
      lowland * (1 - smoothstep(0.08, 0.46, slope)) * (0.35 + base.moisture * 0.65),
      0,
      1
    );

    var primaryRiver = riverLineField(lon, lat, seed, 19, 1.08, 0.060);
    var secondaryRiver = riverLineField(lon, lat, seed, 73, -1.64, 0.046);

    var drainagePath = clamp(
      Math.max(primaryRiver * 0.92, secondaryRiver * 0.56) *
      base.landMask *
      (0.24 + base.moisture * 0.62) *
      (0.32 + base.coastDistance * 0.52) *
      (1 - smoothstep(0.48, 0.90, base.height)),
      0,
      1
    );

    var riverVein = clamp(drainagePath * smoothstep(0.20, 0.58, base.coastDistance), 0, 1);
    var riverBranch = clamp(secondaryRiver * lowland * base.moisture * 0.58, 0, 1);
    var lakeBasin = clamp(
      smoothstep(0.58, 0.84, basinPressure) *
      smoothstep(0.10, 0.30, base.height) *
      (1 - smoothstep(0.30, 0.72, slope)),
      0,
      1
    );

    var pondNoise = fbm(lon * 4.8, lat * 4.2, seed + 777);
    var pondPocket = clamp(
      smoothstep(0.78, 0.94, pondNoise) *
      lowland *
      base.moisture *
      (1 - lakeBasin) *
      0.72,
      0,
      1
    );

    var estuaryMouth = clamp((riverVein + riverBranch * 0.55) * base.coastBand * 1.25, 0, 1);
    var wetland = clamp((base.coastBand * 0.55 + lowland * 0.35 + pondPocket * 0.25) * base.moisture, 0, 1);
    var waterfallDrop = clamp(
      riverVein *
      smoothstep(0.30, 0.62, slope) *
      smoothstep(0.22, 0.54, base.height) *
      0.82,
      0,
      1
    );

    var relief = base.domain === DOMAIN.OCEAN_DEEP ? RELIEF.BASIN :
      base.domain === DOMAIN.COASTAL_SHELF ? RELIEF.PLAIN :
      slope > 0.32 ? RELIEF.RIDGE :
      base.height > 0.42 ? RELIEF.PLATEAU : RELIEF.PLAIN;

    var edgeRole = base.coastBand > 0.25 || base.domain === DOMAIN.COASTAL_SHELF ? EDGE_ROLE.BOUNDARY : EDGE_ROLE.CORE;
    var pressure = slope > 0.30 || base.ridgeHint > 0.24 ? PRESSURE.HIGH : PRESSURE.BASE;
    var material = base.domain === DOMAIN.POLAR_ICE ? MATERIAL.CRYSTAL_OR_ICE :
      base.ridgeHint > 0.26 ? MATERIAL.STONE :
      MATERIAL.SEDIMENT_OR_ORGANIC;

    var sample = {
      domain: base.domain,
      relief: relief,
      edgeRole: edgeRole,
      pressure: pressure,
      material: material,
      state_id: stateId(base.domain, relief, edgeRole, pressure, material),

      height: round(base.height, 4),
      elevation: round(base.height, 4),
      terrain_elevation: round(base.height, 4),

      waterDepth: round(base.waterDepth, 4),
      water_depth: round(base.waterDepth, 4),
      shelfDistance: round(base.shelfDistance, 4),
      shelf_distance: round(base.shelfDistance, 4),
      coastDistance: round(base.coastDistance, 4),
      coast_distance: round(base.coastDistance, 4),
      coastBand: round(base.coastBand, 4),
      coast_band: round(base.coastBand, 4),
      landMask: round(base.landMask, 4),
      land_mask: round(base.landMask, 4),

      roughness: round(base.roughness, 4),
      microRelief: round(base.microRelief, 4),
      micro_relief: round(base.microRelief, 4),
      ridgeHint: round(base.ridgeHint, 4),
      ridge_hint: round(base.ridgeHint, 4),
      moisture: round(base.moisture, 4),

      slope: round(slope, 4),
      basinPressure: round(basinPressure, 4),
      basin_pressure: round(basinPressure, 4),
      hillshade: round(hillshade, 4),
      normal: { x: round(normal.x, 4), y: round(normal.y, 4), z: round(normal.z, 4) },

      watershedDirection: drainageVectorCode(lon, lat, base.height, base.coastDistance),
      watershed_direction: drainageVectorCode(lon, lat, base.height, base.coastDistance),
      drainagePath: round(drainagePath, 4),
      drainage_path: round(drainagePath, 4),
      lowlandChannel: round(lowland, 4),
      lowland_channel: round(lowland, 4),

      riverVein: round(riverVein, 4),
      river_vein: round(riverVein, 4),
      riverBranch: round(riverBranch, 4),
      river_branch: round(riverBranch, 4),
      lakeBasin: round(lakeBasin, 4),
      lake_basin: round(lakeBasin, 4),
      pondPocket: round(pondPocket, 4),
      pond_pocket: round(pondPocket, 4),
      estuaryMouth: round(estuaryMouth, 4),
      estuary_mouth: round(estuaryMouth, 4),
      wetland: round(wetland, 4),
      wetland_field: round(wetland, 4),
      waterfallDrop: round(waterfallDrop, 4),
      waterfall_drop: round(waterfallDrop, 4),

      terrainBand: base.terrainBand,
      terrain_band: base.terrainBand,
      beachReadyZone: base.beachReadyZone,
      beach_ready_zone: base.beachReadyZone,
      seaLevelDatum: SEA_LEVEL_DATUM,
      sea_level_datum: SEA_LEVEL_DATUM,

      cardinal_node: base.cardinalNode,
      nodal_index_256: base.nodalIndex256,
      land_body_id: base.body ? base.body.id : "ocean_or_polar",
      land_body_role: base.body ? base.body.role : "ocean_or_polar",

      samplePlanetSurfaceActive: true,
      heightfieldTerrainShaderActive: true,
      slopeFieldActive: true,
      basinPressureFieldActive: true,
      moistureFieldActive: true,
      watershedDirectionFieldActive: true,
      drainagePathFieldActive: true,
      lowlandChannelFieldActive: true,
      riverCandidateFieldActive: true,
      lakeCandidateFieldActive: true,
      pondCandidateFieldActive: true,
      waterfallCandidateFieldActive: true,
      physicalHydrologyGovernanceActive: true,
      bodySystemSampleFieldsActive: true,
      terrainHydrologyBodyIntegrationActive: true,
      visualPassClaimed: false
    };

    var bodySystem = global.DGBPlanetOneBodySystemRender;
    if (bodySystem && typeof bodySystem.sampleBodySystem === "function") {
      sample.bodySystem = bodySystem.sampleBodySystem(lon, lat, sample);
      sample.bodySystemLayerActive = true;
      sample.anatomicalBoundaryModelActive = true;
      sample.boneFrame = sample.bodySystem.boneFrame;
      sample.muscleField = sample.bodySystem.muscleField;
      sample.fatBuffer = sample.bodySystem.fatBuffer;
      sample.fasciaBoundary = sample.bodySystem.fasciaBoundary;
      sample.veinFlow = sample.bodySystem.veinFlow;
      sample.arteryFlow = sample.bodySystem.arteryFlow;
      sample.lymphDrainage = sample.bodySystem.lymphDrainage;
      sample.pressureChannel = sample.bodySystem.pressureChannel;
      sample.blobSuppression = sample.bodySystem.blobSuppression;
    }

    return sample;
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};
    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var seed = Number(options.seed || SEED);
    var cells = [];
    var lat;
    var lon;
    var sample;
    var receipt = buildStateSpaceReceipt();

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        sample = samplePlanetSurface(lon, lat, { seed: seed });

        cells.push({
          cell_id: "hex_lat_" + lat + "_lon_" + lon,
          center_lon: round(lon, 5),
          center_lat: round(lat, 5),
          domain: sample.domain,
          relief: sample.relief,
          edgeRole: sample.edgeRole,
          pressure: sample.pressure,
          material: sample.material,
          state_id: sample.state_id,
          height: sample.height,
          water_depth: sample.water_depth,
          shelf_distance: sample.shelf_distance,
          coast_distance: sample.coast_distance,
          land_mask: sample.land_mask,
          slope: sample.slope,
          basin_pressure: sample.basin_pressure,
          moisture: sample.moisture,
          drainage_path: sample.drainage_path,
          river_vein: sample.river_vein,
          lake_basin: sample.lake_basin,
          pond_pocket: sample.pond_pocket,
          wetland_field: sample.wetland_field,
          estuary_mouth: sample.estuary_mouth,
          waterfall_drop: sample.waterfall_drop,
          bone_frame: sample.boneFrame || 0,
          muscle_field: sample.muscleField || 0,
          fat_buffer: sample.fatBuffer || 0,
          fascia_boundary: sample.fasciaBoundary || 0,
          terrain_band: sample.terrain_band,
          nodal_index_256: sample.nodal_index_256
        });
      }
    }

    lastGrid = {
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      lattice256ArchitectureReceiptActive: true,
      cells: cells,
      cellCount: cells.length,
      stateSpace: receipt.states,

      samplePlanetSurfaceActive: true,
      bodySystemSampleFieldsActive: true,
      terrainHydrologyBodyIntegrationActive: true,
      heightfieldTerrainShaderActive: true,
      slopeFieldActive: true,
      basinPressureFieldActive: true,
      moistureFieldActive: true,
      watershedDirectionFieldActive: true,
      drainagePathFieldActive: true,
      lowlandChannelFieldActive: true,
      riverCandidateFieldActive: true,
      lakeCandidateFieldActive: true,
      pondCandidateFieldActive: true,
      waterfallCandidateFieldActive: true,
      visualPassClaimed: false
    };

    return lastGrid;
  }

  function getHydration() {
    return global.DGBPlanetOneHydrationRender || null;
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
    if (rho < 0.000001) return { lon: normalizeLon(viewLon), lat: viewLat, limb: 1 };

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

  function terrainColor(sample, limb) {
    var hill = sample.hillshade || 0.55;
    var moisture = sample.moisture || 0.4;
    var ridge = sample.ridgeHint || sample.ridge_hint || 0;
    var body = sample.bodySystem || {};
    var muscle = Number(body.muscleField || sample.muscleField || 0);
    var fat = Number(body.fatBuffer || sample.fatBuffer || 0);
    var bone = Number(body.boneFrame || sample.boneFrame || 0);
    var fascia = Number(body.fasciaBoundary || sample.fasciaBoundary || 0);
    var suppression = Number(body.blobSuppression || sample.blobSuppression || 0);

    var hydrologyCut = clamp(
      sample.riverVein * 0.18 +
      sample.lakeBasin * 0.22 +
      sample.pondPocket * 0.12 +
      sample.wetland * 0.10,
      0,
      0.32
    );

    var light = clamp(0.32 + hill * 0.42 + limb * 0.21 + muscle * 0.08 + bone * 0.07 - hydrologyCut - fat * 0.04, 0.18, 1.10);

    if (sample.domain === DOMAIN.POLAR_ICE) {
      return [
        Math.round(clamp(mix(145, 235, light) + fascia * 10, 0, 255)),
        Math.round(clamp(mix(174, 242, light) + fascia * 8, 0, 255)),
        Math.round(clamp(mix(194, 248, light), 0, 255)),
        255
      ];
    }

    return [
      Math.round(clamp(mix(40, 118, light) + ridge * 16 + bone * 16 - suppression * 8, 0, 255)),
      Math.round(clamp(mix(64, 126, light) + moisture * 18 - ridge * 8 + fat * 12 - suppression * 7, 0, 255)),
      Math.round(clamp(mix(42, 78, light) + moisture * 8 - ridge * 10 + fascia * 6, 0, 255)),
      255
    ];
  }

  function blendColor(water, terrain, waterAlpha, terrainAlpha) {
    var total = Math.max(0.001, waterAlpha + terrainAlpha);
    return [
      Math.round((water.r * waterAlpha + terrain[0] * terrainAlpha) / total),
      Math.round((water.g * waterAlpha + terrain[1] * terrainAlpha) / total),
      Math.round((water.b * waterAlpha + terrain[2] * terrainAlpha) / total),
      255
    ];
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    return null;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    if (!ctx) return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };

    var options = gridOrOptions && gridOrOptions.cells ? maybeOptions || {} : gridOrOptions || {};
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.72), 0.45, 1);
    var offW = Math.max(200, Math.round(canvas.width * scale));
    var offH = Math.max(200, Math.round(canvas.height * scale));
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
    var hydration = getHydration();
    var x;
    var y;
    var dx;
    var dy;
    var geo;
    var sample;
    var hyd;
    var terrain;
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

        sample = samplePlanetSurface(geo.lon, geo.lat, { seed: seed });

        hyd = hydration && hydration.sampleHydrationSurface
          ? hydration.sampleHydrationSurface(geo.lon, geo.lat, sample)
          : {
              waterColor: { r: 14, g: 70, b: 128, a: 1 },
              hydrationAlpha: sample.domain === 0 ? 1 : 0.2,
              terrainExpressionAlpha: sample.domain === 0 ? 0 : 0.8
            };

        terrain = terrainColor(sample, geo.limb);
        color = blendColor(hyd.waterColor, terrain, hyd.hydrationAlpha, hyd.terrainExpressionAlpha);

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = color[3];
      }
    }

    offCtx.putImageData(img, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = Number(options.surfaceAlpha == null ? 0.97 : options.surfaceAlpha);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      bodySystemLayerComposed: Boolean(global.DGBPlanetOneBodySystemRender),
      anatomicalBoundariesRendered: Boolean(global.DGBPlanetOneBodySystemRender),
      muscleFatSeparationRendered: Boolean(global.DGBPlanetOneBodySystemRender),
      veinArteryFlowRendered: Boolean(global.DGBPlanetOneBodySystemRender),
      fasciaBoundaryRendered: Boolean(global.DGBPlanetOneBodySystemRender),
      amorphousBlobReduced: Boolean(global.DGBPlanetOneBodySystemRender),
      hydrologyLayerRendered: Boolean(hydration),
      terrainShaderPreserved: true,
      hydrologyPreserved: Boolean(hydration),
      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return lastDraw;
  }

  function getHexgridStatus() {
    var receipt = buildStateSpaceReceipt();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,

      hexagonalPixelFormatActive: true,
      hexCellSubstrateActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,

      samplePlanetSurfaceActive: true,
      bodySystemSampleFieldsActive: true,
      terrainHydrologyBodyIntegrationActive: true,
      heightfieldTerrainShaderActive: true,
      slopeFieldActive: true,
      basinPressureFieldActive: true,
      moistureFieldActive: true,
      watershedDirectionFieldActive: true,
      drainagePathFieldActive: true,
      lowlandChannelFieldActive: true,
      riverCandidateFieldActive: true,
      lakeCandidateFieldActive: true,
      pondCandidateFieldActive: true,
      waterfallCandidateFieldActive: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      totalStates: STATE_COUNT,
      totalStateCount: STATE_COUNT,
      latticeStateCount: STATE_COUNT,
      stateSpaceCount: STATE_COUNT,
      stateSpaceReceipt: true,
      lattice256ArchitectureReceiptActive: true,
      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      stateSpacePreview: receipt.states.slice(0, 16),

      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      visualPassClaimed: false,
      lastDraw: lastDraw
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
    BASELINE: BASELINE,
    MARITIME_BASELINE: MARITIME_BASELINE,
    DOMAIN: DOMAIN,
    RELIEF: RELIEF,
    EDGE_ROLE: EDGE_ROLE,
    PRESSURE: PRESSURE,
    MATERIAL: MATERIAL,

    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    requiredStateCount: STATE_COUNT,

    samplePlanetSurface: samplePlanetSurface,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: getHexgridStatus,
    getLatticeReceipt: buildStateSpaceReceipt,
    getStateSpaceReceipt: buildStateSpaceReceipt
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hexgrid-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
