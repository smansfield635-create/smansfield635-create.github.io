// /assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js
// AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_THREE_CHILD_CONSUMPTION_TNT_v1
// Full-file replacement.
// Scope: Gratitude child 4 of 4.
// Purpose: consume exactly three upstream Gratitude children—surface-habitability, hydration, hydration-edge—and publish one unified packet to the runtime carrier.
// Does not consume the legacy broad /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js as active authority.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_THREE_CHILD_CONSUMPTION_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js";
  var CHILD_TYPE = "gratitude_landform_compositor_child_4_of_4";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var SEA_LEVEL_DATUM = 0.32;

  var SURFACE_GLOBALS = [
    "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD",
    "AUDRALIA_G2_GRATITUDE_SURFACE_HABITABILITY_CHILD",
    "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_CHILD"
  ];

  var HYDRATION_GLOBALS = [
    "AUDRALIA_GRATITUDE_HYDRATION_CHILD",
    "AUDRALIA_G2_GRATITUDE_HYDRATION_CHILD",
    "AUDRALIA_GRATITUDE_HYDRATION_SCOPE_CHILD"
  ];

  var EDGE_GLOBALS = [
    "AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD",
    "AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD",
    "AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD"
  ];

  var runtime = {
    surface: sourceState("surface-habitability", SURFACE_GLOBALS),
    hydration: sourceState("hydration", HYDRATION_GLOBALS),
    edge: sourceState("hydration-edge", EDGE_GLOBALS),
    nodes: [],
    landNodes: [],
    boundaryNodes: [],
    hydrationNodes: [],
    edgeNodes: [],
    coastlinePath: null,
    hydrationFlowField: null,
    edgeRelationshipField: null,
    failures: [],
    warnings: [],
    refreshedAt: null,
    refreshCount: 0
  };

  function sourceState(name, globals) {
    return {
      name: name,
      globals: globals,
      api: null,
      detected: false,
      apiComplete: false,
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

  function deepClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function firstGlobal(names) {
    if (typeof window === "undefined") return null;

    for (var i = 0; i < names.length; i += 1) {
      if (window[names[i]]) return window[names[i]];
    }

    return null;
  }

  function safeCall(api, method, fallback) {
    if (!api || typeof api[method] !== "function") return fallback || null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 3));
    } catch (error) {
      runtime.warnings.push(method + "_exception:" + (error && error.message ? error.message : String(error)));
      return fallback || null;
    }
  }

  function collect(value, keys) {
    if (!value) return [];

    for (var i = 0; i < keys.length; i += 1) {
      if (Array.isArray(value[keys[i]])) return value[keys[i]];
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

  function mergeList(base, list) {
    if (!Array.isArray(list)) return;

    list.forEach(function (item) {
      var index = seatIndexOf(item);
      if (!Number.isFinite(index) || !base[index]) return;
      Object.assign(base[index], item);
    });
  }

  function sourceNodeId(x, y) {
    return "GRATITUDE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
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

  function blankNodes() {
    var nodes = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var index = y * RADIAL_NODES + x;

        nodes.push({
          sourceNodeId: sourceNodeId(x, y),
          compositeNodeId: compositeNodeId(x, y),
          seatIndex: index,
          nodeIndex: index,
          seatKey: seatKey(x, y),
          x: x,
          y: y,
          continentMembership: false,
          terrainClass: "outside_context",
          hydrationClass: "outside_context",
          elevation: 0,
          seaLevelDatum: SEA_LEVEL_DATUM
        });
      }
    }

    return nodes;
  }

  function readSource(state, requiredMethods, mapPlan) {
    state.api = firstGlobal(state.globals);
    state.detected = Boolean(state.api);
    state.apiComplete = false;
    state.status = null;
    state.receivePacket = null;
    state.maps = {};

    if (!state.api) {
      state.failureReason = state.name + " child missing";
      return false;
    }

    state.apiComplete = requiredMethods.every(function (method) {
      return typeof state.api[method] === "function";
    });

    if (!state.apiComplete) {
      state.failureReason = state.name + " child API incomplete";
      return false;
    }

    state.status = safeCall(state.api, "status", null);
    state.receivePacket = safeCall(state.api, "getChildReceivePacket", null, "landform-compositor", { compact: false });

    mapPlan.forEach(function (entry) {
      state.maps[entry.key] = safeCall(state.api, entry.method, null, { compact: false });
    });

    state.failureReason = "";
    return true;
  }

  function readAllSources() {
    runtime.failures = [];
    runtime.warnings = [];

    var surfaceOk = readSource(
      runtime.surface,
      ["status"],
      [
        { key: "surfaceMap", method: "getSurfaceMap" },
        { key: "elevationField", method: "getElevationField" },
        { key: "summitField", method: "getSummitInfluenceField" },
        { key: "nodeMap", method: "getNodeMap" },
        { key: "packet", method: "getSurfaceHabitabilityBlueprintPacket" }
      ]
    );

    var hydrationOk = readSource(
      runtime.hydration,
      ["status"],
      [
        { key: "hydrationMap", method: "getHydrationMap" },
        { key: "waterPacket", method: "getWaterBehaviorPacket" },
        { key: "flowField", method: "getHydrationFlowField" },
        { key: "riverStreamMap", method: "getRiverStreamMap" },
        { key: "marshWetlandMap", method: "getMarshWetlandMap" }
      ]
    );

    var edgeOk = readSource(
      runtime.edge,
      ["status"],
      [
        { key: "edgeMap", method: "getHydrationEdgeMap" },
        { key: "waterPacket", method: "getWaterBehaviorPacket" },
        { key: "materialMap", method: "getMaterialEdgeMap" },
        { key: "beachMap", method: "getBeachMap" },
        { key: "cliffMap", method: "getCliffMap" },
        { key: "waterfallMap", method: "getWaterfallMap" }
      ]
    );

    if (!surfaceOk) runtime.failures.push(runtime.surface.failureReason);
    if (!hydrationOk) runtime.failures.push(runtime.hydration.failureReason);
    if (!edgeOk) runtime.failures.push(runtime.edge.failureReason);

    return surfaceOk && hydrationOk && edgeOk;
  }

  function mergeSourceData() {
    var nodes = blankNodes();

    mergeList(nodes, collect(runtime.surface.maps.surfaceMap, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.surface.maps.elevationField, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.surface.maps.summitField, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.surface.maps.nodeMap, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.surface.maps.packet, ["nodes", "seats", "datumNodes"]));

    mergeList(nodes, collect(runtime.hydration.maps.hydrationMap, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.hydration.maps.waterPacket, ["nodes", "waterNodes", "seats"]));
    mergeList(nodes, collect(runtime.hydration.maps.flowField, ["nodes", "flowNodes", "seats"]));
    mergeList(nodes, collect(runtime.hydration.maps.riverStreamMap, ["nodes", "seats"]));
    mergeList(nodes, collect(runtime.hydration.maps.marshWetlandMap, ["nodes", "seats"]));

    mergeList(nodes, collect(runtime.edge.maps.edgeMap, ["nodes", "edgeNodes", "edges"]));
    mergeList(nodes, collect(runtime.edge.maps.waterPacket, ["nodes", "waterNodes"]));
    mergeList(nodes, collect(runtime.edge.maps.materialMap, ["nodes", "materialNodes"]));
    mergeList(nodes, collect(runtime.edge.maps.beachMap, ["nodes"]));
    mergeList(nodes, collect(runtime.edge.maps.cliffMap, ["nodes"]));
    mergeList(nodes, collect(runtime.edge.maps.waterfallMap, ["nodes"]));

    return nodes;
  }

  function neighbors(index) {
    var x = index % RADIAL_NODES;
    var y = Math.floor(index / RADIAL_NODES);
    var result = [];

    for (var dy = -1; dy <= 1; dy += 1) {
      for (var dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        var nx = x + dx;
        var ny = y + dy;
        if (nx >= 0 && nx < RADIAL_NODES && ny >= 0 && ny < FIBONACCI_BANDS) {
          result.push(ny * RADIAL_NODES + nx);
        }
      }
    }

    return result;
  }

  function landValue(node) {
    var terrainClass = textOf(node, ["terrainClass"], "");
    var primaryCategory = textOf(node, ["primaryCategory"], "");
    var elevation = valueOf(node, ["unifiedElevation", "smoothedElevation", "surfaceExpressionDatum", "elevation"], 0);

    return Boolean(
      node.continentMembership === true ||
      node.land === true ||
      node.aboveSeaLevelMass === true ||
      node.mergedLandformMembership === true ||
      node.continentId === "gratitude" ||
      elevation > SEA_LEVEL_DATUM ||
      (terrainClass && terrainClass.indexOf("outside") < 0 && primaryCategory !== "outside_continent")
    );
  }

  function composeNodes(raw) {
    var nodes = raw.map(function (node, index) {
      var x = index % RADIAL_NODES;
      var y = Math.floor(index / RADIAL_NODES);
      var elevation = valueOf(node, ["unifiedElevation", "smoothedElevation", "surfaceExpressionDatum", "elevation"], landValue(node) ? 0.45 : 0);
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
        valueOf(node, ["sandPressure"], 0)
      );

      return {
        compositeNodeId: compositeNodeId(x, y),
        sourceNodeId: textOf(node, ["sourceNodeId", "nodeId"], sourceNodeId(x, y)),
        seatIndex: index,
        nodeIndex: index,
        seatKey: textOf(node, ["seatKey"], seatKey(x, y)),
        x: x,
        y: y,

        continentMembership: landValue(node),
        terrainClass: textOf(node, ["terrainClass"], landValue(node) ? "surface_land" : "outside_context"),
        hydrationClass: textOf(node, ["hydrationClass"], "held_or_dry"),
        primaryCategory: textOf(node, ["primaryCategory"], landValue(node) ? "surface" : "outside_context"),

        elevation: round(elevation, 4),
        unifiedElevation: round(elevation, 4),
        seaLevelDatum: SEA_LEVEL_DATUM,
        aboveSeaLevelMass: elevation >= SEA_LEVEL_DATUM,

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
    });

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
      node.unifiedElevation = round(clamp((elevationTotal / elevationCount) * 0.76 + node.elevation * 0.24, 0, 1), 4);
      node.mergedLandformMembership = Boolean(node.continentMembership && (node.massContinuityWeight > 0.16 || node.aboveSeaLevelMass));
      node.boundaryParcel = Boolean(node.mergedLandformMembership && (node.massContinuityWeight < 0.88 || node.coastInfluence > 0.24 || node.edgeInfluence > 0.30));
      node.coastlineParcel = Boolean(node.boundaryParcel && (node.coastInfluence > 0.18 || node.massContinuityWeight < 0.72 || node.edgeInfluence > 0.36));
      node.interiorParcel = Boolean(node.mergedLandformMembership && !node.coastlineParcel);
      node.hydrationFlowParcel = Boolean(node.hydrationInfluence > 0.18 || /river|stream|gully|pool|marsh|wetland|waterfall/.test(node.waterBehavior + node.edgeBehavior));
      node.edgeRelationshipParcel = Boolean(node.coastlineParcel || /beach|cliff|waterfall|shelf|delta|sediment|rock/.test(node.edgeBehavior + node.primaryBehavior));
      node.summitAnchorParcel = Boolean(node.summitInfluence > 0.30);
      Object.freeze(node);
    });

    return nodes;
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
        x: node.x,
        y: node.y,
        lon: p.lon,
        lat: p.lat,
        edgeBehavior: node.edgeBehavior,
        materialBehavior: node.materialBehavior,
        finalVisualPassClaim: false
      };
    });

    if (points.length) points.push(deepClone(points[0]));

    return Object.freeze({
      pathId: "GRATITUDE-UNIFIED-COASTLINE-PATH-01",
      pathReady: true,
      pointCount: points.length,
      points: Object.freeze(points),
      coastlineIsUnified: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    });
  }

  function buildFields() {
    runtime.landNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.mergedLandformMembership; }));
    runtime.boundaryNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.boundaryParcel; }));
    runtime.hydrationNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.hydrationFlowParcel; }));
    runtime.edgeNodes = Object.freeze(runtime.nodes.filter(function (node) { return node.edgeRelationshipParcel; }));
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

  function refresh() {
    runtime.refreshCount += 1;
    runtime.refreshedAt = new Date().toISOString();

    readAllSources();
    runtime.nodes = Object.freeze(composeNodes(mergeSourceData()));
    buildFields();
    publishGlobals();

    return runtime;
  }

  function sourceReceipt(state) {
    return {
      name: state.name,
      detected: state.detected,
      apiComplete: state.apiComplete,
      failureReason: state.failureReason,
      globals: state.globals.slice()
    };
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

      surfaceHabitability: sourceReceipt(runtime.surface),
      hydration: sourceReceipt(runtime.hydration),
      hydrationEdge: sourceReceipt(runtime.edge),

      unifiedLandformScope256Active: true,
      nodeCount: NODE_COUNT,
      landNodeCount: runtime.landNodes.length,
      boundaryNodeCount: runtime.boundaryNodes.length,
      hydrationFlowCount: runtime.hydrationNodes.length,
      edgeRelationshipCount: runtime.edgeNodes.length,
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
      deployMarker: "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_THREE_CHILD_CONSUMPTION_DEPLOY_MARKER_v1"
    };
  }

  function getContinentMask(options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      maskReady: runtime.landNodes.length > 0,
      maskType: "four_child_unified_continent_mask",
      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(deepClone),
      rawParcelVisibilityHeld: true,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getCoastlinePath() {
    refresh();
    return deepClone(runtime.coastlinePath);
  }

  function getElevationField(options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      elevationFieldReady: runtime.landNodes.length > 0,
      nodes: compact ? runtime.landNodes.map(compactNode) : runtime.landNodes.map(deepClone),
      surfaceHabitabilityIsSource: true,
      finalVisualPassClaim: false
    };
  }

  function getHydrationFlowField(options) {
    refresh();
    return deepClone(runtime.hydrationFlowField);
  }

  function getEdgeRelationshipField(options) {
    refresh();
    return deepClone(runtime.edgeRelationshipField);
  }

  function getUnifiedLandformPacket(target, options) {
    refresh();
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "unassigned-unified-landform-consumer",
      packetType: "four_child_unified_landform_packet",
      unifiedLandformPacketReady: runtime.landNodes.length > 0,

      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      surfaceHabitabilityConsumed: runtime.surface.detected,
      hydrationConsumed: runtime.hydration.detected,
      hydrationEdgeConsumed: runtime.edge.detected,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath({ compact: true }),
      elevationField: getElevationField({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),

      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(deepClone),

      carrierMayConsume: true,
      carrierInventsLandform: false,
      finalVisualPassClaim: false
    };
  }

  function getSurfaceCompositePacket(target, options) {
    refresh();
    return {
      contract: CONTRACT,
      target: target || "surface-composite-consumer",
      packetType: "surface_from_child_1_through_compositor",
      surfaceCompositeReady: runtime.landNodes.length > 0,
      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath(),
      elevationField: getElevationField({ compact: true }),
      nodes: Boolean(options && options.compact) ? runtime.landNodes.map(compactNode) : runtime.landNodes.map(deepClone),
      rawParcelVisibilityHeld: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getHydrationCompositePacket(target, options) {
    refresh();
    return {
      contract: CONTRACT,
      target: target || "hydration-composite-consumer",
      packetType: "hydration_from_child_2_through_compositor",
      hydrationCompositeReady: runtime.hydrationNodes.length > 0,
      continentMask: getContinentMask({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),
      nodes: Boolean(options && options.compact) ? runtime.hydrationNodes.map(compactNode) : runtime.hydrationNodes.map(deepClone),
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getSixthSenseCompositePacket(target, options) {
    refresh();
    return {
      contract: CONTRACT,
      target: target || "sixth-sense-consumer",
      packetType: "sixth_sense_four_child_relationship_packet",
      sixthSenseCompositeReady: runtime.landNodes.length > 0,
      relationshipFormula: "surface-habitability + hydration + hydration-edge = unified landform expression",
      unifiedLandformPacket: getUnifiedLandformPacket(target || "sixth-sense-unified", { compact: true }),
      nodes: Boolean(options && options.compact) ? runtime.nodes.map(compactNode) : runtime.nodes.map(deepClone),
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getCarrierReceivePacket(target, options) {
    refresh();

    return {
      contract: CONTRACT,
      target: target || "audralia-runtime-carrier",
      packetType: "four_child_compositor_to_runtime_carrier_packet",
      carrierReceivePacketReady: runtime.landNodes.length > 0,

      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      requiredCarrierPosture: "compositor_first_runtime_expression",
      surfaceCompositePacket: getSurfaceCompositePacket(target || "carrier-surface", { compact: true }),
      hydrationCompositePacket: getHydrationCompositePacket(target || "carrier-hydration", { compact: true }),
      sixthSenseCompositePacket: getSixthSenseCompositePacket(target || "carrier-sixth-sense", { compact: true }),
      unifiedLandformPacket: getUnifiedLandformPacket(target || "carrier-unified", { compact: Boolean(options && options.compact) }),

      rawParcelVisibilityAllowedInLatticeOnly: true,
      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
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
      landNodeCount: runtime.landNodes.length,
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,
      finalVisualPassClaim: false
    };

    window.AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_PACKET = {
      contract: CONTRACT,
      unifiedLandformPacketReady: runtime.landNodes.length > 0,
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
