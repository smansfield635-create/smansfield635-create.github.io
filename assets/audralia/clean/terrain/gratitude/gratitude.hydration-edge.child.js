// /assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js
// AUDRALIA_GRATITUDE_HYDRATION_EDGE_BEACH_CLIFF_WATERFALL_CHILD_TNT_v1
// New downstream child file.
// Scope: Hydration-edge classification child downstream from Gratitude hydration authority.
// Purpose: classify the water-edge boundary into beaches, cliffs, and waterfall edges using existing terrain,
// hydration, elevation, basin, valley, coast, datum, and flow signals.
// Does not own: HTML, carrier rendering, Gratitude terrain authority, hydration truth, planet core,
// climate, atmosphere, ecology, settlement, Runtime / Strength activation, final terrain pass,
// final hydration pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_HYDRATION_EDGE_BEACH_CLIFF_WATERFALL_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.hydration-edge.child.js";
  var UPSTREAM_TERRAIN_FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";
  var UPSTREAM_HYDRATION_ROLE = "gratitude.hydration.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var CHILD_CLASS = "downstream_hydration_edge_beach_cliff_waterfall_classifier";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;

  var SEA_LEVEL_DATUM_FALLBACK = 0.32;
  var FINAL_TERRAIN_PASS_CLAIM = false;
  var FINAL_HYDRATION_PASS_CLAIM = false;
  var FINAL_VISUAL_PASS_CLAIM = false;
  var RUNTIME_STRENGTH_HELD = true;

  var EDGE_KIND = Object.freeze({
    BEACH: "beach_edge",
    CLIFF: "cliff_edge",
    WATERFALL: "waterfall_edge",
    MARSH_EDGE: "marsh_wetland_edge",
    SHELF_EDGE: "coastal_shelf_edge",
    DRY_EDGE: "dry_water_edge_candidate",
    OUTSIDE: "outside_edge_context"
  });

  var DOWNSTREAM_FILES = Object.freeze({
    beach: "/assets/audralia/clean/terrain/gratitude/hydration/gratitude.beaches.child.js",
    cliff: "/assets/audralia/clean/terrain/gratitude/hydration/gratitude.cliffs.child.js",
    waterfall: "/assets/audralia/clean/terrain/gratitude/hydration/gratitude.waterfalls.child.js",
    marshWetlandEdge: "/assets/audralia/clean/terrain/gratitude/hydration/gratitude.marsh-wetland-edge.child.js",
    shelfEdge: "/assets/audralia/clean/terrain/gratitude/hydration/gratitude.shelf-edge.child.js"
  });

  var NEWS_ORDER = Object.freeze(["north", "east", "west", "south"]);

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

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nodeId(x, y) {
    return "GRATITUDE-HYDRATION-EDGE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function getUpstreamAPI() {
    if (typeof window === "undefined") return null;
    return window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD ||
      window.AUDRALIA_GRATITUDE_CONTINENT_CHILD ||
      null;
  }

  function normalizeNode(raw, fallbackIndex) {
    raw = raw || {};

    var seatIndex = Number.isFinite(Number(raw.seatIndex))
      ? Number(raw.seatIndex)
      : Number.isFinite(Number(raw.nodeIndex))
        ? Number(raw.nodeIndex)
        : fallbackIndex || 0;

    var x = Number.isFinite(Number(raw.x))
      ? Number(raw.x)
      : Number.isFinite(Number(raw.centerX))
        ? Number(raw.centerX)
        : seatIndex % RADIAL_NODES;

    var y = Number.isFinite(Number(raw.y))
      ? Number(raw.y)
      : Number.isFinite(Number(raw.centerY))
        ? Number(raw.centerY)
        : Math.floor(seatIndex / RADIAL_NODES);

    var datum = raw.terrainDatum || {};
    var terrainDatumClass = String(datum.terrainDatumClass || raw.terrainDatumClass || "");
    var terrainClass = String(raw.terrainClass || terrainDatumClass || "surface_expression_datum");
    var hydrationClass = String(raw.hydrationClass || "dry_land");
    var primaryCategory = String(raw.primaryCategory || raw.category || "surface");

    var elevation = clamp(
      raw.elevation !== undefined
        ? raw.elevation
        : raw.surfaceExpressionDatum !== undefined
          ? raw.surfaceExpressionDatum
          : datum.surfaceExpressionDatum !== undefined
            ? datum.surfaceExpressionDatum
            : 0.44,
      0,
      1
    );

    var seaLevelDatum = clamp(
      raw.seaLevelDatum !== undefined
        ? raw.seaLevelDatum
        : datum.seaLevelDatum !== undefined
          ? datum.seaLevelDatum
          : SEA_LEVEL_DATUM_FALLBACK,
      0,
      1
    );

    var land = Boolean(
      raw.continentMembership === true ||
      raw.land === true ||
      raw.continentId === CONTINENT_ID ||
      raw.aboveSeaLevelMass === true ||
      datum.aboveSeaLevelMass === true
    );

    return Object.freeze({
      source: raw,
      nodeId: String(raw.nodeId || raw.sourceNodeId || nodeId(x, y)),
      seatKey: String(raw.seatKey || seatKey(x, y)),
      seatIndex: seatIndex,
      x: round(x, 4),
      y: round(y, 4),

      land: land,
      continentMembership: land,
      continentId: land ? CONTINENT_ID : null,
      continentName: land ? CONTINENT_NAME : null,

      primaryCategory: primaryCategory,
      terrainClass: terrainClass,
      hydrationClass: hydrationClass,
      terrainDatumClass: terrainDatumClass,

      elevation: round(elevation, 4),
      baseElevation: round(clamp(raw.baseElevation !== undefined ? raw.baseElevation : elevation, 0, 1), 4),
      seaLevelDatum: round(seaLevelDatum, 4),
      aboveSeaLevelMass: Boolean(land && elevation > seaLevelDatum),

      ridgePressure: round(clamp(raw.ridgePressure !== undefined ? raw.ridgePressure : terrainClass.indexOf("ridge") >= 0 ? 0.72 : 0, 0, 1), 4),
      summitPressure: round(clamp(raw.summitPressure !== undefined ? raw.summitPressure : terrainClass.indexOf("summit") >= 0 ? 0.72 : 0, 0, 1), 4),
      basinPressure: round(clamp(raw.basinPressure !== undefined ? raw.basinPressure : terrainClass.indexOf("basin") >= 0 ? 0.72 : 0, 0, 1), 4),
      valleyPressure: round(clamp(raw.valleyPressure !== undefined ? raw.valleyPressure : terrainClass.indexOf("valley") >= 0 ? 0.72 : 0, 0, 1), 4),
      coastPressure: round(clamp(raw.coastPressure !== undefined ? raw.coastPressure : terrainClass.indexOf("coast") >= 0 ? 0.72 : 0, 0, 1), 4),
      shelfPressure: round(clamp(raw.shelfPressure || 0, 0, 1), 4),
      marshPressure: round(clamp(raw.marshPressure !== undefined ? raw.marshPressure : hydrationClass.indexOf("marsh") >= 0 ? 0.72 : 0, 0, 1), 4),
      wetlandPressure: round(clamp(raw.wetlandPressure !== undefined ? raw.wetlandPressure : hydrationClass.indexOf("wetland") >= 0 ? 0.72 : 0, 0, 1), 4),
      hydrationPressure: round(clamp(raw.hydrationPressure !== undefined ? raw.hydrationPressure : raw.hydrationDepth || 0, 0, 1), 4),
      drainagePressure: round(clamp(raw.drainagePressure !== undefined ? raw.drainagePressure : raw.valleyPressure || 0, 0, 1), 4),
      runoffPressure: round(clamp(raw.runoffPressure || 0, 0, 1), 4),
      hydrationDepth: round(clamp(raw.hydrationDepth || 0, 0, 1), 4),

      waterFillEligible: Boolean(
        raw.waterFillEligible === true ||
        hydrationClass.indexOf("lake") >= 0 ||
        hydrationClass.indexOf("wetland") >= 0 ||
        hydrationClass.indexOf("marsh") >= 0 ||
        Number(raw.hydrationDepth || 0) > 0.025
      ),

      basinFloorDatum: round(clamp(raw.basinFloorDatum !== undefined ? raw.basinFloorDatum : datum.basinFloorDatum || 0, 0, 1), 4),
      valleyFloorDatum: round(clamp(raw.valleyFloorDatum !== undefined ? raw.valleyFloorDatum : datum.valleyFloorDatum || 0, 0, 1), 4),
      ridgeCrestDatum: round(clamp(raw.ridgeCrestDatum !== undefined ? raw.ridgeCrestDatum : datum.ridgeCrestDatum || 0, 0, 1), 4),
      coastDatum: round(clamp(raw.coastDatum !== undefined ? raw.coastDatum : datum.coastDatum || seaLevelDatum, 0, 1), 4),
      waterTableDatumHeld: round(clamp(raw.waterTableDatumHeld !== undefined ? raw.waterTableDatumHeld : datum.waterTableDatumHeld || 0, 0, 1), 4),

      mountainRangeReserved: Boolean(raw.mountainRangeReserved === true || datum.mountainRangeReserved === true),
      desertLandReserved: Boolean(raw.desertLandReserved === true || datum.desertLandReserved === true),
      dryBasinReserved: Boolean(raw.dryBasinReserved === true || datum.dryBasinReserved === true),
      rainShadowZoneReserved: Boolean(raw.rainShadowZoneReserved === true || datum.rainShadowZoneReserved === true)
    });
  }

  function buildNodeIndex(nodes) {
    var index = {};
    nodes.forEach(function (node) {
      index[node.seatKey] = node;
      index[Math.round(node.x) + ":" + Math.round(node.y)] = node;
    });
    return index;
  }

  function neighborCoords(node) {
    var x = Math.round(node.x);
    var y = Math.round(node.y);

    return [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y - 1 }
    ].filter(function (point) {
      return point.x >= 0 && point.x < RADIAL_NODES && point.y >= 0 && point.y < FIBONACCI_BANDS;
    });
  }

  function waterPresence(node) {
    var classText = node.hydrationClass + " " + node.primaryCategory + " " + node.terrainDatumClass;

    var classWater = (
      classText.indexOf("lake") >= 0 ||
      classText.indexOf("wetland") >= 0 ||
      classText.indexOf("marsh") >= 0 ||
      classText.indexOf("coast") >= 0 ||
      classText.indexOf("shelf") >= 0 ||
      classText.indexOf("hydration") >= 0 ||
      classText.indexOf("drainage") >= 0
    ) ? 0.35 : 0;

    return clamp(
      node.hydrationDepth * 0.42 +
      node.hydrationPressure * 0.26 +
      node.basinPressure * 0.12 +
      node.valleyPressure * 0.10 +
      node.marshPressure * 0.22 +
      node.wetlandPressure * 0.22 +
      node.coastPressure * 0.20 +
      classWater +
      (node.waterFillEligible ? 0.18 : 0),
      0,
      1.35
    );
  }

  function landEdgePressure(node, neighbors) {
    var outsideCount = 0;
    var waterCount = 0;
    var lowerWaterCount = 0;

    neighbors.forEach(function (neighbor) {
      if (!neighbor || !neighbor.land) outsideCount += 1;
      if (neighbor && waterPresence(neighbor) > 0.30) waterCount += 1;
      if (neighbor && waterPresence(neighbor) > 0.30 && neighbor.elevation <= node.elevation + 0.045) lowerWaterCount += 1;
    });

    return clamp(
      node.coastPressure * 0.38 +
      node.shelfPressure * 0.18 +
      waterPresence(node) * 0.24 +
      outsideCount * 0.055 +
      waterCount * 0.075 +
      lowerWaterCount * 0.08,
      0,
      1
    );
  }

  function slopePressure(node, neighbors) {
    if (!neighbors.length) return 0;

    var maxDelta = 0;
    var totalDelta = 0;

    neighbors.forEach(function (neighbor) {
      if (!neighbor) return;
      var delta = Math.abs(node.elevation - neighbor.elevation);
      maxDelta = Math.max(maxDelta, delta);
      totalDelta += delta;
    });

    return clamp(maxDelta * 2.6 + (totalDelta / neighbors.length) * 1.4 + node.ridgePressure * 0.32 + node.summitPressure * 0.26, 0, 1);
  }

  function dropToWaterPressure(node, neighbors) {
    var maxDrop = 0;

    neighbors.forEach(function (neighbor) {
      if (!neighbor) return;
      if (waterPresence(neighbor) < 0.25 && !neighbor.waterFillEligible) return;
      maxDrop = Math.max(maxDrop, node.elevation - neighbor.elevation);
    });

    return clamp(maxDrop * 3.6 + node.runoffPressure * 0.28 + node.drainagePressure * 0.22, 0, 1);
  }

  function beachPressure(node, edge, slope, drop) {
    var lowSlope = clamp(1 - slope * 1.18, 0, 1);
    var nearSea = clamp(1 - Math.abs(node.elevation - node.seaLevelDatum) / 0.24, 0, 1);
    var sediment = clamp(node.basinPressure * 0.20 + node.valleyPressure * 0.18 + node.coastPressure * 0.20 + node.waterTableDatumHeld * 0.10, 0, 1);
    var notMountain = clamp(1 - node.ridgePressure * 0.86 - node.summitPressure * 0.72, 0, 1);
    var notDrop = clamp(1 - drop * 1.35, 0, 1);

    return clamp(edge * 0.30 + lowSlope * 0.24 + nearSea * 0.24 + sediment * 0.18 + notMountain * 0.18 + notDrop * 0.16, 0, 1);
  }

  function cliffPressure(node, edge, slope, drop) {
    var ridge = clamp(node.ridgePressure * 0.38 + node.summitPressure * 0.26 + node.ridgeCrestDatum * 0.10, 0, 1);
    var height = clamp((node.elevation - node.seaLevelDatum) * 2.2, 0, 1);
    return clamp(edge * 0.24 + slope * 0.34 + drop * 0.22 + ridge * 0.22 + height * 0.16, 0, 1);
  }

  function waterfallPressure(node, edge, slope, drop) {
    var flow = clamp(node.runoffPressure * 0.26 + node.drainagePressure * 0.34 + node.valleyPressure * 0.22 + node.hydrationPressure * 0.12, 0, 1);
    var sourceHeight = clamp((node.elevation - node.seaLevelDatum) * 2.1, 0, 1);
    return clamp(edge * 0.20 + drop * 0.38 + flow * 0.30 + slope * 0.16 + sourceHeight * 0.12, 0, 1);
  }

  function marshEdgePressure(node, edge) {
    return clamp(edge * 0.22 + node.marshPressure * 0.34 + node.wetlandPressure * 0.34 + waterPresence(node) * 0.16, 0, 1);
  }

  function classifyEdge(node, neighborList) {
    var edge = landEdgePressure(node, neighborList);
    var slope = slopePressure(node, neighborList);
    var drop = dropToWaterPressure(node, neighborList);
    var beach = beachPressure(node, edge, slope, drop);
    var cliff = cliffPressure(node, edge, slope, drop);
    var waterfall = waterfallPressure(node, edge, slope, drop);
    var marshEdge = marshEdgePressure(node, edge);
    var shelf = clamp(node.shelfPressure * 0.42 + node.coastPressure * 0.30 + waterPresence(node) * 0.16, 0, 1);

    var kind = EDGE_KIND.OUTSIDE;
    var downstreamFile = null;
    var confidence = 0;

    if (!node.land) {
      kind = EDGE_KIND.OUTSIDE;
      confidence = 0;
    } else if (waterfall >= 0.46 && drop >= 0.24) {
      kind = EDGE_KIND.WATERFALL;
      downstreamFile = DOWNSTREAM_FILES.waterfall;
      confidence = waterfall;
    } else if (cliff >= 0.52 && slope >= 0.36) {
      kind = EDGE_KIND.CLIFF;
      downstreamFile = DOWNSTREAM_FILES.cliff;
      confidence = cliff;
    } else if (beach >= 0.46 && edge >= 0.28) {
      kind = EDGE_KIND.BEACH;
      downstreamFile = DOWNSTREAM_FILES.beach;
      confidence = beach;
    } else if (marshEdge >= 0.48) {
      kind = EDGE_KIND.MARSH_EDGE;
      downstreamFile = DOWNSTREAM_FILES.marshWetlandEdge;
      confidence = marshEdge;
    } else if (shelf >= 0.44) {
      kind = EDGE_KIND.SHELF_EDGE;
      downstreamFile = DOWNSTREAM_FILES.shelfEdge;
      confidence = shelf;
    } else if (edge >= 0.24) {
      kind = EDGE_KIND.DRY_EDGE;
      downstreamFile = DOWNSTREAM_FILES.beach;
      confidence = edge;
    }

    return Object.freeze({
      edgeId: "EDGE-" + node.nodeId,
      sourceNodeId: node.nodeId,
      seatKey: node.seatKey,
      seatIndex: node.seatIndex,
      x: node.x,
      y: node.y,

      edgeKind: kind,
      downstreamFile: downstreamFile,
      confidence: round(confidence, 4),

      edgePressure: round(edge, 4),
      slopePressure: round(slope, 4),
      dropToWaterPressure: round(drop, 4),
      beachPressure: round(beach, 4),
      cliffPressure: round(cliff, 4),
      waterfallPressure: round(waterfall, 4),
      marshEdgePressure: round(marshEdge, 4),
      shelfEdgePressure: round(shelf, 4),

      elevation: node.elevation,
      seaLevelDatum: node.seaLevelDatum,
      hydrationDepth: node.hydrationDepth,
      hydrationClass: node.hydrationClass,
      terrainClass: node.terrainClass,
      terrainDatumClass: node.terrainDatumClass,

      beachCandidate: beach >= 0.42,
      cliffCandidate: cliff >= 0.46,
      waterfallCandidate: waterfall >= 0.42 && drop >= 0.18,
      marshWetlandEdgeCandidate: marshEdge >= 0.44,
      shelfEdgeCandidate: shelf >= 0.40,

      landAuthoritySource: UPSTREAM_TERRAIN_FILE,
      hydrationAuthoritySource: UPSTREAM_HYDRATION_ROLE,
      carrierMayRender: true,
      childMayExpand: true,
      terrainTruthInvented: false,
      hydrationTruthInvented: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function makeNEWS(edge) {
    return Object.freeze({
      complete: true,
      north: Object.freeze({
        defined: true,
        order: 1,
        role: "source_edge_condition",
        sourceNodeId: edge.sourceNodeId,
        seatKey: edge.seatKey,
        seaLevelDatum: edge.seaLevelDatum,
        hydrationAuthoritySource: UPSTREAM_HYDRATION_ROLE
      }),
      east: Object.freeze({
        defined: true,
        order: 2,
        role: "edge_expression_category",
        edgeKind: edge.edgeKind,
        beachCandidate: edge.beachCandidate,
        cliffCandidate: edge.cliffCandidate,
        waterfallCandidate: edge.waterfallCandidate,
        confidence: edge.confidence
      }),
      west: Object.freeze({
        defined: true,
        order: 3,
        role: "constraint_and_authority_boundary",
        carrierMayRender: edge.carrierMayRender,
        childMayExpand: edge.childMayExpand,
        terrainTruthInvented: false,
        hydrationTruthInvented: false,
        finalVisualPassClaim: false
      }),
      south: Object.freeze({
        defined: true,
        order: 4,
        role: "downstream_file_socket",
        downstreamFile: edge.downstreamFile,
        runtimeStrengthHeld: RUNTIME_STRENGTH_HELD
      })
    });
  }

  function buildMapsFromUpstream() {
    var api = getUpstreamAPI();
    var status = null;
    var childPacket = null;
    var surfaceMap = null;
    var hydrationMap = null;
    var terrainDatumPacket = null;

    if (!api) {
      return {
        upstreamDetected: false,
        upstreamValidated: false,
        failureReason: "Upstream Gratitude terrain/hydration API unavailable.",
        nodes: [],
        edges: []
      };
    }

    try {
      status = typeof api.status === "function" ? api.status() : null;
      childPacket = typeof api.getChildReceivePacket === "function"
        ? api.getChildReceivePacket("gratitude-hydration-edge-beach-cliff-waterfall-child", { compact: false })
        : null;
      surfaceMap = typeof api.getSurfaceMap === "function"
        ? api.getSurfaceMap({ compact: false })
        : typeof api.getContinentMap === "function"
          ? api.getContinentMap({ compact: false })
          : null;
      hydrationMap = typeof api.getHydrationMap === "function" ? api.getHydrationMap({ compact: false }) : null;
      terrainDatumPacket = typeof api.getTerrainDatumPacket === "function"
        ? api.getTerrainDatumPacket("gratitude-hydration-edge-beach-cliff-waterfall-child", { compact: false })
        : childPacket && childPacket.terrainDatumPacket
          ? childPacket.terrainDatumPacket
          : null;
    } catch (error) {
      return {
        upstreamDetected: true,
        upstreamValidated: false,
        failureReason: "Upstream packet read exception: " + (error && error.message ? error.message : String(error)),
        nodes: [],
        edges: []
      };
    }

    var rawNodes = [];

    if (surfaceMap && Array.isArray(surfaceMap.nodes)) rawNodes = rawNodes.concat(surfaceMap.nodes);
    if (surfaceMap && Array.isArray(surfaceMap.seats)) rawNodes = rawNodes.concat(surfaceMap.seats);
    if (!rawNodes.length && childPacket && childPacket.surfaceMap && Array.isArray(childPacket.surfaceMap.nodes)) {
      rawNodes = rawNodes.concat(childPacket.surfaceMap.nodes);
    }

    var terrainDatumNodes = terrainDatumPacket && Array.isArray(terrainDatumPacket.datumNodes)
      ? terrainDatumPacket.datumNodes
      : [];

    var datumByKey = {};
    terrainDatumNodes.forEach(function (datum) {
      var x = Math.round(Number(datum.x) || 0);
      var y = Math.round(Number(datum.y) || 0);
      datumByKey[x + ":" + y] = datum;
    });

    var nodes = rawNodes.map(function (raw, index) {
      var normalized = normalizeNode(raw, index);
      var datum = datumByKey[Math.round(normalized.x) + ":" + Math.round(normalized.y)];
      if (!datum) return normalized;

      var merged = deepClone(raw);
      merged.terrainDatum = datum;
      merged.terrainDatumClass = datum.terrainDatumClass;
      merged.seaLevelDatum = datum.seaLevelDatum;
      merged.surfaceExpressionDatum = datum.surfaceExpressionDatum;
      merged.basinFloorDatum = datum.basinFloorDatum;
      merged.valleyFloorDatum = datum.valleyFloorDatum;
      merged.ridgeCrestDatum = datum.ridgeCrestDatum;
      merged.coastDatum = datum.coastDatum;
      merged.waterTableDatumHeld = datum.waterTableDatumHeld;
      merged.mountainRangeReserved = datum.mountainRangeReserved;
      merged.desertLandReserved = datum.desertLandReserved;
      merged.dryBasinReserved = datum.dryBasinReserved;
      merged.rainShadowZoneReserved = datum.rainShadowZoneReserved;

      return normalizeNode(merged, index);
    }).filter(function (node) {
      return node.land;
    });

    var indexByCoord = buildNodeIndex(nodes);
    var edges = [];

    nodes.forEach(function (node) {
      var neighbors = neighborCoords(node).map(function (point) {
        return indexByCoord[point.x + ":" + point.y] || null;
      });

      var edge = classifyEdge(node, neighbors);

      if (edge.edgeKind !== EDGE_KIND.OUTSIDE && edge.confidence > 0) {
        var edgeWithNEWS = deepClone(edge);
        edgeWithNEWS.NEWS = makeNEWS(edge);
        edgeWithNEWS.newsComplete = true;
        edges.push(Object.freeze(edgeWithNEWS));
      }
    });

    return {
      upstreamDetected: true,
      upstreamValidated: Boolean(
        childPacket &&
        childPacket.childReceivePacketReady === true &&
        childPacket.landFirst === true &&
        childPacket.hydrationIsConsequence === true &&
        childPacket.finalVisualPassClaim === false
      ),
      failureReason: "",
      upstreamStatus: status,
      childPacket: childPacket,
      surfaceMap: surfaceMap,
      hydrationMap: hydrationMap,
      terrainDatumPacket: terrainDatumPacket,
      nodes: nodes,
      edges: edges
    };
  }

  var BUILD = buildMapsFromUpstream();
  var NODES = Object.freeze(BUILD.nodes || []);
  var EDGES = Object.freeze(BUILD.edges || []);

  var BEACH_EDGES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.BEACH; }));
  var CLIFF_EDGES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.CLIFF; }));
  var WATERFALL_EDGES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.WATERFALL; }));
  var MARSH_WETLAND_EDGES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.MARSH_EDGE; }));
  var SHELF_EDGES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.SHELF_EDGE; }));
  var DRY_EDGE_CANDIDATES = Object.freeze(EDGES.filter(function (edge) { return edge.edgeKind === EDGE_KIND.DRY_EDGE; }));

  function countEdgesByKind() {
    var counts = {};
    Object.keys(EDGE_KIND).forEach(function (key) {
      counts[EDGE_KIND[key]] = 0;
    });

    EDGES.forEach(function (edge) {
      counts[edge.edgeKind] = (counts[edge.edgeKind] || 0) + 1;
    });

    return counts;
  }

  function averageConfidence(edges) {
    if (!edges.length) return 0;
    var total = 0;
    edges.forEach(function (edge) {
      total += edge.confidence;
    });
    return round(total / edges.length, 4);
  }

  function getClassificationHealth() {
    var classified = BEACH_EDGES.length + CLIFF_EDGES.length + WATERFALL_EDGES.length + MARSH_WETLAND_EDGES.length + SHELF_EDGES.length + DRY_EDGE_CANDIDATES.length;
    var requiredMinimum = NODES.length ? Math.max(1, Math.floor(NODES.length * 0.12)) : 0;

    return {
      classificationReady: Boolean(BUILD.upstreamValidated && classified >= requiredMinimum),
      upstreamDetected: BUILD.upstreamDetected,
      upstreamValidated: BUILD.upstreamValidated,
      nodeCount: NODES.length,
      edgeCount: EDGES.length,
      classifiedEdgeCount: classified,
      requiredMinimumEdgeCount: requiredMinimum,
      beachCount: BEACH_EDGES.length,
      cliffCount: CLIFF_EDGES.length,
      waterfallCount: WATERFALL_EDGES.length,
      marshWetlandEdgeCount: MARSH_WETLAND_EDGES.length,
      shelfEdgeCount: SHELF_EDGES.length,
      dryEdgeCandidateCount: DRY_EDGE_CANDIDATES.length,
      averageBeachConfidence: averageConfidence(BEACH_EDGES),
      averageCliffConfidence: averageConfidence(CLIFF_EDGES),
      averageWaterfallConfidence: averageConfidence(WATERFALL_EDGES),
      failureReason: BUILD.failureReason || ""
    };
  }

  var HEALTH = Object.freeze(getClassificationHealth());

  function compactEdge(edge) {
    return {
      edgeId: edge.edgeId,
      sourceNodeId: edge.sourceNodeId,
      seatKey: edge.seatKey,
      x: edge.x,
      y: edge.y,
      edgeKind: edge.edgeKind,
      downstreamFile: edge.downstreamFile,
      confidence: edge.confidence,
      beachPressure: edge.beachPressure,
      cliffPressure: edge.cliffPressure,
      waterfallPressure: edge.waterfallPressure,
      elevation: edge.elevation,
      seaLevelDatum: edge.seaLevelDatum,
      hydrationDepth: edge.hydrationDepth
    };
  }

  function status() {
    return {
      contract: CONTRACT,
      target: FILE,
      upstreamTerrainFile: UPSTREAM_TERRAIN_FILE,
      upstreamHydrationRole: UPSTREAM_HYDRATION_ROLE,

      childType: "gratitude_hydration_edge_child",
      childClass: CHILD_CLASS,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,

      downstreamFromHydration: true,
      beachCliffWaterfallEdgeClassifier: true,
      waterEdgeCanBeBeachCliffOrWaterfall: true,

      upstreamDetected: BUILD.upstreamDetected,
      upstreamValidated: BUILD.upstreamValidated,
      failureReason: BUILD.failureReason || "",

      nodeCount: NODES.length,
      edgeCount: EDGES.length,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: EDGES.every(function (edge) { return edge.newsComplete === true && edge.NEWS && edge.NEWS.complete === true; }),

      beachEdgesMapped: true,
      cliffEdgesMapped: true,
      waterfallEdgesMapped: true,
      marshWetlandEdgesMapped: true,
      shelfEdgesMapped: true,
      dryEdgeCandidatesMapped: true,

      beachCount: BEACH_EDGES.length,
      cliffCount: CLIFF_EDGES.length,
      waterfallCount: WATERFALL_EDGES.length,
      marshWetlandEdgeCount: MARSH_WETLAND_EDGES.length,
      shelfEdgeCount: SHELF_EDGES.length,
      dryEdgeCandidateCount: DRY_EDGE_CANDIDATES.length,

      edgeKindCounts: countEdgesByKind(),
      classificationHealth: deepClone(HEALTH),

      downstreamFiles: deepClone(DOWNSTREAM_FILES),
      downstreamFilesRequiredForFinalExpression: true,
      carrierMayRenderSummary: true,
      carrierMayNotInventTerrain: true,
      carrierMayNotInventHydration: true,

      terrainTruthInvented: false,
      hydrationTruthInvented: false,
      terrainAuthorityRetainedByUpstream: true,
      hydrationAuthorityRetainedByUpstream: true,
      ecologySocketHeld: true,
      settlementSocketHeld: true,
      runtimeStrengthHeld: RUNTIME_STRENGTH_HELD,
      finalTerrainPassClaim: FINAL_TERRAIN_PASS_CLAIM,
      finalHydrationPassClaim: FINAL_HYDRATION_PASS_CLAIM,
      finalVisualPassClaim: FINAL_VISUAL_PASS_CLAIM,

      generatedImage: false,
      graphicBox: false,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      deployMarker: "AUDRALIA_GRATITUDE_HYDRATION_EDGE_BEACH_CLIFF_WATERFALL_CHILD_DEPLOY_MARKER_v1"
    };
  }

  function getEdgeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      edgeMapReady: true,
      downstreamFromHydration: true,
      waterEdgeCanBeBeachCliffOrWaterfall: true,
      nodeCount: NODES.length,
      edgeCount: EDGES.length,
      classificationHealth: deepClone(HEALTH),
      edgeKindCounts: countEdgesByKind(),
      edges: compact ? EDGES.map(compactEdge) : EDGES.map(deepClone)
    };
  }

  function getBeachMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      beachMapReady: true,
      downstreamFile: DOWNSTREAM_FILES.beach,
      edgeKind: EDGE_KIND.BEACH,
      edgeCount: BEACH_EDGES.length,
      averageConfidence: averageConfidence(BEACH_EDGES),
      edges: compact ? BEACH_EDGES.map(compactEdge) : BEACH_EDGES.map(deepClone)
    };
  }

  function getCliffMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      cliffMapReady: true,
      downstreamFile: DOWNSTREAM_FILES.cliff,
      edgeKind: EDGE_KIND.CLIFF,
      edgeCount: CLIFF_EDGES.length,
      averageConfidence: averageConfidence(CLIFF_EDGES),
      edges: compact ? CLIFF_EDGES.map(compactEdge) : CLIFF_EDGES.map(deepClone)
    };
  }

  function getWaterfallEdgeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      waterfallEdgeMapReady: true,
      downstreamFile: DOWNSTREAM_FILES.waterfall,
      edgeKind: EDGE_KIND.WATERFALL,
      edgeCount: WATERFALL_EDGES.length,
      averageConfidence: averageConfidence(WATERFALL_EDGES),
      edges: compact ? WATERFALL_EDGES.map(compactEdge) : WATERFALL_EDGES.map(deepClone)
    };
  }

  function getMarshWetlandEdgeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      marshWetlandEdgeMapReady: true,
      downstreamFile: DOWNSTREAM_FILES.marshWetlandEdge,
      edgeKind: EDGE_KIND.MARSH_EDGE,
      edgeCount: MARSH_WETLAND_EDGES.length,
      averageConfidence: averageConfidence(MARSH_WETLAND_EDGES),
      edges: compact ? MARSH_WETLAND_EDGES.map(compactEdge) : MARSH_WETLAND_EDGES.map(deepClone)
    };
  }

  function getShelfEdgeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      shelfEdgeMapReady: true,
      downstreamFile: DOWNSTREAM_FILES.shelfEdge,
      edgeKind: EDGE_KIND.SHELF_EDGE,
      edgeCount: SHELF_EDGES.length,
      averageConfidence: averageConfidence(SHELF_EDGES),
      edges: compact ? SHELF_EDGES.map(compactEdge) : SHELF_EDGES.map(deepClone)
    };
  }

  function getNEWSMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: EDGES.every(function (edge) { return edge.NEWS && edge.NEWS.complete === true; }),
      edgeCount: EDGES.length,
      edges: compact ? EDGES.map(function (edge) {
        return {
          edgeId: edge.edgeId,
          complete: edge.NEWS && edge.NEWS.complete === true,
          north: edge.NEWS && edge.NEWS.north && edge.NEWS.north.defined === true,
          east: edge.NEWS && edge.NEWS.east && edge.NEWS.east.defined === true,
          west: edge.NEWS && edge.NEWS.west && edge.NEWS.west.defined === true,
          south: edge.NEWS && edge.NEWS.south && edge.NEWS.south.defined === true,
          edgeKind: edge.edgeKind
        };
      }) : EDGES.map(function (edge) {
        return {
          edgeId: edge.edgeId,
          NEWS: deepClone(edge.NEWS)
        };
      })
    };
  }

  function getDownstreamRegistry() {
    return {
      contract: CONTRACT,
      downstreamRegistryReady: true,
      files: deepClone(DOWNSTREAM_FILES),
      streams: [
        {
          streamId: "beachEdgeStream",
          edgeKind: EDGE_KIND.BEACH,
          downstreamFile: DOWNSTREAM_FILES.beach,
          edgeCount: BEACH_EDGES.length,
          activationHeld: true
        },
        {
          streamId: "cliffEdgeStream",
          edgeKind: EDGE_KIND.CLIFF,
          downstreamFile: DOWNSTREAM_FILES.cliff,
          edgeCount: CLIFF_EDGES.length,
          activationHeld: true
        },
        {
          streamId: "waterfallEdgeStream",
          edgeKind: EDGE_KIND.WATERFALL,
          downstreamFile: DOWNSTREAM_FILES.waterfall,
          edgeCount: WATERFALL_EDGES.length,
          activationHeld: true
        },
        {
          streamId: "marshWetlandEdgeStream",
          edgeKind: EDGE_KIND.MARSH_EDGE,
          downstreamFile: DOWNSTREAM_FILES.marshWetlandEdge,
          edgeCount: MARSH_WETLAND_EDGES.length,
          activationHeld: true
        },
        {
          streamId: "shelfEdgeStream",
          edgeKind: EDGE_KIND.SHELF_EDGE,
          downstreamFile: DOWNSTREAM_FILES.shelfEdge,
          edgeCount: SHELF_EDGES.length,
          activationHeld: true
        }
      ],
      downstreamFilesCreated: false,
      downstreamFilesRequiredForFullExpression: true
    };
  }

  function getChildReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "unassigned-hydration-edge-consumer",
      childReceivePacketReady: true,

      childType: "gratitude_hydration_edge_child",
      childClass: CHILD_CLASS,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,

      downstreamFromHydration: true,
      beachCliffWaterfallEdgeClassifier: true,
      waterEdgeCanBeBeachCliffOrWaterfall: true,

      upstreamTerrainFile: UPSTREAM_TERRAIN_FILE,
      upstreamHydrationRole: UPSTREAM_HYDRATION_ROLE,
      upstreamDetected: BUILD.upstreamDetected,
      upstreamValidated: BUILD.upstreamValidated,
      failureReason: BUILD.failureReason || "",

      nodeCount: NODES.length,
      edgeCount: EDGES.length,
      beachCount: BEACH_EDGES.length,
      cliffCount: CLIFF_EDGES.length,
      waterfallCount: WATERFALL_EDGES.length,
      marshWetlandEdgeCount: MARSH_WETLAND_EDGES.length,
      shelfEdgeCount: SHELF_EDGES.length,
      dryEdgeCandidateCount: DRY_EDGE_CANDIDATES.length,

      classificationHealth: deepClone(HEALTH),

      edgeMap: getEdgeMap({ compact: compact }),
      beachMap: getBeachMap({ compact: compact }),
      cliffMap: getCliffMap({ compact: compact }),
      waterfallEdgeMap: getWaterfallEdgeMap({ compact: compact }),
      marshWetlandEdgeMap: getMarshWetlandEdgeMap({ compact: compact }),
      shelfEdgeMap: getShelfEdgeMap({ compact: compact }),
      newsMap: getNEWSMap({ compact: compact }),
      downstreamRegistry: getDownstreamRegistry(),

      carrierMayRenderSummary: true,
      childMayExpand: true,
      terrainTruthInvented: false,
      hydrationTruthInvented: false,
      terrainAuthorityRetainedByUpstream: true,
      hydrationAuthorityRetainedByUpstream: true,

      runtimeStrengthHeld: RUNTIME_STRENGTH_HELD,
      finalTerrainPassClaim: FINAL_TERRAIN_PASS_CLAIM,
      finalHydrationPassClaim: FINAL_HYDRATION_PASS_CLAIM,
      finalVisualPassClaim: FINAL_VISUAL_PASS_CLAIM,

      status: status()
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    file: FILE,
    upstreamTerrainFile: UPSTREAM_TERRAIN_FILE,
    upstreamHydrationRole: UPSTREAM_HYDRATION_ROLE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    childClass: CHILD_CLASS,

    status: status,
    getEdgeMap: getEdgeMap,
    getBeachMap: getBeachMap,
    getCliffMap: getCliffMap,
    getWaterfallEdgeMap: getWaterfallEdgeMap,
    getMarshWetlandEdgeMap: getMarshWetlandEdgeMap,
    getShelfEdgeMap: getShelfEdgeMap,
    getNEWSMap: getNEWSMap,
    getDownstreamRegistry: getDownstreamRegistry,
    getChildReceivePacket: getChildReceivePacket
  });

  if (typeof window !== "undefined") {
    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD = API;
    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD_STATUS = status();
    window.AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD_RECEIVE_PACKET = getChildReceivePacket(
      "published-static-hydration-edge-beach-cliff-waterfall-child",
      { compact: true }
    );
    window.AUDRALIA_GRATITUDE_BEACH_MAP = getBeachMap({ compact: true });
    window.AUDRALIA_GRATITUDE_CLIFF_MAP = getCliffMap({ compact: true });
    window.AUDRALIA_GRATITUDE_WATERFALL_EDGE_MAP = getWaterfallEdgeMap({ compact: true });
  }
})();
