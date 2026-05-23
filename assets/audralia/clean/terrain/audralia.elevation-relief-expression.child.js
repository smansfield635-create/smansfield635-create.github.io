// /assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js
// AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_TNT_v1
// Full-file replacement.
// Family: AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1
// Scope: relief expression child only.
// Purpose: restore realistic landmass authority by attaching relief + planet psychology metadata only to existing source terrain.
// Does not own: terrain truth, replacement geometry, landform truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_ELEVATION_RELIEF_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var PSYCHOLOGY_MAP = Object.freeze({
    ridge: Object.freeze({
      psychologicalRole: "discipline_direction_resistance",
      narrativeFunction: "directional terrain pressure already present in the source landmass",
      ethicalPressure: "discipline",
      futureExpression: "route spine, watershed hint, and boundary support",
      audraliaMeaning: "Audralia carries pressure without scattering its form"
    }),
    basin: Object.freeze({
      psychologicalRole: "receptivity_memory_future_fill",
      narrativeFunction: "receiving terrain pressure already present in the source landmass",
      ethicalPressure: "receptivity",
      futureExpression: "future hydration bowl without active water",
      audraliaMeaning: "Audralia remembers water capacity before water returns"
    }),
    valley: Object.freeze({
      psychologicalRole: "passage_humility_repair",
      narrativeFunction: "movement corridor implied by existing terrain pressure",
      ethicalPressure: "humility",
      futureExpression: "future flow path, migration path, and repair route",
      audraliaMeaning: "Audralia allows passage through received terrain rather than invented terrain"
    }),
    summit: Object.freeze({
      psychologicalRole: "clarity_aspiration_signal",
      narrativeFunction: "high-signal pressure implied by existing elevation",
      ethicalPressure: "clarity",
      futureExpression: "navigation, long-view signal, and highland identity",
      audraliaMeaning: "Audralia raises signal without claiming final visual pass"
    }),
    shelf: Object.freeze({
      psychologicalRole: "patience_time_depth_transition",
      narrativeFunction: "gradual transition already implied by source terrain",
      ethicalPressure: "patience",
      futureExpression: "coastal shelf readiness and terrace continuity",
      audraliaMeaning: "Audralia forms transition through time-depth"
    }),
    trench: Object.freeze({
      psychologicalRole: "restraint_contained_force",
      narrativeFunction: "contained terrain force already present in source pressure",
      ethicalPressure: "restraint",
      futureExpression: "controlled corridor, channel, or boundary pressure",
      audraliaMeaning: "Audralia contains force before motion"
    }),
    gap: Object.freeze({
      psychologicalRole: "forgiveness_release_reentry",
      narrativeFunction: "release aperture implied by existing terrain structure",
      ethicalPressure: "forgiveness",
      futureExpression: "repair seam, passage reset, and watershed opening",
      audraliaMeaning: "Audralia gives broken pressure a lawful return path"
    }),
    highland: Object.freeze({
      psychologicalRole: "discernment_perspective_atmosphere_readiness",
      narrativeFunction: "upper terrain perspective already present in source geometry",
      ethicalPressure: "discernment",
      futureExpression: "climate observation and atmosphere-readiness",
      audraliaMeaning: "Audralia gains perspective where elevation meets breath"
    }),
    lowland: Object.freeze({
      psychologicalRole: "humility_receiving_ground_future_water_memory",
      narrativeFunction: "receiving ground already present in source geometry",
      ethicalPressure: "humility",
      futureExpression: "future wetland, basin, or life-receiving ground",
      audraliaMeaning: "Audralia begins life-readiness in receiving ground"
    }),
    futureFill: Object.freeze({
      psychologicalRole: "remembered_capacity_for_later_hydration",
      narrativeFunction: "capacity marker only; no active water",
      ethicalPressure: "restraint",
      futureExpression: "future hydration candidate, not present water",
      audraliaMeaning: "Audralia remembers water without pretending water has returned"
    })
  });

  var state = {
    dryTerrainApi: null,
    dryTerrainDetected: false,
    dryTerrainValidated: false,
    sourcePacketDetected: false,
    sourceGeometryValid: false,
    sourceFailureReason: "source terrain not checked",
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
    reliefMetadataSummary: null,

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

  function readPacketNodes(packet) {
    if (!packet) return [];

    if (Array.isArray(packet.nodes)) return packet.nodes;
    if (packet.planetPhysicalTerrainPacket && Array.isArray(packet.planetPhysicalTerrainPacket.nodes)) return packet.planetPhysicalTerrainPacket.nodes;
    if (packet.dryRevealedTerrainPacket && Array.isArray(packet.dryRevealedTerrainPacket.nodes)) return packet.dryRevealedTerrainPacket.nodes;
    if (packet.terrainPacket && Array.isArray(packet.terrainPacket.nodes)) return packet.terrainPacket.nodes;
    if (packet.sourcePacket && Array.isArray(packet.sourcePacket.nodes)) return packet.sourcePacket.nodes;

    return [];
  }

  function detectDryTerrain() {
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryTerrainApi = api;
    state.dryTerrainDetected = Boolean(api);
    state.dryTerrainValidated = false;
    state.sourcePacketDetected = false;
    state.sourceGeometryValid = false;
    state.sourceFailureReason = "source terrain missing";
    state.dryTerrainStatus = null;
    state.dryTerrainPacket = null;
    state.dryCarrierPacket = null;

    if (!api) return false;

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-relief-metadata-only-child", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-relief-metadata-only-child", { compact: false });

    var directNodes = readPacketNodes(state.dryTerrainPacket);
    var carrierNodes = readPacketNodes(state.dryCarrierPacket);
    var nodes = directNodes.length ? directNodes : carrierNodes;

    state.sourcePacketDetected = Boolean(nodes.length);
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

    state.sourceGeometryValid = Boolean(nodes.length && nodes.some(function (node, index) {
      return Boolean(getNodePosition(node, index));
    }));

    state.sourceFailureReason = state.sourceGeometryValid ? "" : "valid source terrain nodes missing or unmappable";

    return state.sourceGeometryValid;
  }

  function dryNodes() {
    var directNodes = readPacketNodes(state.dryTerrainPacket);
    var carrierNodes = readPacketNodes(state.dryCarrierPacket);
    return directNodes.length ? directNodes : carrierNodes;
  }

  function getNodeId(node, index) {
    if (!node) return null;

    var id = node.nodeId || node.seatKey || node.id || node.key || node.sourceNodeId;
    if (id !== undefined && id !== null && String(id).trim()) return String(id);

    if (node.seatIndex !== undefined || node.nodeIndex !== undefined) {
      return "seat-" + String(node.seatIndex !== undefined ? node.seatIndex : node.nodeIndex);
    }

    return "source-index-" + String(index);
  }

  function getNodePosition(node, index) {
    if (!node) return null;

    var x = Number(node.x);
    var y = Number(node.y);

    if (!Number.isFinite(x) && Number.isFinite(Number(node.radial))) x = Number(node.radial);
    if (!Number.isFinite(y) && Number.isFinite(Number(node.band))) y = Number(node.band);

    if ((!Number.isFinite(x) || !Number.isFinite(y)) && Number.isFinite(Number(node.seatIndex))) {
      var seat = Number(node.seatIndex);
      x = seat % RADIAL_NODES;
      y = Math.floor(seat / RADIAL_NODES);
    }

    if ((!Number.isFinite(x) || !Number.isFinite(y)) && Number.isFinite(Number(node.nodeIndex))) {
      var nodeIndex = Number(node.nodeIndex);
      x = nodeIndex % RADIAL_NODES;
      y = Math.floor(nodeIndex / RADIAL_NODES);
    }

    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

    return {
      x: clamp(x, 0, RADIAL_NODES - 1),
      y: clamp(y, 0, FIBONACCI_BANDS - 1),
      sourceIndex: index
    };
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function numeric(node, keys, fallback) {
    var list = Array.isArray(keys) ? keys : [keys];

    for (var i = 0; i < list.length; i += 1) {
      var value = Number(node && node[list[i]]);
      if (Number.isFinite(value)) return value;
    }

    return fallback;
  }

  function terrainRoleForNode(node) {
    var elevation = numeric(node, ["dryElevation", "elevation", "height"], 0.5);
    var ridge = numeric(node, "ridgePressure", 0);
    var basin = numeric(node, "basinPressure", 0);
    var valley = numeric(node, "valleyPressure", 0);
    var summit = numeric(node, "summitPressure", 0);
    var shelf = numeric(node, "shelfPressure", 0);
    var trench = numeric(node, "trenchPressure", 0);
    var gap = numeric(node, "gapPressure", 0);

    var role = "lowland";
    var best = -Infinity;
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
      if (scores[key] > best) {
        best = scores[key];
        role = key;
      }
    });

    if (best <= 0.02 && elevation > 0.64) role = "highland";
    if (best <= 0.02 && elevation < 0.40) role = "lowland";

    return role;
  }

  function psychologyForRole(role) {
    if (role === "future_fill") return PSYCHOLOGY_MAP.futureFill;
    return PSYCHOLOGY_MAP[role] || PSYCHOLOGY_MAP.lowland;
  }

  function attachPsychology(target, role) {
    var psychology = psychologyForRole(role);

    target.psychologicalRole = psychology.psychologicalRole;
    target.narrativeFunction = psychology.narrativeFunction;
    target.ethicalPressure = psychology.ethicalPressure;
    target.futureExpression = psychology.futureExpression;
    target.audraliaMeaning = psychology.audraliaMeaning;

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

  function buildReliefSamplesFromSource(nodes) {
    var samples = [];

    nodes.forEach(function (node, index) {
      var position = getNodePosition(node, index);
      if (!position) return;

      var sourceNodeId = getNodeId(node, index);
      var ll = terrainSeatToLonLat(position.x, position.y);
      var elevation = clamp(numeric(node, ["dryElevation", "elevation", "height"], 0.5), 0, 1);
      var ridge = clamp(numeric(node, "ridgePressure", 0), 0, 1);
      var basin = clamp(numeric(node, "basinPressure", 0), 0, 1);
      var valley = clamp(numeric(node, "valleyPressure", 0), 0, 1);
      var summit = clamp(numeric(node, "summitPressure", 0), 0, 1);
      var shelf = clamp(numeric(node, "shelfPressure", 0), 0, 1);
      var trench = clamp(numeric(node, "trenchPressure", 0), 0, 1);
      var gap = clamp(numeric(node, "gapPressure", 0), 0, 1);
      var carving = clamp(numeric(node, "formerHydrosphereCarvingValue", 0), 0, 1);
      var role = terrainRoleForNode(node);

      var reliefIntensity = clamp(
        ridge * 0.18 +
        basin * 0.13 +
        valley * 0.10 +
        summit * 0.16 +
        shelf * 0.08 +
        trench * 0.10 +
        gap * 0.07 +
        Math.abs(elevation - 0.5) * 0.16,
        0,
        1
      );

      var futureFillPressure = clamp(
        basin * 0.30 +
        gap * 0.22 +
        carving * 0.20 +
        (node.futureFillEligible ? 0.16 : 0),
        0,
        1
      );

      samples.push(Object.freeze(attachPsychology({
        reliefSampleId: "AUDRALIA-RELIEF-METADATA-" + String(samples.length).padStart(3, "0"),
        parentNodeId: sourceNodeId,
        nodeId: sourceNodeId,
        seatKey: node.seatKey || sourceNodeId,
        sourceSeatIndex: Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : position.sourceIndex,

        x: round(position.x, 4),
        y: round(position.y, 4),
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),

        elevation: round(elevation, 4),
        reliefIntensity: round(reliefIntensity, 4),
        ridgeHighlight: round(clamp(ridge * 0.42 + summit * 0.10, 0, 1), 4),
        basinShadow: round(clamp(basin * 0.36 + gap * 0.12 + carving * 0.08, 0, 1), 4),
        valleyFlowPotential: round(clamp(valley * 0.34 + gap * 0.10 + carving * 0.10, 0, 1), 4),
        summitEmphasis: round(clamp(summit * 0.44 + elevation * 0.08, 0, 1), 4),
        shelfTransition: round(clamp(shelf * 0.36 + carving * 0.08, 0, 1), 4),
        trenchContainment: round(clamp(trench * 0.38 + ridge * 0.06, 0, 1), 4),
        gapRelease: round(clamp(gap * 0.38 + valley * 0.06, 0, 1), 4),
        futureFillPressure: round(futureFillPressure, 4),

        carrierVisualRole: role,
        reliefRole: role,
        metadataOnly: true,
        sourceGeometryPreserved: true,
        sourceDerivedNodeId: sourceNodeId,
        syntheticTerrainGenerated: false,
        fallbackTerrainGenerated: false,
        replacementLandmassGenerated: false,

        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      }, role)));
    });

    return Object.freeze(samples);
  }

  function buildMetadataSummary(samples) {
    var counts = {};
    var futureFillCount = 0;

    samples.forEach(function (sample) {
      var role = sample.reliefRole || "unassigned";
      counts[role] = (counts[role] || 0) + 1;
      if (Number(sample.futureFillPressure || 0) > 0.24) futureFillCount += 1;
    });

    return Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: true,
      sourceSampleCount: samples.length,
      roleCounts: counts,
      futureFillCandidateCount: futureFillCount,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      finalVisualPassClaim: false
    });
  }

  function buildEmptyExpressionArrays() {
    state.ridgeReliefExpressions = Object.freeze([]);
    state.basinDepthExpressions = Object.freeze([]);
    state.valleyFlowExpressions = Object.freeze([]);
    state.summitReliefExpressions = Object.freeze([]);
    state.highlandReliefExpressions = Object.freeze([]);
    state.lowlandReliefExpressions = Object.freeze([]);
    state.shelfReliefExpressions = Object.freeze([]);
    state.futureFillReliefExpressions = Object.freeze([]);
  }

  function buildReliefPacket() {
    detectDryTerrain();

    var nodes = dryNodes();

    if (!state.sourceGeometryValid || !nodes.length) {
      state.reliefSamples = Object.freeze([]);
      buildEmptyExpressionArrays();
      state.reliefMetadataSummary = Object.freeze({
        metadataOnly: true,
        sourceGeometryPreserved: false,
        sourceSampleCount: 0,
        held: true,
        heldReason: state.sourceFailureReason,
        syntheticTerrainGenerated: false,
        fallbackTerrainGenerated: false,
        replacementLandmassGenerated: false,
        childDrawsVisuals: false,
        finalVisualPassClaim: false
      });

      state.built = true;
      state.buildCount += 1;
      state.lastBuiltAt = new Date().toISOString();
      return false;
    }

    state.reliefSamples = buildReliefSamplesFromSource(nodes);
    buildEmptyExpressionArrays();
    state.reliefMetadataSummary = buildMetadataSummary(state.reliefSamples);

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();

    return state.reliefSamples.length > 0;
  }

  function ready() {
    return Boolean(state.sourceGeometryValid && state.reliefSamples.length);
  }

  function baseStatus() {
    if (!state.built) buildReliefPacket();

    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,

      reliefExpressionReady: isReady,
      carrierMayConsume: isReady,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,
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

      planetPsychologyActive: isReady,
      planetPsychologyNarrativeClear: isReady,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnLandformTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      buildCount: state.buildCount,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_DEPLOY_MARKER_v1"
    };
  }

  function status() {
    return baseStatus();
  }

  function getCarrierReliefPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildReliefPacket();

    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      packetType: "carrier_relief_expression_metadata_only_restoration_packet",
      requester: requester || "unknown",

      reliefExpressionReady: isReady,
      carrierMayConsume: isReady,
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
      reliefMetadataSummary: state.reliefMetadataSummary,

      planetPsychologyActive: isReady,
      planetPsychologyNarrativeClear: isReady,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnLandformTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,
      psychologyMap: PSYCHOLOGY_MAP,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,

      terrainTruthSource: "existing dry terrain child only",
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
    previousContract: PREVIOUS_CONTRACT,
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
