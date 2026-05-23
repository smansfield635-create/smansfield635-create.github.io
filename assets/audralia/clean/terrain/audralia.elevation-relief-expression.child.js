// /assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js
// AUDRALIA_ELEVATION_RELIEF_EXPRESSION_DIRECT_DOWNSTREAM_CHILD_TNT_v1
// Full-file creation.
// Scope: direct downstream relief-expression child.
// Parent: /assets/audralia/clean/terrain/audralia.elevation-track.child.js
// Purpose: consume optimized elevation-track truth and publish carrier-safe relief-expression packets.
// Does not own: dry terrain source, elevation-track parent truth, runtime carrier, HTML, active hydration, visual drawing, beaches, cliffs, climate, ecology, technology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_DIRECT_DOWNSTREAM_CHILD_TNT_v1";
  var PARENT_CONTRACT = "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD_OPTIMAL_EXPRESSION_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js";
  var REQUESTER = "audralia-elevation-relief-expression-child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var PARENT_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_TRACK_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_CHILD",
    "AUDRALIA_G2_ELEVATION_TRACK_CHILD"
  ]);

  var RELIEF_ROLES = Object.freeze({
    summit: "summit_exposure",
    ridge: "ridge_lift",
    highland: "highland_body",
    midland: "midland_continuity",
    shelf: "shelf_transition",
    lowland: "lowland_shadow",
    basin: "basin_depth",
    futureFill: "future_fill_depression",
    valley: "valley_direction",
    watershed: "watershed_divide"
  });

  var state = {
    parentApi: null,
    parentStatus: null,
    parentElevationPacket: null,
    parentCarrierPacket: null,

    parentElevationTrackDetected: false,
    parentElevationTrackReady: false,
    parentContractValid: false,
    parentSourceTerrainValid: false,
    parentCarrierMayConsume: false,
    parentChildDrawsVisuals: false,
    parentHydrationHeld: false,
    parentActiveHydration: false,
    parentFinalVisualPassClaim: false,

    reliefSamples: [],
    reliefGrid: [],

    ridgeReliefExpressions: [],
    basinDepthExpressions: [],
    valleyFlowExpressions: [],
    summitReliefExpressions: [],
    highlandReliefExpressions: [],
    lowlandReliefExpressions: [],
    shelfReliefExpressions: [],
    futureFillReliefExpressions: [],
    continentReliefProfiles: [],

    reliefHintPacket: null,
    carrierReliefPacket: null,

    reliefExpressionReady: false,
    directDownstreamFromElevationTrack: true,
    usesElevationTrackAsPrimarySource: true,
    usesDryTerrainAsPrimarySource: false,

    lastBuiltAt: null,
    errors: [],
    failureReason: "relief expression not built"
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

  function average(values) {
    if (!values || !values.length) return 0;
    return values.reduce(function (sum, value) {
      return sum + Number(value || 0);
    }, 0) / values.length;
  }

  function unique(values) {
    var seen = {};
    var output = [];

    (values || []).forEach(function (value) {
      if (value === undefined || value === null) return;
      var key = String(value);
      if (seen[key]) return;
      seen[key] = true;
      output.push(value);
    });

    return output;
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

  function byId(collection, field, id) {
    for (var i = 0; i < (collection || []).length; i += 1) {
      if (collection[i] && collection[i][field] === id) return collection[i];
    }
    return null;
  }

  function nodeById(nodeId) {
    return byId(state.parentElevationPacket && state.parentElevationPacket.elevationNodes || [], "nodeId", nodeId);
  }

  function nodesFromIds(nodeIds) {
    return (nodeIds || []).map(function (id) {
      return nodeById(id);
    }).filter(Boolean);
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

  function detectParentElevationTrack() {
    var api = firstGlobal(PARENT_GLOBALS);

    state.parentApi = api;
    state.parentStatus = null;
    state.parentElevationPacket = null;
    state.parentCarrierPacket = null;

    state.parentElevationTrackDetected = Boolean(api);
    state.parentElevationTrackReady = false;
    state.parentContractValid = false;
    state.parentSourceTerrainValid = false;
    state.parentCarrierMayConsume = false;
    state.parentChildDrawsVisuals = false;
    state.parentHydrationHeld = false;
    state.parentActiveHydration = false;
    state.parentFinalVisualPassClaim = false;

    if (!api) {
      state.failureReason = "parent elevation-track child missing";
      return false;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getElevationTrackPacket !== "function" ||
      typeof api.getCarrierElevationPacket !== "function" ||
      typeof api.sampleElevationAt !== "function"
    ) {
      state.failureReason = "parent elevation-track API incomplete";
      return false;
    }

    state.parentStatus = safeCall("parentElevationTrack", api, "status");

    state.parentContractValid = Boolean(
      state.parentStatus &&
      state.parentStatus.contract === PARENT_CONTRACT
    );

    state.parentElevationTrackReady = Boolean(
      state.parentStatus &&
      state.parentStatus.elevationTrackReady === true
    );

    state.parentSourceTerrainValid = Boolean(
      state.parentStatus &&
      state.parentStatus.sourceTerrainValid === true
    );

    state.parentCarrierMayConsume = Boolean(
      state.parentStatus &&
      state.parentStatus.carrierMayConsume === true
    );

    state.parentChildDrawsVisuals = Boolean(
      state.parentStatus &&
      state.parentStatus.childDrawsVisuals === true
    );

    state.parentHydrationHeld = Boolean(
      state.parentStatus &&
      state.parentStatus.hydrationHeld === true
    );

    state.parentActiveHydration = Boolean(
      state.parentStatus &&
      state.parentStatus.activeHydration === true
    );

    state.parentFinalVisualPassClaim = Boolean(
      state.parentStatus &&
      state.parentStatus.finalVisualPassClaim === true
    );

    if (!state.parentContractValid) {
      state.failureReason = "parent contract mismatch";
      return false;
    }

    if (!state.parentElevationTrackReady || !state.parentSourceTerrainValid || !state.parentCarrierMayConsume) {
      state.failureReason = "parent elevation-track unready";
      return false;
    }

    if (state.parentChildDrawsVisuals || !state.parentHydrationHeld || state.parentActiveHydration || state.parentFinalVisualPassClaim) {
      state.failureReason = "parent elevation-track unsafe";
      return false;
    }

    return true;
  }

  function loadParentPackets() {
    if (!detectParentElevationTrack()) return false;

    state.parentElevationPacket = safeCall(
      "parentElevationTrack",
      state.parentApi,
      "getElevationTrackPacket",
      REQUESTER,
      { compact: false }
    );

    state.parentCarrierPacket = safeCall(
      "parentElevationTrack",
      state.parentApi,
      "getCarrierElevationPacket",
      REQUESTER,
      { compact: false }
    );

    if (!validateParentPacket(state.parentElevationPacket)) {
      state.failureReason = "parent elevation packet malformed";
      return false;
    }

    if (!validateParentCarrierPacket(state.parentCarrierPacket)) {
      state.failureReason = "parent carrier elevation packet malformed";
      return false;
    }

    return true;
  }

  function validateParentPacket(packet) {
    return Boolean(
      packet &&
      packet.contract === PARENT_CONTRACT &&
      packet.elevationTrackReady === true &&
      packet.sourceTerrainValid === true &&
      packet.hydrationHeld === true &&
      packet.activeHydration === false &&
      packet.childDrawsVisuals === false &&
      packet.finalVisualPassClaim === false &&
      Array.isArray(packet.elevationNodes) &&
      Array.isArray(packet.ridgeLines) &&
      Array.isArray(packet.basinFloors) &&
      Array.isArray(packet.valleyCorridors) &&
      Array.isArray(packet.futureFillDepressions) &&
      Array.isArray(packet.continentElevationProfiles)
    );
  }

  function validateParentCarrierPacket(packet) {
    return Boolean(
      packet &&
      packet.contract === PARENT_CONTRACT &&
      packet.elevationTrackReady === true &&
      packet.carrierMayConsume === true &&
      packet.carrierShouldNotOwnElevationTruth === true &&
      packet.hydrationHeld === true &&
      packet.activeHydration === false &&
      packet.finalVisualPassClaim === false
    );
  }

  function reliefRoleForNode(node) {
    var band = String(node.elevationBand || "");
    var watershed = String(node.watershedRole || "");

    if (band === "summit") return RELIEF_ROLES.summit;
    if (band === "ridge" || watershed.indexOf("divider") >= 0) return RELIEF_ROLES.ridge;
    if (band === "highland") return RELIEF_ROLES.highland;
    if (band === "shelf") return RELIEF_ROLES.shelf;
    if (band === "lowland") return RELIEF_ROLES.lowland;
    if (band === "future_fill_basin" || band === "abyssal_memory_floor") return RELIEF_ROLES.futureFill;
    if (watershed.indexOf("corridor") >= 0) return RELIEF_ROLES.valley;
    if (watershed.indexOf("receiver") >= 0) return RELIEF_ROLES.basin;
    return RELIEF_ROLES.midland;
  }

  function calculateReliefSample(node) {
    var elevation = clamp(Number(node.elevation || 0.5), 0, 1);
    var slope = clamp(Number(node.slopeMagnitude || 0), 0, 1);
    var continuity = clamp(Number(node.localContinuity || 0), 0, 1);
    var flowConfidence = clamp(Number(node.flowConfidence || 0), 0, 1);
    var futureFill = clamp(Number(node.futureFillPriority || 0), 0, 1);
    var rank = bandRank(node.elevationBand);

    var ridgeHighlight = clamp(
      (node.elevationBand === "ridge" ? 0.38 : 0) +
      (node.elevationBand === "summit" ? 0.42 : 0) +
      Number(node.ridgePressure || 0) * 0.22 +
      Number(node.escarpmentPressure || 0) * 0.18 +
      slope * 0.22,
      0,
      1
    );

    var basinShadow = clamp(
      (node.elevationBand === "future_fill_basin" ? 0.34 : 0) +
      (node.elevationBand === "abyssal_memory_floor" ? 0.52 : 0) +
      Number(node.basinPressure || 0) * 0.24 +
      Number(node.gapPressure || 0) * 0.18 +
      futureFill * 0.24,
      0,
      1
    );

    var valleyDirectionality = clamp(
      Number(node.valleyPressure || 0) * 0.34 +
      Number(node.trenchPressure || 0) * 0.28 +
      flowConfidence * 0.24 +
      slope * 0.14,
      0,
      1
    );

    var summitEmphasis = clamp(
      (node.elevationBand === "summit" ? 0.52 : 0) +
      Number(node.summitPressure || 0) * 0.30 +
      Number(node.mountainPressure || 0) * 0.18,
      0,
      1
    );

    var shelfTransitionStrength = clamp(
      (node.elevationBand === "shelf" ? 0.38 : 0) +
      Number(node.shelfPressure || 0) * 0.36 +
      continuity * 0.12 +
      futureFill * 0.14,
      0,
      1
    );

    var reliefIntensity = clamp(
      elevation * 0.18 +
      slope * 0.22 +
      ridgeHighlight * 0.20 +
      summitEmphasis * 0.16 +
      valleyDirectionality * 0.10 +
      continuity * 0.08 +
      rank / 7 * 0.06,
      0,
      1
    );

    var shadeBias = clamp(
      reliefIntensity * 0.42 +
      ridgeHighlight * 0.18 +
      summitEmphasis * 0.14 -
      basinShadow * 0.12,
      -0.25,
      1
    );

    var dryDepthBias = clamp(
      basinShadow * 0.42 +
      futureFill * 0.28 +
      (1 - elevation) * 0.18 +
      valleyDirectionality * 0.12,
      0,
      1
    );

    return Object.freeze({
      sampleId: "AUDRALIA-RELIEF-SAMPLE-" + String(node.sourceSeatIndex || node.nodeId).replace(/\D+/g, "").padStart(3, "0"),
      parentNodeId: node.nodeId,
      x: node.x,
      y: node.y,
      continentId: node.continentId,
      continentName: node.continentName,
      elevation: round(elevation, 4),
      elevationBand: node.elevationBand,
      slopeMagnitude: round(slope, 4),
      localContinuity: round(continuity, 4),
      flowConfidence: round(flowConfidence, 4),
      futureFillPriority: round(futureFill, 4),
      watershedRole: node.watershedRole,

      reliefIntensity: round(reliefIntensity, 4),
      shadeBias: round(shadeBias, 4),
      dryDepthBias: round(dryDepthBias, 4),
      ridgeHighlight: round(ridgeHighlight, 4),
      basinShadow: round(basinShadow, 4),
      valleyDirectionality: round(valleyDirectionality, 4),
      summitEmphasis: round(summitEmphasis, 4),
      shelfTransitionStrength: round(shelfTransitionStrength, 4),

      carrierVisualRole: reliefRoleForNode(node),
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false
    });
  }

  function bandRank(bandId) {
    var ranks = {
      abyssal_memory_floor: 0,
      future_fill_basin: 1,
      lowland: 2,
      shelf: 3,
      midland: 4,
      highland: 5,
      ridge: 6,
      summit: 7
    };

    return ranks[bandId] === undefined ? 4 : ranks[bandId];
  }

  function buildReliefSamples() {
    var nodes = state.parentElevationPacket.elevationNodes || [];
    var samples = nodes.map(calculateReliefSample);

    var grid = [];
    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      grid[y] = [];
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        grid[y][x] = null;
      }
    }

    samples.forEach(function (sample) {
      var x = Math.round(normalizeX(sample.x));
      var y = Math.round(normalizeY(sample.y));
      grid[y][x] = sample;
    });

    state.reliefGrid = grid;

    return Object.freeze(samples);
  }

  function aggregateSamples(nodeIds) {
    var samples = (nodeIds || []).map(function (nodeId) {
      return state.reliefSamples.find(function (sample) {
        return sample.parentNodeId === nodeId;
      });
    }).filter(Boolean);

    return {
      samples: samples,
      avgRelief: average(samples.map(function (sample) { return sample.reliefIntensity; })),
      avgShade: average(samples.map(function (sample) { return sample.shadeBias; })),
      avgDepth: average(samples.map(function (sample) { return sample.dryDepthBias; })),
      avgRidge: average(samples.map(function (sample) { return sample.ridgeHighlight; })),
      avgBasin: average(samples.map(function (sample) { return sample.basinShadow; })),
      avgValley: average(samples.map(function (sample) { return sample.valleyDirectionality; })),
      avgSummit: average(samples.map(function (sample) { return sample.summitEmphasis; })),
      avgShelf: average(samples.map(function (sample) { return sample.shelfTransitionStrength; })),
      avgFuture: average(samples.map(function (sample) { return sample.futureFillPriority; }))
    };
  }

  function buildRidgeReliefExpressions() {
    return (state.parentElevationPacket.ridgeLines || []).map(function (ridge, index) {
      var aggregate = aggregateSamples(ridge.nodeIds || []);
      var ridgeReliefStrength = clamp(
        aggregate.avgRidge * 0.42 +
        aggregate.avgRelief * 0.30 +
        Number(ridge.watershedDivideStrength || 0) * 0.20 +
        Number(ridge.ridgeContinuity || 0) * 0.08,
        0,
        1
      );

      return Object.freeze({
        ridgeReliefExpressionId: "AUDRALIA-RIDGE-RELIEF-" + String(index).padStart(3, "0"),
        parentRidgeLineId: ridge.ridgeLineId,
        continentId: ridge.continentId,
        continentName: ridge.continentName,
        ridgeType: ridge.ridgeType,
        nodeIds: (ridge.nodeIds || []).slice(),
        reliefIntensity: round(aggregate.avgRelief, 4),
        ridgeReliefStrength: round(ridgeReliefStrength, 4),
        shadeBias: round(aggregate.avgShade, 4),
        ridgeHighlight: round(aggregate.avgRidge, 4),
        watershedDivideStrength: round(Number(ridge.watershedDivideStrength || 0), 4),
        carrierVisualRole: RELIEF_ROLES.ridge,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildBasinDepthExpressions() {
    return (state.parentElevationPacket.basinFloors || []).map(function (basin, index) {
      var aggregate = aggregateSamples(basin.nodeIds || []);
      var basinDepthStrength = clamp(
        aggregate.avgBasin * 0.44 +
        aggregate.avgDepth * 0.26 +
        Number(basin.receivingStrength || 0) * 0.20 +
        Number(basin.futureFillPriority || 0) * 0.10,
        0,
        1
      );

      return Object.freeze({
        basinDepthExpressionId: "AUDRALIA-BASIN-DEPTH-" + String(index).padStart(3, "0"),
        parentBasinFloorId: basin.basinFloorId,
        continentId: basin.continentId,
        continentName: basin.continentName,
        basinType: basin.basinType,
        nodeIds: (basin.nodeIds || []).slice(),
        lowestNodeId: basin.lowestNodeId,
        reliefIntensity: round(aggregate.avgRelief, 4),
        basinDepthStrength: round(basinDepthStrength, 4),
        basinShadow: round(aggregate.avgBasin, 4),
        dryDepthBias: round(aggregate.avgDepth, 4),
        futureFillPriority: round(Number(basin.futureFillPriority || aggregate.avgFuture || 0), 4),
        receivingStrength: round(Number(basin.receivingStrength || 0), 4),
        carrierVisualRole: RELIEF_ROLES.basin,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });
  }

  function buildValleyFlowExpressions() {
    return (state.parentElevationPacket.valleyCorridors || []).map(function (valley, index) {
      var aggregate = aggregateSamples(valley.nodeIds || []);
      var flowReliefStrength = clamp(
        aggregate.avgValley * 0.40 +
        Number(valley.averageSlope || 0) * 0.24 +
        Number(valley.continuity || 0) * 0.18 +
        (valley.futureRiverCandidate ? 0.18 : 0),
        0,
        1
      );

      return Object.freeze({
        valleyFlowExpressionId: "AUDRALIA-VALLEY-FLOW-" + String(index).padStart(3, "0"),
        parentValleyCorridorId: valley.valleyCorridorId,
        continentId: valley.continentId,
        continentName: valley.continentName,
        corridorType: valley.corridorType,
        nodeIds: (valley.nodeIds || []).slice(),
        fromHighNodeId: valley.fromHighNodeId,
        toLowNodeId: valley.toLowNodeId,
        flowDirection: valley.flowDirection,
        reliefIntensity: round(aggregate.avgRelief, 4),
        valleyDirectionality: round(aggregate.avgValley, 4),
        flowReliefStrength: round(flowReliefStrength, 4),
        futureRiverCandidate: Boolean(valley.futureRiverCandidate),
        carrierVisualRole: RELIEF_ROLES.valley,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });
  }

  function buildSummitReliefExpressions() {
    return (state.parentElevationPacket.summitZones || []).map(function (summit, index) {
      var aggregate = aggregateSamples([summit.nodeId]);
      var summitStrength = clamp(
        aggregate.avgSummit * 0.46 +
        aggregate.avgRidge * 0.18 +
        Number(summit.elevation || 0) * 0.24 +
        Number(summit.summitPressure || 0) * 0.12,
        0,
        1
      );

      return Object.freeze({
        summitReliefExpressionId: "AUDRALIA-SUMMIT-RELIEF-" + String(index).padStart(3, "0"),
        parentSummitZoneId: summit.summitZoneId,
        nodeId: summit.nodeId,
        continentId: summit.continentId,
        continentName: summit.continentName,
        elevation: summit.elevation,
        summitStrength: round(summitStrength, 4),
        reliefIntensity: round(aggregate.avgRelief, 4),
        summitEmphasis: round(aggregate.avgSummit, 4),
        carrierVisualRole: RELIEF_ROLES.summit,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildHighlandReliefExpressions() {
    return (state.parentElevationPacket.highlandZones || []).map(function (zone, index) {
      var aggregate = aggregateSamples(zone.nodeIds || []);

      return Object.freeze({
        highlandReliefExpressionId: "AUDRALIA-HIGHLAND-RELIEF-" + String(index).padStart(3, "0"),
        parentHighlandZoneId: zone.highlandZoneId,
        continentId: zone.continentId,
        continentName: zone.continentName,
        nodeIds: (zone.nodeIds || []).slice(),
        highestNodeId: zone.highestNodeId,
        dominantElevationBand: zone.dominantElevationBand,
        highlandReliefStrength: round(clamp(aggregate.avgRelief * 0.58 + aggregate.avgRidge * 0.18 + Number(zone.averageElevation || 0) * 0.24, 0, 1), 4),
        shadeBias: round(aggregate.avgShade, 4),
        carrierVisualRole: RELIEF_ROLES.highland,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildLowlandReliefExpressions() {
    return (state.parentElevationPacket.lowlandSystems || []).map(function (system, index) {
      var aggregate = aggregateSamples(system.nodeIds || []);

      return Object.freeze({
        lowlandReliefExpressionId: "AUDRALIA-LOWLAND-RELIEF-" + String(index).padStart(3, "0"),
        parentLowlandSystemId: system.lowlandSystemId,
        continentId: system.continentId,
        continentName: system.continentName,
        nodeIds: (system.nodeIds || []).slice(),
        lowestNodeId: system.lowestNodeId,
        dominantElevationBand: system.dominantElevationBand,
        lowlandDepthStrength: round(clamp(aggregate.avgDepth * 0.54 + aggregate.avgBasin * 0.22 + Number(system.futureFillPriority || 0) * 0.24, 0, 1), 4),
        dryDepthBias: round(aggregate.avgDepth, 4),
        carrierVisualRole: RELIEF_ROLES.lowland,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });
  }

  function buildShelfReliefExpressions() {
    return (state.parentElevationPacket.shelfTransitions || []).map(function (shelf, index) {
      var aggregate = aggregateSamples(shelf.nodeIds || []);

      return Object.freeze({
        shelfReliefExpressionId: "AUDRALIA-SHELF-RELIEF-" + String(index).padStart(3, "0"),
        parentShelfTransitionId: shelf.shelfTransitionId,
        continentId: shelf.continentId,
        continentName: shelf.continentName,
        nodeIds: (shelf.nodeIds || []).slice(),
        shelfTransitionStrength: round(clamp(aggregate.avgShelf * 0.52 + Number(shelf.shelfPressure || 0) * 0.28 + (shelf.futureBeachCandidate ? 0.20 : 0), 0, 1), 4),
        futureBeachCandidate: Boolean(shelf.futureBeachCandidate),
        edgeMaterialHeld: true,
        carrierVisualRole: RELIEF_ROLES.shelf,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });
  }

  function buildFutureFillReliefExpressions() {
    return (state.parentElevationPacket.futureFillDepressions || []).map(function (depression, index) {
      var aggregate = aggregateSamples(depression.nodeIds || []);

      return Object.freeze({
        futureFillReliefExpressionId: "AUDRALIA-FUTURE-FILL-RELIEF-" + String(index).padStart(3, "0"),
        parentFutureFillDepressionId: depression.futureFillDepressionId,
        continentId: depression.continentId,
        continentName: depression.continentName,
        depressionType: depression.depressionType,
        nodeIds: (depression.nodeIds || []).slice(),
        lowestNodeId: depression.lowestNodeId,
        candidateHydrationType: depression.candidateHydrationType,
        futureFillReliefStrength: round(clamp(aggregate.avgDepth * 0.42 + aggregate.avgBasin * 0.28 + Number(depression.futureFillPriority || 0) * 0.30, 0, 1), 4),
        dryDepthBias: round(aggregate.avgDepth, 4),
        futureFillPriority: round(Number(depression.futureFillPriority || 0), 4),
        receivingStrength: round(Number(depression.receivingStrength || 0), 4),
        carrierVisualRole: RELIEF_ROLES.futureFill,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    });
  }

  function buildContinentReliefProfiles() {
    var parentProfiles = state.parentElevationPacket.continentElevationProfiles || [];

    return parentProfiles.map(function (profile) {
      var samples = state.reliefSamples.filter(function (sample) {
        return sample.continentId === profile.continentId;
      });

      var roles = {};
      samples.forEach(function (sample) {
        roles[sample.carrierVisualRole] = (roles[sample.carrierVisualRole] || 0) + sample.reliefIntensity;
      });

      var ridgeStrength = average(state.ridgeReliefExpressions.filter(function (item) {
        return item.continentId === profile.continentId;
      }).map(function (item) { return item.ridgeReliefStrength; }));

      var basinStrength = average(state.basinDepthExpressions.filter(function (item) {
        return item.continentId === profile.continentId;
      }).map(function (item) { return item.basinDepthStrength; }));

      var valleyStrength = average(state.valleyFlowExpressions.filter(function (item) {
        return item.continentId === profile.continentId;
      }).map(function (item) { return item.flowReliefStrength; }));

      var summitStrength = average(state.summitReliefExpressions.filter(function (item) {
        return item.continentId === profile.continentId;
      }).map(function (item) { return item.summitStrength; }));

      var futureFillStrength = average(state.futureFillReliefExpressions.filter(function (item) {
        return item.continentId === profile.continentId;
      }).map(function (item) { return item.futureFillReliefStrength; }));

      var averageReliefIntensity = average(samples.map(function (sample) {
        return sample.reliefIntensity;
      }));

      var carrierHintStrength = clamp(
        ridgeStrength * 0.18 +
        basinStrength * 0.18 +
        valleyStrength * 0.16 +
        summitStrength * 0.16 +
        futureFillStrength * 0.16 +
        averageReliefIntensity * 0.16,
        0,
        1
      );

      return Object.freeze({
        continentId: profile.continentId,
        continentName: profile.continentName,
        parentElevationTendency: profile.elevationTendency,
        dominantReliefRole: maxKey(roles) || RELIEF_ROLES.midland,
        averageReliefIntensity: round(averageReliefIntensity, 4),
        ridgeExpressionStrength: round(ridgeStrength, 4),
        basinExpressionStrength: round(basinStrength, 4),
        valleyExpressionStrength: round(valleyStrength, 4),
        summitExpressionStrength: round(summitStrength, 4),
        futureFillExpressionStrength: round(futureFillStrength, 4),
        carrierVisualHintStrength: round(carrierHintStrength, 4),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });
  }

  function buildReliefHintPacket() {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "relief_hint_packet",
      directDownstreamFromElevationTrack: true,
      usesElevationTrackAsPrimarySource: true,
      usesDryTerrainAsPrimarySource: false,
      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      ridgeHints: state.ridgeReliefExpressions.slice(),
      basinHints: state.basinDepthExpressions.slice(),
      valleyHints: state.valleyFlowExpressions.slice(),
      summitHints: state.summitReliefExpressions.slice(),
      highlandHints: state.highlandReliefExpressions.slice(),
      lowlandHints: state.lowlandReliefExpressions.slice(),
      shelfHints: state.shelfReliefExpressions.slice(),
      futureFillHints: state.futureFillReliefExpressions.slice(),
      continentReliefProfiles: state.continentReliefProfiles.slice()
    });
  }

  function buildCarrierReliefPacket(requester, options) {
    var opts = options || {};
    var compact = opts.compact === true;

    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "carrier_safe_relief_expression_packet",
      requester: requester || "unknown",

      parentElevationTrackDetected: state.parentElevationTrackDetected,
      parentElevationTrackReady: state.parentElevationTrackReady,
      reliefExpressionReady: state.reliefExpressionReady,

      directDownstreamFromElevationTrack: true,
      usesElevationTrackAsPrimarySource: true,
      usesDryTerrainAsPrimarySource: false,

      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      reliefSamples: compact ? state.reliefSamples.map(compactReliefSample) : state.reliefSamples.slice(),
      ridgeReliefExpressions: state.ridgeReliefExpressions.slice(),
      basinDepthExpressions: state.basinDepthExpressions.slice(),
      valleyFlowExpressions: state.valleyFlowExpressions.slice(),
      summitReliefExpressions: state.summitReliefExpressions.slice(),
      highlandReliefExpressions: state.highlandReliefExpressions.slice(),
      lowlandReliefExpressions: state.lowlandReliefExpressions.slice(),
      shelfReliefExpressions: state.shelfReliefExpressions.slice(),
      futureFillReliefExpressions: state.futureFillReliefExpressions.slice(),
      continentReliefProfiles: state.continentReliefProfiles.slice(),
      reliefHintPacket: state.reliefHintPacket,

      receipt: status()
    });
  }

  function compactReliefSample(sample) {
    return {
      sampleId: sample.sampleId,
      parentNodeId: sample.parentNodeId,
      x: sample.x,
      y: sample.y,
      continentId: sample.continentId,
      elevation: sample.elevation,
      elevationBand: sample.elevationBand,
      reliefIntensity: sample.reliefIntensity,
      shadeBias: sample.shadeBias,
      dryDepthBias: sample.dryDepthBias,
      ridgeHighlight: sample.ridgeHighlight,
      basinShadow: sample.basinShadow,
      valleyDirectionality: sample.valleyDirectionality,
      summitEmphasis: sample.summitEmphasis,
      shelfTransitionStrength: sample.shelfTransitionStrength,
      carrierVisualRole: sample.carrierVisualRole,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function rebuildReliefExpression() {
    if (!loadParentPackets()) {
      clearReliefExpression();
      publishStatus();
      return false;
    }

    state.reliefSamples = buildReliefSamples();
    state.ridgeReliefExpressions = buildRidgeReliefExpressions();
    state.basinDepthExpressions = buildBasinDepthExpressions();
    state.valleyFlowExpressions = buildValleyFlowExpressions();
    state.summitReliefExpressions = buildSummitReliefExpressions();
    state.highlandReliefExpressions = buildHighlandReliefExpressions();
    state.lowlandReliefExpressions = buildLowlandReliefExpressions();
    state.shelfReliefExpressions = buildShelfReliefExpressions();
    state.futureFillReliefExpressions = buildFutureFillReliefExpressions();
    state.continentReliefProfiles = buildContinentReliefProfiles();
    state.reliefHintPacket = buildReliefHintPacket();
    state.carrierReliefPacket = buildCarrierReliefPacket("internal", { compact: false });

    state.reliefExpressionReady = state.reliefSamples.length > 0;
    state.failureReason = state.reliefExpressionReady ? "" : "relief samples empty";
    state.lastBuiltAt = new Date().toISOString();

    publishStatus();
    return state.reliefExpressionReady;
  }

  function clearReliefExpression() {
    state.reliefSamples = [];
    state.reliefGrid = [];
    state.ridgeReliefExpressions = [];
    state.basinDepthExpressions = [];
    state.valleyFlowExpressions = [];
    state.summitReliefExpressions = [];
    state.highlandReliefExpressions = [];
    state.lowlandReliefExpressions = [];
    state.shelfReliefExpressions = [];
    state.futureFillReliefExpressions = [];
    state.continentReliefProfiles = [];
    state.reliefHintPacket = null;
    state.carrierReliefPacket = null;
    state.reliefExpressionReady = false;
    state.lastBuiltAt = new Date().toISOString();
  }

  function sampleReliefAt(x, y, options) {
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

    if (!state.reliefExpressionReady) {
      return {
        x: sx,
        y: sy,
        reliefExpressionReady: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    var total = 0;
    var fields = {
      reliefIntensity: 0,
      shadeBias: 0,
      dryDepthBias: 0,
      ridgeHighlight: 0,
      basinShadow: 0,
      valleyDirectionality: 0,
      summitEmphasis: 0,
      shelfTransitionStrength: 0,
      futureFillPriority: 0
    };
    var roleScores = {};
    var continentScores = {};
    var nearest = null;
    var nearestDistance = Infinity;

    state.reliefSamples.forEach(function (sample) {
      var d = gridDistance(sx, sy, sample.x, sample.y);
      if (d > 2.8) return;

      var weight = 1 / Math.pow(0.40 + d, 2.08);
      total += weight;

      Object.keys(fields).forEach(function (key) {
        fields[key] += Number(sample[key] || 0) * weight;
      });

      roleScores[sample.carrierVisualRole] = (roleScores[sample.carrierVisualRole] || 0) + weight;
      continentScores[sample.continentId] = (continentScores[sample.continentId] || 0) + weight;

      if (d < nearestDistance) {
        nearest = sample;
        nearestDistance = d;
      }
    });

    if (!total || !nearest) {
      return {
        x: sx,
        y: sy,
        reliefExpressionReady: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    Object.keys(fields).forEach(function (key) {
      fields[key] = round(fields[key] / total, 4);
    });

    return {
      x: round(sx, 4),
      y: round(sy, 4),
      nearestReliefSampleId: nearest.sampleId,
      parentNodeId: nearest.parentNodeId,
      continentId: maxKey(continentScores),
      continentName: nearest.continentName,
      carrierVisualRole: maxKey(roleScores),
      reliefIntensity: fields.reliefIntensity,
      shadeBias: fields.shadeBias,
      dryDepthBias: fields.dryDepthBias,
      ridgeHighlight: fields.ridgeHighlight,
      basinShadow: fields.basinShadow,
      valleyDirectionality: fields.valleyDirectionality,
      summitEmphasis: fields.summitEmphasis,
      shelfTransitionStrength: fields.shelfTransitionStrength,
      futureFillPriority: fields.futureFillPriority,
      reliefExpressionReady: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function getReliefExpressionPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "full_relief_expression_packet",
      requester: requester || "unknown",

      parentElevationTrackDetected: state.parentElevationTrackDetected,
      parentElevationTrackReady: state.parentElevationTrackReady,
      reliefExpressionReady: state.reliefExpressionReady,

      directDownstreamFromElevationTrack: true,
      usesElevationTrackAsPrimarySource: true,
      usesDryTerrainAsPrimarySource: false,

      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      reliefSamples: state.reliefSamples.slice(),
      ridgeReliefExpressions: state.ridgeReliefExpressions.slice(),
      basinDepthExpressions: state.basinDepthExpressions.slice(),
      valleyFlowExpressions: state.valleyFlowExpressions.slice(),
      summitReliefExpressions: state.summitReliefExpressions.slice(),
      highlandReliefExpressions: state.highlandReliefExpressions.slice(),
      lowlandReliefExpressions: state.lowlandReliefExpressions.slice(),
      shelfReliefExpressions: state.shelfReliefExpressions.slice(),
      futureFillReliefExpressions: state.futureFillReliefExpressions.slice(),
      continentReliefProfiles: state.continentReliefProfiles.slice(),
      reliefHintPacket: state.reliefHintPacket,
      carrierPacket: buildCarrierReliefPacket(requester || "relief-expression", options || {}),
      receipt: status()
    });
  }

  function getCarrierReliefPacket(requester, options) {
    return buildCarrierReliefPacket(requester || "unknown", options || {});
  }

  function getReliefHintPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "public_relief_hint_packet",
      requester: requester || "unknown",
      reliefExpressionReady: state.reliefExpressionReady,
      reliefHintPacket: state.reliefHintPacket,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,
      receipt: status()
    });
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      file: FILE,

      parentElevationTrackDetected: state.parentElevationTrackDetected,
      parentElevationTrackReady: state.parentElevationTrackReady,
      parentContractValid: state.parentContractValid,
      parentSourceTerrainValid: state.parentSourceTerrainValid,

      reliefExpressionReady: state.reliefExpressionReady,
      directDownstreamFromElevationTrack: true,
      usesElevationTrackAsPrimarySource: true,
      usesDryTerrainAsPrimarySource: false,

      reliefSampleCount: state.reliefSamples.length,
      ridgeReliefExpressionCount: state.ridgeReliefExpressions.length,
      basinDepthExpressionCount: state.basinDepthExpressions.length,
      valleyFlowExpressionCount: state.valleyFlowExpressions.length,
      summitReliefExpressionCount: state.summitReliefExpressions.length,
      highlandReliefExpressionCount: state.highlandReliefExpressions.length,
      lowlandReliefExpressionCount: state.lowlandReliefExpressions.length,
      shelfReliefExpressionCount: state.shelfReliefExpressions.length,
      futureFillReliefExpressionCount: state.futureFillReliefExpressions.length,
      continentReliefProfileCount: state.continentReliefProfiles.length,

      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      failureReason: state.failureReason,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_DIRECT_DOWNSTREAM_CHILD_DEPLOY_MARKER_v1"
    });
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaElevationReliefExpressionChild = CONTRACT;
      document.documentElement.dataset.audraliaElevationReliefParentContract = PARENT_CONTRACT;
      document.documentElement.dataset.audraliaElevationReliefReady = String(state.reliefExpressionReady);
      document.documentElement.dataset.audraliaReliefDirectDownstreamFromElevationTrack = "true";
      document.documentElement.dataset.audraliaReliefUsesElevationTrackAsPrimarySource = "true";
      document.documentElement.dataset.audraliaReliefUsesDryTerrainAsPrimarySource = "false";
      document.documentElement.dataset.audraliaReliefChildDrawsVisuals = "false";
      document.documentElement.dataset.audraliaReliefHydrationHeld = "true";
      document.documentElement.dataset.audraliaReliefActiveHydration = "false";
      document.documentElement.dataset.audraliaReliefFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function init() {
    rebuildReliefExpression();

    setTimeout(rebuildReliefExpression, 180);
    setTimeout(rebuildReliefExpression, 640);
    setTimeout(rebuildReliefExpression, 1200);
  }

  var API = Object.freeze({
    contract: CONTRACT,
    parentContract: PARENT_CONTRACT,
    status: status,
    rebuildReliefExpression: rebuildReliefExpression,
    getReliefExpressionPacket: getReliefExpressionPacket,
    getCarrierReliefPacket: getCarrierReliefPacket,
    sampleReliefAt: sampleReliefAt,
    getReliefHintPacket: getReliefHintPacket
  });

  window.AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD = API;
  window.AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD = API;
  window.AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD = API;

  init();
})();
