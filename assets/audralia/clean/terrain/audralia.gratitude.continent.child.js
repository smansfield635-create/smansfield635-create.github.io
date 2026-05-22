// /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js
// AUDRALIA_GRATITUDE_TERRAIN_ENGINE_SURFACE_HABITABILITY_BLUEPRINT_REGISTRY_ALIGNMENT_TNT_v1
// Full-file replacement.
// Scope: Gratitude upstream continent classification and stream-routing engine.
// Purpose: preserve the 256-node terrain engine while adding surface-habitability downstream registry,
// reciprocal blueprint intake readiness, and terrain datum packets for sea-level/elevation/basin/valley/ridge/coast alignment.
// Does not own: HTML, script tags, cache keys, carrier rendering, planet core, hydration child,
// surface-habitability child, climate authority, atmosphere authority, ecology activation,
// settlement activation, urban activation, Runtime / Strength activation, final terrain pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_TERRAIN_ENGINE_SURFACE_HABITABILITY_BLUEPRINT_REGISTRY_ALIGNMENT_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_256_NEWS_COHERENCE_MULTISTREAM_RENDER_OPTIMIZATION_ENGINE_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var ENGINE_CLASS = "upstream_continent_classification_and_multistream_render_optimization_engine";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var TAU = Math.PI * 2;

  var SEA_LEVEL_DATUM = 0.32;
  var COASTAL_DATUM_TOLERANCE = 0.055;
  var WATER_TABLE_HELD_OFFSET = 0.035;

  var FINAL_TERRAIN_PASS_CLAIM = false;
  var FINAL_HYDRATION_PASS_CLAIM = false;
  var FINAL_ECOLOGY_PASS_CLAIM = false;
  var FINAL_SETTLEMENT_PASS_CLAIM = false;
  var FINAL_VISUAL_PASS_CLAIM = false;
  var RUNTIME_STRENGTH_HELD = true;

  var NEWS_ORDER = Object.freeze(["north", "east", "west", "south"]);

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var CATEGORY = Object.freeze({
    OUTSIDE: "outside_continent",
    SURFACE: "surface",
    SUMMIT: "summit",
    RIDGE: "ridge",
    SLOPE: "slope",
    PLAIN: "plain",
    BASIN: "basin",
    VALLEY: "valley",
    MARSH: "marsh",
    WETLAND: "wetland",
    COAST: "coast",
    SHELF: "shelf",
    HYDRATION: "hydration_channel",
    DRAINAGE: "drainage_corridor",
    TEXTURE: "texture",
    MINERAL: "mineral",
    SOIL: "soil",
    SURFACE_HABITABILITY: "surface_habitability_field_blueprint",
    BIOME_HELD: "biome_candidate_held",
    ECOLOGY_HELD: "ecology_candidate_held",
    SETTLEMENT_HELD: "settlement_candidate_held",
    URBAN_HELD: "urban_candidate_held"
  });

  var TERRAIN_CLASSES = Object.freeze([
    "outside_gratitude_field",
    "summit_highland",
    "ridge_highland",
    "upland_slope",
    "interior_plain",
    "basin_floor",
    "valley_corridor",
    "marsh_candidate",
    "wetland_candidate",
    "coastal_edge",
    "shelf_candidate",
    "drainage_corridor"
  ]);

  var HYDRATION_CLASSES = Object.freeze([
    "outside_gratitude_field",
    "dry_highland",
    "dry_land",
    "seasonal_valley_fill",
    "basin_lake_candidate",
    "wetland_candidate",
    "marsh_candidate",
    "coastal_edge_held",
    "shelf_water_interface_held"
  ]);

  var MATERIAL_CLASSES = Object.freeze([
    "stone",
    "soil",
    "mineral",
    "sediment",
    "sand",
    "clay",
    "peat",
    "wet_soil",
    "dry_soil",
    "fracture_edge"
  ]);

  var RENDER_TIERS = Object.freeze({
    T0: "tier_0_receipt_only",
    T1: "tier_1_macro_shape",
    T2: "tier_2_category_fields",
    T3: "tier_3_micro_surface_units",
    T4: "tier_4_downstream_stream_composite_held",
    T5: "tier_5_full_multi_stream_render_held"
  });

  var MACRO_SHAPE = Object.freeze({
    id: "gratitude_oblong_body",
    continentId: CONTINENT_ID,
    shape: "asymmetric_oblong_continent_seed",
    centerX: 8.45,
    centerY: 8.05,
    radiusX: 4.55,
    radiusY: 2.78,
    rotationRadians: -0.18,
    scaleRead: "largest_authored_gratitude_landmass_so_far",
    instruction: "contained major landmass, not hemisphere sheet",
    notHemisphereSheet: true,
    notRectangle: true,
    notPlanetBlanket: true
  });

  var SUMMITS = Object.freeze([
    Object.freeze({ id: "summit_01", name: "First Summit of Gratitude", x: 7.10, y: 5.20, elevationPressure: 0.92, ridgeBias: "northwest_crown", runoffBias: "central_south" }),
    Object.freeze({ id: "summit_02", name: "Second Summit of Gratitude", x: 8.55, y: 5.05, elevationPressure: 1.00, ridgeBias: "north_crown", runoffBias: "central_south" }),
    Object.freeze({ id: "summit_03", name: "Third Summit of Gratitude", x: 9.95, y: 5.55, elevationPressure: 0.90, ridgeBias: "northeast_crown", runoffBias: "southwest" }),
    Object.freeze({ id: "summit_04", name: "Fourth Summit of Gratitude", x: 6.40, y: 7.35, elevationPressure: 0.84, ridgeBias: "west_shoulder", runoffBias: "east_lowland" }),
    Object.freeze({ id: "summit_05", name: "Fifth Summit of Gratitude", x: 8.45, y: 7.55, elevationPressure: 1.08, ridgeBias: "central_keystone", runoffBias: "radial" }),
    Object.freeze({ id: "summit_06", name: "Sixth Summit of Gratitude", x: 10.85, y: 7.75, elevationPressure: 0.86, ridgeBias: "east_shoulder", runoffBias: "west_lowland" }),
    Object.freeze({ id: "summit_07", name: "Seventh Summit of Gratitude", x: 7.00, y: 9.72, elevationPressure: 0.80, ridgeBias: "southwest_shoulder", runoffBias: "northeast" }),
    Object.freeze({ id: "summit_08", name: "Eighth Summit of Gratitude", x: 9.35, y: 9.95, elevationPressure: 0.86, ridgeBias: "south_crown", runoffBias: "central" }),
    Object.freeze({ id: "summit_09", name: "Ninth Summit of Gratitude", x: 10.35, y: 10.85, elevationPressure: 0.88, ridgeBias: "southeast_tail", runoffBias: "northwest" })
  ]);

  var DOWNSTREAM_FILES = Object.freeze({
    surface: "/assets/audralia/clean/terrain/gratitude/gratitude.surface.child.js",
    ridges: "/assets/audralia/clean/terrain/gratitude/gratitude.ridges.child.js",
    basins: "/assets/audralia/clean/terrain/gratitude/gratitude.basins.child.js",
    valleys: "/assets/audralia/clean/terrain/gratitude/gratitude.valleys.child.js",
    marshes: "/assets/audralia/clean/terrain/gratitude/gratitude.marshes.child.js",
    coast: "/assets/audralia/clean/terrain/gratitude/gratitude.coast.child.js",
    hydration: "/assets/audralia/clean/terrain/gratitude/gratitude.hydration.child.js",
    texture: "/assets/audralia/clean/terrain/gratitude/gratitude.texture.child.js",
    minerals: "/assets/audralia/clean/terrain/gratitude/gratitude.minerals.child.js",
    soils: "/assets/audralia/clean/terrain/gratitude/gratitude.soils.child.js",
    surfaceHabitability: "/assets/audralia/clean/terrain/gratitude/gratitude.surface-habitability.child.js",
    biomes: "/assets/audralia/clean/terrain/gratitude/gratitude.biomes.child.js",
    ecology: "/assets/audralia/clean/terrain/gratitude/gratitude.ecology.child.js",
    settlement: "/assets/audralia/clean/terrain/gratitude/gratitude.settlement.child.js",
    urban: "/assets/audralia/clean/terrain/gratitude/gratitude.urban.child.js"
  });

  var STREAM_DEFINITIONS = Object.freeze([
    Object.freeze({ id: "surfaceStream", category: CATEGORY.SURFACE, downstreamFile: DOWNSTREAM_FILES.surface, ownerStatus: "planned_downstream_held", mobilePriority: 1 }),
    Object.freeze({ id: "elevationStream", category: "elevation", downstreamFile: DOWNSTREAM_FILES.surface, ownerStatus: "planned_downstream_held", mobilePriority: 2 }),
    Object.freeze({ id: "summitStream", category: CATEGORY.SUMMIT, downstreamFile: DOWNSTREAM_FILES.ridges, ownerStatus: "planned_downstream_held", mobilePriority: 3 }),
    Object.freeze({ id: "ridgeStream", category: CATEGORY.RIDGE, downstreamFile: DOWNSTREAM_FILES.ridges, ownerStatus: "planned_downstream_held", mobilePriority: 4 }),
    Object.freeze({ id: "slopeStream", category: CATEGORY.SLOPE, downstreamFile: DOWNSTREAM_FILES.surface, ownerStatus: "planned_downstream_held", mobilePriority: 5 }),
    Object.freeze({ id: "basinStream", category: CATEGORY.BASIN, downstreamFile: DOWNSTREAM_FILES.basins, ownerStatus: "planned_downstream_held", mobilePriority: 6 }),
    Object.freeze({ id: "valleyStream", category: CATEGORY.VALLEY, downstreamFile: DOWNSTREAM_FILES.valleys, ownerStatus: "planned_downstream_held", mobilePriority: 7 }),
    Object.freeze({ id: "marshStream", category: CATEGORY.MARSH, downstreamFile: DOWNSTREAM_FILES.marshes, ownerStatus: "planned_downstream_held", mobilePriority: 10 }),
    Object.freeze({ id: "wetlandStream", category: CATEGORY.WETLAND, downstreamFile: DOWNSTREAM_FILES.marshes, ownerStatus: "planned_downstream_held", mobilePriority: 11 }),
    Object.freeze({ id: "coastStream", category: CATEGORY.COAST, downstreamFile: DOWNSTREAM_FILES.coast, ownerStatus: "planned_downstream_held", mobilePriority: 8 }),
    Object.freeze({ id: "shelfStream", category: CATEGORY.SHELF, downstreamFile: DOWNSTREAM_FILES.coast, ownerStatus: "planned_downstream_held", mobilePriority: 12 }),
    Object.freeze({ id: "hydrationStream", category: CATEGORY.HYDRATION, downstreamFile: DOWNSTREAM_FILES.hydration, ownerStatus: "planned_downstream_held", mobilePriority: 9 }),
    Object.freeze({ id: "drainageStream", category: CATEGORY.DRAINAGE, downstreamFile: DOWNSTREAM_FILES.hydration, ownerStatus: "planned_downstream_held", mobilePriority: 9 }),
    Object.freeze({ id: "textureStream", category: CATEGORY.TEXTURE, downstreamFile: DOWNSTREAM_FILES.texture, ownerStatus: "planned_downstream_held", mobilePriority: 13 }),
    Object.freeze({ id: "mineralStream", category: CATEGORY.MINERAL, downstreamFile: DOWNSTREAM_FILES.minerals, ownerStatus: "planned_downstream_held", mobilePriority: 14 }),
    Object.freeze({ id: "soilStream", category: CATEGORY.SOIL, downstreamFile: DOWNSTREAM_FILES.soils, ownerStatus: "planned_downstream_held", mobilePriority: 15 }),
    Object.freeze({ id: "surfaceHabitabilityStream", category: CATEGORY.SURFACE_HABITABILITY, downstreamFile: DOWNSTREAM_FILES.surfaceHabitability, ownerStatus: "planned_downstream_held", mobilePriority: 16 }),
    Object.freeze({ id: "fieldBlueprintStream", category: CATEGORY.SURFACE_HABITABILITY, downstreamFile: DOWNSTREAM_FILES.surfaceHabitability, ownerStatus: "planned_downstream_held", mobilePriority: 16 }),
    Object.freeze({ id: "biomeStreamHeld", category: CATEGORY.BIOME_HELD, downstreamFile: DOWNSTREAM_FILES.biomes, ownerStatus: "future_socket_held", mobilePriority: 17 }),
    Object.freeze({ id: "ecologyStreamHeld", category: CATEGORY.ECOLOGY_HELD, downstreamFile: DOWNSTREAM_FILES.ecology, ownerStatus: "future_socket_held", mobilePriority: 18 }),
    Object.freeze({ id: "settlementStreamHeld", category: CATEGORY.SETTLEMENT_HELD, downstreamFile: DOWNSTREAM_FILES.settlement, ownerStatus: "future_socket_held", mobilePriority: 19 }),
    Object.freeze({ id: "urbanStreamHeld", category: CATEGORY.URBAN_HELD, downstreamFile: DOWNSTREAM_FILES.urban, ownerStatus: "future_socket_held", mobilePriority: 20 })
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nodeId(x, y) {
    return "GRATITUDE-NODE-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
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

  function rotateIntoMacroSpace(x, y) {
    var dx = x - MACRO_SHAPE.centerX;
    var dy = y - MACRO_SHAPE.centerY;
    var c = Math.cos(MACRO_SHAPE.rotationRadians);
    var s = Math.sin(MACRO_SHAPE.rotationRadians);

    return {
      x: dx * c - dy * s,
      y: dx * s + dy * c
    };
  }

  function macroMaskScore(x, y) {
    var p = rotateIntoMacroSpace(x, y);
    var nx = p.x / MACRO_SHAPE.radiusX;
    var ny = p.y / MACRO_SHAPE.radiusY;

    var oblong = nx * nx + ny * ny;
    var irregularEdge =
      Math.sin((x + 1.3) * 1.71) * 0.050 +
      Math.cos((y + 2.1) * 1.39) * 0.042 +
      Math.sin((x * 0.73 + y * 1.09)) * 0.034 +
      Math.cos((x * 1.13 - y * 0.47)) * 0.018;

    return oblong - irregularEdge;
  }

  function insideMacroShape(x, y) {
    return macroMaskScore(x, y) <= 1.0;
  }

  function boundaryPressure(x, y) {
    var score = macroMaskScore(x, y);
    return clamp(1 - Math.abs(1 - score) / 0.34, 0, 1);
  }

  function shelfPressure(x, y) {
    var score = macroMaskScore(x, y);
    return clamp(1 - Math.abs(1.12 - score) / 0.28, 0, 1);
  }

  function summitPressure(x, y) {
    var total = 0;
    var max = 0;
    var nearest = null;
    var nearestDistance = Infinity;

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var d = distance(x, y, summit.x, summit.y);
      var influence = clamp(1 - d / 1.82, 0, 1) * summit.elevationPressure;

      total += influence;
      max = Math.max(max, influence);

      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = summit;
      }
    }

    return {
      total: clamp(total / 2.20, 0, 1),
      max: clamp(max, 0, 1),
      nearest: nearest,
      nearestDistance: nearestDistance
    };
  }

  function ridgePressure(x, y) {
    var ridge = 0;

    ridge += lineInfluence(x, y, 7.10, 5.20, 8.55, 5.05, 0.56, 0.36);
    ridge += lineInfluence(x, y, 8.55, 5.05, 9.95, 5.55, 0.56, 0.34);
    ridge += lineInfluence(x, y, 6.40, 7.35, 8.45, 7.55, 0.70, 0.30);
    ridge += lineInfluence(x, y, 8.45, 7.55, 10.85, 7.75, 0.70, 0.30);
    ridge += lineInfluence(x, y, 7.00, 9.72, 9.35, 9.95, 0.64, 0.25);
    ridge += lineInfluence(x, y, 8.55, 5.05, 8.45, 7.55, 0.60, 0.32);
    ridge += lineInfluence(x, y, 8.45, 7.55, 9.35, 9.95, 0.60, 0.28);
    ridge += lineInfluence(x, y, 10.85, 7.75, 10.35, 10.85, 0.54, 0.21);

    return clamp(ridge, 0, 1);
  }

  function basinPressure(x, y) {
    var central = gaussian(x, y, 8.75, 8.55, 1.24, 0.86, 0.62);
    var southern = gaussian(x, y, 9.35, 9.85, 1.34, 0.82, 0.52);
    var western = gaussian(x, y, 7.05, 8.25, 0.96, 0.84, 0.38);
    var eastern = gaussian(x, y, 10.40, 8.70, 0.98, 0.82, 0.36);
    return clamp(Math.max(central, southern, western, eastern), 0, 1);
  }

  function valleyPressure(x, y) {
    var valley = 0;

    valley += lineInfluence(x, y, 8.55, 5.05, 8.75, 8.55, 0.50, 0.44);
    valley += lineInfluence(x, y, 8.75, 8.55, 9.35, 10.45, 0.54, 0.50);
    valley += lineInfluence(x, y, 6.40, 7.35, 8.75, 8.55, 0.44, 0.44);
    valley += lineInfluence(x, y, 10.85, 7.75, 8.75, 8.55, 0.44, 0.44);
    valley += lineInfluence(x, y, 7.00, 9.72, 9.35, 10.45, 0.36, 0.42);
    valley += lineInfluence(x, y, 10.35, 10.85, 9.35, 10.45, 0.35, 0.36);

    return clamp(valley, 0, 1);
  }

  function marshPressure(x, y, basin, valley, elevation, wetness) {
    var southWet = gaussian(x, y, 9.35, 10.10, 1.25, 0.86, 0.58);
    var lowBias = clamp((0.58 - elevation) * 1.8, 0, 1);
    return clamp(southWet * 0.36 + basin * 0.24 + valley * 0.20 + wetness * 0.16 + lowBias * 0.18, 0, 1);
  }

  function wetlandPressure(x, y, basin, valley, coast, elevation, wetness) {
    var lowBias = clamp((0.60 - elevation) * 1.6, 0, 1);
    return clamp(basin * 0.22 + valley * 0.22 + coast * 0.18 + wetness * 0.24 + lowBias * 0.22, 0, 1);
  }

  function soilPressure(elevation, basin, valley, coast, marsh, wetland) {
    return clamp(0.34 + (1 - elevation) * 0.22 + basin * 0.18 + valley * 0.12 + marsh * 0.12 + wetland * 0.12 - coast * 0.05, 0, 1);
  }

  function mineralPressure(elevation, summit, ridge) {
    return clamp(elevation * 0.26 + summit * 0.34 + ridge * 0.34, 0, 1);
  }

  function sedimentPressure(basin, valley, coast, shelf) {
    return clamp(basin * 0.30 + valley * 0.24 + coast * 0.28 + shelf * 0.18, 0, 1);
  }

  function rainShadowPressure(x, y, elevation, ridge, hydration, wetness, marsh, wetland) {
    var easternDry = x >= 9.0 && ridge > 0.36 ? 0.20 : 0;
    var highDry = elevation > 0.54 && wetness < 0.32 ? 0.20 : 0;
    var interiorDry = y >= 8.0 && x >= 8.0 && hydration < 0.30 ? 0.14 : 0;
    var wetPenalty = marsh * 0.25 + wetland * 0.23 + hydration * 0.18;

    return clamp(easternDry + highDry + interiorDry + (1 - wetness) * 0.22 - wetPenalty, 0, 1);
  }

  function classifyQuadrant(x, y) {
    if (x < 8 && y < 8) return "northwest";
    if (x >= 8 && y < 8) return "northeast";
    if (x < 8 && y >= 8) return "southwest";
    return "southeast";
  }

  function ringIndex(x, y) {
    var dx = Math.abs(x - 7.5);
    var dy = Math.abs(y - 7.5);
    return Math.max(dx, dy);
  }

  function macroZone(x, y, inside, coast, shelf, summit, ridge, basin, valley, marsh, wetland) {
    if (!inside && shelf > 0.35) return "shelf_context";
    if (!inside) return "outside_context";
    if (summit.max > 0.72) return "summit_anchor";
    if (ridge > 0.62) return "ridge_chain";
    if (marsh > 0.58) return "marsh_candidate";
    if (wetland > 0.58) return "wetland_candidate";
    if (coast > 0.66) return "coastal_edge";
    if (basin > 0.58) return "basin_zone";
    if (valley > 0.56) return "valley_corridor";
    return "interior_land";
  }

  function primaryCategory(inside, shelf, summit, ridge, basin, valley, marsh, wetland, coast, hydration, slope, plain) {
    if (!inside && shelf > 0.40) return CATEGORY.SHELF;
    if (!inside) return CATEGORY.OUTSIDE;
    if (summit.max > 0.76) return CATEGORY.SUMMIT;
    if (ridge > 0.64) return CATEGORY.RIDGE;
    if (marsh > 0.62) return CATEGORY.MARSH;
    if (wetland > 0.62) return CATEGORY.WETLAND;
    if (coast > 0.68) return CATEGORY.COAST;
    if (basin > 0.62) return CATEGORY.BASIN;
    if (valley > 0.60) return CATEGORY.VALLEY;
    if (hydration > 0.58) return CATEGORY.HYDRATION;
    if (slope > 0.54) return CATEGORY.SLOPE;
    if (plain > 0.35) return CATEGORY.PLAIN;
    return CATEGORY.SURFACE;
  }

  function collectSecondaryCategories(strengths, primary) {
    var result = [];
    var keys = Object.keys(strengths);

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (key === primary) continue;
      if (strengths[key] >= 0.44) result.push(key);
    }

    result.sort(function (a, b) {
      return strengths[b] - strengths[a];
    });

    return result.slice(0, 8);
  }

  function terrainClass(primary, elevation, summit, ridge, basin, valley, marsh, wetland, coast, shelf) {
    if (primary === CATEGORY.SHELF) return "shelf_candidate";
    if (primary === CATEGORY.OUTSIDE) return "outside_gratitude_field";
    if (primary === CATEGORY.SUMMIT || summit.max > 0.72) return "summit_highland";
    if (primary === CATEGORY.RIDGE || ridge > 0.62) return "ridge_highland";
    if (primary === CATEGORY.MARSH || marsh > 0.62) return "marsh_candidate";
    if (primary === CATEGORY.WETLAND || wetland > 0.62) return "wetland_candidate";
    if (primary === CATEGORY.COAST || coast > 0.68) return "coastal_edge";
    if (primary === CATEGORY.BASIN || basin > 0.62) return "basin_floor";
    if (primary === CATEGORY.VALLEY || valley > 0.60) return "valley_corridor";
    if (elevation > 0.57) return "upland_slope";
    return "interior_plain";
  }

  function hydrationClass(inside, shelf, elevation, marsh, wetland, basin, valley, coast, hydration) {
    if (!inside && shelf > 0.40) return "shelf_water_interface_held";
    if (!inside) return "outside_gratitude_field";
    if (coast > 0.68) return "coastal_edge_held";
    if (marsh > 0.62) return "marsh_candidate";
    if (wetland > 0.62) return "wetland_candidate";
    if (basin > 0.62 && hydration > 0.30) return "basin_lake_candidate";
    if (valley > 0.56 && hydration > 0.18) return "seasonal_valley_fill";
    if (elevation > 0.64) return "dry_highland";
    return "dry_land";
  }

  function futureBiomeClass(nodeTerrainClass, nodeHydrationClass) {
    if (nodeTerrainClass === "summit_highland") return "alpine_or_highland_biome_held";
    if (nodeTerrainClass === "ridge_highland") return "rocky_ridge_biome_held";
    if (nodeTerrainClass === "coastal_edge") return "coastal_biome_held";
    if (nodeHydrationClass === "marsh_candidate") return "marsh_biome_held";
    if (nodeHydrationClass === "wetland_candidate") return "wetland_biome_held";
    if (nodeHydrationClass === "basin_lake_candidate") return "lake_basin_biome_held";
    if (nodeTerrainClass === "interior_plain") return "temperate_plain_biome_held";
    if (nodeTerrainClass === "upland_slope") return "mixed_upland_biome_held";
    return "context_biome_held";
  }

  function futureSettlementEligibility(nodeTerrainClass, nodeHydrationClass, elevation, ridge, marsh, wetland, coast, coherenceScore) {
    if (nodeTerrainClass === "outside_gratitude_field") return "not_applicable_outside_continent";
    if (nodeTerrainClass === "summit_highland") return "held_no_settlement_highland";
    if (ridge > 0.72) return "held_ridge_instability";
    if (marsh > 0.58 || wetland > 0.66) return "held_wetland_or_marsh_survey_required";
    if (coast > 0.72) return "held_coast_definition_required";
    if (coherenceScore < 0.76) return "held_coherence_survey_required";
    if (nodeTerrainClass === "interior_plain" && elevation >= 0.38 && elevation <= 0.58) return "held_candidate_plain";
    if (nodeTerrainClass === "upland_slope" && elevation >= 0.46 && elevation <= 0.64) return "held_candidate_upland";
    if (nodeHydrationClass === "seasonal_valley_fill") return "held_hydration_survey_required";
    return "held_future_survey";
  }

  function terrainDatumClass(node) {
    if (!node.continentMembership && node.primaryCategory === CATEGORY.SHELF) return "shelf_context_datum";
    if (!node.continentMembership) return "outside_context_datum";
    if (node.summitPressure > 0.64 || node.terrainClass === "summit_highland") return "mountain_source_datum";
    if (node.ridgePressure > 0.60 || node.terrainClass === "ridge_highland") return "ridge_crest_datum";
    if (node.basinPressure > 0.58 || node.terrainClass === "basin_floor") return "basin_floor_datum";
    if (node.valleyPressure > 0.56 || node.terrainClass === "valley_corridor") return "valley_floor_datum";
    if (node.coastPressure > 0.60 || node.terrainClass === "coastal_edge") return "coast_datum";
    if (node.rainShadowPressure > 0.50 || node.desertReservationPressure > 0.54) return "desert_reservation_datum";
    return "surface_expression_datum";
  }

  function buildTerrainDatumForNode(node) {
    var ridgeCrestDatum = clamp(node.elevation + node.ridgePressure * 0.10 + node.summitPressure * 0.06, 0, 1);
    var valleyFloorDatum = clamp(node.elevation - node.valleyPressure * 0.11 - node.hydrationPressure * 0.025, 0, 1);
    var basinFloorDatum = clamp(node.elevation - node.basinPressure * 0.13 - node.hydrationPressure * 0.035, 0, 1);
    var basinRimDatum = clamp(basinFloorDatum + node.basinPressure * 0.18 + node.ridgePressure * 0.05, 0, 1);
    var coastDatum = clamp(SEA_LEVEL_DATUM + node.coastPressure * COASTAL_DATUM_TOLERANCE, 0, 1);
    var shelfDatum = clamp(SEA_LEVEL_DATUM - node.shelfPressure * 0.09, 0, 1);
    var waterTableDatumHeld = clamp(
      Math.min(node.elevation - WATER_TABLE_HELD_OFFSET, SEA_LEVEL_DATUM + node.hydrationDepth * 0.58 + node.basinPressure * 0.025),
      0,
      1
    );

    var mountainReservation = clamp(node.summitPressure * 0.44 + node.ridgePressure * 0.34 + (node.elevation > 0.62 ? 0.16 : 0), 0, 1);
    var desertReservation = clamp(node.desertReservationPressure, 0, 1);
    var dryBasinReservation = clamp(node.basinPressure * 0.45 + (1 - node.hydrationPressure) * 0.26 + node.rainShadowPressure * 0.20, 0, 1);
    var rainShadowReservation = clamp(node.rainShadowPressure, 0, 1);

    return Object.freeze({
      datumNodeId: "TERRAIN-DATUM-" + node.nodeId,
      sourceNodeId: node.nodeId,
      x: node.x,
      y: node.y,
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,

      terrainDatumClass: terrainDatumClass(node),

      seaLevelDatum: SEA_LEVEL_DATUM,
      aboveSeaLevelMass: Boolean(node.continentMembership && node.elevation > SEA_LEVEL_DATUM),
      aboveSeaLevelMassDepth: round(node.continentMembership ? clamp(node.elevation - SEA_LEVEL_DATUM, 0, 1) : 0, 4),

      surfaceExpressionDatum: round(node.elevation, 4),
      baseElevationDatum: round(node.baseElevation, 4),
      ridgeCrestDatum: round(ridgeCrestDatum, 4),
      valleyFloorDatum: round(valleyFloorDatum, 4),
      basinFloorDatum: round(basinFloorDatum, 4),
      basinRimDatum: round(basinRimDatum, 4),
      coastDatum: round(coastDatum, 4),
      shelfDatum: round(shelfDatum, 4),
      waterTableDatumHeld: round(waterTableDatumHeld, 4),

      mountainReservationDatum: round(mountainReservation, 4),
      desertReservationDatum: round(desertReservation, 4),
      dryBasinReservationDatum: round(dryBasinReservation, 4),
      rainShadowReservationDatum: round(rainShadowReservation, 4),

      mountainRangeReserved: mountainReservation >= 0.50,
      desertLandReserved: desertReservation >= 0.50,
      dryBasinReserved: dryBasinReservation >= 0.56,
      rainShadowZoneReserved: rainShadowReservation >= 0.48,

      basinRimRequired: node.basinPressure > 0.44,
      valleyFloorRequired: node.valleyPressure > 0.42,
      ridgeCrestRequired: node.ridgePressure > 0.48,
      coastDatumRequired: node.coastPressure > 0.42 || node.shelfPressure > 0.42,

      surfaceHabitabilityMayRead: true,
      reciprocalBlueprintMayAdvise: true,
      terrainAuthorityRetained: true,
      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function constraintCheck(raw) {
    var failures = [];
    var warnings = [];

    if (raw.primary === CATEGORY.SUMMIT && raw.marsh > 0.62) {
      failures.push("summit_primary_cannot_be_marsh_primary");
    }

    if (raw.primary === CATEGORY.SUMMIT && raw.basin > 0.70) {
      failures.push("deep_basin_cannot_be_summit_anchor");
    }

    if (raw.primary === CATEGORY.MARSH && !(raw.wetness > 0.45 || raw.basin > 0.48 || raw.valley > 0.48 || raw.coast > 0.48)) {
      failures.push("marsh_requires_wetness_or_lowland_support");
    }

    if (raw.primary === CATEGORY.COAST && !(raw.boundary > 0.55)) {
      failures.push("coast_requires_boundary_adjacency");
    }

    if (raw.primary === CATEGORY.HYDRATION && !(raw.basin > 0.35 || raw.valley > 0.35 || raw.coast > 0.35 || raw.marsh > 0.35 || raw.wetland > 0.35)) {
      failures.push("hydration_primary_requires_terrain_permission");
    }

    if (raw.urbanPressure > 0.60) {
      warnings.push("urban_candidate_held_until_core_hydration_ecology_and_downstream_files_exist");
    }

    if (raw.settlementPressure > 0.60) {
      warnings.push("settlement_candidate_held_until_core_hydration_and_ecology_are_ready");
    }

    if (raw.primary === CATEGORY.SHELF && raw.inside) {
      failures.push("shelf_primary_requires_outside_continent_context");
    }

    if (raw.finalVisualPassClaim === true) {
      failures.push("node_may_not_claim_final_visual_completion");
    }

    var penalty = failures.length * 0.22 + warnings.length * 0.035;
    var score = clamp(1 - penalty, 0, 1);

    return {
      hardFail: failures.length > 0,
      failures: failures,
      warnings: warnings,
      coherenceScore: round(score, 4)
    };
  }

  function makeNEWS(raw, constraint) {
    return Object.freeze({
      complete: true,
      north: Object.freeze({
        defined: true,
        order: 1,
        role: "origin_and_source_condition",
        originType: raw.originType,
        upstreamSource: raw.inside ? "gratitude_macro_shape" : "gratitude_context_field",
        nearestSummitId: raw.nearestSummitId,
        ring: raw.ring,
        quadrant: raw.quadrant
      }),
      east: Object.freeze({
        defined: true,
        order: 2,
        role: "expression_and_category_output",
        expressionType: raw.terrainClass,
        primaryCategory: raw.primary,
        secondaryCategories: raw.secondaryCategories.slice(),
        categoryStrengths: deepClone(raw.categoryStrengths),
        datumExpressionReady: true
      }),
      west: Object.freeze({
        defined: true,
        order: 3,
        role: "correction_constraint_and_memory",
        correctionType: constraint.hardFail ? "hard_constraint_failure" : constraint.warnings.length ? "held_warning_correction" : "coherent",
        failures: constraint.failures.slice(),
        warnings: constraint.warnings.slice(),
        antiSheetCorrection: true,
        reciprocalBlueprintAdvisoryOnly: true,
        climateAuthoritySeized: false,
        atmosphereAuthoritySeized: false,
        finalVisualPassClaim: false
      }),
      south: Object.freeze({
        defined: true,
        order: 4,
        role: "grounding_downstream_and_render_readiness",
        groundingType: raw.downstreamOwners.join(","),
        renderEligible: raw.renderEligible,
        dependencyState: raw.dependencyState,
        surfaceHabitabilityDownstreamRegistered: true,
        terrainDatumPacketReady: true,
        runtimeStrengthHeld: RUNTIME_STRENGTH_HELD
      })
    });
  }

  function nodeRenderTier(primary, inside, coherenceScore, surfaceUnitCount) {
    if (!inside && primary !== CATEGORY.SHELF) return RENDER_TIERS.T0;
    if (coherenceScore < 0.70) return RENDER_TIERS.T1;
    if (surfaceUnitCount > 0) return RENDER_TIERS.T3;
    return RENDER_TIERS.T2;
  }

  function makeNode(x, y) {
    var index = y * RADIAL_NODES + x;
    var cx = x + 0.5;
    var cy = y + 0.5;

    var inside = insideMacroShape(cx, cy);
    var boundary = boundaryPressure(cx, cy);
    var shelf = shelfPressure(cx, cy);
    var summit = summitPressure(cx, cy);
    var ridge = inside ? ridgePressure(cx, cy) : 0;
    var basin = inside ? basinPressure(cx, cy) : 0;
    var valley = inside ? valleyPressure(cx, cy) : 0;

    var baseElevation = inside ? clamp(0.43 + (1 - macroMaskScore(cx, cy)) * 0.08, 0.30, 0.62) : 0;
    var elevation = inside
      ? clamp(baseElevation + summit.total * 0.31 + ridge * 0.18 - basin * 0.22 - valley * 0.12 - boundary * 0.04, 0.16, 0.94)
      : 0;

    var runoff = inside ? clamp(summit.total * 0.32 + ridge * 0.20 + valley * 0.32 + basin * 0.20, 0, 1) : 0;
    var wetness = inside ? clamp(basin * 0.30 + valley * 0.30 + runoff * 0.18 + boundary * 0.12 - elevation * 0.08, 0, 1) : 0;
    var marsh = inside ? marshPressure(cx, cy, basin, valley, elevation, wetness) : 0;
    var wetland = inside ? wetlandPressure(cx, cy, basin, valley, boundary, elevation, wetness) : 0;

    var slope = inside ? clamp(elevation * 0.28 + ridge * 0.22 + (1 - basin) * 0.18 + (1 - valley) * 0.10, 0, 1) : 0;
    var plain = inside ? clamp(0.54 - Math.abs(elevation - 0.48) + (1 - ridge) * 0.16 - basin * 0.10, 0, 1) : 0;
    var hydration = inside ? clamp(wetness * 0.40 + basin * 0.24 + valley * 0.24 + marsh * 0.12 + wetland * 0.12, 0, 1) : 0;
    var drainage = inside ? clamp(valley * 0.44 + runoff * 0.32 + basin * 0.14 + boundary * 0.10, 0, 1) : 0;
    var rainShadow = inside ? rainShadowPressure(cx, cy, elevation, ridge, hydration, wetness, marsh, wetland) : 0;

    var soil = inside ? soilPressure(elevation, basin, valley, boundary, marsh, wetland) : 0;
    var mineral = inside ? mineralPressure(elevation, summit.total, ridge) : 0;
    var sediment = inside ? sedimentPressure(basin, valley, boundary, shelf) : 0;
    var texture = inside ? clamp(soil * 0.24 + mineral * 0.22 + sediment * 0.18 + ridge * 0.18 + boundary * 0.12, 0, 1) : 0;

    var settlementPressure = inside ? clamp(plain * 0.32 + slope * 0.16 + (1 - ridge) * 0.16 + (1 - marsh) * 0.18 + (1 - wetland) * 0.10, 0, 1) : 0;
    var urbanPressure = inside ? clamp(settlementPressure * 0.50 + plain * 0.24 + (1 - hydration) * 0.10, 0, 1) : 0;
    var surfaceHabitabilityPressure = inside
      ? clamp(
        texture * 0.18 +
        hydration * 0.16 +
        soil * 0.16 +
        (1 - rainShadow) * 0.12 +
        (1 - ridge * 0.45) * 0.10 +
        settlementPressure * 0.10 +
        boundary * 0.05,
        0,
        1
      )
      : shelf > 0.40 ? 0.30 : 0;

    var desertReservationPressure = inside
      ? clamp((1 - hydration) * 0.28 + (1 - wetness) * 0.24 + rainShadow * 0.30 + (basin > 0.38 && hydration < 0.30 ? 0.16 : 0), 0, 1)
      : 0;

    var strengths = {};
    strengths[CATEGORY.SURFACE] = inside ? 0.88 : 0;
    strengths[CATEGORY.SUMMIT] = summit.max;
    strengths[CATEGORY.RIDGE] = ridge;
    strengths[CATEGORY.SLOPE] = slope;
    strengths[CATEGORY.PLAIN] = plain;
    strengths[CATEGORY.BASIN] = basin;
    strengths[CATEGORY.VALLEY] = valley;
    strengths[CATEGORY.MARSH] = marsh;
    strengths[CATEGORY.WETLAND] = wetland;
    strengths[CATEGORY.COAST] = inside ? boundary : 0;
    strengths[CATEGORY.SHELF] = !inside ? shelf : 0;
    strengths[CATEGORY.HYDRATION] = hydration;
    strengths[CATEGORY.DRAINAGE] = drainage;
    strengths[CATEGORY.TEXTURE] = texture;
    strengths[CATEGORY.MINERAL] = mineral;
    strengths[CATEGORY.SOIL] = soil;
    strengths[CATEGORY.SURFACE_HABITABILITY] = surfaceHabitabilityPressure;
    strengths[CATEGORY.BIOME_HELD] = inside ? clamp(texture * 0.26 + hydration * 0.22 + elevation * 0.14, 0, 1) : 0;
    strengths[CATEGORY.ECOLOGY_HELD] = inside ? clamp(hydration * 0.34 + soil * 0.24 + wetland * 0.20, 0, 1) : 0;
    strengths[CATEGORY.SETTLEMENT_HELD] = settlementPressure;
    strengths[CATEGORY.URBAN_HELD] = urbanPressure;

    var primary = primaryCategory(inside, shelf, summit, ridge, basin, valley, marsh, wetland, boundary, hydration, slope, plain);
    var secondary = collectSecondaryCategories(strengths, primary);
    var tClass = terrainClass(primary, elevation, summit, ridge, basin, valley, marsh, wetland, boundary, shelf);
    var hClass = hydrationClass(inside, shelf, elevation, marsh, wetland, basin, valley, boundary, hydration);

    var raw = {
      inside: inside,
      primary: primary,
      summit: summit.max,
      ridge: ridge,
      basin: basin,
      valley: valley,
      marsh: marsh,
      wetland: wetland,
      coast: boundary,
      shelf: shelf,
      wetness: wetness,
      urbanPressure: urbanPressure,
      settlementPressure: settlementPressure,
      boundary: boundary,
      finalVisualPassClaim: false,
      categoryStrengths: strengths,
      secondaryCategories: secondary,
      originType: inside ? "gratitude_land_node" : shelf > 0.40 ? "shelf_context_node" : "outside_context_node",
      terrainClass: tClass,
      downstreamOwners: downstreamOwnersForPrimary(primary),
      renderEligible: inside || primary === CATEGORY.SHELF,
      dependencyState: dependencyStateForPrimary(primary),
      nearestSummitId: summit.nearest ? summit.nearest.id : null,
      ring: ringIndex(x, y),
      quadrant: classifyQuadrant(x, y)
    };

    var constraint = constraintCheck(raw);
    var news = makeNEWS(raw, constraint);
    var surfaceUnitCount = inside ? 9 : primary === CATEGORY.SHELF ? 2 : 0;
    var renderTier = nodeRenderTier(primary, inside, constraint.coherenceScore, surfaceUnitCount);

    var node = {
      nodeId: nodeId(x, y),
      nodeIndex: index,
      seatIndex: index,
      seatKey: seatKey(x, y),
      x: x,
      y: y,
      centerX: round(cx, 4),
      centerY: round(cy, 4),
      band: y,
      radial: x,
      fibonacci: FIBONACCI_SEQUENCE[y],
      quadrant: raw.quadrant,
      ring: raw.ring,
      regionId: macroZone(cx, cy, inside, boundary, shelf, summit, ridge, basin, valley, marsh, wetland),
      macroZone: macroZone(cx, cy, inside, boundary, shelf, summit, ridge, basin, valley, marsh, wetland),

      continentMembership: inside,
      continentId: inside ? CONTINENT_ID : null,
      continentName: inside ? CONTINENT_NAME : null,

      primaryCategory: primary,
      secondaryCategories: secondary,
      categoryStrengths: freezeStrengths(strengths),

      terrainClass: tClass,
      hydrationClass: hClass,

      elevation: round(elevation, 4),
      baseElevation: round(baseElevation, 4),
      summitPressure: round(summit.max, 4),
      summitInfluence: round(summit.total, 4),
      nearestSummitId: summit.nearest ? summit.nearest.id : null,
      nearestSummitName: summit.nearest ? summit.nearest.name : null,
      nearestSummitDistance: round(summit.nearestDistance, 4),
      ridgePressure: round(ridge, 4),
      basinPressure: round(basin, 4),
      valleyPressure: round(valley, 4),
      marshPressure: round(marsh, 4),
      wetlandPressure: round(wetland, 4),
      coastPressure: round(boundary, 4),
      shelfPressure: round(shelf, 4),
      hydrationPressure: round(hydration, 4),
      drainagePressure: round(drainage, 4),
      runoffPressure: round(runoff, 4),
      wetnessPressure: round(wetness, 4),
      rainShadowPressure: round(rainShadow, 4),
      desertReservationPressure: round(desertReservationPressure, 4),
      surfaceHabitabilityPressure: round(surfaceHabitabilityPressure, 4),

      soilPressure: round(soil, 4),
      mineralPressure: round(mineral, 4),
      sedimentPressure: round(sediment, 4),
      texturePressure: round(texture, 4),

      ridgeStatus: ridge > 0.56,
      basinStatus: basin > 0.56,
      valleyStatus: valley > 0.54,
      coastEligible: boundary > 0.62,
      waterFillEligible: inside && hydration > 0.38 && elevation < 0.62 && summit.max < 0.72,
      hydrationDepth: round(inside ? clamp((0.62 - elevation) * 0.70 + hydration * 0.34, 0, 0.62) : 0, 4),

      mountainRangeReserved: inside && (summit.max > 0.58 || ridge > 0.60 || elevation > 0.66),
      desertLandReserved: inside && desertReservationPressure > 0.52,
      dryBasinReserved: inside && basin > 0.42 && hydration < 0.30,
      rainShadowZoneReserved: inside && rainShadow > 0.48,

      futureBiomeClassHeld: futureBiomeClass(tClass, hClass),
      futureSettlementEligibilityHeld: futureSettlementEligibility(tClass, hClass, elevation, ridge, marsh, wetland, boundary, constraint.coherenceScore),
      futureBiomeSocketHeld: true,
      futureEcologySocketHeld: true,
      futureSettlementSocketHeld: true,
      futureUrbanLayerSocketHeld: true,

      NEWS: news,
      newsComplete: true,
      north: news.north,
      east: news.east,
      west: news.west,
      south: news.south,

      coherenceScore: constraint.coherenceScore,
      hardFail: constraint.hardFail,
      constraintFailures: constraint.failures,
      constraintWarnings: constraint.warnings,

      downstreamOwners: raw.downstreamOwners,
      renderEligibility: raw.renderEligible,
      renderEligible: raw.renderEligible,
      renderTier: renderTier,
      runtimeCost: runtimeCostForNode(raw.renderEligible, surfaceUnitCount, secondary.length),
      dependencyState: raw.dependencyState,

      surfaceUnitCount: surfaceUnitCount,
      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      surfaceHabitabilityDownstreamRegistered: true,
      terrainDatumPacketReady: true,
      reciprocalBlueprintIntakeReady: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false
    };

    node.terrainDatum = buildTerrainDatumForNode(node);

    return Object.freeze(node);
  }

  function freezeStrengths(strengths) {
    var copy = {};
    Object.keys(strengths).forEach(function (key) {
      copy[key] = round(strengths[key], 4);
    });
    return Object.freeze(copy);
  }

  function downstreamOwnersForPrimary(primary) {
    if (primary === CATEGORY.SUMMIT || primary === CATEGORY.RIDGE) return ["gratitude.ridges.child.js"];
    if (primary === CATEGORY.BASIN) return ["gratitude.basins.child.js"];
    if (primary === CATEGORY.VALLEY) return ["gratitude.valleys.child.js"];
    if (primary === CATEGORY.MARSH || primary === CATEGORY.WETLAND) return ["gratitude.marshes.child.js"];
    if (primary === CATEGORY.COAST || primary === CATEGORY.SHELF) return ["gratitude.coast.child.js"];
    if (primary === CATEGORY.HYDRATION || primary === CATEGORY.DRAINAGE) return ["gratitude.hydration.child.js"];
    if (primary === CATEGORY.TEXTURE || primary === CATEGORY.MINERAL || primary === CATEGORY.SOIL) return ["gratitude.texture.child.js"];
    if (primary === CATEGORY.SURFACE_HABITABILITY) return ["gratitude.surface-habitability.child.js"];
    if (primary === CATEGORY.SETTLEMENT_HELD) return ["gratitude.settlement.child.js"];
    if (primary === CATEGORY.URBAN_HELD) return ["gratitude.urban.child.js"];
    if (primary === CATEGORY.OUTSIDE) return ["none"];
    return ["gratitude.surface.child.js"];
  }

  function dependencyStateForPrimary(primary) {
    if (primary === CATEGORY.OUTSIDE) return "context_only";
    if (primary === CATEGORY.SHELF) return "coast_child_required_later";
    if (primary === CATEGORY.MARSH || primary === CATEGORY.WETLAND) return "marsh_child_required_later";
    if (primary === CATEGORY.HYDRATION || primary === CATEGORY.DRAINAGE) return "hydration_child_required_later";
    if (primary === CATEGORY.SURFACE_HABITABILITY) return "surface_habitability_child_required_later";
    if (primary === CATEGORY.SETTLEMENT_HELD) return "core_hydration_ecology_required";
    if (primary === CATEGORY.URBAN_HELD) return "core_hydration_ecology_settlement_required";
    return "upstream_defined_downstream_detail_held";
  }

  function runtimeCostForNode(renderEligible, surfaceUnitCount, secondaryCount) {
    if (!renderEligible) return 0.1;
    return round(0.65 + surfaceUnitCount * 0.08 + secondaryCount * 0.035, 4);
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

  function makeSurfaceUnit(parentNode, localIndex, offsetX, offsetY, rx, ry) {
    var x = parentNode.centerX + offsetX;
    var y = parentNode.centerY + offsetY;

    var summit = summitPressure(x, y);
    var ridge = parentNode.continentMembership ? ridgePressure(x, y) : 0;
    var basin = parentNode.continentMembership ? basinPressure(x, y) : 0;
    var valley = parentNode.continentMembership ? valleyPressure(x, y) : 0;
    var coast = parentNode.continentMembership ? boundaryPressure(x, y) : shelfPressure(x, y);
    var marsh = parentNode.continentMembership ? marshPressure(x, y, basin, valley, parentNode.elevation, parentNode.wetnessPressure) : 0;
    var wetland = parentNode.continentMembership ? wetlandPressure(x, y, basin, valley, coast, parentNode.elevation, parentNode.wetnessPressure) : 0;

    var elevation = parentNode.continentMembership
      ? clamp(parentNode.elevation + summit.total * 0.08 + ridge * 0.05 - basin * 0.06 - valley * 0.04 + Math.sin((localIndex + parentNode.nodeIndex) * 1.7) * 0.012, 0.12, 0.96)
      : 0;

    var hydration = parentNode.continentMembership
      ? clamp(parentNode.hydrationDepth + basin * 0.06 + valley * 0.05 + marsh * 0.04 + wetland * 0.04, 0, 0.72)
      : 0;

    var primary = parentNode.primaryCategory;
    var terrain = terrainClass(primary, elevation, summit, ridge, basin, valley, marsh, wetland, coast, 0);
    var hClass = hydrationClass(parentNode.continentMembership, 0, elevation, marsh, wetland, basin, valley, coast, hydration);

    return Object.freeze({
      tileId: parentNode.nodeId + "-SURFACE-" + String(localIndex).padStart(2, "0"),
      terrainUnitId: parentNode.nodeId + "-SURFACE-" + String(localIndex).padStart(2, "0"),
      parentNodeId: parentNode.nodeId,
      parentSeatIndex: parentNode.seatIndex,
      parentSeatKey: parentNode.seatKey,
      continentId: parentNode.continentMembership ? CONTINENT_ID : null,
      x: round(x, 4),
      y: round(y, 4),
      rx: rx,
      ry: ry,
      shape: "hex_rect_terrain_image_unit",
      hexRectVertices: makeHexRectVertices(x, y, rx, ry),

      elevation: round(elevation, 4),
      ridgePressure: round(ridge, 4),
      basinPressure: round(basin, 4),
      valleyPressure: round(valley, 4),
      marshPressure: round(marsh, 4),
      wetlandPressure: round(wetland, 4),
      summitInfluence: round(summit.total, 4),
      coastPressure: round(coast, 4),
      moisturePotential: round(parentNode.wetnessPressure, 4),
      hydrationDepth: round(hydration, 4),

      terrainClass: terrain,
      hydrationClass: hClass,
      waterFillEligible: parentNode.waterFillEligible && hydration > 0.05,

      textureChannels: Object.freeze({
        rock: round(clamp(elevation * 0.42 + ridge * 0.36 + summit.max * 0.22, 0, 1), 4),
        soil: round(clamp(0.40 + (1 - ridge) * 0.22 + basin * 0.18 - summit.max * 0.12, 0, 1), 4),
        mineral: round(clamp(summit.total * 0.36 + ridge * 0.32 + elevation * 0.20, 0, 1), 4),
        wetland: round(clamp(hydration * 0.80 + parentNode.wetnessPressure * 0.20, 0, 1), 4),
        ridge: round(ridge, 4),
        basin: round(basin, 4),
        coast: round(coast, 4)
      }),

      futureBiomeClassHeld: futureBiomeClass(terrain, hClass),
      futureSettlementEligibilityHeld: futureSettlementEligibility(terrain, hClass, elevation, ridge, marsh, wetland, coast, parentNode.coherenceScore),
      renderEligible: parentNode.renderEligible,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function makeHexRectVertices(x, y, rx, ry) {
    return Object.freeze([
      Object.freeze({ x: round(x - rx, 4), y: round(y - ry * 0.45, 4) }),
      Object.freeze({ x: round(x, 4), y: round(y - ry, 4) }),
      Object.freeze({ x: round(x + rx, 4), y: round(y - ry * 0.45, 4) }),
      Object.freeze({ x: round(x + rx, 4), y: round(y + ry * 0.45, 4) }),
      Object.freeze({ x: round(x, 4), y: round(y + ry, 4) }),
      Object.freeze({ x: round(x - rx, 4), y: round(y + ry * 0.45, 4) })
    ]);
  }

  function buildSurfaceUnits() {
    var units = [];
    var offsets = [
      [-0.26, -0.20], [0, -0.22], [0.26, -0.20],
      [-0.28, 0], [0, 0], [0.28, 0],
      [-0.26, 0.20], [0, 0.22], [0.26, 0.20]
    ];

    for (var i = 0; i < NODES.length; i += 1) {
      var node = NODES[i];

      if (!node.continentMembership && node.primaryCategory !== CATEGORY.SHELF) continue;

      var localCount = node.continentMembership ? 9 : 2;
      for (var j = 0; j < localCount; j += 1) {
        units.push(makeSurfaceUnit(node, j + 1, offsets[j][0], offsets[j][1], 0.155, 0.125));
      }
    }

    return Object.freeze(units);
  }

  var SURFACE_UNITS = buildSurfaceUnits();

  function countNodes(predicate) {
    var count = 0;
    for (var i = 0; i < NODES.length; i += 1) {
      if (predicate(NODES[i])) count += 1;
    }
    return count;
  }

  function averageNodes(getter) {
    var total = 0;
    for (var i = 0; i < NODES.length; i += 1) {
      total += Number(getter(NODES[i])) || 0;
    }
    return round(total / NODES.length, 4);
  }

  function categoryCounts() {
    var counts = {};
    Object.keys(CATEGORY).forEach(function (key) {
      counts[CATEGORY[key]] = 0;
    });

    for (var i = 0; i < NODES.length; i += 1) {
      counts[NODES[i].primaryCategory] = (counts[NODES[i].primaryCategory] || 0) + 1;
    }

    return counts;
  }

  function terrainClassCounts() {
    var counts = {};
    TERRAIN_CLASSES.forEach(function (name) {
      counts[name] = 0;
    });

    for (var i = 0; i < NODES.length; i += 1) {
      counts[NODES[i].terrainClass] = (counts[NODES[i].terrainClass] || 0) + 1;
    }

    return counts;
  }

  function hydrationClassCounts() {
    var counts = {};
    HYDRATION_CLASSES.forEach(function (name) {
      counts[name] = 0;
    });

    for (var i = 0; i < NODES.length; i += 1) {
      counts[NODES[i].hydrationClass] = (counts[NODES[i].hydrationClass] || 0) + 1;
    }

    return counts;
  }

  function hardFailCount() {
    return countNodes(function (node) {
      return node.hardFail;
    });
  }

  function warningCount() {
    var count = 0;
    for (var i = 0; i < NODES.length; i += 1) {
      count += NODES[i].constraintWarnings.length;
    }
    return count;
  }

  function allNEWSComplete() {
    return NODES.every(function (node) {
      return Boolean(
        node.newsComplete === true &&
        node.north && node.north.defined === true &&
        node.east && node.east.defined === true &&
        node.west && node.west.defined === true &&
        node.south && node.south.defined === true &&
        node.NEWS && node.NEWS.complete === true
      );
    });
  }

  function streamNodeMatch(stream, node) {
    if (stream.category === "elevation") return node.continentMembership;
    if (stream.category === CATEGORY.SURFACE) return node.continentMembership;
    if (stream.category === CATEGORY.SURFACE_HABITABILITY) {
      return node.continentMembership || node.primaryCategory === CATEGORY.SHELF || node.coastPressure > 0.35;
    }
    return (node.categoryStrengths[stream.category] || 0) >= 0.30 || node.primaryCategory === stream.category;
  }

  function streamPressure(stream, node) {
    if (stream.category === "elevation") return node.elevation;
    if (stream.category === CATEGORY.SURFACE) return node.continentMembership ? 0.88 : 0;
    if (stream.category === CATEGORY.SURFACE_HABITABILITY) return node.surfaceHabitabilityPressure || 0;
    return node.categoryStrengths[stream.category] || 0;
  }

  function makeStreamPacket(stream) {
    var matching = [];
    var primary = [];
    var pressureTotal = 0;
    var maxPressure = 0;
    var coherenceTotal = 0;

    for (var i = 0; i < NODES.length; i += 1) {
      var node = NODES[i];
      if (!streamNodeMatch(stream, node)) continue;

      var pressure = streamPressure(stream, node);
      matching.push(node);
      pressureTotal += pressure;
      maxPressure = Math.max(maxPressure, pressure);
      coherenceTotal += node.coherenceScore;

      if (node.primaryCategory === stream.category || (stream.category === "elevation" && node.continentMembership)) {
        primary.push(node);
      }
    }

    var nodeCount = matching.length;
    var active = stream.ownerStatus !== "future_socket_held";
    var renderEligible = active && nodeCount > 0 && hardFailCount() === 0;

    return Object.freeze({
      streamId: stream.id,
      streamName: stream.id,
      category: stream.category,
      downstreamFile: stream.downstreamFile,
      ownerStatus: stream.ownerStatus,
      activationHeld: true,
      downstreamFileCreated: false,

      nodeCount: nodeCount,
      primaryNodeCount: primary.length,
      secondaryNodeCount: Math.max(0, nodeCount - primary.length),
      averagePressure: nodeCount ? round(pressureTotal / nodeCount, 4) : 0,
      maxPressure: round(maxPressure, 4),
      coherenceScore: nodeCount ? round(coherenceTotal / nodeCount, 4) : 1,

      renderEligible: renderEligible,
      runtimeCostEstimate: round(nodeCount * 0.18 + primary.length * 0.07, 4),
      mobilePriority: stream.mobilePriority,
      fallbackMode: active ? "category_field_fallback" : "held_socket_receipt_only",
      dependencies: dependenciesForStream(stream.id),
      nodeRefs: matching.map(function (node) {
        return node.nodeId;
      }),
      compactNodes: matching.map(compactNodeForStream)
    });
  }

  function dependenciesForStream(streamId) {
    if (streamId === "surfaceStream") return ["macro_shape", "node_map"];
    if (streamId === "elevationStream") return ["surfaceStream", "summitStream", "ridgeStream", "basinStream", "valleyStream"];
    if (streamId === "hydrationStream") return ["elevationStream", "basinStream", "valleyStream", "coastStream"];
    if (streamId === "marshStream" || streamId === "wetlandStream") return ["hydrationStream", "basinStream", "valleyStream"];
    if (streamId === "surfaceHabitabilityStream" || streamId === "fieldBlueprintStream") return ["terrainDatumPacket", "hydrationStream", "surfaceStream", "elevationStream"];
    if (streamId === "biomeStreamHeld" || streamId === "ecologyStreamHeld") return ["surfaceStream", "hydrationStream", "surfaceHabitabilityStream", "future_downstream_authorization"];
    if (streamId === "settlementStreamHeld" || streamId === "urbanStreamHeld") return ["planet_core_child", "hydrationStream", "surfaceHabitabilityStream", "ecologyStreamHeld", "future_downstream_authorization"];
    return ["node_map", "category_map"];
  }

  function compactNodeForStream(node) {
    return {
      nodeId: node.nodeId,
      x: node.x,
      y: node.y,
      primaryCategory: node.primaryCategory,
      terrainClass: node.terrainClass,
      hydrationClass: node.hydrationClass,
      coherenceScore: node.coherenceScore,
      renderEligible: node.renderEligible,
      terrainDatumClass: node.terrainDatum ? node.terrainDatum.terrainDatumClass : null
    };
  }

  function buildStreamRegistry() {
    var packets = {};
    for (var i = 0; i < STREAM_DEFINITIONS.length; i += 1) {
      var packet = makeStreamPacket(STREAM_DEFINITIONS[i]);
      packets[packet.streamId] = packet;
    }
    return Object.freeze(packets);
  }

  var STREAM_REGISTRY = buildStreamRegistry();

  function runtimeMetrics() {
    var renderEligibleNodeCount = countNodes(function (node) {
      return node.renderEligible;
    });

    var streamIds = Object.keys(STREAM_REGISTRY);
    var activeStreamCount = streamIds.filter(function (streamId) {
      return STREAM_REGISTRY[streamId].ownerStatus !== "future_socket_held";
    }).length;

    var heldStreamCount = streamIds.length - activeStreamCount;
    var renderEligibleStreamCount = streamIds.filter(function (streamId) {
      return STREAM_REGISTRY[streamId].renderEligible;
    }).length;

    var estimatedDrawUnits = renderEligibleNodeCount + SURFACE_UNITS.length;
    var mobileCostClass = estimatedDrawUnits <= 240 ? "mobile_safe" : estimatedDrawUnits <= 420 ? "mobile_medium" : "mobile_high";
    var desktopCostClass = estimatedDrawUnits <= 420 ? "desktop_safe" : estimatedDrawUnits <= 760 ? "desktop_medium" : "desktop_high";

    return {
      metricsReady: true,
      runtimeStrengthHeld: true,
      runtimeActivationAuthorized: false,

      nodeCount: NODE_COUNT,
      landNodeCount: countNodes(function (node) { return node.continentMembership; }),
      outsideNodeCount: countNodes(function (node) { return !node.continentMembership; }),
      shelfNodeCount: countNodes(function (node) { return node.primaryCategory === CATEGORY.SHELF; }),
      surfaceUnitCount: SURFACE_UNITS.length,

      streamCount: streamIds.length,
      activeStreamCount: activeStreamCount,
      heldStreamCount: heldStreamCount,
      renderEligibleStreamCount: renderEligibleStreamCount,

      coherenceAverage: averageNodes(function (node) { return node.coherenceScore; }),
      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      renderEligibleNodeCount: renderEligibleNodeCount,

      estimatedDrawUnits: estimatedDrawUnits,
      mobileCostClass: mobileCostClass,
      desktopCostClass: desktopCostClass,
      fallbackMode: "progressive_category_field_fallback",
      recommendedRenderTier: RENDER_TIERS.T3,
      authorizedRenderTiers: [RENDER_TIERS.T0, RENDER_TIERS.T1, RENDER_TIERS.T2, RENDER_TIERS.T3],
      heldRenderTiers: [RENDER_TIERS.T4, RENDER_TIERS.T5],
      recommendedMobileStreamOrder: [
        "surfaceStream",
        "elevationStream",
        "coastStream",
        "ridgeStream",
        "basinStream",
        "valleyStream",
        "hydrationStream",
        "surfaceHabitabilityStream",
        "fieldBlueprintStream",
        "marshStream",
        "wetlandStream",
        "textureStream",
        "biomeStreamHeld",
        "ecologyStreamHeld",
        "settlementStreamHeld",
        "urbanStreamHeld"
      ],

      surfaceHabitabilityDownstreamRegistered: true,
      terrainDatumPacketReady: true,
      reciprocalBlueprintIntakeReady: true
    };
  }

  var RUNTIME_METRICS = Object.freeze(runtimeMetrics());

  function compactNode(node) {
    return {
      nodeId: node.nodeId,
      nodeIndex: node.nodeIndex,
      x: node.x,
      y: node.y,
      continentMembership: node.continentMembership,
      primaryCategory: node.primaryCategory,
      secondaryCategories: node.secondaryCategories,
      terrainClass: node.terrainClass,
      hydrationClass: node.hydrationClass,
      elevation: node.elevation,
      coherenceScore: node.coherenceScore,
      hardFail: node.hardFail,
      renderEligible: node.renderEligible,
      terrainDatumClass: node.terrainDatum ? node.terrainDatum.terrainDatumClass : null,
      surfaceHabitabilityPressure: node.surfaceHabitabilityPressure
    };
  }

  function carrierCompatibleSeat(node) {
    return {
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,
      x: node.x,
      y: node.y,
      continentMembership: node.continentMembership,
      continentId: node.continentId,
      continentName: node.continentName,
      continentCore: node.continentMembership && node.coastPressure < 0.45 && node.elevation > 0.48,
      elevation: node.elevation,
      baseElevation: node.baseElevation,
      nearestSummitId: node.nearestSummitId,
      nearestSummitName: node.nearestSummitName,
      ridgeStatus: node.ridgeStatus,
      basinStatus: node.basinStatus,
      valleyStatus: node.valleyStatus,
      coastEligible: node.coastEligible,
      waterFillEligible: node.waterFillEligible,
      hydrationDepth: node.hydrationDepth,
      hydrationClass: node.hydrationClass,
      terrainClass: node.terrainClass,
      terrainDatumClass: node.terrainDatum ? node.terrainDatum.terrainDatumClass : null,
      seaLevelDatum: SEA_LEVEL_DATUM,
      aboveSeaLevelMass: node.terrainDatum ? node.terrainDatum.aboveSeaLevelMass : false,
      surfaceExpressionDatum: node.terrainDatum ? node.terrainDatum.surfaceExpressionDatum : node.elevation,
      newsComplete: node.newsComplete,
      coherenceScore: node.coherenceScore
    };
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,

      childType: "gratitude_continent_upstream_engine",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      engineClass: ENGINE_CLASS,

      multiStreamOptimizationEngine: true,
      upstreamClassificationEngine: true,
      mapFirstCategorizeSecondPublishStreamsThirdRenderLater: true,

      nodeCount: NODE_COUNT,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: allNEWSComplete(),
      newsFailureCount: allNEWSComplete() ? 0 : 1,

      categoryMapReady: true,
      categoryStreamsReady: true,
      streamRegistryReady: true,
      runtimeMetricsReady: true,
      downstreamRegistryReady: true,

      surfaceHabitabilityDownstreamRegistered: true,
      surfaceHabitabilityDownstreamFile: DOWNSTREAM_FILES.surfaceHabitability,
      fieldBlueprintStreamRegistered: true,
      terrainDatumPacketReady: true,
      reciprocalBlueprintIntakeReady: true,

      seaLevelDatumMapped: true,
      aboveSeaLevelMassMapped: true,
      basinRimDatumMapped: true,
      valleyFloorDatumMapped: true,
      ridgeCrestDatumMapped: true,
      coastDatumMapped: true,
      shelfDatumMapped: true,
      waterTableDatumHeld: true,
      surfaceExpressionDatumMapped: true,

      mountainRangesReserved: true,
      desertLandReserved: true,
      dryBasinsReserved: true,
      rainShadowZonesReserved: true,

      basinsMapped: true,
      marshesMapped: true,
      ridgesMapped: true,
      valleysMapped: true,
      coastMapped: true,
      shelfMapped: true,
      hydrationMapped: true,
      textureMapped: true,
      mineralsMapped: true,
      soilsMapped: true,

      terrainClassCounts: terrainClassCounts(),
      hydrationClassCounts: hydrationClassCounts(),
      categoryCounts: categoryCounts(),

      landNodeCount: RUNTIME_METRICS.landNodeCount,
      outsideNodeCount: RUNTIME_METRICS.outsideNodeCount,
      shelfNodeCount: RUNTIME_METRICS.shelfNodeCount,
      surfaceUnitCount: SURFACE_UNITS.length,

      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      coherenceAverage: RUNTIME_METRICS.coherenceAverage,

      ecologySocketHeld: true,
      biomeSocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,
      weatherSocketHeld: true,

      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      hydrationChildUntouched: true,
      surfaceHabitabilityChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      generatedImage: false,
      graphicBox: false,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      runtimeMetrics: deepClone(RUNTIME_METRICS),
      deployMarker: "AUDRALIA_GRATITUDE_TERRAIN_ENGINE_SURFACE_HABITABILITY_BLUEPRINT_REGISTRY_ALIGNMENT_DEPLOY_MARKER_v1"
    };
  }

  function getNodeMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      nodeCount: NODE_COUNT,
      nodeMapReady: true,
      nodes: compact ? NODES.map(compactNode) : NODES.map(deepClone)
    };
  }

  function getNEWSMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: allNEWSComplete(),
      nodes: NODES.map(function (node) {
        if (compact) {
          return {
            nodeId: node.nodeId,
            complete: node.NEWS.complete,
            north: node.north.defined,
            east: node.east.defined,
            west: node.west.defined,
            south: node.south.defined,
            primaryCategory: node.primaryCategory,
            terrainDatumPacketReady: node.terrainDatumPacketReady,
            reciprocalBlueprintIntakeReady: node.reciprocalBlueprintIntakeReady
          };
        }

        return {
          nodeId: node.nodeId,
          nodeIndex: node.nodeIndex,
          NEWS: deepClone(node.NEWS)
        };
      })
    };
  }

  function getCategoryMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      categoryMapReady: true,
      categoryCounts: categoryCounts(),
      terrainClassCounts: terrainClassCounts(),
      hydrationClassCounts: hydrationClassCounts(),
      categories: deepClone(CATEGORY),
      nodes: compact ? NODES.map(compactNode) : NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          nodeIndex: node.nodeIndex,
          x: node.x,
          y: node.y,
          primaryCategory: node.primaryCategory,
          secondaryCategories: node.secondaryCategories,
          categoryStrengths: node.categoryStrengths,
          terrainClass: node.terrainClass,
          hydrationClass: node.hydrationClass,
          surfaceHabitabilityPressure: node.surfaceHabitabilityPressure
        };
      })
    };
  }

  function getCoherenceMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      coherenceConstraintsActive: true,
      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      coherenceAverage: RUNTIME_METRICS.coherenceAverage,
      rules: [
        "summit_primary_cannot_be_marsh_primary",
        "deep_basin_cannot_be_summit_anchor",
        "marsh_requires_wetness_or_lowland_support",
        "coast_requires_boundary_adjacency",
        "hydration_primary_requires_terrain_permission",
        "surface_habitability_is_downstream_advisory_only",
        "settlement_and_urban_remain_held",
        "final_visual_pass_forbidden"
      ],
      nodes: compact ? NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          coherenceScore: node.coherenceScore,
          hardFail: node.hardFail,
          warningCount: node.constraintWarnings.length
        };
      }) : NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          coherenceScore: node.coherenceScore,
          hardFail: node.hardFail,
          failures: node.constraintFailures,
          warnings: node.constraintWarnings
        };
      })
    };
  }

  function getRuntimeMetrics() {
    return deepClone(RUNTIME_METRICS);
  }

  function getStreamRegistry(options) {
    var compact = Boolean(options && options.compact);
    var streamIds = Object.keys(STREAM_REGISTRY);
    return {
      contract: CONTRACT,
      streamRegistryReady: true,
      streamCount: streamIds.length,
      surfaceHabitabilityDownstreamRegistered: true,
      terrainDatumPacketReady: true,
      streams: streamIds.map(function (streamId) {
        var stream = STREAM_REGISTRY[streamId];
        if (compact) {
          return {
            streamId: stream.streamId,
            category: stream.category,
            nodeCount: stream.nodeCount,
            primaryNodeCount: stream.primaryNodeCount,
            ownerStatus: stream.ownerStatus,
            renderEligible: stream.renderEligible,
            downstreamFile: stream.downstreamFile
          };
        }
        return deepClone(stream);
      })
    };
  }

  function getStreamPacket(streamId, options) {
    var compact = Boolean(options && options.compact);
    var packet = STREAM_REGISTRY[streamId] || null;

    if (!packet) {
      return {
        contract: CONTRACT,
        streamId: streamId,
        available: false,
        failureReason: "stream not found"
      };
    }

    if (!compact) return deepClone(packet);

    return {
      contract: CONTRACT,
      streamId: packet.streamId,
      category: packet.category,
      downstreamFile: packet.downstreamFile,
      ownerStatus: packet.ownerStatus,
      nodeCount: packet.nodeCount,
      primaryNodeCount: packet.primaryNodeCount,
      secondaryNodeCount: packet.secondaryNodeCount,
      averagePressure: packet.averagePressure,
      maxPressure: packet.maxPressure,
      coherenceScore: packet.coherenceScore,
      renderEligible: packet.renderEligible,
      activationHeld: packet.activationHeld,
      compactNodes: packet.compactNodes
    };
  }

  function getSurfaceMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      surfaceMapReady: true,
      continentId: CONTINENT_ID,
      macroShape: deepClone(MACRO_SHAPE),
      landNodeCount: RUNTIME_METRICS.landNodeCount,
      surfaceUnitCount: SURFACE_UNITS.length,
      nodes: compact ? NODES.filter(function (node) {
        return node.continentMembership;
      }).map(compactNode) : NODES.map(carrierCompatibleSeat),
      surfaceUnits: compact ? SURFACE_UNITS.map(compactSurfaceUnit) : SURFACE_UNITS.map(deepClone)
    };
  }

  function compactSurfaceUnit(unit) {
    return {
      tileId: unit.tileId,
      parentNodeId: unit.parentNodeId,
      x: unit.x,
      y: unit.y,
      rx: unit.rx,
      ry: unit.ry,
      shape: unit.shape,
      elevation: unit.elevation,
      terrainClass: unit.terrainClass,
      hydrationClass: unit.hydrationClass,
      waterFillEligible: unit.waterFillEligible,
      hydrationDepth: unit.hydrationDepth,
      renderEligible: unit.renderEligible
    };
  }

  function getElevationMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      elevationMapReady: true,
      elevationComputedBeforeHydration: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      nodes: compact ? NODES.map(function (node) {
        return { nodeId: node.nodeId, x: node.x, y: node.y, elevation: node.elevation };
      }) : NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          x: node.x,
          y: node.y,
          elevation: node.elevation,
          baseElevation: node.baseElevation,
          seaLevelDatum: SEA_LEVEL_DATUM,
          aboveSeaLevelMass: node.terrainDatum ? node.terrainDatum.aboveSeaLevelMass : false,
          summitPressure: node.summitPressure,
          ridgePressure: node.ridgePressure,
          basinPressure: node.basinPressure,
          valleyPressure: node.valleyPressure
        };
      })
    };
  }

  function getSummitMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      summitMapReady: true,
      nineSummitsEmbedded: true,
      nineSummitsShapeTerrain: true,
      nineSummitsCompressedInsideOblongLandmass: true,
      mountainRangesReserved: true,
      summitCount: SUMMITS.length,
      summits: compact ? SUMMITS.map(function (summit) {
        return { id: summit.id, name: summit.name, x: summit.x, y: summit.y, elevationPressure: summit.elevationPressure };
      }) : SUMMITS.map(deepClone),
      summitNodes: NODES.filter(function (node) {
        return node.primaryCategory === CATEGORY.SUMMIT || node.summitPressure > 0.58;
      }).map(compactNode)
    };
  }

  function getRidgeMap(options) {
    var compact = Boolean(options && options.compact);
    return categorySpecificMap("ridgeMapReady", CATEGORY.RIDGE, "ridgePressure", compact);
  }

  function getBasinMap(options) {
    var compact = Boolean(options && options.compact);
    return categorySpecificMap("basinMapReady", CATEGORY.BASIN, "basinPressure", compact);
  }

  function getValleyMap(options) {
    var compact = Boolean(options && options.compact);
    return categorySpecificMap("valleyMapReady", CATEGORY.VALLEY, "valleyPressure", compact);
  }

  function getMarshMap(options) {
    var compact = Boolean(options && options.compact);
    return categorySpecificMap("marshMapReady", CATEGORY.MARSH, "marshPressure", compact);
  }

  function getCoastMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      coastMapReady: true,
      coastMapped: true,
      shelfMapped: true,
      coastDatumMapped: true,
      nodes: NODES.filter(function (node) {
        return node.primaryCategory === CATEGORY.COAST ||
          node.primaryCategory === CATEGORY.SHELF ||
          node.coastPressure > 0.45 ||
          node.shelfPressure > 0.45;
      }).map(function (node) {
        if (compact) {
          return {
            nodeId: node.nodeId,
            x: node.x,
            y: node.y,
            primaryCategory: node.primaryCategory,
            coastPressure: node.coastPressure,
            shelfPressure: node.shelfPressure
          };
        }
        return deepClone(node);
      })
    };
  }

  function getHydrationMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      hydrationMapReady: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,
      waterTableDatumHeld: true,
      hydrationSequence: [
        "land membership",
        "elevation",
        "sea level datum",
        "ridge pressure",
        "basin pressure",
        "valley pressure",
        "marsh pressure",
        "wetland pressure",
        "runoff pressure",
        "hydration depth"
      ],
      seats: compact ? NODES.map(function (node) {
        return {
          seatIndex: node.seatIndex,
          seatKey: node.seatKey,
          x: node.x,
          y: node.y,
          land: node.continentMembership,
          waterFillEligible: node.waterFillEligible,
          hydrationDepth: node.hydrationDepth,
          hydrationClass: node.hydrationClass
        };
      }) : NODES.map(carrierCompatibleSeat),
      nodes: compact ? NODES.map(compactNode) : NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          x: node.x,
          y: node.y,
          hydrationPressure: node.hydrationPressure,
          hydrationDepth: node.hydrationDepth,
          hydrationClass: node.hydrationClass,
          waterFillEligible: node.waterFillEligible,
          basinPressure: node.basinPressure,
          valleyPressure: node.valleyPressure,
          marshPressure: node.marshPressure,
          wetlandPressure: node.wetlandPressure,
          waterTableDatumHeld: node.terrainDatum ? node.terrainDatum.waterTableDatumHeld : null
        };
      })
    };
  }

  function getTextureMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      textureMapReady: true,
      materialClasses: MATERIAL_CLASSES.slice(),
      nodes: compact ? NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          x: node.x,
          y: node.y,
          texturePressure: node.texturePressure,
          soilPressure: node.soilPressure,
          mineralPressure: node.mineralPressure,
          sedimentPressure: node.sedimentPressure
        };
      }) : NODES.map(deepClone),
      surfaceUnits: compact ? SURFACE_UNITS.map(function (unit) {
        return {
          tileId: unit.tileId,
          textureChannels: unit.textureChannels
        };
      }) : SURFACE_UNITS.map(deepClone)
    };
  }

  function getFutureSocketMap(options) {
    var compact = Boolean(options && options.compact);
    return {
      contract: CONTRACT,
      futureSocketsHeld: true,
      biomeSocketHeld: true,
      ecologySocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,
      weatherSocketHeld: true,
      surfaceHabitabilityDownstreamRegistered: true,
      activationAuthorized: false,
      rules: {
        ecologyRequiresHydrationChild: true,
        ecologyRequiresSurfaceHabitabilityChild: true,
        settlementRequiresCoreAndHydration: true,
        settlementRequiresSurfaceHabitability: true,
        urbanRequiresCoreTectonicStability: true,
        biomeRequiresTerrainAndHydrationDefinition: true,
        downstreamFilesRequiredBeforeActivation: true
      },
      nodes: compact ? NODES.map(function (node) {
        return {
          nodeId: node.nodeId,
          terrainClass: node.terrainClass,
          hydrationClass: node.hydrationClass,
          futureBiomeClassHeld: node.futureBiomeClassHeld,
          futureSettlementEligibilityHeld: node.futureSettlementEligibilityHeld
        };
      }) : NODES.map(deepClone)
    };
  }

  function getTerrainDatumPacket(target, options) {
    var compact = Boolean(options && options.compact);
    var datumNodes = NODES.map(function (node) {
      return compact ? {
        datumNodeId: node.terrainDatum.datumNodeId,
        sourceNodeId: node.nodeId,
        x: node.x,
        y: node.y,
        terrainDatumClass: node.terrainDatum.terrainDatumClass,
        seaLevelDatum: node.terrainDatum.seaLevelDatum,
        aboveSeaLevelMass: node.terrainDatum.aboveSeaLevelMass,
        surfaceExpressionDatum: node.terrainDatum.surfaceExpressionDatum,
        ridgeCrestDatum: node.terrainDatum.ridgeCrestDatum,
        valleyFloorDatum: node.terrainDatum.valleyFloorDatum,
        basinFloorDatum: node.terrainDatum.basinFloorDatum,
        basinRimDatum: node.terrainDatum.basinRimDatum,
        coastDatum: node.terrainDatum.coastDatum,
        waterTableDatumHeld: node.terrainDatum.waterTableDatumHeld,
        mountainRangeReserved: node.terrainDatum.mountainRangeReserved,
        desertLandReserved: node.terrainDatum.desertLandReserved,
        dryBasinReserved: node.terrainDatum.dryBasinReserved,
        rainShadowZoneReserved: node.terrainDatum.rainShadowZoneReserved
      } : deepClone(node.terrainDatum);
    });

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-terrain-datum-consumer",
      terrainDatumPacketReady: true,
      reciprocalBlueprintIntakeReady: true,
      advisoryPressureOnly: true,
      terrainAuthorityRetained: true,

      seaLevelDatum: SEA_LEVEL_DATUM,
      coastalDatumTolerance: COASTAL_DATUM_TOLERANCE,
      aboveSeaLevelMassMapped: true,
      basinRimDatumMapped: true,
      valleyFloorDatumMapped: true,
      ridgeCrestDatumMapped: true,
      coastDatumMapped: true,
      shelfDatumMapped: true,
      waterTableDatumHeld: true,
      surfaceExpressionDatumMapped: true,

      mountainRangesReserved: true,
      desertLandReserved: true,
      dryBasinsReserved: true,
      rainShadowZonesReserved: true,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,
      ecologyAuthoritySeized: false,
      settlementAuthoritySeized: false,
      urbanAuthoritySeized: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      datumNodes: datumNodes
    };
  }

  function getReciprocalBlueprintIntakeStatus(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      reciprocalBlueprintIntakeReady: true,
      surfaceHabitabilityDownstreamRegistered: true,
      surfaceHabitabilityDownstreamFile: DOWNSTREAM_FILES.surfaceHabitability,
      acceptedAdvisorySource: "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_ALIGNMENT_TNT_v1",
      acceptedAdvisoryGlobal: "window.AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD",
      acceptedBlueprintPacket: "getSurfaceHabitabilityBlueprintPacket(target, options)",

      terrainMayReceiveAdvisoryPressure: true,
      terrainAuthorityRetained: true,
      hydrationAuthorityRetainedByHydrationChild: true,
      climateAuthorityRetainedBySurfaceHabitabilityChild: true,
      atmosphereAuthorityRetainedBySurfaceHabitabilityChild: true,
      ecologyAuthorityHeld: true,
      settlementAuthorityHeld: true,
      urbanAuthorityHeld: true,

      acceptableBlueprintFields: [
        "requiredElevationBands",
        "requiredSlopeBands",
        "requiredTemperatureBands",
        "requiredPressureBands",
        "requiredBarometricPressureBands",
        "requiredHumidityBands",
        "requiredAirDensityBands",
        "requiredOxygenIndexBands",
        "requiredCarbonIndexBands",
        "requiredAirQualityBands",
        "requiredWindCorridors",
        "requiredFrontalBoundaries",
        "requiredAtmosphericStabilityZones",
        "requiredEvaporationZones",
        "requiredCondensationZones",
        "requiredRainfallRoutingZones",
        "requiredSnowpackZones",
        "requiredFrostLineZones",
        "requiredStormSurgeZones",
        "requiredBreathabilityZones",
        "requiredDesertHeatZones",
        "requiredMarshHumidityZones",
        "requiredLakeRetentionZones",
        "requiredAquiferRechargeZones",
        "requiredEcologyReadinessHeldZones",
        "requiredSettlementHeldZones"
      ],

      currentTerrainDatumPacket: compact ? {
        seaLevelDatum: SEA_LEVEL_DATUM,
        terrainDatumPacketReady: true,
        nodeCount: NODE_COUNT
      } : getTerrainDatumPacket("reciprocal-blueprint-intake-status", { compact: true }),

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function categorySpecificMap(flagName, category, pressureKey, compact) {
    var nodes = NODES.filter(function (node) {
      return node.primaryCategory === category || (node.categoryStrengths[category] || 0) > 0.44;
    });

    var payload = {
      contract: CONTRACT
    };

    payload[flagName] = true;
    payload.category = category;
    payload.nodeCount = nodes.length;
    payload.nodes = nodes.map(function (node) {
      if (compact) {
        return {
          nodeId: node.nodeId,
          x: node.x,
          y: node.y,
          primaryCategory: node.primaryCategory,
          pressure: node[pressureKey],
          terrainClass: node.terrainClass,
          hydrationClass: node.hydrationClass
        };
      }
      return deepClone(node);
    });

    return payload;
  }

  function getChildReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-downstream-consumer",
      childReceivePacketReady: true,
      childType: "gratitude_continent_upstream_engine",

      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      engineClass: ENGINE_CLASS,

      multiStreamOptimizationEngine: true,
      upstreamClassificationEngine: true,
      mapFirstCategorizeSecondPublishStreamsThirdRenderLater: true,

      nodeCount: NODE_COUNT,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,

      newsProtocolActive: true,
      newsOrder: NEWS_ORDER.slice(),
      newsComplete: allNEWSComplete(),
      chronologyComplete: true,
      relationshipMapReady: true,

      hardFailCount: hardFailCount(),
      warningCount: warningCount(),
      coherenceAverage: RUNTIME_METRICS.coherenceAverage,

      streamRegistryReady: true,
      categoryStreamsReady: true,
      runtimeMetricsReady: true,
      downstreamRegistryReady: true,

      surfaceHabitabilityDownstreamRegistered: true,
      surfaceHabitabilityDownstreamFile: DOWNSTREAM_FILES.surfaceHabitability,
      fieldBlueprintStreamRegistered: true,
      terrainDatumPacketReady: true,
      reciprocalBlueprintIntakeReady: true,

      seaLevelDatumMapped: true,
      aboveSeaLevelMassMapped: true,
      basinRimDatumMapped: true,
      valleyFloorDatumMapped: true,
      ridgeCrestDatumMapped: true,
      coastDatumMapped: true,
      shelfDatumMapped: true,
      waterTableDatumHeld: true,
      surfaceExpressionDatumMapped: true,

      mountainRangesReserved: true,
      desertLandReserved: true,
      dryBasinsReserved: true,
      rainShadowZonesReserved: true,

      basinsMapped: true,
      marshesMapped: true,
      ridgesMapped: true,
      valleysMapped: true,
      coastMapped: true,
      shelfMapped: true,
      hydrationMapped: true,
      textureMapped: true,

      landFirst: true,
      nineSummitsEmbedded: true,
      nineSummitsShapeTerrain: true,
      elevationComputedBeforeHydration: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,

      ecologySocketHeld: true,
      biomeSocketHeld: true,
      settlementSocketHeld: true,
      urbanLayerSocketHeld: true,

      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      hydrationChildUntouched: true,
      surfaceHabitabilityChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalEcologyPassClaim: false,
      finalSettlementPassClaim: false,
      finalVisualPassClaim: false,

      climateAuthoritySeized: false,
      atmosphereAuthoritySeized: false,

      status: status(),
      runtimeMetrics: getRuntimeMetrics(),
      nodeMap: getNodeMap({ compact: compact }),
      newsMap: getNEWSMap({ compact: compact }),
      categoryMap: getCategoryMap({ compact: compact }),
      coherenceMap: getCoherenceMap({ compact: compact }),
      streamRegistry: getStreamRegistry({ compact: compact }),
      terrainDatumPacket: getTerrainDatumPacket(target || "child-receive-packet", { compact: compact }),
      reciprocalBlueprintIntakeStatus: getReciprocalBlueprintIntakeStatus({ compact: compact }),
      surfaceMap: getSurfaceMap({ compact: compact }),
      elevationMap: getElevationMap({ compact: compact }),
      summitMap: getSummitMap({ compact: compact }),
      ridgeMap: getRidgeMap({ compact: compact }),
      basinMap: getBasinMap({ compact: compact }),
      valleyMap: getValleyMap({ compact: compact }),
      marshMap: getMarshMap({ compact: compact }),
      coastMap: getCoastMap({ compact: compact }),
      hydrationMap: getHydrationMap({ compact: compact }),
      textureMap: getTextureMap({ compact: compact }),
      futureSocketMap: getFutureSocketMap({ compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    engineClass: ENGINE_CLASS,

    status: status,
    getNodeMap: getNodeMap,
    getNEWSMap: getNEWSMap,
    getCategoryMap: getCategoryMap,
    getCoherenceMap: getCoherenceMap,
    getRuntimeMetrics: getRuntimeMetrics,
    getStreamRegistry: getStreamRegistry,
    getStreamPacket: getStreamPacket,
    getSurfaceMap: getSurfaceMap,
    getElevationMap: getElevationMap,
    getSummitMap: getSummitMap,
    getRidgeMap: getRidgeMap,
    getBasinMap: getBasinMap,
    getValleyMap: getValleyMap,
    getMarshMap: getMarshMap,
    getCoastMap: getCoastMap,
    getHydrationMap: getHydrationMap,
    getTextureMap: getTextureMap,
    getFutureSocketMap: getFutureSocketMap,
    getTerrainDatumPacket: getTerrainDatumPacket,
    getReciprocalBlueprintIntakeStatus: getReciprocalBlueprintIntakeStatus,

    // Backward-compatible carrier-facing APIs.
    getContinentMap: getSurfaceMap,
    getChildReceivePacket: getChildReceivePacket
  });

  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD = API;
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_STATUS = status();
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_RECEIVE_PACKET = getChildReceivePacket("published-static-gratitude-terrain-engine-blueprint-registry-alignment", { compact: true });
  window.AUDRALIA_GRATITUDE_STREAM_REGISTRY = getStreamRegistry({ compact: true });
  window.AUDRALIA_GRATITUDE_RUNTIME_METRICS = getRuntimeMetrics();
  window.AUDRALIA_GRATITUDE_TERRAIN_DATUM_PACKET = getTerrainDatumPacket("published-static-terrain-datum", { compact: true });
  window.AUDRALIA_GRATITUDE_RECIPROCAL_BLUEPRINT_INTAKE_STATUS = getReciprocalBlueprintIntakeStatus({ compact: true });
})();
