// /assets/audralia/clean/terrain/audralia.beach-coastal-readiness.child.js
// AUDRALIA_BEACH_COASTAL_READINESS_METADATA_ONLY_HOLD_TNT_v1
// Full-file replacement.
// Previous: AUDRALIA_BEACH_COASTAL_READINESS_CHILD_TNT_v1
// Scope: downstream beach/coastal-readiness child only.
// Purpose: preserve beach/coastal readiness calculations while demoting all beach, shore, coastal, and hydration-handoff outputs to metadata-only / receipt-only inspection.
// Position: dry terrain atlas → elevation track → relief expression → landform systems → beach/coastal readiness metadata hold → future hydration baseline child.
// Does not own: source terrain truth, elevation truth, relief truth, landform truth, active hydration, water rendering, surface tint, void color, final coastline, final beaches, final shoreline, climate, ecology, settlement, carrier composition, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_BEACH_COASTAL_READINESS_METADATA_ONLY_HOLD_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_BEACH_COASTAL_READINESS_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.beach-coastal-readiness.child.js";
  var FAMILY_POSITION = "dry-terrain→elevation-track→relief-expression→landform-systems→beach-coastal-readiness-metadata-hold→hydration-baseline";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var ELEVATION_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_TRACK_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_CHILD",
    "AUDRALIA_G2_ELEVATION_TRACK_CHILD",
    "AUDRALIA_ELEVATION_TRACK_DOWNSTREAM_CHILD",
    "AUDRALIA_PLANET_ELEVATION_TRACK_DOWNSTREAM_CHILD"
  ]);

  var RELIEF_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD"
  ]);

  var LANDFORM_GLOBALS = Object.freeze([
    "AUDRALIA_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD"
  ]);

  var CLASSIFICATIONS = Object.freeze({
    BEACH_ELIGIBLE: "beach_eligible",
    COASTAL_SHELF: "coastal_shelf",
    CLIFF_BLOCKED: "cliff_blocked",
    BASIN_TO_SHORE: "basin_to_shore",
    COVE_CANDIDATE: "cove_candidate",
    INLET_CANDIDATE: "inlet_candidate",
    BAY_CANDIDATE: "bay_candidate",
    PROTECTED_SHORE: "protected_shore",
    FUTURE_FILL_EDGE: "future_fill_edge",
    NO_BEACH: "no_beach"
  });

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
    unassigned: "Unassigned"
  });

  var READINESS_LOCK = Object.freeze({
    metadataOnly: true,
    readinessOnly: true,
    receiptOnlyUntilHydrationAuthorized: true,

    carrierMayConsume: true,
    carrierMayInspect: true,
    carrierMayReport: true,
    carrierMayDisplay: false,
    carrierShouldDisplayOnly: false,
    carrierShouldNotDisplay: true,

    carrierMayTintSurface: false,
    carrierMayColorVoid: false,
    carrierMayDraw: false,
    carrierMayDrawBeach: false,
    carrierMayDrawCoastline: false,
    carrierMayDrawShoreline: false,
    carrierMayDrawFutureShore: false,
    carrierMayDrawHydrationHandoff: false,
    carrierMayDrawWaterMemory: false,

    sourceTerrainMutated: false,
    elevationTruthMutated: false,
    reliefTruthMutated: false,
    landformTruthMutated: false,

    surfaceColorAuthority: false,
    voidColorAuthority: false,
    hydrationColorAuthority: false,
    triangleColorAuthority: false,

    beachReadinessOnly: true,
    coastalBoundaryReadinessOnly: true,
    hydrationHandoffReadinessOnly: true,
    futureShoreReadinessOnly: true,

    beachIsFinal: false,
    coastlineIsFinal: false,
    shorelineIsFinal: false,
    activeHydration: false,
    activeWater: false,
    finalBeachPassClaim: false,
    finalCoastlinePassClaim: false,
    finalShorelinePassClaim: false,
    finalHydrationPassClaim: false,
    finalVisualPassClaim: false
  });

  var state = {
    dryTerrainApi: null,
    dryTerrainDetected: false,
    dryTerrainValidated: false,
    dryTerrainStatus: null,
    dryCarrierPacket: null,
    dryTerrainPacket: null,
    dryFailureReason: "dry terrain not checked",

    elevationApi: null,
    elevationTrackDetected: false,
    elevationTrackValidated: false,
    elevationStatus: null,
    elevationCarrierPacket: null,
    elevationFailureReason: "elevation track not checked",

    reliefApi: null,
    reliefExpressionDetected: false,
    reliefExpressionValidated: false,
    reliefStatus: null,
    reliefCarrierPacket: null,
    reliefFailureReason: "relief expression not checked",

    landformApi: null,
    landformSystemsDetected: false,
    landformSystemsValidated: false,
    landformStatus: null,
    landformCarrierPacket: null,
    landformFailureReason: "landform systems not checked",

    nodeRecords: [],
    nodeRecordById: {},
    reliefSampleByNodeId: {},
    elevationSampleByNodeId: {},
    landformIndex: null,

    coastalShelfMetadataZones: [],
    beachEligibilityMetadataZones: [],
    authorizedBeachCandidateMetadata: [],
    cliffBlockedCoastMetadataZones: [],
    basinToFutureShoreReadinessCorridors: [],
    futureShoreReadinessMetadataZones: [],
    namedBeachMetadataHooks: [],
    climateStandardBeachPlaceholder: null,
    hydrationHandoffReadinessMetadataZones: [],

    beachCoastalReadinessReady: false,
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

  function normalizeId(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback || "";
    return String(value);
  }

  function numeric(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function gridDistance(ax, ay, bx, by) {
    var dx = Math.abs(Number(ax) - Number(bx));
    dx = Math.min(dx, RADIAL_NODES - dx);
    var dy = Number(ay) - Number(by);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function applyReadinessLock(target) {
    Object.keys(READINESS_LOCK).forEach(function (key) {
      target[key] = READINESS_LOCK[key];
    });
    return target;
  }

  function freezeLocked(target) {
    return Object.freeze(applyReadinessLock(target));
  }

  function dryPacket() {
    return state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;
  }

  function dryNodes() {
    var packet = dryPacket();
    return packet && Array.isArray(packet.nodes) ? packet.nodes : [];
  }

  function detectDryTerrain() {
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryTerrainApi = api;
    state.dryTerrainDetected = Boolean(api);
    state.dryTerrainValidated = false;
    state.dryTerrainStatus = null;
    state.dryCarrierPacket = null;
    state.dryTerrainPacket = null;

    if (!api) {
      state.dryFailureReason = "dry revealed terrain atlas missing";
      return false;
    }

    if (typeof api.status !== "function") {
      state.dryFailureReason = "dry revealed terrain API incomplete";
      return false;
    }

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");

    if (typeof api.getCarrierTerrainPacket === "function") {
      state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });
    }

    if (typeof api.getDryRevealedTerrainPacket === "function") {
      state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });
    }

    state.dryTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true &&
      dryNodes().length
    );

    state.dryFailureReason = state.dryTerrainValidated ? "" : "dry revealed terrain validation failed";
    return state.dryTerrainValidated;
  }

  function detectElevationTrack() {
    var api = firstGlobal(ELEVATION_GLOBALS);

    state.elevationApi = api;
    state.elevationTrackDetected = Boolean(api);
    state.elevationTrackValidated = false;
    state.elevationStatus = null;
    state.elevationCarrierPacket = null;

    if (!api) {
      state.elevationFailureReason = "elevation track child missing";
      return false;
    }

    state.elevationStatus = typeof api.status === "function" ? safeCall("elevationTrack", api, "status") : null;

    if (typeof api.getCarrierElevationPacket === "function") {
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getCarrierElevationPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });
    } else if (typeof api.getElevationTrackPacket === "function") {
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getElevationTrackPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });
    } else if (typeof api.getElevationPacket === "function") {
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getElevationPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });
    }

    state.elevationTrackValidated = Boolean(
      state.elevationCarrierPacket ||
      (state.elevationStatus && state.elevationStatus.activeHydration !== true)
    );

    state.elevationFailureReason = state.elevationTrackValidated ? "" : "elevation track packet unavailable";
    return state.elevationTrackValidated;
  }

  function detectReliefExpression() {
    var api = firstGlobal(RELIEF_GLOBALS);

    state.reliefApi = api;
    state.reliefExpressionDetected = Boolean(api);
    state.reliefExpressionValidated = false;
    state.reliefStatus = null;
    state.reliefCarrierPacket = null;

    if (!api) {
      state.reliefFailureReason = "relief expression child missing";
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierReliefPacket !== "function") {
      state.reliefFailureReason = "relief expression API incomplete";
      return false;
    }

    state.reliefStatus = safeCall("reliefExpression", api, "status");
    state.reliefCarrierPacket = safeCall("reliefExpression", api, "getCarrierReliefPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });

    state.reliefExpressionValidated = Boolean(
      state.reliefCarrierPacket &&
      state.reliefCarrierPacket.reliefExpressionReady === true &&
      state.reliefCarrierPacket.carrierMayConsume === true &&
      state.reliefCarrierPacket.hydrationHeld === true &&
      state.reliefCarrierPacket.activeHydration === false &&
      state.reliefCarrierPacket.finalVisualPassClaim === false
    );

    state.reliefFailureReason = state.reliefExpressionValidated ? "" : "relief expression validation failed";
    return state.reliefExpressionValidated;
  }

  function detectLandformSystems() {
    var api = firstGlobal(LANDFORM_GLOBALS);

    state.landformApi = api;
    state.landformSystemsDetected = Boolean(api);
    state.landformSystemsValidated = false;
    state.landformStatus = null;
    state.landformCarrierPacket = null;

    if (!api) {
      state.landformFailureReason = "landform systems child missing";
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierLandformPacket !== "function") {
      state.landformFailureReason = "landform systems API incomplete";
      return false;
    }

    state.landformStatus = safeCall("landformSystems", api, "status");
    state.landformCarrierPacket = safeCall("landformSystems", api, "getCarrierLandformPacket", "audralia-beach-coastal-metadata-hold-child", { compact: false });

    state.landformSystemsValidated = Boolean(
      state.landformCarrierPacket &&
      state.landformCarrierPacket.landformSystemsReady === true &&
      state.landformCarrierPacket.carrierMayConsume === true &&
      state.landformCarrierPacket.carrierShouldNotOwnLandformTruth === true &&
      state.landformCarrierPacket.hydrationHeld === true &&
      state.landformCarrierPacket.activeHydration === false &&
      state.landformCarrierPacket.finalVisualPassClaim === false
    );

    state.landformFailureReason = state.landformSystemsValidated ? "" : "landform systems validation failed";
    return state.landformSystemsValidated;
  }

  function indexSample(index, key, sample) {
    if (!key || !sample) return;
    index[String(key)] = sample;
  }

  function buildReliefIndex() {
    var index = {};
    var packet = state.reliefCarrierPacket;

    if (!packet || !Array.isArray(packet.reliefSamples)) {
      state.reliefSampleByNodeId = index;
      return index;
    }

    packet.reliefSamples.forEach(function (sample, i) {
      indexSample(index, sample.parentNodeId, sample);
      indexSample(index, sample.nodeId, sample);
      indexSample(index, sample.seatKey, sample);
      indexSample(index, sample.seatIndex, sample);
      indexSample(index, "source-" + i, sample);
      indexSample(index, String(i), sample);
    });

    state.reliefSampleByNodeId = index;
    return index;
  }

  function buildElevationIndex() {
    var index = {};
    var packet = state.elevationCarrierPacket;

    function addList(list) {
      if (!Array.isArray(list)) return;

      list.forEach(function (sample, i) {
        indexSample(index, sample.parentNodeId, sample);
        indexSample(index, sample.nodeId, sample);
        indexSample(index, sample.seatKey, sample);
        indexSample(index, sample.seatIndex, sample);
        indexSample(index, "source-" + i, sample);
        indexSample(index, String(i), sample);
      });
    }

    if (packet) {
      addList(packet.elevationSamples);
      addList(packet.nodes);
      addList(packet.trackSamples);
      addList(packet.elevationTrackSamples);
    }

    state.elevationSampleByNodeId = index;
    return index;
  }

  function addNodeSet(set, nodeIds) {
    if (!Array.isArray(nodeIds)) return;

    nodeIds.forEach(function (nodeId) {
      if (nodeId !== undefined && nodeId !== null) set[String(nodeId)] = true;
    });
  }

  function buildLandformIndex() {
    var packet = state.landformCarrierPacket || {};
    var index = {
      mountainNodeIds: {},
      summitNodeIds: {},
      landmarkNodeIds: {},
      plateauNodeIds: {},
      basinNodeIds: {},
      cliffNodeIds: {},
      corridorNodeIds: {},
      mountainRanges: Array.isArray(packet.mountainRanges) ? packet.mountainRanges : [],
      landmarks: Array.isArray(packet.landmarks) ? packet.landmarks : [],
      plateaus: Array.isArray(packet.plateaus) ? packet.plateaus : [],
      landformBasins: Array.isArray(packet.landformBasins) ? packet.landformBasins : [],
      cliffSystems: Array.isArray(packet.cliffSystems) ? packet.cliffSystems : [],
      continentLandformProfiles: Array.isArray(packet.continentLandformProfiles) ? packet.continentLandformProfiles : []
    };

    index.mountainRanges.forEach(function (range) {
      addNodeSet(index.mountainNodeIds, range.nodeIds);
      addNodeSet(index.summitNodeIds, range.summitNodeIds);
    });

    index.landmarks.forEach(function (landmark) {
      addNodeSet(index.landmarkNodeIds, [landmark.anchorNodeId]);
      addNodeSet(index.landmarkNodeIds, landmark.nodeIds);
    });

    index.plateaus.forEach(function (plateau) {
      addNodeSet(index.plateauNodeIds, plateau.nodeIds);
    });

    index.landformBasins.forEach(function (basin) {
      addNodeSet(index.basinNodeIds, basin.nodeIds);
      addNodeSet(index.corridorNodeIds, basin.corridorNodeIds);
    });

    index.cliffSystems.forEach(function (cliff) {
      addNodeSet(index.cliffNodeIds, cliff.nodeIds);
      addNodeSet(index.cliffNodeIds, cliff.edgeNodeIds);
    });

    state.landformIndex = index;
    return index;
  }

  function lookupByNodeId(index, node, sourceIndex) {
    var keys = [
      node.nodeId,
      node.seatKey,
      node.id,
      node.nodeIndex,
      node.seatIndex,
      "node-" + sourceIndex,
      "source-" + sourceIndex,
      String(sourceIndex)
    ];

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (key !== undefined && key !== null && index[String(key)]) return index[String(key)];
    }

    return null;
  }

  function regionName(regionSeed) {
    return REGION_NAMES[regionSeed] || REGION_NAMES.unassigned;
  }

  function buildNodeRecords() {
    var nodes = dryNodes();
    var reliefIndex = buildReliefIndex();
    var elevationIndex = buildElevationIndex();
    var landformIndex = buildLandformIndex();
    var records = [];
    var byId = {};

    nodes.forEach(function (node, sourceIndex) {
      var relief = lookupByNodeId(reliefIndex, node, sourceIndex) || {};
      var elevation = lookupByNodeId(elevationIndex, node, sourceIndex) || {};
      var nodeId = normalizeId(node.nodeId || node.seatKey || node.id || node.seatIndex || node.nodeIndex, "source-" + sourceIndex);
      var x = numeric(node.x, numeric(node.radial, sourceIndex % RADIAL_NODES));
      var y = numeric(node.y, numeric(node.band, Math.floor(sourceIndex / RADIAL_NODES)));
      var ll = terrainSeatToLonLat(x, y);

      var dryElevation = numeric(
        elevation.elevation,
        numeric(elevation.dryElevation,
          numeric(relief.elevation,
            numeric(node.dryElevation, numeric(node.elevation, 0.5))
          )
        )
      );

      var slope = clamp(
        numeric(relief.slope, numeric(relief.slopeIndex, numeric(elevation.slope, numeric(node.slope, 0.5)))),
        0,
        1
      );

      var reliefIntensity = clamp(
        numeric(relief.reliefIntensity, numeric(node.reliefIntensity, 0)),
        0,
        1
      );

      var ridgePressure = clamp(
        numeric(node.ridgePressure, numeric(relief.ridgeHighlight, 0)),
        0,
        1
      );

      var mountainPressure = clamp(
        numeric(node.mountainPressure, numeric(relief.mountainPressure, 0)),
        0,
        1
      );

      var summitPressure = clamp(
        numeric(node.summitPressure, numeric(relief.summitEmphasis, 0)),
        0,
        1
      );

      var basinPressure = clamp(
        numeric(node.basinPressure, numeric(relief.basinShadow, 0)),
        0,
        1
      );

      var valleyPressure = clamp(
        numeric(node.valleyPressure, numeric(relief.valleyFlowStrength, 0)),
        0,
        1
      );

      var shelfPressure = clamp(
        numeric(node.shelfPressure, numeric(relief.shelfReliefStrength, numeric(elevation.shelfPressure, 0))),
        0,
        1
      );

      var escarpmentPressure = clamp(
        numeric(node.escarpmentPressure, numeric(relief.escarpmentPressure, 0)),
        0,
        1
      );

      var gapPressure = clamp(
        numeric(node.gapPressure, numeric(relief.futureFillPressure, 0)),
        0,
        1
      );

      var cliffFromLandform = landformIndex.cliffNodeIds[nodeId] ? 1 : 0;
      var mountainFromLandform = landformIndex.mountainNodeIds[nodeId] ? 1 : 0;
      var summitFromLandform = landformIndex.summitNodeIds[nodeId] ? 1 : 0;
      var plateauFromLandform = landformIndex.plateauNodeIds[nodeId] ? 1 : 0;
      var basinFromLandform = landformIndex.basinNodeIds[nodeId] ? 1 : 0;
      var landmarkFromLandform = landformIndex.landmarkNodeIds[nodeId] ? 1 : 0;

      var cliffPressure = clamp(
        escarpmentPressure * 0.58 +
        slope * 0.22 +
        ridgePressure * 0.12 +
        cliffFromLandform * 0.74,
        0,
        1
      );

      var lowElevationScore = clamp(1 - Math.abs(dryElevation - 0.30) / 0.42, 0, 1);
      var gentleSlopeScore = clamp(1 - slope, 0, 1);
      var shelfScore = clamp(shelfPressure * 0.65 + plateauFromLandform * 0.18 + gentleSlopeScore * 0.17, 0, 1);
      var futureFillScore = clamp(gapPressure * 0.50 + basinPressure * 0.28 + valleyPressure * 0.12 + Boolean(node.futureFillEligible) * 0.20, 0, 1);
      var hardTerrainExclusion = clamp(cliffPressure * 0.42 + ridgePressure * 0.20 + mountainPressure * 0.22 + mountainFromLandform * 0.20 + summitFromLandform * 0.16, 0, 1);
      var protectedScore = clamp(basinPressure * 0.24 + valleyPressure * 0.20 + shelfScore * 0.22 + (1 - cliffPressure) * 0.20 + gentleSlopeScore * 0.14, 0, 1);

      var beachEligibilityScore = clamp(
        lowElevationScore * 0.22 +
        gentleSlopeScore * 0.20 +
        shelfScore * 0.20 +
        futureFillScore * 0.18 +
        basinPressure * 0.08 +
        protectedScore * 0.12 -
        hardTerrainExclusion * 0.34,
        0,
        1
      );

      var coastalReadinessScore = clamp(
        shelfScore * 0.28 +
        futureFillScore * 0.24 +
        lowElevationScore * 0.18 +
        protectedScore * 0.18 +
        basinPressure * 0.08 -
        cliffPressure * 0.20,
        0,
        1
      );

      var classification = CLASSIFICATIONS.NO_BEACH;

      if (cliffPressure > 0.58 || slope > 0.78) {
        classification = CLASSIFICATIONS.CLIFF_BLOCKED;
      } else if (beachEligibilityScore > 0.64 && shelfScore > 0.42 && gentleSlopeScore > 0.50) {
        classification = CLASSIFICATIONS.BEACH_ELIGIBLE;
      } else if (shelfScore > 0.56 && lowElevationScore > 0.36 && cliffPressure < 0.45) {
        classification = CLASSIFICATIONS.COASTAL_SHELF;
      } else if (futureFillScore > 0.58 && basinPressure > 0.34 && cliffPressure < 0.55) {
        classification = CLASSIFICATIONS.BASIN_TO_SHORE;
      } else if (futureFillScore > 0.48 && lowElevationScore > 0.42) {
        classification = CLASSIFICATIONS.FUTURE_FILL_EDGE;
      } else if (protectedScore > 0.62 && shelfScore > 0.34) {
        classification = CLASSIFICATIONS.PROTECTED_SHORE;
      }

      if (classification !== CLASSIFICATIONS.CLIFF_BLOCKED && classification !== CLASSIFICATIONS.NO_BEACH) {
        if (basinPressure > 0.52 && valleyPressure > 0.38 && shelfScore > 0.36) {
          classification = CLASSIFICATIONS.INLET_CANDIDATE;
        } else if (basinPressure > 0.48 && protectedScore > 0.58 && cliffPressure < 0.32) {
          classification = CLASSIFICATIONS.COVE_CANDIDATE;
        } else if (shelfScore > 0.62 && basinPressure > 0.36 && futureFillScore > 0.48) {
          classification = CLASSIFICATIONS.BAY_CANDIDATE;
        }
      }

      var regionSeed = String(node.regionSeed || node.continentId || relief.continentId || "unassigned").toLowerCase();

      var record = freezeLocked({
        nodeId: nodeId,
        sourceSeatIndex: numeric(node.seatIndex, numeric(node.nodeIndex, sourceIndex)),
        sourceIndex: sourceIndex,
        x: round(x, 4),
        y: round(y, 4),
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),

        continentId: regionSeed,
        continentName: regionName(regionSeed),
        terrainRole: node.primaryTerrainRole || node.terrainClass || relief.carrierVisualRole || "dry_terrain",

        dryElevation: round(dryElevation, 4),
        slope: round(slope, 4),
        reliefIntensity: round(reliefIntensity, 4),
        ridgePressure: round(ridgePressure, 4),
        mountainPressure: round(clamp(mountainPressure + mountainFromLandform * 0.22, 0, 1), 4),
        summitPressure: round(clamp(summitPressure + summitFromLandform * 0.20, 0, 1), 4),
        basinPressure: round(clamp(basinPressure + basinFromLandform * 0.18, 0, 1), 4),
        valleyPressure: round(valleyPressure, 4),
        shelfPressure: round(shelfPressure, 4),
        escarpmentPressure: round(escarpmentPressure, 4),
        gapPressure: round(gapPressure, 4),

        cliffPressure: round(cliffPressure, 4),
        lowElevationScore: round(lowElevationScore, 4),
        gentleSlopeScore: round(gentleSlopeScore, 4),
        shelfScore: round(shelfScore, 4),
        futureFillScore: round(futureFillScore, 4),
        protectedScore: round(protectedScore, 4),
        hardTerrainExclusion: round(hardTerrainExclusion, 4),

        beachEligibilityScore: round(beachEligibilityScore, 4),
        coastalReadinessScore: round(coastalReadinessScore, 4),
        classification: classification,

        landformFlags: {
          mountainRange: Boolean(mountainFromLandform),
          summit: Boolean(summitFromLandform),
          plateau: Boolean(plateauFromLandform),
          basin: Boolean(basinFromLandform),
          cliff: Boolean(cliffFromLandform),
          landmark: Boolean(landmarkFromLandform)
        }
      });

      records.push(record);
      byId[nodeId] = record;
    });

    state.nodeRecords = Object.freeze(records);
    state.nodeRecordById = byId;
    return state.nodeRecords;
  }

  function neighborContinuity(record, classifications) {
    var allowed = {};
    classifications.forEach(function (classification) {
      allowed[classification] = true;
    });

    var count = 0;
    var total = 0;

    state.nodeRecords.forEach(function (other) {
      if (other.nodeId === record.nodeId) return;
      var d = gridDistance(record.x, record.y, other.x, other.y);
      if (d > 0 && d <= 2.2) {
        total += 1;
        if (allowed[other.classification]) count += 1;
      }
    });

    return total ? count / total : 0;
  }

  function zoneBase(record, zoneType, scoreKey) {
    return freezeLocked({
      zoneId: "AUDRALIA-" + zoneType.toUpperCase().replace(/[^A-Z0-9]+/g, "-") + "-" + String(record.sourceIndex).padStart(3, "0"),
      zoneType: zoneType,
      classification: record.classification,
      nodeId: record.nodeId,
      sourceSeatIndex: record.sourceSeatIndex,
      sourceIndex: record.sourceIndex,
      x: record.x,
      y: record.y,
      lon: record.lon,
      lat: record.lat,
      continentId: record.continentId,
      continentName: record.continentName,
      terrainRole: record.terrainRole,
      dryElevation: record.dryElevation,
      slope: record.slope,
      shelfScore: record.shelfScore,
      futureFillScore: record.futureFillScore,
      cliffPressure: record.cliffPressure,
      basinPressure: record.basinPressure,
      protectedScore: record.protectedScore,
      beachEligibilityScore: record.beachEligibilityScore,
      coastalReadinessScore: record.coastalReadinessScore,
      continuityScore: round(neighborContinuity(record, [
        CLASSIFICATIONS.BEACH_ELIGIBLE,
        CLASSIFICATIONS.COASTAL_SHELF,
        CLASSIFICATIONS.COVE_CANDIDATE,
        CLASSIFICATIONS.INLET_CANDIDATE,
        CLASSIFICATIONS.BAY_CANDIDATE,
        CLASSIFICATIONS.PROTECTED_SHORE,
        CLASSIFICATIONS.FUTURE_FILL_EDGE
      ]), 4),
      score: round(record[scoreKey] || record.coastalReadinessScore || record.beachEligibilityScore || 0, 4)
    });
  }

  function hydrationHandoffMetadata(record) {
    return freezeLocked({
      zoneId: "AUDRALIA-HYDRATION-HANDOFF-READINESS-" + String(record.sourceIndex).padStart(3, "0"),
      zoneType: "hydration_handoff_readiness_metadata_zone",
      nodeId: record.nodeId,
      sourceSeatIndex: record.sourceSeatIndex,
      sourceIndex: record.sourceIndex,
      x: record.x,
      y: record.y,
      lon: record.lon,
      lat: record.lat,
      continentId: record.continentId,
      continentName: record.continentName,
      coastalReadinessScore: record.coastalReadinessScore,
      beachEligibilityScore: record.beachEligibilityScore,
      futureFillScore: record.futureFillScore,
      cliffPressure: record.cliffPressure,
      classification: record.classification,
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false
    });
  }

  function buildCoastalOutputs() {
    var coastalShelfMetadataZones = [];
    var beachEligibilityMetadataZones = [];
    var cliffBlockedCoastMetadataZones = [];
    var basinToFutureShoreReadinessCorridors = [];
    var futureShoreReadinessMetadataZones = [];
    var hydrationHandoffReadinessMetadataZones = [];

    state.nodeRecords.forEach(function (record) {
      if (record.classification === CLASSIFICATIONS.CLIFF_BLOCKED) {
        cliffBlockedCoastMetadataZones.push(zoneBase(record, "cliff_blocked_coast_metadata_zone", "cliffPressure"));
      }

      if (
        record.classification === CLASSIFICATIONS.COASTAL_SHELF ||
        record.classification === CLASSIFICATIONS.BEACH_ELIGIBLE ||
        record.classification === CLASSIFICATIONS.COVE_CANDIDATE ||
        record.classification === CLASSIFICATIONS.INLET_CANDIDATE ||
        record.classification === CLASSIFICATIONS.BAY_CANDIDATE
      ) {
        coastalShelfMetadataZones.push(zoneBase(record, "coastal_shelf_metadata_zone", "shelfScore"));
      }

      if (
        record.classification === CLASSIFICATIONS.BEACH_ELIGIBLE ||
        record.classification === CLASSIFICATIONS.COVE_CANDIDATE ||
        record.classification === CLASSIFICATIONS.INLET_CANDIDATE ||
        record.classification === CLASSIFICATIONS.BAY_CANDIDATE
      ) {
        beachEligibilityMetadataZones.push(zoneBase(record, "beach_eligibility_metadata_zone", "beachEligibilityScore"));
      }

      if (
        record.classification === CLASSIFICATIONS.BASIN_TO_SHORE ||
        record.classification === CLASSIFICATIONS.INLET_CANDIDATE ||
        (record.basinPressure > 0.42 && record.futureFillScore > 0.46 && record.cliffPressure < 0.56)
      ) {
        basinToFutureShoreReadinessCorridors.push(zoneBase(record, "basin_to_future_shore_readiness_corridor", "futureFillScore"));
      }

      if (
        record.classification !== CLASSIFICATIONS.NO_BEACH &&
        record.classification !== CLASSIFICATIONS.CLIFF_BLOCKED &&
        record.coastalReadinessScore > 0.42
      ) {
        futureShoreReadinessMetadataZones.push(zoneBase(record, "future_shore_readiness_metadata_zone", "coastalReadinessScore"));
      }

      if (
        record.classification !== CLASSIFICATIONS.NO_BEACH &&
        record.classification !== CLASSIFICATIONS.CLIFF_BLOCKED &&
        (record.futureFillScore > 0.42 || record.coastalReadinessScore > 0.50)
      ) {
        hydrationHandoffReadinessMetadataZones.push(hydrationHandoffMetadata(record));
      }
    });

    state.coastalShelfMetadataZones = Object.freeze(coastalShelfMetadataZones);
    state.beachEligibilityMetadataZones = Object.freeze(beachEligibilityMetadataZones);
    state.cliffBlockedCoastMetadataZones = Object.freeze(cliffBlockedCoastMetadataZones);
    state.basinToFutureShoreReadinessCorridors = Object.freeze(basinToFutureShoreReadinessCorridors);
    state.futureShoreReadinessMetadataZones = Object.freeze(futureShoreReadinessMetadataZones);
    state.hydrationHandoffReadinessMetadataZones = Object.freeze(hydrationHandoffReadinessMetadataZones);
  }

  function buildAuthorizedBeachCandidateMetadata() {
    var byContinent = {};
    var candidates = [];

    state.beachEligibilityMetadataZones.forEach(function (zone) {
      if (!byContinent[zone.continentId]) byContinent[zone.continentId] = [];
      byContinent[zone.continentId].push(zone);
    });

    Object.keys(byContinent).forEach(function (continentId) {
      var sorted = byContinent[continentId].slice().sort(function (a, b) {
        return (b.beachEligibilityScore + b.continuityScore * 0.22 + b.protectedScore * 0.16) -
          (a.beachEligibilityScore + a.continuityScore * 0.22 + a.protectedScore * 0.16);
      });

      sorted.slice(0, 2).forEach(function (zone, localIndex) {
        candidates.push(freezeLocked({
          candidateId: "AUDRALIA-AUTHORIZED-BEACH-CANDIDATE-METADATA-" + continentId.toUpperCase().replace(/[^A-Z0-9]+/g, "-") + "-" + String(localIndex + 1).padStart(2, "0"),
          candidateStatus: "metadata_candidate_only_not_final_beach",
          nodeId: zone.nodeId,
          sourceSeatIndex: zone.sourceSeatIndex,
          sourceIndex: zone.sourceIndex,
          x: zone.x,
          y: zone.y,
          lon: zone.lon,
          lat: zone.lat,
          continentId: zone.continentId,
          continentName: zone.continentName,
          classification: zone.classification,
          beachEligibilityScore: zone.beachEligibilityScore,
          coastalReadinessScore: zone.coastalReadinessScore,
          continuityScore: zone.continuityScore,
          protectedScore: zone.protectedScore,
          cliffPressure: zone.cliffPressure,
          namingStatus: "held",
          finalName: null,
          beachIsLimitedSpecialNotDefault: true
        }));
      });
    });

    candidates.sort(function (a, b) {
      return b.beachEligibilityScore - a.beachEligibilityScore;
    });

    state.authorizedBeachCandidateMetadata = Object.freeze(candidates.slice(0, 16));
  }

  function buildNamedBeachMetadataHooks() {
    var hooks = [];

    Object.keys(REGION_NAMES).forEach(function (continentId) {
      if (continentId === "unassigned") return;

      hooks.push(freezeLocked({
        hookId: "AUDRALIA-NAMED-BEACH-METADATA-HOOK-" + continentId.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
        continentId: continentId,
        continentName: REGION_NAMES[continentId],
        hookStatus: "held_for_future_authorized_name",
        finalName: null,
        nameInvented: false,
        namingRequiresUserAuthorization: true,
        beachIsLimitedSpecialNotDefault: true
      }));
    });

    hooks.push(freezeLocked({
      hookId: "AUDRALIA-NAMED-BEACH-METADATA-HOOK-CLIMATE-STANDARD",
      hookStatus: "held_for_future_climate_standard_beach",
      finalName: null,
      nameInvented: false,
      namingRequiresUserAuthorization: true,
      climateStandardBeachPlaceholderHeld: true
    }));

    state.namedBeachMetadataHooks = Object.freeze(hooks);

    state.climateStandardBeachPlaceholder = freezeLocked({
      placeholderId: "AUDRALIA-CLIMATE-STANDARD-BEACH-PLACEHOLDER",
      status: "held",
      finalName: null,
      nameInvented: false,
      selectionCriteria: Object.freeze({
        beachEligibilityRequired: true,
        lowCliffPressureRequired: true,
        shelfContinuityRequired: true,
        futureHydrationHandoffRequired: true,
        climateStandardDataRequiredLater: true
      }),
      climateStandardBeachPlaceholderHeld: true
    });
  }

  function buildBeachCoastalReadiness() {
    detectDryTerrain();
    detectElevationTrack();
    detectReliefExpression();
    detectLandformSystems();

    buildNodeRecords();
    buildCoastalOutputs();
    buildAuthorizedBeachCandidateMetadata();
    buildNamedBeachMetadataHooks();

    state.beachCoastalReadinessReady = Boolean(
      state.dryTerrainValidated &&
      state.nodeRecords.length &&
      (
        state.coastalShelfMetadataZones.length ||
        state.beachEligibilityMetadataZones.length ||
        state.futureShoreReadinessMetadataZones.length ||
        state.hydrationHandoffReadinessMetadataZones.length
      )
    );

    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();
    publishStatus();

    return state.beachCoastalReadinessReady;
  }

  function compactZone(zone) {
    return applyReadinessLock({
      zoneId: zone.zoneId,
      zoneType: zone.zoneType,
      classification: zone.classification,
      nodeId: zone.nodeId,
      sourceSeatIndex: zone.sourceSeatIndex,
      x: zone.x,
      y: zone.y,
      lon: zone.lon,
      lat: zone.lat,
      continentId: zone.continentId,
      continentName: zone.continentName,
      score: zone.score,
      beachEligibilityScore: zone.beachEligibilityScore,
      coastalReadinessScore: zone.coastalReadinessScore,
      cliffPressure: zone.cliffPressure
    });
  }

  function cloneList(list, compact) {
    return compact ? list.map(compactZone) : stableClone(list);
  }

  function readinessPacket(requestor, options) {
    var compact = Boolean(options && options.compact);

    return Object.freeze(applyReadinessLock({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      familyPosition: FAMILY_POSITION,
      packetType: "audralia_beach_coastal_readiness_metadata_only_hold_packet",
      requestor: requestor || "unknown",
      requester: requestor || "unknown",

      sourceSeatCount: SOURCE_SEAT_COUNT,
      nodeRecordCount: state.nodeRecords.length,

      sourceTerrainDetected: state.dryTerrainDetected,
      sourceTerrainValidated: state.dryTerrainValidated,
      elevationTrackDetected: state.elevationTrackDetected,
      elevationTrackValidated: state.elevationTrackValidated,
      reliefExpressionDetected: state.reliefExpressionDetected,
      reliefExpressionValidated: state.reliefExpressionValidated,
      landformSystemsDetected: state.landformSystemsDetected,
      landformSystemsValidated: state.landformSystemsValidated,

      beachCoastalReadinessReady: state.beachCoastalReadinessReady,

      coastalShelfMetadataZoneCount: state.coastalShelfMetadataZones.length,
      beachEligibilityMetadataZoneCount: state.beachEligibilityMetadataZones.length,
      authorizedBeachCandidateMetadataCount: state.authorizedBeachCandidateMetadata.length,
      cliffBlockedCoastMetadataZoneCount: state.cliffBlockedCoastMetadataZones.length,
      basinToFutureShoreReadinessCorridorCount: state.basinToFutureShoreReadinessCorridors.length,
      futureShoreReadinessMetadataZoneCount: state.futureShoreReadinessMetadataZones.length,
      hydrationHandoffReadinessMetadataZoneCount: state.hydrationHandoffReadinessMetadataZones.length,

      coastalShelfMetadataZones: cloneList(state.coastalShelfMetadataZones, compact),
      beachEligibilityMetadataZones: cloneList(state.beachEligibilityMetadataZones, compact),
      authorizedBeachCandidateMetadata: stableClone(state.authorizedBeachCandidateMetadata),
      cliffBlockedCoastMetadataZones: cloneList(state.cliffBlockedCoastMetadataZones, compact),
      basinToFutureShoreReadinessCorridors: cloneList(state.basinToFutureShoreReadinessCorridors, compact),
      futureShoreReadinessMetadataZones: cloneList(state.futureShoreReadinessMetadataZones, compact),
      namedBeachMetadataHooks: stableClone(state.namedBeachMetadataHooks),
      climateStandardBeachPlaceholder: stableClone(state.climateStandardBeachPlaceholder),
      hydrationHandoffReadinessMetadataZones: cloneList(state.hydrationHandoffReadinessMetadataZones, compact),

      coastalShelfZones: cloneList(state.coastalShelfMetadataZones, compact),
      beachEligibilityZones: cloneList(state.beachEligibilityMetadataZones, compact),
      authorizedBeachCandidates: stableClone(state.authorizedBeachCandidateMetadata),
      cliffBlockedCoasts: cloneList(state.cliffBlockedCoastMetadataZones, compact),
      basinToShoreCorridors: cloneList(state.basinToFutureShoreReadinessCorridors, compact),
      futureShoreReceivingZones: cloneList(state.futureShoreReadinessMetadataZones, compact),
      namedBeachHooks: stableClone(state.namedBeachMetadataHooks),
      hydrationHandoffZones: cloneList(state.hydrationHandoffReadinessMetadataZones, compact),

      coastalShelfZoneCount: state.coastalShelfMetadataZones.length,
      beachEligibilityZoneCount: state.beachEligibilityMetadataZones.length,
      authorizedBeachCandidateCount: state.authorizedBeachCandidateMetadata.length,
      cliffBlockedCoastCount: state.cliffBlockedCoastMetadataZones.length,
      basinToShoreCorridorCount: state.basinToFutureShoreReadinessCorridors.length,
      futureShoreReceivingZoneCount: state.futureShoreReadinessMetadataZones.length,
      hydrationHandoffZoneCount: state.hydrationHandoffReadinessMetadataZones.length,

      beachesAreLimitedSpecialNotDefault: true,
      coastlineDoesNotAutomaticallyMeanBeach: true,
      shoreDoesNotAutomaticallyMeanBeach: true,
      waterBoundaryDoesNotAutomaticallyMeanBeach: true,

      beachReadinessOnly: true,
      coastalBoundaryReadinessOnly: true,
      hydrationHandoffOnly: false,
      hydrationHandoffReadinessOnly: true,
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false
    }));
  }

  function carrierBeachPacket(requestor, options) {
    var packet = readinessPacket(requestor || "unknown", options || { compact: true });

    return Object.freeze(applyReadinessLock({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      packetType: "carrier_beach_coastal_readiness_metadata_hold_packet",
      requestor: requestor || "unknown",
      requester: requestor || "unknown",

      carrierMayConsume: true,
      carrierMayInspect: true,
      carrierMayReport: true,
      carrierMayDisplay: false,
      carrierShouldDisplayOnly: false,
      carrierShouldNotDisplay: true,
      carrierShouldNotOwnBeachTruth: true,
      carrierShouldNotOwnCoastlineTruth: true,
      carrierShouldNotOwnHydrationTruth: true,
      carrierShouldNotActivateWater: true,
      carrierMayTintSurface: false,
      carrierMayColorVoid: false,
      carrierMayDrawBeach: false,
      carrierMayDrawCoastline: false,
      carrierMayDrawShoreline: false,
      carrierMayDrawFutureShore: false,
      carrierMayDrawHydrationHandoff: false,
      carrierMayDrawWaterMemory: false,

      beachCoastalReadinessReady: packet.beachCoastalReadinessReady,

      coastalShelfMetadataZones: packet.coastalShelfMetadataZones,
      beachEligibilityMetadataZones: packet.beachEligibilityMetadataZones,
      authorizedBeachCandidateMetadata: packet.authorizedBeachCandidateMetadata,
      cliffBlockedCoastMetadataZones: packet.cliffBlockedCoastMetadataZones,
      basinToFutureShoreReadinessCorridors: packet.basinToFutureShoreReadinessCorridors,
      futureShoreReadinessMetadataZones: packet.futureShoreReadinessMetadataZones,
      hydrationHandoffReadinessMetadataZones: packet.hydrationHandoffReadinessMetadataZones,

      coastalShelfZones: packet.coastalShelfZones,
      beachEligibilityZones: packet.beachEligibilityZones,
      authorizedBeachCandidates: packet.authorizedBeachCandidates,
      cliffBlockedCoasts: packet.cliffBlockedCoasts,
      basinToShoreCorridors: packet.basinToShoreCorridors,
      futureShoreReceivingZones: packet.futureShoreReceivingZones,
      hydrationHandoffZones: packet.hydrationHandoffZones,

      coastalShelfMetadataZoneCount: packet.coastalShelfMetadataZoneCount,
      beachEligibilityMetadataZoneCount: packet.beachEligibilityMetadataZoneCount,
      authorizedBeachCandidateMetadataCount: packet.authorizedBeachCandidateMetadataCount,
      cliffBlockedCoastMetadataZoneCount: packet.cliffBlockedCoastMetadataZoneCount,
      basinToFutureShoreReadinessCorridorCount: packet.basinToFutureShoreReadinessCorridorCount,
      futureShoreReadinessMetadataZoneCount: packet.futureShoreReadinessMetadataZoneCount,
      hydrationHandoffReadinessMetadataZoneCount: packet.hydrationHandoffReadinessMetadataZoneCount,

      coastalShelfZoneCount: packet.coastalShelfZoneCount,
      beachEligibilityZoneCount: packet.beachEligibilityZoneCount,
      authorizedBeachCandidateCount: packet.authorizedBeachCandidateCount,
      cliffBlockedCoastCount: packet.cliffBlockedCoastCount,
      basinToShoreCorridorCount: packet.basinToShoreCorridorCount,
      futureShoreReceivingZoneCount: packet.futureShoreReceivingZoneCount,
      hydrationHandoffZoneCount: packet.hydrationHandoffZoneCount,

      beachesAreLimitedSpecialNotDefault: true,
      receiptOnlyUntilHydrationAuthorized: true
    }));
  }

  function statusPayload() {
    return applyReadinessLock({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      familyPosition: FAMILY_POSITION,

      sourceTerrainDetected: state.dryTerrainDetected,
      sourceTerrainValidated: state.dryTerrainValidated,
      sourceTerrainFailureReason: state.dryFailureReason,

      elevationTrackDetected: state.elevationTrackDetected,
      elevationTrackValidated: state.elevationTrackValidated,
      elevationTrackFailureReason: state.elevationFailureReason,

      reliefExpressionDetected: state.reliefExpressionDetected,
      reliefExpressionValidated: state.reliefExpressionValidated,
      reliefExpressionFailureReason: state.reliefFailureReason,

      landformSystemsDetected: state.landformSystemsDetected,
      landformSystemsValidated: state.landformSystemsValidated,
      landformSystemsFailureReason: state.landformFailureReason,

      beachCoastalReadinessReady: state.beachCoastalReadinessReady,
      nodeRecordCount: state.nodeRecords.length,

      coastalShelfMetadataZoneCount: state.coastalShelfMetadataZones.length,
      beachEligibilityMetadataZoneCount: state.beachEligibilityMetadataZones.length,
      authorizedBeachCandidateMetadataCount: state.authorizedBeachCandidateMetadata.length,
      cliffBlockedCoastMetadataZoneCount: state.cliffBlockedCoastMetadataZones.length,
      basinToFutureShoreReadinessCorridorCount: state.basinToFutureShoreReadinessCorridors.length,
      futureShoreReadinessMetadataZoneCount: state.futureShoreReadinessMetadataZones.length,
      hydrationHandoffReadinessMetadataZoneCount: state.hydrationHandoffReadinessMetadataZones.length,

      coastalShelfZoneCount: state.coastalShelfMetadataZones.length,
      beachEligibilityZoneCount: state.beachEligibilityMetadataZones.length,
      authorizedBeachCandidateCount: state.authorizedBeachCandidateMetadata.length,
      cliffBlockedCoastCount: state.cliffBlockedCoastMetadataZones.length,
      basinToShoreCorridorCount: state.basinToFutureShoreReadinessCorridors.length,
      futureShoreReceivingZoneCount: state.futureShoreReadinessMetadataZones.length,
      hydrationHandoffZoneCount: state.hydrationHandoffReadinessMetadataZones.length,

      climateStandardBeachPlaceholderHeld: Boolean(state.climateStandardBeachPlaceholder),
      namedBeachMetadataHooksHeld: state.namedBeachMetadataHooks.length,
      namedBeachHooksHeld: state.namedBeachMetadataHooks.length,

      beachesAreLimitedSpecialNotDefault: true,
      coastlineDoesNotAutomaticallyMeanBeach: true,
      shoreDoesNotAutomaticallyMeanBeach: true,
      waterBoundaryDoesNotAutomaticallyMeanBeach: true,

      buildCount: state.buildCount,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_BEACH_COASTAL_READINESS_METADATA_ONLY_HOLD_DEPLOY_MARKER_v1"
    });
  }

  function publishStatus() {
    var payload = statusPayload();

    window.AUDRALIA_BEACH_COASTAL_READINESS_METADATA_ONLY_HOLD_STATUS = payload;
    window.AUDRALIA_BEACH_COASTAL_READINESS_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaBeachCoastalReadinessContract = CONTRACT;
      document.documentElement.dataset.audraliaBeachCoastalReadinessReady = String(state.beachCoastalReadinessReady);
      document.documentElement.dataset.audraliaBeachCoastalMetadataOnly = "true";
      document.documentElement.dataset.audraliaBeachCoastalReceiptOnlyUntilHydrationAuthorized = "true";
      document.documentElement.dataset.audraliaCarrierMayInspectBeachCoastal = "true";
      document.documentElement.dataset.audraliaCarrierMayDisplayBeachCoastal = "false";
      document.documentElement.dataset.audraliaCarrierMayTintSurfaceFromBeachCoastal = "false";
      document.documentElement.dataset.audraliaCarrierMayColorVoidFromBeachCoastal = "false";
      document.documentElement.dataset.audraliaCarrierMayDrawHydrationHandoff = "false";
      document.documentElement.dataset.audraliaBeachesAreLimitedSpecialNotDefault = "true";
      document.documentElement.dataset.audraliaClimateStandardBeachPlaceholderHeld = String(Boolean(state.climateStandardBeachPlaceholder));
      document.documentElement.dataset.audraliaCoastalShelfMetadataZoneCount = String(state.coastalShelfMetadataZones.length);
      document.documentElement.dataset.audraliaBeachEligibilityMetadataZoneCount = String(state.beachEligibilityMetadataZones.length);
      document.documentElement.dataset.audraliaHydrationHandoffReadinessMetadataZoneCount = String(state.hydrationHandoffReadinessMetadataZones.length);
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaActiveWater = "false";
      document.documentElement.dataset.audraliaFinalBeachPassClaim = "false";
      document.documentElement.dataset.audraliaFinalCoastlinePassClaim = "false";
      document.documentElement.dataset.audraliaFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function status() {
    return publishStatus();
  }

  function getBeachCoastalReadinessPacket(requestor, options) {
    if (!state.beachCoastalReadinessReady && state.buildCount === 0) {
      buildBeachCoastalReadiness();
    }

    return readinessPacket(requestor || "unknown", options || {});
  }

  function getCarrierBeachPacket(requestor, options) {
    if (!state.beachCoastalReadinessReady && state.buildCount === 0) {
      buildBeachCoastalReadiness();
    }

    return carrierBeachPacket(requestor || "unknown", options || { compact: true });
  }

  function getBeachMetadataHoldPacket(requestor, options) {
    return getBeachCoastalReadinessPacket(requestor || "unknown", options || {});
  }

  function api() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      status: status,
      refresh: buildBeachCoastalReadiness,
      getBeachCoastalReadinessPacket: getBeachCoastalReadinessPacket,
      getCarrierBeachPacket: getCarrierBeachPacket,
      getBeachMetadataHoldPacket: getBeachMetadataHoldPacket
    });
  }

  function boot() {
    buildBeachCoastalReadiness();

    setTimeout(buildBeachCoastalReadiness, 180);
    setTimeout(buildBeachCoastalReadiness, 640);
    setTimeout(buildBeachCoastalReadiness, 1200);
  }

  var exported = api();

  window.AUDRALIA_BEACH_COASTAL_READINESS_CHILD = exported;
  window.AUDRALIA_PLANET_BEACH_COASTAL_READINESS_CHILD = exported;
  window.AUDRALIA_G2_BEACH_COASTAL_READINESS_CHILD = exported;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
