// /assets/audralia/clean/terrain/audralia.gratitude.continent.child.js
// AUDRALIA_GRATITUDE_TERRAIN_DEFINITION_ASSET_SYSTEM_TNT_v1
// Full-file replacement.
// Scope: Gratitude terrain-definition asset only.
// Purpose: build Gratitude as a real terrain-definition asset system: oblong landmass,
// smaller hex-rect terrain image-units, texture channels, hydration channels, and held future sockets.
// Does not own: HTML, script tags, cache keys, carrier rendering, core physics, ecology activation,
// settlement activation, Runtime / Strength, final terrain pass, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_GRATITUDE_TERRAIN_DEFINITION_ASSET_SYSTEM_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_GRATITUDE_CONTINENT_CHINA_SCALE_OBLONG_FOOTPRINT_CHILD_TNT_v1";
  var FILE = "/assets/audralia/clean/terrain/audralia.gratitude.continent.child.js";

  var CONTINENT_ID = "gratitude";
  var CONTINENT_NAME = "Continent of Gratitude";
  var ASSET_CLASS = "terrain_definition_asset_system";
  var SURFACE_UNIT_SHAPE = "hex_rect_terrain_image_unit";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
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

  function makeSeatKey(x, y) {
    return "G-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function makeTileId(index) {
    return "GRATITUDE-TERRAIN-UNIT-" + String(index).padStart(4, "0");
  }

  var MACRO_SHAPE = Object.freeze({
    id: "gratitude_oblong_body",
    continentId: CONTINENT_ID,
    shape: "asymmetric_oblong",
    centerX: 8.55,
    centerY: 7.95,
    radiusX: 4.15,
    radiusY: 2.48,
    rotationRadians: -0.18,
    visibleIntent: "double_current_compact_landmass_without_returning_to_hemisphere_sheet",
    scaleRead: "large_country_to_major_continent_seed",
    notHemisphereSheet: true,
    notRectangle: true,
    notPlanetBlanket: true
  });

  var SUMMITS = Object.freeze([
    Object.freeze({ id: "summit_01", name: "First Summit of Gratitude", x: 7.40, y: 5.45, elevationPressure: 0.92, ridgeBias: "northwest_crown", runoffBias: "central_south" }),
    Object.freeze({ id: "summit_02", name: "Second Summit of Gratitude", x: 8.70, y: 5.25, elevationPressure: 1.00, ridgeBias: "north_crown", runoffBias: "central_south" }),
    Object.freeze({ id: "summit_03", name: "Third Summit of Gratitude", x: 10.00, y: 5.65, elevationPressure: 0.90, ridgeBias: "northeast_crown", runoffBias: "southwest" }),

    Object.freeze({ id: "summit_04", name: "Fourth Summit of Gratitude", x: 6.55, y: 7.45, elevationPressure: 0.84, ridgeBias: "west_shoulder", runoffBias: "east_lowland" }),
    Object.freeze({ id: "summit_05", name: "Fifth Summit of Gratitude", x: 8.55, y: 7.65, elevationPressure: 1.08, ridgeBias: "central_keystone", runoffBias: "radial" }),
    Object.freeze({ id: "summit_06", name: "Sixth Summit of Gratitude", x: 10.75, y: 7.75, elevationPressure: 0.86, ridgeBias: "east_shoulder", runoffBias: "west_lowland" }),

    Object.freeze({ id: "summit_07", name: "Seventh Summit of Gratitude", x: 7.10, y: 9.70, elevationPressure: 0.80, ridgeBias: "southwest_shoulder", runoffBias: "northeast" }),
    Object.freeze({ id: "summit_08", name: "Eighth Summit of Gratitude", x: 9.45, y: 9.95, elevationPressure: 0.86, ridgeBias: "south_crown", runoffBias: "central" }),
    Object.freeze({ id: "summit_09", name: "Ninth Summit of Gratitude", x: 10.25, y: 10.90, elevationPressure: 0.88, ridgeBias: "southeast_tail", runoffBias: "northwest" })
  ]);

  var TERRAIN_REGIONS = Object.freeze([
    Object.freeze({
      id: "north_crown_highlands",
      terrainClass: "summit_highland",
      role: "primary highland arc holding the northern summit chain",
      centerX: 8.55,
      centerY: 5.55
    }),
    Object.freeze({
      id: "central_gratitude_keystone",
      terrainClass: "ridge_highland",
      role: "central summit and ridge transfer node",
      centerX: 8.55,
      centerY: 7.65
    }),
    Object.freeze({
      id: "western_upland_slope",
      terrainClass: "upland_slope",
      role: "western slope and runoff shoulder",
      centerX: 6.65,
      centerY: 7.95
    }),
    Object.freeze({
      id: "eastern_lowland_shelf",
      terrainClass: "interior_plain",
      role: "eastern settlement-held plain candidate",
      centerX: 10.70,
      centerY: 8.20
    }),
    Object.freeze({
      id: "central_basin_floor",
      terrainClass: "basin_floor",
      role: "basin capture and lake-candidate terrain",
      centerX: 8.80,
      centerY: 8.55
    }),
    Object.freeze({
      id: "south_valley_corridor",
      terrainClass: "valley_corridor",
      role: "southward drainage and valley-fill corridor",
      centerX: 9.20,
      centerY: 10.10
    }),
    Object.freeze({
      id: "coastal_edge_ring",
      terrainClass: "coastal_edge",
      role: "held coast pressure, not final coastline",
      centerX: 8.55,
      centerY: 7.95
    }),
    Object.freeze({
      id: "lowland_wetland_candidate",
      terrainClass: "lowland_wetland_candidate",
      role: "hydration-ready future ecology zone, held",
      centerX: 9.55,
      centerY: 9.25
    })
  ]);

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
      Math.sin((x + 1.3) * 1.71) * 0.045 +
      Math.cos((y + 2.1) * 1.39) * 0.038 +
      Math.sin((x * 0.73 + y * 1.09)) * 0.030;

    return oblong - irregularEdge;
  }

  function insideMacroShape(x, y) {
    return macroMaskScore(x, y) <= 1.0;
  }

  function edgePressure(x, y) {
    var score = macroMaskScore(x, y);
    return clamp(1 - Math.abs(1 - score) / 0.32, 0, 1);
  }

  function summitInfluence(x, y) {
    var total = 0;
    var max = 0;
    var nearest = null;
    var nearestDistance = Infinity;

    for (var i = 0; i < SUMMITS.length; i += 1) {
      var summit = SUMMITS[i];
      var d = distance(x, y, summit.x, summit.y);
      var influence = clamp(1 - d / 1.72, 0, 1) * summit.elevationPressure;

      total += influence;
      max = Math.max(max, influence);

      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = summit;
      }
    }

    return {
      total: clamp(total / 2.15, 0, 1),
      max: clamp(max, 0, 1),
      nearest: nearest,
      nearestDistance: nearestDistance
    };
  }

  function ridgePressure(x, y) {
    var ridge = 0;

    ridge += lineInfluence(x, y, 7.40, 5.45, 8.70, 5.25, 0.55, 0.35);
    ridge += lineInfluence(x, y, 8.70, 5.25, 10.00, 5.65, 0.55, 0.32);
    ridge += lineInfluence(x, y, 6.55, 7.45, 8.55, 7.65, 0.68, 0.28);
    ridge += lineInfluence(x, y, 8.55, 7.65, 10.75, 7.75, 0.68, 0.28);
    ridge += lineInfluence(x, y, 7.10, 9.70, 9.45, 9.95, 0.62, 0.24);
    ridge += lineInfluence(x, y, 8.70, 5.25, 8.55, 7.65, 0.58, 0.30);
    ridge += lineInfluence(x, y, 8.55, 7.65, 9.45, 9.95, 0.58, 0.27);
    ridge += lineInfluence(x, y, 10.75, 7.75, 10.25, 10.90, 0.52, 0.20);

    return clamp(ridge, 0, 1);
  }

  function basinPressure(x, y) {
    var central = gaussian(x, y, 8.85, 8.55, 1.18, 0.82, 0.58);
    var southern = gaussian(x, y, 9.35, 9.80, 1.28, 0.78, 0.48);
    var western = gaussian(x, y, 7.10, 8.30, 0.90, 0.80, 0.36);
    var eastern = gaussian(x, y, 10.35, 8.65, 0.92, 0.80, 0.34);

    return clamp(Math.max(central, southern, western, eastern), 0, 1);
  }

  function valleyPressure(x, y) {
    var valley = 0;

    valley += lineInfluence(x, y, 8.70, 5.25, 8.85, 8.55, 0.50, 0.42);
    valley += lineInfluence(x, y, 8.85, 8.55, 9.35, 10.45, 0.52, 0.48);
    valley += lineInfluence(x, y, 6.55, 7.45, 8.85, 8.55, 0.42, 0.42);
    valley += lineInfluence(x, y, 10.75, 7.75, 8.85, 8.55, 0.42, 0.42);
    valley += lineInfluence(x, y, 7.10, 9.70, 9.35, 10.45, 0.35, 0.40);
    valley += lineInfluence(x, y, 10.25, 10.90, 9.35, 10.45, 0.34, 0.35);

    return clamp(valley, 0, 1);
  }

  function coastPressure(x, y) {
    return edgePressure(x, y);
  }

  function classifyTerrain(elevation, summit, ridge, basin, valley, coast, hydrationDepth) {
    if (summit.max > 0.74 && elevation > 0.68) return "summit_highland";
    if (ridge > 0.50 && elevation > 0.57) return "ridge_highland";
    if (valley > 0.54 && hydrationDepth > 0.12) return "valley_corridor";
    if (basin > 0.50 && elevation < 0.54) return "basin_floor";
    if (coast > 0.62) return "coastal_edge";
    if (hydrationDepth > 0.22) return "lowland_wetland_candidate";
    if (elevation > 0.54) return "upland_slope";
    return "interior_plain";
  }

  function classifyHydration(elevation, basin, valley, coast, hydrationDepth) {
    if (coast > 0.68) return "coastal_edge_held";
    if (hydrationDepth >= 0.34) return "basin_lake_candidate";
    if (hydrationDepth >= 0.20) return "wetland_candidate";
    if (hydrationDepth > 0.04) return "seasonal_valley_fill";
    if (elevation > 0.62) return "dry_highland";
    return "dry_land";
  }

  function futureBiomeClassHeld(terrainClass, hydrationClass) {
    if (terrainClass === "summit_highland") return "alpine_or_highland_biome_held";
    if (terrainClass === "ridge_highland") return "rocky_ridge_biome_held";
    if (terrainClass === "coastal_edge") return "coastal_biome_held";
    if (hydrationClass === "wetland_candidate") return "wetland_biome_held";
    if (hydrationClass === "basin_lake_candidate") return "lake_basin_biome_held";
    if (terrainClass === "interior_plain") return "temperate_plain_biome_held";
    return "mixed_upland_biome_held";
  }

  function futureSettlementEligibilityHeld(terrainClass, elevation, hydrationDepth, ridge, coast) {
    if (terrainClass === "summit_highland") return "held_no_settlement_highland";
    if (ridge > 0.70) return "held_ridge_instability";
    if (coast > 0.72) return "held_coast_definition_required";
    if (hydrationDepth > 0.30) return "held_hydration_survey_required";
    if (terrainClass === "interior_plain" && elevation >= 0.40 && elevation <= 0.58) return "held_candidate_plain";
    if (terrainClass === "upland_slope" && elevation >= 0.46 && elevation <= 0.64) return "held_candidate_upland";
    return "held_future_survey";
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

  function makeSurfaceUnit(index, x, y) {
    var summit = summitInfluence(x, y);
    var ridge = ridgePressure(x, y);
    var basin = basinPressure(x, y);
    var valley = valleyPressure(x, y);
    var coast = coastPressure(x, y);

    var baseElevation = clamp(0.43 + (1 - macroMaskScore(x, y)) * 0.08, 0.32, 0.60);
    var elevation = clamp(
      baseElevation +
      summit.total * 0.30 +
      ridge * 0.18 -
      basin * 0.20 -
      valley * 0.12 -
      coast * 0.04,
      0.18,
      0.94
    );

    var runoffPressure = clamp(summit.total * 0.32 + ridge * 0.22 + valley * 0.32 + basin * 0.18, 0, 1);
    var basinCapture = clamp(basin * 0.82 + valley * 0.18, 0, 1);
    var valleyCapture = clamp(valley * 0.88 + basin * 0.12, 0, 1);
    var coastDrainagePressure = clamp(coast * 0.70 + valley * 0.20, 0, 1);

    var moisturePotential = clamp(
      basinCapture * 0.28 +
      valleyCapture * 0.30 +
      runoffPressure * 0.22 +
      coastDrainagePressure * 0.12 -
      elevation * 0.10,
      0,
      1
    );

    var waterFillEligible = Boolean((basin > 0.42 || valley > 0.46) && elevation < 0.58 && summit.max < 0.74);
    var hydrationDepth = waterFillEligible
      ? clamp((0.58 - elevation) * 1.25 + basin * 0.20 + valley * 0.18 + moisturePotential * 0.12, 0.03, 0.58)
      : 0;

    var terrainClass = classifyTerrain(elevation, summit, ridge, basin, valley, coast, hydrationDepth);
    var hydrationClass = classifyHydration(elevation, basin, valley, coast, hydrationDepth);

    var rx = 0.155;
    var ry = 0.125;

    return Object.freeze({
      tileId: makeTileId(index),
      terrainUnitId: makeTileId(index),
      parentSeatIndex: Math.floor(y) * RADIAL_NODES + Math.floor(x),
      parentSeatKey: makeSeatKey(Math.floor(x), Math.floor(y)),
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,

      x: round(x, 4),
      y: round(y, 4),
      rx: rx,
      ry: ry,
      shape: SURFACE_UNIT_SHAPE,
      imageReadyUnit: true,
      finalImageAsset: false,

      hexRectVertices: makeHexRectVertices(x, y, rx, ry),

      elevation: round(elevation, 4),
      baseElevation: round(baseElevation, 4),
      ridgePressure: round(ridge, 4),
      basinPressure: round(basin, 4),
      valleyPressure: round(valley, 4),
      summitInfluence: round(summit.total, 4),
      maxSummitInfluence: round(summit.max, 4),
      nearestSummitId: summit.nearest ? summit.nearest.id : null,
      nearestSummitName: summit.nearest ? summit.nearest.name : null,
      coastPressure: round(coast, 4),

      runoffPressure: round(runoffPressure, 4),
      basinCapture: round(basinCapture, 4),
      valleyCapture: round(valleyCapture, 4),
      coastDrainagePressure: round(coastDrainagePressure, 4),
      moisturePotential: round(moisturePotential, 4),
      waterFillEligible: waterFillEligible,
      hydrationDepth: round(hydrationDepth, 4),
      hydrationClass: hydrationClass,

      terrainClass: terrainClass,

      textureChannels: Object.freeze({
        rock: round(clamp(elevation * 0.42 + ridge * 0.36 + summit.max * 0.22, 0, 1), 4),
        soil: round(clamp(0.40 + (1 - ridge) * 0.22 + basin * 0.18 - summit.max * 0.12, 0, 1), 4),
        mineral: round(clamp(summit.total * 0.36 + ridge * 0.32 + elevation * 0.20, 0, 1), 4),
        wetland: round(clamp(hydrationDepth * 0.80 + moisturePotential * 0.20, 0, 1), 4),
        ridge: round(ridge, 4),
        basin: round(basin, 4),
        coast: round(coast, 4)
      }),

      futureBiomeClassHeld: futureBiomeClassHeld(terrainClass, hydrationClass),
      futureSettlementEligibilityHeld: futureSettlementEligibilityHeld(terrainClass, elevation, hydrationDepth, ridge, coast),
      futureEcologySocketHeld: true,
      futureBiomeSocketHeld: true,
      futureSettlementSocketHeld: true,
      futureUrbanLayerSocketHeld: true,

      renderEligible: true,
      landFirst: true,
      elevationComputedBeforeHydration: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false
    });
  }

  function buildSurfaceUnits() {
    var units = [];
    var index = 1;

    var xMin = MACRO_SHAPE.centerX - MACRO_SHAPE.radiusX - 0.55;
    var xMax = MACRO_SHAPE.centerX + MACRO_SHAPE.radiusX + 0.55;
    var yMin = MACRO_SHAPE.centerY - MACRO_SHAPE.radiusY - 0.55;
    var yMax = MACRO_SHAPE.centerY + MACRO_SHAPE.radiusY + 0.55;

    var xStep = 0.34;
    var yStep = 0.28;

    for (var y = yMin; y <= yMax; y += yStep) {
      var row = Math.round((y - yMin) / yStep);
      var xOffset = row % 2 === 0 ? 0 : xStep * 0.50;

      for (var x = xMin + xOffset; x <= xMax; x += xStep) {
        if (insideMacroShape(x, y)) {
          units.push(makeSurfaceUnit(index, x, y));
          index += 1;
        }
      }
    }

    return Object.freeze(units);
  }

  var SURFACE_UNITS = buildSurfaceUnits();

  function aggregateCoarseSeats() {
    var map = Object.create(null);

    for (var i = 0; i < SURFACE_UNITS.length; i += 1) {
      var unit = SURFACE_UNITS[i];
      var sx = clamp(Math.floor(unit.x), 0, RADIAL_NODES - 1);
      var sy = clamp(Math.floor(unit.y), 0, FIBONACCI_BANDS - 1);
      var k = sx + "," + sy;

      if (!map[k]) {
        map[k] = {
          seatIndex: sy * RADIAL_NODES + sx,
          seatKey: makeSeatKey(sx, sy),
          x: sx,
          y: sy,
          tileCount: 0,
          elevationTotal: 0,
          hydrationTotal: 0,
          ridgeTotal: 0,
          basinTotal: 0,
          valleyTotal: 0,
          coastTotal: 0,
          waterFillCount: 0
        };
      }

      map[k].tileCount += 1;
      map[k].elevationTotal += unit.elevation;
      map[k].hydrationTotal += unit.hydrationDepth;
      map[k].ridgeTotal += unit.ridgePressure;
      map[k].basinTotal += unit.basinPressure;
      map[k].valleyTotal += unit.valleyPressure;
      map[k].coastTotal += unit.coastPressure;
      if (unit.waterFillEligible) map[k].waterFillCount += 1;
    }

    var seats = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var k = x + "," + y;
        var source = map[k];

        if (!source) {
          seats.push(Object.freeze({
            seatIndex: y * RADIAL_NODES + x,
            seatKey: makeSeatKey(x, y),
            x: x,
            y: y,
            continentMembership: false,
            continentId: null,
            continentName: null,
            tileCount: 0,
            elevation: 0,
            hydrationDepth: 0,
            waterFillEligible: false,
            terrainClass: "outside_gratitude_asset",
            hydrationClass: "outside_gratitude_asset",
            newsComplete: true
          }));
          continue;
        }

        var count = source.tileCount;

        seats.push(Object.freeze({
          seatIndex: source.seatIndex,
          seatKey: source.seatKey,
          x: source.x,
          y: source.y,
          continentMembership: true,
          continentId: CONTINENT_ID,
          continentName: CONTINENT_NAME,
          tileCount: count,
          elevation: round(source.elevationTotal / count, 4),
          hydrationDepth: round(source.hydrationTotal / count, 4),
          ridgePressure: round(source.ridgeTotal / count, 4),
          basinPressure: round(source.basinTotal / count, 4),
          valleyPressure: round(source.valleyTotal / count, 4),
          coastPressure: round(source.coastTotal / count, 4),
          waterFillEligible: source.waterFillCount > 0,
          terrainClass: "coarse_parent_for_surface_units",
          hydrationClass: source.waterFillCount > 0 ? "coarse_hydration_candidate" : "coarse_dry_land",
          newsComplete: true
        }));
      }
    }

    return Object.freeze(seats);
  }

  var COARSE_SEATS = aggregateCoarseSeats();

  function countBy(list, predicate) {
    var count = 0;
    for (var i = 0; i < list.length; i += 1) {
      if (predicate(list[i])) count += 1;
    }
    return count;
  }

  var LAND_PARENT_SEAT_COUNT = countBy(COARSE_SEATS, function (seat) {
    return seat.continentMembership;
  });

  var HYDRATION_UNIT_COUNT = countBy(SURFACE_UNITS, function (unit) {
    return unit.waterFillEligible;
  });

  function terrainClassCounts() {
    var counts = Object.create(null);

    for (var i = 0; i < SURFACE_UNITS.length; i += 1) {
      var cls = SURFACE_UNITS[i].terrainClass;
      counts[cls] = (counts[cls] || 0) + 1;
    }

    return counts;
  }

  function hydrationClassCounts() {
    var counts = Object.create(null);

    for (var i = 0; i < SURFACE_UNITS.length; i += 1) {
      var cls = SURFACE_UNITS[i].hydrationClass;
      counts[cls] = (counts[cls] || 0) + 1;
    }

    return counts;
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,

      childType: "terrain_definition_child",
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      assetClass: ASSET_CLASS,

      terrainDefinitionAssetSystem: true,
      macroShapeDefined: true,
      macroShape: deepClone(MACRO_SHAPE),

      hexRectTerrainImageUnitsAvailable: true,
      surfaceImageUnitShape: SURFACE_UNIT_SHAPE,
      surfaceImageUnitCount: SURFACE_UNITS.length,
      coarseParentSeatCount: LAND_PARENT_SEAT_COUNT,

      doubledVisibleFootprintIntent: true,
      largerThanPreviousCompactFootprint: true,
      hemisphereSheetRemoved: true,

      landFirst: true,
      elevationComputedBeforeHydration: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,

      nineSummitsEmbedded: true,
      nineSummitsShapeTerrain: true,
      nineSummitsCompressedInsideOblongLandmass: true,
      summitCount: SUMMITS.length,

      terrainClassCounts: terrainClassCounts(),
      hydrationClassCounts: hydrationClassCounts(),
      hydrationUnitCount: HYDRATION_UNIT_COUNT,

      futureBiomeSocketHeld: true,
      futureEcologySocketHeld: true,
      futureSettlementSocketHeld: true,
      futureUrbanLayerSocketHeld: true,
      futureWeatherSocketHeld: true,

      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      deployMarker: "AUDRALIA_GRATITUDE_TERRAIN_DEFINITION_ASSET_SYSTEM_DEPLOY_MARKER_v1"
    };
  }

  function getContinentMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      assetClass: ASSET_CLASS,
      macroShape: deepClone(MACRO_SHAPE),
      coarseParentSeatCount: LAND_PARENT_SEAT_COUNT,
      surfaceImageUnitCount: SURFACE_UNITS.length,
      landFirst: true,
      hexRectTerrainImageUnitsAvailable: true,
      seats: compact
        ? COARSE_SEATS.filter(function (seat) { return seat.continentMembership; })
        : COARSE_SEATS.map(deepClone)
    };
  }

  function getElevationMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      elevationComputedBeforeHydration: true,
      source: "hex_rect_terrain_image_units",
      units: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            x: unit.x,
            y: unit.y,
            elevation: unit.elevation,
            terrainClass: unit.terrainClass
          };
        })
        : SURFACE_UNITS.map(deepClone)
    };
  }

  function getSummitMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      nineSummitsEmbedded: true,
      nineSummitsShapeTerrain: true,
      summits: compact
        ? SUMMITS.map(function (summit) {
          return {
            id: summit.id,
            name: summit.name,
            x: summit.x,
            y: summit.y,
            elevationPressure: summit.elevationPressure
          };
        })
        : SUMMITS.map(deepClone)
    };
  }

  function getHydrationMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,
      hydrationUnitCount: HYDRATION_UNIT_COUNT,
      hydrationSequence: [
        "land membership",
        "elevation",
        "ridge pressure",
        "basin pressure",
        "valley pressure",
        "runoff pressure",
        "hydration depth"
      ],
      seats: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            x: unit.x,
            y: unit.y,
            waterFillEligible: unit.waterFillEligible,
            hydrationDepth: unit.hydrationDepth,
            hydrationClass: unit.hydrationClass
          };
        })
        : SURFACE_UNITS.map(deepClone)
    };
  }

  function getSurfaceTileMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      continentId: CONTINENT_ID,
      tileSystem: "terrain_image_unit_field",
      surfaceUnitShape: SURFACE_UNIT_SHAPE,
      imageReadyUnit: true,
      finalImageAsset: false,
      surfaceImageUnitCount: SURFACE_UNITS.length,
      readyForMoreDefinition: true,
      tiles: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            x: unit.x,
            y: unit.y,
            rx: unit.rx,
            ry: unit.ry,
            shape: unit.shape,
            elevation: unit.elevation,
            terrainClass: unit.terrainClass,
            hydrationDepth: unit.hydrationDepth,
            waterFillEligible: unit.waterFillEligible
          };
        })
        : SURFACE_UNITS.map(deepClone)
    };
  }

  function getTerrainAssetMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      assetClass: ASSET_CLASS,
      macroShape: deepClone(MACRO_SHAPE),
      terrainRegions: TERRAIN_REGIONS.map(deepClone),
      summits: compact ? SUMMITS.map(function (summit) {
        return { id: summit.id, x: summit.x, y: summit.y };
      }) : SUMMITS.map(deepClone),
      surfaceImageUnits: compact ? SURFACE_UNITS.length : SURFACE_UNITS.map(deepClone),
      terrainClassCounts: terrainClassCounts(),
      hydrationClassCounts: hydrationClassCounts()
    };
  }

  function getTextureChannelMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      textureChannelsDefined: true,
      channels: [
        "rock",
        "soil",
        "mineral",
        "wetland",
        "ridge",
        "basin",
        "coast"
      ],
      units: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            x: unit.x,
            y: unit.y,
            textureChannels: unit.textureChannels
          };
        })
        : SURFACE_UNITS.map(deepClone)
    };
  }

  function getHydrationChannelMap(options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      hydrationChannelsDefined: true,
      hydrationIsConsequence: true,
      channels: [
        "runoffPressure",
        "basinCapture",
        "valleyCapture",
        "coastDrainagePressure",
        "moisturePotential",
        "hydrationDepth"
      ],
      units: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            x: unit.x,
            y: unit.y,
            runoffPressure: unit.runoffPressure,
            basinCapture: unit.basinCapture,
            valleyCapture: unit.valleyCapture,
            coastDrainagePressure: unit.coastDrainagePressure,
            moisturePotential: unit.moisturePotential,
            hydrationDepth: unit.hydrationDepth,
            hydrationClass: unit.hydrationClass
          };
        })
        : SURFACE_UNITS.map(deepClone)
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
      activationAuthorized: false,
      rules: {
        ecologyRequiresHydrationChild: true,
        settlementRequiresCoreAndHydration: true,
        urbanRequiresCoreTectonicStability: true,
        biomeRequiresTerrainAndHydrationDefinition: true
      },
      units: compact
        ? SURFACE_UNITS.map(function (unit) {
          return {
            tileId: unit.tileId,
            terrainClass: unit.terrainClass,
            hydrationClass: unit.hydrationClass,
            futureBiomeClassHeld: unit.futureBiomeClassHeld,
            futureSettlementEligibilityHeld: unit.futureSettlementEligibilityHeld
          };
        })
        : SURFACE_UNITS.map(deepClone)
    };
  }

  function getChildReceivePacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-downstream-consumer",
      childReceivePacketReady: true,
      childType: "terrain_definition_child",

      continentId: CONTINENT_ID,
      continentName: CONTINENT_NAME,
      assetClass: ASSET_CLASS,

      terrainDefinitionAssetSystem: true,
      macroShapeDefined: true,
      hexRectTerrainImageUnitsAvailable: true,
      surfaceImageUnitShape: SURFACE_UNIT_SHAPE,
      surfaceImageUnitCount: SURFACE_UNITS.length,
      coarseParentSeatCount: LAND_PARENT_SEAT_COUNT,

      doubledVisibleFootprintIntent: true,
      largerThanPreviousCompactFootprint: true,
      hemisphereSheetRemoved: true,

      landFirst: true,
      elevationComputedBeforeHydration: true,
      hydrationIsConsequence: true,
      waterFillDerivedFromValleys: true,

      nineSummitsEmbedded: true,
      nineSummitsShapeTerrain: true,
      nineSummitsCompressedInsideOblongLandmass: true,

      futureBiomeSocketHeld: true,
      futureEcologySocketHeld: true,
      futureSettlementSocketHeld: true,
      futureUrbanLayerSocketHeld: true,
      futureWeatherSocketHeld: true,

      relationshipMapReady: true,
      carrierConsumptionAllowedAfterValidation: true,
      carrierRenderAuthorized: false,
      htmlUntouched: true,
      carrierUntouched: true,
      coreChildUntouched: true,
      runtimeStrengthHeld: true,
      finalTerrainPassClaim: false,
      finalVisualPassClaim: false,
      scriptTagsIncluded: false,
      cacheKeyScope: false,

      status: status(),
      continentMap: getContinentMap({ compact: compact }),
      elevationMap: getElevationMap({ compact: compact }),
      summitMap: getSummitMap({ compact: compact }),
      hydrationMap: getHydrationMap({ compact: compact }),
      surfaceTileMap: getSurfaceTileMap({ compact: compact }),
      terrainAssetMap: getTerrainAssetMap({ compact: compact }),
      textureChannelMap: getTextureChannelMap({ compact: compact }),
      hydrationChannelMap: getHydrationChannelMap({ compact: compact }),
      futureSocketMap: getFutureSocketMap({ compact: compact })
    };
  }

  var API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    continentId: CONTINENT_ID,
    continentName: CONTINENT_NAME,
    assetClass: ASSET_CLASS,

    status: status,
    getContinentMap: getContinentMap,
    getElevationMap: getElevationMap,
    getSummitMap: getSummitMap,
    getHydrationMap: getHydrationMap,
    getSurfaceTileMap: getSurfaceTileMap,
    getTerrainAssetMap: getTerrainAssetMap,
    getTextureChannelMap: getTextureChannelMap,
    getHydrationChannelMap: getHydrationChannelMap,
    getFutureSocketMap: getFutureSocketMap,
    getChildReceivePacket: getChildReceivePacket
  });

  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD = API;
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_STATUS = status();
  window.AUDRALIA_G2_GRATITUDE_CONTINENT_CHILD_RECEIVE_PACKET = getChildReceivePacket("published-static-terrain-definition-asset", { compact: true });
})();
