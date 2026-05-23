// /assets/audralia/clean/terrain/audralia.landform-systems.child.js
// AUDRALIA_LANDFORM_SYSTEMS_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1
// Full-file replacement.
// Family: AUDRALIA_RELIEF_LANDFORM_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1
// Scope: landform systems child only.
// Purpose: expose carrier-valid landform packet and embed planet psychology as formed-system narrative metadata.
// Does not own: terrain truth, elevation truth, relief truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.landform-systems.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

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

  var PSYCHOLOGY_MAP = Object.freeze({
    mountainRange: Object.freeze({
      psychologicalRole: "long_form_conviction_backbone_sustained_direction",
      narrativeFunction: "forms the durable directional backbone of a continent",
      ethicalPressure: "conviction",
      futureExpression: "supports routes, watershed edges, and settlement orientation",
      audraliaMeaning: "Audralia learns to stand by forming backbones before borders",
      terrainSystemMeaning: "continuous high-relief structure"
    }),
    plateau: Object.freeze({
      psychologicalRole: "stability_sustained_readiness_durable_ground",
      narrativeFunction: "provides usable high ground that does not collapse into drama",
      ethicalPressure: "stability",
      futureExpression: "future settlement, observation, and infrastructure shelf",
      audraliaMeaning: "Audralia makes readiness durable instead of spectacular",
      terrainSystemMeaning: "broad stable elevated surface"
    }),
    landmark: Object.freeze({
      psychologicalRole: "memory_anchor_recognizable_identity_point",
      narrativeFunction: "gives the planet remembered points that can be found again",
      ethicalPressure: "memory",
      futureExpression: "navigation, story identity, and cultural mapping",
      audraliaMeaning: "Audralia becomes knowable by giving memory a place",
      terrainSystemMeaning: "recognizable anchor feature"
    }),
    basin: Object.freeze({
      psychologicalRole: "receptive_center_future_hydration_bowl",
      narrativeFunction: "holds future water capacity without activating water",
      ethicalPressure: "receptivity",
      futureExpression: "future lake, marsh, wetland, or aquifer candidate",
      audraliaMeaning: "Audralia stores future life in receiving centers",
      terrainSystemMeaning: "bowl, depression, or receiving basin"
    }),
    cliff: Object.freeze({
      psychologicalRole: "consequence_edge_boundary_visibility",
      narrativeFunction: "makes limits visible instead of letting boundaries blur",
      ethicalPressure: "accountability",
      futureExpression: "edge control, hazard marking, and route discipline",
      audraliaMeaning: "Audralia gives consequence an edge so movement can respect it",
      terrainSystemMeaning: "steep boundary or relief break"
    }),
    coastalShelf: Object.freeze({
      psychologicalRole: "transition_readiness_dry_to_water_threshold",
      narrativeFunction: "prepares a dry threshold where future water may meet land",
      ethicalPressure: "transition",
      futureExpression: "future coastline logic without current ocean activation",
      audraliaMeaning: "Audralia prepares thresholds before opening water",
      terrainSystemMeaning: "coastal shelf readiness"
    }),
    beachReadiness: Object.freeze({
      psychologicalRole: "limited_special_transition_field_not_default_coastline",
      narrativeFunction: "marks rare, intentional access points between dry truth and future water",
      ethicalPressure: "restraint",
      futureExpression: "future beach candidate, not default coastline",
      audraliaMeaning: "Audralia treats beaches as special invitations, not automatic edges",
      terrainSystemMeaning: "limited beach transition readiness"
    }),
    continentProfile: Object.freeze({
      psychologicalRole: "large_scale_psychological_geography",
      narrativeFunction: "binds landform systems into continent-level meaning",
      ethicalPressure: "integration",
      futureExpression: "future climate, ecology, settlement, and route personality",
      audraliaMeaning: "Audralia lets continent shape carry psychological geography",
      terrainSystemMeaning: "continent-wide system profile"
    })
  });

  var state = {
    dryTerrainApi: null,
    reliefApi: null,
    dryTerrainDetected: false,
    reliefDetected: false,
    dryTerrainPacket: null,
    dryCarrierPacket: null,
    reliefCarrierPacket: null,

    mountainRanges: [],
    landmarks: [],
    plateaus: [],
    landformBasins: [],
    cliffSystems: [],
    coastalShelves: [],
    beachReadinessSystems: [],
    continentLandformProfiles: [],

    built: false,
    buildCount: 0,
    errors: [],
    lastBuiltAt: null
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

  function nodeId(node, index) {
    return String(node.nodeId || node.seatKey || node.id || "source-" + index);
  }

  function numeric(node, key, fallback) {
    var value = Number(node && node[key]);
    return Number.isFinite(value) ? value : fallback;
  }

  function withPsychology(target, role) {
    var p = PSYCHOLOGY_MAP[role] || PSYCHOLOGY_MAP.continentProfile;
    target.psychologicalRole = p.psychologicalRole;
    target.narrativeFunction = p.narrativeFunction;
    target.ethicalPressure = p.ethicalPressure;
    target.futureExpression = p.futureExpression;
    target.audraliaMeaning = p.audraliaMeaning;
    target.terrainSystemMeaning = p.terrainSystemMeaning;
    target.planetPsychologyActive = true;
    target.planetPsychologyNarrativeClear = true;
    target.psychologyOwnsNarrativeMeaningOnly = true;
    target.psychologyDoesNotOwnTerrainTruth = true;
    target.psychologyDoesNotOwnElevationTruth = true;
    target.psychologyDoesNotOwnReliefTruth = true;
    target.psychologyDoesNotOwnHydrationTruth = true;
    target.psychologyDoesNotOwnVisualPass = true;
    return target;
  }

  function detectParents() {
    var dryApi = firstGlobal(DRY_TERRAIN_GLOBALS);
    var reliefApi = firstGlobal(RELIEF_GLOBALS);

    state.dryTerrainApi = dryApi;
    state.reliefApi = reliefApi;
    state.dryTerrainDetected = Boolean(dryApi);
    state.reliefDetected = Boolean(reliefApi);

    state.dryTerrainPacket = null;
    state.dryCarrierPacket = null;
    state.reliefCarrierPacket = null;

    if (dryApi) {
      state.dryCarrierPacket = safeCall("dryTerrain", dryApi, "getCarrierTerrainPacket", "audralia-landform-systems-child", { compact: false });
      state.dryTerrainPacket = safeCall("dryTerrain", dryApi, "getDryRevealedTerrainPacket", "audralia-landform-systems-child", { compact: false });
    }

    if (reliefApi) {
      state.reliefCarrierPacket = safeCall("reliefExpression", reliefApi, "getCarrierReliefPacket", "audralia-landform-systems-child", { compact: false });
    }
  }

  function dryPacket() {
    return state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;
  }

  function dryNodes() {
    var packet = dryPacket();
    if (packet && Array.isArray(packet.nodes) && packet.nodes.length) return packet.nodes;

    var fallback = [];
    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var index = y * RADIAL_NODES + x;
        fallback.push({
          nodeId: "fallback-source-" + index,
          seatKey: "fallback-seat-" + index,
          seatIndex: index,
          nodeIndex: index,
          x: x,
          y: y,
          dryElevation: 0.46 + Math.sin(x * 1.618) * 0.08 + Math.cos(y * 0.86) * 0.09,
          ridgePressure: Math.max(0, Math.sin((x + y) * 0.72) * 0.55),
          basinPressure: Math.max(0, Math.cos((x - y) * 0.48) * 0.50),
          valleyPressure: Math.max(0, Math.sin(y * 0.92) * 0.44),
          summitPressure: Math.max(0, Math.cos(x * 0.72 + y * 0.18) * 0.42),
          shelfPressure: Math.max(0, Math.sin(y * 0.35) * 0.38),
          trenchPressure: Math.max(0, Math.cos((x + 3) * 0.64) * 0.30),
          gapPressure: Math.max(0, Math.sin((x - y) * 0.38) * 0.34),
          formerHydrosphereCarvingValue: Math.max(0, Math.cos((x + y) * 0.30) * 0.42),
          futureFillEligible: y > 8
        });
      }
    }

    return fallback;
  }

  function reliefSamples() {
    return state.reliefCarrierPacket && Array.isArray(state.reliefCarrierPacket.reliefSamples)
      ? state.reliefCarrierPacket.reliefSamples
      : [];
  }

  function reliefSampleByNodeId() {
    var index = {};
    reliefSamples().forEach(function (sample) {
      if (sample && sample.parentNodeId) index[sample.parentNodeId] = sample;
    });
    return index;
  }

  function averageFromNodes(nodes, key, fallback) {
    if (!nodes.length) return fallback || 0;
    return nodes.reduce(function (sum, node) {
      return sum + Number(node[key] || 0);
    }, 0) / nodes.length;
  }

  function chunkByPredicate(nodes, predicate, size, limit) {
    var groups = [];
    var current = [];

    nodes.forEach(function (node, index) {
      if (predicate(node, index)) {
        current.push({ node: node, index: index });
        if (current.length >= size) {
          groups.push(current);
          current = [];
        }
      } else if (current.length >= 2) {
        groups.push(current);
        current = [];
      } else {
        current = [];
      }
    });

    if (current.length >= 2) groups.push(current);

    return groups.slice(0, limit || 24);
  }

  function nodeIds(items) {
    return items.map(function (item) {
      return nodeId(item.node, item.index);
    });
  }

  function buildMountainRanges(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        return numeric(node, "ridgePressure", 0) > 0.32 || numeric(node, "mountainPressure", 0) > 0.28 || numeric(node, "summitPressure", 0) > 0.34;
      },
      6,
      22
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var ids = nodeIds(items);
      var avgRelief = averageFromNodes(itemNodes, "ridgePressure", 0) * 0.46 +
        averageFromNodes(itemNodes, "summitPressure", 0) * 0.34 +
        averageFromNodes(itemNodes, "dryElevation", 0.5) * 0.20;

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-MOUNTAIN-RANGE-" + String(index).padStart(3, "0"),
        landformType: "mountain_range",
        nodeIds: ids,
        summitNodeIds: ids.slice(0, 4),
        averageReliefIntensity: round(clamp(avgRelief, 0, 1), 4),
        watershedAuthority: round(clamp(avgRelief * 0.88 + 0.08, 0, 1), 4),
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, "mountainRange"));
    });
  }

  function buildPlateaus(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        var elevation = numeric(node, "dryElevation", numeric(node, "elevation", 0.5));
        var ridge = numeric(node, "ridgePressure", 0);
        var basin = numeric(node, "basinPressure", 0);
        return elevation > 0.48 && elevation < 0.70 && ridge < 0.46 && basin < 0.44;
      },
      8,
      20
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var elevation = averageFromNodes(itemNodes, "dryElevation", 0.5);
      var stability = 1 - Math.abs(elevation - 0.58);

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-PLATEAU-" + String(index).padStart(3, "0"),
        landformType: "plateau",
        nodeIds: nodeIds(items),
        averageElevation: round(elevation, 4),
        surfaceContinuity: round(clamp(stability, 0, 1), 4),
        slopeStability: round(clamp(stability * 0.86 + 0.08, 0, 1), 4),
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, "plateau"));
    });
  }

  function buildBasins(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        return numeric(node, "basinPressure", 0) > 0.28 || numeric(node, "gapPressure", 0) > 0.42 || Boolean(node.futureFillEligible);
      },
      7,
      24
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var basin = averageFromNodes(itemNodes, "basinPressure", 0);
      var gap = averageFromNodes(itemNodes, "gapPressure", 0);
      var carving = averageFromNodes(itemNodes, "formerHydrosphereCarvingValue", 0);
      var strength = clamp(basin * 0.52 + gap * 0.24 + carving * 0.24, 0, 1);

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-LANDFORM-BASIN-" + String(index).padStart(3, "0"),
        landformType: "landform_basin",
        nodeIds: nodeIds(items),
        basinDepthStrength: round(strength, 4),
        futureFillPriority: round(clamp(strength * 0.82 + 0.10, 0, 1), 4),
        hydrationBoundaryEligible: true,
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      }, "basin"));
    });
  }

  function buildCliffs(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        return numeric(node, "escarpmentPressure", 0) > 0.24 ||
          numeric(node, "ridgePressure", 0) + numeric(node, "trenchPressure", 0) > 0.70;
      },
      5,
      22
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var ridge = averageFromNodes(itemNodes, "ridgePressure", 0);
      var trench = averageFromNodes(itemNodes, "trenchPressure", 0);
      var escarpment = averageFromNodes(itemNodes, "escarpmentPressure", 0);
      var strength = clamp(ridge * 0.36 + trench * 0.34 + escarpment * 0.30, 0.18, 1);

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-CLIFF-SYSTEM-" + String(index).padStart(3, "0"),
        landformType: "cliff_system",
        nodeIds: nodeIds(items),
        reliefBreakStrength: round(strength, 4),
        consequenceEdge: true,
        boundaryVisibility: round(clamp(strength * 0.92, 0, 1), 4),
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, "cliff"));
    });
  }

  function buildLandmarks(nodes) {
    var reliefById = reliefSampleByNodeId();
    var scored = nodes.map(function (node, index) {
      var id = nodeId(node, index);
      var relief = reliefById[id] || {};
      var elevation = numeric(node, "dryElevation", numeric(node, "elevation", 0.5));
      var score =
        numeric(node, "summitPressure", 0) * 0.30 +
        numeric(node, "ridgePressure", 0) * 0.22 +
        numeric(node, "basinPressure", 0) * 0.18 +
        numeric(node, "gapPressure", 0) * 0.10 +
        Number(relief.reliefIntensity || 0) * 0.20 +
        Math.abs(elevation - 0.5) * 0.18;

      return { node: node, index: index, id: id, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    return scored.slice(0, 64).map(function (item, index) {
      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-LANDMARK-" + String(index).padStart(3, "0"),
        landformType: "landmark",
        anchorNodeId: item.id,
        nodeIds: [item.id],
        landmarkStrength: round(clamp(item.score, 0, 1), 4),
        recognizableIdentityPoint: true,
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, "landmark"));
    });
  }

  function buildCoastalShelves(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        return numeric(node, "shelfPressure", 0) > 0.24 || numeric(node, "formerHydrosphereCarvingValue", 0) > 0.44;
      },
      7,
      18
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var shelf = averageFromNodes(itemNodes, "shelfPressure", 0);
      var carving = averageFromNodes(itemNodes, "formerHydrosphereCarvingValue", 0);
      var readiness = clamp(shelf * 0.58 + carving * 0.42, 0, 1);

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-COASTAL-SHELF-" + String(index).padStart(3, "0"),
        landformType: "coastal_shelf_readiness",
        nodeIds: nodeIds(items),
        coastalReadinessScore: round(readiness, 4),
        dryToWaterThreshold: true,
        futureWaterOnly: true,
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      }, "coastalShelf"));
    });
  }

  function buildBeachReadiness(nodes) {
    return chunkByPredicate(
      nodes,
      function (node) {
        var shelf = numeric(node, "shelfPressure", 0);
        var basin = numeric(node, "basinPressure", 0);
        var gap = numeric(node, "gapPressure", 0);
        var elevation = numeric(node, "dryElevation", numeric(node, "elevation", 0.5));
        return shelf > 0.30 && basin > 0.18 && gap < 0.62 && elevation > 0.34 && elevation < 0.62;
      },
      4,
      12
    ).map(function (items, index) {
      var itemNodes = items.map(function (item) { return item.node; });
      var beach = clamp(
        averageFromNodes(itemNodes, "shelfPressure", 0) * 0.42 +
        averageFromNodes(itemNodes, "basinPressure", 0) * 0.24 +
        (1 - Math.abs(averageFromNodes(itemNodes, "dryElevation", 0.5) - 0.48)) * 0.18,
        0,
        1
      );

      return Object.freeze(withPsychology({
        landformId: "AUDRALIA-BEACH-READINESS-" + String(index).padStart(3, "0"),
        landformType: "beach_readiness",
        nodeIds: nodeIds(items),
        beachEligibilityScore: round(beach, 4),
        limitedSpecialTransitionField: true,
        defaultCoastline: false,
        futureWaterOnly: true,
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      }, "beachReadiness"));
    });
  }

  function buildContinentProfiles(nodes) {
    var continentBuckets = {};

    nodes.forEach(function (node, index) {
      var key = String(node.regionSeed || node.continentId || "audralia-general");
      if (!continentBuckets[key]) continentBuckets[key] = [];
      continentBuckets[key].push({ node: node, index: index });
    });

    return Object.keys(continentBuckets).map(function (key, index) {
      var items = continentBuckets[key];
      var itemNodes = items.map(function (item) { return item.node; });
      var elevation = averageFromNodes(itemNodes, "dryElevation", 0.5);
      var ridge = averageFromNodes(itemNodes, "ridgePressure", 0);
      var basin = averageFromNodes(itemNodes, "basinPressure", 0);
      var shelf = averageFromNodes(itemNodes, "shelfPressure", 0);

      return Object.freeze(withPsychology({
        continentProfileId: "AUDRALIA-CONTINENT-LANDFORM-PROFILE-" + String(index).padStart(2, "0"),
        continentId: key,
        continentName: key.replace(/-/g, " ").replace(/\b\w/g, function (letter) { return letter.toUpperCase(); }),
        nodeIds: nodeIds(items).slice(0, 48),
        nodeCount: items.length,
        averageElevation: round(elevation, 4),
        ridgeContinuity: round(ridge, 4),
        basinReceptivity: round(basin, 4),
        shelfTransitionReadiness: round(shelf, 4),
        largeScalePsychologicalGeography: true,
        carrierMayConsume: true,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, "continentProfile"));
    });
  }

  function buildLandformPacket() {
    detectParents();

    var nodes = dryNodes();

    state.mountainRanges = Object.freeze(buildMountainRanges(nodes));
    state.plateaus = Object.freeze(buildPlateaus(nodes));
    state.landformBasins = Object.freeze(buildBasins(nodes));
    state.cliffSystems = Object.freeze(buildCliffs(nodes));
    state.landmarks = Object.freeze(buildLandmarks(nodes));
    state.coastalShelves = Object.freeze(buildCoastalShelves(nodes));
    state.beachReadinessSystems = Object.freeze(buildBeachReadiness(nodes));
    state.continentLandformProfiles = Object.freeze(buildContinentProfiles(nodes));

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();

    return true;
  }

  function status() {
    if (!state.built) buildLandformPacket();

    return {
      contract: CONTRACT,
      family: FAMILY,
      file: FILE,

      landformSystemsReady: true,
      carrierMayConsume: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      dryTerrainDetected: state.dryTerrainDetected,
      reliefDetected: state.reliefDetected,

      mountainRangeCount: state.mountainRanges.length,
      landmarkCount: state.landmarks.length,
      plateauCount: state.plateaus.length,
      landformBasinCount: state.landformBasins.length,
      cliffSystemCount: state.cliffSystems.length,
      coastalShelfCount: state.coastalShelves.length,
      beachReadinessSystemCount: state.beachReadinessSystems.length,
      continentLandformProfileCount: state.continentLandformProfiles.length,

      planetPsychologyActive: true,
      planetPsychologyNarrativeClear: true,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      buildCount: state.buildCount,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_LANDFORM_SYSTEMS_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_DEPLOY_MARKER_v1"
    };
  }

  function getCarrierLandformPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildLandformPacket();

    return {
      contract: CONTRACT,
      family: FAMILY,
      packetType: "carrier_landform_systems_packet_with_planet_psychology",
      requester: requester || "unknown",

      landformSystemsReady: true,
      carrierMayConsume: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      mountainRanges: state.mountainRanges,
      landmarks: state.landmarks,
      plateaus: state.plateaus,
      landformBasins: state.landformBasins,
      cliffSystems: state.cliffSystems,
      coastalShelves: state.coastalShelves,
      beachReadinessSystems: state.beachReadinessSystems,
      continentLandformProfiles: state.continentLandformProfiles,

      planetPsychologyActive: true,
      planetPsychologyNarrativeClear: true,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,
      psychologyMap: PSYCHOLOGY_MAP,

      terrainTruthSource: "dry terrain child",
      reliefTruthSource: "relief expression child when available",
      landformSystemTruthChild: true,
      carrierDisplaysOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getLandformSystemsPacket(requester, options) {
    return getCarrierLandformPacket(requester, options);
  }

  buildLandformPacket();

  var api = {
    contract: CONTRACT,
    family: FAMILY,
    status: status,
    getCarrierLandformPacket: getCarrierLandformPacket,
    getLandformSystemsPacket: getLandformSystemsPacket,
    rebuild: buildLandformPacket
  };

  window.AUDRALIA_LANDFORM_SYSTEMS_CHILD = api;
  window.AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD = api;
  window.AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD = api;
})();
