// /assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js
// AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_TNT_v1
// Full-file creation.
// Scope: Gratitude downstream hydration-edge / water-behavior child.
// Purpose: give water explicit physical behavior authority for beaches, cliffs, waterfalls, shelves, sediment, rock,
// sand, pools, rivers, streams, gullies, marshes, wetlands, and deltas.
// Owns: hydration-edge behavior classification, water-behavior packets, material-edge packets, 256-scope behavior receipt.
// Does not own: HTML, script tags, carrier drawing, terrain source authority, hydration source authority,
// final terrain pass, final hydration pass, final edge pass, final visual pass, atmosphere, climate, chemistry finalization,
// ecology activation, settlement activation, or urban activation.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_TERRAIN_ENGINE_SURFACE_HABITABILITY_BLUEPRINT_REGISTRY_ALIGNMENT_TNT_v1";
  var SPEC_OPS = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_NEWS_v1";
  var CCR = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_CCR_v1";

  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js";
  var UPSTREAM_GLOBAL = "AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD";
  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var CHILD_TYPE = "gratitude_hydration_edge_water_behavior_child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var SEA_LEVEL_DATUM_DEFAULT = 0.32;

  var BEHAVIOR_CATEGORIES = Object.freeze([
    "beach_edge",
    "cliff_edge",
    "waterfall_edge",
    "shelf_edge",
    "delta_edge",
    "sediment_deposit",
    "rock_break",
    "sand_band",
    "pool_retention",
    "river_flow",
    "stream_flow",
    "gully_cut",
    "marsh_saturation",
    "wetland_retention",
    "outside_context",
    "held_future_socket"
  ]);

  var MATERIAL_CLASSES = Object.freeze([
    "rock",
    "sediment",
    "sand",
    "silt",
    "clay",
    "peat",
    "wet_soil",
    "dry_soil",
    "fracture_edge",
    "mineral_exposure"
  ]);

  var WATER_BEHAVIOR_PRIORITY = Object.freeze([
    "waterfall_edge",
    "cliff_edge",
    "beach_edge",
    "shelf_edge",
    "delta_edge",
    "river_flow",
    "stream_flow",
    "pool_retention",
    "marsh_saturation",
    "wetland_retention",
    "gully_cut",
    "sediment_deposit",
    "rock_break",
    "sand_band",
    "outside_context",
    "held_future_socket"
  ]);

  var runtime = {
    upstreamDetected: false,
    upstreamComplete: false,
    upstreamStatus: null,
    sourcePacket: null,
    surfaceMap: null,
    continentMap: null,
    hydrationMap: null,
    elevationMap: null,
    coastMap: null,
    terrainDatumPacket: null,
    streamRegistry: null,

    nodes: [],
    edgeNodes: [],
    materialNodes: [],
    waterNodes: [],
    waterPaths: [],
    counts: {},
    failures: [],
    warnings: [],
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

  function boolOf(source, keys, fallback) {
    if (!source) return fallback;

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (source[key] === true) return true;
      if (source[key] === false) return false;
    }

    return Boolean(fallback);
  }

  function textOf(source, keys, fallback) {
    if (!source) return fallback || "";

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (source[key] !== undefined && source[key] !== null && String(source[key])) {
        return String(source[key]);
      }
    }

    return fallback || "";
  }

  function nodeId(x, y) {
    return "HYDRATION-EDGE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
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

  function makeLinePoints(x, y, width, tilt) {
    var a = terrainSeatToLonLat(x - width, y - tilt);
    var b = terrainSeatToLonLat(x + width, y + tilt);

    return [
      [round(a.lon, 4), round(a.lat, 4)],
      [round(b.lon, 4), round(b.lat, 4)]
    ];
  }

  function makeCurvePoints(x, y, width, arc) {
    var a = terrainSeatToLonLat(x - width, y);
    var b = terrainSeatToLonLat(x, y + arc);
    var c = terrainSeatToLonLat(x + width, y);

    return [
      [round(a.lon, 4), round(a.lat, 4)],
      [round(b.lon, 4), round(b.lat, 4)],
      [round(c.lon, 4), round(c.lat, 4)]
    ];
  }

  function emptyCounts() {
    var counts = {};
    BEHAVIOR_CATEGORIES.forEach(function (name) {
      counts[name] = 0;
    });

    MATERIAL_CLASSES.forEach(function (name) {
      counts[name] = 0;
    });

    counts.edgeNodeCount = 0;
    counts.beachCount = 0;
    counts.cliffCount = 0;
    counts.waterfallCount = 0;
    counts.shelfCount = 0;
    counts.sedimentCount = 0;
    counts.rockCount = 0;
    counts.sandCount = 0;
    counts.poolCount = 0;
    counts.riverCount = 0;
    counts.streamCount = 0;
    counts.gullyCount = 0;
    counts.marshCount = 0;
    counts.wetlandCount = 0;
    counts.deltaCount = 0;
    counts.renderEligibleCount = 0;

    return counts;
  }

  function collectList(map, keys) {
    if (!map) return [];

    for (var i = 0; i < keys.length; i += 1) {
      var list = map[keys[i]];
      if (Array.isArray(list)) return list;
    }

    return [];
  }

  function mapByIdentity(items) {
    var mapped = {};

    toArray(items).forEach(function (item) {
      if (!item) return;

      var x = valueOf(item, ["x", "radial", "centerX"], null);
      var y = valueOf(item, ["y", "band", "centerY"], null);
      var seatIndex = valueOf(item, ["seatIndex", "nodeIndex", "index"], null);
      var key = "";

      if (Number.isFinite(seatIndex)) key = "i:" + seatIndex;
      else if (Number.isFinite(x) && Number.isFinite(y)) key = "xy:" + Math.round(x) + ":" + Math.round(y);
      else if (item.seatKey) key = "k:" + item.seatKey;
      else if (item.nodeId) key = "n:" + item.nodeId;
      else return;

      mapped[key] = Object.assign(mapped[key] || {}, item);
    });

    return mapped;
  }

  function mergeIntoBase(base, mapped) {
    Object.keys(mapped).forEach(function (key) {
      var source = mapped[key];
      var index = valueOf(source, ["seatIndex", "nodeIndex", "index"], null);
      var x = valueOf(source, ["x", "radial", "centerX"], null);
      var y = valueOf(source, ["y", "band", "centerY"], null);
      var target = null;

      if (Number.isFinite(index) && base[index]) {
        target = base[index];
      } else if (Number.isFinite(x) && Number.isFinite(y)) {
        var xi = clamp(Math.round(x), 0, RADIAL_NODES - 1);
        var yi = clamp(Math.round(y), 0, FIBONACCI_BANDS - 1);
        target = base[yi * RADIAL_NODES + xi];
      }

      if (target) Object.assign(target, source);
    });
  }

  function readUpstream() {
    runtime.refreshCount += 1;
    runtime.refreshedAt = new Date().toISOString();
    runtime.failures = [];
    runtime.warnings = [];

    var upstream = typeof window !== "undefined" ? window[UPSTREAM_GLOBAL] : null;

    runtime.upstreamDetected = Boolean(upstream);
    runtime.upstreamComplete = false;
    runtime.upstreamStatus = null;
    runtime.sourcePacket = null;
    runtime.surfaceMap = null;
    runtime.continentMap = null;
    runtime.hydrationMap = null;
    runtime.elevationMap = null;
    runtime.coastMap = null;
    runtime.terrainDatumPacket = null;
    runtime.streamRegistry = null;

    if (!upstream) {
      runtime.failures.push("upstream_gratitude_child_missing");
      return null;
    }

    runtime.upstreamComplete = Boolean(
      typeof upstream.status === "function" &&
      typeof upstream.getHydrationMap === "function" &&
      (typeof upstream.getSurfaceMap === "function" || typeof upstream.getContinentMap === "function")
    );

    if (!runtime.upstreamComplete) {
      runtime.failures.push("upstream_gratitude_child_api_incomplete");
      return upstream;
    }

    try {
      runtime.upstreamStatus = typeof upstream.status === "function" ? upstream.status() : null;
      runtime.sourcePacket = typeof upstream.getChildReceivePacket === "function"
        ? upstream.getChildReceivePacket("gratitude-hydration-edge-water-behavior-child", { compact: false })
        : null;

      runtime.surfaceMap = typeof upstream.getSurfaceMap === "function" ? upstream.getSurfaceMap({ compact: false }) : null;
      runtime.continentMap = typeof upstream.getContinentMap === "function" ? upstream.getContinentMap({ compact: false }) : runtime.surfaceMap;
      runtime.hydrationMap = typeof upstream.getHydrationMap === "function" ? upstream.getHydrationMap({ compact: false }) : null;
      runtime.elevationMap = typeof upstream.getElevationMap === "function" ? upstream.getElevationMap({ compact: false }) : null;
      runtime.coastMap = typeof upstream.getCoastMap === "function" ? upstream.getCoastMap({ compact: false }) : null;
      runtime.terrainDatumPacket = typeof upstream.getTerrainDatumPacket === "function"
        ? upstream.getTerrainDatumPacket("gratitude-hydration-edge-water-behavior-child", { compact: false })
        : null;
      runtime.streamRegistry = typeof upstream.getStreamRegistry === "function" ? upstream.getStreamRegistry({ compact: false }) : null;
    } catch (error) {
      runtime.failures.push("upstream_read_exception:" + (error && error.message ? error.message : String(error)));
    }

    return upstream;
  }

  function makeBaseNodes() {
    var base = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var index = y * RADIAL_NODES + x;

        base.push({
          sourceNodeId: "GRATITUDE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0"),
          nodeIndex: index,
          seatIndex: index,
          seatKey: seatKey(x, y),
          x: x,
          y: y,
          continentMembership: false,
          terrainClass: "outside_gratitude_field",
          hydrationClass: "outside_gratitude_field",
          elevation: 0,
          seaLevelDatum: SEA_LEVEL_DATUM_DEFAULT
        });
      }
    }

    return base;
  }

  function sourceNodesFromMaps() {
    var base = makeBaseNodes();

    var surfaceNodes = collectList(runtime.surfaceMap, ["nodes", "seats"]);
    var continentNodes = collectList(runtime.continentMap, ["nodes", "seats"]);
    var hydrationSeats = collectList(runtime.hydrationMap, ["seats", "nodes"]);
    var elevationNodes = collectList(runtime.elevationMap, ["nodes", "seats"]);
    var coastNodes = collectList(runtime.coastMap, ["nodes", "seats"]);
    var datumNodes = collectList(runtime.terrainDatumPacket, ["datumNodes", "nodes", "seats"]);

    [
      surfaceNodes,
      continentNodes,
      hydrationSeats,
      elevationNodes,
      coastNodes,
      datumNodes
    ].forEach(function (list) {
      mergeIntoBase(base, mapByIdentity(list));
    });

    return base;
  }

  function landMembership(source) {
    return Boolean(
      source.continentMembership === true ||
      source.land === true ||
      source.continentId === CONTINENT_ID ||
      source.aboveSeaLevelMass === true
    );
  }

  function hydrationPermission(source, hydrationPressure, hydrationDepth) {
    var hydrationClass = textOf(source, ["hydrationClass"], "");
    return Boolean(
      source.waterFillEligible === true ||
      hydrationDepth > 0.015 ||
      hydrationPressure > 0.30 ||
      hydrationClass.indexOf("lake") >= 0 ||
      hydrationClass.indexOf("fill") >= 0 ||
      hydrationClass.indexOf("wetland") >= 0 ||
      hydrationClass.indexOf("marsh") >= 0 ||
      hydrationClass.indexOf("coastal") >= 0
    );
  }

  function deriveBehaviorNode(source, index) {
    var x = valueOf(source, ["x", "radial", "centerX"], index % RADIAL_NODES);
    var y = valueOf(source, ["y", "band", "centerY"], Math.floor(index / RADIAL_NODES));
    x = clamp(Math.round(x), 0, RADIAL_NODES - 1);
    y = clamp(Math.round(y), 0, FIBONACCI_BANDS - 1);

    var land = landMembership(source);
    var seaLevelDatum = valueOf(source, ["seaLevelDatum"], SEA_LEVEL_DATUM_DEFAULT);
    var elevation = valueOf(source, ["surfaceExpressionDatum", "elevation", "baseElevation"], land ? 0.44 : 0);
    var terrainClass = textOf(source, ["terrainClass"], land ? "interior_plain" : "outside_gratitude_field");
    var hydrationClass = textOf(source, ["hydrationClass"], land ? "dry_land" : "outside_gratitude_field");

    var ridgePressure = valueOf(source, ["ridgePressure"], boolOf(source, ["ridgeStatus"], false) ? 0.66 : 0);
    var basinPressure = valueOf(source, ["basinPressure"], boolOf(source, ["basinStatus"], false) ? 0.66 : 0);
    var valleyPressure = valueOf(source, ["valleyPressure"], boolOf(source, ["valleyStatus"], false) ? 0.62 : 0);
    var coastPressure = valueOf(source, ["coastPressure"], boolOf(source, ["coastEligible"], false) ? 0.66 : 0);
    var shelfPressure = valueOf(source, ["shelfPressure"], terrainClass.indexOf("shelf") >= 0 ? 0.66 : 0);
    var hydrationPressure = valueOf(source, ["hydrationPressure", "wetnessPressure", "moisturePotential"], 0);
    var hydrationDepth = valueOf(source, ["hydrationDepth", "waterTableDatumHeld"], 0);
    var runoffPressure = valueOf(source, ["runoffPressure"], clamp(ridgePressure * 0.20 + valleyPressure * 0.30 + hydrationPressure * 0.22, 0, 1));
    var sedimentInput = valueOf(source, ["sedimentPressure"], null);
    var mineralPressure = valueOf(source, ["mineralPressure"], 0);
    var soilPressure = valueOf(source, ["soilPressure"], 0);

    var nearSeaLevelPressure = land
      ? clamp(1 - Math.abs(elevation - seaLevelDatum) / 0.22, 0, 1)
      : clamp(shelfPressure, 0, 1);

    var highElevationPressure = land ? clamp((elevation - seaLevelDatum) / 0.45, 0, 1) : 0;
    var lowSlopePressure = clamp(1 - (ridgePressure * 0.52 + highElevationPressure * 0.22 + runoffPressure * 0.10), 0, 1);
    var slopePressure = clamp(ridgePressure * 0.35 + valleyPressure * 0.22 + runoffPressure * 0.18 + highElevationPressure * 0.20, 0, 1);

    var edgePressure = clamp(Math.max(coastPressure, shelfPressure, nearSeaLevelPressure * coastPressure), 0, 1);
    var sedimentPressure = Number.isFinite(sedimentInput)
      ? sedimentInput
      : clamp(basinPressure * 0.24 + valleyPressure * 0.20 + coastPressure * 0.24 + shelfPressure * 0.18 + lowSlopePressure * 0.18 + soilPressure * 0.12, 0, 1);

    var sandPressure = clamp(coastPressure * 0.34 + sedimentPressure * 0.34 + lowSlopePressure * 0.22 + nearSeaLevelPressure * 0.16 - ridgePressure * 0.12, 0, 1);
    var fracturePressure = clamp(ridgePressure * 0.34 + mineralPressure * 0.22 + highElevationPressure * 0.25 + slopePressure * 0.14, 0, 1);
    var rockPressure = clamp(ridgePressure * 0.30 + mineralPressure * 0.25 + fracturePressure * 0.28 + highElevationPressure * 0.20, 0, 1);

    var softEdgePressure = clamp(edgePressure * 0.28 + sandPressure * 0.32 + sedimentPressure * 0.24 + lowSlopePressure * 0.22 - fracturePressure * 0.12, 0, 1);
    var hardEdgePressure = clamp(edgePressure * 0.24 + fracturePressure * 0.30 + rockPressure * 0.25 + slopePressure * 0.22 - sedimentPressure * 0.10, 0, 1);

    var hasHydrationPermission = hydrationPermission(source, hydrationPressure, hydrationDepth);
    var flowPermission = land
      ? clamp((hasHydrationPermission ? 0.32 : 0) + hydrationPressure * 0.24 + hydrationDepth * 0.22 + valleyPressure * 0.20 + runoffPressure * 0.20, 0, 1)
      : 0;

    var dropPermission = clamp(flowPermission * 0.34 + hardEdgePressure * 0.34 + slopePressure * 0.22 + highElevationPressure * 0.12, 0, 1);
    var waterRetentionPermission = clamp(basinPressure * 0.34 + lowSlopePressure * 0.20 + hydrationDepth * 0.24 + hydrationPressure * 0.20 + nearSeaLevelPressure * 0.10, 0, 1);
    var slowDrainagePressure = clamp(lowSlopePressure * 0.28 + basinPressure * 0.24 + hydrationPressure * 0.20 + sedimentPressure * 0.14 + nearSeaLevelPressure * 0.10, 0, 1);

    var beachPermission = clamp(softEdgePressure * 0.48 + sandPressure * 0.30 + nearSeaLevelPressure * 0.18 + coastPressure * 0.16 - hardEdgePressure * 0.24, 0, 1);
    var cliffPermission = clamp(hardEdgePressure * 0.48 + fracturePressure * 0.26 + rockPressure * 0.20 + coastPressure * 0.12 - beachPermission * 0.20, 0, 1);
    var waterfallPermission = clamp(flowPermission * 0.35 + dropPermission * 0.38 + hardEdgePressure * 0.20 + valleyPressure * 0.12 - beachPermission * 0.16, 0, 1);
    var shelfPermission = clamp(shelfPressure * 0.54 + nearSeaLevelPressure * 0.20 + coastPressure * 0.18, 0, 1);
    var deltaPermission = clamp(flowPermission * 0.26 + sedimentPressure * 0.28 + coastPressure * 0.22 + lowSlopePressure * 0.18 + valleyPressure * 0.10 - cliffPermission * 0.16, 0, 1);

    var marshPermission = clamp(slowDrainagePressure * 0.34 + hydrationPressure * 0.22 + basinPressure * 0.20 + sedimentPressure * 0.12 - highElevationPressure * 0.22, 0, 1);
    var wetlandPermission = clamp(slowDrainagePressure * 0.30 + hydrationPressure * 0.20 + valleyPressure * 0.12 + basinPressure * 0.14 + soilPressure * 0.10 - ridgePressure * 0.18, 0, 1);
    var poolPermission = clamp(waterRetentionPermission * 0.42 + basinPressure * 0.26 + hydrationDepth * 0.22 - flowPermission * 0.08, 0, 1);
    var riverPermission = clamp(flowPermission * 0.36 + valleyPressure * 0.24 + runoffPressure * 0.22 + hydrationDepth * 0.12 - lowSlopePressure * 0.08, 0, 1);
    var streamPermission = clamp(flowPermission * 0.32 + valleyPressure * 0.18 + runoffPressure * 0.16 + lowSlopePressure * 0.06, 0, 1);
    var gullyPermission = clamp(runoffPressure * 0.32 + slopePressure * 0.26 + valleyPressure * 0.14 + fracturePressure * 0.10 - hydrationDepth * 0.08, 0, 1);

    var materialBehavior = "held_future_socket";
    if (rockPressure >= 0.50 && rockPressure >= sedimentPressure) materialBehavior = "rock_break";
    else if (sandPressure >= 0.48) materialBehavior = "sand_band";
    else if (marshPermission >= 0.54) materialBehavior = "peat";
    else if (wetlandPermission >= 0.50) materialBehavior = "silt_clay";
    else if (sedimentPressure >= 0.42) materialBehavior = "sediment_deposit";
    else if (soilPressure >= 0.32) materialBehavior = "dry_soil";

    var waterBehavior = "held_future_socket";
    if (!land && shelfPermission < 0.38) waterBehavior = "outside_context";
    else if (marshPermission >= 0.58 && highElevationPressure < 0.46) waterBehavior = "marsh_saturation";
    else if (wetlandPermission >= 0.54 && highElevationPressure < 0.52) waterBehavior = "wetland_retention";
    else if (poolPermission >= 0.56) waterBehavior = "pool_retention";
    else if (riverPermission >= 0.58) waterBehavior = "river_flow";
    else if (streamPermission >= 0.48) waterBehavior = "stream_flow";
    else if (gullyPermission >= 0.46) waterBehavior = "gully_cut";
    else if (hasHydrationPermission) waterBehavior = "gully_cut";

    var edgeBehavior = "held_future_socket";
    if (!land && shelfPermission < 0.38) edgeBehavior = "outside_context";
    else if (waterfallPermission >= 0.54 && cliffPermission >= 0.38) edgeBehavior = "waterfall_edge";
    else if (cliffPermission >= 0.52 && cliffPermission > beachPermission) edgeBehavior = "cliff_edge";
    else if (beachPermission >= 0.44) edgeBehavior = "beach_edge";
    else if (shelfPermission >= 0.44) edgeBehavior = "shelf_edge";
    else if (deltaPermission >= 0.48) edgeBehavior = "delta_edge";
    else if (edgePressure >= 0.38 && sedimentPressure >= 0.36) edgeBehavior = "sediment_deposit";
    else if (edgePressure >= 0.38 && rockPressure >= 0.42) edgeBehavior = "rock_break";
    else if (land && coastPressure > 0.26) edgeBehavior = "shelf_edge";

    var primaryBehavior = primaryBehaviorFrom(edgeBehavior, waterBehavior, materialBehavior);
    var secondaryBehaviors = secondaryBehaviorsFrom({
      beach_edge: beachPermission,
      cliff_edge: cliffPermission,
      waterfall_edge: waterfallPermission,
      shelf_edge: shelfPermission,
      delta_edge: deltaPermission,
      sediment_deposit: sedimentPressure,
      rock_break: rockPressure,
      sand_band: sandPressure,
      pool_retention: poolPermission,
      river_flow: riverPermission,
      stream_flow: streamPermission,
      gully_cut: gullyPermission,
      marsh_saturation: marshPermission,
      wetland_retention: wetlandPermission
    }, primaryBehavior);

    var renderEligible = primaryBehavior !== "outside_context" && primaryBehavior !== "held_future_socket";
    var behaviorPoints = pointsForBehavior(primaryBehavior, x, y, {
      cliffPermission: cliffPermission,
      beachPermission: beachPermission,
      waterfallPermission: waterfallPermission,
      shelfPermission: shelfPermission,
      deltaPermission: deltaPermission
    });

    return Object.freeze({
      edgeNodeId: nodeId(x, y),
      sourceNodeId: source.sourceNodeId || source.nodeId || "GRATITUDE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0"),
      seatIndex: y * RADIAL_NODES + x,
      nodeIndex: y * RADIAL_NODES + x,
      seatKey: source.seatKey || seatKey(x, y),
      x: x,
      y: y,

      continentId: land ? CONTINENT_ID : null,
      continentName: land ? CONTINENT_NAME : null,
      continentMembership: land,

      terrainClass: terrainClass,
      hydrationClass: hydrationClass,
      elevation: round(elevation, 4),
      seaLevelDatum: round(seaLevelDatum, 4),

      slopePressure: round(slopePressure, 4),
      edgePressure: round(edgePressure, 4),
      coastPressure: round(coastPressure, 4),
      shelfPressure: round(shelfPressure, 4),
      ridgePressure: round(ridgePressure, 4),
      basinPressure: round(basinPressure, 4),
      valleyPressure: round(valleyPressure, 4),
      hydrationPressure: round(hydrationPressure, 4),
      hydrationDepth: round(hydrationDepth, 4),
      runoffPressure: round(runoffPressure, 4),

      sedimentPressure: round(sedimentPressure, 4),
      rockPressure: round(rockPressure, 4),
      sandPressure: round(sandPressure, 4),
      mineralPressure: round(mineralPressure, 4),
      soilPressure: round(soilPressure, 4),
      fracturePressure: round(fracturePressure, 4),
      softEdgePressure: round(softEdgePressure, 4),
      hardEdgePressure: round(hardEdgePressure, 4),

      beachPermission: round(beachPermission, 4),
      cliffPermission: round(cliffPermission, 4),
      waterfallPermission: round(waterfallPermission, 4),
      shelfPermission: round(shelfPermission, 4),
      deltaPermission: round(deltaPermission, 4),
      marshPermission: round(marshPermission, 4),
      wetlandPermission: round(wetlandPermission, 4),
      poolPermission: round(poolPermission, 4),
      riverPermission: round(riverPermission, 4),
      streamPermission: round(streamPermission, 4),
      gullyPermission: round(gullyPermission, 4),

      flowPermission: round(flowPermission, 4),
      dropPermission: round(dropPermission, 4),
      waterRetentionPermission: round(waterRetentionPermission, 4),
      slowDrainagePressure: round(slowDrainagePressure, 4),

      materialBehavior: materialBehavior,
      waterBehavior: waterBehavior,
      edgeBehavior: edgeBehavior,
      primaryBehavior: primaryBehavior,
      secondaryBehaviors: secondaryBehaviors,

      behaviorPoints: behaviorPoints,
      points: behaviorPoints,
      linePoints: behaviorPoints,

      waterFollowsElevation: true,
      waterRequiresPermission: true,
      waterfallRequiresFlowPlusDrop: true,
      beachRequiresSoftSedimentEdge: true,
      cliffRequiresHardElevationBreak: true,

      renderEligible: renderEligible,
      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsEdge: false,
      carrierInventsWaterBehavior: false,

      terrainAuthorityRetained: true,
      hydrationAuthorityRetained: true,
      carrierRenderAuthorityRetainedByCarrier: true,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function primaryBehaviorFrom(edgeBehavior, waterBehavior, materialBehavior) {
    var choices = [edgeBehavior, waterBehavior, materialBehavior];

    for (var p = 0; p < WATER_BEHAVIOR_PRIORITY.length; p += 1) {
      for (var i = 0; i < choices.length; i += 1) {
        if (choices[i] === WATER_BEHAVIOR_PRIORITY[p]) return choices[i];
      }
    }

    return "held_future_socket";
  }

  function secondaryBehaviorsFrom(pressures, primary) {
    var secondary = [];

    Object.keys(pressures).forEach(function (key) {
      if (key === primary) return;
      if (pressures[key] >= 0.42) secondary.push(key);
    });

    secondary.sort(function (a, b) {
      return pressures[b] - pressures[a];
    });

    return secondary.slice(0, 7);
  }

  function pointsForBehavior(primaryBehavior, x, y, permissions) {
    if (primaryBehavior === "waterfall_edge") return makeLinePoints(x, y, 0.18, 0.42);
    if (primaryBehavior === "cliff_edge") return makeLinePoints(x, y, 0.42, 0.14);
    if (primaryBehavior === "beach_edge") return makeCurvePoints(x, y, 0.44, 0.10);
    if (primaryBehavior === "shelf_edge") return makeCurvePoints(x, y, 0.50, 0.18);
    if (primaryBehavior === "delta_edge") return makeCurvePoints(x, y, 0.36, 0.28);
    if (primaryBehavior === "river_flow") return makeLinePoints(x, y, 0.20, 0.52);
    if (primaryBehavior === "stream_flow") return makeLinePoints(x, y, 0.18, 0.34);
    if (primaryBehavior === "gully_cut") return makeLinePoints(x, y, 0.12, 0.28);
    if (primaryBehavior === "pool_retention") return makeCurvePoints(x, y, 0.25, 0.08);
    if (primaryBehavior === "marsh_saturation") return makeCurvePoints(x, y, 0.34, 0.06);
    if (primaryBehavior === "wetland_retention") return makeCurvePoints(x, y, 0.38, 0.08);
    if (primaryBehavior === "sediment_deposit") return makeCurvePoints(x, y, 0.32, 0.04);
    if (primaryBehavior === "rock_break") return makeLinePoints(x, y, 0.24, -0.12);
    if (primaryBehavior === "sand_band") return makeCurvePoints(x, y, 0.42, 0.05);

    return makeLinePoints(x, y, 0.10, 0);
  }

  function buildBehaviorNodes() {
    readUpstream();

    var sources = sourceNodesFromMaps();
    var nodes = [];

    for (var i = 0; i < NODE_COUNT; i += 1) {
      nodes.push(deriveBehaviorNode(sources[i], i));
    }

    runtime.nodes = Object.freeze(nodes);

    runtime.edgeNodes = Object.freeze(nodes.filter(function (node) {
      return node.renderEligible &&
        (
          node.edgeBehavior === "beach_edge" ||
          node.edgeBehavior === "cliff_edge" ||
          node.edgeBehavior === "waterfall_edge" ||
          node.edgeBehavior === "shelf_edge" ||
          node.edgeBehavior === "delta_edge" ||
          node.edgeBehavior === "sediment_deposit" ||
          node.edgeBehavior === "rock_break"
        );
    }));

    runtime.waterNodes = Object.freeze(nodes.filter(function (node) {
      return node.renderEligible &&
        (
          node.waterBehavior === "pool_retention" ||
          node.waterBehavior === "river_flow" ||
          node.waterBehavior === "stream_flow" ||
          node.waterBehavior === "gully_cut" ||
          node.waterBehavior === "marsh_saturation" ||
          node.waterBehavior === "wetland_retention" ||
          node.primaryBehavior === "waterfall_edge" ||
          node.primaryBehavior === "delta_edge"
        );
    }));

    runtime.materialNodes = Object.freeze(nodes.filter(function (node) {
      return node.renderEligible &&
        (
          node.materialBehavior === "rock_break" ||
          node.materialBehavior === "sand_band" ||
          node.materialBehavior === "sediment_deposit" ||
          node.materialBehavior === "peat" ||
          node.materialBehavior === "silt_clay" ||
          node.materialBehavior === "dry_soil"
        );
    }));

    runtime.waterPaths = Object.freeze(buildWaterPaths(runtime.waterNodes));
    runtime.counts = Object.freeze(computeCounts(nodes));

    return runtime.nodes;
  }

  function buildWaterPaths(waterNodes) {
    var paths = [];
    var riverLike = waterNodes.filter(function (node) {
      return node.waterBehavior === "river_flow" || node.waterBehavior === "stream_flow" || node.primaryBehavior === "waterfall_edge";
    }).slice();

    riverLike.sort(function (a, b) {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    if (riverLike.length >= 2) {
      paths.push({
        pathId: "GRATITUDE-WATER-BEHAVIOR-RIVER-PATH-01",
        pathType: "river_or_stream_continuity",
        source: "hydration_edge_water_behavior_child",
        nodeRefs: riverLike.slice(0, 12).map(function (node) { return node.edgeNodeId; }),
        points: riverLike.slice(0, 12).map(function (node) {
          var p = terrainSeatToLonLat(node.x, node.y);
          return [round(p.lon, 4), round(p.lat, 4)];
        }),
        carrierMayConsume: true,
        carrierMayRender: true,
        finalVisualPassClaim: false
      });
    }

    var wetlands = waterNodes.filter(function (node) {
      return node.waterBehavior === "marsh_saturation" || node.waterBehavior === "wetland_retention";
    }).slice();

    wetlands.sort(function (a, b) {
      if (a.x !== b.x) return a.x - b.x;
      return a.y - b.y;
    });

    if (wetlands.length >= 2) {
      paths.push({
        pathId: "GRATITUDE-WATER-BEHAVIOR-SLOW-DRAINAGE-PATH-01",
        pathType: "marsh_wetland_slow_drainage",
        source: "hydration_edge_water_behavior_child",
        nodeRefs: wetlands.slice(0, 10).map(function (node) { return node.edgeNodeId; }),
        points: wetlands.slice(0, 10).map(function (node) {
          var p = terrainSeatToLonLat(node.x, node.y);
          return [round(p.lon, 4), round(p.lat, 4)];
        }),
        carrierMayConsume: true,
        carrierMayRender: true,
        finalVisualPassClaim: false
      });
    }

    return paths;
  }

  function computeCounts(nodes) {
    var counts = emptyCounts();

    nodes.forEach(function (node) {
      counts[node.primaryBehavior] = (counts[node.primaryBehavior] || 0) + 1;

      node.secondaryBehaviors.forEach(function (behavior) {
        counts[behavior] = (counts[behavior] || 0) + 1;
      });

      if (node.renderEligible) counts.renderEligibleCount += 1;

      if (
        node.edgeBehavior === "beach_edge" ||
        node.edgeBehavior === "cliff_edge" ||
        node.edgeBehavior === "waterfall_edge" ||
        node.edgeBehavior === "shelf_edge" ||
        node.edgeBehavior === "delta_edge" ||
        node.edgeBehavior === "sediment_deposit" ||
        node.edgeBehavior === "rock_break"
      ) {
        counts.edgeNodeCount += 1;
      }

      if (node.edgeBehavior === "beach_edge" || node.primaryBehavior === "beach_edge") counts.beachCount += 1;
      if (node.edgeBehavior === "cliff_edge" || node.primaryBehavior === "cliff_edge") counts.cliffCount += 1;
      if (node.edgeBehavior === "waterfall_edge" || node.primaryBehavior === "waterfall_edge") counts.waterfallCount += 1;
      if (node.edgeBehavior === "shelf_edge" || node.primaryBehavior === "shelf_edge") counts.shelfCount += 1;
      if (node.edgeBehavior === "delta_edge" || node.primaryBehavior === "delta_edge") counts.deltaCount += 1;

      if (node.materialBehavior === "sediment_deposit" || node.primaryBehavior === "sediment_deposit") counts.sedimentCount += 1;
      if (node.materialBehavior === "rock_break" || node.primaryBehavior === "rock_break") counts.rockCount += 1;
      if (node.materialBehavior === "sand_band" || node.primaryBehavior === "sand_band") counts.sandCount += 1;

      if (node.waterBehavior === "pool_retention" || node.primaryBehavior === "pool_retention") counts.poolCount += 1;
      if (node.waterBehavior === "river_flow" || node.primaryBehavior === "river_flow") counts.riverCount += 1;
      if (node.waterBehavior === "stream_flow" || node.primaryBehavior === "stream_flow") counts.streamCount += 1;
      if (node.waterBehavior === "gully_cut" || node.primaryBehavior === "gully_cut") counts.gullyCount += 1;
      if (node.waterBehavior === "marsh_saturation" || node.primaryBehavior === "marsh_saturation") counts.marshCount += 1;
      if (node.waterBehavior === "wetland_retention" || node.primaryBehavior === "wetland_retention") counts.wetlandCount += 1;

      if (node.materialBehavior === "rock_break") counts.rock += 1;
      if (node.materialBehavior === "sediment_deposit") counts.sediment += 1;
      if (node.materialBehavior === "sand_band") counts.sand += 1;
      if (node.materialBehavior === "peat") counts.peat += 1;
      if (node.materialBehavior === "silt_clay") {
        counts.silt += 1;
        counts.clay += 1;
      }
      if (node.materialBehavior === "dry_soil") counts.dry_soil += 1;
      if (node.waterBehavior === "marsh_saturation" || node.waterBehavior === "wetland_retention") counts.wet_soil += 1;
      if (node.fracturePressure >= 0.46) counts.fracture_edge += 1;
      if (node.mineralPressure >= 0.38) counts.mineral_exposure += 1;
    });

    return counts;
  }

  function refresh() {
    buildBehaviorNodes();
    publishStaticGlobals();
    return runtime;
  }

  function compactNode(node) {
    return {
      edgeNodeId: node.edgeNodeId,
      sourceNodeId: node.sourceNodeId,
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,
      x: node.x,
      y: node.y,
      terrainClass: node.terrainClass,
      hydrationClass: node.hydrationClass,
      elevation: node.elevation,
      primaryBehavior: node.primaryBehavior,
      edgeBehavior: node.edgeBehavior,
      waterBehavior: node.waterBehavior,
      materialBehavior: node.materialBehavior,
      renderEligible: node.renderEligible,
      points: node.points,
      carrierMayConsume: node.carrierMayConsume,
      finalVisualPassClaim: false
    };
  }

  function compactPath(path) {
    return {
      pathId: path.pathId,
      pathType: path.pathType,
      nodeRefs: path.nodeRefs,
      points: path.points,
      carrierMayConsume: true,
      carrierMayRender: true,
      finalVisualPassClaim: false
    };
  }

  function status() {
    refresh();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: FILE,
      childType: CHILD_TYPE,

      upstreamGlobal: UPSTREAM_GLOBAL,
      upstreamDetected: runtime.upstreamDetected,
      upstreamComplete: runtime.upstreamComplete,
      upstreamReadFailures: runtime.failures.slice(),
      upstreamReadWarnings: runtime.warnings.slice(),

      hydrationEdgeScope256Active: true,
      waterBehaviorAuthorityActive: true,
      materialEdgeAuthorityActive: true,

      terrainAuthorityRetained: true,
      hydrationAuthorityRetained: true,
      carrierRenderAuthorityRetainedByCarrier: true,

      beachesMapped: true,
      cliffsMapped: true,
      waterfallsMapped: true,
      shelvesMapped: true,
      sedimentMapped: true,
      rockMapped: true,
      sandMapped: true,
      poolsMapped: true,
      riversMapped: true,
      streamsMapped: true,
      gulliesMapped: true,
      marshesMapped: true,
      wetlandsMapped: true,
      deltasMapped: true,

      nodeCount: NODE_COUNT,
      edgeNodeCount: runtime.counts.edgeNodeCount || 0,
      beachCount: runtime.counts.beachCount || 0,
      cliffCount: runtime.counts.cliffCount || 0,
      waterfallCount: runtime.counts.waterfallCount || 0,
      shelfCount: runtime.counts.shelfCount || 0,
      sedimentCount: runtime.counts.sedimentCount || 0,
      rockCount: runtime.counts.rockCount || 0,
      sandCount: runtime.counts.sandCount || 0,
      poolCount: runtime.counts.poolCount || 0,
      riverCount: runtime.counts.riverCount || 0,
      streamCount: runtime.counts.streamCount || 0,
      gullyCount: runtime.counts.gullyCount || 0,
      marshCount: runtime.counts.marshCount || 0,
      wetlandCount: runtime.counts.wetlandCount || 0,
      deltaCount: runtime.counts.deltaCount || 0,
      renderEligibleCount: runtime.counts.renderEligibleCount || 0,

      behaviorCategoryCounts: deepClone(runtime.counts),

      waterFollowsElevation: true,
      waterRequiresPermission: true,
      waterfallRequiresFlowPlusDrop: true,
      beachRequiresSoftSedimentEdge: true,
      cliffRequiresHardElevationBreak: true,

      carrierInventsEdge: false,
      carrierInventsWaterBehavior: false,
      carrierMayConsume: true,
      carrierMayRender: true,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      chemistryAuthoritySeized: false,
      ecologyAuthoritySeized: false,
      settlementAuthoritySeized: false,
      urbanAuthoritySeized: false,

      htmlUntouched: true,
      scriptTagsIncluded: false,
      cacheKeyScope: false,
      generatedImage: false,
      graphicBox: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false,

      refreshedAt: runtime.refreshedAt,
      refreshCount: runtime.refreshCount,
      deployMarker: "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function getHydrationEdgeMap(options) {
    refresh();

    var compact = Boolean(options && options.compact);
    var edgeNodes = compact ? runtime.edgeNodes.map(compactNode) : runtime.edgeNodes.map(deepClone);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,
      mapType: "hydration_edge_behavior_map",
      hydrationEdgeScope256Active: true,
      waterBehaviorAuthorityActive: true,

      nodeCount: NODE_COUNT,
      edgeNodeCount: runtime.edgeNodes.length,
      counts: deepClone(runtime.counts),

      edges: edgeNodes,
      edgeNodes: edgeNodes,
      nodes: compact ? runtime.nodes.map(compactNode) : runtime.nodes.map(deepClone),

      waterFollowsElevation: true,
      waterRequiresPermission: true,
      waterfallRequiresFlowPlusDrop: true,
      beachRequiresSoftSedimentEdge: true,
      cliffRequiresHardElevationBreak: true,

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsEdge: false,
      carrierInventsWaterBehavior: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getWaterBehaviorPacket(target, options) {
    refresh();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-water-behavior-consumer",
      packetType: "gratitude_water_behavior_packet",
      waterBehaviorPacketReady: true,
      hydrationEdgeScope256Active: true,

      nodeCount: NODE_COUNT,
      waterNodeCount: runtime.waterNodes.length,
      counts: deepClone(runtime.counts),

      waterPaths: compact ? runtime.waterPaths.map(compactPath) : runtime.waterPaths.map(deepClone),
      waterNodes: compact ? runtime.waterNodes.map(compactNode) : runtime.waterNodes.map(deepClone),

      riverCount: runtime.counts.riverCount || 0,
      streamCount: runtime.counts.streamCount || 0,
      gullyCount: runtime.counts.gullyCount || 0,
      poolCount: runtime.counts.poolCount || 0,
      marshCount: runtime.counts.marshCount || 0,
      wetlandCount: runtime.counts.wetlandCount || 0,
      waterfallCount: runtime.counts.waterfallCount || 0,
      deltaCount: runtime.counts.deltaCount || 0,

      waterFollowsElevation: true,
      waterRequiresPermission: true,
      waterfallRequiresFlowPlusDrop: true,
      carrierInventsWaterBehavior: false,

      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getMaterialEdgeMap(options) {
    refresh();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      mapType: "material_edge_behavior_map",
      materialEdgeAuthorityActive: true,
      materialClasses: MATERIAL_CLASSES.slice(),

      nodeCount: NODE_COUNT,
      materialNodeCount: runtime.materialNodes.length,
      counts: deepClone(runtime.counts),

      nodes: compact ? runtime.materialNodes.map(compactNode) : runtime.materialNodes.map(deepClone),

      sedimentMapped: true,
      rockMapped: true,
      sandMapped: true,
      clayMapped: true,
      siltMapped: true,
      peatMapped: true,
      fractureEdgeMapped: true,

      carrierMayConsume: true,
      carrierMayRender: true,
      finalVisualPassClaim: false
    };
  }

  function filteredMap(name, predicate, options) {
    refresh();

    var compact = Boolean(options && options.compact);
    var nodes = runtime.nodes.filter(predicate);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      mapType: name,
      nodeCount: nodes.length,
      nodes: compact ? nodes.map(compactNode) : nodes.map(deepClone),
      carrierMayConsume: true,
      carrierMayRender: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getBeachMap(options) {
    return filteredMap("beach_map", function (node) {
      return node.edgeBehavior === "beach_edge" || node.primaryBehavior === "beach_edge" || node.secondaryBehaviors.indexOf("beach_edge") >= 0;
    }, options);
  }

  function getCliffMap(options) {
    return filteredMap("cliff_map", function (node) {
      return node.edgeBehavior === "cliff_edge" || node.primaryBehavior === "cliff_edge" || node.secondaryBehaviors.indexOf("cliff_edge") >= 0;
    }, options);
  }

  function getWaterfallMap(options) {
    return filteredMap("waterfall_map", function (node) {
      return node.edgeBehavior === "waterfall_edge" || node.primaryBehavior === "waterfall_edge" || node.secondaryBehaviors.indexOf("waterfall_edge") >= 0;
    }, options);
  }

  function getSedimentMap(options) {
    return filteredMap("sediment_map", function (node) {
      return node.materialBehavior === "sediment_deposit" ||
        node.materialBehavior === "sand_band" ||
        node.materialBehavior === "peat" ||
        node.materialBehavior === "silt_clay" ||
        node.primaryBehavior === "sediment_deposit" ||
        node.secondaryBehaviors.indexOf("sediment_deposit") >= 0;
    }, options);
  }

  function getRockMap(options) {
    return filteredMap("rock_map", function (node) {
      return node.materialBehavior === "rock_break" ||
        node.primaryBehavior === "rock_break" ||
        node.secondaryBehaviors.indexOf("rock_break") >= 0 ||
        node.rockPressure >= 0.46 ||
        node.fracturePressure >= 0.46;
    }, options);
  }

  function getPoolMap(options) {
    return filteredMap("pool_map", function (node) {
      return node.waterBehavior === "pool_retention" || node.primaryBehavior === "pool_retention";
    }, options);
  }

  function getRiverStreamMap(options) {
    refresh();

    var compact = Boolean(options && options.compact);
    var nodes = runtime.nodes.filter(function (node) {
      return node.waterBehavior === "river_flow" ||
        node.waterBehavior === "stream_flow" ||
        node.waterBehavior === "gully_cut" ||
        node.primaryBehavior === "river_flow" ||
        node.primaryBehavior === "stream_flow" ||
        node.primaryBehavior === "gully_cut";
    });

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      mapType: "river_stream_gully_map",
      nodeCount: nodes.length,
      riverCount: runtime.counts.riverCount || 0,
      streamCount: runtime.counts.streamCount || 0,
      gullyCount: runtime.counts.gullyCount || 0,
      waterPaths: compact ? runtime.waterPaths.map(compactPath) : runtime.waterPaths.map(deepClone),
      nodes: compact ? nodes.map(compactNode) : nodes.map(deepClone),
      waterFollowsElevation: true,
      waterRequiresPermission: true,
      carrierMayConsume: true,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getMarshWetlandMap(options) {
    return filteredMap("marsh_wetland_map", function (node) {
      return node.waterBehavior === "marsh_saturation" ||
        node.waterBehavior === "wetland_retention" ||
        node.primaryBehavior === "marsh_saturation" ||
        node.primaryBehavior === "wetland_retention";
    }, options);
  }

  function getChildReceivePacket(target, options) {
    refresh();

    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: target || "unassigned-hydration-edge-consumer",
      childReceivePacketReady: true,
      childType: CHILD_TYPE,

      upstreamGlobal: UPSTREAM_GLOBAL,
      upstreamDetected: runtime.upstreamDetected,
      upstreamComplete: runtime.upstreamComplete,

      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,

      hydrationEdgeScope256Active: true,
      waterBehaviorAuthorityActive: true,
      materialEdgeAuthorityActive: true,

      terrainAuthorityRetained: true,
      hydrationAuthorityRetained: true,
      carrierRenderAuthorityRetainedByCarrier: true,

      nodeCount: NODE_COUNT,
      edgeNodeCount: runtime.edgeNodes.length,
      waterNodeCount: runtime.waterNodes.length,
      materialNodeCount: runtime.materialNodes.length,

      beachCount: runtime.counts.beachCount || 0,
      cliffCount: runtime.counts.cliffCount || 0,
      waterfallCount: runtime.counts.waterfallCount || 0,
      shelfCount: runtime.counts.shelfCount || 0,
      sedimentCount: runtime.counts.sedimentCount || 0,
      rockCount: runtime.counts.rockCount || 0,
      sandCount: runtime.counts.sandCount || 0,
      poolCount: runtime.counts.poolCount || 0,
      riverCount: runtime.counts.riverCount || 0,
      streamCount: runtime.counts.streamCount || 0,
      gullyCount: runtime.counts.gullyCount || 0,
      marshCount: runtime.counts.marshCount || 0,
      wetlandCount: runtime.counts.wetlandCount || 0,
      deltaCount: runtime.counts.deltaCount || 0,

      waterFollowsElevation: true,
      waterRequiresPermission: true,
      waterfallRequiresFlowPlusDrop: true,
      beachRequiresSoftSedimentEdge: true,
      cliffRequiresHardElevationBreak: true,

      carrierMayConsume: true,
      carrierMayRender: true,
      carrierInventsEdge: false,
      carrierInventsWaterBehavior: false,

      status: status(),
      hydrationEdgeMap: getHydrationEdgeMap({ compact: compact }),
      waterBehaviorPacket: getWaterBehaviorPacket(target || "child-receive-packet", { compact: compact }),
      materialEdgeMap: getMaterialEdgeMap({ compact: compact }),
      beachMap: getBeachMap({ compact: compact }),
      cliffMap: getCliffMap({ compact: compact }),
      waterfallMap: getWaterfallMap({ compact: compact }),
      sedimentMap: getSedimentMap({ compact: compact }),
      rockMap: getRockMap({ compact: compact }),
      poolMap: getPoolMap({ compact: compact }),
      riverStreamMap: getRiverStreamMap({ compact: compact }),
      marshWetlandMap: getMarshWetlandMap({ compact: compact }),

      htmlUntouched: true,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      chemistryAuthoritySeized: false,
      ecologyAuthoritySeized: false,
      settlementAuthoritySeized: false,
      urbanAuthoritySeized: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEdgePassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function publishStaticGlobals() {
    if (typeof window === "undefined") return;

    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD_STATUS = {
      contract: CONTRACT,
      target: FILE,
      childType: CHILD_TYPE,
      hydrationEdgeScope256Active: true,
      waterBehaviorAuthorityActive: true,
      upstreamDetected: runtime.upstreamDetected,
      upstreamComplete: runtime.upstreamComplete,
      nodeCount: NODE_COUNT,
      edgeNodeCount: runtime.edgeNodes.length,
      beachCount: runtime.counts.beachCount || 0,
      cliffCount: runtime.counts.cliffCount || 0,
      waterfallCount: runtime.counts.waterfallCount || 0,
      shelfCount: runtime.counts.shelfCount || 0,
      sedimentCount: runtime.counts.sedimentCount || 0,
      rockCount: runtime.counts.rockCount || 0,
      sandCount: runtime.counts.sandCount || 0,
      poolCount: runtime.counts.poolCount || 0,
      riverCount: runtime.counts.riverCount || 0,
      streamCount: runtime.counts.streamCount || 0,
      gullyCount: runtime.counts.gullyCount || 0,
      marshCount: runtime.counts.marshCount || 0,
      wetlandCount: runtime.counts.wetlandCount || 0,
      deltaCount: runtime.counts.deltaCount || 0,
      carrierInventsEdge: false,
      carrierInventsWaterBehavior: false,
      finalVisualPassClaim: false,
      deployMarker: "AUDRALIA_GRATITUDE_HYDRATION_EDGE_WATER_BEHAVIOR_CHILD_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_GRATITUDE_WATER_BEHAVIOR_PACKET = {
      contract: CONTRACT,
      packetType: "gratitude_water_behavior_packet",
      waterBehaviorPacketReady: true,
      waterNodeCount: runtime.waterNodes.length,
      waterPaths: runtime.waterPaths.map(compactPath),
      waterNodes: runtime.waterNodes.map(compactNode),
      carrierMayConsume: true,
      carrierInventsWaterBehavior: false,
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

    refresh: refresh,
    status: status,
    getHydrationEdgeMap: getHydrationEdgeMap,
    getWaterBehaviorPacket: getWaterBehaviorPacket,
    getMaterialEdgeMap: getMaterialEdgeMap,
    getBeachMap: getBeachMap,
    getCliffMap: getCliffMap,
    getWaterfallMap: getWaterfallMap,
    getSedimentMap: getSedimentMap,
    getRockMap: getRockMap,
    getPoolMap: getPoolMap,
    getRiverStreamMap: getRiverStreamMap,
    getMarshWetlandMap: getMarshWetlandMap,
    getChildReceivePacket: getChildReceivePacket
  });

  if (typeof window !== "undefined") {
    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD = API;
    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD = API;
    window.AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD = API;

    refresh();
  }
})();
