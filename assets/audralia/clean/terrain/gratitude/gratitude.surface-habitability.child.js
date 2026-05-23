// /assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js
// AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_ONE_PUBLICATION_BINDING_TNT_v1
// Full-file replacement.
// Scope: Gratitude child 1 of 4.
// Purpose: publish land, elevation, above-sea-level, terrain readiness, ridges, basins, valleys, and summit anchors for compositor consumption.
// Does not own hydration motion, hydration-edge behavior, final composition, runtime drawing, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_ONE_PUBLICATION_BINDING_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js";

  var CHILD_TYPE = "gratitude_surface_habitability_child_1_of_4";
  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var SEA_LEVEL_DATUM = 0.32;
  var TAU = Math.PI * 2;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var MACRO = Object.freeze({
    centerX: 8.35,
    centerY: 8.05,
    radiusX: 4.70,
    radiusY: 3.05,
    rotation: -0.16
  });

  var SUMMITS = Object.freeze([
    Object.freeze({ id: "summit_01", name: "First Summit of Gratitude", x: 7.10, y: 5.20, pressure: 0.92 }),
    Object.freeze({ id: "summit_02", name: "Second Summit of Gratitude", x: 8.55, y: 5.05, pressure: 1.00 }),
    Object.freeze({ id: "summit_03", name: "Third Summit of Gratitude", x: 9.95, y: 5.55, pressure: 0.90 }),
    Object.freeze({ id: "summit_04", name: "Fourth Summit of Gratitude", x: 6.40, y: 7.35, pressure: 0.84 }),
    Object.freeze({ id: "summit_05", name: "Fifth Summit of Gratitude", x: 8.45, y: 7.55, pressure: 1.08 }),
    Object.freeze({ id: "summit_06", name: "Sixth Summit of Gratitude", x: 10.85, y: 7.75, pressure: 0.86 }),
    Object.freeze({ id: "summit_07", name: "Seventh Summit of Gratitude", x: 7.00, y: 9.72, pressure: 0.80 }),
    Object.freeze({ id: "summit_08", name: "Eighth Summit of Gratitude", x: 9.35, y: 9.95, pressure: 0.86 }),
    Object.freeze({ id: "summit_09", name: "Ninth Summit of Gratitude", x: 10.35, y: 10.85, pressure: 0.88 })
  ]);

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
    return JSON.parse(JSON.stringify(value));
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nodeId(x, y) {
    return "GRATITUDE-SURFACE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function rotateIntoMacro(x, y) {
    var dx = x - MACRO.centerX;
    var dy = y - MACRO.centerY;
    var c = Math.cos(MACRO.rotation);
    var s = Math.sin(MACRO.rotation);

    return {
      x: dx * c - dy * s,
      y: dx * s + dy * c
    };
  }

  function macroScore(x, y) {
    var p = rotateIntoMacro(x, y);
    var nx = p.x / MACRO.radiusX;
    var ny = p.y / MACRO.radiusY;

    var organicEdge =
      Math.sin((x + 0.9) * 1.43) * 0.052 +
      Math.cos((y + 2.4) * 1.17) * 0.043 +
      Math.sin((x * 0.66 + y * 1.08)) * 0.038 +
      Math.cos((x * 1.09 - y * 0.44)) * 0.020;

    return nx * nx + ny * ny - organicEdge;
  }

  function insideLand(x, y) {
    return macroScore(x, y) <= 1;
  }

  function coastPressure(x, y) {
    return clamp(1 - Math.abs(1 - macroScore(x, y)) / 0.34, 0, 1);
  }

  function summitPressure(x, y) {
    var total = 0;
    var max = 0;
    var nearest = null;
    var nearestDistance = Infinity;

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var d = distance(x, y, summit.x, summit.y);
      var pressure = clamp(1 - d / 2.08, 0, 1) * summit.pressure;

      total += pressure;
      max = Math.max(max, pressure);

      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = summit;
      }
    }

    return {
      total: clamp(total / 2.25, 0, 1),
      max: clamp(max, 0, 1),
      nearest: nearest,
      nearestDistance: nearestDistance
    };
  }

  function lineInfluence(px, py, ax, ay, bx, by, width, strength) {
    var vx = bx - ax;
    var vy = by - ay;
    var wx = px - ax;
    var wy = py - ay;
    var len2 = vx * vx + vy * vy;

    if (!len2) return 0;

    var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
    var cx = ax + t * vx;
    var cy = ay + t * vy;
    var d = distance(px, py, cx, cy);

    return strength * clamp(1 - d / width, 0, 1);
  }

  function gaussian(px, py, cx, cy, rx, ry, strength) {
    var dx = (px - cx) / rx;
    var dy = (py - cy) / ry;
    return strength * Math.exp(-(dx * dx + dy * dy));
  }

  function ridgePressure(x, y) {
    var ridge = 0;

    ridge += lineInfluence(x, y, 7.10, 5.20, 8.55, 5.05, 0.58, 0.38);
    ridge += lineInfluence(x, y, 8.55, 5.05, 9.95, 5.55, 0.58, 0.36);
    ridge += lineInfluence(x, y, 6.40, 7.35, 8.45, 7.55, 0.72, 0.32);
    ridge += lineInfluence(x, y, 8.45, 7.55, 10.85, 7.75, 0.72, 0.32);
    ridge += lineInfluence(x, y, 7.00, 9.72, 9.35, 9.95, 0.66, 0.26);
    ridge += lineInfluence(x, y, 8.55, 5.05, 8.45, 7.55, 0.62, 0.34);
    ridge += lineInfluence(x, y, 8.45, 7.55, 9.35, 9.95, 0.62, 0.30);

    return clamp(ridge, 0, 1);
  }

  function basinPressure(x, y) {
    return clamp(Math.max(
      gaussian(x, y, 8.70, 8.55, 1.35, 0.90, 0.64),
      gaussian(x, y, 9.35, 9.85, 1.40, 0.86, 0.52),
      gaussian(x, y, 7.05, 8.25, 1.00, 0.88, 0.38),
      gaussian(x, y, 10.40, 8.70, 1.02, 0.86, 0.36)
    ), 0, 1);
  }

  function valleyPressure(x, y) {
    var valley = 0;

    valley += lineInfluence(x, y, 8.55, 5.05, 8.75, 8.55, 0.54, 0.46);
    valley += lineInfluence(x, y, 8.75, 8.55, 9.35, 10.45, 0.56, 0.50);
    valley += lineInfluence(x, y, 6.40, 7.35, 8.75, 8.55, 0.48, 0.44);
    valley += lineInfluence(x, y, 10.85, 7.75, 8.75, 8.55, 0.48, 0.44);
    valley += lineInfluence(x, y, 7.00, 9.72, 9.35, 10.45, 0.40, 0.42);
    valley += lineInfluence(x, y, 10.35, 10.85, 9.35, 10.45, 0.38, 0.36);

    return clamp(valley, 0, 1);
  }

  function terrainClass(inside, elevation, summit, ridge, basin, valley, coast) {
    if (!inside) return "outside_context";
    if (summit.max > 0.70) return "summit_highland";
    if (ridge > 0.62) return "ridge_highland";
    if (basin > 0.60) return "basin_floor";
    if (valley > 0.58) return "valley_corridor";
    if (coast > 0.62) return "coastal_edge";
    if (elevation > 0.58) return "upland_slope";
    return "interior_plain";
  }

  function primaryCategory(tClass) {
    if (tClass === "outside_context") return "outside_context";
    if (tClass === "summit_highland") return "summit";
    if (tClass === "ridge_highland") return "ridge";
    if (tClass === "basin_floor") return "basin";
    if (tClass === "valley_corridor") return "valley";
    if (tClass === "coastal_edge") return "coast";
    if (tClass === "upland_slope") return "slope";
    return "surface";
  }

  function makeNode(x, y) {
    var index = y * RADIAL_NODES + x;
    var cx = x + 0.5;
    var cy = y + 0.5;
    var inside = insideLand(cx, cy);
    var summit = summitPressure(cx, cy);
    var ridge = inside ? ridgePressure(cx, cy) : 0;
    var basin = inside ? basinPressure(cx, cy) : 0;
    var valley = inside ? valleyPressure(cx, cy) : 0;
    var coast = inside ? coastPressure(cx, cy) : 0;

    var baseElevation = inside ? clamp(0.42 + (1 - macroScore(cx, cy)) * 0.09, 0.30, 0.64) : 0;
    var elevation = inside
      ? clamp(baseElevation + summit.total * 0.32 + ridge * 0.17 - basin * 0.20 - valley * 0.10 - coast * 0.035, 0.18, 0.94)
      : 0;

    var tClass = terrainClass(inside, elevation, summit, ridge, basin, valley, coast);
    var category = primaryCategory(tClass);
    var aboveSeaLevel = Boolean(inside && elevation >= SEA_LEVEL_DATUM);

    return Object.freeze({
      nodeId: nodeId(x, y),
      sourceNodeId: nodeId(x, y),
      seatIndex: index,
      nodeIndex: index,
      seatKey: seatKey(x, y),
      x: x,
      y: y,
      centerX: round(cx, 4),
      centerY: round(cy, 4),
      band: y,
      radial: x,
      fibonacci: FIBONACCI_SEQUENCE[y],

      continentMembership: inside,
      continentId: inside ? CONTINENT_ID : null,
      continentName: inside ? CONTINENT_NAME : null,

      primaryCategory: category,
      terrainClass: tClass,
      hydrationClass: inside ? "hydration_defined_downstream" : "outside_context",

      elevation: round(elevation, 4),
      unifiedElevation: round(elevation, 4),
      surfaceExpressionDatum: round(elevation, 4),
      baseElevation: round(baseElevation, 4),
      seaLevelDatum: SEA_LEVEL_DATUM,
      aboveSeaLevelMass: aboveSeaLevel,
      aboveSeaLevelMassDepth: round(aboveSeaLevel ? elevation - SEA_LEVEL_DATUM : 0, 4),

      summitInfluence: round(summit.total, 4),
      summitPressure: round(summit.max, 4),
      summitMaxInfluence: round(summit.max, 4),
      nearestSummitId: summit.nearest ? summit.nearest.id : null,
      nearestSummitName: summit.nearest ? summit.nearest.name : null,
      nearestSummitDistance: round(summit.nearestDistance, 4),

      ridgeInfluence: round(ridge, 4),
      ridgePressure: round(ridge, 4),
      basinInfluence: round(basin, 4),
      basinPressure: round(basin, 4),
      valleyInfluence: round(valley, 4),
      valleyPressure: round(valley, 4),
      coastInfluence: round(coast, 4),
      coastPressure: round(coast, 4),

      landAuthorityActive: true,
      elevationAuthorityActive: true,
      aboveSeaLevelAuthorityActive: true,
      surfaceHabitabilityAuthorityActive: true,
      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    });
  }

  function buildNodes() {
    var nodes = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        nodes.push(makeNode(x, y));
      }
    }

    return Object.freeze(nodes);
  }

  var NODES = buildNodes();
  var LAND_NODES = Object.freeze(NODES.filter(function (node) { return node.continentMembership; }));
  var SUMMIT_NODES = Object.freeze(NODES.filter(function (node) { return node.summitMaxInfluence > 0.34; }));

  function compactNode(node) {
    return {
      nodeId: node.nodeId,
      sourceNodeId: node.sourceNodeId,
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,
      x: node.x,
      y: node.y,
      continentMembership: node.continentMembership,
      terrainClass: node.terrainClass,
      primaryCategory: node.primaryCategory,
      elevation: node.elevation,
      unifiedElevation: node.unifiedElevation,
      seaLevelDatum: node.seaLevelDatum,
      aboveSeaLevelMass: node.aboveSeaLevelMass,
      summitInfluence: node.summitInfluence,
      ridgeInfluence: node.ridgeInfluence,
      basinInfluence: node.basinInfluence,
      valleyInfluence: node.valleyInfluence,
      coastInfluence: node.coastInfluence,
      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,
      childType: CHILD_TYPE,

      gratitudeChildNumber: "1-of-4",
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      surfaceHabitabilityAuthorityActive: true,
      landAuthorityActive: true,
      elevationAuthorityActive: true,
      aboveSeaLevelAuthorityActive: true,
      summitAnchorAuthorityActive: true,

      nodeCount: NODE_COUNT,
      landNodeCount: LAND_NODES.length,
      summitNodeCount: SUMMIT_NODES.length,
      seaLevelDatum: SEA_LEVEL_DATUM,

      carrierMayConsume: true,
      compositorMayConsume: true,

      hydrationAuthoritySeized: false,
      hydrationEdgeAuthoritySeized: false,
      compositorAuthoritySeized: false,
      carrierRuntimeAuthoritySeized: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false,

      deployMarker: "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_ONE_PUBLICATION_BINDING_DEPLOY_MARKER_v1"
    };
  }

  function getNodeMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      nodeMapReady: true,
      nodeCount: NODE_COUNT,
      nodes: compact ? NODES.map(compactNode) : NODES.map(clone),
      finalVisualPassClaim: false
    };
  }

  function getSurfaceMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      surfaceMapReady: true,
      surfaceHabitabilityAuthorityActive: true,
      landAuthorityActive: true,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      nodeCount: NODE_COUNT,
      landNodeCount: LAND_NODES.length,
      seats: compact ? NODES.map(compactNode) : NODES.map(clone),
      nodes: compact ? NODES.map(compactNode) : NODES.map(clone),
      landNodes: compact ? LAND_NODES.map(compactNode) : LAND_NODES.map(clone),
      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getElevationField(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      elevationFieldReady: true,
      elevationAuthorityActive: true,
      aboveSeaLevelAuthorityActive: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      nodes: compact ? NODES.map(compactNode) : NODES.map(clone),
      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getSummitInfluenceField(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      summitInfluenceFieldReady: true,
      summitAnchorAuthorityActive: true,
      summitsAreElevationAnchors: true,
      summitsAreNotIslands: true,
      summitCount: SUMMITS.length,
      summits: SUMMITS.map(clone),
      nodes: compact ? SUMMIT_NODES.map(compactNode) : SUMMIT_NODES.map(clone),
      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getSurfaceHabitabilityBlueprintPacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      target: target || "unassigned-surface-habitability-consumer",
      packetType: "surface_habitability_child_1_of_4_blueprint_packet",
      surfaceHabitabilityBlueprintPacketReady: true,

      gratitudeChildNumber: "1-of-4",
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      surfaceHabitabilityAuthorityActive: true,
      landAuthorityActive: true,
      elevationAuthorityActive: true,
      aboveSeaLevelAuthorityActive: true,

      seaLevelDatum: SEA_LEVEL_DATUM,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      nodeCount: NODE_COUNT,
      landNodeCount: LAND_NODES.length,
      summitCount: SUMMITS.length,

      surfaceMap: getSurfaceMap({ compact: true }),
      elevationField: getElevationField({ compact: true }),
      summitInfluenceField: getSummitInfluenceField({ compact: true }),
      nodes: compact ? NODES.map(compactNode) : NODES.map(clone),

      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function getChildReceivePacket(target, options) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-child-consumer",
      childReceivePacketReady: true,
      childType: CHILD_TYPE,

      gratitudeChildNumber: "1-of-4",
      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,

      surfaceHabitabilityAuthorityActive: true,
      landAuthorityActive: true,
      elevationAuthorityActive: true,
      aboveSeaLevelAuthorityActive: true,

      status: status(),
      surfaceMap: getSurfaceMap(options || { compact: true }),
      elevationField: getElevationField(options || { compact: true }),
      summitInfluenceField: getSummitInfluenceField(options || { compact: true }),
      blueprintPacket: getSurfaceHabitabilityBlueprintPacket(target || "child-receive", options || { compact: true }),

      carrierMayConsume: true,
      compositorMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    childType: CHILD_TYPE,

    status: status,
    getChildReceivePacket: getChildReceivePacket,
    getSurfaceMap: getSurfaceMap,
    getElevationField: getElevationField,
    getSummitInfluenceField: getSummitInfluenceField,
    getNodeMap: getNodeMap,
    getSurfaceHabitabilityBlueprintPacket: getSurfaceHabitabilityBlueprintPacket
  });

  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD = API;
  window.AUDRALIA_G2_GRATITUDE_SURFACE_HABITABILITY_CHILD = API;
  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_CHILD = API;

  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_STATUS = status();
  window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD_RECEIVE_PACKET = getChildReceivePacket(
    "published-static-surface-habitability-child-1-of-4",
    { compact: true }
  );
})();
