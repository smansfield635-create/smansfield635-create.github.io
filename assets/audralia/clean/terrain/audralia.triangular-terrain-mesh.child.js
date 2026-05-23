// /assets/audralia/clean/terrain/audralia.triangular-terrain-mesh.child.js
// AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD_TNT_v1
// Full-file replacement.
// Scope: downstream terrain geometry child only.
// Purpose: convert inherited dry terrain/elevation/relief/landform/beach-coastal samples into deterministic triangular terrain facets.
// Position: dry terrain atlas → elevation track → relief expression → landform systems → beach/coastal readiness → triangular terrain mesh → future hydration baseline → carrier display consumption.
// Does not own: source terrain truth, elevation truth, relief truth, landform truth, beach/coastal truth, active hydration, water rendering, carrier rendering, final terrain pass, final hydration pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.triangular-terrain-mesh.child.js";
  var FAMILY_POSITION = "dry-terrain→elevation-track→relief-expression→landform-systems→beach-coastal-readiness→triangular-terrain-mesh→hydration-baseline";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;
  var TAU = Math.PI * 2;

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

  var BEACH_GLOBALS = Object.freeze([
    "AUDRALIA_BEACH_COASTAL_READINESS_CHILD",
    "AUDRALIA_PLANET_BEACH_COASTAL_READINESS_CHILD",
    "AUDRALIA_G2_BEACH_COASTAL_READINESS_CHILD"
  ]);

  var FACE_CLASSES = Object.freeze({
    MOUNTAIN: "mountain_facet",
    RIDGE: "ridge_facet",
    PLATEAU: "plateau_facet",
    CLIFF: "cliff_facet",
    BASIN: "basin_facet",
    VALLEY: "valley_facet",
    COASTAL_SHELF: "coastal_shelf_facet",
    BEACH_TRANSITION: "beach_transition_facet",
    FUTURE_FILL: "future_fill_facet",
    LOWLAND: "lowland_facet",
    MIDLAND: "midland_facet",
    STABLE: "stable_surface_facet"
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

  var state = {
    dryTerrainApi: null,
    sourceTerrainDetected: false,
    sourceTerrainValidated: false,
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

    beachApi: null,
    beachCoastalReadinessDetected: false,
    beachCoastalReadinessValidated: false,
    beachStatus: null,
    beachCarrierPacket: null,
    beachFailureReason: "beach/coastal readiness not checked",

    sourceRecords: [],
    sourceRecordById: {},
    sourceRecordBySeat: {},
    reliefSampleByNodeId: {},
    elevationSampleByNodeId: {},
    beachZoneByNodeId: {},
    landformIndex: null,

    meshVertices: [],
    meshVertexById: {},
    meshFaces: [],
    terrainFacetBands: [],
    meshEdgeBreaks: [],
    carrierTriangleMeshPacketReady: false,
    hydrationTriangleBoundaryPacketReady: false,
    triangularTerrainMeshReady: false,

    buildCount: 0,
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

  function numeric(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeId(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback || "";
    return String(value);
  }

  function stableClone(value) {
    return JSON.parse(JSON.stringify(value || null));
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

  function lonLatPoint(lonDeg, latDeg) {
    var lon = lonDeg * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function seatKey(x, y) {
    return String(((Math.round(x) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES) + ":" + String(clamp(Math.round(y), 0, FIBONACCI_BANDS - 1));
  }

  function edgeKey(a, b) {
    return [a, b].sort().join("::");
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce(function (sum, value) { return sum + Number(value || 0); }, 0) / values.length;
  }

  function regionName(regionSeed) {
    return REGION_NAMES[regionSeed] || REGION_NAMES.unassigned;
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
    state.sourceTerrainDetected = Boolean(api);
    state.sourceTerrainValidated = false;
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
      state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    }

    if (typeof api.getDryRevealedTerrainPacket === "function") {
      state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    }

    state.sourceTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true &&
      dryNodes().length
    );

    state.dryFailureReason = state.sourceTerrainValidated ? "" : "dry revealed terrain validation failed";
    return state.sourceTerrainValidated;
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
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getCarrierElevationPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    } else if (typeof api.getElevationTrackPacket === "function") {
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getElevationTrackPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    } else if (typeof api.getElevationPacket === "function") {
      state.elevationCarrierPacket = safeCall("elevationTrack", api, "getElevationPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
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
    state.reliefCarrierPacket = safeCall("reliefExpression", api, "getCarrierReliefPacket", "audralia-triangular-terrain-mesh-child", { compact: false });

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
    state.landformCarrierPacket = safeCall("landformSystems", api, "getCarrierLandformPacket", "audralia-triangular-terrain-mesh-child", { compact: false });

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

  function detectBeachCoastalReadiness() {
    var api = firstGlobal(BEACH_GLOBALS);

    state.beachApi = api;
    state.beachCoastalReadinessDetected = Boolean(api);
    state.beachCoastalReadinessValidated = false;
    state.beachStatus = null;
    state.beachCarrierPacket = null;

    if (!api) {
      state.beachFailureReason = "beach/coastal readiness child missing";
      return false;
    }

    state.beachStatus = typeof api.status === "function" ? safeCall("beachCoastal", api, "status") : null;

    if (typeof api.getCarrierBeachPacket === "function") {
      state.beachCarrierPacket = safeCall("beachCoastal", api, "getCarrierBeachPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    } else if (typeof api.getBeachCoastalReadinessPacket === "function") {
      state.beachCarrierPacket = safeCall("beachCoastal", api, "getBeachCoastalReadinessPacket", "audralia-triangular-terrain-mesh-child", { compact: false });
    }

    state.beachCoastalReadinessValidated = Boolean(
      state.beachCarrierPacket &&
      state.beachCarrierPacket.beachCoastalReadinessReady === true &&
      state.beachCarrierPacket.activeHydration === false &&
      state.beachCarrierPacket.activeWater === false &&
      state.beachCarrierPacket.finalVisualPassClaim === false
    );

    state.beachFailureReason = state.beachCoastalReadinessValidated ? "" : "beach/coastal readiness validation failed";
    return state.beachCoastalReadinessValidated;
  }

  function indexSample(index, key, sample) {
    if (!key || !sample) return;
    index[String(key)] = sample;
  }

  function buildReliefIndex() {
    var index = {};
    var packet = state.reliefCarrierPacket;

    if (packet && Array.isArray(packet.reliefSamples)) {
      packet.reliefSamples.forEach(function (sample, i) {
        indexSample(index, sample.parentNodeId, sample);
        indexSample(index, sample.nodeId, sample);
        indexSample(index, sample.seatKey, sample);
        indexSample(index, sample.seatIndex, sample);
        indexSample(index, "source-" + i, sample);
        indexSample(index, String(i), sample);
      });
    }

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

  function buildBeachIndex() {
    var index = {};
    var packet = state.beachCarrierPacket || {};

    function addList(list, sourceType) {
      if (!Array.isArray(list)) return;

      list.forEach(function (zone, i) {
        var normalized = Object.assign({}, zone, { sourceType: sourceType });
        indexSample(index, zone.nodeId, normalized);
        indexSample(index, zone.sourceSeatIndex, normalized);
        indexSample(index, "source-" + zone.sourceIndex, normalized);
        indexSample(index, String(zone.sourceIndex), normalized);
        indexSample(index, "beach-" + i, normalized);
      });
    }

    addList(packet.coastalShelfZones, "coastal_shelf");
    addList(packet.beachEligibilityZones, "beach_eligibility");
    addList(packet.authorizedBeachCandidates, "authorized_beach_candidate");
    addList(packet.cliffBlockedCoasts, "cliff_blocked");
    addList(packet.basinToShoreCorridors, "basin_to_shore");
    addList(packet.futureShoreReceivingZones, "future_shore_receiving");
    addList(packet.hydrationHandoffZones, "hydration_handoff");

    state.beachZoneByNodeId = index;
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

  function buildSourceRecords() {
    var nodes = dryNodes();
    var reliefIndex = buildReliefIndex();
    var elevationIndex = buildElevationIndex();
    var beachIndex = buildBeachIndex();
    var landformIndex = buildLandformIndex();
    var records = [];
    var byId = {};
    var bySeat = {};

    nodes.forEach(function (node, sourceIndex) {
      var relief = lookupByNodeId(reliefIndex, node, sourceIndex) || {};
      var elevation = lookupByNodeId(elevationIndex, node, sourceIndex) || {};
      var beach = lookupByNodeId(beachIndex, node, sourceIndex) || {};
      var nodeId = normalizeId(node.nodeId || node.seatKey || node.id || node.seatIndex || node.nodeIndex, "source-" + sourceIndex);

      var x = numeric(node.x, numeric(node.radial, sourceIndex % RADIAL_NODES));
      var y = numeric(node.y, numeric(node.band, Math.floor(sourceIndex / RADIAL_NODES)));
      x = ((x % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
      y = clamp(y, 0, FIBONACCI_BANDS - 1);

      var ll = terrainSeatToLonLat(x, y);

      var dryElevation = clamp(numeric(
        elevation.elevation,
        numeric(elevation.dryElevation,
          numeric(relief.elevation,
            numeric(node.dryElevation, numeric(node.elevation, 0.5))
          )
        )
      ), 0, 1);

      var slope = clamp(numeric(relief.slope, numeric(relief.slopeIndex, numeric(elevation.slope, numeric(node.slope, 0.5)))), 0, 1);
      var reliefIntensity = clamp(numeric(relief.reliefIntensity, numeric(node.reliefIntensity, 0)), 0, 1);
      var ridgePressure = clamp(numeric(node.ridgePressure, numeric(relief.ridgeHighlight, 0)), 0, 1);
      var mountainPressure = clamp(numeric(node.mountainPressure, numeric(relief.mountainPressure, 0)), 0, 1);
      var summitPressure = clamp(numeric(node.summitPressure, numeric(relief.summitEmphasis, 0)), 0, 1);
      var basinPressure = clamp(numeric(node.basinPressure, numeric(relief.basinShadow, 0)), 0, 1);
      var valleyPressure = clamp(numeric(node.valleyPressure, numeric(relief.valleyFlowStrength, 0)), 0, 1);
      var shelfPressure = clamp(numeric(node.shelfPressure, numeric(relief.shelfReliefStrength, numeric(elevation.shelfPressure, 0))), 0, 1);
      var escarpmentPressure = clamp(numeric(node.escarpmentPressure, numeric(relief.escarpmentPressure, 0)), 0, 1);
      var gapPressure = clamp(numeric(node.gapPressure, numeric(relief.futureFillPressure, 0)), 0, 1);

      var mountainFlag = landformIndex.mountainNodeIds[nodeId] ? 1 : 0;
      var summitFlag = landformIndex.summitNodeIds[nodeId] ? 1 : 0;
      var landmarkFlag = landformIndex.landmarkNodeIds[nodeId] ? 1 : 0;
      var plateauFlag = landformIndex.plateauNodeIds[nodeId] ? 1 : 0;
      var basinFlag = landformIndex.basinNodeIds[nodeId] ? 1 : 0;
      var cliffFlag = landformIndex.cliffNodeIds[nodeId] ? 1 : 0;

      var beachEligibilityScore = clamp(numeric(beach.beachEligibilityScore, 0), 0, 1);
      var coastalReadinessScore = clamp(numeric(beach.coastalReadinessScore, 0), 0, 1);
      var futureFillScore = clamp(numeric(beach.futureFillScore, gapPressure * 0.5 + basinPressure * 0.35 + valleyPressure * 0.15), 0, 1);
      var cliffPressure = clamp(numeric(beach.cliffPressure, escarpmentPressure * 0.55 + slope * 0.22 + cliffFlag * 0.74), 0, 1);

      var regionSeed = String(node.regionSeed || node.continentId || relief.continentId || beach.continentId || "unassigned").toLowerCase();

      var record = Object.freeze({
        recordId: "AUDRALIA-SOURCE-RECORD-" + String(sourceIndex).padStart(3, "0"),
        nodeId: nodeId,
        sourceSeatIndex: numeric(node.seatIndex, numeric(node.nodeIndex, sourceIndex)),
        sourceIndex: sourceIndex,
        x: round(x, 4),
        y: round(y, 4),
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),
        point: lonLatPoint(ll.lon, ll.lat),

        continentId: regionSeed,
        continentName: regionName(regionSeed),
        terrainRole: node.primaryTerrainRole || node.terrainClass || relief.carrierVisualRole || "dry_terrain",

        dryElevation: round(dryElevation, 4),
        slope: round(slope, 4),
        reliefIntensity: round(reliefIntensity, 4),
        ridgePressure: round(ridgePressure, 4),
        mountainPressure: round(clamp(mountainPressure + mountainFlag * 0.22, 0, 1), 4),
        summitPressure: round(clamp(summitPressure + summitFlag * 0.20, 0, 1), 4),
        basinPressure: round(clamp(basinPressure + basinFlag * 0.18, 0, 1), 4),
        valleyPressure: round(valleyPressure, 4),
        shelfPressure: round(clamp(shelfPressure + plateauFlag * 0.12, 0, 1), 4),
        escarpmentPressure: round(escarpmentPressure, 4),
        gapPressure: round(gapPressure, 4),
        cliffPressure: round(cliffPressure, 4),

        beachEligibilityScore: round(beachEligibilityScore, 4),
        coastalReadinessScore: round(coastalReadinessScore, 4),
        futureFillScore: round(futureFillScore, 4),
        beachClassification: beach.classification || beach.zoneType || "no_beach",

        landformFlags: Object.freeze({
          mountainRange: Boolean(mountainFlag),
          summit: Boolean(summitFlag),
          landmark: Boolean(landmarkFlag),
          plateau: Boolean(plateauFlag),
          basin: Boolean(basinFlag),
          cliff: Boolean(cliffFlag)
        }),

        sourceTerrainMutated: false,
        elevationTruthMutated: false,
        reliefTruthMutated: false,
        landformTruthMutated: false,
        beachTruthMutated: false,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      });

      records.push(record);
      byId[nodeId] = record;
      bySeat[seatKey(x, y)] = record;
    });

    state.sourceRecords = Object.freeze(records);
    state.sourceRecordById = byId;
    state.sourceRecordBySeat = bySeat;

    return state.sourceRecords;
  }

  function nearestRecordAt(x, y) {
    var direct = state.sourceRecordBySeat[seatKey(x, y)];
    if (direct) return direct;

    var best = null;
    var bestDistance = Infinity;

    state.sourceRecords.forEach(function (record) {
      var dx = Math.abs(record.x - x);
      dx = Math.min(dx, RADIAL_NODES - dx);
      var dy = Math.abs(record.y - y);
      var distance = dx * dx + dy * dy;

      if (distance < bestDistance) {
        best = record;
        bestDistance = distance;
      }
    });

    return best;
  }

  function buildVertexFromRecord(record) {
    if (!record) return null;

    return Object.freeze({
      vertexId: "AUDRALIA-MESH-VERTEX-NODE-" + String(record.sourceIndex).padStart(3, "0"),
      vertexType: "source_node_vertex",
      sourceNodeId: record.nodeId,
      sourceRecordId: record.recordId,
      x: record.x,
      y: record.y,
      lon: record.lon,
      lat: record.lat,
      point: record.point,

      dryElevation: record.dryElevation,
      slope: record.slope,
      reliefIntensity: record.reliefIntensity,
      terrainRole: record.terrainRole,
      continentId: record.continentId,
      continentName: record.continentName,

      ridgePressure: record.ridgePressure,
      mountainPressure: record.mountainPressure,
      summitPressure: record.summitPressure,
      basinPressure: record.basinPressure,
      valleyPressure: record.valleyPressure,
      shelfPressure: record.shelfPressure,
      cliffPressure: record.cliffPressure,
      beachEligibilityScore: record.beachEligibilityScore,
      coastalReadinessScore: record.coastalReadinessScore,
      futureFillScore: record.futureFillScore,

      sourceTruthMutated: false,
      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function blendVertex(records, cellId, cx, cy) {
    var lonLat = terrainSeatToLonLat(cx, cy);
    var continentScores = {};
    var terrainScores = {};

    records.forEach(function (record) {
      continentScores[record.continentId] = (continentScores[record.continentId] || 0) + 1;
      terrainScores[record.terrainRole] = (terrainScores[record.terrainRole] || 0) + 1;
    });

    function maxKey(obj, fallback) {
      var best = fallback;
      var bestValue = -Infinity;
      Object.keys(obj).forEach(function (key) {
        if (obj[key] > bestValue) {
          best = key;
          bestValue = obj[key];
        }
      });
      return best;
    }

    var continentId = maxKey(continentScores, "unassigned");
    var terrainRole = maxKey(terrainScores, "derived_center");

    return Object.freeze({
      vertexId: "AUDRALIA-MESH-VERTEX-CENTER-" + cellId,
      vertexType: "derived_cell_center_vertex",
      sourceNodeId: cellId,
      sourceRecordId: cellId,
      x: round(cx, 4),
      y: round(cy, 4),
      lon: round(lonLat.lon, 4),
      lat: round(lonLat.lat, 4),
      point: lonLatPoint(lonLat.lon, lonLat.lat),

      dryElevation: round(average(records.map(function (record) { return record.dryElevation; })), 4),
      slope: round(average(records.map(function (record) { return record.slope; })), 4),
      reliefIntensity: round(average(records.map(function (record) { return record.reliefIntensity; })), 4),
      terrainRole: terrainRole,
      continentId: continentId,
      continentName: regionName(continentId),

      ridgePressure: round(average(records.map(function (record) { return record.ridgePressure; })), 4),
      mountainPressure: round(average(records.map(function (record) { return record.mountainPressure; })), 4),
      summitPressure: round(average(records.map(function (record) { return record.summitPressure; })), 4),
      basinPressure: round(average(records.map(function (record) { return record.basinPressure; })), 4),
      valleyPressure: round(average(records.map(function (record) { return record.valleyPressure; })), 4),
      shelfPressure: round(average(records.map(function (record) { return record.shelfPressure; })), 4),
      cliffPressure: round(average(records.map(function (record) { return record.cliffPressure; })), 4),
      beachEligibilityScore: round(average(records.map(function (record) { return record.beachEligibilityScore; })), 4),
      coastalReadinessScore: round(average(records.map(function (record) { return record.coastalReadinessScore; })), 4),
      futureFillScore: round(average(records.map(function (record) { return record.futureFillScore; })), 4),

      sourceTruthMutated: false,
      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
  }

  function classifyFace(vertices) {
    var avgElevation = average(vertices.map(function (v) { return v.dryElevation; }));
    var avgSlope = average(vertices.map(function (v) { return v.slope; }));
    var relief = average(vertices.map(function (v) { return v.reliefIntensity; }));
    var ridge = average(vertices.map(function (v) { return v.ridgePressure; }));
    var mountain = average(vertices.map(function (v) { return v.mountainPressure; }));
    var summit = average(vertices.map(function (v) { return v.summitPressure; }));
    var basin = average(vertices.map(function (v) { return v.basinPressure; }));
    var valley = average(vertices.map(function (v) { return v.valleyPressure; }));
    var shelf = average(vertices.map(function (v) { return v.shelfPressure; }));
    var cliff = average(vertices.map(function (v) { return v.cliffPressure; }));
    var beach = average(vertices.map(function (v) { return v.beachEligibilityScore; }));
    var coastal = average(vertices.map(function (v) { return v.coastalReadinessScore; }));
    var futureFill = average(vertices.map(function (v) { return v.futureFillScore; }));

    if (cliff > 0.56 || avgSlope > 0.78) return FACE_CLASSES.CLIFF;
    if (mountain > 0.58 || summit > 0.56 || avgElevation > 0.76) return FACE_CLASSES.MOUNTAIN;
    if (ridge > 0.52 || relief > 0.62) return FACE_CLASSES.RIDGE;
    if (shelf > 0.58 && avgSlope < 0.45 && avgElevation > 0.42) return FACE_CLASSES.PLATEAU;
    if (beach > 0.52 && coastal > 0.44 && cliff < 0.42) return FACE_CLASSES.BEACH_TRANSITION;
    if (coastal > 0.52 && shelf > 0.36 && cliff < 0.48) return FACE_CLASSES.COASTAL_SHELF;
    if (futureFill > 0.56 && cliff < 0.56) return FACE_CLASSES.FUTURE_FILL;
    if (basin > 0.52) return FACE_CLASSES.BASIN;
    if (valley > 0.50) return FACE_CLASSES.VALLEY;
    if (avgElevation < 0.36) return FACE_CLASSES.LOWLAND;
    if (avgElevation < 0.62) return FACE_CLASSES.MIDLAND;
    return FACE_CLASSES.STABLE;
  }

  function slopeVector(vertices) {
    var v0 = vertices[0];
    var v1 = vertices[1];
    var v2 = vertices[2];

    var dx1 = v1.x - v0.x;
    var dy1 = v1.y - v0.y;
    var dz1 = v1.dryElevation - v0.dryElevation;

    var dx2 = v2.x - v0.x;
    var dy2 = v2.y - v0.y;
    var dz2 = v2.dryElevation - v0.dryElevation;

    var sx = dz1 * dx1 + dz2 * dx2;
    var sy = dz1 * dy1 + dz2 * dy2;
    var magnitude = Math.sqrt(sx * sx + sy * sy);

    return Object.freeze({
      x: round(sx, 4),
      y: round(sy, 4),
      magnitude: round(magnitude, 4),
      direction: round(Math.atan2(sy, sx), 4)
    });
  }

  function faceAverages(vertices) {
    return {
      averageElevation: round(average(vertices.map(function (v) { return v.dryElevation; })), 4),
      averageSlope: round(average(vertices.map(function (v) { return v.slope; })), 4),
      reliefIntensity: round(average(vertices.map(function (v) { return v.reliefIntensity; })), 4),
      ridgePressure: round(average(vertices.map(function (v) { return v.ridgePressure; })), 4),
      mountainPressure: round(average(vertices.map(function (v) { return v.mountainPressure; })), 4),
      summitPressure: round(average(vertices.map(function (v) { return v.summitPressure; })), 4),
      basinPressure: round(average(vertices.map(function (v) { return v.basinPressure; })), 4),
      valleyPressure: round(average(vertices.map(function (v) { return v.valleyPressure; })), 4),
      shelfPressure: round(average(vertices.map(function (v) { return v.shelfPressure; })), 4),
      cliffPressure: round(average(vertices.map(function (v) { return v.cliffPressure; })), 4),
      beachEligibilityScore: round(average(vertices.map(function (v) { return v.beachEligibilityScore; })), 4),
      coastalReadinessScore: round(average(vertices.map(function (v) { return v.coastalReadinessScore; })), 4),
      futureFillScore: round(average(vertices.map(function (v) { return v.futureFillScore; })), 4)
    };
  }

  function dominantContinent(vertices) {
    var scores = {};

    vertices.forEach(function (vertex) {
      scores[vertex.continentId] = (scores[vertex.continentId] || 0) + 1;
    });

    var best = "unassigned";
    var bestValue = -Infinity;

    Object.keys(scores).forEach(function (key) {
      if (scores[key] > bestValue) {
        best = key;
        bestValue = scores[key];
      }
    });

    return {
      continentId: best,
      continentName: regionName(best)
    };
  }

  function buildFace(faceId, sourceCellId, faceType, vertices) {
    var avg = faceAverages(vertices);
    var faceClass = classifyFace(vertices);
    var slope = slopeVector(vertices);
    var continent = dominantContinent(vertices);

    var edgeBreakWeight = clamp(
      avg.cliffPressure * 0.34 +
      avg.ridgePressure * 0.20 +
      avg.averageSlope * 0.18 +
      avg.reliefIntensity * 0.14 +
      avg.coastalReadinessScore * 0.08 +
      avg.futureFillScore * 0.06,
      0,
      1
    );

    var shadeWeight = clamp(
      avg.averageElevation * 0.26 +
      avg.reliefIntensity * 0.22 +
      avg.averageSlope * 0.18 +
      avg.ridgePressure * 0.12 +
      avg.cliffPressure * 0.12 +
      avg.basinPressure * 0.10,
      0,
      1
    );

    var hydrationBoundaryEligible = Boolean(
      (
        faceClass === FACE_CLASSES.BEACH_TRANSITION ||
        faceClass === FACE_CLASSES.COASTAL_SHELF ||
        faceClass === FACE_CLASSES.FUTURE_FILL ||
        faceClass === FACE_CLASSES.BASIN ||
        faceClass === FACE_CLASSES.LOWLAND
      ) &&
      avg.cliffPressure < 0.62 &&
      (avg.futureFillScore > 0.38 || avg.coastalReadinessScore > 0.40 || avg.beachEligibilityScore > 0.40)
    );

    return Object.freeze({
      faceId: faceId,
      sourceCellId: sourceCellId,
      faceType: faceType,
      vertexIds: Object.freeze(vertices.map(function (vertex) { return vertex.vertexId; })),
      sourceVertexTypes: Object.freeze(vertices.map(function (vertex) { return vertex.vertexType; })),

      averageElevation: avg.averageElevation,
      averageSlope: avg.averageSlope,
      slopeVector: slope,
      reliefIntensity: avg.reliefIntensity,
      reliefClass: avg.reliefIntensity > 0.62 ? "high_relief" : avg.reliefIntensity > 0.34 ? "moderate_relief" : "low_relief",

      terrainClass: faceClass,
      landformClass: faceClass,
      coastalClass: avg.beachEligibilityScore > 0.52 ? "beach_transition_ready" :
        avg.coastalReadinessScore > 0.50 ? "coastal_shelf_ready" :
        avg.futureFillScore > 0.50 ? "future_fill_ready" :
        avg.cliffPressure > 0.56 ? "cliff_blocked" : "not_coastal_primary",

      continentId: continent.continentId,
      continentName: continent.continentName,

      ridgePressure: avg.ridgePressure,
      mountainPressure: avg.mountainPressure,
      summitPressure: avg.summitPressure,
      basinPressure: avg.basinPressure,
      valleyPressure: avg.valleyPressure,
      shelfPressure: avg.shelfPressure,
      cliffPressure: avg.cliffPressure,
      beachEligibilityScore: avg.beachEligibilityScore,
      coastalReadinessScore: avg.coastalReadinessScore,
      futureFillScore: avg.futureFillScore,

      renderPriority: round(shadeWeight * 0.38 + edgeBreakWeight * 0.32 + avg.coastalReadinessScore * 0.12 + avg.futureFillScore * 0.10 + avg.beachEligibilityScore * 0.08, 4),
      shadeWeight: round(shadeWeight, 4),
      edgeBreakWeight: round(edgeBreakWeight, 4),
      hydrationBoundaryEligible: hydrationBoundaryEligible,

      squaresConvertedToTriangles: true,
      rectangularGridReadReduced: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function addVertex(vertex) {
    if (!vertex || state.meshVertexById[vertex.vertexId]) return;
    state.meshVertexById[vertex.vertexId] = vertex;
    state.meshVertices.push(vertex);
  }

  function buildTriangularMesh() {
    state.meshVertices = [];
    state.meshVertexById = {};
    state.meshFaces = [];
    state.meshEdgeBreaks = [];
    state.terrainFacetBands = [];

    if (!state.sourceRecords.length) return false;

    state.sourceRecords.forEach(function (record) {
      addVertex(buildVertexFromRecord(record));
    });

    for (var y = 0; y < FIBONACCI_BANDS - 1; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var east = (x + 1) % RADIAL_NODES;

        var nwRecord = nearestRecordAt(x, y);
        var neRecord = nearestRecordAt(east, y);
        var seRecord = nearestRecordAt(east, y + 1);
        var swRecord = nearestRecordAt(x, y + 1);

        if (!nwRecord || !neRecord || !seRecord || !swRecord) continue;

        var cellId = "CELL-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
        var centerX = x + 0.5;
        var centerY = y + 0.5;

        var centerVertex = blendVertex([nwRecord, neRecord, seRecord, swRecord], cellId, centerX, centerY);
        addVertex(centerVertex);

        var nw = state.meshVertexById["AUDRALIA-MESH-VERTEX-NODE-" + String(nwRecord.sourceIndex).padStart(3, "0")];
        var ne = state.meshVertexById["AUDRALIA-MESH-VERTEX-NODE-" + String(neRecord.sourceIndex).padStart(3, "0")];
        var se = state.meshVertexById["AUDRALIA-MESH-VERTEX-NODE-" + String(seRecord.sourceIndex).padStart(3, "0")];
        var sw = state.meshVertexById["AUDRALIA-MESH-VERTEX-NODE-" + String(swRecord.sourceIndex).padStart(3, "0")];

        var paritySignal = (x + y + Math.round(centerVertex.dryElevation * 13) + Math.round(centerVertex.reliefIntensity * 8)) % 4;

        var faceGroups = paritySignal % 2 === 0
          ? [
              ["north_facet", [nw, ne, centerVertex]],
              ["east_facet", [ne, se, centerVertex]],
              ["south_facet", [se, sw, centerVertex]],
              ["west_facet", [sw, nw, centerVertex]]
            ]
          : [
              ["northwest_facet", [nw, ne, centerVertex]],
              ["southeast_facet", [se, sw, centerVertex]],
              ["northeast_facet", [ne, se, centerVertex]],
              ["southwest_facet", [sw, nw, centerVertex]]
            ];

        faceGroups.forEach(function (group, localIndex) {
          var faceId = "AUDRALIA-MESH-FACE-" + cellId + "-" + String(localIndex + 1).padStart(2, "0");
          state.meshFaces.push(buildFace(faceId, cellId, group[0], group[1]));
        });
      }
    }

    state.meshVertices = Object.freeze(state.meshVertices);
    state.meshFaces = Object.freeze(state.meshFaces);

    buildMeshEdgeBreaks();
    buildTerrainFacetBands();

    state.carrierTriangleMeshPacketReady = state.meshFaces.length > 0;
    state.hydrationTriangleBoundaryPacketReady = state.meshFaces.some(function (face) {
      return face.hydrationBoundaryEligible;
    });

    state.triangularTerrainMeshReady = Boolean(
      state.sourceTerrainValidated &&
      state.meshVertices.length &&
      state.meshFaces.length &&
      state.carrierTriangleMeshPacketReady &&
      state.hydrationTriangleBoundaryPacketReady
    );

    return state.triangularTerrainMeshReady;
  }

  function buildMeshEdgeBreaks() {
    var edgeMap = {};

    state.meshFaces.forEach(function (face) {
      var ids = face.vertexIds;
      var pairs = [
        [ids[0], ids[1]],
        [ids[1], ids[2]],
        [ids[2], ids[0]]
      ];

      pairs.forEach(function (pair) {
        var key = edgeKey(pair[0], pair[1]);

        if (!edgeMap[key]) {
          edgeMap[key] = {
            edgeId: "AUDRALIA-MESH-EDGE-BREAK-" + String(Object.keys(edgeMap).length).padStart(4, "0"),
            vertexIds: Object.freeze(pair.slice()),
            faceIds: [],
            edgeBreakWeight: 0,
            cliffPressure: 0,
            ridgePressure: 0,
            coastalReadinessScore: 0,
            futureFillScore: 0,
            breakSource: "derived_triangle_edge",
            activeHydration: false,
            activeWater: false,
            finalVisualPassClaim: false
          };
        }

        edgeMap[key].faceIds.push(face.faceId);
        edgeMap[key].edgeBreakWeight = Math.max(edgeMap[key].edgeBreakWeight, face.edgeBreakWeight);
        edgeMap[key].cliffPressure = Math.max(edgeMap[key].cliffPressure, face.cliffPressure);
        edgeMap[key].ridgePressure = Math.max(edgeMap[key].ridgePressure, face.ridgePressure);
        edgeMap[key].coastalReadinessScore = Math.max(edgeMap[key].coastalReadinessScore, face.coastalReadinessScore);
        edgeMap[key].futureFillScore = Math.max(edgeMap[key].futureFillScore, face.futureFillScore);
      });
    });

    state.meshEdgeBreaks = Object.freeze(Object.keys(edgeMap).map(function (key) {
      var edge = edgeMap[key];
      var breakClass = "soft_surface_edge";

      if (edge.cliffPressure > 0.58) breakClass = "cliff_break_edge";
      else if (edge.ridgePressure > 0.52) breakClass = "ridge_break_edge";
      else if (edge.coastalReadinessScore > 0.52) breakClass = "coastal_transition_edge";
      else if (edge.futureFillScore > 0.52) breakClass = "future_fill_boundary_edge";
      else if (edge.edgeBreakWeight > 0.54) breakClass = "relief_break_edge";

      return Object.freeze({
        edgeId: edge.edgeId,
        vertexIds: edge.vertexIds,
        faceIds: Object.freeze(edge.faceIds),
        edgeBreakWeight: round(edge.edgeBreakWeight, 4),
        cliffPressure: round(edge.cliffPressure, 4),
        ridgePressure: round(edge.ridgePressure, 4),
        coastalReadinessScore: round(edge.coastalReadinessScore, 4),
        futureFillScore: round(edge.futureFillScore, 4),
        breakClass: breakClass,
        breakSource: edge.breakSource,
        hydrationBoundaryEligible: breakClass === "coastal_transition_edge" || breakClass === "future_fill_boundary_edge",
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      });
    }));
  }

  function buildTerrainFacetBands() {
    var groups = {};

    state.meshFaces.forEach(function (face) {
      if (!groups[face.terrainClass]) {
        groups[face.terrainClass] = {
          bandId: "AUDRALIA-TERRAIN-FACET-BAND-" + face.terrainClass.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
          terrainClass: face.terrainClass,
          faceIds: [],
          faceCount: 0,
          averageElevation: 0,
          averageRelief: 0,
          averageShadeWeight: 0,
          averageEdgeBreakWeight: 0,
          hydrationBoundaryFaceCount: 0,
          activeHydration: false,
          activeWater: false,
          finalVisualPassClaim: false
        };
      }

      var group = groups[face.terrainClass];
      group.faceIds.push(face.faceId);
      group.faceCount += 1;
      group.averageElevation += face.averageElevation;
      group.averageRelief += face.reliefIntensity;
      group.averageShadeWeight += face.shadeWeight;
      group.averageEdgeBreakWeight += face.edgeBreakWeight;
      if (face.hydrationBoundaryEligible) group.hydrationBoundaryFaceCount += 1;
    });

    state.terrainFacetBands = Object.freeze(Object.keys(groups).map(function (key) {
      var group = groups[key];
      var count = group.faceCount || 1;

      return Object.freeze({
        bandId: group.bandId,
        terrainClass: group.terrainClass,
        faceIds: Object.freeze(group.faceIds),
        faceCount: group.faceCount,
        averageElevation: round(group.averageElevation / count, 4),
        averageRelief: round(group.averageRelief / count, 4),
        averageShadeWeight: round(group.averageShadeWeight / count, 4),
        averageEdgeBreakWeight: round(group.averageEdgeBreakWeight / count, 4),
        hydrationBoundaryFaceCount: group.hydrationBoundaryFaceCount,
        activeHydration: false,
        activeWater: false,
        finalVisualPassClaim: false
      });
    }));
  }

  function compactVertex(vertex) {
    return {
      vertexId: vertex.vertexId,
      vertexType: vertex.vertexType,
      x: vertex.x,
      y: vertex.y,
      lon: vertex.lon,
      lat: vertex.lat,
      dryElevation: vertex.dryElevation,
      slope: vertex.slope,
      reliefIntensity: vertex.reliefIntensity,
      continentId: vertex.continentId,
      continentName: vertex.continentName,
      beachEligibilityScore: vertex.beachEligibilityScore,
      coastalReadinessScore: vertex.coastalReadinessScore,
      cliffPressure: vertex.cliffPressure,
      basinPressure: vertex.basinPressure,
      futureFillScore: vertex.futureFillScore,
      sourceTruthMutated: false
    };
  }

  function compactFace(face) {
    return {
      faceId: face.faceId,
      vertexIds: face.vertexIds,
      sourceCellId: face.sourceCellId,
      faceType: face.faceType,
      averageElevation: face.averageElevation,
      slopeVector: face.slopeVector,
      reliefClass: face.reliefClass,
      terrainClass: face.terrainClass,
      landformClass: face.landformClass,
      coastalClass: face.coastalClass,
      continentId: face.continentId,
      continentName: face.continentName,
      renderPriority: face.renderPriority,
      shadeWeight: face.shadeWeight,
      edgeBreakWeight: face.edgeBreakWeight,
      hydrationBoundaryEligible: face.hydrationBoundaryEligible,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function triangularTerrainMeshPacket(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      file: FILE,
      familyPosition: FAMILY_POSITION,
      packetType: "audralia_triangular_terrain_mesh_packet",

      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValidated: state.sourceTerrainValidated,
      elevationTrackDetected: state.elevationTrackDetected,
      elevationTrackValidated: state.elevationTrackValidated,
      reliefExpressionDetected: state.reliefExpressionDetected,
      reliefExpressionValidated: state.reliefExpressionValidated,
      landformSystemsDetected: state.landformSystemsDetected,
      landformSystemsValidated: state.landformSystemsValidated,
      beachCoastalReadinessDetected: state.beachCoastalReadinessDetected,
      beachCoastalReadinessValidated: state.beachCoastalReadinessValidated,

      triangularTerrainMeshReady: state.triangularTerrainMeshReady,
      meshVertexCount: state.meshVertices.length,
      meshFaceCount: state.meshFaces.length,
      meshEdgeBreakCount: state.meshEdgeBreaks.length,
      terrainFacetBandCount: state.terrainFacetBands.length,
      carrierTriangleMeshPacketReady: state.carrierTriangleMeshPacketReady,
      hydrationTriangleBoundaryPacketReady: state.hydrationTriangleBoundaryPacketReady,

      meshVertices: compact ? state.meshVertices.map(compactVertex) : stableClone(state.meshVertices),
      meshFaces: compact ? state.meshFaces.map(compactFace) : stableClone(state.meshFaces),
      terrainFacetBands: stableClone(state.terrainFacetBands),
      meshEdgeBreaks: stableClone(state.meshEdgeBreaks),

      squaresConvertedToTriangles: true,
      rectangularGridReadReduced: true,
      deterministicTriangulation: true,
      randomTriangulationUsed: false,
      carrierOwnsTriangulation: false,
      childOwnsTriangulationPacket: true,

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,

      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function carrierTriangleMeshPacket(options) {
    var compact = options && options.compact !== undefined ? Boolean(options.compact) : true;
    var faces = compact ? state.meshFaces.map(compactFace) : stableClone(state.meshFaces);
    var vertices = compact ? state.meshVertices.map(compactVertex) : stableClone(state.meshVertices);

    return {
      contract: CONTRACT,
      file: FILE,
      packetType: "carrier_triangle_mesh_display_handoff_packet",
      carrierMayConsume: true,
      carrierShouldDisplayOnly: true,
      carrierShouldNotOwnTriangulation: true,
      carrierShouldNotOwnTerrainTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnLandformTruth: true,
      carrierShouldNotOwnBeachTruth: true,
      carrierShouldNotOwnHydrationTruth: true,

      triangularTerrainMeshReady: state.triangularTerrainMeshReady,
      meshVertexCount: state.meshVertices.length,
      meshFaceCount: state.meshFaces.length,
      meshEdgeBreakCount: state.meshEdgeBreaks.length,
      terrainFacetBandCount: state.terrainFacetBands.length,

      meshVertices: vertices,
      meshFaces: faces,
      terrainFacetBands: stableClone(state.terrainFacetBands),
      meshEdgeBreaks: stableClone(state.meshEdgeBreaks),

      squaresConvertedToTriangles: true,
      rectangularGridReadReduced: true,
      deterministicTriangulation: true,
      randomTriangulationUsed: false,

      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function hydrationTriangleBoundaryPacket(options) {
    var compact = options && options.compact !== undefined ? Boolean(options.compact) : true;

    var boundaryFaces = state.meshFaces.filter(function (face) {
      return face.hydrationBoundaryEligible;
    });

    var boundaryEdges = state.meshEdgeBreaks.filter(function (edge) {
      return edge.hydrationBoundaryEligible;
    });

    return {
      contract: CONTRACT,
      file: FILE,
      packetType: "future_hydration_triangle_boundary_handoff_packet",
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false,
      activeHydration: false,
      activeWater: false,

      triangularTerrainMeshReady: state.triangularTerrainMeshReady,
      hydrationTriangleBoundaryPacketReady: state.hydrationTriangleBoundaryPacketReady,
      boundaryFaceCount: boundaryFaces.length,
      boundaryEdgeCount: boundaryEdges.length,

      boundaryFaces: compact ? boundaryFaces.map(compactFace) : stableClone(boundaryFaces),
      boundaryEdges: stableClone(boundaryEdges),

      allowedFutureHydrationReads: Object.freeze([
        "lowland_triangle_basins",
        "future_fill_triangle_faces",
        "beach_transition_faces",
        "coastal_shelf_faces",
        "cliff_blocked_edges",
        "shore_receiving_triangle_boundaries"
      ]),

      forbiddenNow: Object.freeze([
        "active_oceans",
        "active_rivers",
        "active_lakes",
        "active_wetlands",
        "surf",
        "foam",
        "waterline",
        "shoreline",
        "final_coastline",
        "final_hydration"
      ]),

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function publishStatus() {
    var payload = {
      contract: CONTRACT,
      file: FILE,
      familyPosition: FAMILY_POSITION,

      sourceTerrainDetected: state.sourceTerrainDetected,
      sourceTerrainValidated: state.sourceTerrainValidated,
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

      beachCoastalReadinessDetected: state.beachCoastalReadinessDetected,
      beachCoastalReadinessValidated: state.beachCoastalReadinessValidated,
      beachCoastalReadinessFailureReason: state.beachFailureReason,

      triangularTerrainMeshReady: state.triangularTerrainMeshReady,
      meshVertexCount: state.meshVertices.length,
      meshFaceCount: state.meshFaces.length,
      meshEdgeBreakCount: state.meshEdgeBreaks.length,
      terrainFacetBandCount: state.terrainFacetBands.length,
      carrierTriangleMeshPacketReady: state.carrierTriangleMeshPacketReady,
      hydrationTriangleBoundaryPacketReady: state.hydrationTriangleBoundaryPacketReady,

      squaresConvertedToTriangles: true,
      rectangularGridReadReduced: true,
      deterministicTriangulation: true,
      randomTriangulationUsed: false,
      carrierOwnsTriangulation: false,
      childOwnsTriangulationPacket: true,

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,

      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      buildCount: state.buildCount,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaTriangularTerrainMeshContract = CONTRACT;
      document.documentElement.dataset.audraliaTriangularTerrainMeshReady = String(state.triangularTerrainMeshReady);
      document.documentElement.dataset.audraliaMeshVertexCount = String(state.meshVertices.length);
      document.documentElement.dataset.audraliaMeshFaceCount = String(state.meshFaces.length);
      document.documentElement.dataset.audraliaMeshEdgeBreakCount = String(state.meshEdgeBreaks.length);
      document.documentElement.dataset.audraliaTerrainFacetBandCount = String(state.terrainFacetBands.length);
      document.documentElement.dataset.audraliaSquaresConvertedToTriangles = "true";
      document.documentElement.dataset.audraliaRectangularGridReadReduced = "true";
      document.documentElement.dataset.audraliaCarrierOwnsTriangulation = "false";
      document.documentElement.dataset.audraliaChildOwnsTriangulationPacket = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaActiveWater = "false";
      document.documentElement.dataset.audraliaFinalTerrainPassClaim = "false";
      document.documentElement.dataset.audraliaFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function refresh() {
    detectDryTerrain();
    detectElevationTrack();
    detectReliefExpression();
    detectLandformSystems();
    detectBeachCoastalReadiness();

    buildSourceRecords();
    buildTriangularMesh();

    state.buildCount += 1;
    publishStatus();

    return state.triangularTerrainMeshReady;
  }

  function status() {
    return publishStatus();
  }

  function getTriangularTerrainMeshPacket(requestor, options) {
    if (!state.triangularTerrainMeshReady && state.buildCount === 0) refresh();

    var packet = triangularTerrainMeshPacket(options || {});
    packet.requestor = requestor || "unknown";
    return packet;
  }

  function getCarrierTriangleMeshPacket(requestor, options) {
    if (!state.triangularTerrainMeshReady && state.buildCount === 0) refresh();

    var packet = carrierTriangleMeshPacket(options || { compact: true });
    packet.requestor = requestor || "unknown";
    return packet;
  }

  function getHydrationTriangleBoundaryPacket(requestor, options) {
    if (!state.triangularTerrainMeshReady && state.buildCount === 0) refresh();

    var packet = hydrationTriangleBoundaryPacket(options || { compact: true });
    packet.requestor = requestor || "unknown";
    return packet;
  }

  function api() {
    return Object.freeze({
      contract: CONTRACT,
      file: FILE,
      status: status,
      refresh: refresh,
      getTriangularTerrainMeshPacket: getTriangularTerrainMeshPacket,
      getCarrierTriangleMeshPacket: getCarrierTriangleMeshPacket,
      getHydrationTriangleBoundaryPacket: getHydrationTriangleBoundaryPacket
    });
  }

  function boot() {
    refresh();

    setTimeout(refresh, 180);
    setTimeout(refresh, 640);
    setTimeout(refresh, 1200);
    setTimeout(refresh, 1800);
  }

  var exported = api();

  window.AUDRALIA_TRIANGULAR_TERRAIN_MESH_CHILD = exported;
  window.AUDRALIA_PLANET_TRIANGULAR_TERRAIN_MESH_CHILD = exported;
  window.AUDRALIA_G2_TRIANGULAR_TERRAIN_MESH_CHILD = exported;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
