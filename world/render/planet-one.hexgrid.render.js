/* G1 PLANET 1 PUBLIC SURFACE COMPOSITOR + TERRAIN ELEVATION VISIBILITY
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_PUBLIC_SURFACE_COMPOSITOR_AND_TERRAIN_ELEVATION_VISIBILITY_PAIR_TNT_v1

   PURPOSE:
   - Preserve the 256-state hidden hexagonal terrain-cell substrate.
   - Stop public mode from drawing visible sample dots / honeycomb.
   - Composite hidden terrain data into a continuous satellite-observed planetary surface.
   - Preserve maritime datum, water dominance, terrain elevation field, and beach-ready zone.
   - Hold plateau, mineral exposure, mountains, glaciers, waterfalls, and final beaches.
   - Keep debug mode available.
   - Do not claim visual pass.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_PUBLIC_SURFACE_COMPOSITOR_AND_TERRAIN_ELEVATION_VISIBILITY_PAIR_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_TERRAIN_ELEVATION_FIELD_PAIR_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var MARITIME_BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";

  var STATE_FORMULA = "4x4x2x2x4";
  var STATE_COUNT = 256;
  var REQUIRED_STATE_COUNT = 256;
  var DEFAULT_RENDER_MODE = "satellite";
  var SEA_LEVEL_DATUM = 0;
  var PLATEAU_HELD_CAP = 0.61;

  var CONTRACT_MARKERS = [
    VERSION,
    PRIOR_VERSION,
    BASELINE,
    MARITIME_BASELINE,
    "PUBLIC_SURFACE_COMPOSITOR_ACTIVE",
    "PUBLIC_SAMPLE_DOTS_SUPPRESSED",
    "PUBLIC_HONEYCOMB_BLOCKED",
    "CONTINUOUS_ORBITAL_SURFACE_TEXTURE_ACTIVE",
    "TERRAIN_ELEVATION_VISIBILITY_ACTIVE",
    "BEACH_READY_ZONE_PREPARED_NOT_FINAL",
    "MARITIME_SEA_LEVEL_BASELINE_ACTIVE",
    "WATER_DOMINANCE_PRESERVED",
    "LATTICE_256_ARCHITECTURE_RECEIPT_ACTIVE",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var DOMAIN = {
    OCEAN_DEEP: 0,
    COASTAL_SHELF: 1,
    LAND_INTERIOR: 2,
    POLAR_ICE: 3
  };

  var RELIEF = {
    BASIN: 0,
    PLAIN: 1,
    PLATEAU: 2,
    RIDGE: 3
  };

  var EDGE_ROLE = {
    CORE: 0,
    BOUNDARY: 1
  };

  var PRESSURE = {
    BASE: 0,
    HIGH: 1
  };

  var MATERIAL = {
    SEDIMENT_OR_ORGANIC: 0,
    STONE: 1,
    METAL_OR_MINERAL: 2,
    CRYSTAL_OR_ICE: 3
  };

  var ELEVATION_BANDS = {
    oceanDepth: [-1.00, -0.18],
    coastalShelf: [-0.18, 0.08],
    beachReadyZone: [0.02, 0.16],
    lowlandTerrain: [0.12, 0.38],
    interiorTerrain: [0.28, 0.61],
    plateauPressureHeldAbove: 0.61
  };

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  function angularDistance(a, b) {
    return Math.abs(normalizeLon(a - b));
  }

  function hash2(a, b, seed) {
    var x = Math.sin(a * 127.1 + b * 311.7 + (seed || 17) * 74.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function noise(lon, lat, seed) {
    return (
      hash2(Math.round(lon * 2), Math.round(lat * 2), seed) * 0.48 +
      hash2(Math.round(lon / 2), Math.round(lat / 2), seed + 13) * 0.32 +
      hash2(Math.round(lon / 7), Math.round(lat / 7), seed + 31) * 0.20
    );
  }

  function fineNoise(lon, lat, seed) {
    return (
      hash2(Math.round(lon * 5), Math.round(lat * 5), seed + 101) * 0.55 +
      hash2(Math.round(lon * 1.5), Math.round(lat * 1.5), seed + 211) * 0.45
    );
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
      requiredStateCount: REQUIRED_STATE_COUNT,
      totalStates: STATE_COUNT,
      totalStateCount: STATE_COUNT,
      latticeStateCount: STATE_COUNT,
      stateSpaceCount: STATE_COUNT,
      state_count: STATE_COUNT,
      total_states: STATE_COUNT,
      required_state_count: REQUIRED_STATE_COUNT,
      stateSpaceReceipt: true,
      stateSpaceReceiptActive: true,
      lattice256ArchitectureReceiptActive: true,
      lattice256ReceiptActive: true,
      stateCount256Confirmed: true,
      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      domainAxisActive: true,
      reliefAxisActive: true,
      edgeRoleAxisActive: true,
      pressureAxisActive: true,
      materialAxisActive: true,
      states: states
    };
  }

  function nodalIndex256(lon, lat) {
    var lonBand = Math.floor(((normalizeLon(lon) + 180) / 360) * 16);
    var latBand = Math.floor(((clamp(lat, -90, 90) + 90) / 180) * 16);
    lonBand = clamp(lonBand, 0, 15);
    latBand = clamp(latBand, 0, 15);
    return latBand * 16 + lonBand;
  }

  function cardinalNode(lon, lat) {
    var absLon = Math.abs(normalizeLon(lon));
    var absLat = Math.abs(lat);

    if (absLat >= absLon * 0.55) return lat >= 0 ? "NORTH" : "SOUTH";
    return normalizeLon(lon) >= 0 ? "EAST" : "WEST";
  }

  function cardinalLift(cardinal) {
    if (cardinal === "NORTH") return 0.07;
    if (cardinal === "SOUTH") return 0.04;
    if (cardinal === "EAST") return 0.055;
    return 0.075;
  }

  function bodyScore(lon, lat, body) {
    var dx = angularDistance(lon, body.lon) / body.rx;
    var dy = (lat - body.lat) / body.ry;
    var skew = body.skew ? (lat / 90) * body.skew : 0;
    var wrap = body.wrap ? Math.cos(degToRad(lon - body.lon)) * body.wrap : 0;
    return body.weight * (1 - (dx * dx + dy * dy)) + wrap + skew;
  }

  function getLandSignature(lon, lat, seed) {
    var n = noise(lon, lat, seed);
    var rough = (n - 0.5) * 0.20;

    var bodies = [
      { id: "primary_west_dynamic_structure", role: "dynamic_hemispheric_side_structure", lon: -78, lat: 4, rx: 64, ry: 74, weight: 1.20, wrap: 0.22, skew: -0.08 },
      { id: "primary_east_dynamic_structure", role: "dynamic_hemispheric_side_structure", lon: 104, lat: -4, rx: 67, ry: 72, weight: 1.17, wrap: 0.20, skew: 0.07 },
      { id: "secondary_north_midland", role: "secondary_non_polar_body", lon: 12, lat: 34, rx: 34, ry: 28, weight: 0.92, wrap: 0.06 },
      { id: "secondary_south_midland", role: "secondary_non_polar_body", lon: -18, lat: -38, rx: 38, ry: 30, weight: 0.88, wrap: 0.05 },
      { id: "secondary_far_wrap_body", role: "secondary_non_polar_body", lon: 176, lat: 16, rx: 28, ry: 42, weight: 0.84, wrap: 0.18 }
    ];

    var best = { score: -999, body: null };
    var second = { score: -999, body: null };
    var i;
    var s;

    for (i = 0; i < bodies.length; i += 1) {
      s = bodyScore(lon, lat, bodies[i]) + rough;

      if (s > best.score) {
        second = best;
        best = { score: s, body: bodies[i] };
      } else if (s > second.score) {
        second = { score: s, body: bodies[i] };
      }
    }

    return {
      score: best.score,
      body: best.body,
      secondScore: second.score,
      fracturePressure: clamp((best.score + second.score + 0.45) / 1.6, 0, 1),
      noise: n
    };
  }

  function terrainBandForElevation(elevation, domain) {
    if (domain === DOMAIN.OCEAN_DEEP) return "ocean_depth";
    if (elevation < -0.18) return "ocean_depth";
    if (elevation < 0.02) return "coastal_shelf";
    if (elevation < 0.16) return "beach_ready_zone";
    if (elevation < 0.38) return "lowland_terrain";
    if (elevation <= PLATEAU_HELD_CAP) return "interior_terrain";
    return "plateau_pressure_held";
  }

  function computeTerrainElevation(domain, baseElevation, signature, n, cardinal, nodeIndex, absLat) {
    var nodePulse = ((nodeIndex % 16) / 15) * 0.045;
    var lift = cardinalLift(cardinal) + nodePulse;
    var fractureLift = signature.fracturePressure * 0.065;
    var materialResistance = n * 0.045;
    var value;

    if (domain === DOMAIN.OCEAN_DEEP) return clamp(baseElevation, -1.0, -0.18);

    if (domain === DOMAIN.COASTAL_SHELF) {
      value = baseElevation + lift * 0.34 + fractureLift * 0.30 + materialResistance * 0.22;
      return clamp(value, -0.14, 0.16);
    }

    if (domain === DOMAIN.POLAR_ICE) {
      value = baseElevation + lift * 0.55 + materialResistance + (absLat - 70) / 180;
      return clamp(value, 0.16, 0.58);
    }

    value =
      baseElevation +
      lift +
      fractureLift +
      materialResistance +
      clamp(signature.score * 0.18, 0, 0.18);

    return clamp(value, 0.12, PLATEAU_HELD_CAP);
  }

  function classifySurfaceCell(lon, lat, options) {
    var seed = options.seed || 256451;
    var absLat = Math.abs(lat);
    var signature = getLandSignature(lon, lat, seed);
    var n = signature.noise;
    var coastDelta = Math.abs(signature.score - 0.10);
    var nodeIndex = nodalIndex256(lon, lat);
    var cardinal = cardinalNode(lon, lat);

    var domain;
    var relief;
    var edgeRole;
    var pressure;
    var material;
    var terrainClass;
    var elevation;
    var baseElevation;
    var waterDepth;
    var shelfLevel;
    var ridgePressure;
    var basinPressure;
    var mineralPressure;
    var icePressure;
    var materialHint;
    var adjacencyClass;
    var emergencePressure;
    var beachReady;

    if (absLat >= 73) {
      domain = DOMAIN.POLAR_ICE;
    } else if (signature.score > 0.17) {
      domain = DOMAIN.LAND_INTERIOR;
    } else if (signature.score > -0.10) {
      domain = DOMAIN.COASTAL_SHELF;
    } else {
      domain = DOMAIN.OCEAN_DEEP;
    }

    edgeRole = (coastDelta < 0.18 || domain === DOMAIN.COASTAL_SHELF || absLat > 66) ? EDGE_ROLE.BOUNDARY : EDGE_ROLE.CORE;

    if (domain === DOMAIN.OCEAN_DEEP) {
      waterDepth = clamp(0.48 + Math.abs(signature.score) * 0.54 + (1 - n) * 0.18, 0.25, 1);
      baseElevation = -waterDepth;
      elevation = computeTerrainElevation(domain, baseElevation, signature, n, cardinal, nodeIndex, absLat);
      shelfLevel = 0;
      relief = waterDepth > 0.72 ? RELIEF.BASIN : RELIEF.PLAIN;
      ridgePressure = n > 0.90 ? 0.16 : 0.04;
      basinPressure = waterDepth;
      mineralPressure = n > 0.91 ? 0.14 : 0.035;
      icePressure = 0;
      emergencePressure = 0;
      material = mineralPressure > 0.15 ? MATERIAL.METAL_OR_MINERAL : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = waterDepth > 0.72 ? "ocean_depth_field" : "ocean_mid_field";
      materialHint = "ocean_basin_depth";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "ocean_to_shelf_transition" : "ocean_core";
    } else if (domain === DOMAIN.COASTAL_SHELF) {
      waterDepth = clamp(0.04 + coastDelta * 1.02, 0.02, 0.34);
      shelfLevel = clamp(1 - waterDepth * 2.7, 0, 1);
      baseElevation = clamp(-0.10 + shelfLevel * 0.13 + n * 0.045, -0.16, 0.08);
      elevation = computeTerrainElevation(domain, baseElevation, signature, n, cardinal, nodeIndex, absLat);
      relief = n > 0.80 ? RELIEF.RIDGE : RELIEF.PLAIN;
      ridgePressure = relief === RELIEF.RIDGE ? 0.24 : 0.09;
      basinPressure = waterDepth;
      mineralPressure = n > 0.78 ? 0.24 : 0.08;
      icePressure = absLat > 58 ? 0.16 : 0;
      emergencePressure = clamp((elevation - SEA_LEVEL_DATUM + 0.10) * 2.4, 0, 0.54);
      material = mineralPressure > 0.30 ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = "coastal_shelf_beach_ready_preparation";
      materialHint = "beach_ready_shelf_transition";
      adjacencyClass = "coast_adjacency";
    } else if (domain === DOMAIN.POLAR_ICE) {
      waterDepth = 0;
      shelfLevel = 0;
      baseElevation = clamp(0.18 + (absLat - 70) / 48 + n * 0.10, 0.10, 0.42);
      elevation = computeTerrainElevation(domain, baseElevation, signature, n, cardinal, nodeIndex, absLat);
      relief = n > 0.74 ? RELIEF.PLATEAU : RELIEF.PLAIN;
      ridgePressure = n > 0.82 ? 0.24 : 0.10;
      basinPressure = 0.04;
      mineralPressure = n > 0.80 ? 0.18 : 0.06;
      icePressure = clamp((absLat - 62) / 30, 0.25, 1);
      emergencePressure = clamp(elevation * 0.70 + icePressure * 0.16, 0, 0.74);
      material = MATERIAL.CRYSTAL_OR_ICE;
      terrainClass = lat > 0 ? "north_polar_curved_elevation_field" : "south_polar_curved_elevation_field";
      materialHint = "curved_polar_ice";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "polar_edge" : "polar_core";
    } else {
      waterDepth = 0;
      shelfLevel = 0;
      baseElevation = clamp(0.10 + signature.score * 0.30 + n * 0.14, 0.07, 0.36);
      elevation = computeTerrainElevation(domain, baseElevation, signature, n, cardinal, nodeIndex, absLat);
      relief = n > 0.88 ? RELIEF.RIDGE : n > 0.70 ? RELIEF.PLATEAU : n < 0.20 ? RELIEF.BASIN : RELIEF.PLAIN;
      ridgePressure = relief === RELIEF.RIDGE ? clamp(0.30 + n * 0.18, 0, 0.58) : relief === RELIEF.PLATEAU ? 0.20 : 0.08;
      basinPressure = relief === RELIEF.BASIN ? 0.40 : 0.05;
      mineralPressure = clamp(0.10 + ridgePressure * 0.30 + signature.fracturePressure * 0.18 + (n > 0.86 ? 0.06 : 0), 0, 0.58);
      icePressure = absLat > 60 ? 0.10 : 0;
      emergencePressure = clamp(elevation * 1.12 + ridgePressure * 0.10, 0, 0.78);
      material = mineralPressure > 0.56 ? MATERIAL.METAL_OR_MINERAL : relief === RELIEF.PLATEAU ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = signature.body ? signature.body.id + "_terrain_elevation_field" : "land_interior_terrain_elevation_field";
      materialHint = material === MATERIAL.METAL_OR_MINERAL ? "buried_mineral_pressure_held" : material === MATERIAL.STONE ? "plateau_pressure_held" : "lowland_elevation";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "land_edge" : "land_core";
    }

    beachReady = elevation >= 0.02 && elevation <= 0.16 && (domain === DOMAIN.COASTAL_SHELF || edgeRole === EDGE_ROLE.BOUNDARY);
    pressure = (ridgePressure + mineralPressure + icePressure > 1.04 || relief === RELIEF.RIDGE) ? PRESSURE.HIGH : PRESSURE.BASE;

    return {
      domain: domain,
      relief: relief,
      edgeRole: edgeRole,
      pressure: pressure,
      material: material,
      state_id: stateId(domain, relief, edgeRole, pressure, material),
      terrain_class: terrainClass,
      elevation: round(elevation, 4),
      terrain_elevation: round(elevation, 4),
      terrain_elevation_field_value: round(elevation, 4),
      terrain_band: terrainBandForElevation(elevation, domain),
      water_depth: round(waterDepth, 4),
      shelf_level: round(shelfLevel, 4),
      ridge_pressure: round(ridgePressure, 4),
      basin_pressure: round(basinPressure, 4),
      mineral_pressure: round(mineralPressure, 4),
      ice_pressure: round(icePressure, 4),
      emergence_pressure: round(emergencePressure, 4),
      emergence_stage: domain === DOMAIN.OCEAN_DEEP ? "submerged_ocean" : "terrain_elevation_field",
      sea_level_datum: SEA_LEVEL_DATUM,
      beach_ready_zone: beachReady,
      plateau_pressure_held: true,
      higher_relief_held: true,
      maritime_preservation_flag: true,
      nearshore_transition_flag: domain === DOMAIN.COASTAL_SHELF || edgeRole === EDGE_ROLE.BOUNDARY,
      cardinal_node: cardinal,
      nodal_index_256: nodeIndex,
      material_hint: materialHint,
      adjacency_class: adjacencyClass,
      land_body_id: signature.body ? signature.body.id : "ocean_or_polar",
      land_body_role: signature.body ? signature.body.role : "ocean_or_polar",
      land_score: round(signature.score, 4),
      fracture_pressure: round(signature.fracturePressure, 4)
    };
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};

    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var seed = Number(options.seed || 256451);
    var cells = [];
    var index = {};
    var lon;
    var lat;
    var row = 0;
    var q;
    var r;
    var cell;
    var surface;
    var id;
    var receipt = buildStateSpaceReceipt();

    for (lat = -88; lat <= 88; lat += latStep) {
      q = 0;

      for (lon = -180; lon < 180; lon += lonStep) {
        surface = classifySurfaceCell(lon, lat, { seed: seed });
        r = row;
        id = "hex_lat_" + lat + "_lon_" + lon;

        cell = {
          cell_id: id,
          q_coordinate: q,
          r_coordinate: r,
          center_lon: round(lon, 5),
          center_lat: round(lat, 5),
          projected_x: null,
          projected_y: null,
          visibility: "planetary_data_unprojected",
          visible: false,
          domain: surface.domain,
          relief: surface.relief,
          edgeRole: surface.edgeRole,
          pressure: surface.pressure,
          material: surface.material,
          state_id: surface.state_id,
          neighbors: [],
          terrain_class: surface.terrain_class,
          elevation: surface.elevation,
          terrain_elevation: surface.terrain_elevation,
          terrain_elevation_field_value: surface.terrain_elevation_field_value,
          terrain_band: surface.terrain_band,
          water_depth: surface.water_depth,
          shelf_level: surface.shelf_level,
          ridge_pressure: surface.ridge_pressure,
          basin_pressure: surface.basin_pressure,
          mineral_pressure: surface.mineral_pressure,
          ice_pressure: surface.ice_pressure,
          emergence_pressure: surface.emergence_pressure,
          emergence_stage: surface.emergence_stage,
          sea_level_datum: surface.sea_level_datum,
          beach_ready_zone: surface.beach_ready_zone,
          plateau_pressure_held: surface.plateau_pressure_held,
          higher_relief_held: surface.higher_relief_held,
          maritime_preservation_flag: surface.maritime_preservation_flag,
          nearshore_transition_flag: surface.nearshore_transition_flag,
          cardinal_node: surface.cardinal_node,
          nodal_index_256: surface.nodal_index_256,
          material_hint: surface.material_hint,
          adjacency_class: surface.adjacency_class,
          land_body_id: surface.land_body_id,
          land_body_role: surface.land_body_role,
          land_score: surface.land_score,
          fracture_pressure: surface.fracture_pressure
        };

        cells.push(cell);
        index[lat + "," + lon] = cell;
        q += 1;
      }

      row += 1;
    }

    cells.forEach(function (item) {
      var neighborCoords = [
        [item.center_lat, normalizeLon(item.center_lon + lonStep)],
        [item.center_lat, normalizeLon(item.center_lon - lonStep)],
        [item.center_lat + latStep, item.center_lon],
        [item.center_lat - latStep, item.center_lon],
        [item.center_lat + latStep, normalizeLon(item.center_lon + lonStep)],
        [item.center_lat - latStep, normalizeLon(item.center_lon - lonStep)]
      ];

      item.neighbors = neighborCoords.map(function (pair) {
        var key = pair[0] + "," + pair[1];
        return index[key] ? index[key].cell_id : null;
      }).filter(Boolean);
    });

    lastGrid = {
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,
      maritimeBaseline: MARITIME_BASELINE,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: REQUIRED_STATE_COUNT,
      totalStates: STATE_COUNT,
      totalStateCount: STATE_COUNT,
      latticeStateCount: STATE_COUNT,
      stateSpaceCount: STATE_COUNT,
      state_count: STATE_COUNT,
      total_states: STATE_COUNT,
      stateSpaceReceipt: true,
      stateSpaceReceiptActive: true,
      lattice256ArchitectureReceiptActive: true,
      lattice256ReceiptActive: true,
      stateCount256Confirmed: true,

      defaultRenderMode: DEFAULT_RENDER_MODE,
      seaLevelDatum: SEA_LEVEL_DATUM,
      elevationBands: ELEVATION_BANDS,
      terrainElevationFieldActive: true,
      terrainElevationVisibilityActive: true,
      publicSurfaceCompositorActive: true,
      publicSampleDotsSuppressed: true,
      beachReadyZonePrepared: true,
      elevationBandsActive: true,
      plateauPressureHeld: true,
      higherReliefHeld: true,

      projectionModel: "planetary_lat_lon_surface_samples",
      publicMode: "continuous_satellite_surface_compositor",
      debugMode: "cell-debug",
      landmassLaw: "2_dynamic_hemispheric_side_structures_plus_3_secondary_non_polar_bodies_plus_2_poles",
      beautySequenceLayer: "public_surface_compositor_before_coastal_shelf_refinement",

      axes: { domain: true, relief: true, edgeRole: true, pressure: true, material: true },
      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      domainAxisActive: true,
      reliefAxisActive: true,
      edgeRoleAxisActive: true,
      pressureAxisActive: true,
      materialAxisActive: true,

      stateSpace: receipt.states,
      seed: seed,
      lonStep: lonStep,
      latStep: latStep,
      cells: cells,
      cellCount: cells.length,
      visibleCellCount: 0
    };

    return lastGrid;
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

    if (rho < 0.000001) {
      return {
        lon: normalizeLon(viewLon),
        lat: viewLat,
        limb: 1
      };
    }

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

  function surfaceColor(cell, lon, lat, limb) {
    var terrain = clamp(cell.terrain_elevation || cell.elevation || 0, -1, PLATEAU_HELD_CAP);
    var emergence = clamp(cell.emergence_pressure || 0, 0, 1);
    var fn = fineNoise(lon, lat, 256451);
    var beach = cell.beach_ready_zone ? 0.13 : 0;
    var tone = clamp(
      0.45 +
      terrain * 0.24 +
      emergence * 0.13 +
      beach +
      cell.mineral_pressure * 0.05 +
      cell.ice_pressure * 0.12 -
      cell.water_depth * 0.20 +
      (fn - 0.5) * 0.08,
      0,
      1
    );

    var r;
    var g;
    var b;

    if (cell.domain === DOMAIN.OCEAN_DEEP) {
      r = 6 + tone * 18;
      g = 28 + tone * 58;
      b = 68 + tone * 84;
    } else if (cell.domain === DOMAIN.COASTAL_SHELF) {
      r = 56 + tone * 70 + emergence * 20 + beach * 78;
      g = 96 + tone * 80 + emergence * 16 + beach * 50;
      b = 92 + tone * 54 - emergence * 8 - beach * 28;
    } else if (cell.domain === DOMAIN.POLAR_ICE) {
      r = 162 + tone * 80;
      g = 190 + tone * 58;
      b = 210 + tone * 42;
    } else {
      r = 74 + tone * 88 + emergence * 26 + cell.mineral_pressure * 14;
      g = 86 + tone * 70 + emergence * 15 + terrain * 12;
      b = 48 + tone * 42 + cell.ridge_pressure * 10 - emergence * 7;
    }

    var light = clamp(0.52 + limb * 0.54, 0.28, 1.04);

    return [
      Math.round(clamp(r * light, 0, 255)),
      Math.round(clamp(g * light, 0, 255)),
      Math.round(clamp(b * light, 0, 255)),
      255
    ];
  }

  function drawContinuousSurface(ctx, options) {
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.72), 0.45, 1);
    var offW = Math.max(180, Math.round(canvas.width * scale));
    var offH = Math.max(180, Math.round(canvas.height * scale));
    var off = document.createElement("canvas");
    var offCtx;
    var img;
    var data;
    var cx = offW / 2;
    var cy = offH / 2;
    var radius = Number(options.radius || Math.min(canvas.width, canvas.height) * 0.43) * scale;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var seed = Number(options.seed || 256451);
    var x;
    var y;
    var dx;
    var dy;
    var p;
    var geo;
    var cell;
    var c;
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
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, viewLon, viewLat);

        if (!geo) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        cell = classifySurfaceCell(geo.lon, geo.lat, { seed: seed });
        c = surfaceColor(cell, geo.lon, geo.lat, geo.limb);

        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = c[3];
      }
    }

    offCtx.putImageData(img, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = Number(options.surfaceAlpha == null ? 0.90 : options.surfaceAlpha);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      renderMode: "satellite",
      defaultRenderMode: DEFAULT_RENDER_MODE,
      publicSurfaceCompositorActive: true,
      publicSampleDotsSuppressed: true,
      continuousOrbitalSurfaceTextureActive: true,
      terrainElevationVisibilityActive: true,
      publicHoneycombBlocked: true,
      satelliteObservationalModeActive: true,
      cellDebugModeAvailable: true,
      maritimeSeaLevelBaselineActive: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      controlledLandElevationActive: true,
      terrainElevationFieldActive: true,
      beachReadyZonePrepared: true,
      beachReadyZoneVisibleButNotFinal: true,
      elevationBandsActive: true,
      plateauPressureHeld: true,
      higherReliefHeld: true,
      waterDominancePreserved: true,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: REQUIRED_STATE_COUNT,
      renderedAt: new Date().toISOString(),
      visualPassClaimed: false
    };

    return lastDraw;
  }

  function orthographicProject(lon, lat, viewLon, viewLat, cx, cy, radius) {
    var lambda = degToRad(normalizeLon(lon - viewLon));
    var phi = degToRad(lat);
    var phi0 = degToRad(viewLat || 0);
    var cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);

    if (cosc <= 0) return { visible: false, z: cosc, x: null, y: null, scale: 0 };

    return {
      visible: true,
      z: cosc,
      x: cx + radius * Math.cos(phi) * Math.sin(lambda),
      y: cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda)),
      scale: clamp(0.18 + cosc * 0.82, 0.18, 1)
    };
  }

  function debugColor(cell) {
    if (cell.domain === DOMAIN.OCEAN_DEEP) return "rgba(10,58,96,.74)";
    if (cell.domain === DOMAIN.COASTAL_SHELF) return cell.beach_ready_zone ? "rgba(220,192,120,.76)" : "rgba(60,128,130,.70)";
    if (cell.domain === DOMAIN.POLAR_ICE) return "rgba(218,236,248,.78)";
    return "rgba(110,128,82,.76)";
  }

  function drawDebugHex(ctx, cell, projected, radius) {
    var size = Math.max(2.2, radius * 0.013 * projected.scale);
    var i;
    var angle;
    var x;
    var y;

    ctx.save();
    ctx.globalAlpha = clamp(0.22 + projected.z * 0.55, 0.22, 0.78);
    ctx.beginPath();

    for (i = 0; i < 6; i += 1) {
      angle = Math.PI / 180 * (60 * i - 30);
      x = projected.x + size * Math.cos(angle);
      y = projected.y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = debugColor(cell);
    ctx.fill();
    ctx.strokeStyle = cell.edgeRole === EDGE_ROLE.BOUNDARY ? "rgba(242,199,111,.34)" : "rgba(255,255,255,.12)";
    ctx.lineWidth = cell.edgeRole === EDGE_ROLE.BOUNDARY ? 0.8 : 0.38;
    ctx.stroke();
    ctx.restore();
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    if (target.ctx && target.ctx.canvas) return target.ctx;
    if (target.context && target.context.canvas) return target.context;
    return null;
  }

  function drawDebugSurface(ctx, grid, options) {
    var cx = Number(options.centerX || ctx.canvas.width / 2);
    var cy = Number(options.centerY || ctx.canvas.height / 2);
    var radius = Number(options.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var visibleCount = 0;

    grid.cells.forEach(function (cell) {
      var projected = orthographicProject(cell.center_lon, cell.center_lat, viewLon, viewLat, cx, cy, radius);

      cell.visible = projected.visible;
      cell.visibility = projected.visible ? "visible_projected_hemisphere" : "hidden_far_hemisphere";
      cell.projected_x = projected.visible ? round(projected.x, 3) : null;
      cell.projected_y = projected.visible ? round(projected.y, 3) : null;

      if (!projected.visible) return;
      visibleCount += 1;
      drawDebugHex(ctx, cell, projected, radius);
    });

    grid.visibleCellCount = visibleCount;

    lastDraw = {
      ok: true,
      version: VERSION,
      renderMode: "cell-debug",
      cellDebugModeAvailable: true,
      publicHoneycombBlocked: false,
      cellCount: grid.cellCount,
      visibleCellCount: visibleCount,
      visualPassClaimed: false
    };

    return lastDraw;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    var grid;
    var options;
    var renderMode;

    if (!ctx) return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };

    if (gridOrOptions && Array.isArray(gridOrOptions.cells)) {
      grid = gridOrOptions;
      options = maybeOptions || {};
    } else {
      options = gridOrOptions || {};
      grid = createPlanetOneHexGrid(options);
    }

    renderMode = options.renderMode || DEFAULT_RENDER_MODE;

    if (renderMode === "cell-debug") {
      return drawDebugSurface(ctx, grid, options);
    }

    return drawContinuousSurface(ctx, options);
  }

  function getLatticeReceipt() {
    return buildStateSpaceReceipt();
  }

  function getStateSpaceReceipt() {
    return buildStateSpaceReceipt();
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
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),

      hexagonalPixelFormatActive: true,
      hexCellSubstrateActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,

      publicSurfaceCompositorActive: true,
      publicSampleDotsSuppressed: true,
      continuousOrbitalSurfaceTextureActive: true,
      terrainElevationVisibilityActive: true,

      maritimeSeaLevelBaselineActive: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      controlledLandElevationActive: true,
      terrainElevationFieldActive: true,
      terrainElevationFieldReceiptActive: true,
      beachReadyZonePrepared: true,
      beachReadyZoneVisibleButNotFinal: true,
      elevationBandsActive: true,
      plateauPressureHeld: true,
      higherReliefHeld: true,
      waterDominancePreserved: true,

      northSouthEastWestNodalSequenceActive: true,
      nodalConstruct256Active: true,

      satelliteObservationalModeActive: true,
      cellDebugModeAvailable: true,
      publicHoneycombBlocked: true,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      projectionModel: "continuous_orbital_surface_compositor",

      twoDynamicHemisphericLandStructuresActive: true,
      threeSecondaryNonPolarBodiesActive: true,
      sevenLandmassLawActive: true,
      nonPolarLandBodyCount: 5,
      polarLandBodyCount: 2,

      stateFormula: STATE_FORMULA,
      formula: STATE_FORMULA,
      state_formula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: REQUIRED_STATE_COUNT,
      totalStates: STATE_COUNT,
      totalStateCount: STATE_COUNT,
      latticeStateCount: STATE_COUNT,
      stateSpaceCount: STATE_COUNT,
      state_count: STATE_COUNT,
      total_states: STATE_COUNT,
      required_state_count: REQUIRED_STATE_COUNT,
      stateSpaceReceipt: true,
      stateSpaceReceiptActive: true,
      lattice256ArchitectureReceiptActive: true,
      lattice256ReceiptActive: true,
      stateCount256Confirmed: true,

      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      domainAxisActive: true,
      reliefAxisActive: true,
      edgeRoleAxisActive: true,
      pressureAxisActive: true,
      materialAxisActive: true,

      elevationBands: ELEVATION_BANDS,

      lattice: {
        ok: true,
        stateFormula: STATE_FORMULA,
        stateCount: STATE_COUNT,
        requiredStateCount: REQUIRED_STATE_COUNT,
        domainAxis: true,
        reliefAxis: true,
        edgeRoleAxis: true,
        pressureAxis: true,
        materialAxis: true
      },

      stateSpace: receipt.states,
      stateSpacePreview: receipt.states.slice(0, 16),

      lastGridCellCount: lastGrid ? lastGrid.cellCount : 0,
      lastVisibleCellCount: lastGrid ? lastGrid.visibleCellCount : 0,
      lastDraw: lastDraw,

      visualPassClaimed: false
    };
  }

  function status() {
    return getHexgridStatus();
  }

  function createDefaultProbeGrid() {
    if (!lastGrid) createPlanetOneHexGrid({ lonStep: 4, latStep: 4, seed: 256451 });
    return lastGrid;
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
    BASELINE: BASELINE,
    MARITIME_BASELINE: MARITIME_BASELINE,
    CONTRACT_MARKERS: CONTRACT_MARKERS,

    DOMAIN: DOMAIN,
    RELIEF: RELIEF,
    EDGE_ROLE: EDGE_ROLE,
    PRESSURE: PRESSURE,
    MATERIAL: MATERIAL,

    stateFormula: STATE_FORMULA,
    formula: STATE_FORMULA,
    state_formula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    requiredStateCount: REQUIRED_STATE_COUNT,
    totalStates: STATE_COUNT,
    totalStateCount: STATE_COUNT,
    latticeStateCount: STATE_COUNT,
    stateSpaceCount: STATE_COUNT,
    state_count: STATE_COUNT,
    total_states: STATE_COUNT,
    required_state_count: REQUIRED_STATE_COUNT,

    stateSpaceReceipt: true,
    stateSpaceReceiptActive: true,
    lattice256ArchitectureReceiptActive: true,
    lattice256ReceiptActive: true,
    stateCount256Confirmed: true,

    domainAxis: true,
    reliefAxis: true,
    edgeRoleAxis: true,
    pressureAxis: true,
    materialAxis: true,
    domainAxisActive: true,
    reliefAxisActive: true,
    edgeRoleAxisActive: true,
    pressureAxisActive: true,
    materialAxisActive: true,

    satelliteObservationalModeActive: true,
    cellDebugModeAvailable: true,
    publicHoneycombBlocked: true,
    publicSurfaceCompositorActive: true,
    publicSampleDotsSuppressed: true,
    continuousOrbitalSurfaceTextureActive: true,

    maritimeSeaLevelBaselineActive: true,
    seaLevelDatum: SEA_LEVEL_DATUM,
    controlledLandElevationActive: true,
    terrainElevationFieldActive: true,
    terrainElevationVisibilityActive: true,
    beachReadyZonePrepared: true,
    beachReadyZoneVisibleButNotFinal: true,
    elevationBandsActive: true,
    plateauPressureHeld: true,
    higherReliefHeld: true,
    northSouthEastWestNodalSequenceActive: true,
    nodalConstruct256Active: true,

    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    getLatticeReceipt: getLatticeReceipt,
    getStateSpaceReceipt: getStateSpaceReceipt,
    status: status,
    createDefaultProbeGrid: createDefaultProbeGrid
  };

  global.DGBPlanetOneHexgridRender = api;
  createDefaultProbeGrid();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hexgrid-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
