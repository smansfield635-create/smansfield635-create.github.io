// /assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js
// AUDRALIA_ELEVATION_RELIEF_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1
// Full-file replacement.
// Family: AUDRALIA_RELIEF_LANDFORM_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1
// Scope: relief expression child only.
// Purpose: expose carrier-valid relief packet and embed planet psychology as narrative metadata.
// Does not own: terrain truth, landform truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_RELIEF_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var PSYCHOLOGY_MAP = Object.freeze({
    ridge: Object.freeze({
      psychologicalRole: "discipline_direction_resistance",
      narrativeFunction: "gives terrain a directional spine and visible resistance",
      ethicalPressure: "discipline",
      futureExpression: "supports routes, mountain chains, and boundary structure",
      audraliaMeaning: "Audralia learns direction by carrying pressure without scattering"
    }),
    basin: Object.freeze({
      psychologicalRole: "receptivity_memory_future_fill",
      narrativeFunction: "holds received pressure and remembers where future water may return",
      ethicalPressure: "receptivity",
      futureExpression: "future hydration bowl and ecological receiving field",
      audraliaMeaning: "Audralia keeps memory in low places before water is restored"
    }),
    valley: Object.freeze({
      psychologicalRole: "passage_humility_repair",
      narrativeFunction: "opens movement through terrain without forcing the summit",
      ethicalPressure: "humility",
      futureExpression: "future corridor for flow, migration, and repair",
      audraliaMeaning: "Audralia allows movement through humility rather than domination"
    }),
    summit: Object.freeze({
      psychologicalRole: "clarity_aspiration_signal",
      narrativeFunction: "marks the high signal where terrain becomes orientation",
      ethicalPressure: "clarity",
      futureExpression: "navigation, atmosphere-readiness, and highland identity",
      audraliaMeaning: "Audralia raises signal without claiming final perfection"
    }),
    shelf: Object.freeze({
      psychologicalRole: "patience_time_depth_transition",
      narrativeFunction: "stabilizes gradual transition between elevation states",
      ethicalPressure: "patience",
      futureExpression: "coastal readiness, terrace formation, and slow settlement logic",
      audraliaMeaning: "Audralia forms usable ground through time-depth"
    }),
    trench: Object.freeze({
      psychologicalRole: "restraint_contained_force",
      narrativeFunction: "contains force below the surface without letting it spill randomly",
      ethicalPressure: "restraint",
      futureExpression: "future channel, boundary, and controlled-energy corridor",
      audraliaMeaning: "Audralia disciplines force before it becomes motion"
    }),
    gap: Object.freeze({
      psychologicalRole: "forgiveness_release_reentry",
      narrativeFunction: "creates lawful re-entry where blocked pressure can release",
      ethicalPressure: "forgiveness",
      futureExpression: "repair seam, watershed aperture, and passage reset",
      audraliaMeaning: "Audralia does not erase breaks; it gives them a return path"
    }),
    highland: Object.freeze({
      psychologicalRole: "discernment_perspective_atmosphere_readiness",
      narrativeFunction: "supports clear view, pressure reading, and atmospheric threshold",
      ethicalPressure: "discernment",
      futureExpression: "future climate observation and long-range signal field",
      audraliaMeaning: "Audralia gains perspective where elevation meets breath"
    }),
    lowland: Object.freeze({
      psychologicalRole: "humility_receiving_ground_future_water_memory",
      narrativeFunction: "receives pressure, sediment, and future hydration memory",
      ethicalPressure: "humility",
      futureExpression: "future wetland, basin, and life-receiving ground",
      audraliaMeaning: "Audralia begins life-readiness in receiving ground"
    }),
    futureFill: Object.freeze({
      psychologicalRole: "remembered_capacity_for_later_hydration",
      narrativeFunction: "marks water capacity without activating water",
      ethicalPressure: "restraint",
      futureExpression: "future hydration candidate, not current ocean, river, or lake",
      audraliaMeaning: "Audralia remembers water without pretending water has returned"
    })
  });

  var state = {
    dryTerrainApi: null,
    dryTerrainDetected: false,
    dryTerrainValidated: false,
    dryTerrainStatus: null,
    dryTerrainPacket: null,
    dryCarrierPacket: null,

    reliefSamples: [],
    ridgeReliefExpressions: [],
    basinDepthExpressions: [],
    valleyFlowExpressions: [],
    summitReliefExpressions: [],
    highlandReliefExpressions: [],
    lowlandReliefExpressions: [],
    shelfReliefExpressions: [],
    futureFillReliefExpressions: [],

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

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function nodeId(node, index) {
    return String(node.nodeId || node.seatKey || node.id || "source-" + index);
  }

  function numeric(node, key, fallback) {
    var value = Number(node && node[key]);
    return Number.isFinite(value) ? value : fallback;
  }

  function detectDryTerrain() {
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryTerrainApi = api;
    state.dryTerrainDetected = Boolean(api);
    state.dryTerrainValidated = false;
    state.dryTerrainStatus = null;
    state.dryTerrainPacket = null;
    state.dryCarrierPacket = null;

    if (!api) return false;

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-relief-expression-child", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-relief-expression-child", { compact: false });

    state.dryTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true
    );

    if (!state.dryTerrainValidated && state.dryCarrierPacket) {
      state.dryTerrainValidated = Boolean(
        state.dryCarrierPacket.carrierTerrainPacketReady === true &&
        state.dryCarrierPacket.carrierInventsTerrain === false &&
        state.dryCarrierPacket.finalVisualPassClaim === false
      );
    }

    return state.dryTerrainValidated;
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

  function terrainRoleForNode(node) {
    var ridge = numeric(node, "ridgePressure", 0);
    var basin = numeric(node, "basinPressure", 0);
    var valley = numeric(node, "valleyPressure", 0);
    var summit = numeric(node, "summitPressure", 0);
    var shelf = numeric(node, "shelfPressure", 0);
    var trench = numeric(node, "trenchPressure", 0);
    var gap = numeric(node, "gapPressure", 0);

    var best = "lowland";
    var value = -Infinity;
    var scores = {
      ridge: ridge,
      basin: basin,
      valley: valley,
      summit: summit,
      shelf: shelf,
      trench: trench,
      gap: gap
    };

    Object.keys(scores).forEach(function (key) {
      if (scores[key] > value) {
        best = key;
        value = scores[key];
      }
    });

    if (numeric(node, "dryElevation", numeric(node, "elevation", 0.5)) > 0.68 && summit < 0.28) best = "highland";
    if (numeric(node, "dryElevation", numeric(node, "elevation", 0.5)) < 0.38 && basin < 0.28) best = "lowland";

    return best;
  }

  function psychologyForRole(role) {
    if (role === "future_fill") return PSYCHOLOGY_MAP.futureFill;
    return PSYCHOLOGY_MAP[role] || PSYCHOLOGY_MAP.lowland;
  }

  function withPsychology(target, role) {
    var p = psychologyForRole(role);
    target.psychologicalRole = p.psychologicalRole;
    target.narrativeFunction = p.narrativeFunction;
    target.ethicalPressure = p.ethicalPressure;
    target.futureExpression = p.futureExpression;
    target.audraliaMeaning = p.audraliaMeaning;
    target.planetPsychologyActive = true;
    target.planetPsychologyNarrativeClear = true;
    target.psychologyOwnsNarrativeMeaningOnly = true;
    target.psychologyDoesNotOwnTerrainTruth = true;
    target.psychologyDoesNotOwnElevationTruth = true;
    target.psychologyDoesNotOwnReliefTruth = true;
    target.psychologyDoesNotOwnLandformTruth = true;
    target.psychologyDoesNotOwnHydrationTruth = true;
    target.psychologyDoesNotOwnVisualPass = true;
    return target;
  }

  function buildReliefSamples(nodes) {
    return nodes.map(function (node, index) {
      var x = numeric(node, "x", numeric(node, "radial", index % RADIAL_NODES));
      var y = numeric(node, "y", numeric(node, "band", Math.floor(index / RADIAL_NODES)));
      var ll = terrainSeatToLonLat(x, y);
      var elevation = clamp(numeric(node, "dryElevation", numeric(node, "elevation", 0.5)), 0, 1);
      var ridge = clamp(numeric(node, "ridgePressure", 0), 0, 1);
      var basin = clamp(numeric(node, "basinPressure", 0), 0, 1);
      var valley = clamp(numeric(node, "valleyPressure", 0), 0, 1);
      var summit = clamp(numeric(node, "summitPressure", 0), 0, 1);
      var shelf = clamp(numeric(node, "shelfPressure", 0), 0, 1);
      var trench = clamp(numeric(node, "trenchPressure", 0), 0, 1);
      var gap = clamp(numeric(node, "gapPressure", 0), 0, 1);
      var carving = clamp(numeric(node, "formerHydrosphereCarvingValue", 0), 0, 1);
      var futureFill = Boolean(node.futureFillEligible) || basin + gap + carving > 1.06;
      var role = terrainRoleForNode(node);

      var reliefIntensity = clamp(
        ridge * 0.22 +
        basin * 0.16 +
        valley * 0.13 +
        summit * 0.20 +
        shelf * 0.10 +
        trench * 0.12 +
        gap * 0.07 +
        Math.abs(elevation - 0.5) * 0.28,
        0,
        1
      );

      return Object.freeze(withPsychology({
        reliefSampleId: "AUDRALIA-RELIEF-SAMPLE-" + String(index).padStart(3, "0"),
        parentNodeId: nodeId(node, index),
        nodeId: node.nodeId || "source-" + index,
        seatKey: node.seatKey || "seat-" + index,
        sourceSeatIndex: Number(node.seatIndex || node.nodeIndex || index),
        x: round(x, 4),
        y: round(y, 4),
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),
        elevation: round(elevation, 4),
        reliefIntensity: round(reliefIntensity, 4),
        ridgeHighlight: round(clamp(ridge * 0.75 + summit * 0.20, 0, 1), 4),
        basinShadow: round(clamp(basin * 0.72 + gap * 0.22 + carving * 0.14, 0, 1), 4),
        valleyFlowPotential: round(clamp(valley * 0.68 + gap * 0.18 + carving * 0.22, 0, 1), 4),
        summitEmphasis: round(clamp(summit * 0.82 + elevation * 0.18, 0, 1), 4),
        shelfTransition: round(clamp(shelf * 0.78 + carving * 0.12, 0, 1), 4),
        trenchContainment: round(clamp(trench * 0.88 + ridge * 0.08, 0, 1), 4),
        gapRelease: round(clamp(gap * 0.82 + valley * 0.12, 0, 1), 4),
        futureFillPressure: round(futureFill ? clamp(basin * 0.42 + gap * 0.30 + carving * 0.28, 0.18, 1) : 0, 4),
        carrierVisualRole: role,
        reliefRole: role,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, role));
    });
  }

  function groupSequentialSamples(samples, predicate, groupSize, prefix, role, strengthKey) {
    var groups = [];
    var current = [];

    samples.forEach(function (sample) {
      if (predicate(sample)) {
        current.push(sample);
        if (current.length >= groupSize) {
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

    return groups.slice(0, 48).map(function (items, index) {
      var nodeIds = items.map(function (sample) { return sample.parentNodeId; });
      var avg = items.reduce(function (sum, sample) {
        return sum + Number(sample[strengthKey] || sample.reliefIntensity || 0);
      }, 0) / Math.max(1, items.length);

      return Object.freeze(withPsychology({
        expressionId: prefix + "-" + String(index).padStart(3, "0"),
        nodeIds: nodeIds,
        sampleCount: items.length,
        reliefExpressionReady: true,
        carrierMayConsume: true,
        reliefExpressionRole: role,
        ridgeReliefStrength: role === "ridge" ? round(avg, 4) : undefined,
        basinDepthStrength: role === "basin" ? round(avg, 4) : undefined,
        valleyFlowStrength: role === "valley" ? round(avg, 4) : undefined,
        summitReliefStrength: role === "summit" ? round(avg, 4) : undefined,
        shelfReliefStrength: role === "shelf" ? round(avg, 4) : undefined,
        futureFillReliefStrength: role === "future_fill" ? round(avg, 4) : undefined,
        averageReliefIntensity: round(avg, 4),
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      }, role));
    });
  }

  function buildReliefPacket() {
    detectDryTerrain();

    var nodes = dryNodes();
    var samples = buildReliefSamples(nodes);

    state.reliefSamples = Object.freeze(samples);

    state.ridgeReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.ridgeHighlight || 0) > 0.26; },
      5,
      "AUDRALIA-RIDGE-RELIEF",
      "ridge",
      "ridgeHighlight"
    ));

    state.basinDepthExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.basinShadow || 0) > 0.24; },
      6,
      "AUDRALIA-BASIN-DEPTH",
      "basin",
      "basinShadow"
    ));

    state.valleyFlowExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.valleyFlowPotential || 0) > 0.24; },
      6,
      "AUDRALIA-VALLEY-FLOW",
      "valley",
      "valleyFlowPotential"
    ));

    state.summitReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.summitEmphasis || 0) > 0.46; },
      3,
      "AUDRALIA-SUMMIT-RELIEF",
      "summit",
      "summitEmphasis"
    ));

    state.highlandReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.elevation || 0) > 0.64; },
      5,
      "AUDRALIA-HIGHLAND-RELIEF",
      "highland",
      "reliefIntensity"
    ));

    state.lowlandReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.elevation || 0) < 0.42; },
      5,
      "AUDRALIA-LOWLAND-RELIEF",
      "lowland",
      "basinShadow"
    ));

    state.shelfReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.shelfTransition || 0) > 0.20; },
      6,
      "AUDRALIA-SHELF-RELIEF",
      "shelf",
      "shelfTransition"
    ));

    state.futureFillReliefExpressions = Object.freeze(groupSequentialSamples(
      samples,
      function (sample) { return Number(sample.futureFillPressure || 0) > 0.18; },
      5,
      "AUDRALIA-FUTURE-FILL-RELIEF",
      "future_fill",
      "futureFillPressure"
    ));

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();

    return true;
  }

  function status() {
    if (!state.built) buildReliefPacket();

    return {
      contract: CONTRACT,
      family: FAMILY,
      file: FILE,

      reliefExpressionReady: true,
      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      dryTerrainDetected: state.dryTerrainDetected,
      dryTerrainValidated: state.dryTerrainValidated,
      reliefSampleCount: state.reliefSamples.length,
      ridgeReliefExpressionCount: state.ridgeReliefExpressions.length,
      basinDepthExpressionCount: state.basinDepthExpressions.length,
      valleyFlowExpressionCount: state.valleyFlowExpressions.length,
      summitReliefExpressionCount: state.summitReliefExpressions.length,
      highlandReliefExpressionCount: state.highlandReliefExpressions.length,
      lowlandReliefExpressionCount: state.lowlandReliefExpressions.length,
      shelfReliefExpressionCount: state.shelfReliefExpressions.length,
      futureFillReliefExpressionCount: state.futureFillReliefExpressions.length,

      planetPsychologyActive: true,
      planetPsychologyNarrativeClear: true,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnLandformTruth: true,
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
      deployMarker: "AUDRALIA_ELEVATION_RELIEF_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_DEPLOY_MARKER_v1"
    };
  }

  function getCarrierReliefPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildReliefPacket();

    return {
      contract: CONTRACT,
      family: FAMILY,
      packetType: "carrier_relief_expression_packet_with_planet_psychology",
      requester: requester || "unknown",

      reliefExpressionReady: true,
      carrierMayConsume: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      reliefSamples: state.reliefSamples,
      ridgeReliefExpressions: state.ridgeReliefExpressions,
      basinDepthExpressions: state.basinDepthExpressions,
      valleyFlowExpressions: state.valleyFlowExpressions,
      summitReliefExpressions: state.summitReliefExpressions,
      highlandReliefExpressions: state.highlandReliefExpressions,
      lowlandReliefExpressions: state.lowlandReliefExpressions,
      shelfReliefExpressions: state.shelfReliefExpressions,
      futureFillReliefExpressions: state.futureFillReliefExpressions,

      planetPsychologyActive: true,
      planetPsychologyNarrativeClear: true,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnLandformTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,
      psychologyMap: PSYCHOLOGY_MAP,

      terrainTruthSource: "dry terrain child",
      reliefTruthChild: true,
      carrierDisplaysOnly: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getReliefExpressionPacket(requester, options) {
    return getCarrierReliefPacket(requester, options);
  }

  buildReliefPacket();

  var api = {
    contract: CONTRACT,
    family: FAMILY,
    status: status,
    getCarrierReliefPacket: getCarrierReliefPacket,
    getReliefExpressionPacket: getReliefExpressionPacket,
    rebuild: buildReliefPacket
  };

  window.AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD = api;
  window.AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD = api;
  window.AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD = api;
})();
