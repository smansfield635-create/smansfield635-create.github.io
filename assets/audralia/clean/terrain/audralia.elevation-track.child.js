// /assets/audralia/clean/terrain/audralia.elevation-track.child.js
// AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_TNT_v1
// Full-file downstream child creation.
// Scope: Audralia elevation-track truth.
// Purpose: publish elevation bands, slopes, ridges, basins, valleys, watersheds, drainage gates, and future-fill depressions.
// Does not own: runtime drawing, HTML load order, active hydration, oceans, rivers, lakes, beaches, cliffs, ecology, climate, technology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_TNT_v1";
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
    Object.freeze({ id: "abyssal_memory_floor", min: 0.00, max: 0.115, rank: 0 }),
    Object.freeze({ id: "future_fill_basin", min: 0.115, max: 0.235, rank: 1 }),
    Object.freeze({ id: "lowland", min: 0.235, max: 0.345, rank: 2 }),
    Object.freeze({ id: "shelf", min: 0.345, max: 0.455, rank: 3 }),
    Object.freeze({ id: "midland", min: 0.455, max: 0.595, rank: 4 }),
    Object.freeze({ id: "highland", min: 0.595, max: 0.735, rank: 5 }),
    Object.freeze({ id: "ridge", min: 0.735, max: 0.865, rank: 6 }),
    Object.freeze({ id: "summit", min: 0.865, max: 1.001, rank: 7 })
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
    elevationBands: [],
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

  function gridDistance(ax, ay, bx, by) {
    var dx = Math.abs(ax - bx);
    dx = Math.min(dx, RADIAL_NODES - dx);
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function normalizeX(value) {
    return ((Number(value || 0) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
  }

  function normalizeY(value) {
    return clamp(Number(value || 0), 0, FIBONACCI_BANDS - 1);
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + normalizeX(x) / RADIAL_NODES * 360,
      lat: 80 - normalizeY(y) / (FIBONACCI_BANDS - 1) * 160
    };
  }

  function cloneLeanNode(node) {
    return {
      nodeId: node.nodeId,
      sourceSeatIndex: node.sourceSeatIndex,
      x: node.x,
      y: node.y,
      continentId: node.continentId,
      regionRole: node.regionRole,
      elevation: node.elevation,
      elevationBand: node.elevationBand,
      slopeVector: node.slopeVector,
      slopeMagnitude: node.slopeMagnitude,
      watershedRole: node.watershedRole,
      futureFillEligible: node.futureFillEligible,
      futureFillPriority: node.futureFillPriority,
      drainageGateId: node.drainageGateId,
      carrierMayConsume: true,
      hydrationActive: false,
      finalVisualPassClaim: false
    };
  }

  function getNineContinentProfiles() {
    return Object.freeze([
      Object.freeze({
        continentId: "gratitude",
        continentName: "Gratitude",
        centerX: 4.65,
        centerY: 4.65,
        elevationTendency: "receiving_basins_protective_ridges_stable_shelves",
        weights: { receptivity: 1.0, continuity: 0.72, repair: 0.42, clarity: 0.22, discipline: 0.22, restraint: 0.18, timeDepth: 0.36, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "generosity",
        continentName: "Generosity",
        centerX: 10.9,
        centerY: 3.8,
        elevationTendency: "outward_slopes_branching_ridges_distributive_corridors",
        weights: { receptivity: 0.24, continuity: 0.48, repair: 0.20, clarity: 0.28, discipline: 0.32, restraint: 0.22, timeDepth: 0.28, expansion: 1.0 }
      }),
      Object.freeze({
        continentId: "dependability",
        continentName: "Dependability",
        centerX: 2.9,
        centerY: 8.1,
        elevationTendency: "stable_plateaus_durable_highlands_grounded_cratons",
        weights: { receptivity: 0.28, continuity: 1.0, repair: 0.22, clarity: 0.38, discipline: 0.54, restraint: 0.34, timeDepth: 0.52, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "accountability",
        continentName: "Accountability",
        centerX: 8.25,
        centerY: 7.35,
        elevationTendency: "ridge_boundaries_escarpments_watershed_divides",
        weights: { receptivity: 0.16, continuity: 0.44, repair: 0.18, clarity: 0.72, discipline: 1.0, restraint: 0.64, timeDepth: 0.30, expansion: 0.18 }
      }),
      Object.freeze({
        continentId: "forgiveness",
        continentName: "Forgiveness",
        centerX: 12.3,
        centerY: 8.9,
        elevationTendency: "repaired_valleys_sediment_basins_softened_lowlands",
        weights: { receptivity: 0.50, continuity: 0.46, repair: 1.0, clarity: 0.24, discipline: 0.24, restraint: 0.36, timeDepth: 0.58, expansion: 0.30 }
      }),
      Object.freeze({
        continentId: "humility",
        continentName: "Humility",
        centerX: 5.6,
        centerY: 12.0,
        elevationTendency: "lowland_depth_sheltered_basins_quiet_slopes",
        weights: { receptivity: 0.72, continuity: 0.48, repair: 0.62, clarity: 0.24, discipline: 0.18, restraint: 0.62, timeDepth: 0.72, expansion: 0.10 }
      }),
      Object.freeze({
        continentId: "self-control",
        continentName: "Self-Control",
        centerX: 10.25,
        centerY: 12.55,
        elevationTendency: "contained_channels_disciplined_trenches_restrained_ridges",
        weights: { receptivity: 0.18, continuity: 0.40, repair: 0.24, clarity: 0.40, discipline: 0.72, restraint: 1.0, timeDepth: 0.38, expansion: 0.12 }
      }),
      Object.freeze({
        continentId: "patience",
        continentName: "Patience",
        centerX: 13.7,
        centerY: 5.6,
        elevationTendency: "terraced_shelves_layered_plains_slow_transitions",
        weights: { receptivity: 0.46, continuity: 0.64, repair: 0.54, clarity: 0.34, discipline: 0.40, restraint: 0.48, timeDepth: 1.0, expansion: 0.22 }
      }),
      Object.freeze({
        continentId: "purity",
        continentName: "Purity",
        centerX: 7.9,
        centerY: 2.05,
        elevationTendency: "clear_highlands_summit_zones_clean_ridge_systems",
        weights: { receptivity: 0.18, continuity: 0.42, repair: 0.16, clarity: 1.0, discipline: 0.56, restraint: 0.44, timeDepth: 0.30, expansion: 0.18 }
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

  function nearestProfile(node, profiles) {
    var best = profiles[0];
    var bestScore = -Infinity;

    profiles.forEach(function (profile) {
      var distance = gridDistance(node.x, node.y, profile.centerX, profile.centerY);
      var closeness = 1 / (0.72 + distance);
      var regionBonus = String(node.regionSeed || "").toLowerCase() === profile.continentId ? 0.32 : 0;
      var pressureBonus =
        node.summitPressure * profile.weights.clarity * 0.07 +
        node.ridgePressure * profile.weights.discipline * 0.06 +
        node.basinPressure * profile.weights.receptivity * 0.06 +
        node.gapPressure * profile.weights.repair * 0.05;

      var score = closeness + regionBonus + pressureBonus;

      if (score > bestScore) {
        best = profile;
        bestScore = score;
      }
    });

    return best;
  }

  function neighborAverage(node, nodes) {
    var total = 0;
    var count = 0;

    nodes.forEach(function (other) {
      var d = gridDistance(node.x, node.y, other.x, other.y);
      if (d > 0 && d <= 2.25) {
        total += other.baseDryElevation;
        count += 1;
      }
    });

    return count ? total / count : node.baseDryElevation;
  }

  function calculateEthicalNarrativePressure(node, profile) {
    var weights = profile.weights;

    var receptivity = (node.basinPressure + node.gapPressure + node.valleyPressure + node.shelfPressure * 0.42) * weights.receptivity;
    var expansion = (node.ridgePressure * 0.34 + node.shelfPressure * 0.34 + Math.max(0, node.baseDryElevation - 0.45)) * weights.expansion;
    var continuity = (1 - Math.abs(node.baseDryElevation - 0.55) + node.ridgePressure * 0.24 + node.mountainPressure * 0.14) * weights.continuity;
    var discipline = (node.ridgePressure + node.escarpmentPressure + node.trenchPressure * 0.56) * weights.discipline;
    var repair = (node.formerHydrosphereCarvingValue + node.basinPressure * 0.46 + node.valleyPressure * 0.42 + node.gapPressure * 0.34) * weights.repair;
    var restraint = (node.trenchPressure + node.valleyPressure + node.escarpmentPressure * 0.38) * weights.restraint;
    var timeDepth = (node.shelfPressure + node.formerHydrosphereCarvingValue + node.basinPressure * 0.38) * weights.timeDepth;
    var clarity = (node.summitPressure + node.mountainPressure * 0.42 + node.ridgePressure * 0.26 - node.gapPressure * 0.12) * weights.clarity;

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

  function calculateNarrativeElevation(node, neighbors) {
    var profiles = getNineContinentProfiles();
    var profile = nearestProfile(node, profiles);
    var ethicalPressure = calculateEthicalNarrativePressure(node, profile);
    var neighborElevation = neighborAverage(node, neighbors);

    var elevation = node.baseDryElevation * 0.42 + neighborElevation * 0.18 + ethicalPressure * 0.22;

    elevation += node.summitPressure * 0.15;
    elevation += node.mountainPressure * 0.12;
    elevation += node.ridgePressure * 0.08;
    elevation += node.shelfPressure * 0.035;
    elevation -= node.basinPressure * 0.095;
    elevation -= node.valleyPressure * 0.070;
    elevation -= node.trenchPressure * 0.080;
    elevation -= node.gapPressure * 0.075;
    elevation -= node.formerHydrosphereCarvingValue * 0.045;

    if (profile.continentId === "gratitude") elevation += node.basinPressure * 0.035 - node.gapPressure * 0.030;
    if (profile.continentId === "generosity") elevation += node.ridgePressure * 0.050 + node.shelfPressure * 0.035;
    if (profile.continentId === "dependability") elevation += node.baseDryElevation > 0.48 ? 0.035 : 0;
    if (profile.continentId === "accountability") elevation += node.escarpmentPressure * 0.085 + node.ridgePressure * 0.045;
    if (profile.continentId === "forgiveness") elevation -= node.formerHydrosphereCarvingValue * 0.030;
    if (profile.continentId === "humility") elevation -= node.basinPressure * 0.080 + node.gapPressure * 0.045;
    if (profile.continentId === "self-control") elevation += node.trenchPressure * 0.038 + node.ridgePressure * 0.028;
    if (profile.continentId === "patience") elevation += node.shelfPressure * 0.060 + node.formerHydrosphereCarvingValue * 0.020;
    if (profile.continentId === "purity") elevation += node.summitPressure * 0.090 + node.mountainPressure * 0.045;

    elevation = clamp(elevation, 0.035, 0.965);

    return {
      profile: profile,
      ethicalNarrativePressure: round(ethicalPressure, 4),
      elevation: round(elevation, 4)
    };
  }

  function assignElevationBand(node) {
    if (node.summitPressure > 0.62 && node.elevation > 0.70) return "summit";
    if ((node.ridgePressure > 0.56 || node.escarpmentPressure > 0.55) && node.elevation > 0.57) return "ridge";
    if (node.futureFillEligible && node.elevation < 0.30) return "future_fill_basin";
    if (node.formerHydrosphereCarvingValue > 0.62 && node.elevation < 0.18) return "abyssal_memory_floor";

    for (var i = 0; i < ELEVATION_BANDS.length; i += 1) {
      var band = ELEVATION_BANDS[i];
      if (node.elevation >= band.min && node.elevation < band.max) return band.id;
    }

    return "midland";
  }

  function bandRank(bandId) {
    for (var i = 0; i < ELEVATION_BANDS.length; i += 1) {
      if (ELEVATION_BANDS[i].id === bandId) return ELEVATION_BANDS[i].rank;
    }
    return 4;
  }

  function inferRegionRole(source, elevationBand) {
    if (elevationBand === "summit") return "summit_zone";
    if (elevationBand === "ridge") return "watershed_divider";
    if (source.futureFillEligible || elevationBand === "future_fill_basin") return "future_fill_receiver";
    if (source.valleyPressure > 0.44 || source.trenchPressure > 0.44) return "valley_corridor";
    if (elevationBand === "shelf") return "shelf_transition";
    if (elevationBand === "lowland" || elevationBand === "abyssal_memory_floor") return "lowland_system";
    return "dry_land_body";
  }

  function buildElevationNodes(sourceNodes) {
    var nodes = [];

    sourceNodes.forEach(function (source, index) {
      var elevationData = calculateNarrativeElevation(source, sourceNodes);
      var node = {
        nodeId: "AUDRALIA-ELEVATION-NODE-" + String(index).padStart(3, "0"),
        sourceSeatIndex: source.sourceSeatIndex,
        sourceNodeId: source.sourceNodeId,
        x: source.x,
        y: source.y,
        lon: source.lon,
        lat: source.lat,

        continentId: elevationData.profile.continentId,
        continentName: elevationData.profile.continentName,
        regionRole: "pending",
        baseDryElevation: source.baseDryElevation,
        ethicalNarrativePressure: elevationData.ethicalNarrativePressure,
        elevation: elevationData.elevation,
        elevationBand: "pending",

        slopeVector: { dx: 0, dy: 0, direction: "flat", magnitude: 0 },
        slopeMagnitude: 0,

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
        hydrationActive: false,
        finalVisualPassClaim: false
      };

      node.elevationBand = assignElevationBand(node);
      node.regionRole = inferRegionRole(source, node.elevationBand);

      nodes.push(node);
    });

    calculateSlopeVectors(nodes);

    nodes.forEach(function (node) {
      node.watershedRole = inferWatershedRole(node);
      node.futureFillPriority = calculateFutureFillPriority(node);
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
      var magnitude = clamp(Math.sqrt(dx * dx + dy * dy), 0, 1);
      var direction = inferSlopeDirection(dx, dy);

      node.slopeVector = Object.freeze({
        dx: round(dx, 4),
        dy: round(dy, 4),
        direction: direction,
        magnitude: round(magnitude, 4)
      });
      node.slopeMagnitude = round(magnitude, 4);
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
    priority -= node.ridgePressure * 0.08;
    priority -= node.summitPressure * 0.12;

    return round(clamp(priority, 0, 1), 4);
  }

  function buildRidgeLines(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "ridge" ||
        node.elevationBand === "summit" ||
        node.ridgePressure > 0.54 ||
        node.escarpmentPressure > 0.56;
    }).map(function (node, index) {
      return Object.freeze({
        ridgeLineId: "AUDRALIA-RIDGE-LINE-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        elevationBand: node.elevationBand,
        ridgePressure: node.ridgePressure,
        escarpmentPressure: node.escarpmentPressure,
        watershedRole: node.watershedRole,
        hydrationActive: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildBasinFloors(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "future_fill_basin" ||
        node.elevationBand === "abyssal_memory_floor" ||
        node.basinPressure > 0.46 ||
        node.futureFillPriority > 0.58;
    }).map(function (node, index) {
      return Object.freeze({
        basinFloorId: "AUDRALIA-BASIN-FLOOR-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        elevationBand: node.elevationBand,
        basinPressure: node.basinPressure,
        futureFillPriority: node.futureFillPriority,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildValleyCorridors(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.valleyPressure > 0.38 ||
        node.trenchPressure > 0.36 ||
        node.watershedRole === "flow_corridor" ||
        (node.slopeMagnitude > 0.12 && node.futureFillPriority > 0.35);
    }).map(function (node, index) {
      return Object.freeze({
        valleyCorridorId: "AUDRALIA-VALLEY-CORRIDOR-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        slopeVector: node.slopeVector,
        valleyPressure: node.valleyPressure,
        trenchPressure: node.trenchPressure,
        futureFillPriority: node.futureFillPriority,
        flowDirection: node.slopeVector.direction,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildWatershedBoundaries(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.watershedRole === "watershed_divider" ||
        node.watershedRole === "source_peak" ||
        (node.elevation > 0.66 && node.ridgePressure > 0.38);
    }).map(function (node, index) {
      return Object.freeze({
        watershedId: "AUDRALIA-WATERSHED-" + String(index).padStart(3, "0"),
        boundaryNodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        ridgeBoundaryNodes: [node.nodeId],
        basinFloorNodes: nearestNodeIds(node, state.basinFloors, 3, "nodeId"),
        valleyCorridorNodes: nearestNodeIds(node, state.valleyCorridors, 3, "nodeId"),
        drainageGateNodes: [],
        futureFillPriority: node.futureFillPriority,
        flowDirection: node.slopeVector.direction,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildDrainageGates(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.futureFillPriority > 0.42 &&
        node.slopeMagnitude > 0.035 &&
        node.elevationBand !== "summit" &&
        node.elevationBand !== "ridge";
    }).map(function (node, index) {
      var id = "AUDRALIA-DRAINAGE-GATE-" + String(index).padStart(3, "0");

      return Object.freeze({
        drainageGateId: id,
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        slopeVector: node.slopeVector,
        flowDirection: node.slopeVector.direction,
        futureFillPriority: node.futureFillPriority,
        gateType: inferDrainageGateType(node),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function inferDrainageGateType(node) {
    if (node.trenchPressure > 0.46) return "trench_gate";
    if (node.valleyPressure > 0.44) return "valley_gate";
    if (node.basinPressure > 0.48) return "basin_gate";
    if (node.shelfPressure > 0.46) return "shelf_gate";
    return "dry_flow_gate";
  }

  function buildFutureFillDepressions(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.futureFillPriority > 0.38 ||
        node.futureFillEligible ||
        node.elevationBand === "future_fill_basin" ||
        node.elevationBand === "abyssal_memory_floor";
    }).map(function (node, index) {
      return Object.freeze({
        futureFillDepressionId: "AUDRALIA-FUTURE-FILL-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        elevationBand: node.elevationBand,
        futureFillPriority: node.futureFillPriority,
        depressionType: inferFutureFillType(node),
        futureFillOnly: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function inferFutureFillType(node) {
    if (node.elevationBand === "abyssal_memory_floor") return "future_inland_sea_candidate";
    if (node.trenchPressure > 0.44 || node.valleyPressure > 0.44) return "future_river_corridor_candidate";
    if (node.basinPressure > 0.46) return "future_lake_candidate";
    if (node.shelfPressure > 0.44) return "future_shelf_depression";
    return "future_fill_lowland";
  }

  function buildShelfTransitions(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "shelf" || node.shelfPressure > 0.42;
    }).map(function (node, index) {
      return Object.freeze({
        shelfTransitionId: "AUDRALIA-SHELF-TRANSITION-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        shelfPressure: node.shelfPressure,
        futureBeachCandidate: node.futureFillPriority > 0.32,
        edgeMaterialHeld: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildLowlandSystems(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "lowland" ||
        node.elevationBand === "future_fill_basin" ||
        node.elevationBand === "abyssal_memory_floor";
    }).map(function (node, index) {
      return Object.freeze({
        lowlandSystemId: "AUDRALIA-LOWLAND-SYSTEM-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        elevationBand: node.elevationBand,
        futureFillPriority: node.futureFillPriority,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function nearestNodeIds(origin, collection, limit, fieldName) {
    var items = collection.slice().map(function (item) {
      return {
        id: item[fieldName || "nodeId"],
        distance: gridDistance(origin.x, origin.y, item.x, item.y)
      };
    }).sort(function (a, b) {
      return a.distance - b.distance;
    });

    return items.slice(0, limit || 3).map(function (item) {
      return item.id;
    });
  }

  function buildHighlandZones(elevationNodes) {
    return elevationNodes.filter(function (node) {
      return node.elevationBand === "highland" ||
        node.elevationBand === "ridge" ||
        node.elevationBand === "summit";
    }).map(function (node, index) {
      return Object.freeze({
        highlandZoneId: "AUDRALIA-HIGHLAND-ZONE-" + String(index).padStart(3, "0"),
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        elevation: node.elevation,
        elevationBand: node.elevationBand,
        carrierMayConsume: true,
        hydrationActive: false,
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
        elevation: node.elevation,
        summitPressure: node.summitPressure,
        mountainPressure: node.mountainPressure,
        sourcePeak: true,
        hydrationActive: false,
        finalVisualPassClaim: false
      });
    });
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
    state.slopeVectors = state.elevationNodes.map(function (node) {
      return Object.freeze({
        nodeId: node.nodeId,
        x: node.x,
        y: node.y,
        continentId: node.continentId,
        slopeVector: node.slopeVector,
        slopeMagnitude: node.slopeMagnitude,
        flowDirection: node.slopeVector.direction,
        hydrationActive: false,
        finalVisualPassClaim: false
      });
    });
    state.watershedBoundaries = buildWatershedBoundaries(state.elevationNodes);
    state.drainageGates = buildDrainageGates(state.elevationNodes);
    state.futureFillDepressions = buildFutureFillDepressions(state.elevationNodes);
    state.shelfTransitions = buildShelfTransitions(state.elevationNodes);
    state.lowlandSystems = buildLowlandSystems(state.elevationNodes);

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
      elevation: round(elevation / total, 4),
      elevationBand: maxKey(bandScores),
      slopeMagnitude: round(slopeMagnitude / total, 4),
      futureFillPriority: round(futureFillPriority / total, 4),
      watershedRole: nearest.watershedRole,
      flowDirection: nearest.slopeVector.direction,
      elevationTrackReady: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function buildCarrierElevationPacket(options) {
    var opts = options || {};
    var compact = opts.compact === true;

    return Object.freeze({
      contract: CONTRACT,
      packetType: "carrier_safe_elevation_track_packet",
      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      carrierMayConsume: true,
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

      receipt: status()
    });
  }

  function getElevationTrackPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      packetType: "full_elevation_track_truth_packet",
      requester: requester || "unknown",
      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
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

      carrierPacket: buildCarrierElevationPacket(options || {}),
      receipt: status()
    });
  }

  function getCarrierElevationPacket(requester, options) {
    var packet = buildCarrierElevationPacket(options || {});
    packet.requester = requester || "unknown";
    return packet;
  }

  function getWatershedPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      packetType: "dry_watershed_packet",
      requester: requester || "unknown",
      watershedBoundaries: state.watershedBoundaries.slice(),
      ridgeLines: state.ridgeLines.slice(),
      basinFloors: state.basinFloors.slice(),
      valleyCorridors: state.valleyCorridors.slice(),
      drainageGates: state.drainageGates.slice(),
      slopeVectors: state.slopeVectors.slice(),
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    });
  }

  function getFutureFillPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      packetType: "dry_future_fill_packet",
      requester: requester || "unknown",
      futureFillDepressions: state.futureFillDepressions.slice(),
      basinFloors: state.basinFloors.slice(),
      lowlandSystems: state.lowlandSystems.slice(),
      drainageGates: state.drainageGates.slice(),
      shelfTransitions: state.shelfTransitions.slice(),
      futureFillOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    });
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      file: FILE,
      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValid: state.sourceTerrainValid,
      elevationTrackReady: state.elevationTrackReady,
      elevationNodeCount: state.elevationNodes.length,
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
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      carrierMayConsume: true,
      childDrawsVisuals: false,
      finalVisualPassClaim: false,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_DEPLOY_MARKER_v1"
    });
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_ELEVATION_TRACK_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaElevationTrackChild = CONTRACT;
      document.documentElement.dataset.audraliaElevationTrackReady = String(state.elevationTrackReady);
      document.documentElement.dataset.audraliaElevationHydrationHeld = "true";
      document.documentElement.dataset.audraliaElevationActiveHydration = "false";
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
