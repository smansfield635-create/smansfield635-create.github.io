// /assets/audralia/clean/terrain/audralia.landform-systems.child.js
// AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_TNT_v1
// Full-file replacement.
// Family: AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1
// Scope: landform systems child only.
// Purpose: restore realistic landmass authority by attaching landform + planet psychology metadata only to existing source terrain.
// Does not own: terrain truth, replacement geometry, elevation truth, relief truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_PLANET_PSYCHOLOGY_HANDOFF_RENEWAL_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1";
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
      narrativeFunction: "metadata describing existing high-pressure terrain continuity",
      ethicalPressure: "conviction",
      futureExpression: "route backbone and watershed implication",
      audraliaMeaning: "Audralia stands by preserving its original landmass backbone",
      terrainSystemMeaning: "source-derived high-relief metadata only"
    }),
    plateau: Object.freeze({
      psychologicalRole: "stability_sustained_readiness_durable_ground",
      narrativeFunction: "metadata describing existing stable terrain fields",
      ethicalPressure: "stability",
      futureExpression: "future settlement or inspection shelf",
      audraliaMeaning: "Audralia keeps durable ground without inventing new ground",
      terrainSystemMeaning: "source-derived stable elevated metadata only"
    }),
    landmark: Object.freeze({
      psychologicalRole: "memory_anchor_recognizable_identity_point",
      narrativeFunction: "metadata describing remembered source points",
      ethicalPressure: "memory",
      futureExpression: "navigation and identity marker",
      audraliaMeaning: "Audralia becomes recognizable through preserved source anchors",
      terrainSystemMeaning: "source-derived memory anchor metadata only"
    }),
    basin: Object.freeze({
      psychologicalRole: "receptive_center_future_hydration_bowl",
      narrativeFunction: "metadata describing existing receiving terrain",
      ethicalPressure: "receptivity",
      futureExpression: "future hydration bowl without active water",
      audraliaMeaning: "Audralia stores future life in preserved receiving centers",
      terrainSystemMeaning: "source-derived basin metadata only"
    }),
    cliff: Object.freeze({
      psychologicalRole: "consequence_edge_boundary_visibility",
      narrativeFunction: "metadata describing existing boundary pressure",
      ethicalPressure: "accountability",
      futureExpression: "hazard and boundary readability",
      audraliaMeaning: "Audralia gives consequence an edge without inventing one",
      terrainSystemMeaning: "source-derived relief-break metadata only"
    }),
    coastalShelf: Object.freeze({
      psychologicalRole: "transition_readiness_dry_to_water_threshold",
      narrativeFunction: "metadata describing future dry-to-water transition readiness",
      ethicalPressure: "transition",
      futureExpression: "future coastline logic without current water",
      audraliaMeaning: "Audralia prepares thresholds before opening water",
      terrainSystemMeaning: "source-derived coastal readiness metadata only"
    }),
    beachReadiness: Object.freeze({
      psychologicalRole: "limited_special_transition_field_not_default_coastline",
      narrativeFunction: "metadata describing rare future beach candidates",
      ethicalPressure: "restraint",
      futureExpression: "limited beach candidate, not default coastline",
      audraliaMeaning: "Audralia treats beaches as special invitations, not automatic edges",
      terrainSystemMeaning: "source-derived beach-readiness metadata only"
    }),
    continentProfile: Object.freeze({
      psychologicalRole: "large_scale_psychological_geography",
      narrativeFunction: "metadata summarizing existing continent-scale terrain posture",
      ethicalPressure: "integration",
      futureExpression: "future climate, ecology, settlement, and route personality",
      audraliaMeaning: "Audralia lets existing continent shape carry psychological geography",
      terrainSystemMeaning: "source-derived continent metadata only"
    })
  });

  var state = {
    dryTerrainApi: null,
    reliefApi: null,
    dryTerrainDetected: false,
    reliefDetected: false,
    reliefValidated: false,
    sourcePacketDetected: false,
    sourceGeometryValid: false,
    sourceFailureReason: "source terrain not checked",
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
    landformMetadataSummary: null,

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

  function detectParents() {
    var dryApi = firstGlobal(DRY_TERRAIN_GLOBALS);
    var reliefApi = firstGlobal(RELIEF_GLOBALS);

    state.dryTerrainApi = dryApi;
    state.reliefApi = reliefApi;
    state.dryTerrainDetected = Boolean(dryApi);
    state.reliefDetected = Boolean(reliefApi);
    state.reliefValidated = false;
    state.sourcePacketDetected = false;
    state.sourceGeometryValid = false;
    state.sourceFailureReason = "source terrain missing";
    state.dryTerrainPacket = null;
    state.dryCarrierPacket = null;
    state.reliefCarrierPacket = null;

    if (dryApi) {
      state.dryCarrierPacket = safeCall("dryTerrain", dryApi, "getCarrierTerrainPacket", "audralia-landform-metadata-only-child", { compact: false });
      state.dryTerrainPacket = safeCall("dryTerrain", dryApi, "getDryRevealedTerrainPacket", "audralia-landform-metadata-only-child", { compact: false });
    }

    if (reliefApi) {
      state.reliefCarrierPacket = safeCall("reliefExpression", reliefApi, "getCarrierReliefPacket", "audralia-landform-metadata-only-child", { compact: false });
      state.reliefValidated = Boolean(
        state.reliefCarrierPacket &&
        state.reliefCarrierPacket.reliefExpressionReady === true &&
        state.reliefCarrierPacket.carrierMayConsume === true &&
        state.reliefCarrierPacket.metadataOnly === true &&
        state.reliefCarrierPacket.syntheticTerrainGenerated === false &&
        state.reliefCarrierPacket.replacementLandmassGenerated === false
      );
    }

    var directNodes = readPacketNodes(state.dryTerrainPacket);
    var carrierNodes = readPacketNodes(state.dryCarrierPacket);
    var nodes = directNodes.length ? directNodes : carrierNodes;

    state.sourcePacketDetected = Boolean(nodes.length);
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

  function numeric(node, keys, fallback) {
    var list = Array.isArray(keys) ? keys : [keys];

    for (var i = 0; i < list.length; i += 1) {
      var value = Number(node && node[list[i]]);
      if (Number.isFinite(value)) return value;
    }

    return fallback;
  }

  function attachPsychology(target, role) {
    var psychology = PSYCHOLOGY_MAP[role] || PSYCHOLOGY_MAP.continentProfile;

    target.psychologicalRole = psychology.psychologicalRole;
    target.narrativeFunction = psychology.narrativeFunction;
    target.ethicalPressure = psychology.ethicalPressure;
    target.futureExpression = psychology.futureExpression;
    target.audraliaMeaning = psychology.audraliaMeaning;
    target.terrainSystemMeaning = psychology.terrainSystemMeaning;

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

  function classifyMetadataRole(node) {
    var elevation = numeric(node, ["dryElevation", "elevation", "height"], 0.5);
    var ridge = numeric(node, "ridgePressure", 0);
    var basin = numeric(node, "basinPressure", 0);
    var summit = numeric(node, "summitPressure", 0);
    var shelf = numeric(node, "shelfPressure", 0);
    var trench = numeric(node, "trenchPressure", 0);
    var gap = numeric(node, "gapPressure", 0);

    if (ridge + summit > 0.52 || elevation > 0.68) return "mountainRange";
    if (elevation > 0.48 && elevation < 0.68 && ridge < 0.42 && basin < 0.42) return "plateau";
    if (basin + gap > 0.48 || node.futureFillEligible) return "basin";
    if (trench + ridge > 0.56) return "cliff";
    if (shelf > 0.34) return "coastalShelf";

    return "continentProfile";
  }

  function buildSourceMetadata(nodes) {
    var items = [];
    var roleCounts = {};

    nodes.forEach(function (node, index) {
      if (!getNodePosition(node, index)) return;

      var id = getNodeId(node, index);
      var role = classifyMetadataRole(node);

      roleCounts[role] = (roleCounts[role] || 0) + 1;

      items.push(Object.freeze(attachPsychology({
        metadataId: "AUDRALIA-LANDFORM-METADATA-" + String(items.length).padStart(3, "0"),
        sourceNodeId: id,
        nodeIds: [id],
        landformMetadataRole: role,
        sourceDerived: true,
        metadataOnly: true,
        sourceGeometryPreserved: true,
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

    return {
      items: Object.freeze(items),
      roleCounts: roleCounts
    };
  }

  function buildContinentProfiles(nodes, sourceMetadata) {
    var buckets = {};

    sourceMetadata.items.forEach(function (item) {
      var key = "audralia-preserved-landmass";
      buckets[key] = buckets[key] || [];
      buckets[key].push(item);
    });

    return Object.freeze(Object.keys(buckets).map(function (key, index) {
      var items = buckets[key];
      var roleCounts = {};

      items.forEach(function (item) {
        var role = item.landformMetadataRole || "continentProfile";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      return Object.freeze(attachPsychology({
        continentProfileId: "AUDRALIA-CONTINENT-LANDFORM-METADATA-PROFILE-" + String(index).padStart(2, "0"),
        continentId: key,
        continentName: "Audralia Preserved Landmass",
        nodeIds: items.map(function (item) { return item.sourceNodeId; }).slice(0, 96),
        nodeCount: items.length,
        roleCounts: roleCounts,
        largeScalePsychologicalGeography: true,
        metadataOnly: true,
        sourceGeometryPreserved: true,
        sourceDerived: true,
        syntheticTerrainGenerated: false,
        fallbackTerrainGenerated: false,
        replacementLandmassGenerated: false,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      }, "continentProfile"));
    }));
  }

  function buildHeldSummary(reason) {
    return Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: false,
      sourceSampleCount: 0,
      held: true,
      heldReason: reason,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      finalVisualPassClaim: false
    });
  }

  function buildLandformPacket() {
    detectParents();

    var nodes = dryNodes();

    state.mountainRanges = Object.freeze([]);
    state.landmarks = Object.freeze([]);
    state.plateaus = Object.freeze([]);
    state.landformBasins = Object.freeze([]);
    state.cliffSystems = Object.freeze([]);
    state.coastalShelves = Object.freeze([]);
    state.beachReadinessSystems = Object.freeze([]);
    state.continentLandformProfiles = Object.freeze([]);

    if (!state.sourceGeometryValid || !nodes.length) {
      state.landformMetadataSummary = buildHeldSummary(state.sourceFailureReason);
      state.built = true;
      state.buildCount += 1;
      state.lastBuiltAt = new Date().toISOString();
      return false;
    }

    var metadata = buildSourceMetadata(nodes);

    state.continentLandformProfiles = buildContinentProfiles(nodes, metadata);
    state.landformMetadataSummary = Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: true,
      sourceSampleCount: metadata.items.length,
      roleCounts: metadata.roleCounts,
      carrierVisibleGeometrySuppressed: true,
      visualArraysHeldToPreserveLandmass: true,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      finalVisualPassClaim: false
    });

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();

    return metadata.items.length > 0;
  }

  function ready() {
    return Boolean(state.sourceGeometryValid && state.continentLandformProfiles.length);
  }

  function status() {
    if (!state.built) buildLandformPacket();

    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,

      landformSystemsReady: isReady,
      carrierMayConsume: isReady,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      childDrawsVisuals: false,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,
      dryTerrainDetected: state.dryTerrainDetected,
      reliefDetected: state.reliefDetected,
      reliefValidated: state.reliefValidated,

      mountainRangeCount: state.mountainRanges.length,
      landmarkCount: state.landmarks.length,
      plateauCount: state.plateaus.length,
      landformBasinCount: state.landformBasins.length,
      cliffSystemCount: state.cliffSystems.length,
      coastalShelfCount: state.coastalShelves.length,
      beachReadinessSystemCount: state.beachReadinessSystems.length,
      continentLandformProfileCount: state.continentLandformProfiles.length,

      carrierVisibleGeometrySuppressed: true,
      visualArraysHeldToPreserveLandmass: true,

      planetPsychologyActive: isReady,
      planetPsychologyNarrativeClear: isReady,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
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
      deployMarker: "AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_DEPLOY_MARKER_v1"
    };
  }

  function getCarrierLandformPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildLandformPacket();

    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      packetType: "carrier_landform_systems_metadata_only_restoration_packet",
      requester: requester || "unknown",

      landformSystemsReady: isReady,
      carrierMayConsume: isReady,
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
      landformMetadataSummary: state.landformMetadataSummary,

      planetPsychologyActive: isReady,
      planetPsychologyNarrativeClear: isReady,
      psychologyOwnsNarrativeMeaningOnly: true,
      psychologyDoesNotOwnTerrainTruth: true,
      psychologyDoesNotOwnElevationTruth: true,
      psychologyDoesNotOwnReliefTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,
      psychologyMap: PSYCHOLOGY_MAP,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,

      carrierVisibleGeometrySuppressed: true,
      visualArraysHeldToPreserveLandmass: true,

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,

      terrainTruthSource: "existing dry terrain child only",
      reliefTruthSource: state.reliefValidated ? "metadata-only relief child" : "held or unavailable",
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
    previousContract: PREVIOUS_CONTRACT,
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
