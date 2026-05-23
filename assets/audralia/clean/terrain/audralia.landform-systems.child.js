// /assets/audralia/clean/terrain/audralia.landform-systems.child.js
// AUDRALIA_LANDFORM_SYSTEMS_DIRECT_DOWNSTREAM_CHILD_TNT_v1
// Full-file creation.
// Scope: direct downstream landform-systems child.
// Parent: /assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js
// Purpose: consume relief-expression truth and publish named physical landform systems.
// Owns: mountain ranges, landmarks, plateaus, landform basins, cliff/escarpment systems, continent landform profiles, carrier-safe landform packets.
// Does not own: dry terrain source, elevation truth, relief parent truth, runtime carrier, HTML, active hydration, visual drawing, settlements, cities, climate, ecology, technology, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_DIRECT_DOWNSTREAM_CHILD_TNT_v1";
  var PARENT_CONTRACT = "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_DIRECT_DOWNSTREAM_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.landform-systems.child.js";
  var REQUESTER = "audralia-landform-systems-child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var PARENT_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD"
  ]);

  var MOUNTAIN_RANGE_TYPES = Object.freeze([
    "summit_spine_range",
    "continental_ridge_range",
    "protective_basin_rim_range",
    "highland_massif",
    "dry_escarpment_range"
  ]);

  var LANDMARK_TYPES = Object.freeze([
    "summit_landmark",
    "ridge_gate_landmark",
    "basin_anchor_landmark",
    "cliff_edge_landmark",
    "plateau_crown_landmark",
    "future_fill_threshold_landmark",
    "watershed_marker_landmark"
  ]);

  var PLATEAU_TYPES = Object.freeze([
    "highland_plateau",
    "midland_tableland",
    "ancient_craton_plateau",
    "terraced_patience_plateau",
    "stable_dependability_plateau"
  ]);

  var BASIN_TYPES = Object.freeze([
    "dry_lowland_basin",
    "future_lake_basin",
    "inland_sea_memory_basin",
    "sediment_bowl",
    "sheltered_receiving_basin",
    "abyssal_memory_basin"
  ]);

  var CLIFF_TYPES = Object.freeze([
    "escarpment_wall",
    "shelf_break_cliff",
    "basin_rim_cliff",
    "ridge_face_cliff",
    "dry_coastal_memory_cliff"
  ]);

  var state = {
    parentApi: null,
    parentStatus: null,
    parentReliefPacket: null,
    parentCarrierPacket: null,

    parentReliefExpressionDetected: false,
    parentReliefExpressionReady: false,
    parentContractValid: false,
    parentCarrierMayConsume: false,
    parentChildDrawsVisuals: false,
    parentHydrationHeld: false,
    parentActiveHydration: false,
    parentFinalVisualPassClaim: false,

    mountainRanges: [],
    landmarks: [],
    plateaus: [],
    landformBasins: [],
    cliffSystems: [],
    continentLandformProfiles: [],

    landformSystemsReady: false,
    directDownstreamFromReliefExpression: true,
    usesReliefExpressionAsPrimarySource: true,
    usesElevationTrackAsPrimarySource: false,
    usesDryTerrainAsPrimarySource: false,

    lastBuiltAt: null,
    failureReason: "landform systems not built",
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

  function average(values) {
    if (!values || !values.length) return 0;
    return values.reduce(function (sum, value) {
      return sum + Number(value || 0);
    }, 0) / values.length;
  }

  function unique(values) {
    var seen = {};
    var out = [];

    (values || []).forEach(function (value) {
      if (value === undefined || value === null) return;
      var key = String(value);
      if (seen[key]) return;
      seen[key] = true;
      out.push(value);
    });

    return out;
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

  function byId(collection, field, id) {
    for (var i = 0; i < (collection || []).length; i += 1) {
      if (collection[i] && collection[i][field] === id) return collection[i];
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

  function getReliefSamples() {
    return state.parentReliefPacket && Array.isArray(state.parentReliefPacket.reliefSamples)
      ? state.parentReliefPacket.reliefSamples
      : [];
  }

  function getSampleByNodeId(nodeId) {
    var samples = getReliefSamples();

    for (var i = 0; i < samples.length; i += 1) {
      if (samples[i].parentNodeId === nodeId) return samples[i];
    }

    return null;
  }

  function getSamplesByNodeIds(nodeIds) {
    return unique(nodeIds || []).map(getSampleByNodeId).filter(Boolean);
  }

  function aggregateSamples(nodeIds) {
    var samples = getSamplesByNodeIds(nodeIds);

    return {
      samples: samples,
      sampleIds: samples.map(function (sample) { return sample.sampleId; }),
      averageReliefIntensity: average(samples.map(function (sample) { return sample.reliefIntensity; })),
      averageShadeBias: average(samples.map(function (sample) { return sample.shadeBias; })),
      averageDryDepthBias: average(samples.map(function (sample) { return sample.dryDepthBias; })),
      averageRidgeHighlight: average(samples.map(function (sample) { return sample.ridgeHighlight; })),
      averageBasinShadow: average(samples.map(function (sample) { return sample.basinShadow; })),
      averageValleyDirectionality: average(samples.map(function (sample) { return sample.valleyDirectionality; })),
      averageSummitEmphasis: average(samples.map(function (sample) { return sample.summitEmphasis; })),
      averageShelfTransitionStrength: average(samples.map(function (sample) { return sample.shelfTransitionStrength; })),
      averageFutureFillPriority: average(samples.map(function (sample) { return sample.futureFillPriority; })),
      averageSlopeMagnitude: average(samples.map(function (sample) { return sample.slopeMagnitude; })),
      averageLocalContinuity: average(samples.map(function (sample) { return sample.localContinuity; })),
      averageElevation: average(samples.map(function (sample) { return sample.elevation; }))
    };
  }

  function detectParentReliefExpression() {
    var api = firstGlobal(PARENT_GLOBALS);

    state.parentApi = api;
    state.parentStatus = null;
    state.parentReliefPacket = null;
    state.parentCarrierPacket = null;

    state.parentReliefExpressionDetected = Boolean(api);
    state.parentReliefExpressionReady = false;
    state.parentContractValid = false;
    state.parentCarrierMayConsume = false;
    state.parentChildDrawsVisuals = false;
    state.parentHydrationHeld = false;
    state.parentActiveHydration = false;
    state.parentFinalVisualPassClaim = false;

    if (!api) {
      state.failureReason = "parent relief-expression child missing";
      return false;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getReliefExpressionPacket !== "function" ||
      typeof api.getCarrierReliefPacket !== "function" ||
      typeof api.sampleReliefAt !== "function"
    ) {
      state.failureReason = "parent relief-expression API incomplete";
      return false;
    }

    state.parentStatus = safeCall("parentReliefExpression", api, "status");

    state.parentContractValid = Boolean(
      state.parentStatus &&
      state.parentStatus.contract === PARENT_CONTRACT
    );

    state.parentReliefExpressionReady = Boolean(
      state.parentStatus &&
      state.parentStatus.reliefExpressionReady === true
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

    if (!state.parentReliefExpressionReady || !state.parentCarrierMayConsume) {
      state.failureReason = "parent relief-expression unready";
      return false;
    }

    if (state.parentChildDrawsVisuals || !state.parentHydrationHeld || state.parentActiveHydration || state.parentFinalVisualPassClaim) {
      state.failureReason = "parent relief-expression unsafe";
      return false;
    }

    return true;
  }

  function loadParentPackets() {
    if (!detectParentReliefExpression()) return false;

    state.parentReliefPacket = safeCall(
      "parentReliefExpression",
      state.parentApi,
      "getReliefExpressionPacket",
      REQUESTER,
      { compact: false }
    );

    state.parentCarrierPacket = safeCall(
      "parentReliefExpression",
      state.parentApi,
      "getCarrierReliefPacket",
      REQUESTER,
      { compact: false }
    );

    if (!validateParentReliefPacket(state.parentReliefPacket)) {
      state.failureReason = "parent relief-expression packet malformed";
      return false;
    }

    if (!validateParentCarrierPacket(state.parentCarrierPacket)) {
      state.failureReason = "parent carrier relief packet malformed";
      return false;
    }

    return true;
  }

  function validateParentReliefPacket(packet) {
    return Boolean(
      packet &&
      packet.contract === PARENT_CONTRACT &&
      packet.reliefExpressionReady === true &&
      packet.directDownstreamFromElevationTrack === true &&
      packet.usesElevationTrackAsPrimarySource === true &&
      packet.usesDryTerrainAsPrimarySource === false &&
      packet.carrierMayConsume === true &&
      packet.childDrawsVisuals === false &&
      packet.hydrationHeld === true &&
      packet.activeHydration === false &&
      packet.finalVisualPassClaim === false &&
      Array.isArray(packet.reliefSamples) &&
      Array.isArray(packet.ridgeReliefExpressions) &&
      Array.isArray(packet.basinDepthExpressions) &&
      Array.isArray(packet.valleyFlowExpressions) &&
      Array.isArray(packet.summitReliefExpressions) &&
      Array.isArray(packet.highlandReliefExpressions) &&
      Array.isArray(packet.lowlandReliefExpressions) &&
      Array.isArray(packet.shelfReliefExpressions) &&
      Array.isArray(packet.futureFillReliefExpressions) &&
      Array.isArray(packet.continentReliefProfiles)
    );
  }

  function validateParentCarrierPacket(packet) {
    return Boolean(
      packet &&
      packet.contract === PARENT_CONTRACT &&
      packet.reliefExpressionReady === true &&
      packet.carrierMayConsume === true &&
      packet.carrierShouldNotOwnReliefTruth === true &&
      packet.carrierShouldNotOwnElevationTruth === true &&
      packet.childDrawsVisuals === false &&
      packet.hydrationHeld === true &&
      packet.activeHydration === false &&
      packet.finalVisualPassClaim === false
    );
  }

  function inferMountainRangeType(ridge, aggregate) {
    var type = String(ridge.ridgeType || "");

    if (type.indexOf("summit") >= 0 || aggregate.averageSummitEmphasis > 0.42) return "summit_spine_range";
    if (type.indexOf("basin") >= 0 || type.indexOf("rim") >= 0) return "protective_basin_rim_range";
    if (type.indexOf("escarpment") >= 0 || aggregate.averageRidgeHighlight > 0.58) return "dry_escarpment_range";
    if (aggregate.averageElevation > 0.61 && aggregate.averageLocalContinuity > 0.44) return "highland_massif";
    return "continental_ridge_range";
  }

  function buildMountainRanges() {
    var ridges = state.parentReliefPacket.ridgeReliefExpressions || [];
    var highlands = state.parentReliefPacket.highlandReliefExpressions || [];
    var summits = state.parentReliefPacket.summitReliefExpressions || [];

    var ranges = ridges.map(function (ridge, index) {
      var nodeIds = unique(ridge.nodeIds || []);
      var aggregate = aggregateSamples(nodeIds);
      var linkedHighlands = highlands.filter(function (zone) {
        return overlapCount(nodeIds, zone.nodeIds || []) > 0;
      });

      var linkedSummits = summits.filter(function (summit) {
        return nodeIds.indexOf(summit.nodeId) >= 0;
      });

      var rangeContinuity = clamp(
        aggregate.averageLocalContinuity * 0.38 +
        Number(ridge.watershedDivideStrength || 0) * 0.22 +
        Number(ridge.ridgeReliefStrength || 0) * 0.24 +
        clamp(nodeIds.length / 8, 0, 1) * 0.16,
        0,
        1
      );

      var watershedAuthority = clamp(
        Number(ridge.watershedDivideStrength || 0) * 0.50 +
        Number(ridge.ridgeReliefStrength || 0) * 0.26 +
        aggregate.averageRidgeHighlight * 0.24,
        0,
        1
      );

      return Object.freeze({
        mountainRangeId: "AUDRALIA-MOUNTAIN-RANGE-" + String(index).padStart(3, "0"),
        continentId: ridge.continentId,
        continentName: ridge.continentName,
        rangeType: inferMountainRangeType(ridge, aggregate),
        nodeIds: nodeIds,
        summitNodeIds: linkedSummits.map(function (item) { return item.nodeId; }),
        ridgeExpressionIds: [ridge.ridgeReliefExpressionId],
        highlandExpressionIds: linkedHighlands.map(function (item) { return item.highlandReliefExpressionId; }),
        averageReliefIntensity: round(aggregate.averageReliefIntensity, 4),
        rangeContinuity: round(rangeContinuity, 4),
        watershedAuthority: round(watershedAuthority, 4),
        landmarkCandidateIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });

    highlands.forEach(function (highland) {
      var alreadyRepresented = ranges.some(function (range) {
        return overlapCount(range.nodeIds, highland.nodeIds || []) > 1;
      });

      if (alreadyRepresented) return;

      var nodeIds = unique(highland.nodeIds || []);
      var aggregate = aggregateSamples(nodeIds);

      if (aggregate.averageReliefIntensity < 0.18 && Number(highland.highlandReliefStrength || 0) < 0.24) return;

      ranges.push(Object.freeze({
        mountainRangeId: "AUDRALIA-MOUNTAIN-RANGE-" + String(ranges.length).padStart(3, "0"),
        continentId: highland.continentId,
        continentName: highland.continentName,
        rangeType: "highland_massif",
        nodeIds: nodeIds,
        summitNodeIds: [],
        ridgeExpressionIds: [],
        highlandExpressionIds: [highland.highlandReliefExpressionId],
        averageReliefIntensity: round(aggregate.averageReliefIntensity, 4),
        rangeContinuity: round(clamp(aggregate.averageLocalContinuity * 0.62 + Number(highland.highlandReliefStrength || 0) * 0.38, 0, 1), 4),
        watershedAuthority: round(clamp(aggregate.averageRidgeHighlight * 0.34 + aggregate.averageSlopeMagnitude * 0.22, 0, 1), 4),
        landmarkCandidateIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }));
    });

    return Object.freeze(ranges);
  }

  function overlapCount(a, b) {
    var map = {};
    (a || []).forEach(function (value) { map[value] = true; });

    return (b || []).filter(function (value) {
      return Boolean(map[value]);
    }).length;
  }

  function inferPlateauType(highland, aggregate) {
    var continent = String(highland.continentId || "");

    if (continent === "patience") return "terraced_patience_plateau";
    if (continent === "dependability") return "stable_dependability_plateau";
    if (aggregate.averageElevation > 0.58) return "highland_plateau";
    if (aggregate.averageLocalContinuity > 0.56 && aggregate.averageSlopeMagnitude < 0.18) return "ancient_craton_plateau";
    return "midland_tableland";
  }

  function buildPlateaus() {
    var highlands = state.parentReliefPacket.highlandReliefExpressions || [];
    var samples = getReliefSamples();

    var plateaus = highlands.filter(function (highland) {
      var aggregate = aggregateSamples(highland.nodeIds || []);
      return aggregate.averageLocalContinuity > 0.32 &&
        aggregate.averageSlopeMagnitude < 0.24 &&
        (Number(highland.highlandReliefStrength || 0) > 0.20 || aggregate.averageElevation > 0.42);
    }).map(function (highland, index) {
      var nodeIds = unique(highland.nodeIds || []);
      var aggregate = aggregateSamples(nodeIds);

      return Object.freeze({
        plateauId: "AUDRALIA-PLATEAU-" + String(index).padStart(3, "0"),
        continentId: highland.continentId,
        continentName: highland.continentName,
        plateauType: inferPlateauType(highland, aggregate),
        nodeIds: nodeIds,
        averageElevation: round(aggregate.averageElevation, 4),
        averageReliefIntensity: round(aggregate.averageReliefIntensity, 4),
        slopeStability: round(clamp(1 - aggregate.averageSlopeMagnitude, 0, 1), 4),
        surfaceContinuity: round(aggregate.averageLocalContinuity, 4),
        edgeCliffIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    });

    if (!plateaus.length && samples.length) {
      var grouped = groupByContinent(samples).filter(function (group) {
        return group.samples.length >= 6;
      });

      grouped.slice(0, 3).forEach(function (group) {
        var nodeIds = group.samples.map(function (sample) { return sample.parentNodeId; });
        var aggregate = aggregateSamples(nodeIds);

        plateaus.push(Object.freeze({
          plateauId: "AUDRALIA-PLATEAU-" + String(plateaus.length).padStart(3, "0"),
          continentId: group.continentId,
          continentName: group.continentName,
          plateauType: aggregate.averageElevation > 0.50 ? "highland_plateau" : "midland_tableland",
          nodeIds: nodeIds,
          averageElevation: round(aggregate.averageElevation, 4),
          averageReliefIntensity: round(aggregate.averageReliefIntensity, 4),
          slopeStability: round(clamp(1 - aggregate.averageSlopeMagnitude, 0, 1), 4),
          surfaceContinuity: round(aggregate.averageLocalContinuity, 4),
          edgeCliffIds: [],
          carrierMayConsume: true,
          hydrationHeld: true,
          activeHydration: false,
          finalVisualPassClaim: false
        }));
      });
    }

    return Object.freeze(plateaus);
  }

  function groupByContinent(samples) {
    var groups = {};

    (samples || []).forEach(function (sample) {
      var key = sample.continentId || "unassigned";

      if (!groups[key]) {
        groups[key] = {
          continentId: sample.continentId || "unassigned",
          continentName: sample.continentName || "Unassigned",
          samples: []
        };
      }

      groups[key].samples.push(sample);
    });

    return Object.keys(groups).map(function (key) {
      return groups[key];
    });
  }

  function inferLandformBasinType(basin) {
    var type = String(basin.basinType || "");
    var candidate = String(basin.candidateHydrationType || "");

    if (type.indexOf("abyssal") >= 0) return "abyssal_memory_basin";
    if (type.indexOf("sediment") >= 0) return "sediment_bowl";
    if (type.indexOf("sheltered") >= 0 || type.indexOf("receiving") >= 0) return "sheltered_receiving_basin";
    if (candidate.indexOf("inland_sea") >= 0 || type.indexOf("inland") >= 0) return "inland_sea_memory_basin";
    if (candidate.indexOf("lake") >= 0 || Number(basin.futureFillPriority || 0) > 0.52) return "future_lake_basin";
    return "dry_lowland_basin";
  }

  function buildLandformBasins() {
    var basins = state.parentReliefPacket.basinDepthExpressions || [];
    var futureFill = state.parentReliefPacket.futureFillReliefExpressions || [];

    return Object.freeze(basins.map(function (basin, index) {
      var nodeIds = unique(basin.nodeIds || []);
      var aggregate = aggregateSamples(nodeIds);
      var connectedFuture = futureFill.filter(function (item) {
        return overlapCount(nodeIds, item.nodeIds || []) > 0;
      });

      return Object.freeze({
        landformBasinId: "AUDRALIA-LANDFORM-BASIN-" + String(index).padStart(3, "0"),
        continentId: basin.continentId,
        continentName: basin.continentName,
        basinType: inferLandformBasinType(basin),
        parentBasinDepthExpressionId: basin.basinDepthExpressionId,
        nodeIds: nodeIds,
        rimSystemIds: [],
        lowestNodeId: basin.lowestNodeId,
        basinDepthStrength: round(Number(basin.basinDepthStrength || aggregate.averageBasinShadow || 0), 4),
        futureFillPriority: round(Number(basin.futureFillPriority || aggregate.averageFutureFillPriority || 0), 4),
        connectedFutureFillExpressionIds: connectedFuture.map(function (item) { return item.futureFillReliefExpressionId; }),
        landmarkCandidateIds: [],
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        futureFillOnly: true,
        finalVisualPassClaim: false
      });
    }));
  }

  function inferCliffType(source, aggregate) {
    var role = String(source.carrierVisualRole || "");
    var shelf = Number(source.shelfTransitionStrength || aggregate.averageShelfTransitionStrength || 0);
    var basin = Number(source.basinShadow || aggregate.averageBasinShadow || 0);
    var ridge = Number(source.ridgeHighlight || aggregate.averageRidgeHighlight || 0);

    if (role.indexOf("shelf") >= 0 || shelf > 0.46) return "shelf_break_cliff";
    if (role.indexOf("basin") >= 0 || basin > 0.48) return "basin_rim_cliff";
    if (role.indexOf("ridge") >= 0 || ridge > 0.54) return "ridge_face_cliff";
    if (Number(source.reliefIntensity || aggregate.averageReliefIntensity || 0) > 0.58) return "escarpment_wall";
    return "dry_coastal_memory_cliff";
  }

  function buildCliffSystems() {
    var ridges = state.parentReliefPacket.ridgeReliefExpressions || [];
    var shelves = state.parentReliefPacket.shelfReliefExpressions || [];
    var basins = state.parentReliefPacket.basinDepthExpressions || [];
    var cliffSeeds = [];

    ridges.forEach(function (ridge) {
      if (Number(ridge.ridgeReliefStrength || 0) > 0.38 || Number(ridge.ridgeHighlight || 0) > 0.38) {
        cliffSeeds.push({
          sourceType: "ridge",
          sourceId: ridge.ridgeReliefExpressionId,
          source: ridge,
          nodeIds: ridge.nodeIds || []
        });
      }
    });

    shelves.forEach(function (shelf) {
      if (Number(shelf.shelfTransitionStrength || 0) > 0.30 || shelf.futureBeachCandidate === true) {
        cliffSeeds.push({
          sourceType: "shelf",
          sourceId: shelf.shelfReliefExpressionId,
          source: shelf,
          nodeIds: shelf.nodeIds || []
        });
      }
    });

    basins.forEach(function (basin) {
      if (Number(basin.basinDepthStrength || 0) > 0.38) {
        cliffSeeds.push({
          sourceType: "basin",
          sourceId: basin.basinDepthExpressionId,
          source: basin,
          nodeIds: basin.nodeIds || []
        });
      }
    });

    return Object.freeze(cliffSeeds.map(function (seed, index) {
      var aggregate = aggregateSamples(seed.nodeIds);
      var adjacentBasins = state.landformBasins.filter(function (basin) {
        return overlapCount(seed.nodeIds, basin.nodeIds || []) > 0;
      });

      var reliefBreakStrength = clamp(
        aggregate.averageReliefIntensity * 0.28 +
        aggregate.averageRidgeHighlight * 0.24 +
        aggregate.averageShelfTransitionStrength * 0.18 +
        aggregate.averageBasinShadow * 0.14 +
        aggregate.averageSlopeMagnitude * 0.16,
        0,
        1
      );

      return Object.freeze({
        cliffSystemId: "AUDRALIA-CLIFF-SYSTEM-" + String(index).padStart(3, "0"),
        continentId: seed.source.continentId,
        continentName: seed.source.continentName,
        cliffType: inferCliffType(seed.source, aggregate),
        nodeIds: unique(seed.nodeIds || []),
        parentRidgeReliefExpressionId: seed.sourceType === "ridge" ? seed.sourceId : null,
        parentShelfReliefExpressionId: seed.sourceType === "shelf" ? seed.sourceId : null,
        parentBasinDepthExpressionId: seed.sourceType === "basin" ? seed.sourceId : null,
        reliefBreakStrength: round(reliefBreakStrength, 4),
        edgeContinuity: round(aggregate.averageLocalContinuity, 4),
        dropDirection: inferDropDirection(seed.nodeIds),
        adjacentBasinIds: adjacentBasins.map(function (basin) { return basin.landformBasinId; }),
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        edgeMaterialHeld: true,
        finalVisualPassClaim: false
      });
    }));
  }

  function inferDropDirection(nodeIds) {
    var samples = getSamplesByNodeIds(nodeIds);
    if (!samples.length) return "unresolved";

    var sx = average(samples.map(function (sample) { return normalizeX(sample.x); }));
    var sy = average(samples.map(function (sample) { return normalizeY(sample.y); }));
    var probe = sampleLandformAt(sx, sy, { allowUnready: true });

    if (probe && probe.nearestCarrierVisualRole === "basin_depth") return "toward_basin";
    if (probe && probe.nearestCarrierVisualRole === "shelf_transition") return "toward_shelf";
    if (sy < 5) return "southward_descent";
    if (sy > 10) return "northward_descent";
    return "radial_descent";
  }

  function buildLandmarks() {
    var landmarks = [];

    function pushLandmark(type, parentSystemId, nodeIds, continentId, continentName, strength, narrativeFunction) {
      nodeIds = unique(nodeIds || []);
      if (!nodeIds.length) return;

      var anchorNodeId = selectAnchorNodeId(nodeIds);

      landmarks.push(Object.freeze({
        landmarkId: "AUDRALIA-LANDMARK-" + String(landmarks.length).padStart(3, "0"),
        continentId: continentId,
        continentName: continentName,
        landmarkType: type,
        parentSystemId: parentSystemId,
        nodeIds: nodeIds.slice(0, 12),
        anchorNodeId: anchorNodeId,
        reliefIntensity: round(aggregateSamples(nodeIds).averageReliefIntensity, 4),
        landmarkStrength: round(clamp(strength, 0, 1), 4),
        narrativeFunction: narrativeFunction,
        settlementAuthorized: false,
        cityAuthorized: false,
        technologySiteAuthorized: false,
        finalMapLabelAuthorized: false,
        carrierMayConsume: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }));
    }

    state.mountainRanges.forEach(function (range) {
      if (range.summitNodeIds.length) {
        pushLandmark(
          "summit_landmark",
          range.mountainRangeId,
          range.summitNodeIds,
          range.continentId,
          range.continentName,
          range.watershedAuthority,
          "physical summit anchor"
        );
      }

      if (range.watershedAuthority > 0.46) {
        pushLandmark(
          "watershed_marker_landmark",
          range.mountainRangeId,
          range.nodeIds.slice(0, 4),
          range.continentId,
          range.continentName,
          range.watershedAuthority,
          "watershed authority marker"
        );
      }
    });

    state.landformBasins.forEach(function (basin) {
      if (basin.basinDepthStrength > 0.34 || basin.futureFillPriority > 0.42) {
        pushLandmark(
          basin.futureFillPriority > 0.50 ? "future_fill_threshold_landmark" : "basin_anchor_landmark",
          basin.landformBasinId,
          [basin.lowestNodeId].concat(basin.nodeIds.slice(0, 3)),
          basin.continentId,
          basin.continentName,
          Math.max(basin.basinDepthStrength, basin.futureFillPriority),
          "physical basin anchor"
        );
      }
    });

    state.plateaus.forEach(function (plateau) {
      if (plateau.surfaceContinuity > 0.42 || plateau.slopeStability > 0.72) {
        pushLandmark(
          "plateau_crown_landmark",
          plateau.plateauId,
          plateau.nodeIds.slice(0, 5),
          plateau.continentId,
          plateau.continentName,
          plateau.surfaceContinuity,
          "plateau crown anchor"
        );
      }
    });

    state.cliffSystems.forEach(function (cliff) {
      if (cliff.reliefBreakStrength > 0.38) {
        pushLandmark(
          "cliff_edge_landmark",
          cliff.cliffSystemId,
          cliff.nodeIds.slice(0, 5),
          cliff.continentId,
          cliff.continentName,
          cliff.reliefBreakStrength,
          "cliff edge anchor"
        );
      }
    });

    return Object.freeze(landmarks);
  }

  function selectAnchorNodeId(nodeIds) {
    var samples = getSamplesByNodeIds(nodeIds);
    if (!samples.length) return nodeIds[0] || null;

    samples.sort(function (a, b) {
      var astrength =
        Number(a.reliefIntensity || 0) +
        Number(a.summitEmphasis || 0) +
        Number(a.ridgeHighlight || 0) +
        Number(a.basinShadow || 0) +
        Number(a.futureFillPriority || 0);

      var bstrength =
        Number(b.reliefIntensity || 0) +
        Number(b.summitEmphasis || 0) +
        Number(b.ridgeHighlight || 0) +
        Number(b.basinShadow || 0) +
        Number(b.futureFillPriority || 0);

      return bstrength - astrength;
    });

    return samples[0].parentNodeId;
  }

  function attachLandmarkCandidates() {
    var landmarkByParent = {};

    state.landmarks.forEach(function (landmark) {
      if (!landmark.parentSystemId) return;
      if (!landmarkByParent[landmark.parentSystemId]) landmarkByParent[landmark.parentSystemId] = [];
      landmarkByParent[landmark.parentSystemId].push(landmark.landmarkId);
    });

    state.mountainRanges = Object.freeze(state.mountainRanges.map(function (range) {
      return Object.freeze(Object.assign({}, range, {
        landmarkCandidateIds: landmarkByParent[range.mountainRangeId] || []
      }));
    }));

    state.landformBasins = Object.freeze(state.landformBasins.map(function (basin) {
      return Object.freeze(Object.assign({}, basin, {
        landmarkCandidateIds: landmarkByParent[basin.landformBasinId] || []
      }));
    }));
  }

  function attachPlateauCliffEdges() {
    state.plateaus = Object.freeze(state.plateaus.map(function (plateau) {
      var edges = state.cliffSystems.filter(function (cliff) {
        return overlapCount(plateau.nodeIds, cliff.nodeIds || []) > 0;
      }).map(function (cliff) {
        return cliff.cliffSystemId;
      });

      return Object.freeze(Object.assign({}, plateau, {
        edgeCliffIds: edges
      }));
    }));
  }

  function attachBasinRims() {
    state.landformBasins = Object.freeze(state.landformBasins.map(function (basin) {
      var rims = state.mountainRanges.filter(function (range) {
        return overlapCount(basin.nodeIds, range.nodeIds || []) > 0;
      }).map(function (range) {
        return range.mountainRangeId;
      });

      var cliffs = state.cliffSystems.filter(function (cliff) {
        return overlapCount(basin.nodeIds, cliff.nodeIds || []) > 0;
      }).map(function (cliff) {
        return cliff.cliffSystemId;
      });

      return Object.freeze(Object.assign({}, basin, {
        rimSystemIds: unique(rims.concat(cliffs))
      }));
    }));
  }

  function buildContinentLandformProfiles() {
    var parentProfiles = state.parentReliefPacket.continentReliefProfiles || [];

    return Object.freeze(parentProfiles.map(function (profile) {
      var mountainRanges = state.mountainRanges.filter(function (item) { return item.continentId === profile.continentId; });
      var landmarks = state.landmarks.filter(function (item) { return item.continentId === profile.continentId; });
      var plateaus = state.plateaus.filter(function (item) { return item.continentId === profile.continentId; });
      var basins = state.landformBasins.filter(function (item) { return item.continentId === profile.continentId; });
      var cliffs = state.cliffSystems.filter(function (item) { return item.continentId === profile.continentId; });

      var scores = {
        mountain_range: mountainRanges.length + average(mountainRanges.map(function (item) { return item.watershedAuthority; })),
        landmark: landmarks.length + average(landmarks.map(function (item) { return item.landmarkStrength; })),
        plateau: plateaus.length + average(plateaus.map(function (item) { return item.surfaceContinuity; })),
        basin: basins.length + average(basins.map(function (item) { return item.basinDepthStrength; })),
        cliff: cliffs.length + average(cliffs.map(function (item) { return item.reliefBreakStrength; }))
      };

      var averageStrength = average([
        average(mountainRanges.map(function (item) { return item.averageReliefIntensity; })),
        average(landmarks.map(function (item) { return item.landmarkStrength; })),
        average(plateaus.map(function (item) { return item.averageReliefIntensity; })),
        average(basins.map(function (item) { return item.basinDepthStrength; })),
        average(cliffs.map(function (item) { return item.reliefBreakStrength; }))
      ]);

      return Object.freeze({
        continentId: profile.continentId,
        continentName: profile.continentName,
        dominantLandformType: maxKey(scores) || "unresolved_landform",
        mountainRangeCount: mountainRanges.length,
        landmarkCount: landmarks.length,
        plateauCount: plateaus.length,
        basinCount: basins.length,
        cliffCount: cliffs.length,
        averageLandformStrength: round(averageStrength, 4),
        terrainIdentitySummary: terrainIdentitySummary(profile.continentId),
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      });
    }));
  }

  function terrainIdentitySummary(continentId) {
    var summaries = {
      gratitude: "receiving basins, protective rims, and stable anchor landmarks",
      generosity: "branching ranges, outward corridors, and distributive physical anchors",
      dependability: "broad plateaus, highland massifs, and stable landform bodies",
      accountability: "cliffs, escarpments, boundary ridges, and consequence landmarks",
      forgiveness: "soft basins, repaired valleys, and sediment-bowl landforms",
      humility: "sheltered lowland basins, quiet floors, and grounded physical anchors",
      "self-control": "contained channels, disciplined ridge walls, and narrow edge systems",
      patience: "terraced plateaus, layered shelves, and gradual landform transitions",
      purity: "summits, clean ridge systems, highland landmarks, and source peaks"
    };

    return summaries[continentId] || "unresolved terrain identity";
  }

  function sampleLandformAt(x, y, options) {
    var opts = options || {};
    var sx = Number(x);
    var sy = Number(y);

    if (opts.normalized === true) {
      sx = sx * (RADIAL_NODES - 1);
      sy = sy * (FIBONACCI_BANDS - 1);
    }

    sx = normalizeX(sx);
    sy = normalizeY(sy);

    if (!state.landformSystemsReady && opts.allowUnready !== true) {
      return {
        x: sx,
        y: sy,
        landformSystemsReady: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    var candidates = [];

    function addCandidate(kind, idField, item, strengthField) {
      var nodeIds = item.nodeIds || [];
      var minDistance = Infinity;

      nodeIds.forEach(function (nodeId) {
        var sample = getSampleByNodeId(nodeId);
        if (!sample) return;
        minDistance = Math.min(minDistance, gridDistance(sx, sy, sample.x, sample.y));
      });

      if (!Number.isFinite(minDistance)) return;
      if (minDistance > 3.0) return;

      candidates.push({
        kind: kind,
        id: item[idField],
        item: item,
        distance: minDistance,
        strength: Number(item[strengthField] || 0)
      });
    }

    state.mountainRanges.forEach(function (item) { addCandidate("mountain_range", "mountainRangeId", item, "watershedAuthority"); });
    state.landmarks.forEach(function (item) { addCandidate("landmark", "landmarkId", item, "landmarkStrength"); });
    state.plateaus.forEach(function (item) { addCandidate("plateau", "plateauId", item, "surfaceContinuity"); });
    state.landformBasins.forEach(function (item) { addCandidate("basin", "landformBasinId", item, "basinDepthStrength"); });
    state.cliffSystems.forEach(function (item) { addCandidate("cliff", "cliffSystemId", item, "reliefBreakStrength"); });

    candidates.sort(function (a, b) {
      var ascore = a.strength / (0.45 + a.distance);
      var bscore = b.strength / (0.45 + b.distance);
      return bscore - ascore;
    });

    var nearest = candidates[0];

    if (!nearest) {
      return {
        x: round(sx, 4),
        y: round(sy, 4),
        landformSystemsReady: state.landformSystemsReady,
        nearestLandformType: "unmapped",
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }

    var firstNodeId = nearest.item.nodeIds && nearest.item.nodeIds[0];
    var sample = firstNodeId ? getSampleByNodeId(firstNodeId) : null;

    return {
      x: round(sx, 4),
      y: round(sy, 4),
      landformSystemsReady: state.landformSystemsReady,
      nearestLandformType: nearest.kind,
      nearestLandformId: nearest.id,
      nearestContinentId: nearest.item.continentId,
      nearestContinentName: nearest.item.continentName,
      nearestCarrierVisualRole: sample ? sample.carrierVisualRole : "landform_system",
      landformStrength: round(nearest.strength, 4),
      distance: round(nearest.distance, 4),
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function rebuildLandformSystems() {
    if (!loadParentPackets()) {
      clearLandformSystems();
      publishStatus();
      return false;
    }

    state.mountainRanges = buildMountainRanges();
    state.plateaus = buildPlateaus();
    state.landformBasins = buildLandformBasins();
    state.cliffSystems = buildCliffSystems();

    attachPlateauCliffEdges();
    attachBasinRims();

    state.landmarks = buildLandmarks();
    attachLandmarkCandidates();

    state.continentLandformProfiles = buildContinentLandformProfiles();

    state.landformSystemsReady = Boolean(
      state.mountainRanges.length > 0 ||
      state.landmarks.length > 0 ||
      state.plateaus.length > 0 ||
      state.landformBasins.length > 0 ||
      state.cliffSystems.length > 0
    );

    state.failureReason = state.landformSystemsReady ? "" : "landform systems empty";
    state.lastBuiltAt = new Date().toISOString();

    publishStatus();
    return state.landformSystemsReady;
  }

  function clearLandformSystems() {
    state.mountainRanges = [];
    state.landmarks = [];
    state.plateaus = [];
    state.landformBasins = [];
    state.cliffSystems = [];
    state.continentLandformProfiles = [];
    state.landformSystemsReady = false;
    state.lastBuiltAt = new Date().toISOString();
  }

  function getLandformSystemsPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "full_landform_systems_packet",
      requester: requester || "unknown",

      parentReliefExpressionDetected: state.parentReliefExpressionDetected,
      parentReliefExpressionReady: state.parentReliefExpressionReady,
      landformSystemsReady: state.landformSystemsReady,

      directDownstreamFromReliefExpression: true,
      usesReliefExpressionAsPrimarySource: true,
      usesElevationTrackAsPrimarySource: false,
      usesDryTerrainAsPrimarySource: false,

      carrierMayConsume: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      mountainRanges: state.mountainRanges.slice(),
      landmarks: state.landmarks.slice(),
      plateaus: state.plateaus.slice(),
      landformBasins: state.landformBasins.slice(),
      cliffSystems: state.cliffSystems.slice(),
      continentLandformProfiles: state.continentLandformProfiles.slice(),

      carrierPacket: getCarrierLandformPacket(requester || "landform-systems", options || {}),
      receipt: status()
    });
  }

  function getCarrierLandformPacket(requester, options) {
    var opts = options || {};
    var compact = opts.compact === true;

    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "carrier_safe_landform_systems_packet",
      requester: requester || "unknown",

      parentReliefExpressionDetected: state.parentReliefExpressionDetected,
      parentReliefExpressionReady: state.parentReliefExpressionReady,
      landformSystemsReady: state.landformSystemsReady,

      directDownstreamFromReliefExpression: true,
      usesReliefExpressionAsPrimarySource: true,
      usesElevationTrackAsPrimarySource: false,
      usesDryTerrainAsPrimarySource: false,

      carrierMayConsume: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false,

      mountainRanges: compact ? state.mountainRanges.map(compactMountainRange) : state.mountainRanges.slice(),
      landmarks: compact ? state.landmarks.map(compactLandmark) : state.landmarks.slice(),
      plateaus: compact ? state.plateaus.map(compactPlateau) : state.plateaus.slice(),
      landformBasins: compact ? state.landformBasins.map(compactBasin) : state.landformBasins.slice(),
      cliffSystems: compact ? state.cliffSystems.map(compactCliff) : state.cliffSystems.slice(),
      continentLandformProfiles: state.continentLandformProfiles.slice(),

      receipt: status()
    });
  }

  function compactMountainRange(item) {
    return {
      mountainRangeId: item.mountainRangeId,
      continentId: item.continentId,
      rangeType: item.rangeType,
      nodeIds: item.nodeIds,
      averageReliefIntensity: item.averageReliefIntensity,
      rangeContinuity: item.rangeContinuity,
      watershedAuthority: item.watershedAuthority,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function compactLandmark(item) {
    return {
      landmarkId: item.landmarkId,
      continentId: item.continentId,
      landmarkType: item.landmarkType,
      anchorNodeId: item.anchorNodeId,
      landmarkStrength: item.landmarkStrength,
      settlementAuthorized: false,
      cityAuthorized: false,
      finalMapLabelAuthorized: false,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function compactPlateau(item) {
    return {
      plateauId: item.plateauId,
      continentId: item.continentId,
      plateauType: item.plateauType,
      nodeIds: item.nodeIds,
      averageElevation: item.averageElevation,
      slopeStability: item.slopeStability,
      surfaceContinuity: item.surfaceContinuity,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function compactBasin(item) {
    return {
      landformBasinId: item.landformBasinId,
      continentId: item.continentId,
      basinType: item.basinType,
      nodeIds: item.nodeIds,
      lowestNodeId: item.lowestNodeId,
      basinDepthStrength: item.basinDepthStrength,
      futureFillPriority: item.futureFillPriority,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      finalVisualPassClaim: false
    };
  }

  function compactCliff(item) {
    return {
      cliffSystemId: item.cliffSystemId,
      continentId: item.continentId,
      cliffType: item.cliffType,
      nodeIds: item.nodeIds,
      reliefBreakStrength: item.reliefBreakStrength,
      edgeContinuity: item.edgeContinuity,
      dropDirection: item.dropDirection,
      edgeMaterialHeld: true,
      carrierMayConsume: true,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false
    };
  }

  function getMountainRangePacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "mountain_range_landform_packet",
      requester: requester || "unknown",
      mountainRanges: state.mountainRanges.slice(),
      mountainRangeTypes: MOUNTAIN_RANGE_TYPES.slice(),
      landformSystemsReady: state.landformSystemsReady,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false,
      receipt: status()
    });
  }

  function getLandmarkPacket(requester, options) {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      packetType: "physical_landmark_packet",
      requester: requester || "unknown",
      landmarks: state.landmarks.slice(),
      landmarkTypes: LANDMARK_TYPES.slice(),
      landmarksArePhysicalAnchorsOnly: true,
      settlementAuthorized: false,
      cityAuthorized: false,
      technologySiteAuthorized: false,
      finalMapLabelAuthorized: false,
      landformSystemsReady: state.landformSystemsReady,
      hydrationHeld: true,
      activeHydration: false,
      finalVisualPassClaim: false,
      receipt: status()
    });
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      parentContract: PARENT_CONTRACT,
      file: FILE,

      parentReliefExpressionDetected: state.parentReliefExpressionDetected,
      parentReliefExpressionReady: state.parentReliefExpressionReady,
      parentContractValid: state.parentContractValid,

      landformSystemsReady: state.landformSystemsReady,
      directDownstreamFromReliefExpression: true,
      usesReliefExpressionAsPrimarySource: true,
      usesElevationTrackAsPrimarySource: false,
      usesDryTerrainAsPrimarySource: false,

      mountainRangeCount: state.mountainRanges.length,
      landmarkCount: state.landmarks.length,
      plateauCount: state.plateaus.length,
      landformBasinCount: state.landformBasins.length,
      cliffSystemCount: state.cliffSystems.length,
      continentLandformProfileCount: state.continentLandformProfiles.length,

      carrierMayConsume: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      landmarksArePhysicalAnchorsOnly: true,
      settlementAuthorized: false,
      cityAuthorized: false,
      technologySiteAuthorized: false,
      finalMapLabelAuthorized: false,

      hydrationHeld: true,
      activeHydration: false,
      futureFillOnly: true,
      edgeMaterialHeld: true,
      finalVisualPassClaim: false,

      failureReason: state.failureReason,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_LANDFORM_SYSTEMS_DIRECT_DOWNSTREAM_CHILD_DEPLOY_MARKER_v1"
    });
  }

  function publishStatus() {
    var payload = status();

    window.AUDRALIA_LANDFORM_SYSTEMS_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaLandformSystemsChild = CONTRACT;
      document.documentElement.dataset.audraliaLandformParentContract = PARENT_CONTRACT;
      document.documentElement.dataset.audraliaLandformSystemsReady = String(state.landformSystemsReady);
      document.documentElement.dataset.audraliaLandformDirectDownstreamFromReliefExpression = "true";
      document.documentElement.dataset.audraliaLandformUsesReliefExpressionAsPrimarySource = "true";
      document.documentElement.dataset.audraliaLandformUsesElevationTrackAsPrimarySource = "false";
      document.documentElement.dataset.audraliaLandformUsesDryTerrainAsPrimarySource = "false";
      document.documentElement.dataset.audraliaLandformChildDrawsVisuals = "false";
      document.documentElement.dataset.audraliaLandformHydrationHeld = "true";
      document.documentElement.dataset.audraliaLandformActiveHydration = "false";
      document.documentElement.dataset.audraliaLandformFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function init() {
    rebuildLandformSystems();

    setTimeout(rebuildLandformSystems, 180);
    setTimeout(rebuildLandformSystems, 640);
    setTimeout(rebuildLandformSystems, 1200);
  }

  var API = Object.freeze({
    contract: CONTRACT,
    parentContract: PARENT_CONTRACT,
    status: status,
    rebuildLandformSystems: rebuildLandformSystems,
    getLandformSystemsPacket: getLandformSystemsPacket,
    getCarrierLandformPacket: getCarrierLandformPacket,
    sampleLandformAt: sampleLandformAt,
    getMountainRangePacket: getMountainRangePacket,
    getLandmarkPacket: getLandmarkPacket
  });

  window.AUDRALIA_LANDFORM_SYSTEMS_CHILD = API;
  window.AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD = API;
  window.AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD = API;

  init();
})();
