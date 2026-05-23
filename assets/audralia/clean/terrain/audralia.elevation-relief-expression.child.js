// /assets/audralia/clean/terrain/audralia.elevation-relief-expression.child.js
// AUDRALIA_ELEVATION_RELIEF_METADATA_INTERFACE_ENRICHMENT_TNT_v2
// Full-file replacement.
// Previous: AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_TNT_v1
// Family: AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1
// Scope: relief expression child only.
// Purpose: preserve restored source landmass while enriching the relief metadata interface for carrier, landform, triangular mesh, and future hydration readers.
// Does not own: terrain truth, replacement geometry, landform truth, triangle mesh truth, hydration truth, carrier rendering, HTML shell, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_ELEVATION_RELIEF_METADATA_INTERFACE_ENRICHMENT_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_TNT_v1";
  var FAMILY = "AUDRALIA_RELIEF_LANDFORM_METADATA_ONLY_RESTORATION_TNT_v1";
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

    sourceRecords: [],
    sourceRecordByNodeId: {},
    sourceRecordBySeat: {},

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
    if (packet.carrierTerrainPacket && Array.isArray(packet.carrierTerrainPacket.nodes)) return packet.carrierTerrainPacket.nodes;

    return [];
  }

  function dryNodes() {
    var directNodes = readPacketNodes(state.dryTerrainPacket);
    var carrierNodes = readPacketNodes(state.dryCarrierPacket);
    return directNodes.length ? directNodes : carrierNodes;
  }

  function regionName(regionSeed) {
    return REGION_NAMES[regionSeed] || REGION_NAMES.unassigned;
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function seatKey(x, y) {
    return String(((Math.round(x) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES) + ":" + String(clamp(Math.round(y), 0, FIBONACCI_BANDS - 1));
  }

  function gridDistance(ax, ay, bx, by) {
    var dx = Math.abs(Number(ax) - Number(bx));
    dx = Math.min(dx, RADIAL_NODES - dx);
    var dy = Number(ay) - Number(by);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function numeric(node, keys, fallback) {
    var list = Array.isArray(keys) ? keys : [keys];

    for (var i = 0; i < list.length; i += 1) {
      var value = Number(node && node[list[i]]);
      if (Number.isFinite(value)) return value;
    }

    return fallback;
  }

  function getNodeId(node, index) {
    if (!node) return "source-index-" + String(index);

    var id = node.nodeId || node.seatKey || node.id || node.key || node.sourceNodeId || node.parentNodeId;
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

    if ((!Number.isFinite(x) || !Number.isFinite(y)) && Number.isFinite(index)) {
      x = index % RADIAL_NODES;
      y = Math.floor(index / RADIAL_NODES);
    }

    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

    x = ((x % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    y = clamp(y, 0, FIBONACCI_BANDS - 1);

    return {
      x: round(x, 4),
      y: round(y, 4),
      sourceIndex: index
    };
  }

  function explicitSlope(node) {
    var value = numeric(node, ["slope", "slopeIndex", "surfaceSlope", "reliefSlope"], null);
    return Number.isFinite(value) ? clamp(value, 0, 1) : null;
  }

  function buildSourceRecords(nodes) {
    var records = [];
    var byNodeId = {};
    var bySeat = {};

    nodes.forEach(function (node, index) {
      var position = getNodePosition(node, index);
      if (!position) return;

      var nodeId = getNodeId(node, index);
      var sourceSeatIndex = Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) :
        Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : index;
      var ll = terrainSeatToLonLat(position.x, position.y);
      var elevation = clamp(numeric(node, ["dryElevation", "elevation", "height"], 0.5), 0, 1);
      var regionSeed = String(node.regionSeed || node.continentId || node.regionId || "unassigned").toLowerCase();

      var record = Object.freeze({
        recordId: "AUDRALIA-RELIEF-SOURCE-RECORD-" + String(records.length).padStart(3, "0"),
        sourceNode: node,
        parentNodeId: nodeId,
        nodeId: nodeId,
        seatKey: node.seatKey || seatKey(position.x, position.y),
        seatIndex: sourceSeatIndex,
        nodeIndex: Number.isFinite(Number(node.nodeIndex)) ? Number(node.nodeIndex) : sourceSeatIndex,
        sourceIndex: index,
        sourceSeatIndex: sourceSeatIndex,
        x: position.x,
        y: position.y,
        lon: round(ll.lon, 4),
        lat: round(ll.lat, 4),
        dryElevation: round(elevation, 4),
        elevation: round(elevation, 4),
        explicitSlope: explicitSlope(node),
        continentId: regionSeed,
        continentName: regionName(regionSeed),
        primaryTerrainRole: node.primaryTerrainRole || node.terrainClass || node.reliefRole || node.carrierVisualRole || "dry_terrain"
      });

      records.push(record);
      byNodeId[nodeId] = record;
      bySeat[seatKey(position.x, position.y)] = record;
    });

    state.sourceRecords = Object.freeze(records);
    state.sourceRecordByNodeId = byNodeId;
    state.sourceRecordBySeat = bySeat;

    return state.sourceRecords;
  }

  function nearestNeighborSlope(record, records) {
    if (record.explicitSlope !== null) return record.explicitSlope;

    var total = 0;
    var weightTotal = 0;

    records.forEach(function (other) {
      if (other === record) return;
      var distance = gridDistance(record.x, record.y, other.x, other.y);
      if (distance <= 0 || distance > 2.25) return;

      var weight = 1 / (0.65 + distance);
      total += Math.abs(Number(record.dryElevation || 0.5) - Number(other.dryElevation || 0.5)) * weight;
      weightTotal += weight;
    });

    if (!weightTotal) return 0;

    return clamp((total / weightTotal) * 2.35, 0, 1);
  }

  function terrainRoleForRecord(record) {
    var node = record.sourceNode || {};
    var existing = String(node.reliefRole || node.carrierVisualRole || node.primaryTerrainRole || node.terrainClass || "").toLowerCase();

    if (existing.indexOf("future") >= 0 || existing.indexOf("fill") >= 0) return "futureFill";
    if (existing.indexOf("ridge") >= 0) return "ridge";
    if (existing.indexOf("basin") >= 0) return "basin";
    if (existing.indexOf("valley") >= 0) return "valley";
    if (existing.indexOf("summit") >= 0) return "summit";
    if (existing.indexOf("shelf") >= 0) return "shelf";
    if (existing.indexOf("trench") >= 0) return "trench";
    if (existing.indexOf("gap") >= 0) return "gap";
    if (existing.indexOf("high") >= 0 || existing.indexOf("mountain") >= 0) return "highland";
    if (existing.indexOf("low") >= 0) return "lowland";

    var elevation = record.dryElevation;
    var ridge = clamp(numeric(node, "ridgePressure", 0), 0, 1);
    var basin = clamp(numeric(node, "basinPressure", 0), 0, 1);
    var valley = clamp(numeric(node, "valleyPressure", 0), 0, 1);
    var summit = clamp(numeric(node, "summitPressure", 0), 0, 1);
    var shelf = clamp(numeric(node, "shelfPressure", 0), 0, 1);
    var trench = clamp(numeric(node, "trenchPressure", 0), 0, 1);
    var gap = clamp(numeric(node, "gapPressure", 0), 0, 1);

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

    if (best <= 0.04 && elevation > 0.64) role = "highland";
    if (best <= 0.04 && elevation < 0.40) role = "lowland";
    if (best <= 0.04 && elevation >= 0.40 && elevation <= 0.64) role = "shelf";

    return role;
  }

  function psychologyForRole(role) {
    if (role === "future_fill" || role === "futureFill") return PSYCHOLOGY_MAP.futureFill;
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

  function buildReliefSamplesFromSource(records) {
    var samples = [];

    records.forEach(function (record) {
      var node = record.sourceNode || {};
      var role = terrainRoleForRecord(record);
      var slope = nearestNeighborSlope(record, records);
      var elevation = clamp(record.dryElevation, 0, 1);
      var ridge = clamp(numeric(node, "ridgePressure", 0), 0, 1);
      var basin = clamp(numeric(node, "basinPressure", 0), 0, 1);
      var valley = clamp(numeric(node, "valleyPressure", 0), 0, 1);
      var summit = clamp(numeric(node, "summitPressure", 0), 0, 1);
      var shelf = clamp(numeric(node, "shelfPressure", 0), 0, 1);
      var trench = clamp(numeric(node, "trenchPressure", 0), 0, 1);
      var gap = clamp(numeric(node, "gapPressure", 0), 0, 1);
      var mountain = clamp(numeric(node, "mountainPressure", 0), 0, 1);
      var escarpment = clamp(numeric(node, "escarpmentPressure", 0), 0, 1);
      var carving = clamp(numeric(node, "formerHydrosphereCarvingValue", 0), 0, 1);

      var reliefIntensity = clamp(
        ridge * 0.16 +
        basin * 0.11 +
        valley * 0.10 +
        summit * 0.15 +
        shelf * 0.07 +
        trench * 0.10 +
        gap * 0.06 +
        mountain * 0.12 +
        escarpment * 0.08 +
        slope * 0.14 +
        Math.abs(elevation - 0.5) * 0.10,
        0,
        1
      );

      var futureFillPressure = clamp(
        basin * 0.26 +
        gap * 0.20 +
        valley * 0.10 +
        carving * 0.18 +
        (node.futureFillEligible ? 0.16 : 0),
        0,
        1
      );

      var carrierVisualRole = role === "futureFill" ? "future_fill" : role;

      var sample = attachPsychology({
        reliefSampleId: "AUDRALIA-RELIEF-METADATA-" + String(samples.length).padStart(3, "0"),
        parentNodeId: record.parentNodeId,
        nodeId: record.nodeId,
        seatKey: record.seatKey,
        seatIndex: record.seatIndex,
        nodeIndex: record.nodeIndex,
        sourceIndex: record.sourceIndex,
        sourceSeatIndex: record.sourceSeatIndex,

        x: record.x,
        y: record.y,
        lon: record.lon,
        lat: record.lat,

        elevation: round(elevation, 4),
        dryElevation: round(elevation, 4),
        slope: round(slope, 4),
        slopeIndex: round(slope, 4),
        reliefIntensity: round(reliefIntensity, 4),

        ridgeHighlight: round(clamp(ridge * 0.42 + summit * 0.10 + slope * 0.10, 0, 1), 4),
        basinShadow: round(clamp(basin * 0.36 + gap * 0.12 + carving * 0.08, 0, 1), 4),
        valleyFlowStrength: round(clamp(valley * 0.34 + gap * 0.10 + carving * 0.10, 0, 1), 4),
        summitEmphasis: round(clamp(summit * 0.44 + mountain * 0.16 + elevation * 0.08, 0, 1), 4),
        shelfReliefStrength: round(clamp(shelf * 0.36 + carving * 0.08 + (1 - slope) * 0.05, 0, 1), 4),
        trenchContainment: round(clamp(trench * 0.38 + ridge * 0.06 + escarpment * 0.12, 0, 1), 4),
        gapRelease: round(clamp(gap * 0.38 + valley * 0.06, 0, 1), 4),
        futureFillPressure: round(futureFillPressure, 4),

        ridgePressure: round(ridge, 4),
        basinPressure: round(basin, 4),
        valleyPressure: round(valley, 4),
        summitPressure: round(summit, 4),
        shelfPressure: round(shelf, 4),
        trenchPressure: round(trench, 4),
        gapPressure: round(gap, 4),
        mountainPressure: round(mountain, 4),
        escarpmentPressure: round(escarpment, 4),
        formerHydrosphereCarvingValue: round(carving, 4),

        continentId: record.continentId,
        continentName: record.continentName,
        carrierVisualRole: carrierVisualRole,
        reliefRole: carrierVisualRole,

        metadataOnly: true,
        sourceGeometryPreserved: true,
        sourceDerivedNodeId: record.nodeId,
        syntheticTerrainGenerated: false,
        fallbackTerrainGenerated: false,
        replacementLandmassGenerated: false,

        childDrawsVisuals: false,
        futureFillMetadataOnly: true,
        futureFillDoesNotRenderWater: true,
        hydrationMayReadLater: true,
        hydrationMayActivateNow: false,
        hydrationHeld: true,
        activeHydration: false,
        activeWater: false,
        finalTerrainPassClaim: false,
        finalHydrationPassClaim: false,
        finalVisualPassClaim: false
      }, role);

      samples.push(Object.freeze(sample));
    });

    return Object.freeze(samples);
  }

  function average(values) {
    var clean = values.filter(function (value) { return Number.isFinite(Number(value)); });
    if (!clean.length) return 0;
    return clean.reduce(function (sum, value) { return sum + Number(value || 0); }, 0) / clean.length;
  }

  function groupSamples(samples, predicate) {
    var byGroup = {};

    samples.forEach(function (sample) {
      if (!predicate(sample)) return;
      var key = String(sample.continentId || "unassigned");
      if (!byGroup[key]) byGroup[key] = [];
      byGroup[key].push(sample);
    });

    return byGroup;
  }

  function makeExpression(expressionType, groupKey, samples, strengthKey, role) {
    var nodeIds = samples.map(function (sample) { return sample.nodeId; });
    var seatIndexes = samples.map(function (sample) { return sample.seatIndex; });
    var sourceIndexes = samples.map(function (sample) { return sample.sourceIndex; });
    var primary = samples[0] || {};
    var psychology = psychologyForRole(role);
    var strength = round(average(samples.map(function (sample) { return sample[strengthKey] || 0; })), 4);

    var expression = {
      expressionId: "AUDRALIA-" + expressionType.toUpperCase().replace(/[^A-Z0-9]+/g, "-") + "-" + groupKey.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
      expressionType: expressionType,
      nodeIds: Object.freeze(nodeIds),
      seatIndexes: Object.freeze(seatIndexes),
      sourceIndexes: Object.freeze(sourceIndexes),
      sampleCount: samples.length,

      continentId: primary.continentId || "unassigned",
      continentName: primary.continentName || regionName(primary.continentId || "unassigned"),
      averageElevation: round(average(samples.map(function (sample) { return sample.elevation; })), 4),
      averageDryElevation: round(average(samples.map(function (sample) { return sample.dryElevation; })), 4),
      averageSlope: round(average(samples.map(function (sample) { return sample.slope; })), 4),
      reliefStrength: strength,
      reliefIntensity: round(average(samples.map(function (sample) { return sample.reliefIntensity; })), 4),

      psychologicalRole: psychology.psychologicalRole,
      narrativeFunction: psychology.narrativeFunction,
      ethicalPressure: psychology.ethicalPressure,
      futureExpression: psychology.futureExpression,
      audraliaMeaning: psychology.audraliaMeaning,

      metadataOnly: true,
      sourceGeometryPreserved: true,
      childDrawsVisuals: false,
      futureFillMetadataOnly: true,
      futureFillDoesNotRenderWater: true,
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };

    expression[strengthKey] = strength;

    if (expressionType === "ridge_relief") {
      expression.ridgeReliefStrength = strength;
      expression.ridgeHighlight = strength;
    }

    if (expressionType === "basin_depth") {
      expression.basinDepthStrength = strength;
      expression.basinShadow = strength;
    }

    if (expressionType === "valley_flow") {
      expression.valleyFlowStrength = strength;
    }

    if (expressionType === "summit_relief") {
      expression.summitReliefStrength = strength;
      expression.summitEmphasis = strength;
    }

    if (expressionType === "highland_relief") {
      expression.highlandReliefStrength = strength;
    }

    if (expressionType === "lowland_relief") {
      expression.lowlandReliefStrength = strength;
    }

    if (expressionType === "shelf_relief") {
      expression.shelfReliefStrength = strength;
    }

    if (expressionType === "future_fill_relief") {
      expression.futureFillReliefStrength = strength;
      expression.futureFillPriority = strength;
    }

    return Object.freeze(expression);
  }

  function buildExpressionList(expressionType, samples, predicate, strengthKey, role) {
    var groups = groupSamples(samples, predicate);
    var list = [];

    Object.keys(groups).forEach(function (groupKey) {
      if (groups[groupKey].length) {
        list.push(makeExpression(expressionType, groupKey, groups[groupKey], strengthKey, role));
      }
    });

    return Object.freeze(list);
  }

  function buildExpressionArrays(samples) {
    state.ridgeReliefExpressions = buildExpressionList(
      "ridge_relief",
      samples,
      function (sample) { return sample.ridgeHighlight > 0.10 || sample.reliefRole === "ridge"; },
      "ridgeHighlight",
      "ridge"
    );

    state.basinDepthExpressions = buildExpressionList(
      "basin_depth",
      samples,
      function (sample) { return sample.basinShadow > 0.10 || sample.reliefRole === "basin" || sample.reliefRole === "lowland"; },
      "basinShadow",
      "basin"
    );

    state.valleyFlowExpressions = buildExpressionList(
      "valley_flow",
      samples,
      function (sample) { return sample.valleyFlowStrength > 0.10 || sample.reliefRole === "valley" || sample.reliefRole === "gap"; },
      "valleyFlowStrength",
      "valley"
    );

    state.summitReliefExpressions = buildExpressionList(
      "summit_relief",
      samples,
      function (sample) { return sample.summitEmphasis > 0.10 || sample.reliefRole === "summit"; },
      "summitEmphasis",
      "summit"
    );

    state.highlandReliefExpressions = buildExpressionList(
      "highland_relief",
      samples,
      function (sample) { return sample.dryElevation > 0.62 || sample.reliefRole === "highland" || sample.mountainPressure > 0.18; },
      "reliefIntensity",
      "highland"
    );

    state.lowlandReliefExpressions = buildExpressionList(
      "lowland_relief",
      samples,
      function (sample) { return sample.dryElevation < 0.40 || sample.reliefRole === "lowland" || sample.basinShadow > 0.16; },
      "basinShadow",
      "lowland"
    );

    state.shelfReliefExpressions = buildExpressionList(
      "shelf_relief",
      samples,
      function (sample) { return sample.shelfReliefStrength > 0.08 || sample.reliefRole === "shelf"; },
      "shelfReliefStrength",
      "shelf"
    );

    state.futureFillReliefExpressions = buildExpressionList(
      "future_fill_relief",
      samples,
      function (sample) { return sample.futureFillPressure > 0.12 || sample.reliefRole === "future_fill" || sample.reliefRole === "futureFill"; },
      "futureFillPressure",
      "futureFill"
    );
  }

  function expressionArraysPopulated() {
    return Boolean(
      state.ridgeReliefExpressions.length ||
      state.basinDepthExpressions.length ||
      state.valleyFlowExpressions.length ||
      state.summitReliefExpressions.length ||
      state.highlandReliefExpressions.length ||
      state.lowlandReliefExpressions.length ||
      state.shelfReliefExpressions.length ||
      state.futureFillReliefExpressions.length
    );
  }

  function buildMetadataSummary(samples) {
    var counts = {};
    var futureFillCount = 0;
    var slopeTotal = 0;

    samples.forEach(function (sample) {
      var role = sample.reliefRole || "unassigned";
      counts[role] = (counts[role] || 0) + 1;
      if (Number(sample.futureFillPressure || 0) > 0.24) futureFillCount += 1;
      slopeTotal += Number(sample.slope || 0);
    });

    return Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: true,
      sourceSeatCount: SOURCE_SEAT_COUNT,
      sourceSampleCount: samples.length,
      reliefSampleCount: samples.length,
      roleCounts: counts,
      futureFillCandidateCount: futureFillCount,
      averageSlope: samples.length ? round(slopeTotal / samples.length, 4) : 0,
      slopeMetadataActive: samples.some(function (sample) { return Number.isFinite(Number(sample.slope)); }),
      expressionArraysPopulated: expressionArraysPopulated(),
      ridgeReliefExpressionCount: state.ridgeReliefExpressions.length,
      basinDepthExpressionCount: state.basinDepthExpressions.length,
      valleyFlowExpressionCount: state.valleyFlowExpressions.length,
      summitReliefExpressionCount: state.summitReliefExpressions.length,
      highlandReliefExpressionCount: state.highlandReliefExpressions.length,
      lowlandReliefExpressionCount: state.lowlandReliefExpressions.length,
      shelfReliefExpressionCount: state.shelfReliefExpressions.length,
      futureFillReliefExpressionCount: state.futureFillReliefExpressions.length,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      futureFillMetadataOnly: true,
      futureFillDoesNotRenderWater: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });
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
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-relief-metadata-interface-enrichment-child", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-relief-metadata-interface-enrichment-child", { compact: false });

    var nodes = dryNodes();

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

    buildSourceRecords(nodes);

    state.sourceGeometryValid = Boolean(state.sourceRecords.length && state.sourceRecords.some(function (record) {
      return Number.isFinite(Number(record.x)) && Number.isFinite(Number(record.y));
    }));

    state.sourceFailureReason = state.sourceGeometryValid ? "" : "valid source terrain nodes missing or unmappable";

    return state.sourceGeometryValid;
  }

  function buildEmptyOutputs(reason) {
    state.reliefSamples = Object.freeze([]);
    state.ridgeReliefExpressions = Object.freeze([]);
    state.basinDepthExpressions = Object.freeze([]);
    state.valleyFlowExpressions = Object.freeze([]);
    state.summitReliefExpressions = Object.freeze([]);
    state.highlandReliefExpressions = Object.freeze([]);
    state.lowlandReliefExpressions = Object.freeze([]);
    state.shelfReliefExpressions = Object.freeze([]);
    state.futureFillReliefExpressions = Object.freeze([]);
    state.reliefMetadataSummary = Object.freeze({
      metadataOnly: true,
      sourceGeometryPreserved: false,
      sourceSampleCount: 0,
      reliefSampleCount: 0,
      held: true,
      heldReason: reason || state.sourceFailureReason,
      slopeMetadataActive: false,
      expressionArraysPopulated: false,
      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      childDrawsVisuals: false,
      futureFillMetadataOnly: true,
      futureFillDoesNotRenderWater: true,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function buildReliefPacket() {
    detectDryTerrain();

    if (!state.sourceGeometryValid || !state.sourceRecords.length) {
      buildEmptyOutputs(state.sourceFailureReason);
      state.built = true;
      state.buildCount += 1;
      state.lastBuiltAt = new Date().toISOString();
      publishDataset();
      return false;
    }

    state.reliefSamples = buildReliefSamplesFromSource(state.sourceRecords);
    buildExpressionArrays(state.reliefSamples);
    state.reliefMetadataSummary = buildMetadataSummary(state.reliefSamples);

    state.built = true;
    state.buildCount += 1;
    state.lastBuiltAt = new Date().toISOString();
    publishDataset();

    return ready();
  }

  function ready() {
    return Boolean(state.sourceGeometryValid && state.reliefSamples.length && expressionArraysPopulated());
  }

  function compactSample(sample) {
    return {
      reliefSampleId: sample.reliefSampleId,
      parentNodeId: sample.parentNodeId,
      nodeId: sample.nodeId,
      seatKey: sample.seatKey,
      seatIndex: sample.seatIndex,
      nodeIndex: sample.nodeIndex,
      sourceIndex: sample.sourceIndex,
      sourceSeatIndex: sample.sourceSeatIndex,
      x: sample.x,
      y: sample.y,
      lon: sample.lon,
      lat: sample.lat,
      elevation: sample.elevation,
      dryElevation: sample.dryElevation,
      slope: sample.slope,
      slopeIndex: sample.slopeIndex,
      reliefIntensity: sample.reliefIntensity,
      ridgeHighlight: sample.ridgeHighlight,
      basinShadow: sample.basinShadow,
      valleyFlowStrength: sample.valleyFlowStrength,
      summitEmphasis: sample.summitEmphasis,
      shelfReliefStrength: sample.shelfReliefStrength,
      futureFillPressure: sample.futureFillPressure,
      carrierVisualRole: sample.carrierVisualRole,
      reliefRole: sample.reliefRole,
      continentId: sample.continentId,
      continentName: sample.continentName,
      planetPsychologyActive: sample.planetPsychologyActive,
      metadataOnly: true,
      childDrawsVisuals: false,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
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

      sourceSampleCount: state.sourceRecords.length,
      reliefSampleCount: state.reliefSamples.length,
      slopeMetadataActive: state.reliefSamples.some(function (sample) { return Number.isFinite(Number(sample.slope)); }),
      expressionArraysPopulated: expressionArraysPopulated(),

      ridgeReliefExpressionCount: state.ridgeReliefExpressions.length,
      basinDepthExpressionCount: state.basinDepthExpressions.length,
      valleyFlowExpressionCount: state.valleyFlowExpressions.length,
      summitReliefExpressionCount: state.summitReliefExpressions.length,
      highlandReliefExpressionCount: state.highlandReliefExpressions.length,
      lowlandReliefExpressionCount: state.lowlandReliefExpressions.length,
      shelfReliefExpressionCount: state.shelfReliefExpressions.length,
      futureFillReliefExpressionCount: state.futureFillReliefExpressions.length,

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

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,

      futureFillMetadataOnly: true,
      futureFillDoesNotRenderWater: true,
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      buildCount: state.buildCount,
      lastBuiltAt: state.lastBuiltAt,
      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_ELEVATION_RELIEF_METADATA_INTERFACE_ENRICHMENT_DEPLOY_MARKER_v2"
    };
  }

  function status() {
    return baseStatus();
  }

  function getCarrierReliefPacket(requester, options) {
    if (!state.built || options && options.refresh === true) buildReliefPacket();

    var compact = Boolean(options && options.compact);
    var isReady = ready();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,
      packetType: "carrier_relief_expression_metadata_interface_enrichment_packet",
      requester: requester || "unknown",

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
      sourceSampleCount: state.sourceRecords.length,
      reliefSampleCount: state.reliefSamples.length,
      slopeMetadataActive: state.reliefSamples.some(function (sample) { return Number.isFinite(Number(sample.slope)); }),
      expressionArraysPopulated: expressionArraysPopulated(),

      reliefSamples: compact ? state.reliefSamples.map(compactSample) : stableClone(state.reliefSamples),
      ridgeReliefExpressions: stableClone(state.ridgeReliefExpressions),
      basinDepthExpressions: stableClone(state.basinDepthExpressions),
      valleyFlowExpressions: stableClone(state.valleyFlowExpressions),
      summitReliefExpressions: stableClone(state.summitReliefExpressions),
      highlandReliefExpressions: stableClone(state.highlandReliefExpressions),
      lowlandReliefExpressions: stableClone(state.lowlandReliefExpressions),
      shelfReliefExpressions: stableClone(state.shelfReliefExpressions),
      futureFillReliefExpressions: stableClone(state.futureFillReliefExpressions),
      reliefMetadataSummary: stableClone(state.reliefMetadataSummary),

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

      syntheticTerrainGenerated: false,
      fallbackTerrainGenerated: false,
      replacementLandmassGenerated: false,
      terrainTruthSource: "existing dry terrain child only",
      reliefTruthChild: true,
      carrierDisplaysOnly: true,

      futureFillMetadataOnly: true,
      futureFillDoesNotRenderWater: true,
      hydrationMayReadLater: true,
      hydrationMayActivateNow: false,
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

  function publishDataset() {
    var isReady = ready();

    try {
      document.documentElement.dataset.audraliaReliefExpressionContract = CONTRACT;
      document.documentElement.dataset.audraliaReliefExpressionPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.audraliaReliefExpressionReady = String(isReady);
      document.documentElement.dataset.audraliaReliefMetadataOnly = "true";
      document.documentElement.dataset.audraliaReliefSourceGeometryPreserved = String(isReady);
      document.documentElement.dataset.audraliaReliefSampleCount = String(state.reliefSamples.length);
      document.documentElement.dataset.audraliaReliefSlopeMetadataActive = String(state.reliefSamples.some(function (sample) { return Number.isFinite(Number(sample.slope)); }));
      document.documentElement.dataset.audraliaReliefExpressionArraysPopulated = String(expressionArraysPopulated());
      document.documentElement.dataset.audraliaReliefChildDrawsVisuals = "false";
      document.documentElement.dataset.audraliaReliefSyntheticTerrainGenerated = "false";
      document.documentElement.dataset.audraliaReliefFallbackTerrainGenerated = "false";
      document.documentElement.dataset.audraliaReliefReplacementLandmassGenerated = "false";
      document.documentElement.dataset.audraliaReliefPlanetPsychologyActive = String(isReady);
      document.documentElement.dataset.audraliaReliefHydrationHeld = "true";
      document.documentElement.dataset.audraliaReliefActiveHydration = "false";
      document.documentElement.dataset.audraliaReliefActiveWater = "false";
      document.documentElement.dataset.audraliaReliefFinalTerrainPassClaim = "false";
      document.documentElement.dataset.audraliaReliefFinalHydrationPassClaim = "false";
      document.documentElement.dataset.audraliaReliefFinalVisualPassClaim = "false";
    } catch (_error) {}
  }

  function publishStatus() {
    var payload = baseStatus();

    window.AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD_STATUS = payload;
    window.AUDRALIA_ELEVATION_RELIEF_METADATA_INTERFACE_ENRICHMENT_STATUS = payload;
    window.AUDRALIA_ELEVATION_RELIEF_METADATA_ONLY_RESTORATION_STATUS = payload;

    publishDataset();

    return payload;
  }

  function rebuild() {
    var result = buildReliefPacket();
    publishStatus();
    return result;
  }

  function api() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,
      status: publishStatus,
      getCarrierReliefPacket: getCarrierReliefPacket,
      getReliefExpressionPacket: getReliefExpressionPacket,
      rebuild: rebuild,
      refresh: rebuild
    });
  }

  function boot() {
    rebuild();

    setTimeout(rebuild, 180);
    setTimeout(rebuild, 640);
    setTimeout(rebuild, 1200);
    setTimeout(rebuild, 1800);
  }

  var exported = api();

  window.AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD = exported;
  window.AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD = exported;
  window.AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD = exported;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
