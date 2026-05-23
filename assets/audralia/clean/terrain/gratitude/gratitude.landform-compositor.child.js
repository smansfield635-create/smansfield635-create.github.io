// /assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js
// AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_SURFACE_SOURCE_BINDING_TNT_v1
// Full-file replacement.
// Scope: Gratitude child 4 of 4.
// Purpose: consume child 1 surface-habitability, child 2 hydration, and child 3 hydration-edge; publish unified packets to runtime carrier.
// Does not consume legacy broad /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js as active land authority.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_SURFACE_SOURCE_BINDING_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_THREE_CHILD_CONSUMPTION_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js";

  var CHILD_TYPE = "gratitude_landform_compositor_child_4_of_4";
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var SEA_LEVEL_DATUM = 0.32;

  var SOURCE_ALIASES = Object.freeze({
    surface: Object.freeze([
      "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD",
      "AUDRALIA_G2_GRATITUDE_SURFACE_HABITABILITY_CHILD",
      "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_CHILD"
    ]),
    hydration: Object.freeze([
      "AUDRALIA_GRATITUDE_HYDRATION_CHILD",
      "AUDRALIA_G2_GRATITUDE_HYDRATION_CHILD",
      "AUDRALIA_GRATITUDE_HYDRATION_SCOPE_CHILD"
    ]),
    edge: Object.freeze([
      "AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD",
      "AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD",
      "AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD"
    ])
  });

  var runtime = {
    refreshedAt: null,
    refreshCount: 0,
    warnings: [],
    failures: [],
    sources: {
      surface: blankSource("surface-habitability", SOURCE_ALIASES.surface),
      hydration: blankSource("hydration", SOURCE_ALIASES.hydration),
      edge: blankSource("hydration-edge", SOURCE_ALIASES.edge)
    },
    nodes: [],
    landNodes: [],
    boundaryNodes: [],
    hydrationNodes: [],
    edgeNodes: [],
    summitNodes: [],
    coastlinePath: null,
    hydrationFlowField: null,
    edgeRelationshipField: null
  };

  function blankSource(name, aliases) {
    return {
      name: name,
      aliases: aliases.slice(),
      api: null,
      detected: false,
      apiComplete: false,
      valid: false,
      status: null,
      receivePacket: null,
      maps: {},
      failureReason: name + " not checked"
    };
  }

  function clamp(value, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function firstGlobal(aliases) {
    if (typeof window === "undefined") return null;

    for (var i = 0; i < aliases.length; i += 1) {
      if (window[aliases[i]]) return window[aliases[i]];
    }

    return null;
  }

  function safeCall(source, method) {
    if (!source.api || typeof source.api[method] !== "function") return null;

    try {
      return source.api[method].apply(source.api, Array.prototype.slice.call(arguments, 2));
    } catch (error) {
      runtime.warnings.push(source.name + "." + method + ":" + (error && error.message ? error.message : String(error)));
      return null;
    }
  }

  function collect(payload, keys) {
    if (!payload) return [];

    for (var i = 0; i < keys.length; i += 1) {
      if (Array.isArray(payload[keys[i]])) return payload[keys[i]];
    }

    return [];
  }

  function valueOf(source, keys, fallback) {
    if (!source) return fallback;

    for (var i = 0; i < keys.length; i += 1) {
      var value = source[keys[i]];
      if (value !== undefined && value !== null && value !== "") {
        var number = Number(value);
        if (Number.isFinite(number)) return number;
      }
    }

    return fallback;
  }

  function textOf(source, keys, fallback) {
    if (!source) return fallback || "";

    for (var i = 0; i < keys.length; i += 1) {
      var value = source[keys[i]];
      if (value !== undefined && value !== null && String(value)) return String(value);
    }

    return fallback || "";
  }

  function boolOf(source, keys, fallback) {
    if (!source) return Boolean(fallback);

    for (var i = 0; i < keys.length; i += 1) {
      if (source[keys[i]] === true) return true;
      if (source[keys[i]] === false) return false;
    }

    return Boolean(fallback);
  }

  function sourceNodeId(x, y) {
    return "GRATITUDE-COMPOSITOR-SOURCE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function compositeNodeId(x, y) {
    return "GRATITUDE-COMPOSITE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function lonLat(x, y) {
    return {
      lon: round(-142 + (x / 15) * 108, 4),
      lat: round(56 - (y / 15) * 112, 4)
    };
  }

  function seatIndexOf(item) {
    var index = valueOf(item, ["seatIndex", "nodeIndex", "index"], null);
    if (Number.isFinite(index)) return clamp(Math.round(index), 0, NODE_COUNT - 1);

    var x = valueOf(item, ["x", "radial", "centerX"], null);
    var y = valueOf(item, ["y", "band", "centerY"], null);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      return clamp(Math.round(y), 0, FIBONACCI_BANDS - 1) * RADIAL_NODES +
        clamp(Math.round(x), 0, RADIAL_NODES - 1);
    }

    var key = textOf(item, ["seatKey"], "");
    var match = key.match(/G-(\d+)-(\d+)/);
    if (match) return clamp(Number(match[1]), 0, 15) * 16 + clamp(Number(match[2]), 0, 15);

    return null;
  }

  function blankNodes() {
    var nodes = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var index = y * RADIAL_NODES + x;

        nodes.push({
          sourceNodeId: sourceNodeId(x, y),
          compositeNodeId: compositeNodeId(x, y),
          nodeId: compositeNodeId(x, y),
          seatIndex: index,
          nodeIndex: index,
          seatKey: seatKey(x, y),
          x: x,
          y: y,
          continentMembership: false,
          terrainClass: "outside_context",
          hydrationClass: "outside_context",
          primaryCategory: "outside_context",
          elevation: 0,
          unifiedElevation: 0,
          seaLevelDatum: SEA_LEVEL_DATUM,
          aboveSeaLevelMass: false
        });
      }
    }

    return nodes;
  }

  function mergeList(base, list) {
    if (!Array.isArray(list)) return;

    list.forEach(function (item) {
      var index = seatIndexOf(item);
      if (!Number.isFinite(index) || !base[index]) return;
      Object.assign(base[index], item);
    });
  }

  function readSurface() {
    var source = runtime.sources.surface;

    source.api = firstGlobal(source.aliases);
    source.detected = Boolean(source.api);
    source.apiComplete = false;
    source.valid = false;
    source.status = null;
    source.receivePacket = null;
    source.maps = {};

    if (!source.detected) {
      source.failureReason = "surface-habitability child missing";
      runtime.failures.push(source.failureReason);
      return;
    }

    source.apiComplete = Boolean(
      typeof source.api.status === "function" &&
      typeof source.api.getChildReceivePacket === "function" &&
      typeof source.api.getSurfaceMap === "function" &&
      typeof source.api.getElevationField === "function" &&
      typeof source.api.getSummitInfluenceField === "function" &&
      typeof source.api.getNodeMap === "function" &&
      typeof source.api.getSurfaceHabitabilityBlueprintPacket === "function"
    );

    source.status = safeCall(source, "status");
    source.receivePacket = safeCall(source, "getChildReceivePacket", "landform-compositor", { compact: false });
    source.maps.surfaceMap = safeCall(source, "getSurfaceMap", { compact: false });
    source.maps.elevationField = safeCall(source, "getElevationField", { compact: false });
    source.maps.summitField = safeCall(source, "getSummitInfluenceField", { compact: false });
    source.maps.nodeMap = safeCall(source, "getNodeMap", { compact: false });
    source.maps.blueprintPacket = safeCall(source, "getSurfaceHabitabilityBlueprintPacket", "landform-compositor", { compact: false });

    source.valid = Boolean(
      source.apiComplete &&
      source.status &&
      source.status.gratitudeChildNumber === "1-of-4" &&
      source.status.surfaceHabitabilityAuthorityActive === true &&
      source.status.landAuthorityActive === true &&
      source.status.elevationAuthorityActive === true &&
      source.status.aboveSeaLevelAuthorityActive === true &&
      source.status.finalVisualPassClaim === false &&
      source.receivePacket &&
      source.receivePacket.childReceivePacketReady === true
    );

    source.failureReason = source.valid ? "" : "surface-habitability validation failed";
    if (!source.valid) runtime.failures.push(source.failureReason);
  }

  function readFlexibleSource(key, requiredName) {
    var source = runtime.sources[key];

    source.api = firstGlobal(source.aliases);
    source.detected = Boolean(source.api);
    source.apiComplete = false;
    source.valid = false;
    source.status = null;
    source.receivePacket = null;
    source.maps = {};

    if (!source.detected) {
      source.failureReason = requiredName + " child missing";
      runtime.failures.push(source.failureReason);
      return;
    }

    source.apiComplete = typeof source.api.status === "function";
    source.status = safeCall(source, "status");

    if (typeof source.api.getChildReceivePacket === "function") {
      source.receivePacket = safeCall(source, "getChildReceivePacket", "landform-compositor", { compact: false });
    }

    [
      "getHydrationMap",
      "getHydrationFlowField",
      "getWaterBehaviorPacket",
      "getRiverStreamMap",
      "getMarshWetlandMap",
      "getHydrationEdgeMap",
      "getMaterialEdgeMap",
      "getBeachMap",
      "getCliffMap",
      "getWaterfallMap",
      "getSedimentMap",
      "getRockMap"
    ].forEach(function (method) {
      if (typeof source.api[method] === "function") {
        source.maps[method] = safeCall(source, method, method.indexOf("Packet") >= 0 ? "landform-compositor" : { compact: false }, { compact: false });
      }
    });

    source.valid = Boolean(
      source.apiComplete &&
      source.status &&
      source.status.finalVisualPassClaim !== true
    );

    source.failureReason = source.valid ? "" : requiredName + " validation failed";
    if (!source.valid) runtime.failures.push(source.failureReason);
  }

  function readSources() {
    runtime.failures = [];
    runtime.warnings = [];

    readSurface();
    readFlexibleSource("hydration", "hydration");
    readFlexibleSource("edge", "hydration-edge");
  }

  function mergeSourceData() {
    var nodes = blankNodes();
    var surface = runtime.sources.surface.maps;
    var hydration = runtime.sources.hydration.maps;
    var edge = runtime.sources.edge.maps;

    mergeList(nodes, collect(surface.nodeMap, ["nodes", "seats"]));
    mergeList(nodes, collect(surface.surfaceMap, ["nodes", "seats", "landNodes"]));
    mergeList(nodes, collect(surface.elevationField, ["nodes", "seats"]));
    mergeList(nodes, collect(surface.summitField, ["nodes", "seats"]));
    mergeList(nodes, collect(surface.blueprintPacket, ["nodes", "seats", "landNodes"]));

    Object.keys(hydration).forEach(function (key) {
      mergeList(nodes, collect(hydration[key], ["nodes", "seats", "waterNodes", "flowNodes"]));
    });

    Object.keys(edge).forEach(function (key) {
      mergeList(nodes, collect(edge[key], ["nodes", "seats", "edgeNodes", "edges", "materialNodes"]));
    });

    return nodes;
  }

  function neighbors(index) {
    var x = index % RADIAL_NODES;
    var y = Math.floor(index / RADIAL_NODES);
    var out = [];

    for (var dy = -1; dy <= 1; dy += 1) {
      for (var dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;

        var nx = x + dx;
        var ny = y + dy;

        if (nx >= 0 && nx < RADIAL_NODES && ny >= 0 && ny < FIBONACCI_BANDS) {
          out.push(ny * RADIAL_NODES + nx);
        }
      }
    }

    return out;
  }

  function isLand(node) {
    var terrain = textOf(node, ["terrainClass"], "");
    var category = textOf(node, ["primaryCategory"], "");
    var elevation = valueOf(node, ["unifiedElevation", "surfaceExpressionDatum", "elevation"], 0);

    return Boolean(
      node.continentMembership === true ||
      node.land === true ||
      node.aboveSeaLevelMass === true ||
      node.continentId === "gratitude" ||
      elevation >= SEA_LEVEL_DATUM ||
      (terrain && terrain.indexOf("outside") < 0 && category !== "outside_context" && category !== "outside_continent")
    );
  }

  function composeNode(node, index) {
    var x = index % RADIAL_NODES;
    var y = Math.floor(index / RADIAL_NODES);
    var land = isLand(node);
    var elevation = valueOf(node, ["unifiedElevation", "surfaceExpressionDatum", "elevation"], land ? 0.44 : 0);
    var hydration = valueOf(node, ["hydrationInfluence", "hydrationPressure", "hydrationDepth", "waterRetentionPermission"], 0);
    var edge = valueOf(node, ["edgeInfluence", "edgePressure", "beachPermission", "cliffPermission", "waterfallPermission"], 0);
    var summit = valueOf(node, ["summitInfluence", "summitPressure", "summitMaxInfluence"], 0);
    var ridge = valueOf(node, ["ridgeInfluence", "ridgePressure"], 0);
    var basin = valueOf(node, ["basinInfluence", "basinPressure"], 0);
    var valley = valueOf(node, ["valleyInfluence", "valleyPressure"], 0);
    var coast = valueOf(node, ["coastInfluence", "coastPressure", "shelfPressure"], 0);
    var material = Math.max(
      valueOf(node, ["materialInfluence"], 0),
      valueOf(node, ["sedimentPressure"], 0),
      valueOf(node, ["rockPressure"], 0),
      valueOf(node, ["sandPressure"], 0),
      valueOf(node, ["soilPressure"], 0)
    );

    return {
      compositeNodeId: compositeNodeId(x, y),
      sourceNodeId: textOf(node, ["sourceNodeId", "nodeId"], sourceNodeId(x, y)),
      nodeId: compositeNodeId(x, y),
      seatIndex: index,
      nodeIndex: index,
      seatKey: textOf(node, ["seatKey"], seatKey(x, y)),
      x: x,
      y: y,

      continentMembership: land,
      terrainClass: textOf(node, ["terrainClass"], land ? "surface_land" : "outside_context"),
      hydrationClass: textOf(node, ["hydrationClass"], land ? "hydration_defined_downstream" : "outside_context"),
      primaryCategory: textOf(node, ["primaryCategory"], land ? "surface" : "outside_context"),

      elevation: round(elevation, 4),
      unifiedElevation: round(elevation, 4),
      seaLevelDatum: SEA_LEVEL_DATUM,
      aboveSeaLevelMass: Boolean(land && elevation >= SEA_LEVEL_DATUM),

      summitInfluence: round(summit, 4),
      ridgeInfluence: round(ridge, 4),
      basinInfluence: round(basin, 4),
      valleyInfluence: round(valley, 4),
      coastInfluence: round(coast, 4),
      hydrationInfluence: round(hydration, 4),
      edgeInfluence: round(edge, 4),
      materialInfluence: round(material, 4),

      edgeBehavior: textOf(node, ["edgeBehavior"], "held_future_socket"),
      waterBehavior: textOf(node, ["waterBehavior"], "held_future_socket"),
      materialBehavior: textOf(node, ["materialBehavior"], "held_future_socket"),
      primaryBehavior: textOf(node, ["primaryBehavior"], "held_future_socket"),

      massContinuityWeight: 0,
      mergedLandformMembership: false,
      boundaryParcel: false,
      coastlineParcel: false,
      interiorParcel: false,
      hydrationFlowParcel: false,
      edgeRelationshipParcel: false,
      summitAnchorParcel: false,

      renderAsRawParcel: false,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function composeNodes(raw) {
    var nodes = raw.map(composeNode);

    nodes.forEach(function (node, index) {
      var ns = neighbors(index);
      var landNeighbors = 0;
      var elevationTotal = node.elevation;
      var elevationCount = 1;

      ns.forEach(function (ni) {
        if (nodes[ni] && nodes[ni].continentMembership) {
          landNeighbors += 1;
          elevationTotal += nodes[ni].elevation;
          elevationCount += 1;
        }
      });

      node.massContinuityWeight = round(ns.length ? landNeighbors / ns.length : 0, 4);
      node.unifiedElevation = round(clamp((elevationTotal / elevationCount) * 0.70 + node.elevation * 0.30, 0, 1), 4);
      node.mergedLandformMembership = Boolean(node.continentMembership && (node.aboveSeaLevelMass || node.massContinuityWeight > 0.14));
      node.boundaryParcel = Boolean(node.mergedLandformMembership && (node.massContinuityWeight < 0.88 || node.coastInfluence > 0.22 || node.edgeInfluence > 0.30));
      node.coastlineParcel = Boolean(node.boundaryParcel && (node.massContinuityWeight < 0.76 || node.coastInfluence > 0.30 || node.edgeInfluence > 0.34));
      node.interiorParcel = Boolean(node.mergedLandformMembership && !node.coastlineParcel);
      node.hydrationFlowParcel = Boolean(node.hydrationInfluence > 0.16 || /river|stream|gully|pool|marsh|wetland|waterfall/.test(node.waterBehavior + node.edgeBehavior));
      node.edgeRelationshipParcel = Boolean(node.coastlineParcel || /beach|cliff|waterfall|shelf|delta|sediment|rock|sand/.test(node.edgeBehavior + node.primaryBehavior + node.materialBehavior));
      node.summitAnchorParcel = Boolean(node.summitInfluence > 0.28);
      Object.freeze(node);
    });

    return Object.freeze(nodes);
  }

  function compactNode(node) {
    return {
      compositeNodeId: node.compositeNodeId,
      sourceNodeId: node.sourceNodeId,
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,
      x: node.x,
      y: node.y,
      terrainClass: node.terrainClass,
      hydrationClass: node.hydrationClass,
      elevation: node.elevation,
      unifiedElevation: node.unifiedElevation,
      continentMembership: node.continentMembership,
      mergedLandformMembership: node.mergedLandformMembership,
      coastlineParcel: node.coastlineParcel,
      boundaryParcel: node.boundaryParcel,
      interiorParcel: node.interiorParcel,
      hydrationFlowParcel: node.hydrationFlowParcel,
      edgeRelationshipParcel: node.edgeRelationshipParcel,
      summitAnchorParcel: node.summitAnchorParcel,
      edgeBehavior: node.edgeBehavior,
      waterBehavior: node.waterBehavior,
      materialBehavior: node.materialBehavior,
      renderAsRawParcel: false,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function buildCoastline(nodes) {
    var boundary = nodes.filter(function (node) { return node.coastlineParcel; });
    if (!boundary.length) boundary = nodes.filter(function (node) { return node.boundaryParcel; });

    if (!boundary.length) {
      return Object.freeze({
        pathId: "GRATITUDE-COASTLINE-HELD",
        pathReady: false,
        pointCount: 0,
        points: [],
        finalVisualPassClaim: false
      });
    }

    var cx = 0;
    var cy = 0;

    boundary.forEach(function (node) {
      cx += node.x + 0.5;
      cy += node.y + 0.5;
    });

    cx /= boundary.length;
    cy /= boundary.length;

    boundary.sort(function (a, b) {
      return Math.atan2(a.y + 0.5 - cy, a.x + 0.5 - cx) -
        Math.atan2(b.y + 0.5 - cy, b.x + 0.5 - cx);
    });

    var points = boundary.map(function (node) {
      var p = lonLat(node.x + 0.5, node.y + 0.5);

      return {
        nodeId: node.compositeNodeId,
        sourceNodeId: node.sourceNodeId,
        x: node.x,
        y: node.y,
        lon: p.lon,
        lat: p.lat,
        edgeBehavior: node.edgeBehavior,
        materialBehavior: node.materialBehavior,
        finalVisualPassClaim: false
      };
    });

    if (points.length) points.push(clone(points[0]));

    return Object.freeze({
      pathId: "GRATITUDE-UNIFIED-COASTLINE-PATH-01",
      pathReady: true,
      pointCount: points.length,
      points: Object.freeze(points),
      coastlineIsUnified: true,
      surfaceHabitabilityIsSource: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    });
  }

  function buildFields() {
    runtime.landNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.mergedLandformMembership; }));
    runtime.boundaryNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.boundaryParcel; }));
    runtime.hydrationNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.hydrationFlowParcel; }));
    runtime.edgeNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.edgeRelationshipParcel; }));
    runtime.summitNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.summitAnchorParcel; }));
    runtime.coastlinePath = buildCoastline(runtime.nodes);

    runtime.hydrationFlowField = Object.freeze({
      contract: CONTRACT,
      fieldType: "hydration_flow_from_child_2_projected_through_compositor",
      hydrationFlowFieldReady: runtime.hydrationNodes.length > 0,
      hydrationFlowCount: runtime.hydrationNodes.length,
      nodes: Object.freeze(runtime.hydrationNodes.map(compactNode)),
      flowPaths: Object.freeze([
        Object.freeze({
          pathId: "GRATITUDE-COMPOSITOR-HYDRATION-FLOW-01",
          points: Object.freeze(runtime.hydrationNodes.map(function (node) {
            var p = lonLat(node.x + 0.5, node.y + 0.5);
            return { lon: p.lon, lat: p.lat, x: node.x, y: node.y, nodeId: node.compositeNodeId };
          })),
          carrierMayConsume: true,
          finalVisualPassClaim: false
        })
      ]),
      finalVisualPassClaim: false
    });

    runtime.edgeRelationshipField = Object.freeze({
      contract: CONTRACT,
      fieldType: "edge_relationship_from_child_3_projected_through_compositor",
      edgeRelationshipFieldReady: runtime.edgeNodes.length > 0,
      edgeRelationshipCount: runtime.edgeNodes.length,
      nodes: Object.freeze(runtime.edgeNodes.map(compactNode)),
      finalVisualPassClaim: false
    });
  }

  function sourceReceipt(source) {
    return {
      name: source.name,
      detected: source.detected,
      apiComplete: source.apiComplete,
      valid: source.valid,
      failureReason: source.failureReason,
      aliases: source.aliases.slice()
    };
  }

  function compositorPass() {
    return Boolean(
      runtime.sources.surface.valid &&
      runtime.sources.hydration.valid &&
      runtime.sources.edge.valid &&
      runtime.landNodes.length > 0 &&
      runtime.coastlinePath &&
      runtime.coastlinePath.pathReady === true
    );
  }

  function refresh() {
    runtime.refreshCount += 1;
    runtime.refreshedAt = new Date().toISOString();

    readSources();
    runtime.nodes = composeNodes(mergeSourceData());
    buildFields();
    publishGlobals();

    return runtime;
  }

  function status() {
    refresh();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,
      childType: CHILD_TYPE,

      gratitudeChildNumber: "4-of-4",
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      consumesSurfaceHabitability: true,
      consumesHydration: true,
      consumesHydrationEdge: true,
      consumesLegacyBroadContinentChild: false,

      surfaceHabitability: sourceReceipt(runtime.sources.surface),
      hydration: sourceReceipt(runtime.sources.hydration),
      hydrationEdge: sourceReceipt(runtime.sources.edge),

      surfaceHabitabilityDetected: runtime.sources.surface.detected,
      surfaceHabitabilityValidated: runtime.sources.surface.valid,
      hydrationValidated: runtime.sources.hydration.valid,
      hydrationEdgeValidated: runtime.sources.edge.valid,
      compositorValidated: compositorPass(),

      terrainPass: runtime.sources.surface.valid,
      hydrationPass: runtime.sources.hydration.valid,
      edgePass: runtime.sources.edge.valid,
      compositorPass: compositorPass(),

      unifiedLandformScope256Active: true,
      nodeCount: NODE_COUNT,
      landNodeCount: runtime.landNodes.length,
      boundaryNodeCount: runtime.boundaryNodes.length,
      hydrationFlowCount: runtime.hydrationNodes.length,
      edgeRelationshipCount: runtime.edgeNodes.length,
      summitNodeCount: runtime.summitNodes.length,
      coastlinePathReady: Boolean(runtime.coastlinePath && runtime.coastlinePath.pathReady),
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false,

      failures: runtime.failures.slice(),
      warnings: runtime.warnings.slice(),
      refreshedAt: runtime.refreshedAt,
      refreshCount: runtime.refreshCount,
      deployMarker: "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_SURFACE_SOURCE_BINDING_DEPLOY_MARKER_v1"
    };
  }

  function getContinentMask(options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      maskReady: runtime.landNodes.length > 0,
      maskType: "surface_habitability_source_unified_continent_mask",
      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(clone),
      rawParcelVisibilityHeld: true,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getCoastlinePath() {
    refresh();
    return clone(runtime.coastlinePath);
  }

  function getElevationField(options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      elevationFieldReady: runtime.landNodes.length > 0,
      surfaceHabitabilityIsSource: true,
      nodes: compact ? runtime.landNodes.map(compactNode) : runtime.landNodes.map(clone),
      finalVisualPassClaim: false
    };
  }

  function getSummitInfluenceField(options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      summitInfluenceFieldReady: runtime.summitNodes.length > 0,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      nodes: compact ? runtime.summitNodes.map(compactNode) : runtime.summitNodes.map(clone),
      finalVisualPassClaim: false
    };
  }

  function getHydrationFlowField() {
    refresh();
    return clone(runtime.hydrationFlowField);
  }

  function getEdgeRelationshipField() {
    refresh();
    return clone(runtime.edgeRelationshipField);
  }

  function getUnifiedLandformPacket(target, options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "unassigned-unified-landform-consumer",
      packetType: "surface_source_bound_unified_landform_packet",
      unifiedLandformPacketReady: compositorPass(),

      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      surfaceHabitabilityConsumed: runtime.sources.surface.valid,
      hydrationConsumed: runtime.sources.hydration.valid,
      hydrationEdgeConsumed: runtime.sources.edge.valid,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath(),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),

      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(clone),

      carrierMayConsume: true,
      carrierInventsLandform: false,
      finalVisualPassClaim: false
    };
  }

  function getSurfaceCompositePacket(target, options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "surface-composite-consumer",
      packetType: "surface_from_child_1_through_compositor",
      surfaceCompositeReady: runtime.sources.surface.valid && runtime.landNodes.length > 0,
      surfaceHabitabilityIsSource: true,
      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath(),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),
      nodes: compact ? runtime.landNodes.map(compactNode) : runtime.landNodes.map(clone),
      rawParcelVisibilityHeld: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getHydrationCompositePacket(target, options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "hydration-composite-consumer",
      packetType: "hydration_from_child_2_through_compositor",
      hydrationCompositeReady: runtime.sources.hydration.valid,
      continentMask: getContinentMask({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),
      nodes: compact ? runtime.hydrationNodes.map(compactNode) : runtime.hydrationNodes.map(clone),
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getSixthSenseCompositePacket(target, options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "sixth-sense-consumer",
      packetType: "sixth_sense_surface_hydration_edge_relationship_packet",
      sixthSenseCompositeReady: compositorPass(),
      relationshipFormula: "surface-habitability + hydration + hydration-edge = unified landform expression",
      unifiedLandformPacket: getUnifiedLandformPacket(target || "sixth-sense-unified", { compact: true }),
      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(clone),
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getCarrierReceivePacket(target, options) {
    refresh();

    return {
      contract: CONTRACT,
      target: target || "audralia-runtime-carrier",
      packetType: "surface_source_bound_compositor_to_runtime_carrier_packet",
      carrierReceivePacketReady: compositorPass(),

      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      terrainPass: runtime.sources.surface.valid,
      hydrationPass: runtime.sources.hydration.valid,
      edgePass: runtime.sources.edge.valid,
      compositorPass: compositorPass(),

      requiredCarrierPosture: "compositor_first_runtime_expression",
      surfaceCompositePacket: getSurfaceCompositePacket(target || "carrier-surface", { compact: true }),
      hydrationCompositePacket: getHydrationCompositePacket(target || "carrier-hydration", { compact: true }),
      sixthSenseCompositePacket: getSixthSenseCompositePacket(target || "carrier-sixth-sense", { compact: true }),
      unifiedLandformPacket: getUnifiedLandformPacket(target || "carrier-unified", { compact: Boolean(options && options.compact) }),

      rawParcelVisibilityAllowedInLatticeOnly: true,
      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,
      finalVisualPassClaim: false
    };
  }

  function getChildReceivePacket(target, options) {
    return {
      contract: CONTRACT,
      target: target || "unassigned-child-consumer",
      childReceivePacketReady: true,
      childType: CHILD_TYPE,
      status: status(),
      carrierReceivePacket: getCarrierReceivePacket(target || "child-receive-carrier", options || { compact: true }),
      finalVisualPassClaim: false
    };
  }

  function publishGlobals() {
    if (typeof window === "undefined") return;

    window.AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_STATUS = {
      contract: CONTRACT,
      childType: CHILD_TYPE,
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,
      terrainPass: runtime.sources.surface.valid,
      hydrationPass: runtime.sources.hydration.valid,
      edgePass: runtime.sources.edge.valid,
      compositorPass: compositorPass(),
      landNodeCount: runtime.landNodes.length,
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,
      finalVisualPassClaim: false
    };

    window.AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_PACKET = {
      contract: CONTRACT,
      unifiedLandformPacketReady: compositorPass(),
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,
      coastlinePath: runtime.coastlinePath,
      nodes: runtime.nodes.map(compactNode),
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    childType: CHILD_TYPE,

    refresh: refresh,
    status: status,
    getUnifiedLandformPacket: getUnifiedLandformPacket,
    getContinentMask: getContinentMask,
    getElevationField: getElevationField,
    getSummitInfluenceField: getSummitInfluenceField,
    getCoastlinePath: getCoastlinePath,
    getHydrationFlowField: getHydrationFlowField,
    getEdgeRelationshipField: getEdgeRelationshipField,
    getSurfaceCompositePacket: getSurfaceCompositePacket,
    getHydrationCompositePacket: getHydrationCompositePacket,
    getSixthSenseCompositePacket: getSixthSenseCompositePacket,
    getCarrierReceivePacket: getCarrierReceivePacket,
    getChildReceivePacket: getChildReceivePacket
  });

  if (typeof window !== "undefined") {
    window.AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_CHILD = API;
    window.AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_CHILD = API;
    window.AUDRALIA_G2_GRATITUDE_LANDFORM_COMPOSITOR_CHILD = API;

    refresh();
  }
})();
