// /assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js
// AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_TNT_v1
// Full-file creation.
// Scope: downstream Gratitude unified landform compositor.
// Purpose: merge terrain parcels, summit influence, hydration, edge behavior, and material behavior into one composed landform packet.
// Owns: parcel-to-mass composition, unified coastline path, blended elevation field, summit influence field, hydration flow projection,
// edge relationship projection, Surface/Hydration/Sixth Sense composite packets, carrier receive packet.
// Does not own: HTML, script tags, cache keys, carrier drawing, source terrain authority, source hydration authority,
// hydration-edge behavior authority, final terrain pass, final hydration pass, final composite pass, final visual pass,
// atmosphere, climate, ecology, settlement, or urban activation.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_NEWS_v1";
  var CCR = "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_CCR_v1";

  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.landform-compositor.child.js";
  var CHILD_TYPE = "gratitude_unified_landform_compositor_child";
  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";

  var TERRAIN_GLOBAL = "AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD";
  var EDGE_GLOBALS = Object.freeze([
    "AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD",
    "AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD",
    "AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD"
  ]);

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var SEA_LEVEL_DATUM_DEFAULT = 0.32;
  var TAU = Math.PI * 2;

  var FALLBACK_SUMMITS = Object.freeze([
    Object.freeze({ id: "summit_01", name: "First Summit of Gratitude", x: 7.10, y: 5.20, elevationPressure: 0.92 }),
    Object.freeze({ id: "summit_02", name: "Second Summit of Gratitude", x: 8.55, y: 5.05, elevationPressure: 1.00 }),
    Object.freeze({ id: "summit_03", name: "Third Summit of Gratitude", x: 9.95, y: 5.55, elevationPressure: 0.90 }),
    Object.freeze({ id: "summit_04", name: "Fourth Summit of Gratitude", x: 6.40, y: 7.35, elevationPressure: 0.84 }),
    Object.freeze({ id: "summit_05", name: "Fifth Summit of Gratitude", x: 8.45, y: 7.55, elevationPressure: 1.08 }),
    Object.freeze({ id: "summit_06", name: "Sixth Summit of Gratitude", x: 10.85, y: 7.75, elevationPressure: 0.86 }),
    Object.freeze({ id: "summit_07", name: "Seventh Summit of Gratitude", x: 7.00, y: 9.72, elevationPressure: 0.80 }),
    Object.freeze({ id: "summit_08", name: "Eighth Summit of Gratitude", x: 9.35, y: 9.95, elevationPressure: 0.86 }),
    Object.freeze({ id: "summit_09", name: "Ninth Summit of Gratitude", x: 10.35, y: 10.85, elevationPressure: 0.88 })
  ]);

  var runtime = {
    terrainApi: null,
    edgeApi: null,

    terrainDetected: false,
    terrainApiComplete: false,
    edgeDetected: false,
    edgeApiComplete: false,
    edgeBehaviorInputHeld: true,

    terrainStatus: null,
    edgeStatus: null,

    surfaceMap: null,
    continentMap: null,
    nodeMap: null,
    elevationMap: null,
    hydrationMap: null,
    summitMap: null,
    coastMap: null,
    terrainDatumPacket: null,
    streamRegistry: null,

    hydrationEdgeMap: null,
    waterBehaviorPacket: null,
    materialEdgeMap: null,

    sourceNodes: [],
    compositeNodes: [],
    landNodes: [],
    coastlineNodes: [],
    boundaryNodes: [],
    summitInfluenceNodes: [],
    hydrationFlowNodes: [],
    edgeRelationshipNodes: [],

    continentMask: null,
    elevationField: null,
    coastlinePath: null,
    summitInfluenceField: null,
    hydrationFlowField: null,
    edgeRelationshipField: null,

    counts: {},
    warnings: [],
    failures: [],

    refreshedAt: null,
    refreshCount: 0
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

  function deepClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function valueOf(source, keys, fallback) {
    if (!source) return fallback;

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];

      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        var number = Number(source[key]);
        if (Number.isFinite(number)) return number;
      }
    }

    return fallback;
  }

  function textOf(source, keys, fallback) {
    if (!source) return fallback || "";

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];

      if (source[key] !== undefined && source[key] !== null && String(source[key]).length) {
        return String(source[key]);
      }
    }

    return fallback || "";
  }

  function boolOf(source, keys, fallback) {
    if (!source) return Boolean(fallback);

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (source[key] === true) return true;
      if (source[key] === false) return false;
    }

    return Boolean(fallback);
  }

  function nodeId(x, y) {
    return "LANDFORM-COMPOSITE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function sourceNodeId(x, y) {
    return "GRATITUDE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -142 + (clamp(x, -2, 18) / 15) * 108,
      lat: 56 - (clamp(y, -2, 18) / 15) * 112
    };
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function collectList(map, keys) {
    if (!map) return [];

    for (var i = 0; i < keys.length; i += 1) {
      var list = map[keys[i]];
      if (Array.isArray(list)) return list;
    }

    return [];
  }

  function normalizeSeatIndex(item) {
    var seatIndex = valueOf(item, ["seatIndex", "nodeIndex", "index"], null);
    if (Number.isFinite(seatIndex)) return clamp(Math.round(seatIndex), 0, NODE_COUNT - 1);

    var x = valueOf(item, ["x", "radial", "centerX"], null);
    var y = valueOf(item, ["y", "band", "centerY"], null);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      return clamp(Math.round(y), 0, FIBONACCI_BANDS - 1) * RADIAL_NODES +
        clamp(Math.round(x), 0, RADIAL_NODES - 1);
    }

    var key = textOf(item, ["seatKey"], "");
    var match = key.match(/G-(\d+)-(\d+)/);

    if (match) {
      return clamp(Number(match[1]), 0, FIBONACCI_BANDS - 1) * RADIAL_NODES +
        clamp(Number(match[2]), 0, RADIAL_NODES - 1);
    }

    return null;
  }

  function mergeListIntoBase(base, list) {
    toArray(list).forEach(function (item) {
      var index = normalizeSeatIndex(item);
      if (!Number.isFinite(index) || !base[index]) return;
      Object.assign(base[index], item);
    });
  }

  function emptySourceNodes() {
    var nodes = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var index = y * RADIAL_NODES + x;

        nodes.push({
          sourceNodeId: sourceNodeId(x, y),
          nodeId: sourceNodeId(x, y),
          nodeIndex: index,
          seatIndex: index,
          seatKey: seatKey(x, y),
          x: x,
          y: y,
          continentMembership: false,
          continentId: null,
          continentName: null,
          terrainClass: "outside_gratitude_field",
          hydrationClass: "outside_gratitude_field",
          primaryCategory: "outside_continent",
          elevation: 0,
          seaLevelDatum: SEA_LEVEL_DATUM_DEFAULT
        });
      }
    }

    return nodes;
  }

  function findEdgeApi() {
    if (typeof window === "undefined") return null;

    for (var i = 0; i < EDGE_GLOBALS.length; i += 1) {
      if (window[EDGE_GLOBALS[i]]) return window[EDGE_GLOBALS[i]];
    }

    return null;
  }

  function readTerrainApi() {
    runtime.terrainApi = typeof window !== "undefined" ? window[TERRAIN_GLOBAL] || null : null;
    runtime.terrainDetected = Boolean(runtime.terrainApi);
    runtime.terrainApiComplete = Boolean(
      runtime.terrainApi &&
      typeof runtime.terrainApi.status === "function" &&
      (
        typeof runtime.terrainApi.getSurfaceMap === "function" ||
        typeof runtime.terrainApi.getContinentMap === "function" ||
        typeof runtime.terrainApi.getNodeMap === "function"
      )
    );

    runtime.terrainStatus = null;
    runtime.surfaceMap = null;
    runtime.continentMap = null;
    runtime.nodeMap = null;
    runtime.elevationMap = null;
    runtime.hydrationMap = null;
    runtime.summitMap = null;
    runtime.coastMap = null;
    runtime.terrainDatumPacket = null;
    runtime.streamRegistry = null;

    if (!runtime.terrainDetected) {
      runtime.failures.push("terrain_child_missing");
      return;
    }

    if (!runtime.terrainApiComplete) {
      runtime.failures.push("terrain_child_api_incomplete");
      return;
    }

    try {
      var api = runtime.terrainApi;

      runtime.terrainStatus = typeof api.status === "function" ? api.status() : null;
      runtime.surfaceMap = typeof api.getSurfaceMap === "function" ? api.getSurfaceMap({ compact: false }) : null;
      runtime.continentMap = typeof api.getContinentMap === "function" ? api.getContinentMap({ compact: false }) : runtime.surfaceMap;
      runtime.nodeMap = typeof api.getNodeMap === "function" ? api.getNodeMap({ compact: false }) : null;
      runtime.elevationMap = typeof api.getElevationMap === "function" ? api.getElevationMap({ compact: false }) : null;
      runtime.hydrationMap = typeof api.getHydrationMap === "function" ? api.getHydrationMap({ compact: false }) : null;
      runtime.summitMap = typeof api.getSummitMap === "function" ? api.getSummitMap({ compact: false }) : null;
      runtime.coastMap = typeof api.getCoastMap === "function" ? api.getCoastMap({ compact: false }) : null;
      runtime.terrainDatumPacket = typeof api.getTerrainDatumPacket === "function"
        ? api.getTerrainDatumPacket("gratitude-landform-compositor-child", { compact: false })
        : null;
      runtime.streamRegistry = typeof api.getStreamRegistry === "function" ? api.getStreamRegistry({ compact: false }) : null;
    } catch (error) {
      runtime.failures.push("terrain_child_read_exception:" + (error && error.message ? error.message : String(error)));
    }
  }

  function readEdgeApi() {
    runtime.edgeApi = findEdgeApi();
    runtime.edgeDetected = Boolean(runtime.edgeApi);
    runtime.edgeApiComplete = Boolean(
      runtime.edgeApi &&
      typeof runtime.edgeApi.status === "function" &&
      typeof runtime.edgeApi.getHydrationEdgeMap === "function"
    );
    runtime.edgeBehaviorInputHeld = !runtime.edgeApiComplete;

    runtime.edgeStatus = null;
    runtime.hydrationEdgeMap = null;
    runtime.waterBehaviorPacket = null;
    runtime.materialEdgeMap = null;

    if (!runtime.edgeDetected) {
      runtime.warnings.push("hydration_edge_child_missing_compositor_uses_terrain_fallback");
      return;
    }

    if (!runtime.edgeApiComplete) {
      runtime.warnings.push("hydration_edge_child_api_incomplete_compositor_uses_terrain_fallback");
      return;
    }

    try {
      var api = runtime.edgeApi;

      runtime.edgeStatus = typeof api.status === "function" ? api.status() : null;
      runtime.hydrationEdgeMap = typeof api.getHydrationEdgeMap === "function" ? api.getHydrationEdgeMap({ compact: false }) : null;
      runtime.waterBehaviorPacket = typeof api.getWaterBehaviorPacket === "function"
        ? api.getWaterBehaviorPacket("gratitude-landform-compositor-child", { compact: false })
        : null;
      runtime.materialEdgeMap = typeof api.getMaterialEdgeMap === "function" ? api.getMaterialEdgeMap({ compact: false }) : null;
    } catch (error) {
      runtime.warnings.push("hydration_edge_child_read_exception:" + (error && error.message ? error.message : String(error)));
    }
  }

  function buildSourceNodes() {
    var base = emptySourceNodes();

    mergeListIntoBase(base, collectList(runtime.nodeMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.surfaceMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.continentMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.elevationMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.hydrationMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.hydrationMap, ["seats"]));
    mergeListIntoBase(base, collectList(runtime.coastMap, ["nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.terrainDatumPacket, ["datumNodes", "nodes", "seats"]));
    mergeListIntoBase(base, collectList(runtime.hydrationEdgeMap, ["nodes", "edgeNodes", "edges"]));
    mergeListIntoBase(base, collectList(runtime.waterBehaviorPacket, ["waterNodes", "nodes"]));
    mergeListIntoBase(base, collectList(runtime.materialEdgeMap, ["nodes", "materialNodes"]));

    runtime.sourceNodes = base;
    return base;
  }

  function getSummits() {
    var summits = collectList(runtime.summitMap, ["summits", "summitNodes"]);

    if (!summits.length) return FALLBACK_SUMMITS.map(deepClone);

    return summits.map(function (summit, index) {
      return {
        id: textOf(summit, ["id", "summitId", "nodeId"], "summit_" + String(index + 1).padStart(2, "0")),
        name: textOf(summit, ["name", "summitName"], "Summit of Gratitude " + (index + 1)),
        x: valueOf(summit, ["x", "centerX"], 8),
        y: valueOf(summit, ["y", "centerY"], 8),
        elevationPressure: valueOf(summit, ["elevationPressure", "summitPressure", "summitInfluence"], 0.84)
      };
    });
  }

  function landMembership(source) {
    var terrainClass = textOf(source, ["terrainClass"], "");
    var primaryCategory = textOf(source, ["primaryCategory"], "");
    var aboveSea = boolOf(source, ["aboveSeaLevelMass"], false);

    return Boolean(
      source.continentMembership === true ||
      source.land === true ||
      source.continentId === CONTINENT_ID ||
      aboveSea ||
      (
        terrainClass &&
        terrainClass !== "outside_gratitude_field" &&
        terrainClass !== "outside_context_datum" &&
        primaryCategory !== "outside_continent"
      )
    );
  }

  function summitInfluenceAt(x, y, summits) {
    var total = 0;
    var max = 0;
    var nearest = null;
    var nearestDistance = Infinity;

    for (var i = 0; i < summits.length; i += 1) {
      var summit = summits[i];
      var d = distance(x + 0.5, y + 0.5, summit.x, summit.y);
      var influence = clamp(1 - d / 2.15, 0, 1) * clamp(summit.elevationPressure || 0.84, 0, 1.2);

      total += influence;
      max = Math.max(max, influence);

      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = summit;
      }
    }

    return {
      total: clamp(total / 2.35, 0, 1),
      max: clamp(max, 0, 1),
      nearest: nearest,
      nearestDistance: nearestDistance
    };
  }

  function neighborIndexes(index) {
    var x = index % RADIAL_NODES;
    var y = Math.floor(index / RADIAL_NODES);
    var indexes = [];

    for (var dy = -1; dy <= 1; dy += 1) {
      for (var dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;

        var nx = x + dx;
        var ny = y + dy;

        if (nx < 0 || nx >= RADIAL_NODES || ny < 0 || ny >= FIBONACCI_BANDS) continue;

        indexes.push(ny * RADIAL_NODES + nx);
      }
    }

    return indexes;
  }

  function baseCompositeNode(source, summits) {
    var index = normalizeSeatIndex(source);
    if (!Number.isFinite(index)) index = valueOf(source, ["nodeIndex", "seatIndex"], 0);

    var x = index % RADIAL_NODES;
    var y = Math.floor(index / RADIAL_NODES);

    var land = landMembership(source);
    var seaLevelDatum = valueOf(source, ["seaLevelDatum"], SEA_LEVEL_DATUM_DEFAULT);
    var elevation = valueOf(source, ["surfaceExpressionDatum", "elevation", "baseElevation"], land ? 0.44 : 0);
    var terrainClass = textOf(source, ["terrainClass"], land ? "interior_plain" : "outside_gratitude_field");
    var hydrationClass = textOf(source, ["hydrationClass"], land ? "dry_land" : "outside_gratitude_field");
    var primaryCategory = textOf(source, ["primaryCategory"], land ? "surface" : "outside_continent");

    var ridgeInfluence = valueOf(source, ["ridgePressure"], boolOf(source, ["ridgeStatus"], false) ? 0.64 : 0);
    var basinInfluence = valueOf(source, ["basinPressure"], boolOf(source, ["basinStatus"], false) ? 0.64 : 0);
    var valleyInfluence = valueOf(source, ["valleyPressure"], boolOf(source, ["valleyStatus"], false) ? 0.58 : 0);
    var coastInfluence = valueOf(source, ["coastPressure"], boolOf(source, ["coastEligible"], false) ? 0.58 : 0);
    var shelfInfluence = valueOf(source, ["shelfPressure"], primaryCategory === "shelf" ? 0.58 : 0);
    var hydrationInfluence = valueOf(source, ["hydrationPressure", "hydrationDepth", "wetnessPressure"], 0);
    var edgeInfluence = valueOf(source, ["edgePressure", "beachPermission", "cliffPermission", "waterfallPermission", "shelfPermission"], 0);
    var materialInfluence = Math.max(
      valueOf(source, ["materialInfluence"], 0),
      valueOf(source, ["sedimentPressure"], 0),
      valueOf(source, ["rockPressure"], 0),
      valueOf(source, ["sandPressure"], 0),
      valueOf(source, ["mineralPressure"], 0),
      valueOf(source, ["soilPressure"], 0)
    );

    var summit = summitInfluenceAt(x, y, summits);
    var aboveSeaLevelMass = Boolean(land && elevation >= seaLevelDatum - 0.018);
    var parcelWeight = land ? clamp(0.68 + summit.total * 0.18 + ridgeInfluence * 0.08 - shelfInfluence * 0.06, 0, 1) : 0;

    return {
      compositeNodeId: nodeId(x, y),
      sourceNodeId: textOf(source, ["sourceNodeId", "nodeId"], sourceNodeId(x, y)),
      seatIndex: index,
      nodeIndex: index,
      seatKey: textOf(source, ["seatKey"], seatKey(x, y)),
      x: x,
      y: y,

      continentMembership: land,
      continentId: land ? CONTINENT_ID : null,
      continentName: land ? CONTINENT_NAME : null,

      terrainClass: terrainClass,
      hydrationClass: hydrationClass,
      primaryCategory: primaryCategory,

      elevation: round(elevation, 4),
      seaLevelDatum: round(seaLevelDatum, 4),
      aboveSeaLevelMass: aboveSeaLevelMass,

      parcelWeight: round(parcelWeight, 4),
      massContinuityWeight: 0,
      smoothedElevation: round(elevation, 4),
      unifiedElevation: round(elevation, 4),

      summitInfluence: round(summit.total, 4),
      summitMaxInfluence: round(summit.max, 4),
      nearestSummitId: summit.nearest ? summit.nearest.id : null,
      nearestSummitName: summit.nearest ? summit.nearest.name : null,
      nearestSummitDistance: round(summit.nearestDistance, 4),

      ridgeInfluence: round(ridgeInfluence, 4),
      basinInfluence: round(basinInfluence, 4),
      valleyInfluence: round(valleyInfluence, 4),
      coastInfluence: round(coastInfluence, 4),
      shelfInfluence: round(shelfInfluence, 4),
      hydrationInfluence: round(hydrationInfluence, 4),
      edgeInfluence: round(edgeInfluence, 4),
      materialInfluence: round(materialInfluence, 4),

      edgeBehavior: textOf(source, ["edgeBehavior"], "held_future_socket"),
      waterBehavior: textOf(source, ["waterBehavior"], "held_future_socket"),
      materialBehavior: textOf(source, ["materialBehavior"], "held_future_socket"),
      primaryBehavior: textOf(source, ["primaryBehavior"], "held_future_socket"),
      secondaryBehaviors: Array.isArray(source.secondaryBehaviors) ? source.secondaryBehaviors.slice() : [],

      mergedLandformMembership: false,
      interiorParcel: false,
      coastlineParcel: false,
      boundaryParcel: false,
      summitAnchorParcel: false,
      hydrationFlowParcel: false,
      edgeRelationshipParcel: false,

      renderAsRawParcel: false,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function applyContinuity(nodes) {
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var neighbors = neighborIndexes(i);
      var landNeighbors = 0;
      var elevationTotal = node.elevation;
      var elevationCount = 1;

      for (var n = 0; n < neighbors.length; n += 1) {
        var neighbor = nodes[neighbors[n]];

        if (neighbor && neighbor.continentMembership) {
          landNeighbors += 1;
          elevationTotal += neighbor.elevation;
          elevationCount += 1;
        }
      }

      var continuity = neighbors.length ? landNeighbors / neighbors.length : 0;
      var smoothed = elevationTotal / elevationCount;

      node.massContinuityWeight = round(continuity, 4);
      node.smoothedElevation = round(smoothed, 4);
      node.unifiedElevation = round(
        clamp(
          smoothed * 0.62 +
          node.elevation * 0.24 +
          node.summitInfluence * 0.08 +
          node.ridgeInfluence * 0.04 -
          node.basinInfluence * 0.035 -
          node.valleyInfluence * 0.020,
          0,
          1
        ),
        4
      );

      node.mergedLandformMembership = Boolean(
        node.continentMembership &&
        (
          node.aboveSeaLevelMass ||
          node.massContinuityWeight >= 0.25 ||
          node.summitInfluence >= 0.12 ||
          node.coastInfluence >= 0.20
        )
      );

      node.boundaryParcel = Boolean(
        node.mergedLandformMembership &&
        (
          node.massContinuityWeight < 0.88 ||
          node.coastInfluence > 0.38 ||
          node.shelfInfluence > 0.34 ||
          node.edgeInfluence > 0.34
        )
      );

      node.coastlineParcel = Boolean(
        node.mergedLandformMembership &&
        (
          node.coastInfluence > 0.42 ||
          node.shelfInfluence > 0.42 ||
          (node.boundaryParcel && node.massContinuityWeight < 0.72)
        )
      );

      node.interiorParcel = Boolean(
        node.mergedLandformMembership &&
        !node.coastlineParcel &&
        node.massContinuityWeight >= 0.50
      );

      node.summitAnchorParcel = Boolean(node.summitInfluence >= 0.32 || node.summitMaxInfluence >= 0.55);
      node.hydrationFlowParcel = Boolean(
        node.hydrationInfluence > 0.24 ||
        node.waterBehavior === "river_flow" ||
        node.waterBehavior === "stream_flow" ||
        node.waterBehavior === "gully_cut" ||
        node.waterBehavior === "pool_retention" ||
        node.waterBehavior === "marsh_saturation" ||
        node.waterBehavior === "wetland_retention" ||
        node.edgeBehavior === "waterfall_edge"
      );
      node.edgeRelationshipParcel = Boolean(
        node.coastlineParcel ||
        node.edgeBehavior === "beach_edge" ||
        node.edgeBehavior === "cliff_edge" ||
        node.edgeBehavior === "waterfall_edge" ||
        node.edgeBehavior === "shelf_edge" ||
        node.edgeBehavior === "delta_edge" ||
        node.edgeBehavior === "sediment_deposit" ||
        node.edgeBehavior === "rock_break"
      );

      Object.freeze(node);
    }

    return nodes;
  }

  function buildCompositeNodes() {
    var summits = getSummits();
    var sourceNodes = buildSourceNodes();
    var nodes = [];

    for (var i = 0; i < NODE_COUNT; i += 1) {
      nodes.push(baseCompositeNode(sourceNodes[i], summits));
    }

    applyContinuity(nodes);

    runtime.compositeNodes = Object.freeze(nodes);
    runtime.landNodes = Object.freeze(nodes.filter(function (node) { return node.mergedLandformMembership; }));
    runtime.coastlineNodes = Object.freeze(nodes.filter(function (node) { return node.coastlineParcel; }));
    runtime.boundaryNodes = Object.freeze(nodes.filter(function (node) { return node.boundaryParcel; }));
    runtime.summitInfluenceNodes = Object.freeze(nodes.filter(function (node) { return node.summitAnchorParcel; }));
    runtime.hydrationFlowNodes = Object.freeze(nodes.filter(function (node) { return node.hydrationFlowParcel; }));
    runtime.edgeRelationshipNodes = Object.freeze(nodes.filter(function (node) { return node.edgeRelationshipParcel; }));

    return runtime.compositeNodes;
  }

  function centroid(nodes) {
    if (!nodes.length) return { x: 8, y: 8 };

    var sx = 0;
    var sy = 0;

    nodes.forEach(function (node) {
      sx += node.x + 0.5;
      sy += node.y + 0.5;
    });

    return {
      x: sx / nodes.length,
      y: sy / nodes.length
    };
  }

  function pathPointFromNode(node) {
    var p = terrainSeatToLonLat(node.x + 0.5, node.y + 0.5);

    return {
      nodeId: node.compositeNodeId,
      sourceNodeId: node.sourceNodeId,
      x: node.x,
      y: node.y,
      lon: round(p.lon, 4),
      lat: round(p.lat, 4),
      coastlineParcel: node.coastlineParcel,
      edgeBehavior: node.edgeBehavior,
      materialBehavior: node.materialBehavior,
      finalVisualPassClaim: false
    };
  }

  function buildCoastlinePath() {
    var nodes = runtime.coastlineNodes.length ? runtime.coastlineNodes.slice() : runtime.boundaryNodes.slice();

    if (!nodes.length) {
      runtime.coastlinePath = Object.freeze({
        pathId: "GRATITUDE-UNIFIED-COASTLINE-HELD",
        pathReady: false,
        pointCount: 0,
        points: [],
        failureReason: "no coastline nodes available",
        finalVisualPassClaim: false
      });
      return runtime.coastlinePath;
    }

    var c = centroid(nodes);

    nodes.sort(function (a, b) {
      var aa = Math.atan2((a.y + 0.5) - c.y, (a.x + 0.5) - c.x);
      var bb = Math.atan2((b.y + 0.5) - c.y, (b.x + 0.5) - c.x);
      return aa - bb;
    });

    var points = nodes.map(pathPointFromNode);

    if (points.length && (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y)) {
      points.push(deepClone(points[0]));
    }

    runtime.coastlinePath = Object.freeze({
      pathId: "GRATITUDE-UNIFIED-COASTLINE-PATH-01",
      pathReady: true,
      source: "gratitude_landform_compositor_child",
      pointCount: points.length,
      centroid: { x: round(c.x, 4), y: round(c.y, 4) },
      points: Object.freeze(points),
      coastlineIsUnified: true,
      rawParcelVisibilityHeld: true,
      carrierMayConsume: true,
      carrierMayRender: true,
      finalTerrainPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.coastlinePath;
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
      primaryCategory: node.primaryCategory,
      elevation: node.elevation,
      unifiedElevation: node.unifiedElevation,
      continentMembership: node.continentMembership,
      mergedLandformMembership: node.mergedLandformMembership,
      massContinuityWeight: node.massContinuityWeight,
      parcelWeight: node.parcelWeight,
      summitInfluence: node.summitInfluence,
      nearestSummitId: node.nearestSummitId,
      coastlineParcel: node.coastlineParcel,
      boundaryParcel: node.boundaryParcel,
      interiorParcel: node.interiorParcel,
      hydrationFlowParcel: node.hydrationFlowParcel,
      edgeRelationshipParcel: node.edgeRelationshipParcel,
      edgeBehavior: node.edgeBehavior,
      waterBehavior: node.waterBehavior,
      materialBehavior: node.materialBehavior,
      renderAsRawParcel: false,
      renderAsUnifiedMass: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function compactPathPoint(point) {
    return {
      lon: point.lon,
      lat: point.lat,
      x: point.x,
      y: point.y,
      nodeId: point.nodeId,
      edgeBehavior: point.edgeBehavior,
      materialBehavior: point.materialBehavior
    };
  }

  function buildContinentMask() {
    runtime.continentMask = Object.freeze({
      contract: CONTRACT,
      maskType: "unified_gratitude_continent_mask",
      maskReady: runtime.landNodes.length > 0,
      nodeCount: NODE_COUNT,
      landParcelCount: runtime.landNodes.length,
      mergedMassNodeCount: runtime.landNodes.length,
      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,
      renderAsUnifiedMass: true,
      nodes: Object.freeze(runtime.compositeNodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          sourceNodeId: node.sourceNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          mergedLandformMembership: node.mergedLandformMembership,
          parcelWeight: node.parcelWeight,
          massContinuityWeight: node.massContinuityWeight,
          coastlineParcel: node.coastlineParcel,
          boundaryParcel: node.boundaryParcel,
          interiorParcel: node.interiorParcel,
          renderAsRawParcel: false,
          renderAsUnifiedMass: true
        };
      })),
      carrierMayConsume: true,
      carrierMayRender: true,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.continentMask;
  }

  function buildElevationField() {
    runtime.elevationField = Object.freeze({
      contract: CONTRACT,
      fieldType: "unified_elevation_field",
      elevationFieldReady: runtime.landNodes.length > 0,
      elevationComputedFromParcels: true,
      parcelsAreCalculationValues: true,
      seaLevelDatum: SEA_LEVEL_DATUM_DEFAULT,
      nodes: Object.freeze(runtime.compositeNodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          sourceNodeId: node.sourceNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          mergedLandformMembership: node.mergedLandformMembership,
          elevation: node.elevation,
          smoothedElevation: node.smoothedElevation,
          unifiedElevation: node.unifiedElevation,
          summitInfluence: node.summitInfluence,
          ridgeInfluence: node.ridgeInfluence,
          basinInfluence: node.basinInfluence,
          valleyInfluence: node.valleyInfluence,
          coastlineParcel: node.coastlineParcel,
          renderAsRawParcel: false,
          renderAsUnifiedMass: true
        };
      })),
      carrierMayConsume: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.elevationField;
  }

  function buildSummitInfluenceField() {
    runtime.summitInfluenceField = Object.freeze({
      contract: CONTRACT,
      fieldType: "nine_summit_influence_field",
      summitInfluenceIntegrated: true,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      summitInfluenceCount: runtime.summitInfluenceNodes.length,
      nodes: Object.freeze(runtime.summitInfluenceNodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          sourceNodeId: node.sourceNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          nearestSummitId: node.nearestSummitId,
          nearestSummitName: node.nearestSummitName,
          summitInfluence: node.summitInfluence,
          summitMaxInfluence: node.summitMaxInfluence,
          unifiedElevation: node.unifiedElevation,
          renderAsSummitIsland: false,
          renderAsElevationAnchor: true,
          finalVisualPassClaim: false
        };
      })),
      carrierMayConsume: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.summitInfluenceField;
  }

  function buildHydrationFlowField() {
    var flowNodes = runtime.hydrationFlowNodes.slice();

    flowNodes.sort(function (a, b) {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    var flowPathPoints = flowNodes.map(function (node) {
      var p = terrainSeatToLonLat(node.x + 0.5, node.y + 0.5);
      return {
        nodeId: node.compositeNodeId,
        sourceNodeId: node.sourceNodeId,
        x: node.x,
        y: node.y,
        lon: round(p.lon, 4),
        lat: round(p.lat, 4),
        waterBehavior: node.waterBehavior,
        edgeBehavior: node.edgeBehavior,
        hydrationInfluence: node.hydrationInfluence,
        unifiedElevation: node.unifiedElevation
      };
    });

    runtime.hydrationFlowField = Object.freeze({
      contract: CONTRACT,
      fieldType: "unified_hydration_flow_field",
      hydrationFlowFieldReady: flowNodes.length > 0,
      hydrationFollowsUnifiedLandform: true,
      hydrationDoesNotRenderAsDisconnectedBlobs: true,
      hydrationFlowCount: flowNodes.length,
      flowPaths: Object.freeze([
        Object.freeze({
          pathId: "GRATITUDE-UNIFIED-HYDRATION-FLOW-PATH-01",
          pathType: "merged_terrain_body_flow",
          pointCount: flowPathPoints.length,
          points: Object.freeze(flowPathPoints),
          carrierMayConsume: true,
          carrierMayRender: true,
          finalHydrationPassClaim: false,
          finalVisualPassClaim: false
        })
      ]),
      nodes: Object.freeze(flowNodes.map(compactNode)),
      carrierMayConsume: true,
      carrierMayRender: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.hydrationFlowField;
  }

  function buildEdgeRelationshipField() {
    runtime.edgeRelationshipField = Object.freeze({
      contract: CONTRACT,
      fieldType: "unified_edge_relationship_field",
      edgeRelationshipFieldReady: runtime.edgeRelationshipNodes.length > 0,
      edgeBehaviorInputHeld: runtime.edgeBehaviorInputHeld,
      edgeRelationshipCount: runtime.edgeRelationshipNodes.length,
      edgesModifyPerimeterAndFlowCuts: true,
      edgesDoNotFragmentContinent: true,
      nodes: Object.freeze(runtime.edgeRelationshipNodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          sourceNodeId: node.sourceNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          coastlineParcel: node.coastlineParcel,
          edgeBehavior: node.edgeBehavior,
          waterBehavior: node.waterBehavior,
          materialBehavior: node.materialBehavior,
          edgeInfluence: node.edgeInfluence,
          coastInfluence: node.coastInfluence,
          shelfInfluence: node.shelfInfluence,
          materialInfluence: node.materialInfluence,
          carrierMayConsume: true,
          finalVisualPassClaim: false
        };
      })),
      carrierMayConsume: true,
      carrierMayRender: true,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    });

    return runtime.edgeRelationshipField;
  }

  function computeCounts() {
    runtime.counts = Object.freeze({
      nodeCount: NODE_COUNT,
      landParcelCount: runtime.landNodes.length,
      mergedMassNodeCount: runtime.landNodes.length,
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,
      coastlineNodeCount: runtime.coastlineNodes.length,
      boundaryNodeCount: runtime.boundaryNodes.length,
      summitInfluenceCount: runtime.summitInfluenceNodes.length,
      hydrationFlowCount: runtime.hydrationFlowNodes.length,
      edgeRelationshipCount: runtime.edgeRelationshipNodes.length,
      interiorParcelCount: runtime.compositeNodes.filter(function (node) { return node.interiorParcel; }).length,
      rawParcelVisibleCount: 0,
      rawParcelVisibilityHeld: true
    });

    return runtime.counts;
  }

  function rebuild() {
    runtime.refreshCount += 1;
    runtime.refreshedAt = new Date().toISOString();
    runtime.warnings = [];
    runtime.failures = [];

    readTerrainApi();
    readEdgeApi();
    buildCompositeNodes();
    buildCoastlinePath();
    buildContinentMask();
    buildElevationField();
    buildSummitInfluenceField();
    buildHydrationFlowField();
    buildEdgeRelationshipField();
    computeCounts();
    publishStaticGlobals();

    return runtime;
  }

  function status() {
    rebuild();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: FILE,
      childType: CHILD_TYPE,

      terrainSourceGlobal: TERRAIN_GLOBAL,
      terrainChildDetected: runtime.terrainDetected,
      terrainChildApiComplete: runtime.terrainApiComplete,
      edgeChildDetected: runtime.edgeDetected,
      edgeChildApiComplete: runtime.edgeApiComplete,
      edgeBehaviorInputHeld: runtime.edgeBehaviorInputHeld,

      unifiedLandformScope256Active: true,
      terrainBodyScope256Active: true,
      elevationParcelScope256Active: true,
      summitInfluenceScope256Active: true,
      hydrationFlowScope256Active: true,
      edgeRelationshipScope256Active: true,

      terrainParcelMergeActive: true,
      summitInfluenceIntegrated: true,
      coastlinePathReady: Boolean(runtime.coastlinePath && runtime.coastlinePath.pathReady),
      elevationFieldReady: Boolean(runtime.elevationField && runtime.elevationField.elevationFieldReady),
      hydrationFlowFieldReady: Boolean(runtime.hydrationFlowField && runtime.hydrationFlowField.hydrationFlowFieldReady),
      edgeRelationshipFieldReady: Boolean(runtime.edgeRelationshipField && runtime.edgeRelationshipField.edgeRelationshipFieldReady),
      surfaceCompositeReady: runtime.landNodes.length > 0,
      hydrationCompositeReady: runtime.hydrationFlowNodes.length > 0,
      sixthSenseCompositeReady: runtime.landNodes.length > 0,

      nodeCount: NODE_COUNT,
      landParcelCount: runtime.counts.landParcelCount || 0,
      mergedMassNodeCount: runtime.counts.mergedMassNodeCount || 0,
      coastlinePointCount: runtime.counts.coastlinePointCount || 0,
      summitInfluenceCount: runtime.counts.summitInfluenceCount || 0,
      hydrationFlowCount: runtime.counts.hydrationFlowCount || 0,
      edgeRelationshipCount: runtime.counts.edgeRelationshipCount || 0,

      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      hydrationDoesNotRenderAsDisconnectedBlobs: true,
      coastlineIsUnified: true,

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,

      terrainAuthorityRetained: true,
      hydrationAuthorityRetained: true,
      hydrationEdgeAuthorityRetained: true,
      carrierRenderAuthorityRetainedByCarrier: true,

      htmlUntouched: true,
      scriptTagsIncluded: false,
      cacheKeyScope: false,
      generatedImage: false,
      graphicBox: false,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      ecologyAuthoritySeized: false,
      settlementAuthoritySeized: false,
      urbanAuthoritySeized: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false,

      warnings: runtime.warnings.slice(),
      failures: runtime.failures.slice(),
      refreshedAt: runtime.refreshedAt,
      refreshCount: runtime.refreshCount,

      deployMarker: "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function getUnifiedLandformPacket(target, options) {
    rebuild();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-unified-landform-consumer",
      packetType: "gratitude_unified_landform_packet",
      unifiedLandformPacketReady: runtime.landNodes.length > 0,
      unifiedLandformScope256Active: true,

      nodeCount: NODE_COUNT,
      landParcelCount: runtime.landNodes.length,
      mergedMassNodeCount: runtime.landNodes.length,
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,

      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      hydrationFollowsUnifiedLandform: true,
      edgesModifyPerimeterAndFlowCuts: true,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath({ compact: true }),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),

      nodes: compact ? runtime.compositeNodes.map(compactNode) : runtime.compositeNodes.map(deepClone),

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getContinentMask(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var mask = deepClone(runtime.continentMask);

    if (compact) {
      mask.nodes = runtime.continentMask.nodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          mergedLandformMembership: node.mergedLandformMembership,
          parcelWeight: node.parcelWeight,
          coastlineParcel: node.coastlineParcel,
          boundaryParcel: node.boundaryParcel,
          interiorParcel: node.interiorParcel,
          renderAsRawParcel: false,
          renderAsUnifiedMass: true
        };
      });
    }

    return mask;
  }

  function getElevationField(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var field = deepClone(runtime.elevationField);

    if (compact) {
      field.nodes = runtime.elevationField.nodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          mergedLandformMembership: node.mergedLandformMembership,
          unifiedElevation: node.unifiedElevation,
          summitInfluence: node.summitInfluence,
          ridgeInfluence: node.ridgeInfluence,
          basinInfluence: node.basinInfluence,
          valleyInfluence: node.valleyInfluence
        };
      });
    }

    return field;
  }

  function getCoastlinePath(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var path = deepClone(runtime.coastlinePath);

    if (compact && path && Array.isArray(path.points)) {
      path.points = path.points.map(compactPathPoint);
    }

    return path;
  }

  function getSummitInfluenceField(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var field = deepClone(runtime.summitInfluenceField);

    if (compact) {
      field.nodes = runtime.summitInfluenceField.nodes.map(function (node) {
        return {
          compositeNodeId: node.compositeNodeId,
          seatIndex: node.seatIndex,
          x: node.x,
          y: node.y,
          nearestSummitId: node.nearestSummitId,
          summitInfluence: node.summitInfluence,
          renderAsSummitIsland: false,
          renderAsElevationAnchor: true
        };
      });
    }

    return field;
  }

  function getHydrationFlowField(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var field = deepClone(runtime.hydrationFlowField);

    if (compact) {
      field.nodes = runtime.hydrationFlowNodes.map(compactNode);
    }

    return field;
  }

  function getEdgeRelationshipField(options) {
    rebuild();

    var compact = Boolean(options && options.compact);
    var field = deepClone(runtime.edgeRelationshipField);

    if (compact) {
      field.nodes = runtime.edgeRelationshipNodes.map(compactNode);
    }

    return field;
  }

  function getSurfaceCompositePacket(target, options) {
    rebuild();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "surface-composite-consumer",
      packetType: "gratitude_surface_composite_packet",
      surfaceCompositeReady: runtime.landNodes.length > 0,

      drawMode: "unified_mass_not_raw_parcels",
      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath({ compact: true }),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),

      nodes: compact ? runtime.landNodes.map(compactNode) : runtime.landNodes.map(deepClone),

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      finalTerrainPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getHydrationCompositePacket(target, options) {
    rebuild();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "hydration-composite-consumer",
      packetType: "gratitude_hydration_composite_packet",
      hydrationCompositeReady: runtime.hydrationFlowNodes.length > 0,

      drawMode: "flow_through_unified_landform_not_disconnected_blobs",
      hydrationFollowsUnifiedLandform: true,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),

      nodes: compact ? runtime.hydrationFlowNodes.map(compactNode) : runtime.hydrationFlowNodes.map(deepClone),

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsHydration: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getSixthSenseCompositePacket(target, options) {
    rebuild();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "sixth-sense-composite-consumer",
      packetType: "gratitude_sixth_sense_composite_packet",
      sixthSenseCompositeReady: runtime.landNodes.length > 0,

      relationshipFormula: "terrain + hydration + edge + material + summit influence = one composed landform",
      drawMode: "collaborative_relationship_expression",

      terrainBodyScope256Active: true,
      elevationParcelScope256Active: true,
      summitInfluenceScope256Active: true,
      hydrationFlowScope256Active: true,
      edgeRelationshipScope256Active: true,
      unifiedLandformScope256Active: true,

      continentMask: getContinentMask({ compact: true }),
      coastlinePath: getCoastlinePath({ compact: true }),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),
      hydrationFlowField: getHydrationFlowField({ compact: true }),
      edgeRelationshipField: getEdgeRelationshipField({ compact: true }),

      nodes: compact ? runtime.compositeNodes.map(compactNode) : runtime.compositeNodes.map(deepClone),

      rawParcelVisibilityHeld: true,
      summitsAreNotIslands: true,
      hydrationDoesNotRenderAsDisconnectedBlobs: true,
      edgesDoNotFragmentContinent: true,

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getCarrierReceivePacket(target, options) {
    rebuild();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "audralia-planet-inspection-carrier",
      packetType: "gratitude_landform_compositor_carrier_receive_packet",
      carrierReceivePacketReady: true,

      preferredCarrierDrawOrder: [
        "continentMask",
        "coastlinePath",
        "elevationField",
        "summitInfluenceField",
        "hydrationFlowField",
        "edgeRelationshipField"
      ],

      bodyLensPacket: {
        cleanHydrosphereBodyPreserved: true,
        composedLandformMayAppearFaintly: true,
        rawParcelVisibilityHeld: true
      },

      surfaceCompositePacket: getSurfaceCompositePacket(target || "carrier-surface", { compact: true }),
      hydrationCompositePacket: getHydrationCompositePacket(target || "carrier-hydration", { compact: true }),
      sixthSenseCompositePacket: getSixthSenseCompositePacket(target || "carrier-sixth-sense", { compact: true }),
      unifiedLandformPacket: getUnifiedLandformPacket(target || "carrier-unified-landform", { compact: compact }),

      latticeRule: {
        rawParcelVisibilityAllowedInLatticeOnly: true,
        rawParcelVisibilityHeldInSurfaceHydrationAndSixthSense: true
      },

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getChildReceivePacket(target, options) {
    rebuild();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: target || "unassigned-landform-compositor-consumer",
      childReceivePacketReady: true,
      childType: CHILD_TYPE,

      status: status(),
      unifiedLandformPacket: getUnifiedLandformPacket(target || "child-receive-unified", options || { compact: true }),
      continentMask: getContinentMask(options || { compact: true }),
      elevationField: getElevationField(options || { compact: true }),
      coastlinePath: getCoastlinePath(options || { compact: true }),
      summitInfluenceField: getSummitInfluenceField(options || { compact: true }),
      hydrationFlowField: getHydrationFlowField(options || { compact: true }),
      edgeRelationshipField: getEdgeRelationshipField(options || { compact: true }),
      surfaceCompositePacket: getSurfaceCompositePacket(target || "child-receive-surface", options || { compact: true }),
      hydrationCompositePacket: getHydrationCompositePacket(target || "child-receive-hydration", options || { compact: true }),
      sixthSenseCompositePacket: getSixthSenseCompositePacket(target || "child-receive-sixth-sense", options || { compact: true }),
      carrierReceivePacket: getCarrierReceivePacket(target || "child-receive-carrier", options || { compact: true }),

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function publishStaticGlobals() {
    if (typeof window === "undefined") return;

    window.AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_STATUS = {
      contract: CONTRACT,
      target: FILE,
      childType: CHILD_TYPE,
      unifiedLandformScope256Active: true,
      terrainParcelMergeActive: true,
      terrainChildDetected: runtime.terrainDetected,
      edgeChildDetected: runtime.edgeDetected,
      edgeBehaviorInputHeld: runtime.edgeBehaviorInputHeld,
      nodeCount: NODE_COUNT,
      landParcelCount: runtime.landNodes.length,
      mergedMassNodeCount: runtime.landNodes.length,
      coastlinePointCount: runtime.coastlinePath && runtime.coastlinePath.points ? runtime.coastlinePath.points.length : 0,
      summitInfluenceCount: runtime.summitInfluenceNodes.length,
      hydrationFlowCount: runtime.hydrationFlowNodes.length,
      edgeRelationshipCount: runtime.edgeRelationshipNodes.length,
      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      carrierInventsLandform: false,
      finalVisualPassClaim: false,
      deployMarker: "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_COMPOSITOR_CHILD_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_PACKET = {
      contract: CONTRACT,
      packetType: "gratitude_unified_landform_packet",
      unifiedLandformPacketReady: runtime.landNodes.length > 0,
      nodeCount: NODE_COUNT,
      landParcelCount: runtime.landNodes.length,
      coastlinePath: runtime.coastlinePath ? {
        pathId: runtime.coastlinePath.pathId,
        pathReady: runtime.coastlinePath.pathReady,
        pointCount: runtime.coastlinePath.pointCount,
        points: runtime.coastlinePath.points ? runtime.coastlinePath.points.map(compactPathPoint) : []
      } : null,
      rawParcelVisibilityHeld: true,
      surfaceTilesAreCalculationParcels: true,
      summitsAreNotIslands: true,
      hydrationFollowsUnifiedLandform: true,
      carrierMayConsume: true,
      carrierInventsLandform: false,
      finalVisualPassClaim: false
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    specOps: SPEC_OPS,
    news: NEWS,
    ccr: CCR,
    file: FILE,
    childType: CHILD_TYPE,

    refresh: rebuild,
    status: status,
    getUnifiedLandformPacket: getUnifiedLandformPacket,
    getContinentMask: getContinentMask,
    getElevationField: getElevationField,
    getCoastlinePath: getCoastlinePath,
    getSummitInfluenceField: getSummitInfluenceField,
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

    rebuild();
  }
})();
