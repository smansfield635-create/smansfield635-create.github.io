// /assets/audralia/clean/terrain/audralia.elevation-track.child.js
// AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_OPTIMAL_EXPRESSION_TNT_v1
// Full-file replacement.
// Scope: Audralia downstream elevation-track truth only.
// Purpose: optimize the existing elevation-track child into coherent elevation systems.
// Owns: elevation bands, ridge systems, basin systems, valley corridors, watersheds, drainage gates, future-fill readiness, carrier-safe elevation packets.
// Does not own: runtime carrier, HTML load order, active hydration, visual drawing, beaches, cliffs, climate, ecology, technology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_OPTIMAL_EXPRESSION_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.elevation-track.child.js";
  var REQUESTER = "audralia-elevation-track-child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

  var SOURCE_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var ELEVATION_BANDS = Object.freeze([
    Object.freeze({ id: "abyssal_memory_floor", min: 0.000, max: 0.115, rank: 0, visualRole: "deepest_dry_memory" }),
    Object.freeze({ id: "future_fill_basin", min: 0.115, max: 0.235, rank: 1, visualRole: "future_water_receiver" }),
    Object.freeze({ id: "lowland", min: 0.235, max: 0.345, rank: 2, visualRole: "stable_low_terrain" }),
    Object.freeze({ id: "shelf", min: 0.345, max: 0.455, rank: 3, visualRole: "transition_shelf" }),
    Object.freeze({ id: "midland", min: 0.455, max: 0.595, rank: 4, visualRole: "main_land_body" }),
    Object.freeze({ id: "highland", min: 0.595, max: 0.735, rank: 5, visualRole: "raised_terrain_body" }),
    Object.freeze({ id: "ridge", min: 0.735, max: 0.865, rank: 6, visualRole: "watershed_or_boundary" }),
    Object.freeze({ id: "summit", min: 0.865, max: 1.001, rank: 7, visualRole: "source_peak" })
  ]);

  var state = {
    sourceApi: null,
    sourceTerrainDetected: false,
    sourceTerrainValid: false,
    sourceStatus: null,
    sourceCarrierPacket: null,
    sourceTerrainPacket: null,
    sourceNodes: [],

    elevationNodes: [],
    elevationGrid: [],
    elevationBands: ELEVATION_BANDS.slice(),

    summitZones: [],
    highlandZones: [],
    ridgeLines: [],
    basinFloors: [],
    valleyCorridors: [],
    slopeVectors: [],
    watershedBoundaries: [],
    drainageGates: [],
    futureFillDepressions: [],
    shelfTransitions: [],
    lowlandSystems: [],

    continentElevationProfiles: [],
    elevationBandDistribution: {},
    carrierVisualHintPacket: null,
    futureHydrationReadinessScore: 0,

    nodeById: {},
    elevationTrackReady: false,
    lastBuiltAt: null,
    errors: []
  };

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

  function normalizeX(value) {
    return ((Number(value || 0) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
  }

  function normalizeY(value) {
    return clamp(Number(value || 0), 0, FIBONACCI_BANDS - 1);
  }

  function gridDistance(ax, ay, bx, by) {
    var dx = Math.abs(Number(ax) - Number(bx));
    dx = Math.min(dx, RADIAL_NODES - dx);
    var dy = Number(ay) - Number(by);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + normalizeX(x) / RADIAL_NODES * 360,
      lat: 80 - normalizeY(y) / (FIBONACCI_BANDS - 1) * 160
    };
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

  function average(values) {
    if (!values.length) return 0;
    return values.reduce(function (a, b) { return a + Number(b || 0); }, 0) / values.length;
  }

  function unique(values) {
    var seen = {};
    var output = [];

    values.forEach(function (value) {
      if (value === undefined || value === null) return;
      var key = String(value);
      if (seen[key]) return;
      seen[key] = true;
      output.push(value);
    });

    return output;
  }

  function getNineContinentProfiles() {
    return Object.freeze([
      Object.freeze({
        continentId: "gratitude",
        continentName: "Gratitude",
        centerX: 4.65,
        centerY: 4.65,
        elevationTendency: "receiving_basins_protective_ridges_stable_shelves",
        watershedStyle: "basin_receiving",
        weights: { receptivity: 1.00, continuity: 0.72, repair: 0.42, clarity: 0.22, discipline: 0.22, restraint: 0.18, timeDepth: 0.36, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "generosity",
        continentName: "Generosity",
        centerX: 10.9,
        centerY: 3.8,
        elevationTendency: "outward_slopes_branching_ridges_distributive_corridors",
        watershedStyle: "outward_distribution",
        weights: { receptivity: 0.24, continuity: 0.48, repair: 0.20, clarity: 0.28, discipline: 0.32, restraint: 0.22, timeDepth: 0.28, expansion: 1.00 }
      }),
      Object.freeze({
        continentId: "dependability",
        continentName: "Dependability",
        centerX: 2.9,
        centerY: 8.1,
        elevationTendency: "stable_plateaus_durable_highlands_grounded_cratons",
        watershedStyle: "plateau_stability",
        weights: { receptivity: 0.28, continuity: 1.00, repair: 0.22, clarity: 0.38, discipline: 0.54, restraint: 0.34, timeDepth: 0.52, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "accountability",
        continentName: "Accountability",
        centerX: 8.25,
        centerY: 7.35,
        elevationTendency: "ridge_boundaries_escarpments_watershed_divides",
        watershedStyle: "boundary_divide",
        weights: { receptivity: 0.16, continuity: 0.44, repair: 0.18, clarity: 0.72, discipline: 1.00, restraint: 0.64, timeDepth: 0.30, expansion: 0.18 }
      }),
      Object.freeze({
        continentId: "forgiveness",
        continentName: "Forgiveness",
        centerX: 12.3,
        centerY: 8.9,
        elevationTendency: "repaired_valleys_sediment_basins_softened_lowlands",
        watershedStyle: "repair_valley",
        weights: { receptivity: 0.50, continuity: 0.46, repair: 1.00, clarity: 0.24, discipline: 0.24, restraint: 0.36, timeDepth: 0.58, expansion: 0.30 }
      }),
      Object.freeze({
        continentId: "humility",
        continentName: "Humility",
        centerX: 5.6,
        centerY: 12.0,
        elevationTendency: "lowland_depth_sheltered_basins_quiet_slopes",
        watershedStyle: "quiet_lowland",
        weights: { receptivity: 0.72, continuity: 0.48, repair: 0.62, clarity: 0.24, discipline: 0.18, restraint: 0.62, timeDepth: 0.72, expansion: 0.10 }
      }),
      Object.freeze({
        continentId: "self-control",
        continentName: "Self-Control",
        centerX: 10.25,
        centerY: 12.55,
        elevationTendency: "contained_channels_disciplined_trenches_restrained_ridges",
        watershedStyle: "contained_channel",
        weights: { receptivity: 0.18, continuity: 0.40, repair: 0.24, clarity: 0.40, discipline: 0.72, restraint: 1.00, timeDepth: 0.38, expansion: 0.12 }
      }),
      Object.freeze({
        continentId: "patience",
        continentName: "Patience",
        centerX: 13.7,
        centerY: 5.6,
        elevationTendency: "terraced_shelves_layered_plains_slow_transitions",
        watershedStyle: "terraced_layer",
        weights: { receptivity: 0.46, continuity: 0.64, repair: 0.54, clarity: 0.34, discipline: 0.40, restraint: 0.48, timeDepth: 1.00, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "purity",
        continentName: "Purity",
        centerX: 7.9,
        centerY: 2.05,
        elevationTendency: "clear_highlands_summit_zones_clean_ridge_systems",
        watershedStyle: "clear_source_peak",
        weights: { receptivity: 0.18, continuity: 0.42, repair: 0.16, clarity: 1.00, discipline: 0.56, restraint: 0.44, timeDepth: 0.30, expansion: 0.18 }
      })
    ]);
  }

  function detectSourceTerrain() {
    var api = firstGlobal(SOURCE_GLOBALS);

    state.sourceApi = api;
    state.sourceTerrainDetected = Boolean(api);
    state.sourceStatus = null;
    state.sourceCarrierPacket = null;
    state.sourceTerrainPacket = null;
    state.sourceNodes = [];

    if (!api) {
      state.sourceTerrainValid = false;
      return false;
    }

    state.sourceStatus = safeCall("sourceTerrain", api, "status");
    state.sourceCarrierPacket = safeCall("sourceTerrain", api, "getCarrierTerrainPacket", REQUESTER, { compact: false });

    if (typeof api.getDryRevealedTerrainPacket === "function") {
      state.sourceTerrainPacket = safeCall("sourceTerrain", api, "getDryRevealedTerrainPacket", REQUESTER, { compact: false });
    }

    if (!state.sourceTerrainPacket && state.sourceCarrierPacket && state.sourceCarrierPacket.planetPhysicalTerrainPacket) {
      state.sourceTerrainPacket = state.sourceCarrierPacket.planetPhysicalTerrainPacket;
    }

    state.sourceNodes = extractSourceNodes(state.sourceCarrierPacket, state.sourceTerrainPacket);
    state.sourceTerrainValid = state.sourceNodes.length > 0;

    return state.sourceTerrainValid;
  }

  function extractSourceNodes(carrierPacket, terrainPacket) {
    var nodes = [];

    if (terrainPacket && Array.isArray(terrainPacket.nodes)) {
      nodes = terrainPacket.nodes.slice();
    } else if (
      carrierPacket &&
      carrierPacket.planetPhysicalTerrainPacket &&
      Array.isArray(carrierPacket.planetPhysicalTerrainPacket.nodes)
    ) {
      nodes = carrierPacket.planetPhysicalTerrainPacket.nodes.slice();
    } else if (carrierPacket && Array.isArray(carrierPacket.nodes)) {
      nodes = carrierPacket.nodes.slice();
    }

    return nodes.map(function (node, index) {
      return normalizeSourceNode(node, index);
    }).filter(Boolean);
  }

  function normalizeSourceNode(node, index) {
    if (!node || typeof node !== "object") return null;

    var x = normalizeX(
      node.x !== undefined ? node.x :
      node.column !== undefined ? node.column :
      node.radial !== undefined ? node.radial :
      index % RADIAL_NODES
    );

    var y = normalizeY(
      node.y !== undefined ? node.y :
      node.row !== undefined ? node.row :
      node.band !== undefined ? node.band :
      Math.floor(index / RADIAL_NODES)
    );

    var ll = terrainSeatToLonLat(x, y);

    return {
      source: node,
      sourceSeatIndex: Number(node.seatIndex || node.nodeIndex || index),
      sourceNodeId: node.nodeId || node.seatKey || "source-node-" + index,
      x: round(x, 4),
      y: round(y, 4),
      lon: ll.lon,
      lat: ll.lat,

      baseDryElevation: clamp(Number(node.dryElevation || node.elevation || node.height || 0.5), 0, 1),
      relativeRelief: clamp(Number(node.relativeRelief || 0), 0, 1),

      ridgePressure: clamp(Number(node.ridgePressure || 0), 0, 1),
      basinPressure: clamp(Number(node.basinPressure || 0), 0, 1),
      valleyPressure: clamp(Number(node.valleyPressure || 0), 0, 1),
      trenchPressure: clamp(Number(node.trenchPressure || 0), 0, 1),
      shelfPressure: clamp(Number(node.shelfPressure || 0), 0, 1),
      escarpmentPressure: clamp(Number(node.escarpmentPressure || 0), 0, 1),
      mountainPressure: clamp(Number(node.mountainPressure || 0), 0, 1),
      summitPressure: clamp(Number(node.summitPressure || 0), 0, 1),
      gapPressure: clamp(Number(node.gapPressure || 0), 0, 1),
      formerHydrosphereCarvingValue: clamp(Number(node.formerHydrosphereCarvingValue || 0), 0, 1),

      futureFillEligible: Boolean(node.futureFillEligible),
      terrainClass: node.terrainClass || node.primaryTerrainRole || "stable_craton",
      regionSeed: node.regionSeed || node.continentId || ""
    };
  }

  function loadSourceTerrainPacket() {
    detectSourceTerrain();
    return {
      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      sourceCarrierPacket: state.sourceCarrierPacket,
      sourceTerrainPacket: state.sourceTerrainPacket,
      sourceNodes: state.sourceNodes
    };
  }

  function buildGrid(nodes) {
    var grid = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      grid[y] = [];
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        grid[y][x] = null;
      }
    }

    nodes.forEach(function (node) {
      var x = clamp(Math.round(node.x), 0, RADIAL_NODES - 1);
      var y = clamp(Math.round(node.y), 0, FIBONACCI_BANDS - 1);
      grid[y][x] = node;
    });

    return grid;
  }

  function getNeighbors(node, nodes, radius) {
    var out = [];

    nodes.forEach(function (other) {
      var d = gridDistance(node.x, node.y, other.x, other.y);
      if (d > 0 && d <= radius) out.push(other);
    });

    return out;
  }

  function nearestProfile(node, profiles) {
    var best = profiles[0];
    var bestScore = -Infinity;

    profiles.forEach(function (profile) {
      var distance = gridDistance(node.x, node.y, profile.centerX, profile.centerY);
      var closeness = 1 / (0.72 + distance);
      var regionBonus = String(node.regionSeed || "").toLowerCase() === profile.continentId ? 0.34 : 0;
      var pressureBonus =
        node.summitPressure * profile.weights.clarity * 0.07 +
        node.ridgePressure * profile.weights.discipline * 0.06 +
        node.basinPressure * profile.weights.receptivity * 0.06 +
        node.gapPressure * profile.weights.repair * 0.05 +
        node.shelfPressure * profile.weights.timeDepth * 0.04;

      var score = closeness + regionBonus + pressureBonus;

      if (score > bestScore) {
        best = profile;
        bestScore = score;
      }
    });

    return best;
  }

  function neighborAverage(source, sourceNodes) {
    var neighbors = getNeighbors(source, sourceNodes, 2.25);
    if (!neighbors.length) return source.baseDryElevation;

    return average(neighbors.map(function (node) {
      return node.baseDryElevation;
    }));
  }

  function calculateEthicalNarrativePressure(source, profile) {
    var weights = profile.weights;

    var receptivity = (source.basinPressure + source.gapPressure + source.valleyPressure + source.shelfPressure * 0.42) * weights.receptivity;
    var expansion = (source.ridgePressure * 0.34 + source.shelfPressure * 0.34 + Math.max(0, source.baseDryElevation - 0.45)) * weights.expansion;
    var continuity = (1 - Math.abs(source.baseDryElevation - 0.55) + source.ridgePressure * 0.24 + source.mountainPressure * 0.14) * weights.continuity;
    var discipline = (source.ridgePressure + source.escarpmentPressure + source.trenchPressure * 0.56) * weights.discipline;
    var repair = (source.formerHydrosphereCarvingValue + source.basinPressure * 0.46 + source.valleyPressure * 0.42 + source.gapPressure * 0.34) * weights.repair;
    var restraint = (source.trenchPressure + source.valleyPressure + source.escarpmentPressure * 0.38) * weights.restraint;
    var timeDepth = (source.shelfPressure + source.formerHydrosphereCarvingValue + source.basinPressure * 0.38) * weights.timeDepth;
    var clarity = (source.summitPressure + source.mountainPressure * 0.42 + source.ridgePressure * 0.26 - source.gapPressure * 0.12) * weights.clarity;

    return clamp(
      receptivity * 0.12 +
      expansion * 0.10 +
      continuity * 0.16 +
      discipline * 0.13 +
      repair * 0.12 +
      restraint * 0.12 +
      timeDepth * 0.12 +
      clarity * 0.13,
      0,
      1
    );
  }

  function calculateNarrativeElevation(source, sourceNodes) {
    var profiles = getNineContinentProfiles();
    var profile = nearestProfile(source, profiles);
    var ethicalPressure = calculateEthicalNarrativePressure(source, profile);
    var localAverage = neighborAverage(source, sourceNodes);

    var elevation = source.baseDryElevation * 0.38 + localAverage * 0.22 + ethicalPressure * 0.21;

    elevation += source.summitPressure * 0.16;
    elevation += source.mountainPressure * 0.13;
    elevation += source.ridgePressure * 0.085;
    elevation += source.escarpmentPressure * 0.055;
    elevation += source.shelfPressure * 0.038;

    elevation -= source.basinPressure * 0.090;
    elevation -= source.valleyPressure * 0.072;
    elevation -= source.trenchPressure * 0.088;
    elevation -= source.gapPressure * 0.080;
    elevation -= source.formerHydrosphereCarvingValue * 0.046;

    if (profile.continentId === "gratitude") elevation += source.basinPressure * 0.038 - source.gapPressure * 0.026 + source.shelfPressure * 0.024;
    if (profile.continentId === "generosity") elevation += source.ridgePressure * 0.050 + source.shelfPressure * 0.036;
    if (profile.continentId === "dependability") elevation += source.baseDryElevation > 0.48 ? 0.040 : 0.014;
    if (profile.continentId === "accountability") elevation += source.escarpmentPressure * 0.090 + source.ridgePressure * 0.048;
    if (profile.continentId === "forgiveness") elevation -= source.formerHydrosphereCarvingValue * 0.030 - source.shelfPressure * 0.018;
    if (profile.continentId === "humility") elevation -= source.basinPressure * 0.080 + source.gapPressure * 0.045;
    if (profile.continentId === "self-control") elevation += source.trenchPressure * 0.036 + source.ridgePressure * 0.030;
    if (profile.continentId === "patience") elevation += source.shelfPressure * 0.064 + source.formerHydrosphereCarvingValue * 0.020;
    if (profile.continentId === "purity") elevation += source.summitPressure * 0.095 + source.mountainPressure * 0.048;

    elevation = clamp(elevation, 0.035, 0.965);

    return {
      profile: profile,
      ethicalNarrativePressure: round(ethicalPressure, 4),
      elevation: round(elevation, 4)
    };
  }

  function assignElevationBand(node, neighbors) {
    var neighborElevation = neighbors.length ? average(neighbors.map(function (n) { return n.elevation; })) : node.elevation;
    var continuityElevation = node.elevation * 0.72 + neighborElevation * 0.28;

    if (node.summitPressure > 0.62 && continuityElevation > 0.70) return "summit";
    if ((node.ridgePressure > 0.56 || node.escarpmentPressure > 0.55) && continuityElevation > 0.56) return "ridge";
    if ((node.futureFillEligible || node.basinPressure > 0.50 || node.gapPressure > 0.50) && continuityElevation < 0.31) return "future_fill_basin";
    if (node.formerHydrosphereCarvingValue > 0.62 && continuityElevation < 0.19) return "abyssal_memory_floor";

    for (var i = 0; i < ELEVATION_BANDS.length; i += 1) {
      var band = ELEVATION_BANDS[i];
      if (continuityElevation >= band.min && continuityElevation < band.max) return band.id;
    }

    return "midland";
  }

  function bandRank(bandId) {
    for (var i = 0; i < ELEVATION_BANDS.length; i += 1) {
      if (ELEVATION_BANDS[i].id === bandId) return ELEVATION_BANDS[i].rank;
    }
    return 4;
  }

  function inferRegionRole(node, elevationBand) {
    if (elevationBand === "summit") return "summit_zone";
    if (elevationBand === "ridge") return "watershed_divider";
    if (node.futureFillEligible || elevationBand === "future_fill_basin") return "future_fill_receiver";
    if (node.valleyPressure > 0.44 || node.trenchPressure > 0.44) return "valley_corridor";
    if (elevationBand === "shelf") return "shelf_transition";
    if (elevationBand === "lowland" || elevationBand === "abyssal_memory_floor") return "lowland_system";
    if (elevationBand === "highland") return "highland_body";
    return "dry_land_body";
  }

  function buildElevationNodes(sourceNodes) {
    var nodes = [];

    sourceNodes.forEach(function (source, index) {
      var elevationData = calculateNarrativeElevation(source, sourceNodes);

      nodes.push({
        nodeId: "AUDRALIA-ELEVATION-NODE-" + String(index).padStart(3, "0"),
        sourceSeatIndex: source.sourceSeatIndex,
        sourceNodeId: source.sourceNodeId,
        x: source.x,
        y: source.y,
        lon: source.lon,
        lat: source.lat,

        continentId: elevationData.profile.continentId,
        continentName: elevationData.profile.continentName,
        continentElevationTendency: elevationData.profile.elevationTendency,
        watershedStyle: elevationData.profile.watershedStyle,

        regionRole: "pending",
        baseDryElevation: source.baseDryElevation,
        ethicalNarrativePressure: elevationData.ethicalNarrativePressure,
        elevation: elevationData.elevation,
        elevationBand: "pending",

        slopeVector: { dx: 0, dy: 0, direction: "flat", magnitude: 0, smoothedMagnitude: 0 },
        slopeMagnitude: 0,
        localContinuity: 0,
        flowConfidence: 0,

        ridgePressure: source.ridgePressure,
        basinPressure: source.basinPressure,
        valleyPressure: source.valleyPressure,
        trenchPressure: source.trenchPressure,
        shelfPressure: source.shelfPressure,
        escarpmentPressure: source.escarpmentPressure,
        mountainPressure: source.mountainPressure,
        summitPressure: source.summitPressure,
        gapPressure: source.gapPressure,
        formerHydrosphereCarvingValue: source.formerHydrosphereCarvingValue,

        watershedRole: "unassigned",
        futureFillEligible: Boolean(source.futureFillEligible),
        futureFillPriority: 0,
        drainageGateId: null,

        carrierMayConsume: true,
        hydrationHeld: true,
        hydrationActive: false,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });

    nodes.forEach(function (node) {
      var neighbors = getNeighbors(node, nodes, 1.55);
      node.elevationBand = assignElevationBand(node, neighbors);
      node.regionRole = inferRegionRole(node, node.elevationBand);
    });

    calculateSlopeVectors(nodes);

    nodes.forEach(function (node) {
      node.watershedRole = inferWatershedRole(node);
      node.futureFillPriority = calculateFutureFillPriority(node);
    });

    calculateSlopeVectors(nodes);

    state.nodeById = {};
    nodes.forEach(function (node) {
      state.nodeById[node.nodeId] = node;
    });

    return nodes.map(function (node) {
      return Object.freeze(node);
    });
  }

  function calculateSlopeVectors(elevationNodes) {
    var grid = buildGrid(elevationNodes);

    elevationNodes.forEach(function (node) {
      var x = clamp(Math.round(node.x), 0, RADIAL_NODES - 1);
      var y = clamp(Math.round(node.y), 0, FIBONACCI_BANDS - 1);

      var left = grid[y][(x - 1 + RADIAL_NODES) % RADIAL_NODES] || node;
      var right = grid[y][(x + 1) % RADIAL_NODES] || node;
      var up = grid[Math.max(0, y - 1)][x] || node;
      var down = grid[Math.min(FIBONACCI_BANDS - 1, y + 1)][x] || node;

      var dx = (right.elevation || node.elevation) - (left.elevation || node.elevation);
      var dy = (down.elevation || node.elevation) - (up.elevation || node.elevation);
      var rawMagnitude = clamp(Math.sqrt(dx * dx + dy * dy), 0, 1);

      var neighbors = getNeighbors(node, elevationNodes, 1.55);
      var localMagnitudes = neighbors.map(function (neighbor) {
        return Math.abs((neighbor.elevation || node.elevation) - node.elevation);
      });

      var smoothedMagnitude = clamp(rawMagnitude * 0.62 + average(localMagnitudes) * 0.38, 0, 1);
      var localContinuity = clamp(1 - average(localMagnitudes) * 2.4, 0, 1);
      var flowConfidence = clamp(smoothedMagnitude * 0.48 + localContinuity * 0.28 + node.futureFillPriority * 0.24, 0, 1);

      node.slopeVector = Object.freeze({
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        dx: round(dx, 4),
        dy: round(dy, 4),
        direction: inferSlopeDirection(dx, dy),
        magnitude: round(rawMagnitude, 4),
        smoothedMagnitude: round(smoothedMagnitude, 4),
        localContinuity: round(localContinuity, 4),
        flowConfidence: round(flowConfidence, 4),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });

      node.slopeMagnitude = node.slopeVector.smoothedMagnitude;
      node.localContinuity = node.slopeVector.localContinuity;
      node.flowConfidence = node.slopeVector.flowConfidence;
    });

    return elevationNodes;
  }

  function inferSlopeDirection(dx, dy) {
    if (Math.abs(dx) < 0.012 && Math.abs(dy) < 0.012) return "flat";

    var horizontal = dx > 0 ? "east" : "west";
    var vertical = dy > 0 ? "south" : "north";

    if (Math.abs(dx) > Math.abs(dy) * 1.65) return horizontal;
    if (Math.abs(dy) > Math.abs(dx) * 1.65) return vertical;

    return vertical + "_" + horizontal;
  }

  function inferWatershedRole(node) {
    if (node.elevationBand === "summit") return "source_peak";
    if (node.elevationBand === "ridge") return "watershed_divider";
    if (node.slopeMagnitude > 0.10 && (node.valleyPressure > 0.30 || node.trenchPressure > 0.24)) return "flow_corridor";
    if (node.futureFillEligible || node.elevationBand === "future_fill_basin") return "receiver_basin";
    if (node.elevationBand === "shelf") return "transition_shelf";
    if (node.elevationBand === "lowland" || node.elevationBand === "abyssal_memory_floor") return "lowland_receiver";
    if (node.elevationBand === "highland") return "highland_source";
    return "terrain_field";
  }

  function calculateFutureFillPriority(node) {
    var priority = 0;

    priority += node.futureFillEligible ? 0.34 : 0;
    priority += (1 - node.elevation) * 0.28;
    priority += node.basinPressure * 0.18;
    priority += node.valleyPressure * 0.10;
    priority += node.trenchPressure * 0.08;
    priority += node.gapPressure * 0.10;
    priority += node.formerHydrosphereCarvingValue * 0.08;
    priority += node.localContinuity * 0.04;

    priority -= node.ridgePressure * 0.08;
    priority -= node.summitPressure * 0.12;
    priority -= node.elevationBand === "summit" ? 0.22 : 0;
    priority -= node.elevationBand === "ridge" ? 0.12 : 0;

    return round(clamp(priority, 0, 1), 4);
  }

  function connectedGroups(nodes, predicate, sameContinent) {
    var candidates = nodes.filter(predicate);
    var visited = {};
    var groups = [];

    candidates.forEach(function (start) {
      if (visited[start.nodeId]) return;

      var queue = [start];
      var group = [];
      visited[start.nodeId] = true;

      while (queue.length) {
        var node = queue.shift();
        group.push(node);

        candidates.forEach(function (other) {
          if (visited[other.nodeId]) return;
          if (sameContinent && other.continentId !== node.continentId) return;

          var d = gridDistance(node.x, node.y, other.x, other.y);
          if (d <= 1.55) {
            visited[other.nodeId] = true;
            queue.push(other);
          }
        });
      }

      groups.push(group);
    });

    return groups;
  }

  function groupBounds(group) {
    var sorted = group.slice().sort(function (a, b) {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    return {
      start: sorted[0],
      end: sorted[sorted.length - 1],
      lowest: group.slice().sort(function (a, b) { return a.elevation - b.elevation; })[0],
      highest: group.slice().sort(function (a, b) { return b.elevation - a.elevation; })[0]
    };
  }

  function inferRidgeType(group) {
    var avgSummit = average(group.map(function (n) { return n.summitPressure; }));
    var avgEscarpment = average(group.map(function (n) { return n.escarpmentPressure; }));
    var avgBasin = average(group.map(function (n) { return n.basinPressure; }));
    var avgTrench = average(group.map(function (n) { return n.trenchPressure; }));
    var rankAverage = average(group.map(function (n) { return bandRank(n.elevationBand); }));

    if (avgSummit > 0.50 || rankAverage > 6.45) return "summit_spine";
    if (avgEscarpment > 0.46) return "escarpment_edge";
    if (avgBasin > 0.40) return "protective_basin_rim";
    if (avgTrench > 0.38) return "dry_channel_wall";
    if (group.length > 4) return "watershed_divider";
    return "continent_boundary_ridge";
  }

  function buildRidgeLines(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.elevationBand === "ridge" ||
        node.elevationBand === "summit" ||
        node.ridgePressure > 0.54 ||
        node.escarpmentPressure > 0.56 ||
        (node.elevation > 0.66 && node.slopeMagnitude > 0.08);
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);
      var nodeIds = group.map(function (node) { return node.nodeId; });
      var avgElevation = average(group.map(function (node) { return node.elevation; }));
      var continuity = average(group.map(function (node) { return node.localContinuity; }));
      var divideStrength = clamp(
        average(group.map(function (node) {
          return node.ridgePressure * 0.42 + node.escarpmentPressure * 0.22 + node.slopeMagnitude * 0.22 + bandRank(node.elevationBand) / 7 * 0.14;
        })),
        0,
        1
      );

      return Object.freeze({
        ridgeLineId: "AUDRALIA-RIDGE-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: bounds.highest.continentId,
        continentName: bounds.highest.continentName,
        ridgeType: inferRidgeType(group),
        nodeIds: nodeIds,
        startNodeId: bounds.start.nodeId,
        endNodeId: bounds.end.nodeId,
        highestNodeId: bounds.highest.nodeId,
        averageElevation: round(avgElevation, 4),
        ridgeContinuity: round(continuity, 4),
        watershedDivideStrength: round(divideStrength, 4),
        futureFlowBlocked: divideStrength > 0.38,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function inferBasinType(group) {
    var avgElevation = average(group.map(function (n) { return n.elevation; }));
    var avgCarving = average(group.map(function (n) { return n.formerHydrosphereCarvingValue; }));
    var avgBasin = average(group.map(function (n) { return n.basinPressure; }));
    var avgShelf = average(group.map(function (n) { return n.shelfPressure; }));
    var avgFuture = average(group.map(function (n) { return n.futureFillPriority; }));

    if (avgElevation < 0.14 || avgCarving > 0.62) return "abyssal_memory_floor";
    if (avgFuture > 0.68 && group.length > 4) return "future_inland_sea_basin";
    if (avgFuture > 0.48 || avgBasin > 0.46) return "future_lake_basin";
    if (avgCarving > 0.42) return "sediment_memory_basin";
    if (avgShelf > 0.38) return "sheltered_receiving_basin";
    return "dry_lowland_bowl";
  }

  function buildBasinFloors(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.elevationBand === "future_fill_basin" ||
        node.elevationBand === "abyssal_memory_floor" ||
        node.basinPressure > 0.46 ||
        node.futureFillPriority > 0.58 ||
        (node.elevation < 0.28 && node.localContinuity > 0.30);
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);
      var nodeIds = group.map(function (node) { return node.nodeId; });
      var avgElevation = average(group.map(function (node) { return node.elevation; }));
      var priority = average(group.map(function (node) { return node.futureFillPriority; }));
      var receiving = clamp(priority * 0.56 + average(group.map(function (node) { return node.basinPressure + node.gapPressure; })) * 0.22, 0, 1);

      return Object.freeze({
        basinFloorId: "AUDRALIA-BASIN-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: bounds.lowest.continentId,
        continentName: bounds.lowest.continentName,
        basinType: inferBasinType(group),
        nodeIds: nodeIds,
        lowestNodeId: bounds.lowest.nodeId,
        averageElevation: round(avgElevation, 4),
        futureFillPriority: round(priority, 4),
        receivingStrength: round(receiving, 4),
        rimNodeIds: findRimNodeIds(group, elevationNodes),
        drainageGateIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function findRimNodeIds(group, allNodes) {
    var groupMap = {};
    group.forEach(function (node) { groupMap[node.nodeId] = true; });

    var rim = [];

    group.forEach(function (node) {
      getNeighbors(node, allNodes, 1.55).forEach(function (neighbor) {
        if (groupMap[neighbor.nodeId]) return;
        if (neighbor.elevation > node.elevation + 0.045 || neighbor.ridgePressure > 0.34) {
          rim.push(neighbor.nodeId);
        }
      });
    });

    return unique(rim).slice(0, 12);
  }

  function inferValleyType(group) {
    var avgTrench = average(group.map(function (n) { return n.trenchPressure; }));
    var avgValley = average(group.map(function (n) { return n.valleyPressure; }));
    var avgShelf = average(group.map(function (n) { return n.shelfPressure; }));
    var avgFuture = average(group.map(function (n) { return n.futureFillPriority; }));
    var continent = group[0] ? group[0].continentId : "";

    if (continent === "self-control") return "contained_self_control_channel";
    if (avgTrench > 0.42) return "dry_trench_corridor";
    if (avgFuture > 0.52 && avgValley > 0.30) return "future_river_corridor";
    if (avgShelf > 0.42) return "shelf_descent_corridor";
    if (avgValley > 0.42) return "basin_feed_corridor";
    return "ridge_break_corridor";
  }

  function buildValleyCorridors(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.valleyPressure > 0.38 ||
        node.trenchPressure > 0.36 ||
        node.watershedRole === "flow_corridor" ||
        (node.slopeMagnitude > 0.12 && node.futureFillPriority > 0.35);
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);
      var nodeIds = group.map(function (node) { return node.nodeId; });
      var avgSlope = average(group.map(function (node) { return node.slopeMagnitude; }));
      var flowDirection = dominantDirection(group);
      var continuity = average(group.map(function (node) { return node.localContinuity; }));
      var futurePriority = average(group.map(function (node) { return node.futureFillPriority; }));

      return Object.freeze({
        valleyCorridorId: "AUDRALIA-VALLEY-CORRIDOR-" + String(index).padStart(3, "0"),
        continentId: bounds.lowest.continentId,
        continentName: bounds.lowest.continentName,
        corridorType: inferValleyType(group),
        nodeIds: nodeIds,
        fromHighNodeId: bounds.highest.nodeId,
        toLowNodeId: bounds.lowest.nodeId,
        flowDirection: flowDirection,
        averageSlope: round(avgSlope, 4),
        continuity: round(continuity, 4),
        futureRiverCandidate: futurePriority > 0.42,
        drainageGateIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function dominantDirection(nodes) {
    var scores = {};

    nodes.forEach(function (node) {
      var direction = node.slopeVector && node.slopeVector.direction ? node.slopeVector.direction : "flat";
      scores[direction] = (scores[direction] || 0) + (node.slopeMagnitude || 0.1);
    });

    return maxKey(scores) || "flat";
  }

  function nearestSystemId(node, collection, idField) {
    var best = null;
    var bestDistance = Infinity;

    collection.forEach(function (system) {
      var ids = system.nodeIds || [system.nodeId];
      ids.forEach(function (id) {
        var candidate = state.nodeById[id];
        if (!candidate) return;

        var d = gridDistance(node.x, node.y, candidate.x, candidate.y);
        if (d < bestDistance) {
          best = system[idField];
          bestDistance = d;
        }
      });
    });

    return best;
  }

  function inferDrainageGateType(node) {
    if (node.trenchPressure > 0.46) return "trench_gate";
    if (node.valleyPressure > 0.44) return "valley_gate";
    if (node.basinPressure > 0.48) return "basin_gate";
    if (node.shelfPressure > 0.46) return "shelf_gate";
    if (node.ridgePressure > 0.36 && node.futureFillPriority > 0.34) return "ridge_break_gate";
    return "lowland_receiver_gate";
  }

  function buildDrainageGates(elevationNodes, basinFloors, valleyCorridors) {
    var gates = elevationNodes.filter(function (node) {
      return node.futureFillPriority > 0.40 &&
        node.slopeMagnitude > 0.030 &&
        node.elevationBand !== "summit" &&
        node.elevationBand !== "ridge";
    }).map(function (node, index) {
      var id = "AUDRALIA-DRAINAGE-GATE-" + String(index).padStart(3, "0");
      var fromSystemId = nearestSystemId(node, valleyCorridors, "valleyCorridorId");
      var toSystemId = nearestSystemId(node, basinFloors, "basinFloorId");
      var gateStrength = clamp(node.futureFillPriority * 0.48 + node.slopeMagnitude * 0.28 + node.flowConfidence * 0.24, 0, 1);

      node.drainageGateId = id;

      return Object.freeze({
        drainageGateId: id,
        continentId: node.continentId,
        continentName: node.continentName,
        gateType: inferDrainageGateType(node),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        elevation: node.elevation,
        slopeVector: node.slopeVector,
        flowDirection: node.slopeVector.direction,
        fromSystemId: fromSystemId,
        toSystemId: toSystemId,
        futureFillPriority: node.futureFillPriority,
        gateStrength: round(gateStrength, 4),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });

    return gates;
  }

  function attachGateIdsToSystems(basinFloors, valleyCorridors, drainageGates) {
    basinFloors.forEach(function (basin) {
      basin.drainageGateIds = drainageGates.filter(function (gate) {
        return gate.toSystemId === basin.basinFloorId;
      }).map(function (gate) {
        return gate.drainageGateId;
      });
    });

    valleyCorridors.forEach(function (corridor) {
      corridor.drainageGateIds = drainageGates.filter(function (gate) {
        return gate.fromSystemId === corridor.valleyCorridorId;
      }).map(function (gate) {
        return gate.drainageGateId;
      });
    });
  }

  function inferWatershedType(ridge, basins, valleys) {
    if (ridge.ridgeType === "summit_spine") return "summit_to_basin";
    if (ridge.ridgeType === "continent_boundary_ridge") return "continent_boundary_watershed";
    if (ridge.ridgeType === "protective_basin_rim") return "basin_internal";
    if (basins.length && valleys.length) return "ridge_to_lowland";
    if (ridge.ridgeType === "escarpment_edge") return "plateau_to_shelf";
    return "dry_hydrosphere_memory_watershed";
  }

  function buildWatershedBoundaries(elevationNodes, ridgeLines, basinFloors, valleyCorridors, drainageGates) {
    return ridgeLines.map(function (ridge, index) {
      var ridgeNodes = ridge.nodeIds.map(function (id) { return state.nodeById[id]; }).filter(Boolean);
      var relatedBasins = nearestSystemsToNodeIds(ridge.nodeIds, basinFloors, "basinFloorId", 3);
      var relatedValleys = nearestSystemsToNodeIds(ridge.nodeIds, valleyCorridors, "valleyCorridorId", 4);
      var relatedGates = nearestGatesToNodeIds(ridge.nodeIds, drainageGates, 5);
      var sourceNodeIds = ridgeNodes.filter(function (node) {
        return node.elevationBand === "summit" || node.watershedRole === "source_peak";
      }).map(function (node) {
        return node.nodeId;
      });

      return Object.freeze({
        watershedId: "AUDRALIA-WATERSHED-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: ridge.continentId,
        continentName: ridge.continentName,
        watershedType: inferWatershedType(ridge, relatedBasins, relatedValleys),
        ridgeBoundaryNodeIds: ridge.nodeIds.slice(),
        sourceNodeIds: sourceNodeIds.length ? sourceNodeIds : [ridge.highestNodeId].filter(Boolean),
        basinReceiverNodeIds: flattenSystemsNodeIds(relatedBasins, basinFloors, "basinFloorId").slice(0, 12),
        valleyCorridorIds: relatedValleys,
        drainageGateIds: relatedGates,
        dominantFlowDirection: dominantDirection(ridgeNodes),
        watershedStrength: ridge.watershedDivideStrength,
        futureFillPriority: round(average(relatedBasins.map(function (id) {
          var system = findById(basinFloors, "basinFloorId", id);
          return system ? system.futureFillPriority : 0;
        })), 4),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function nearestSystemsToNodeIds(nodeIds, systems, idField, limit) {
    var origins = nodeIds.map(function (id) { return state.nodeById[id]; }).filter(Boolean);
    var scored = [];

    systems.forEach(function (system) {
      var ids = system.nodeIds || [];
      var min = Infinity;

      origins.forEach(function (origin) {
        ids.forEach(function (id) {
          var node = state.nodeById[id];
          if (!node) return;
          min = Math.min(min, gridDistance(origin.x, origin.y, node.x, node.y));
        });
      });

      if (Number.isFinite(min)) scored.push({ id: system[idField], distance: min });
    });

    return scored.sort(function (a, b) {
      return a.distance - b.distance;
    }).slice(0, limit || 3).map(function (item) {
      return item.id;
    });
  }

  function nearestGatesToNodeIds(nodeIds, gates, limit) {
    var origins = nodeIds.map(function (id) { return state.nodeById[id]; }).filter(Boolean);
    var scored = [];

    gates.forEach(function (gate) {
      var min = Infinity;

      origins.forEach(function (origin) {
        min = Math.min(min, gridDistance(origin.x, origin.y, gate.x, gate.y));
      });

      if (Number.isFinite(min)) scored.push({ id: gate.drainageGateId, distance: min });
    });

    return scored.sort(function (a, b) {
      return a.distance - b.distance;
    }).slice(0, limit || 4).map(function (item) {
      return item.id;
    });
  }

  function flattenSystemsNodeIds(systemIds, systems, idField) {
    var ids = [];

    systemIds.forEach(function (systemId) {
      var system = findById(systems, idField, systemId);
      if (system && Array.isArray(system.nodeIds)) ids = ids.concat(system.nodeIds);
    });

    return unique(ids);
  }

  function findById(collection, idField, id) {
    for (var i = 0; i < collection.length; i += 1) {
      if (collection[i][idField] === id) return collection[i];
    }
    return null;
  }

  function inferFutureFillType(group, basinType) {
    var avgElevation = average(group.map(function (n) { return n.elevation; }));
    var avgShelf = average(group.map(function (n) { return n.shelfPressure; }));
    var avgValley = average(group.map(function (n) { return n.valleyPressure; }));
    var avgTrench = average(group.map(function (n) { return n.trenchPressure; }));

    if (basinType === "future_inland_sea_basin" || avgElevation < 0.145) return "future_inland_sea";
    if (avgValley > 0.40 || avgTrench > 0.42) return "future_river_corridor";
    if (avgShelf > 0.42) return "future_shelf_waterline";
    if (basinType === "future_lake_basin") return "future_lake";
    if (basinType === "sediment_memory_basin") return "future_groundwater_recharge_zone";
    return "future_wetland_basin";
  }

  function buildFutureFillDepressions(elevationNodes, basinFloors, drainageGates) {
    var depressions = basinFloors.map(function (basin, index) {
      var group = basin.nodeIds.map(function (id) { return state.nodeById[id]; }).filter(Boolean);
      var connectedGates = drainageGates.filter(function (gate) {
        return basin.drainageGateIds.indexOf(gate.drainageGateId) >= 0 || gate.toSystemId === basin.basinFloorId;
      }).map(function (gate) {
        return gate.drainageGateId;
      });

      return Object.freeze({
        futureFillDepressionId: "AUDRALIA-FUTURE-FILL-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: basin.continentId,
        continentName: basin.continentName,
        depressionType: basin.basinType,
        nodeIds: basin.nodeIds.slice(),
        lowestNodeId: basin.lowestNodeId,
        averageElevation: basin.averageElevation,
        futureFillPriority: basin.futureFillPriority,
        receivingStrength: basin.receivingStrength,
        connectedDrainageGateIds: connectedGates,
        candidateHydrationType: inferFutureFillType(group, basin.basinType),
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });

    elevationNodes.filter(function (node) {
      return node.futureFillPriority > 0.64 &&
        !depressions.some(function (system) { return system.nodeIds.indexOf(node.nodeId) >= 0; });
    }).forEach(function (node, extraIndex) {
      depressions.push(Object.freeze({
        futureFillDepressionId: "AUDRALIA-FUTURE-FILL-NODE-" + String(extraIndex).padStart(3, "0"),
        continentId: node.continentId,
        continentName: node.continentName,
        depressionType: "isolated_future_fill_lowland",
        nodeIds: [node.nodeId],
        lowestNodeId: node.nodeId,
        averageElevation: node.elevation,
        futureFillPriority: node.futureFillPriority,
        receivingStrength: node.futureFillPriority,
        connectedDrainageGateIds: node.drainageGateId ? [node.drainageGateId] : [],
        candidateHydrationType: "future_groundwater_recharge_zone",
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      }));
    });

    return depressions;
  }

  function buildShelfTransitions(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.elevationBand === "shelf" || node.shelfPressure > 0.42;
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);
      var avgShelf = average(group.map(function (node) { return node.shelfPressure; }));
      var avgFuture = average(group.map(function (node) { return node.futureFillPriority; }));

      return Object.freeze({
        shelfTransitionId: "AUDRALIA-SHELF-TRANSITION-" + String(index).padStart(3, "0"),
        continentId: bounds.lowest.continentId,
        continentName: bounds.lowest.continentName,
        nodeIds: group.map(function (node) { return node.nodeId; }),
        averageElevation: round(average(group.map(function (node) { return node.elevation; })), 4),
        shelfPressure: round(avgShelf, 4),
        futureBeachCandidate: avgFuture > 0.32,
        edgeMaterialHeld: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildLowlandSystems(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.elevationBand === "lowland" ||
        node.elevationBand === "future_fill_basin" ||
        node.elevationBand === "abyssal_memory_floor";
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);

      return Object.freeze({
        lowlandSystemId: "AUDRALIA-LOWLAND-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: bounds.lowest.continentId,
        continentName: bounds.lowest.continentName,
        nodeIds: group.map(function (node) { return node.nodeId; }),
        lowestNodeId: bounds.lowest.nodeId,
        averageElevation: round(average(group.map(function (node) { return node.elevation; })), 4),
        dominantElevationBand: dominantBand(group),
        futureFillPriority: round(average(group.map(function (node) { return node.futureFillPriority; })), 4),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function dominantBand(nodes) {
    var scores = {};

    nodes.forEach(function (node) {
      scores[node.elevationBand] = (scores[node.elevationBand] || 0) + 1;
    });

    return maxKey(scores) || "midland";
  }

  function buildHighlandZones(elevationNodes) {
    var groups = connectedGroups(elevationNodes, function (node) {
      return node.elevationBand === "highland" ||
        node.elevationBand === "ridge" ||
        node.elevationBand === "summit";
    }, true);

    return groups.map(function (group, index) {
      var bounds = groupBounds(group);

      return Object.freeze({
        highlandZoneId: "AUDRALIA-HIGHLAND-ZONE-" + String(index).padStart(3, "0"),
        continentId: bounds.highest.continentId,
        continentName: bounds.highest.continentName,
        nodeIds: group.map(function (node) { return node.nodeId; }),
        highestNodeId: bounds.highest.nodeId,
        averageElevation: round(average(group.map(function (node) { return node.elevation; })), 4),
        dominantElevationBand: dominantBand(group),
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildSummitZones(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "summit" || node.summitPressure > 0.56;
    }).map(function (node, index) {
      return Object.freeze({
        summitZoneId: "AUDRALIA-SUMMIT-ZONE-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        continentName: node.continentName,
        elevation: node.elevation,
        summitPressure: node.summitPressure,
        mountainPressure: node.mountainPressure,
        sourcePeak: true,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildElevationBandDistribution(elevationNodes) {
    var distribution = {};

    ELEVATION_BANDS.forEach(function (band) {
      distribution[band.id] = 0;
    });

    elevationNodes.forEach(function (node) {
      distribution[node.elevationBand] = (distribution[node.elevationBand] || 0) + 1;
    });

    return Object.freeze(distribution);
  }

  function buildContinentElevationProfiles(elevationNodes) {
    var profiles = getNineContinentProfiles();

    return profiles.map(function (profile) {
      var nodes = elevationNodes.filter(function (node) {
        return node.continentId === profile.continentId;
      });

      var distribution = {};
      ELEVATION_BANDS.forEach(function (band) {
        distribution[band.id] = 0;
      });

      nodes.forEach(function (node) {
        distribution[node.elevationBand] = (distribution[node.elevationBand] || 0) + 1;
      });

      var avgElevation = average(nodes.map(function (node) { return node.elevation; }));
      var avgSlope = average(nodes.map(function (node) { return node.slopeMagnitude; }));
      var futurePriority = average(nodes.map(function (node) { return node.futureFillPriority; }));

      return Object.freeze({
        continentId: profile.continentId,
        continentName: profile.continentName,
        elevationTendency: profile.elevationTendency,
        watershedStyle: profile.watershedStyle,
        nodeCount: nodes.length,
        averageElevation: round(avgElevation, 4),
        averageSlopeMagnitude: round(avgSlope, 4),
        futureFillPriority: round(futurePriority, 4),
        dominantElevationBand: dominantBand(nodes),
        elevationBandDistribution: Object.freeze(distribution),
        summitNodeCount: nodes.filter(function (node) { return node.elevationBand === "summit"; }).length,
        ridgeNodeCount: nodes.filter(function (node) { return node.elevationBand === "ridge"; }).length,
        basinNodeCount: nodes.filter(function (node) {
          return node.elevationBand === "future_fill_basin" || node.elevationBand === "abyssal_memory_floor";
        }).length,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildCarrierVisualHintPacket() {
    function makeHint(idPrefix, collection, idField, visualRole, intensityField) {
      return collection.map(function (item, index) {
        var nodeIds = item.nodeIds || (item.nodeId ? [item.nodeId] : []);
        var intensity = clamp(Number(item[intensityField] || item.futureFillPriority || item.averageElevation || item.watershedStrength || 0.5), 0, 1);

        return Object.freeze({
          hintId: idPrefix + "-" + String(index).padStart(3, "0"),
          sourceSystemId: item[idField],
          nodeIds: nodeIds.slice(0, 16),
          continentId: item.continentId,
          continentName: item.continentName,
          elevationBand: item.dominantElevationBand || item.elevationBand || "mixed",
          visualRole: visualRole,
          intensity: round(intensity, 4),
          carrierMayConsume: true,
          childDrawsVisuals: false,
          hydrationHeld: true,
          hydrationActive: false,
          activeHydration: false,
          finalVisualPassClaim: false
        });
      });
    }

    return Object.freeze({
      contract: CONTRACT,
      packetType: "carrier_visual_hint_packet",
      childDrawsVisuals: false,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false,

      summitHints: makeHint("SUMMIT-HINT", state.summitZones, "summitZoneId", "summit_highlight", "elevation"),
      highlandHints: makeHint("HIGHLAND-HINT", state.highlandZones, "highlandZoneId", "highland_body", "averageElevation"),
      ridgeHints: makeHint("RIDGE-HINT", state.ridgeLines, "ridgeLineId", "ridge_relief", "watershedDivideStrength"),
      basinHints: makeHint("BASIN-HINT", state.basinFloors, "basinFloorId", "basin_depth", "receivingStrength"),
      valleyHints: makeHint("VALLEY-HINT", state.valleyCorridors, "valleyCorridorId", "valley_direction", "averageSlope"),
      futureFillHints: makeHint("FUTURE-FILL-HINT", state.futureFillDepressions, "futureFillDepressionId", "future_fill_depression", "futureFillPriority"),
      shelfHints: makeHint("SHELF-HINT", state.shelfTransitions, "shelfTransitionId", "shelf_transition", "shelfPressure"),
      lowlandHints: makeHint("LOWLAND-HINT", state.lowlandSystems, "lowlandSystemId", "lowland_depth", "futureFillPriority")
    });
  }

  function calculateFutureHydrationReadinessScore() {
    var basinScore = clamp(state.basinFloors.length / 16, 0, 1) * 0.22;
    var valleyScore = clamp(state.valleyCorridors.length / 18, 0, 1) * 0.18;
    var gateScore = clamp(state.drainageGates.length / 24, 0, 1) * 0.20;
    var futureFillScore = clamp(state.futureFillDepressions.length / 14, 0, 1) * 0.22;
    var watershedScore = clamp(state.watershedBoundaries.length / 12, 0, 1) * 0.18;

    return round(clamp(basinScore + valleyScore + gateScore + futureFillScore + watershedScore, 0, 1), 4);
  }

  function rebuildElevationTrack() {
    loadSourceTerrainPacket();

    if (!state.sourceTerrainValid) {
      clearElevationTrack();
      publishStatus();
      return false;
    }

    state.elevationNodes = buildElevationNodes(state.sourceNodes);
    state.elevationGrid = buildGrid(state.elevationNodes);
    state.elevationBands = ELEVATION_BANDS.slice();

    state.summitZones = buildSummitZones(state.elevationNodes);
    state.highlandZones = buildHighlandZones(state.elevationNodes);
    state.ridgeLines = buildRidgeLines(state.elevationNodes);
    state.basinFloors = buildBasinFloors(state.elevationNodes);
    state.valleyCorridors = buildValleyCorridors(state.elevationNodes);
    state.drainageGates = buildDrainageGates(state.elevationNodes, state.basinFloors, state.valleyCorridors);

    attachGateIdsToSystems(state.basinFloors, state.valleyCorridors, state.drainageGates);

    state.watershedBoundaries = buildWatershedBoundaries(
      state.elevationNodes,
      state.ridgeLines,
      state.basinFloors,
      state.valleyCorridors,
      state.drainageGates
    );

    state.futureFillDepressions = buildFutureFillDepressions(state.elevationNodes, state.basinFloors, state.drainageGates);
    state.shelfTransitions = buildShelfTransitions(state.elevationNodes);
    state.lowlandSystems = buildLowlandSystems(state.elevationNodes);

    state.slopeVectors = state.elevationNodes.map(function (node) {
      return Object.freeze({
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        continentName: node.continentName,
        dx: node.slopeVector.dx,
        dy: node.slopeVector.dy,
        direction: node.slopeVector.direction,
        magnitude: node.slopeVector.magnitude,
        smoothedMagnitude: node.slopeVector.smoothedMagnitude,
        localContinuity: node.slopeVector.localContinuity,
        flowConfidence: node.slopeVector.flowConfidence,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });

    state.elevationBandDistribution = buildElevationBandDistribution(state.elevationNodes);
    state.continentElevationProfiles = buildContinentElevationProfiles(state.elevationNodes);
    state.futureHydrationReadinessScore = calculateFutureHydrationReadinessScore();
    state.carrierVisualHintPacket = buildCarrierVisualHintPacket();

    state.elevationTrackReady = state.elevationNodes.length > 0;
    state.lastBuiltAt = new Date().toISOString();

    publishStatus();
    return state.elevationTrackReady;
  }

  function clearElevationTrack() {
    state.elevationNodes = [];
    state.elevationGrid = [];
    state.elevationBands = ELEVATION_BANDS.slice();
    state.summitZones = [];
    state.highlandZones = [];
    state.ridgeLines = [];
    state.basinFloors = [];
    state.valleyCorridors = [];
    state.slopeVectors = [];
    state.watershedBoundaries = [];
    state.drainageGates = [];
    state.futureFillDepressions = [];
    state.shelfTransitions = [];
    state.lowlandSystems = [];
    state.continentElevationProfiles = [];
    state.elevationBandDistribution = {};
    state.carrierVisualHintPacket = null;
    state.futureHydrationReadinessScore = 0;
    state.elevationTrackReady = false;
    state.lastBuiltAt = new Date().toISOString();
  }

  function sampleElevationAt(x, y, options) {
    var opts = options || {};
    var sx = Number(x);
    var sy = Number(y);

    if (opts.normalized === true) {
      sx = sx * (RADIAL_NODES - 1);
      sy = sy * (FIBONACCI_BANDS - 1);
    }

    if (opts.lonLat === true) {
      sx = ((Number(x) + 180) / 360) * RADIAL_NODES;
      sy = ((80 - Number(y)) / 160) * (FIBONACCI_BANDS - 1);
    }

    sx = normalizeX(sx);
    sy = normalizeY(sy);

    if (!state.elevationTrackReady) {
      return {
        x: sx,
        y: sy,
        elevation: 0,
        elevationBand: "unready",
        elevationTrackReady: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    var total = 0;
    var elevation = 0;
    var slopeMagnitude = 0;
    var futureFillPriority = 0;
    var localContinuity = 0;
    var flowConfidence = 0;
    var bandScores = {};
    var continentScores = {};
    var nearest = null;
    var nearestDistance = Infinity;

    state.elevationNodes.forEach(function (node) {
      var d = gridDistance(sx, sy, node.x, node.y);
      if (d > 2.8) return;

      var weight = 1 / Math.pow(0.40 + d, 2.08);

      total += weight;
      elevation += node.elevation * weight;
      slopeMagnitude += node.slopeMagnitude * weight;
      futureFillPriority += node.futureFillPriority * weight;
      localContinuity += node.localContinuity * weight;
      flowConfidence += node.flowConfidence * weight;

      bandScores[node.elevationBand] = (bandScores[node.elevationBand] || 0) + weight;
      continentScores[node.continentId] = (continentScores[node.continentId] || 0) + weight;

      if (d < nearestDistance) {
        nearest = node;
        nearestDistance = d;
      }
    });

    if (!total || !nearest) {
      return {
        x: sx,
        y: sy,
        elevation: 0,
        elevationBand: "unmapped",
        elevationTrackReady: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    return {
      x: round(sx, 4),
      y: round(sy, 4),
      nearestNodeId: nearest.nodeId,
      continentId: maxKey(continentScores),
      continentName: nearest.continentName,
      elevation: round(elevation / total, 4),
      elevationBand: maxKey(bandScores),
      slopeMagnitude: round(slopeMagnitude / total, 4),
      localContinuity: round(localContinuity / total, 4),
      flowConfidence: round(flowConfidence / total, 4),
      futureFillPriority: round(futureFillPriority / total, 4),
      watershedRole: nearest.watershedRole,
      flowDirection: nearest.slopeVector.direction,
      elevationTrackReady: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function cloneLeanNode(node) {
    return {
      nodeId: node.nodeId,
      sourceSeatIndex: node.sourceSeatIndex,
      x: node.x,
      y: node.y,
      continentId: node.continentId,
      continentName: node.continentName,
      regionRole: node.regionRole,
      baseDryElevation: node.baseDryElevation,
      ethicalNarrativePressure: node.ethicalNarrativePressure,
      elevation: node.elevation,
      elevationBand: node.elevationBand,
      slopeVector: node.slopeVector,
      slopeMagnitude: node.slopeMagnitude,
      localContinuity: node.localContinuity,
      flowConfidence: node.flowConfidence,
      watershedRole: node.watershedRole,
      futureFillEligible: node.futureFillEligible,
      futureFillPriority: node.futureFillPriority,
      drainageGateId: node.drainageGateId,
      carrierMayConsume: true,
      hydrationHeld: true,
      hydrationActive: false,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function buildCarrierElevationPacket(requester, options) {
    var opts = options || {};
    var compact = opts.compact === true;

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      packetType: "carrier_safe_optimal_elevation_track_packet",
      requester: requester || "unknown",

      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,

      carrierMayConsume: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      hydrationActive: false,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      elevationNodes: compact ? state.elevationNodes.map(cloneLeanNode) : state.elevationNodes.slice(),
      elevationBands: state.elevationBands.slice(),
      summitZones: state.summitZones.slice(),
      highlandZones: state.highlandZones.slice(),
      ridgeLines: state.ridgeLines.slice(),
      basinFloors: state.basinFloors.slice(),
      valleyCorridors: state.valleyCorridors.slice(),
      slopeVectors: state.slopeVectors.slice(),
      watershedBoundaries: state.watershedBoundaries.slice(),
      drainageGates: state.drainageGates.slice(),
      futureFillDepressions: state.futureFillDepressions.slice(),
      shelfTransitions: state.shelfTransitions.slice(),
      lowlandSystems: state.lowlandSystems.slice(),

      continentElevationProfiles: state.continentElevationProfiles.slice(),
      elevationBandDistribution: Object.assign({}, state.elevationBandDistribution),
      watershedSystemCount: state.watershedBoundaries.length,
      futureHydrationReadinessScore: state.futureHydrationReadinessScore,
      carrierVisualHintPacket: state.carrierVisualHintPacket,

      receipt: status()
    });
  }

  function getElevationTrackPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      packetType: "full_optimal_elevation_track_truth_packet",
      requester: requester || "unknown",

      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,

      hydrationHeld: true,
      hydrationActive: false,
      activeHydration: false,
      futureFillOnly: true,
      childDrawsVisuals: false,
      finalVisualPassClaim: false,

      elevationNodes: state.elevationNodes.slice(),
      elevationBands: state.elevationBands.slice(),
      summitZones: state.summitZones.slice(),
      highlandZones: state.highlandZones.slice(),
      ridgeLines: state.ridgeLines.slice(),
      basinFloors: state.basinFloors.slice(),
      valleyCorridors: state.valleyCorridors.slice(),
      slopeVectors: state.slopeVectors.slice(),
      watershedBoundaries: state.watershedBoundaries.slice(),
      drainageGates: state.drainageGates.slice(),
      futureFillDepressions: state.futureFillDepressions.slice(),
      shelfTransitions: state.shelfTransitions.slice(),
      lowlandSystems: state.lowlandSystems.slice(),
      continentElevationProfiles: state.continentElevationProfiles.slice(),
      elevationBandDistribution: Object.assign({}, state.elevationBandDistribution),
      futureHydrationReadinessScore: state.futureHydrationReadinessScore,
      carrierVisualHintPacket: state.carrierVisualHintPacket,

      carrierPacket: buildCarrierElevationPacket(requester || "truth-packet", options || {}),
      receipt: status()
    });
  }

  function getCarrierElevationPacket(requester, options) {
    return buildCarrierElevationPacket(requester || "unknown", options || {});
  }

  function getWatershedPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      packetType: "optimized_dry_watershed_packet",
      requester: requester || "unknown",

      watershedBoundaries: state.watershedBoundaries.slice(),
      ridgeLines: state.ridgeLines.slice(),
      basinFloors: state.basinFloors.slice(),
      valleyCorridors: state.valleyCorridors.slice(),
      drainageGates: state.drainageGates.slice(),
      slopeVectors: state.slopeVectors.slice(),

      watershedSystemCount: state.watershedBoundaries.length,
      futureHydrationReadinessScore: state.futureHydrationReadinessScore,

      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    });
  }

  function getFutureFillPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      packetType: "optimized_dry_future_fill_packet",
      requester: requester || "unknown",

      futureFillDepressions: state.futureFillDepressions.slice(),
      basinFloors: state.basinFloors.slice(),
      lowlandSystems: state.lowlandSystems.slice(),
      drainageGates: state.drainageGates.slice(),
      shelfTransitions: state.shelfTransitions.slice(),

      futureHydrationReadinessScore: state.futureHydrationReadinessScore,
      futureFillOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    });
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,

      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,

      elevationNodeCount: state.elevationNodes.length,
      sourceSeatCount: SOURCE_SEAT_COUNT,
      elevationBandCount: state.elevationBands.length,

      summitZoneCount: state.summitZones.length,
      highlandZoneCount: state.highlandZones.length,
      ridgeLineCount: state.ridgeLines.length,
      basinFloorCount: state.basinFloors.length,
      valleyCorridorCount: state.valleyCorridors.length,
      slopeVectorCount: state.slopeVectors.length,
      watershedBoundaryCount: state.watershedBoundaries.length,
      drainageGateCount: state.drainageGates.length,
      futureFillDepressionCount: state.futureFillDepressions.length,
      shelfTransitionCount: state.shelfTransitions.length,
      lowlandSystemCount: state.lowlandSystems.length,

      continentElevationProfileCount: state.continentElevationProfiles.length,
      elevationBandDistribution: Object.assign({}, state.elevationBandDistribution),
      watershedSystemCount: state.watershedBoundaries.length,
      carrierVisualHintPacketReady: Boolean(state.carrierVisualHintPacket),
      futureHydrationReadinessScore: state.futureHydrationReadinessScore,

      hydrationHeld: true,
      hydrationActive: false,
      activeHydration: false,
      futureFillOnly: true,

      carrierMayConsume: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,
      finalVisualPassClaim: false,

      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_OPTIMAL_EXPRESSION_DEPLOY_MARKER_v1"
    });
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_ELEVATION_TRACK_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaElevationTrackChild = CONTRACT;
      document.documentElement.dataset.audraliaElevationTrackReady = String(state.elevationTrackReady);
      document.documentElement.dataset.audraliaElevationNodeCount = String(state.elevationNodes.length);
      document.documentElement.dataset.audraliaElevationRidgeLineCount = String(state.ridgeLines.length);
      document.documentElement.dataset.audraliaElevationBasinFloorCount = String(state.basinFloors.length);
      document.documentElement.dataset.audraliaElevationWatershedBoundaryCount = String(state.watershedBoundaries.length);
      document.documentElement.dataset.audraliaCarrierVisualHintPacketReady = String(Boolean(state.carrierVisualHintPacket));
      document.documentElement.dataset.audraliaElevationHydrationHeld = "true";
      document.documentElement.dataset.audraliaElevationActiveHydration = "false";
      document.documentElement.dataset.audraliaElevationChildDrawsVisuals = "false";
      document.documentElement.dataset.audraliaElevationFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function init() {
    rebuildElevationTrack();

    setTimeout(rebuildElevationTrack, 180);
    setTimeout(rebuildElevationTrack, 640);
    setTimeout(rebuildElevationTrack, 1200);
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    status: status,
    rebuildElevationTrack: rebuildElevationTrack,
    getElevationTrackPacket: getElevationTrackPacket,
    getCarrierElevationPacket: getCarrierElevationPacket,
    sampleElevationAt: sampleElevationAt,
    getWatershedPacket: getWatershedPacket,
    getFutureFillPacket: getFutureFillPacket
  });

  window.AUDRALIA_ELEVATION_TRACK_CHILD = API;
  window.AUDRALIA_PLANET_ELEVATION_TRACK_CHILD = API;
  window.AUDRALIA_G2_ELEVATION_TRACK_CHILD = API;

  init();
})();
