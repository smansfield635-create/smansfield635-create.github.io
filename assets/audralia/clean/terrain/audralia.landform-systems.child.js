// /assets/audralia/clean/terrain/audralia.landform-systems.child.js
// AUDRALIA_LANDFORM_SYSTEMS_METADATA_INTERFACE_ENRICHMENT_TNT_v2
// Full-file replacement.
// Previous: AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_TNT_v1
// Family: AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1
// Scope: landform systems child only.
// Purpose: enrich the metadata interface for landform systems while preserving the restored source landmass.
// Does not own: terrain truth, replacement geometry, elevation truth, relief truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_METADATA_INTERFACE_ENRICHMENT_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.landform-systems.child.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

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

  var REGION_NAMES = Object.freeze({
    gratitude: "Gratitude",
    generosity: "Generosity",
    dependability: "Dependability",
    accountability: "Accountability",
    forgiveness: "Forgiveness",
    humility: "Humility",
    "self-control": "Self-Control",
    patience: "Patience",
    purity: "Purity",
    "audralia-preserved-landmass": "Audralia Preserved Landmass",
    unassigned: "Unassigned"
  });

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
    dryTerrainValidated: false,
    dryTerrainStatus: null,
    dryTerrainPacket: null,
    dryCarrierPacket: null,
    dryFailureReason: "dry terrain not checked",

    reliefDetected: false,
    reliefValidated: false,
    reliefCarrierPacket: null,
    reliefFailureReason: "relief metadata not checked",

    sourcePacketDetected: false,
    sourceGeometryValid: false,
    sourceFailureReason: "source terrain not checked",

    sourceRecords: [],
    sourceRecordById: {},
    reliefSampleByNodeId: {},

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

  function stableClone(value) {
    return JSON.parse(JSON.stringify(value || null));
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

  function dryNodes() {
    var directNodes = readPacketNodes(state.dryTerrainPacket);
    var carrierNodes = readPacketNodes(state.dryCarrierPacket);
    return directNodes.length ? directNodes : carrierNodes;
  }

  function getNodeId(node, index) {
    if (!node) return "source-index-" + String(index);

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
      x: ((clamp(x, 0, RADIAL_NODES - 1) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES,
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

  function numeric(source, keys, fallback) {
    var list = Array.isArray(keys) ? keys : [keys];

    for (var i = 0; i < list.length; i += 1) {
      var value = Number(source && source[list[i]]);
      if (Number.isFinite(value)) return value;
    }

    return fallback;
  }

  function regionName(regionSeed) {
    return REGION_NAMES[regionSeed] || REGION_NAMES.unassigned;
  }

  function normalizeRegion(value) {
    var text = String(value || "unassigned").toLowerCase();
    return text || "unassigned";
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
    target.psychologyDoesNotOwnLandformTruth = true;
    target.psychologyDoesNotOwnHydrationTruth = true;
    target.psychologyDoesNotOwnVisualPass = true;

    return target;
  }

  function indexSample(index, key, sample) {
    if (key === undefined || key === null || key === "" || !sample) return;
    index[String(key)] = sample;
  }

  function buildReliefIndex() {
    var index = {};
    var packet = state.reliefCarrierPacket || {};
    var samples = Array.isArray(packet.reliefSamples) ? packet.reliefSamples : [];

    samples.forEach(function (sample, i) {
      indexSample(index, sample.parentNodeId, sample);
      indexSample(index, sample.nodeId, sample);
      indexSample(index, sample.seatKey, sample);
      indexSample(index, sample.sourceSeatIndex, sample);
      indexSample(index, sample.seatIndex, sample);
      indexSample(index, "source-" + i, sample);
      indexSample(index, String(i), sample);
    });

    state.reliefSampleByNodeId = index;
    return index;
  }

  function lookupRelief(index, node, sourceIndex) {
    var keys = [
      getNodeId(node, sourceIndex),
      node && node.nodeId,
      node && node.seatKey,
      node && node.id,
      node && node.sourceNodeId,
      node && node.seatIndex,
      node && node.nodeIndex,
      "source-" + sourceIndex,
      String(sourceIndex)
    ];

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (key !== undefined && key !== null && index[String(key)]) return index[String(key)];
    }

    return null;
  }

  function detectParents() {
    var dryApi = firstGlobal(DRY_TERRAIN_GLOBALS);
    var reliefApi = firstGlobal(RELIEF_GLOBALS);

    state.dryTerrainApi = dryApi;
    state.reliefApi = reliefApi;

    state.dryTerrainDetected = Boolean(dryApi);
    state.dryTerrainValidated = false;
    state.dryTerrainStatus = null;
    state.dryTerrainPacket = null;
    state.dryCarrierPacket = null;
    state.dryFailureReason = "dry terrain not checked";

    state.reliefDetected = Boolean(reliefApi);
    state.reliefValidated = false;
    state.reliefCarrierPacket = null;
    state.reliefFailureReason = "relief metadata not checked";

    state.sourcePacketDetected = false;
    state.sourceGeometryValid = false;
    state.sourceFailureReason = "source terrain missing";

    if (dryApi) {
      state.dryTerrainStatus = typeof dryApi.status === "function" ? safeCall("dryTerrain", dryApi, "status") : null;
      state.dryCarrierPacket = safeCall("dryTerrain", dryApi, "getCarrierTerrainPacket", "audralia-landform-metadata-interface-child", { compact: false });
      state.dryTerrainPacket = safeCall("dryTerrain", dryApi, "getDryRevealedTerrainPacket", "audralia-landform-metadata-interface-child", { compact: false });

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

      state.dryFailureReason = state.dryTerrainValidated ? "" : "dry terrain validation held or incomplete";
    } else {
      state.dryFailureReason = "dry terrain child missing";
    }

    if (reliefApi) {
      state.reliefCarrierPacket = safeCall("reliefExpression", reliefApi, "getCarrierReliefPacket", "audralia-landform-metadata-interface-child", { compact: false });
      state.reliefValidated = Boolean(
        state.reliefCarrierPacket &&
        state.reliefCarrierPacket.reliefExpressionReady === true &&
        state.reliefCarrierPacket.carrierMayConsume === true &&
        state.reliefCarrierPacket.childDrawsVisuals === false &&
        state.reliefCarrierPacket.hydrationHeld === true &&
        state.reliefCarrierPacket.activeHydration === false &&
        state.reliefCarrierPacket.finalVisualPassClaim === false &&
        state.reliefCarrierPacket.syntheticTerrainGenerated !== true &&
        state.reliefCarrierPacket.replacementLandmassGenerated !== true
      );
      state.reliefFailureReason = state.reliefValidated ? "" : "relief metadata validation held or incomplete";
    } else {
      state.reliefFailureReason = "relief metadata child missing";
    }

    var nodes = dryNodes();

    state.sourcePacketDetected = Boolean(nodes.length);
    state.sourceGeometryValid = Boolean(nodes.length && nodes.some(function (node, index) {
      return Boolean(getNodePosition(node, index));
    }));

    state.sourceFailureReason = state.sourceGeometryValid ? "" : "valid source terrain nodes missing or unmappable";

    return state.sourceGeometryValid;
  }

  function buildSourceRecords() {
    var nodes = dryNodes();
    var reliefIndex = buildReliefIndex();
    var records = [];
    var byId = {};

    nodes.forEach(function (node, index) {
      var position = getNodePosition(node, index);
      if (!position) return;

      var relief = lookupRelief(reliefIndex, node, index) || {};
      var nodeId = getNodeId(node, index);
      var ll = terrainSeatToLonLat(position.x, position.y);

      var elevation = clamp(numeric(relief, ["elevation", "dryElevation"], numeric(node, ["dryElevation", "elevation", "height"], 0.5)), 0, 1);
      var slope = clamp(numeric(relief, ["slope", "slopeIndex"], numeric(node, ["slope", "slopeIndex"], 0.5)), 0, 1);
      var reliefIntensity = clamp(numeric(relief, "reliefIntensity", numeric(node, "reliefIntensity", 0)), 0, 1);

      var ridge = clamp(numeric(node, "ridgePressure", numeric(relief, "ridgeHighlight", 0)), 0, 1);
      var mountain = clamp(numeric(node, "mountainPressure", numeric(relief, "mountainPressure", 0)), 0, 1);
      var summit = clamp(numeric(node, "summitPressure", numeric(relief, "summitEmphasis", 0)), 0, 1);
      var basin = clamp(numeric(node, "basinPressure", numeric(relief, "basinShadow", 0)), 0, 1);
      var valley = clamp(numeric(node, "valleyPressure", numeric(relief, ["valleyFlowStrength", "valleyFlowPotential"], 0)), 0, 1);
      var shelf = clamp(numeric(node, "shelfPressure", numeric(relief, ["shelfReliefStrength", "shelfTransition"], 0)), 0, 1);
      var trench = clamp(numeric(node, "trenchPressure", numeric(relief, "trenchContainment", 0)), 0, 1);
      var escarpment = clamp(numeric(node, "escarpmentPressure", numeric(relief, "escarpmentPressure", 0)), 0, 1);
      var gap = clamp(numeric(node, "gapPressure", numeric(relief, "gapRelease", 0)), 0, 1);
      var futureFill = clamp(numeric(relief, "futureFillPressure", numeric(node, "futureFillPressure", (node && node.futureFillEligible ? 0.32 : 0))), 0, 1);

      var highlandScore = clamp(elevation * 0.44 + summit * 0.22 + ridge * 0.18 + reliefIntensity * 0.16, 0, 1);
      var lowlandScore = clamp((1 - elevation) * 0.34 + basin * 0.26 + valley * 0.16 + futureFill * 0.18 + gap * 0.06, 0, 1);
      var stabilityScore = clamp((1 - slope) * 0.30 + shelf * 0.18 + Math.max(0, 1 - Math.abs(elevation - 0.55) * 2) * 0.28 + reliefIntensity * 0.08 + ridge * 0.06, 0, 1);
      var boundaryScore = clamp(slope * 0.24 + escarpment * 0.28 + trench * 0.20 + ridge * 0.14 + reliefIntensity * 0.14, 0, 1);
      var coastReadinessScore = clamp(shelf * 0.34 + futureFill * 0.22 + lowlandScore * 0.14 + (1 - boundaryScore) * 0.16 + valley * 0.08 + gap * 0.06, 0, 1);
      var beachReadinessScore = clamp(shelf * 0.26 + futureFill * 0.20 + (1 - slope) * 0.18 + (1 - boundaryScore) * 0.18 + lowlandScore * 0.12 + basin * 0.06, 0, 1);

      var continentId = normalizeRegion(node.regionSeed || node.continentId || relief.continentId || "audralia-preserved-landmass");
      var terrainRole = relief.carrierVisualRole || relief.reliefRole || node.primaryTerrainRole || node.terrainClass || "source_terrain";

      var record = Object.freeze({
        recordId: "AUDRALIA-LANDFORM-SOURCE-RECORD-" + String(records.length).padStart(3, "0"),
        sourceNodeId: nodeId,
        nodeId: nodeId,
        sourceIndex: index,
        sourceSeatIndex: Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : index,
        seatIndex: Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : index,
        nodeIndex: Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : index,
        x: round(position.x, 4),
        y: round(position.y, 4),
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),
        continentId: continentId,
        continentName: regionName(continentId),
        terrainRole: terrainRole,

        dryElevation: round(elevation, 4),
        slope: round(slope, 4),
        reliefIntensity: round(reliefIntensity, 4),
        ridgePressure: round(ridge, 4),
        mountainPressure: round(mountain, 4),
        summitPressure: round(summit, 4),
        basinPressure: round(basin, 4),
        valleyPressure: round(valley, 4),
        shelfPressure: round(shelf, 4),
        trenchPressure: round(trench, 4),
        escarpmentPressure: round(escarpment, 4),
        gapPressure: round(gap, 4),
        futureFillPressure: round(futureFill, 4),

        highlandScore: round(highlandScore, 4),
        lowlandScore: round(lowlandScore, 4),
        stabilityScore: round(stabilityScore, 4),
        boundaryScore: round(boundaryScore, 4),
        coastReadinessScore: round(coastReadinessScore, 4),
        beachReadinessScore: round(beachReadinessScore, 4),

        sourceGeometryPreserved: true,
        metadataOnly: true,
        sourceTerrainMutated: false,
        elevationTruthMutated: false,
        reliefTruthMutated: false,
        landformTruthMutated: false,
        childDrawsVisuals: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      });

      records.push(record);
      byId[nodeId] = record;
      byId[String(index)] = record;
      byId["source-" + index] = record;
    });

    state.sourceRecords = Object.freeze(records);
    state.sourceRecordById = byId;
    return state.sourceRecords;
  }

  function average(records, key) {
    if (!records.length) return 0;
    return records.reduce(function (sum, record) {
      return sum + Number(record[key] || 0);
    }, 0) / records.length;
  }

  function max(records, key) {
    if (!records.length) return 0;
    return records.reduce(function (best, record) {
      return Math.max(best, Number(record[key] || 0));
    }, 0);
  }

  function roleCounts(records, selector) {
    var counts = {};
    records.forEach(function (record) {
      var key = selector ? selector(record) : record.continentId;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  function collectTrace(records) {
    return {
      nodeIds: Object.freeze(records.map(function (record) { return record.nodeId; })),
      sourceNodeIds: Object.freeze(records.map(function (record) { return record.sourceNodeId; })),
      seatIndexes: Object.freeze(records.map(function (record) { return record.seatIndex; })),
      sourceSeatIndexes: Object.freeze(records.map(function (record) { return record.sourceSeatIndex; })),
      sourceIndexes: Object.freeze(records.map(function (record) { return record.sourceIndex; }))
    };
  }

  function baseSystem(records, role, prefix, localIndex) {
    var trace = collectTrace(records);
    var continentCounts = roleCounts(records);
    var dominantContinent = Object.keys(continentCounts).sort(function (a, b) {
      return continentCounts[b] - continentCounts[a];
    })[0] || "audralia-preserved-landmass";

    return attachPsychology({
      systemId: "AUDRALIA-" + prefix + "-" + String(localIndex).padStart(2, "0"),
      nodeIds: trace.nodeIds,
      sourceNodeIds: trace.sourceNodeIds,
      seatIndexes: trace.seatIndexes,
      sourceSeatIndexes: trace.sourceSeatIndexes,
      sourceIndexes: trace.sourceIndexes,
      nodeCount: records.length,
      continentId: dominantContinent,
      continentName: regionName(dominantContinent),
      roleCounts: roleCounts(records, function (record) { return record.terrainRole; }),
      averageElevation: round(average(records, "dryElevation"), 4),
      averageSlope: round(average(records, "slope"), 4),
      averageReliefIntensity: round(average(records, "reliefIntensity"), 4),
      averageHighlandScore: round(average(records, "highlandScore"), 4),
      averageLowlandScore: round(average(records, "lowlandScore"), 4),
      averageStabilityScore: round(average(records, "stabilityScore"), 4),
      averageBoundaryScore: round(average(records, "boundaryScore"), 4),
      averageCoastReadinessScore: round(average(records, "coastReadinessScore"), 4),
      averageBeachReadinessScore: round(average(records, "beachReadinessScore"), 4),
      maxFutureFillPressure: round(max(records, "futureFillPressure"), 4),
      sourceDerived: true,
      metadataOnly: true,
      landformArraysMetadataOnly: true,
      landformArraysDoNotDraw: true,
      sourceGeometryPreserved: true,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    }, role);
  }

  function selectTop(predicate, score, limit) {
    return state.sourceRecords.filter(predicate).sort(function (a, b) {
      return score(b) - score(a);
    }).slice(0, limit);
  }

  function chunk(records, size, maxGroups) {
    var groups = [];
    var groupSize = Math.max(1, size || 16);
    var limit = maxGroups || 8;

    for (var i = 0; i < records.length && groups.length < limit; i += groupSize) {
      groups.push(records.slice(i, i + groupSize));
    }

    return groups;
  }

  function makeMountainRanges() {
    var selected = selectTop(function (record) {
      return record.highlandScore > 0.42 || record.ridgePressure > 0.26 || record.summitPressure > 0.20 || record.mountainPressure > 0.18;
    }, function (record) {
      return record.highlandScore * 0.34 + record.ridgePressure * 0.22 + record.summitPressure * 0.20 + record.mountainPressure * 0.16 + record.reliefIntensity * 0.08;
    }, 72);

    if (!selected.length) selected = selectTop(function () { return true; }, function (record) { return record.highlandScore; }, 18);

    return Object.freeze(chunk(selected, 18, 4).map(function (group, i) {
      var system = baseSystem(group, "mountainRange", "MOUNTAIN-RANGE-METADATA", i);
      system.rangeId = system.systemId;
      system.rangeStatus = "metadata_only_source_derived";
      system.summitNodeIds = Object.freeze(group.filter(function (record) {
        return record.summitPressure > 0.18 || record.highlandScore > 0.58;
      }).map(function (record) { return record.nodeId; }).slice(0, 8));
      system.watershedAuthority = round(system.averageHighlandScore * 0.46 + system.averageReliefIntensity * 0.34 + max(group, "ridgePressure") * 0.20, 4);
      system.rangeDrawsVisibleGeometry = false;
      return Object.freeze(system);
    }));
  }

  function makePlateaus() {
    var selected = selectTop(function (record) {
      return record.stabilityScore > 0.42 && record.slope < 0.68;
    }, function (record) {
      return record.stabilityScore * 0.58 + record.shelfPressure * 0.22 + (1 - record.slope) * 0.20;
    }, 64);

    if (!selected.length) selected = selectTop(function () { return true; }, function (record) { return record.stabilityScore; }, 16);

    return Object.freeze(chunk(selected, 16, 4).map(function (group, i) {
      var system = baseSystem(group, "plateau", "PLATEAU-METADATA", i);
      system.plateauId = system.systemId;
      system.plateauStatus = "metadata_only_source_derived";
      system.surfaceContinuity = round(system.averageStabilityScore * 0.72 + (1 - system.averageSlope) * 0.28, 4);
      system.slopeStability = round(1 - system.averageSlope, 4);
      system.plateauDrawsVisibleGeometry = false;
      return Object.freeze(system);
    }));
  }

  function makeBasins() {
    var selected = selectTop(function (record) {
      return record.lowlandScore > 0.40 || record.basinPressure > 0.18 || record.futureFillPressure > 0.16;
    }, function (record) {
      return record.lowlandScore * 0.34 + record.basinPressure * 0.28 + record.futureFillPressure * 0.22 + record.valleyPressure * 0.10 + record.gapPressure * 0.06;
    }, 72);

    if (!selected.length) selected = selectTop(function () { return true; }, function (record) { return record.lowlandScore; }, 18);

    return Object.freeze(chunk(selected, 18, 4).map(function (group, i) {
      var system = baseSystem(group, "basin", "BASIN-METADATA", i);
      system.basinId = system.systemId;
      system.basinStatus = "metadata_only_future_hydration_held";
      system.corridorNodeIds = Object.freeze(group.filter(function (record) {
        return record.valleyPressure > 0.14 || record.gapPressure > 0.12 || record.futureFillPressure > 0.24;
      }).map(function (record) { return record.nodeId; }).slice(0, 12));
      system.basinDepthStrength = round(system.averageLowlandScore * 0.38 + max(group, "basinPressure") * 0.34 + max(group, "futureFillPressure") * 0.28, 4);
      system.futureFillPriority = round(max(group, "futureFillPressure"), 4);
      system.basinDrawsWater = false;
      return Object.freeze(system);
    }));
  }

  function makeCliffSystems() {
    var selected = selectTop(function (record) {
      return record.boundaryScore > 0.34 || record.slope > 0.64 || record.escarpmentPressure > 0.14 || record.trenchPressure > 0.16;
    }, function (record) {
      return record.boundaryScore * 0.42 + record.slope * 0.24 + record.escarpmentPressure * 0.18 + record.trenchPressure * 0.10 + record.ridgePressure * 0.06;
    }, 64);

    if (!selected.length) selected = selectTop(function () { return true; }, function (record) { return record.boundaryScore; }, 12);

    return Object.freeze(chunk(selected, 16, 4).map(function (group, i) {
      var system = baseSystem(group, "cliff", "CLIFF-SYSTEM-METADATA", i);
      system.cliffSystemId = system.systemId;
      system.cliffStatus = "metadata_only_source_derived";
      system.edgeNodeIds = Object.freeze(group.filter(function (record) {
        return record.boundaryScore > 0.42 || record.slope > 0.70;
      }).map(function (record) { return record.nodeId; }).slice(0, 12));
      system.reliefBreakStrength = round(system.averageBoundaryScore * 0.54 + max(group, "slope") * 0.22 + max(group, "reliefIntensity") * 0.24, 4);
      system.cliffDrawsVisibleGeometry = false;
      return Object.freeze(system);
    }));
  }

  function makeCoastalShelves() {
    var selected = selectTop(function (record) {
      return record.coastReadinessScore > 0.38 || record.shelfPressure > 0.20;
    }, function (record) {
      return record.coastReadinessScore * 0.54 + record.shelfPressure * 0.24 + record.futureFillPressure * 0.12 + (1 - record.boundaryScore) * 0.10;
    }, 48);

    return Object.freeze(chunk(selected, 12, 4).map(function (group, i) {
      var system = baseSystem(group, "coastalShelf", "COASTAL-SHELF-METADATA", i);
      system.coastalShelfId = system.systemId;
      system.coastalShelfStatus = "metadata_only_future_threshold";
      system.coastlineIsFinal = false;
      system.shorelineIsFinal = false;
      system.waterlineIsFinal = false;
      system.coastalShelfDrawsWater = false;
      return Object.freeze(system);
    }));
  }

  function makeBeachReadinessSystems() {
    var selected = selectTop(function (record) {
      return record.beachReadinessScore > 0.42 && record.boundaryScore < 0.72;
    }, function (record) {
      return record.beachReadinessScore * 0.62 + record.coastReadinessScore * 0.18 + (1 - record.slope) * 0.12 + record.futureFillPressure * 0.08;
    }, 24);

    return Object.freeze(chunk(selected, 8, 4).map(function (group, i) {
      var system = baseSystem(group, "beachReadiness", "BEACH-READINESS-METADATA", i);
      system.beachReadinessId = system.systemId;
      system.beachReadinessStatus = "candidate_only_not_final_beach";
      system.beachIsLimitedSpecialNotDefault = true;
      system.finalBeachPassClaim = false;
      system.beachDrawsVisibleGeometry = false;
      system.beachDrawsWater = false;
      return Object.freeze(system);
    }));
  }

  function makeLandmarks() {
    var candidates = selectTop(function (record) {
      return true;
    }, function (record) {
      return record.highlandScore * 0.20 + record.lowlandScore * 0.14 + record.stabilityScore * 0.18 + record.boundaryScore * 0.16 + record.reliefIntensity * 0.12 + record.beachReadinessScore * 0.08 + record.futureFillPressure * 0.12;
    }, 24);

    return Object.freeze(candidates.slice(0, 16).map(function (record, i) {
      var role = "landmark";
      var landmark = attachPsychology({
        landmarkId: "AUDRALIA-LANDMARK-METADATA-" + String(i).padStart(2, "0"),
        anchorNodeId: record.nodeId,
        nodeIds: Object.freeze([record.nodeId]),
        sourceNodeIds: Object.freeze([record.sourceNodeId]),
        seatIndexes: Object.freeze([record.seatIndex]),
        sourceSeatIndexes: Object.freeze([record.sourceSeatIndex]),
        sourceIndexes: Object.freeze([record.sourceIndex]),
        continentId: record.continentId,
        continentName: record.continentName,
        terrainRole: record.terrainRole,
        landmarkStrength: round(record.highlandScore * 0.22 + record.stabilityScore * 0.18 + record.boundaryScore * 0.16 + record.lowlandScore * 0.14 + record.reliefIntensity * 0.16 + record.futureFillPressure * 0.14, 4),
        landmarkStatus: "metadata_only_anchor_not_icon",
        sourceDerived: true,
        metadataOnly: true,
        landformArraysMetadataOnly: true,
        landformArraysDoNotDraw: true,
        sourceGeometryPreserved: true,
        syntheticTerrainGenerated: false,
        fallbackTerrainGenerated: false,
        replacementLandmassGenerated: false,
        childDrawsVisuals: false,
        landmarkDrawsVisibleIcon: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalTerrainPassClaim: false,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      }, role);

      return Object.freeze(landmark);
    }));
  }

  function makeContinentProfiles() {
    var byContinent = {};

    state.sourceRecords.forEach(function (record) {
      var key = record.continentId || "audralia-preserved-landmass";
      if (!byContinent[key]) byContinent[key] = [];
      byContinent[key].push(record);
    });

    return Object.freeze(Object.keys(byContinent).map(function (continentId, i) {
      var group = byContinent[continentId];
      var base = baseSystem(group, "continentProfile", "CONTINENT-LANDFORM-PROFILE", i);

      base.continentProfileId = base.systemId;
      base.continentId = continentId;
      base.continentName = regionName(continentId);
      base.largeScalePsychologicalGeography = true;
      base.mountainRangeCandidateCount = group.filter(function (record) { return record.highlandScore > 0.42; }).length;
      base.plateauCandidateCount = group.filter(function (record) { return record.stabilityScore > 0.42; }).length;
      base.basinCandidateCount = group.filter(function (record) { return record.lowlandScore > 0.40; }).length;
      base.cliffCandidateCount = group.filter(function (record) { return record.boundaryScore > 0.34; }).length;
      base.coastalShelfCandidateCount = group.filter(function (record) { return record.coastReadinessScore > 0.38; }).length;
      base.beachReadinessCandidateCount = group.filter(function (record) { return record.beachReadinessScore > 0.42; }).length;
      base.profileDrawsVisibleGeometry = false;

      return Object.freeze(base);
    }));
  }

  function buildHeldSummary(reason) {
    return Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: false,
      sourceSampleCount: 0,
      held: true,
      heldReason: reason,
      landformArraysMetadataOnly: true,
      landformArraysDoNotDraw: true,
      visualDrawingSuppressedToPreserveLandmass: true,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function buildSummary() {
    return Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: true,
      sourceSeatCount: SOURCE_SEAT_COUNT,
      sourceSampleCount: state.sourceRecords.length,
      reliefMetadataDetected: state.reliefDetected,
      reliefMetadataValidated: state.reliefValidated,
      mountainRangeCount: state.mountainRanges.length,
      landmarkCount: state.landmarks.length,
      plateauCount: state.plateaus.length,
      landformBasinCount: state.landformBasins.length,
      cliffSystemCount: state.cliffSystems.length,
      coastalShelfCount: state.coastalShelves.length,
      beachReadinessSystemCount: state.beachReadinessSystems.length,
      continentLandformProfileCount: state.continentLandformProfiles.length,
      roleCounts: roleCounts(state.sourceRecords, function (record) {
        if (record.highlandScore > 0.42) return "mountainRange";
        if (record.stabilityScore > 0.42) return "plateau";
        if (record.lowlandScore > 0.40) return "basin";
        if (record.boundaryScore > 0.34) return "cliff";
        if (record.coastReadinessScore > 0.38) return "coastalShelf";
        return "continentProfile";
      }),
      landformArraysMetadataOnly: true,
      landformArraysDoNotDraw: true,
      visualDrawingSuppressedToPreserveLandmass: true,
      carrierVisibleGeometrySuppressed: true,
      sourceDerived: true,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function clearOutputs() {
    state.sourceRecords = Object.freeze([]);
    state.sourceRecordById = {};
    state.reliefSampleByNodeId = {};
    state.mountainRanges = Object.freeze([]);
    state.landmarks = Object.freeze([]);
    state.plateaus = Object.freeze([]);
    state.landformBasins = Object.freeze([]);
    state.cliffSystems = Object.freeze([]);
    state.coastalShelves = Object.freeze([]);
    state.beachReadinessSystems = Object.freeze([]);
    state.continentLandformProfiles = Object.freeze([]);
  }

  function buildLandformPacket() {
    detectParents();
    clearOutputs();

    var nodes = dryNodes();

    if (!state.sourceGeometryValid || !nodes.length) {
      state.landformMetadataSummary = buildHeldSummary(state.sourceFailureReason);
      state.built = true;
      state.buildCount += 1;
      state.lastBuiltAt = new Date().toISOString();
      publishStatus();
      return false;
    }

    buildSourceRecords();

    state.mountainRanges = makeMountainRanges();
    state.landmarks = makeLandmarks();
    state.plateaus = makePlateaus();
    state.landformBasins = makeBasins();
    state.cliffSystems = makeCliffSystems();
    state.coastalShelves = makeCoastalShelves();
    state.beachReadinessSystems = makeBeachReadinessSystems();
    state.continentLandformProfiles = makeContinentProfiles();
    state.landformMetadataSummary = buildSummary();

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();

    publishStatus();
    return ready();
  }

  function ready() {
    return Boolean(
      state.sourceGeometryValid &&
      state.sourceRecords.length &&
      state.continentLandformProfiles.length &&
      (
        state.mountainRanges.length ||
        state.landmarks.length ||
        state.plateaus.length ||
        state.landformBasins.length ||
        state.cliffSystems.length ||
        state.coastalShelves.length ||
        state.beachReadinessSystems.length
      )
    );
  }

  function baseStatusNoBuild() {
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
      carrierShouldNotOwnHydrationTruth: true,
      childDrawsVisuals: false,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,
      dryTerrainDetected: state.dryTerrainDetected,
      dryTerrainValidated: state.dryTerrainValidated,
      dryTerrainFailureReason: state.dryFailureReason,
      reliefDetected: state.reliefDetected,
      reliefValidated: state.reliefValidated,
      reliefFailureReason: state.reliefFailureReason,

      sourceRecordCount: state.sourceRecords.length,
      mountainRangeCount: state.mountainRanges.length,
      landmarkCount: state.landmarks.length,
      plateauCount: state.plateaus.length,
      landformBasinCount: state.landformBasins.length,
      cliffSystemCount: state.cliffSystems.length,
      coastalShelfCount: state.coastalShelves.length,
      beachReadinessSystemCount: state.beachReadinessSystems.length,
      continentLandformProfileCount: state.continentLandformProfiles.length,

      landformArraysMetadataOnly: true,
      landformArraysDoNotDraw: true,
      visualDrawingSuppressedToPreserveLandmass: true,
      carrierVisibleGeometrySuppressed: true,

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
      deployMarker: "AUDRALIA_LANDFORM_SYSTEMS_METADATA_INTERFACE_ENRICHMENT_DEPLOY_MARKER_v2"
    };
  }

  function baseStatus() {
    if (!state.built) buildLandformPacket();
    return baseStatusNoBuild();
  }

  function publishStatus() {
    var payload = baseStatusNoBuild();

    window.AUDRALIA_LANDFORM_SYSTEMS_METADATA_INTERFACE_ENRICHMENT_STATUS = payload;
    window.AUDRALIA_LANDFORM_SYSTEMS_METADATA_ONLY_RESTORATION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaLandformSystemsContract = CONTRACT;
      document.documentElement.dataset.audraliaLandformSystemsReady = String(payload.landformSystemsReady);
      document.documentElement.dataset.audraliaLandformArraysMetadataOnly = "true";
      document.documentElement.dataset.audraliaLandformArraysDoNotDraw = "true";
      document.documentElement.dataset.audraliaVisualDrawingSuppressedToPreserveLandmass = "true";
      document.documentElement.dataset.audraliaSourceGeometryPreserved = String(payload.sourceGeometryPreserved);
      document.documentElement.dataset.audraliaSourceRecordCount = String(payload.sourceRecordCount);
      document.documentElement.dataset.audraliaMountainRangeCount = String(payload.mountainRangeCount);
      document.documentElement.dataset.audraliaLandmarkCount = String(payload.landmarkCount);
      document.documentElement.dataset.audraliaPlateauCount = String(payload.plateauCount);
      document.documentElement.dataset.audraliaLandformBasinCount = String(payload.landformBasinCount);
      document.documentElement.dataset.audraliaCliffSystemCount = String(payload.cliffSystemCount);
      document.documentElement.dataset.audraliaCoastalShelfCount = String(payload.coastalShelfCount);
      document.documentElement.dataset.audraliaBeachReadinessSystemCount = String(payload.beachReadinessSystemCount);
      document.documentElement.dataset.audraliaChildDrawsVisuals = "false";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaActiveWater = "false";
      document.documentElement.dataset.audraliaFinalTerrainPassClaim = "false";
      document.documentElement.dataset.audraliaFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function status() {
    if (!state.built) buildLandformPacket();
    return baseStatus();
  }

  function getCarrierLandformPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildLandformPacket();

    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      packetType: "carrier_landform_systems_metadata_interface_enrichment_packet",
      requester: requester || "unknown",

      landformSystemsReady: isReady,
      carrierMayConsume: isReady,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      carrierShouldNotOwnHydrationTruth: true,
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
      psychologyDoesNotOwnLandformTruth: true,
      psychologyDoesNotOwnHydrationTruth: true,
      psychologyDoesNotOwnVisualPass: true,
      psychologyMap: PSYCHOLOGY_MAP,

      metadataOnly: true,
      sourceGeometryPreserved: isReady,
      sourcePacketDetected: state.sourcePacketDetected,
      sourceGeometryValid: state.sourceGeometryValid,
      sourceFailureReason: state.sourceFailureReason,
      sourceRecords: options && options.includeSourceRecords === true ? stableClone(state.sourceRecords) : undefined,

      landformArraysMetadataOnly: true,
      landformArraysDoNotDraw: true,
      visualDrawingSuppressedToPreserveLandmass: true,
      carrierVisibleGeometrySuppressed: true,

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,

      terrainTruthSource: "existing dry terrain child only",
      reliefTruthSource: state.reliefValidated ? "metadata-only relief child" : "held or unavailable",
      landformSystemTruthChild: true,
      carrierDisplaysOnly: true,

      coastlineIsFinal: false,
      shorelineIsFinal: false,
      waterlineIsFinal: false,
      beachIsFinal: false,
      futureFillIsWater: false,

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

  function getLandformMetadataSummary(requester) {
    if (!state.built) buildLandformPacket();
    var summary = stableClone(state.landformMetadataSummary || {});
    summary.requester = requester || "unknown";
    return summary;
  }

  function api() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,
      status: status,
      refresh: buildLandformPacket,
      rebuild: buildLandformPacket,
      getCarrierLandformPacket: getCarrierLandformPacket,
      getLandformSystemsPacket: getLandformSystemsPacket,
      getLandformMetadataSummary: getLandformMetadataSummary
    });
  }

  function boot() {
    buildLandformPacket();
    setTimeout(buildLandformPacket, 180);
    setTimeout(buildLandformPacket, 640);
    setTimeout(buildLandformPacket, 1200);
  }

  var exported = api();

  window.AUDRALIA_LANDFORM_SYSTEMS_CHILD = exported;
  window.AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD = exported;
  window.AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD = exported;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
