// /assets/audralia/clean/terrain/audralia.dry-revealed-physical-terrain.child.js
// AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_SEAM_SAFE_PARENT_RENEWAL_TNT_v2
// Full-file replacement.
// Previous: AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_CHILD_TNT_v1
// Scope: Audralia-level dry revealed physical terrain atlas.
// Purpose: preserve the upstream dry revealed physical terrain parent while renewing seam-safe radial geometry and carrier-safe packet posture.
// Owns: dry physical terrain atlas, dry elevation, former hydrosphere carving memory, future-fill gaps, terrain classes, carrier terrain packet.
// Does not own: active hydration, active water, rivers, lakes, oceans, marshes, wetlands, waterfalls, wet beaches, runtime drawing, HTML, Gratitude trunk, climate, ecology, settlement, relief expression, landform systems, triangular mesh, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_SEAM_SAFE_PARENT_RENEWAL_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_CHILD_TNT_v1";
  var SPEC_OPS = "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_NEWS_v1";
  var CCR = "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_CCR_v1";

  var FILE = "/assets/audralia/clean/terrain/audralia.dry-revealed-physical-terrain.child.js";
  var CHILD_TYPE = "audralia_dry_revealed_physical_terrain_atlas_child";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var NODE_COUNT = 256;
  var FORMER_SEA_LEVEL_DATUM = 0.48;
  var TAU = Math.PI * 2;

  var TERRAIN_CLASSES = Object.freeze([
    "summit_pressure_zone",
    "mountain_belt",
    "ridge_chain",
    "trench_corridor",
    "dry_basin_floor",
    "valley_corridor",
    "shelf_terrace",
    "escarpment_rim",
    "planetary_highland",
    "upland_plateau",
    "former_seabed",
    "lowland_gap",
    "stable_craton"
  ]);

  var REGION_SEEDS = Object.freeze([
    Object.freeze({ id: "gratitude", name: "Gratitude Region Candidate", x: 5.0, y: 4.6, summit: "Gratitude", pressure: 1.00 }),
    Object.freeze({ id: "generosity", name: "Generosity Region Candidate", x: 10.8, y: 3.9, summit: "Generosity", pressure: 0.94 }),
    Object.freeze({ id: "dependability", name: "Dependability Region Candidate", x: 3.1, y: 8.1, summit: "Dependability", pressure: 0.90 }),
    Object.freeze({ id: "accountability", name: "Accountability Region Candidate", x: 8.2, y: 7.4, summit: "Accountability", pressure: 0.98 }),
    Object.freeze({ id: "forgiveness", name: "Forgiveness Region Candidate", x: 12.4, y: 8.8, summit: "Forgiveness", pressure: 0.88 }),
    Object.freeze({ id: "humility", name: "Humility Region Candidate", x: 5.7, y: 11.9, summit: "Humility", pressure: 0.86 }),
    Object.freeze({ id: "self-control", name: "Self-Control Region Candidate", x: 10.2, y: 12.6, summit: "Self-Control", pressure: 0.92 }),
    Object.freeze({ id: "patience", name: "Patience Region Candidate", x: 13.8, y: 5.6, summit: "Patience", pressure: 0.84 }),
    Object.freeze({ id: "purity", name: "Purity Region Candidate", x: 7.9, y: 2.1, summit: "Purity", pressure: 1.08 })
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

  function normalizeRadialX(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = 0;
    return ((number % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
  }

  function normalizeBandY(value) {
    return clamp(Number(value), 0, FIBONACCI_BANDS - 1);
  }

  function radialDelta(ax, bx) {
    var dx = Math.abs(normalizeRadialX(ax) - normalizeRadialX(bx));
    return Math.min(dx, RADIAL_NODES - dx);
  }

  function wrappedDistance(ax, ay, bx, by) {
    var dx = radialDelta(ax, bx);
    var dy = Number(ay) - Number(by);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nodeId(x, y) {
    return "AUDRALIA-DRY-TERRAIN-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function seatKey(x, y) {
    return "A-DT-" + String(y).padStart(2, "0") + "-" + String(x).padStart(2, "0");
  }

  function lonLat(x, y) {
    return {
      lon: round(-180 + (normalizeRadialX(x) / RADIAL_NODES) * 360, 4),
      lat: round(80 - (normalizeBandY(y) / (FIBONACCI_BANDS - 1)) * 160, 4)
    };
  }

  function linePressure(px, py, ax, ay, bx, by, width, strength) {
    var candidates = [
      { ax: ax, bx: bx },
      { ax: ax - RADIAL_NODES, bx: bx - RADIAL_NODES },
      { ax: ax + RADIAL_NODES, bx: bx + RADIAL_NODES }
    ];

    var bestDistance = Infinity;

    candidates.forEach(function (candidate) {
      var vx = candidate.bx - candidate.ax;
      var vy = by - ay;
      var wx = px - candidate.ax;
      var wy = py - ay;
      var len2 = vx * vx + vy * vy;

      if (!len2) return;

      var t = clamp((wx * vx + wy * vy) / len2, 0, 1);
      var cx = candidate.ax + t * vx;
      var cy = ay + t * vy;
      var dx = Math.abs(px - cx);
      dx = Math.min(dx, RADIAL_NODES - dx);
      var dy = py - cy;
      var d = Math.sqrt(dx * dx + dy * dy);

      bestDistance = Math.min(bestDistance, d);
    });

    return strength * clamp(1 - bestDistance / width, 0, 1);
  }

  function gaussian(px, py, cx, cy, rx, ry, strength) {
    var dx = radialDelta(px, cx) / rx;
    var dy = (py - cy) / ry;
    return strength * Math.exp(-(dx * dx + dy * dy));
  }

  function nearestRegion(x, y) {
    var best = REGION_SEEDS[0];
    var bestDistance = Infinity;

    for (var i = 0; i < REGION_SEEDS.length; i += 1) {
      var seed = REGION_SEEDS[i];
      var d = wrappedDistance(x, y, seed.x, seed.y);

      if (d < bestDistance) {
        best = seed;
        bestDistance = d;
      }
    }

    return {
      id: best.id,
      name: best.name,
      summit: best.summit,
      distance: round(bestDistance, 4),
      pressure: round(clamp(1 - bestDistance / 5.2, 0, 1) * best.pressure, 4)
    };
  }

  function summitPressure(x, y) {
    var total = 0;
    var max = 0;

    for (var i = 0; i < REGION_SEEDS.length; i += 1) {
      var seed = REGION_SEEDS[i];
      var d = wrappedDistance(x, y, seed.x, seed.y);
      var pressure = clamp(1 - d / 2.35, 0, 1) * seed.pressure;
      total += pressure;
      max = Math.max(max, pressure);
    }

    return {
      total: round(clamp(total / 2.35, 0, 1), 4),
      max: round(clamp(max, 0, 1), 4)
    };
  }

  function mountainPressure(x, y) {
    var value = 0;

    value += linePressure(x, y, 1.0, 3.2, 6.4, 4.5, 0.84, 0.52);
    value += linePressure(x, y, 6.4, 4.5, 11.8, 3.6, 0.76, 0.54);
    value += linePressure(x, y, 2.0, 10.8, 7.5, 7.4, 0.88, 0.48);
    value += linePressure(x, y, 7.5, 7.4, 14.0, 9.0, 0.86, 0.46);
    value += linePressure(x, y, 5.2, 13.8, 11.8, 12.0, 0.74, 0.42);
    value += linePressure(x, y, 13.5, 2.3, 14.5, 13.0, 0.58, 0.34);

    return round(clamp(value, 0, 1), 4);
  }

  function ridgePressure(x, y) {
    var value = 0;

    value += linePressure(x, y, 0.4, 6.0, 15.0, 6.4, 0.46, 0.34);
    value += linePressure(x, y, 3.0, 1.6, 12.4, 14.2, 0.52, 0.32);
    value += linePressure(x, y, 1.0, 13.0, 14.0, 4.0, 0.50, 0.30);
    value += linePressure(x, y, 7.8, 0.4, 7.2, 15.0, 0.42, 0.28);

    return round(clamp(value, 0, 1), 4);
  }

  function basinPressure(x, y) {
    var value = 0;

    value += gaussian(x, y, 3.8, 5.8, 1.8, 1.2, 0.62);
    value += gaussian(x, y, 9.6, 6.4, 2.1, 1.6, 0.74);
    value += gaussian(x, y, 12.5, 11.6, 1.8, 1.7, 0.64);
    value += gaussian(x, y, 5.7, 12.5, 1.6, 1.4, 0.58);
    value += gaussian(x, y, 1.8, 11.8, 1.2, 1.7, 0.42);

    return round(clamp(value, 0, 1), 4);
  }

  function trenchPressure(x, y) {
    var value = 0;

    value += linePressure(x, y, 0.2, 8.8, 6.0, 9.8, 0.34, 0.62);
    value += linePressure(x, y, 6.0, 9.8, 12.8, 7.0, 0.36, 0.56);
    value += linePressure(x, y, 13.6, 1.0, 10.7, 6.8, 0.32, 0.48);
    value += linePressure(x, y, 9.8, 10.8, 15.0, 14.2, 0.30, 0.46);

    return round(clamp(value, 0, 1), 4);
  }

  function valleyPressure(x, y) {
    var value = 0;

    value += linePressure(x, y, 5.0, 4.6, 3.8, 5.8, 0.56, 0.44);
    value += linePressure(x, y, 10.8, 3.9, 9.6, 6.4, 0.56, 0.42);
    value += linePressure(x, y, 8.2, 7.4, 5.7, 12.5, 0.58, 0.44);
    value += linePressure(x, y, 12.4, 8.8, 12.5, 11.6, 0.54, 0.40);
    value += linePressure(x, y, 7.9, 2.1, 7.8, 6.7, 0.48, 0.36);

    return round(clamp(value, 0, 1), 4);
  }

  function shelfPressure(x, y) {
    var edgeX = Math.min(normalizeRadialX(x), RADIAL_NODES - normalizeRadialX(x)) / (RADIAL_NODES / 2);
    var edgeY = Math.min(normalizeBandY(y), FIBONACCI_BANDS - 1 - normalizeBandY(y)) / ((FIBONACCI_BANDS - 1) / 2);
    var edge = clamp(1 - Math.min(edgeX, edgeY), 0, 1);

    var terraces =
      Math.abs(Math.sin((x + 1.2) * 0.95)) * 0.10 +
      Math.abs(Math.cos((y + 0.4) * 0.83)) * 0.08;

    return round(clamp(edge * 0.72 + terraces, 0, 1), 4);
  }

  function escarpmentPressure(x, y, elevation, basin, shelf) {
    var structuralBreak =
      Math.abs(Math.sin((x * 0.76) + (y * 0.41))) * 0.22 +
      Math.abs(Math.cos((x * 0.34) - (y * 0.82))) * 0.20;

    return round(clamp(structuralBreak + shelf * 0.28 + basin * 0.12 + Math.max(0, elevation - 0.62) * 0.18, 0, 1), 4);
  }

  function carvingPressure(basin, trench, valley, shelf, elevation) {
    return round(clamp(
      basin * 0.36 +
      trench * 0.40 +
      valley * 0.28 +
      shelf * 0.24 +
      Math.max(0, FORMER_SEA_LEVEL_DATUM - elevation) * 0.42,
      0,
      1
    ), 4);
  }

  function terrainClass(elevation, mountain, ridge, basin, trench, valley, shelf, escarpment, summit) {
    if (summit.max > 0.72 && elevation > 0.62) return "summit_pressure_zone";
    if (mountain > 0.58) return "mountain_belt";
    if (ridge > 0.54) return "ridge_chain";
    if (trench > 0.58) return "trench_corridor";
    if (basin > 0.58 && elevation < FORMER_SEA_LEVEL_DATUM) return "dry_basin_floor";
    if (valley > 0.54) return "valley_corridor";
    if (shelf > 0.68 && elevation < 0.55) return "shelf_terrace";
    if (escarpment > 0.62) return "escarpment_rim";
    if (elevation > 0.68) return "planetary_highland";
    if (elevation > 0.56) return "upland_plateau";
    if (elevation < 0.36) return "former_seabed";
    if (elevation < FORMER_SEA_LEVEL_DATUM) return "lowland_gap";
    return "stable_craton";
  }

  function primaryRole(tClass) {
    if (tClass === "summit_pressure_zone") return "summit_anchor";
    if (tClass === "mountain_belt") return "mountain";
    if (tClass === "ridge_chain") return "ridge";
    if (tClass === "trench_corridor") return "trench";
    if (tClass === "dry_basin_floor") return "basin";
    if (tClass === "valley_corridor") return "valley";
    if (tClass === "shelf_terrace") return "shelf";
    if (tClass === "escarpment_rim") return "escarpment";
    if (tClass === "former_seabed") return "former_seabed";
    if (tClass === "lowland_gap") return "future_fill_gap";
    if (tClass === "upland_plateau") return "plateau";
    if (tClass === "planetary_highland") return "highland";
    return "stable_core";
  }

  function secondaryRoles(mountain, ridge, basin, trench, valley, shelf, escarpment, summit, futureFill) {
    var roles = [];

    if (mountain > 0.42) roles.push("mountain_pressure");
    if (ridge > 0.40) roles.push("ridge_pressure");
    if (basin > 0.40) roles.push("basin_pressure");
    if (trench > 0.40) roles.push("trench_pressure");
    if (valley > 0.40) roles.push("valley_pressure");
    if (shelf > 0.48) roles.push("shelf_pressure");
    if (escarpment > 0.48) roles.push("escarpment_pressure");
    if (summit.total > 0.30) roles.push("summit_pressure");
    if (futureFill) roles.push("future_fill_candidate");

    return Object.freeze(roles);
  }

  function makeNode(x, y) {
    var index = y * RADIAL_NODES + x;
    var cx = x + 0.5;
    var cy = y + 0.5;
    var ll = lonLat(cx, cy);

    var summit = summitPressure(cx, cy);
    var mountain = mountainPressure(cx, cy);
    var ridge = ridgePressure(cx, cy);
    var basin = basinPressure(cx, cy);
    var trench = trenchPressure(cx, cy);
    var valley = valleyPressure(cx, cy);
    var shelf = shelfPressure(cx, cy);

    var baseWave =
      0.50 +
      Math.sin((cx + 0.8) * 0.72) * 0.08 +
      Math.cos((cy + 1.6) * 0.66) * 0.07 +
      Math.sin((cx * 0.46) + (cy * 0.58)) * 0.055;

    var dryElevation = clamp(
      baseWave +
      mountain * 0.24 +
      ridge * 0.14 +
      summit.total * 0.18 -
      basin * 0.24 -
      trench * 0.28 -
      valley * 0.11 -
      shelf * 0.08,
      0.12,
      0.94
    );

    var escarpment = escarpmentPressure(cx, cy, dryElevation, basin, shelf);
    var carving = carvingPressure(basin, trench, valley, shelf, dryElevation);
    var aboveFormerSeaLevel = dryElevation >= FORMER_SEA_LEVEL_DATUM;
    var belowFormerSeaLevel = !aboveFormerSeaLevel;
    var futureFillEligible = Boolean(belowFormerSeaLevel && (basin > 0.30 || trench > 0.24 || valley > 0.34 || shelf > 0.58));
    var region = nearestRegion(cx, cy);
    var tClass = terrainClass(dryElevation, mountain, ridge, basin, trench, valley, shelf, escarpment, summit);

    return Object.freeze({
      nodeId: nodeId(x, y),
      seatIndex: index,
      nodeIndex: index,
      seatKey: seatKey(x, y),
      x: x,
      y: y,
      band: y,
      radial: x,
      lon: ll.lon,
      lat: ll.lat,

      planetMassMembership: true,
      dryExposedTerrain: true,
      formerHydrosphereCarved: carving > 0.16,
      hydrosphereOrigin: true,
      recededHydrosphereReveal: true,
      formerWaterCarvingActive: true,
      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,

      aboveFormerSeaLevel: aboveFormerSeaLevel,
      belowFormerSeaLevel: belowFormerSeaLevel,
      futureFillEligible: futureFillEligible,

      terrainClass: tClass,
      primaryTerrainRole: primaryRole(tClass),
      secondaryTerrainRoles: secondaryRoles(mountain, ridge, basin, trench, valley, shelf, escarpment, summit, futureFillEligible),

      elevation: round(dryElevation, 4),
      dryElevation: round(dryElevation, 4),
      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM,
      relativeRelief: round(dryElevation - FORMER_SEA_LEVEL_DATUM, 4),
      massContinuityWeight: 1,

      ridgePressure: ridge,
      mountainPressure: mountain,
      basinPressure: basin,
      valleyPressure: valley,
      trenchPressure: trench,
      shelfPressure: shelf,
      escarpmentPressure: escarpment,
      summitPressure: summit.total,
      summitMaxPressure: summit.max,
      gapPressure: round(clamp((futureFillEligible ? 0.45 : 0) + basin * 0.28 + trench * 0.28 + valley * 0.18, 0, 1), 4),
      formerHydrosphereCarvingValue: carving,

      regionSeed: region.id,
      regionSeedName: region.name,
      nearestSummitName: region.summit,
      regionSeedPressure: region.pressure,
      summitRegionCandidate: region.pressure > 0.12,
      gratitudeRegionCandidate: region.id === "gratitude",

      seamSafeRadialGeometry: true,
      falsePrimeMeridianAvoided: true,
      radialWrapActive: true,

      renderAsRawParcel: false,
      renderAsDryPhysicalMass: true,
      carrierMayConsume: true,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
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

  var MASS_NODES = Object.freeze(NODES.filter(function (node) { return node.planetMassMembership; }));
  var HIGHLAND_NODES = Object.freeze(NODES.filter(function (node) {
    return node.primaryTerrainRole === "highland" ||
      node.primaryTerrainRole === "plateau" ||
      node.primaryTerrainRole === "summit_anchor";
  }));
  var BASIN_NODES = Object.freeze(NODES.filter(function (node) {
    return node.primaryTerrainRole === "basin" ||
      node.primaryTerrainRole === "former_seabed";
  }));
  var TRENCH_NODES = Object.freeze(NODES.filter(function (node) {
    return node.primaryTerrainRole === "trench";
  }));
  var RIDGE_NODES = Object.freeze(NODES.filter(function (node) {
    return node.primaryTerrainRole === "ridge" ||
      node.primaryTerrainRole === "mountain";
  }));
  var SHELF_NODES = Object.freeze(NODES.filter(function (node) {
    return node.primaryTerrainRole === "shelf" ||
      node.primaryTerrainRole === "escarpment";
  }));
  var GAP_NODES = Object.freeze(NODES.filter(function (node) { return node.futureFillEligible; }));
  var GRATITUDE_NODES = Object.freeze(NODES.filter(function (node) { return node.gratitudeRegionCandidate; }));

  function compactNode(node) {
    return {
      nodeId: node.nodeId,
      seatIndex: node.seatIndex,
      seatKey: node.seatKey,
      x: node.x,
      y: node.y,
      lon: node.lon,
      lat: node.lat,

      planetMassMembership: node.planetMassMembership,
      dryExposedTerrain: node.dryExposedTerrain,
      formerHydrosphereCarved: node.formerHydrosphereCarved,
      aboveFormerSeaLevel: node.aboveFormerSeaLevel,
      belowFormerSeaLevel: node.belowFormerSeaLevel,
      futureFillEligible: node.futureFillEligible,

      terrainClass: node.terrainClass,
      primaryTerrainRole: node.primaryTerrainRole,
      elevation: node.elevation,
      dryElevation: node.dryElevation,
      relativeRelief: node.relativeRelief,

      ridgePressure: node.ridgePressure,
      mountainPressure: node.mountainPressure,
      basinPressure: node.basinPressure,
      valleyPressure: node.valleyPressure,
      trenchPressure: node.trenchPressure,
      shelfPressure: node.shelfPressure,
      escarpmentPressure: node.escarpmentPressure,
      summitPressure: node.summitPressure,
      gapPressure: node.gapPressure,
      formerHydrosphereCarvingValue: node.formerHydrosphereCarvingValue,

      regionSeed: node.regionSeed,
      gratitudeRegionCandidate: node.gratitudeRegionCandidate,

      seamSafeRadialGeometry: true,
      falsePrimeMeridianAvoided: true,
      radialWrapActive: true,

      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,
      carrierMayConsume: true,
      finalVisualPassClaim: false
    };
  }

  function maybeCompact(nodes, options) {
    return Boolean(options && options.compact) ? nodes.map(compactNode) : nodes.map(clone);
  }

  function field(name, nodes, options, extra) {
    return Object.assign({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      fieldType: name,
      nodeCount: nodes.length,
      nodes: maybeCompact(nodes, options),
      hydrosphereOrigin: true,
      recededHydrosphereReveal: true,
      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,
      carrierMayConsume: true,
      childDrawsVisuals: false,
      carrierDisplaysOnly: true,
      finalVisualPassClaim: false
    }, extra || {});
  }

  function status() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: FILE,
      childType: CHILD_TYPE,

      audraliaLevelTerrainAuthority: true,
      gratitudeOnlyAuthority: false,
      gratitudeIsIsland: false,
      gratitudeRegionCandidateOnly: true,

      seamSafeRadialGeometry: true,
      falsePrimeMeridianAvoided: true,
      radialWrapActive: true,
      longitudeUsesRadialNodeCount: true,
      longitudeUsesTerminalDivisor15: false,

      hydrosphereOrigin: true,
      recededHydrosphereReveal: true,
      formerWaterCarvingActive: true,
      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,

      planetMassFieldReady: true,
      dryElevationFieldReady: true,
      formerHydrosphereCarvingFieldReady: true,
      terrainClassFieldReady: true,
      ridgeMountainFieldReady: true,
      basinTrenchValleyFieldReady: true,
      shelfEscarpmentFieldReady: true,
      futureFillGapFieldReady: true,
      carrierTerrainPacketReady: true,

      terrainClasses: TERRAIN_CLASSES.slice(),

      nodeCount: NODE_COUNT,
      planetMassNodeCount: MASS_NODES.length,
      highlandNodeCount: HIGHLAND_NODES.length,
      basinNodeCount: BASIN_NODES.length,
      trenchNodeCount: TRENCH_NODES.length,
      ridgeNodeCount: RIDGE_NODES.length,
      shelfNodeCount: SHELF_NODES.length,
      futureFillGapCount: GAP_NODES.length,
      gratitudeCandidateNodeCount: GRATITUDE_NODES.length,

      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM,

      carrierMayConsume: true,
      carrierInventsTerrain: false,
      carrierMayDisplayPacket: true,
      carrierDisplaysOnly: true,
      childDrawsVisuals: false,

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      triangulationTruthMutated: false,
      hydrationTruthMutated: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      deployMarker: "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_ATLAS_SEAM_SAFE_PARENT_RENEWAL_DEPLOY_MARKER_v2"
    };
  }

  function getPlanetMassField(options) {
    return field("planet_mass_field", MASS_NODES, options, {
      planetMassFieldReady: true,
      allTerrainDryRevealed: true
    });
  }

  function getDryElevationField(options) {
    return field("dry_elevation_field", NODES, options, {
      dryElevationFieldReady: true,
      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM
    });
  }

  function getFormerHydrosphereCarvingField(options) {
    return field("former_hydrosphere_carving_field", NODES.filter(function (node) {
      return node.formerHydrosphereCarved;
    }), options, {
      formerHydrosphereCarvingFieldReady: true,
      waterHistoryAllowed: true,
      activeWaterForbidden: true
    });
  }

  function getTerrainClassField(options) {
    return field("terrain_class_field", NODES, options, {
      terrainClassFieldReady: true,
      classes: TERRAIN_CLASSES.slice()
    });
  }

  function getRidgeMountainField(options) {
    return field("ridge_mountain_field", RIDGE_NODES, options, {
      ridgeMountainFieldReady: true
    });
  }

  function getBasinTrenchValleyField(options) {
    return field("basin_trench_valley_field", NODES.filter(function (node) {
      return node.primaryTerrainRole === "basin" ||
        node.primaryTerrainRole === "trench" ||
        node.primaryTerrainRole === "valley" ||
        node.primaryTerrainRole === "former_seabed" ||
        node.primaryTerrainRole === "future_fill_gap";
    }), options, {
      basinTrenchValleyFieldReady: true,
      futureFillLogicPresent: true
    });
  }

  function getShelfEscarpmentField(options) {
    return field("shelf_escarpment_field", SHELF_NODES, options, {
      shelfEscarpmentFieldReady: true,
      wetEdgeBehaviorActive: false
    });
  }

  function getFutureFillGapField(options) {
    return field("future_fill_gap_field", GAP_NODES, options, {
      futureFillGapFieldReady: true,
      mapTheGapsFirst: true,
      fillTheGapsLater: true,
      activeHydration: false,
      activeWater: false
    });
  }

  function getRegionSeedField(options) {
    return field("region_seed_field", NODES.filter(function (node) {
      return node.summitRegionCandidate;
    }), options, {
      regionSeedFieldReady: true,
      gratitudeIsIsland: false,
      gratitudeRegionCandidateOnly: true,
      regionSeeds: REGION_SEEDS.map(clone)
    });
  }

  function getDryRevealedTerrainPacket(target, options) {
    var compact = Boolean(options && options.compact);

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "unassigned-dry-revealed-terrain-consumer",
      packetType: "audralia_dry_revealed_physical_terrain_packet",
      dryRevealedTerrainPacketReady: true,

      audraliaLevelTerrainAuthority: true,
      gratitudeOnlyAuthority: false,
      gratitudeIsIsland: false,
      gratitudeRegionCandidateOnly: true,

      seamSafeRadialGeometry: true,
      falsePrimeMeridianAvoided: true,
      radialWrapActive: true,
      longitudeUsesRadialNodeCount: true,
      longitudeUsesTerminalDivisor15: false,

      hydrosphereOrigin: true,
      recededHydrosphereReveal: true,
      formerWaterCarvingActive: true,
      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,

      governingPhrase: "Map the gaps first. Fill the gaps later.",

      formerSeaLevelDatum: FORMER_SEA_LEVEL_DATUM,
      nodeCount: NODE_COUNT,
      planetMassNodeCount: MASS_NODES.length,
      futureFillGapCount: GAP_NODES.length,
      gratitudeCandidateNodeCount: GRATITUDE_NODES.length,

      terrainClasses: TERRAIN_CLASSES.slice(),

      planetMassField: getPlanetMassField({ compact: true }),
      dryElevationField: getDryElevationField({ compact: true }),
      formerHydrosphereCarvingField: getFormerHydrosphereCarvingField({ compact: true }),
      terrainClassField: getTerrainClassField({ compact: true }),
      ridgeMountainField: getRidgeMountainField({ compact: true }),
      basinTrenchValleyField: getBasinTrenchValleyField({ compact: true }),
      shelfEscarpmentField: getShelfEscarpmentField({ compact: true }),
      futureFillGapField: getFutureFillGapField({ compact: true }),
      regionSeedField: getRegionSeedField({ compact: true }),

      nodes: compact ? NODES.map(compactNode) : NODES.map(clone),

      carrierMayConsume: true,
      carrierInventsTerrain: false,
      carrierMayDisplayPacket: true,
      carrierDisplaysOnly: true,
      childDrawsVisuals: false,

      sourceTerrainMutated: false,
      elevationTruthMutated: false,
      reliefTruthMutated: false,
      landformTruthMutated: false,
      beachTruthMutated: false,
      triangulationTruthMutated: false,
      hydrationTruthMutated: false,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getPlanetPhysicalTerrainPacket(target, options) {
    return getDryRevealedTerrainPacket(target || "planet-physical-terrain-consumer", options || {});
  }

  function getCarrierTerrainPacket(target, options) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: target || "audralia-runtime-carrier",
      packetType: "audralia_dry_revealed_terrain_carrier_packet",
      carrierTerrainPacketReady: true,

      drawPosture: "dry_revealed_physical_mass_first",
      displayPosture: "carrier_may_display_packet_without_owning_or_inventing_terrain",

      seamSafeRadialGeometry: true,
      falsePrimeMeridianAvoided: true,
      radialWrapActive: true,

      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,

      carrierMayConsume: true,
      carrierMayDisplayPacket: true,
      carrierDisplaysOnly: true,
      childDrawsVisuals: false,
      carrierInventsTerrain: false,

      planetPhysicalTerrainPacket: getPlanetPhysicalTerrainPacket(target || "carrier-physical-terrain", options || { compact: true }),

      preferredLensUse: {
        body: "may show faint dry mass beneath shell without inventing terrain",
        surface: "may display dry exposed physical terrain packet",
        hydration: "held until future fill",
        lattice: "raw 256 inspection only",
        receipt: "report dry revealed atlas status"
      },

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false
    };
  }

  function getChildReceivePacket(target, options) {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      target: target || "unassigned-child-consumer",
      childReceivePacketReady: true,
      childType: CHILD_TYPE,
      status: status(),
      dryRevealedTerrainPacket: getDryRevealedTerrainPacket(target || "child-receive-dry-terrain", options || { compact: true }),
      carrierTerrainPacket: getCarrierTerrainPacket(target || "child-receive-carrier", options || { compact: true }),
      activeHydration: false,
      activeWater: false,
      hydrationHeld: true,
      childDrawsVisuals: false,
      carrierDisplaysOnly: true,
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

    status: status,
    getDryRevealedTerrainPacket: getDryRevealedTerrainPacket,
    getPlanetPhysicalTerrainPacket: getPlanetPhysicalTerrainPacket,
    getPlanetMassField: getPlanetMassField,
    getDryElevationField: getDryElevationField,
    getFormerHydrosphereCarvingField: getFormerHydrosphereCarvingField,
    getTerrainClassField: getTerrainClassField,
    getRidgeMountainField: getRidgeMountainField,
    getBasinTrenchValleyField: getBasinTrenchValleyField,
    getShelfEscarpmentField: getShelfEscarpmentField,
    getFutureFillGapField: getFutureFillGapField,
    getRegionSeedField: getRegionSeedField,
    getCarrierTerrainPacket: getCarrierTerrainPacket,
    getChildReceivePacket: getChildReceivePacket
  });

  if (typeof window !== "undefined") {
    window.AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD = API;
    window.AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD = API;
    window.AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD = API;
    window.AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD = API;

    window.AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_PACKET = getDryRevealedTerrainPacket(
      "published-static-dry-revealed-terrain",
      { compact: true }
    );

    window.AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_STATUS = status();
  }
})();
