// /assets/audralia/audralia.terrain.render.js
// AUDRALIA_G1_TERRAIN_RELIEF_REALISM_STRENGTHENING_TNT_v1
//
// Prior receipt preserved for Gauges compatibility:
// AUDRALIA_G1_TERRAIN_HYDROLOGY_MAP_CHILD_TNT_v1
//
// Role:
// - Terrain child for /assets/audralia/audralia.planet.render.js.
// - Strengthens visible terrain grammar before hydration.
// - Owns land pressure, non-redundant landform structure, mountains, ridges,
//   canyons, valleys, riverbed cuts, stream-ready channels, lake basins,
//   glacier seats, floodplains, deltas, watershed divides, islands,
//   miscellaneous territories, and Nine Summits elevation mapping.
//
// Does not own:
// - active water rendering
// - hydration behavior
// - climate animation
// - ecology
// - fauna
// - runtime
// - route shell
// - Earth
// - Sun
// - Moon
// - visual pass claim

const RECEIPT = "AUDRALIA_G1_TERRAIN_RELIEF_REALISM_STRENGTHENING_TNT_v1";
const PREVIOUS_RECEIPT = "AUDRALIA_G1_TERRAIN_HYDROLOGY_MAP_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TERRAIN_CHILD_RELIEF_REALISM";
const FILE = "/assets/audralia/audralia.terrain.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";

const TERRAIN_LAW = Object.freeze({
  parentRole: "baseline-land-water-only",
  terrainChildRole: "terrain-relief-hydrology-map-authority",
  majorLandBodies: 5,
  visibleTerrainSegments: 6,
  southPole: "ice_only",
  northPole: "land_body",
  miscellaneousTerritories: "required",
  islandDensity: "expanded",
  nineRegions: "elevation_ordered",
  region1Elevation: "lowest_origin_tier",
  region9Elevation: "highest_convergence_tier",
  hydrologyMap: "active",
  reliefRealism: "active",
  ownsHydrologyPlaces: true,
  ownsActiveHydration: false,
  ownsFinalRender: false,
  ownsClimate: false,
  ownsEcology: false,
  visualPassClaimed: false
});

const MAJOR_LAND_BODIES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "dominant_mainland",
    name: "Dominant Mainland",
    role: "primary uneven mainland with basin, ridge, and river-cut terrain",
    centerLon: -0.10,
    centerLat: 0.02,
    radiusLon: 0.38,
    radiusLat: 0.25,
    angle: -10,
    baseElevation: 0.30,
    terrainWeight: 1.0
  }),
  Object.freeze({
    id: 2,
    key: "western_weathered_body",
    name: "Western Weathered Body",
    role: "old western body with dry basin, canyons, and frontier pressure",
    centerLon: -0.62,
    centerLat: 0.00,
    radiusLon: 0.25,
    radiusLat: 0.20,
    angle: 18,
    baseElevation: 0.28,
    terrainWeight: 0.82
  }),
  Object.freeze({
    id: 3,
    key: "eastern_shelf_body",
    name: "Eastern Shelf Body",
    role: "eastern shelf body with temperate uplands and coast-fed valleys",
    centerLon: 0.58,
    centerLat: 0.04,
    radiusLon: 0.25,
    radiusLat: 0.21,
    angle: -24,
    baseElevation: 0.26,
    terrainWeight: 0.80
  }),
  Object.freeze({
    id: 4,
    key: "southern_archipelago_body",
    name: "Southern Archipelago Body",
    role: "broken island highlands with reef-facing stream cuts",
    centerLon: 0.16,
    centerLat: -0.46,
    radiusLon: 0.34,
    radiusLat: 0.16,
    angle: 8,
    baseElevation: 0.22,
    terrainWeight: 0.72
  }),
  Object.freeze({
    id: 5,
    key: "north_polar_land_body",
    name: "North Polar Land Body",
    role: "northern polar land body with glacial highland and mineral ridges",
    centerLon: 0.02,
    centerLat: 0.82,
    radiusLon: 0.44,
    radiusLat: 0.13,
    angle: 0,
    baseElevation: 0.42,
    terrainWeight: 0.88
  })
]);

const SOUTH_POLAR_ICE = Object.freeze({
  id: 6,
  key: "south_polar_ice_only",
  name: "South Polar Ice Only",
  role: "ice-only southern polar segment, not a land body",
  centerLon: 0.0,
  centerLat: -0.88,
  radiusLon: 1.0,
  radiusLat: 0.16
});

const MISC_TERRITORY_CLUSTERS = Object.freeze([
  Object.freeze({ id: "low_origin_islands", regionBias: 1, centerLon: -0.42, centerLat: -0.08, count: 20, spreadLon: 0.34, spreadLat: 0.18, radius: 0.026, elevation: 0.12 }),
  Object.freeze({ id: "structure_plateau_keys", regionBias: 2, centerLon: -0.10, centerLat: 0.08, count: 16, spreadLon: 0.26, spreadLat: 0.15, radius: 0.028, elevation: 0.22 }),
  Object.freeze({ id: "balance_transition_islands", regionBias: 3, centerLon: 0.18, centerLat: -0.02, count: 18, spreadLon: 0.32, spreadLat: 0.18, radius: 0.026, elevation: 0.32 }),
  Object.freeze({ id: "stability_temperate_shelves", regionBias: 4, centerLon: 0.54, centerLat: 0.10, count: 15, spreadLon: 0.28, spreadLat: 0.17, radius: 0.028, elevation: 0.42 }),
  Object.freeze({ id: "peace_protected_basins", regionBias: 5, centerLon: -0.24, centerLat: -0.24, count: 13, spreadLon: 0.24, spreadLat: 0.15, radius: 0.026, elevation: 0.52 }),
  Object.freeze({ id: "joy_reef_highlands", regionBias: 6, centerLon: 0.18, centerLat: -0.48, count: 30, spreadLon: 0.48, spreadLat: 0.20, radius: 0.020, elevation: 0.62 }),
  Object.freeze({ id: "dignity_mineral_crowns", regionBias: 7, centerLon: 0.08, centerLat: 0.56, count: 13, spreadLon: 0.30, spreadLat: 0.13, radius: 0.024, elevation: 0.72 }),
  Object.freeze({ id: "free_will_frontier_ridge", regionBias: 8, centerLon: -0.70, centerLat: 0.22, count: 13, spreadLon: 0.26, spreadLat: 0.20, radius: 0.024, elevation: 0.82 }),
  Object.freeze({ id: "love_high_convergence", regionBias: 9, centerLon: 0.02, centerLat: 0.34, count: 12, spreadLon: 0.20, spreadLat: 0.14, radius: 0.022, elevation: 0.92 })
]);

const NINE_REGIONS = Object.freeze([
  Object.freeze({ id: 1, key: "character", name: "Character", elevationTier: "low_origin_ground", relativeElevation: 0.12, anchorLon: -0.42, anchorLat: -0.08, regionRole: "origin plains, low coastal stone, first habitable ground" }),
  Object.freeze({ id: 2, key: "structure", name: "Structure", elevationTier: "low_plateau", relativeElevation: 0.22, anchorLon: -0.10, anchorLat: 0.08, regionRole: "stable foundation plateau and broad settlement table" }),
  Object.freeze({ id: 3, key: "balance", name: "Balance", elevationTier: "basin_transition", relativeElevation: 0.32, anchorLon: 0.18, anchorLat: -0.02, regionRole: "wet dry transition basin where systems meet" }),
  Object.freeze({ id: 4, key: "stability", name: "Stability", elevationTier: "temperate_upland", relativeElevation: 0.42, anchorLon: 0.54, anchorLat: 0.10, regionRole: "steady upland belt with repeatable climate" }),
  Object.freeze({ id: 5, key: "peace", name: "Peace", elevationTier: "protected_high_basin", relativeElevation: 0.52, anchorLon: -0.24, anchorLat: -0.24, regionRole: "sheltered green basin above lower belts" }),
  Object.freeze({ id: 6, key: "joy", name: "Joy", elevationTier: "bright_island_highlands", relativeElevation: 0.62, anchorLon: 0.18, anchorLat: -0.48, regionRole: "reef islands, warm high islands, lively archipelago" }),
  Object.freeze({ id: 7, key: "dignity", name: "Dignity", elevationTier: "mineral_crownland", relativeElevation: 0.72, anchorLon: 0.08, anchorLat: 0.56, regionRole: "weathered mineral ridges and old exposed value" }),
  Object.freeze({ id: 8, key: "free_will", name: "Free Will", elevationTier: "frontier_ridge_belt", relativeElevation: 0.82, anchorLon: -0.70, anchorLat: 0.22, regionRole: "open high frontier, difficult traversal, mixed climate edge" }),
  Object.freeze({ id: 9, key: "love", name: "Love", elevationTier: "highest_convergence_summit", relativeElevation: 0.92, anchorLon: 0.02, anchorLat: 0.34, regionRole: "highest convergence heartland where waters, ridges, routes, and climates meet" })
]);

const HYDROLOGY_CORRIDORS = Object.freeze([
  Object.freeze({ id: "river_09_03", sourceRegion: 9, receiverRegion: 3, type: "major_riverbed", role: "highest convergence watershed descends into balance basin", strength: 0.96 }),
  Object.freeze({ id: "river_09_05", sourceRegion: 9, receiverRegion: 5, type: "major_riverbed", role: "summit-fed protected basin riverbed", strength: 0.88 }),
  Object.freeze({ id: "river_07_04", sourceRegion: 7, receiverRegion: 4, type: "snowmelt_riverbed", role: "mineral crownland drains toward stable upland valleys", strength: 0.82 }),
  Object.freeze({ id: "river_08_01", sourceRegion: 8, receiverRegion: 1, type: "frontier_cut", role: "frontier ridge cuts back toward low origin floodplain", strength: 0.74 }),
  Object.freeze({ id: "river_06_03", sourceRegion: 6, receiverRegion: 3, type: "island_stream_return", role: "archipelago highland streams return toward balance exchanges", strength: 0.68 }),
  Object.freeze({ id: "river_04_01", sourceRegion: 4, receiverRegion: 1, type: "temperate_valley_river", role: "stable uplands descend into low origin plain", strength: 0.78 }),
  Object.freeze({ id: "river_05_01", sourceRegion: 5, receiverRegion: 1, type: "protected_basin_outflow", role: "peace basin outflow reaches first floodplain", strength: 0.72 }),
  Object.freeze({ id: "river_02_03", sourceRegion: 2, receiverRegion: 3, type: "plateau_cut", role: "foundation plateau drains into transition basin", strength: 0.70 })
]);

const RELIEF_RANGES = Object.freeze([
  Object.freeze({ id: "range_love_to_dignity", fromRegion: 9, toRegion: 7, role: "summit crown mountain chain", strength: 0.96, width: 0.070 }),
  Object.freeze({ id: "range_love_to_free_will", fromRegion: 9, toRegion: 8, role: "frontier ridge spine", strength: 0.88, width: 0.062 }),
  Object.freeze({ id: "range_dignity_to_stability", fromRegion: 7, toRegion: 4, role: "weathered mineral ridge", strength: 0.78, width: 0.056 }),
  Object.freeze({ id: "range_joy_archipelago", fromRegion: 6, toRegion: 3, role: "island highland fold", strength: 0.68, width: 0.045 }),
  Object.freeze({ id: "range_north_polar_crown", fromRegion: 7, toRegion: 9, role: "glacial crown fold", strength: 0.74, width: 0.052 })
]);

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function wrapLonDistance(a, b) {
  let d = a - b;
  while (d > 1) d -= 2;
  while (d < -1) d += 2;
  return d;
}

function gaussian(dx, dy, sx, sy, power = 1) {
  return Math.exp(-((dx * dx) / (sx * sx) + (dy * dy) / (sy * sy)) * power);
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function getInputContext(context = {}) {
  const coherenceIndex = clamp(
    Number.isFinite(Number(context.coherenceIndex)) ? Number(context.coherenceIndex) : 0.64,
    0,
    1
  );

  const collaborativeExpression = clamp(
    Number.isFinite(Number(context.collaborativeExpression)) ? Number(context.collaborativeExpression) : 0.68,
    0,
    1
  );

  return Object.freeze({
    coherenceIndex,
    collaborativeExpression,
    expressionStrength: clamp(coherenceIndex * 0.62 + collaborativeExpression * 0.38, 0, 1)
  });
}

function rotatePoint(dx, dy, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const c = Math.cos(radians);
  const s = Math.sin(radians);

  return Object.freeze({
    x: dx * c - dy * s,
    y: dx * s + dy * c
  });
}

function regionById(id) {
  return NINE_REGIONS.find((region) => region.id === id) || NINE_REGIONS[0];
}

function distanceToSegment(lon, lat, ax, ay, bx, by) {
  const wrappedB = ax + wrapLonDistance(bx, ax);
  const wrappedP = ax + wrapLonDistance(lon, ax);

  const vx = wrappedB - ax;
  const vy = by - ay;
  const wx = wrappedP - ax;
  const wy = lat - ay;

  const len2 = vx * vx + vy * vy;
  const t = len2 <= 0.00001 ? 0 : clamp((wx * vx + wy * vy) / len2, 0, 1);

  const cx = ax + vx * t;
  const cy = ay + vy * t;

  return Object.freeze({
    distance: Math.hypot(wrappedP - cx, lat - cy),
    t
  });
}

function linePressure(lon, lat, fromRegionId, toRegionId, width, strength = 1) {
  const from = regionById(fromRegionId);
  const to = regionById(toRegionId);
  const line = distanceToSegment(lon, lat, from.anchorLon, from.anchorLat, to.anchorLon, to.anchorLat);

  return Object.freeze({
    pressure: smoothstep(width, 0.006, line.distance) * strength,
    t: line.t,
    distance: line.distance
  });
}

function landInfluence(lon, lat, body) {
  const dx = wrapLonDistance(lon, body.centerLon);
  const dy = lat - body.centerLat;
  const rotated = rotatePoint(dx, dy, body.angle);

  const ellipse =
    gaussian(rotated.x, rotated.y, body.radiusLon, body.radiusLat, 1.05) * body.terrainWeight;

  const shoulderA =
    gaussian(
      rotated.x - body.radiusLon * 0.36,
      rotated.y + body.radiusLat * 0.18,
      body.radiusLon * 0.52,
      body.radiusLat * 0.48,
      1.12
    ) *
    0.42 *
    body.terrainWeight;

  const shoulderB =
    gaussian(
      rotated.x + body.radiusLon * 0.42,
      rotated.y - body.radiusLat * 0.22,
      body.radiusLon * 0.46,
      body.radiusLat * 0.40,
      1.16
    ) *
    0.34 *
    body.terrainWeight;

  const edgeNoise =
    (fbm(lon * 5.4 + body.id * 2.1, lat * 5.4 - body.id * 1.7, 100 + body.id, 5) - 0.5) * 0.24;

  const fractureNoise =
    (fbm(lon * 12.0 - body.id * 0.8, lat * 12.0 + body.id * 1.6, 170 + body.id, 4) - 0.5) * 0.11;

  const shape = Math.max(ellipse, shoulderA, shoulderB);
  const pressure = shape + edgeNoise * shape + fractureNoise * smoothstep(0.28, 0.76, shape);

  return clamp(pressure, 0, 1.45);
}

function territoryPoint(cluster, index) {
  const step = index - (cluster.count - 1) / 2;
  const stagger = index % 2 === 0 ? 1 : -1;

  return Object.freeze({
    lon:
      cluster.centerLon +
      step * (cluster.spreadLon / Math.max(1, cluster.count - 1)) +
      Math.sin(index * 1.73) * 0.026,
    lat:
      cluster.centerLat +
      stagger * cluster.spreadLat * 0.18 +
      Math.cos(index * 1.31) * cluster.spreadLat * 0.24,
    radius: cluster.radius * (0.64 + (index % 5) * 0.08),
    elevation: cluster.elevation
  });
}

function territoryInfluence(lon, lat, cluster) {
  let strength = 0;
  let elevation = 0;

  for (let i = 0; i < cluster.count; i += 1) {
    const point = territoryPoint(cluster, i);
    const dx = wrapLonDistance(lon, point.lon);
    const dy = lat - point.lat;
    const local = gaussian(dx, dy, point.radius, point.radius * 0.76, 1.18);

    if (local > 0.02) {
      strength = Math.max(strength, local);
      elevation += point.elevation * local;
    }
  }

  return Object.freeze({
    strength: clamp(strength, 0, 1),
    elevation: clamp(elevation, 0, 1)
  });
}

function southPolarIceInfluence(lon, lat) {
  const dx = wrapLonDistance(lon, SOUTH_POLAR_ICE.centerLon);
  const dy = lat - SOUTH_POLAR_ICE.centerLat;
  const base = gaussian(dx, dy, SOUTH_POLAR_ICE.radiusLon, SOUTH_POLAR_ICE.radiusLat, 0.88);
  const polarBand = smoothstep(0.70, 0.94, -lat);

  return clamp(Math.max(base, polarBand), 0, 1);
}

function chooseMajorLandBody(lon, lat) {
  let bestBody = null;
  let bestStrength = 0;

  for (const body of MAJOR_LAND_BODIES) {
    const strength = landInfluence(lon, lat, body);

    if (strength > bestStrength) {
      bestBody = body;
      bestStrength = strength;
    }
  }

  return Object.freeze({
    body: bestBody,
    strength: clamp(bestStrength, 0, 1.45)
  });
}

function chooseTerritory(lon, lat) {
  let bestCluster = null;
  let bestStrength = 0;
  let bestElevation = 0;

  for (const cluster of MISC_TERRITORY_CLUSTERS) {
    const influence = territoryInfluence(lon, lat, cluster);

    if (influence.strength > bestStrength) {
      bestCluster = cluster;
      bestStrength = influence.strength;
      bestElevation = influence.elevation;
    }
  }

  return Object.freeze({
    cluster: bestCluster,
    strength: bestStrength,
    elevation: bestElevation
  });
}

function chooseRegion(lon, lat, context, baseElevation) {
  let bestRegion = NINE_REGIONS[0];
  let bestScore = -Infinity;

  for (const region of NINE_REGIONS) {
    const dx = wrapLonDistance(lon, region.anchorLon);
    const dy = lat - region.anchorLat;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const elevationFit = 1 - Math.abs(region.relativeElevation - baseElevation);
    const accessGate = smoothstep(
      Math.max(0, region.relativeElevation - 0.20),
      Math.min(1, region.relativeElevation + 0.20),
      context.expressionStrength
    );

    const texture = fbm(lon * 2.1 + region.id * 0.41, lat * 2.1 - region.id * 0.37, 700 + region.id, 3);

    const score =
      (1 / (0.04 + distance)) * 0.68 +
      elevationFit * 1.45 +
      accessGate * 0.72 +
      texture * 0.16;

    if (score > bestScore) {
      bestScore = score;
      bestRegion = region;
    }
  }

  return Object.freeze({
    region: bestRegion,
    accessStrength: smoothstep(
      Math.max(0, bestRegion.relativeElevation - 0.16),
      Math.min(1, bestRegion.relativeElevation + 0.16),
      context.expressionStrength
    )
  });
}

function hydrologySignals(lon, lat, terrainBase) {
  if (!terrainBase.isLand && !terrainBase.isIce) {
    const shallowShelf = terrainBase.shelfPermission || 0;

    return Object.freeze({
      watershedId: "ocean",
      watershedStrength: 0,
      riverbedPressure: 0,
      streamPressure: 0,
      lakeBasinPressure: 0,
      glacierSeatPressure: 0,
      valleyChannelPressure: 0,
      floodplainPressure: 0,
      deltaReceiverPressure: clamp(shallowShelf * 0.38, 0, 1),
      snowpackSourcePressure: 0,
      hydrologyReadinessIndex: clamp(shallowShelf * 0.22, 0, 1)
    });
  }

  let bestCorridor = HYDROLOGY_CORRIDORS[0];
  let bestCorridorPressure = 0;
  let bestT = 0;

  for (const corridor of HYDROLOGY_CORRIDORS) {
    const source = regionById(corridor.sourceRegion);
    const receiver = regionById(corridor.receiverRegion);
    const width = corridor.type === "major_riverbed" ? 0.050 : 0.038;
    const line = distanceToSegment(lon, lat, source.anchorLon, source.anchorLat, receiver.anchorLon, receiver.anchorLat);
    const pressure = smoothstep(width, 0.004, line.distance) * corridor.strength;

    if (pressure > bestCorridorPressure) {
      bestCorridorPressure = pressure;
      bestCorridor = corridor;
      bestT = line.t;
    }
  }

  const region = terrainBase.regionId ? regionById(terrainBase.regionId) : regionById(1);
  const elevation = clamp(terrainBase.normalizedElevation || 0, 0, 1);
  const ridge = clamp(terrainBase.ridge || 0, 0, 1);
  const basin = clamp(terrainBase.basin || 0, 0, 1);
  const coast = clamp(terrainBase.coastPressure || 0, 0, 1);
  const polar = clamp(terrainBase.polarSeat || 0, 0, 1);
  const dry = clamp(terrainBase.dryInteriorPressure || 0, 0, 1);
  const territory = clamp(terrainBase.territoryStrength || 0, 0, 1);

  const sourcePotential = clamp(
    smoothstep(0.58, 0.94, region.relativeElevation) * 0.42 +
      ridge * 0.28 +
      polar * 0.22 +
      (terrainBase.landBodyKey === "north_polar_land_body" ? 0.18 : 0),
    0,
    1
  );

  const glacierSeatPressure = clamp(
    sourcePotential * 0.56 +
      smoothstep(0.68, 0.96, elevation) * 0.22 +
      polar * 0.30 -
      dry * 0.16,
    0,
    1
  );

  const snowpackSourcePressure = clamp(
    glacierSeatPressure * 0.72 + smoothstep(0.72, 0.96, region.relativeElevation) * 0.28,
    0,
    1
  );

  const riverbedPressure = clamp(
    bestCorridorPressure * (0.70 + sourcePotential * 0.24) +
      smoothstep(0.18, 0.72, elevation) * 0.10,
    0,
    1
  );

  const streamPressure = clamp(
    riverbedPressure * 0.44 +
      territory * 0.22 +
      ridge * 0.28 +
      sourcePotential * 0.22,
    0,
    1
  );

  const lakeBasinPressure = clamp(
    basin * 0.46 +
      (region.id === 3 ? 0.24 : 0) +
      (region.id === 5 ? 0.34 : 0) +
      smoothstep(0.26, 0.56, elevation) * (1 - ridge) * 0.16,
    0,
    1
  );

  const valleyChannelPressure = clamp(
    riverbedPressure * 0.40 +
      streamPressure * 0.30 +
      ridge * (1 - basin) * 0.24 +
      bestCorridorPressure * 0.28,
    0,
    1
  );

  const floodplainPressure = clamp(
    (region.id === 1 ? 0.30 : 0) +
      (region.id === 3 ? 0.22 : 0) +
      (region.id === 4 ? 0.18 : 0) +
      (region.id === 5 ? 0.14 : 0) +
      coast * 0.22 +
      (1 - elevation) * 0.18 +
      riverbedPressure * 0.18,
    0,
    1
  );

  const deltaReceiverPressure = clamp(
    coast * 0.36 +
      riverbedPressure * 0.24 +
      smoothstep(0.58, 1.0, bestT) * bestCorridorPressure * 0.22,
    0,
    1
  );

  const watershedStrength = clamp(
    sourcePotential * 0.34 +
      ridge * 0.24 +
      valleyChannelPressure * 0.18 +
      riverbedPressure * 0.14 +
      lakeBasinPressure * 0.10,
    0,
    1
  );

  const hydrologyReadinessIndex = clamp(
    watershedStrength * 0.18 +
      riverbedPressure * 0.18 +
      streamPressure * 0.12 +
      lakeBasinPressure * 0.14 +
      glacierSeatPressure * 0.14 +
      valleyChannelPressure * 0.10 +
      floodplainPressure * 0.08 +
      deltaReceiverPressure * 0.06,
    0,
    1
  );

  return Object.freeze({
    watershedId: bestCorridor.id,
    watershedStrength,
    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    glacierSeatPressure,
    valleyChannelPressure,
    floodplainPressure,
    deltaReceiverPressure,
    snowpackSourcePressure,
    hydrologyReadinessIndex
  });
}

function reliefSignals(lon, lat, terrainBase, hydrology) {
  let mountainPressure = 0;
  let rangeId = "none";

  for (const range of RELIEF_RANGES) {
    const line = linePressure(lon, lat, range.fromRegion, range.toRegion, range.width, range.strength);
    const ruggedness = fbm(lon * 18.0 + range.strength * 10, lat * 18.0 - range.width * 80, 900 + range.fromRegion, 4);
    const pressure = line.pressure * (0.78 + ruggedness * 0.34);

    if (pressure > mountainPressure) {
      mountainPressure = pressure;
      rangeId = range.id;
    }
  }

  const elevation = clamp(terrainBase.normalizedElevation || 0, 0, 1);
  const ridge = clamp(terrainBase.ridge || 0, 0, 1);
  const riverbed = clamp(hydrology.riverbedPressure || 0, 0, 1);
  const valley = clamp(hydrology.valleyChannelPressure || 0, 0, 1);
  const glacier = clamp(hydrology.glacierSeatPressure || 0, 0, 1);
  const lake = clamp(hydrology.lakeBasinPressure || 0, 0, 1);

  const fracture = fbm(lon * 24.0 - 2.7, lat * 24.0 + 4.2, 1201, 4);
  const canyonPressure = clamp(
    riverbed * 0.42 +
      valley * 0.34 +
      ridge * 0.18 +
      smoothstep(0.52, 0.92, elevation) * 0.14 +
      (fracture > 0.58 ? (fracture - 0.58) * 0.82 : 0),
    0,
    1
  );

  const riverIncisionPressure = clamp(riverbed * 0.52 + canyonPressure * 0.30 + valley * 0.18, 0, 1);
  const streamBranchPressure = clamp(hydrology.streamPressure * 0.58 + canyonPressure * 0.18 + glacier * 0.20, 0, 1);
  const mountainHardness = clamp(mountainPressure * 0.56 + ridge * 0.34 + glacier * 0.20, 0, 1);
  const basinCutPressure = clamp(lake * 0.52 + canyonPressure * 0.14 + terrainBase.basin * 0.34, 0, 1);
  const reliefHardness = clamp(mountainHardness * 0.42 + canyonPressure * 0.28 + riverIncisionPressure * 0.18 + streamBranchPressure * 0.12, 0, 1);

  return Object.freeze({
    rangeId,
    mountainPressure: clamp(mountainPressure, 0, 1),
    mountainHardness,
    canyonPressure,
    riverIncisionPressure,
    streamBranchPressure,
    basinCutPressure,
    reliefHardness
  });
}

function terrainSignals(lon, lat, context) {
  const major = chooseMajorLandBody(lon, lat);
  const territory = chooseTerritory(lon, lat);
  const southIce = southPolarIceInfluence(lon, lat);

  const majorScore = major.strength;
  const territoryScore = territory.strength;
  const landPressure = clamp(Math.max(majorScore, territoryScore * 1.10), 0, 1.45);

  const coastlineThreshold = 0.50;
  const isIce = southIce > 0.52;
  const isLand = !isIce && landPressure >= coastlineThreshold;
  const isWater = !isLand && !isIce;

  const pressureBase = clamp((landPressure - coastlineThreshold) / 0.72, 0, 1);
  const majorElevation = major.body ? major.body.baseElevation * clamp(majorScore, 0, 1) : 0;
  const territoryElevation = territory.elevation;
  const terrainNoise = fbm(lon * 5.4 + 1.7, lat * 5.4 - 2.6, 101, 5);
  const fineNoise = fbm(lon * 17.0 - 4.1, lat * 17.0 + 3.9, 211, 4);
  const tectonicPressure = fbm(lon * 2.2 + 8.3, lat * 2.2 - 6.8, 311, 5);

  let preliminaryElevation = isLand
    ? clamp(
        majorElevation +
          territoryElevation * 0.72 +
          pressureBase * 0.22 +
          (terrainNoise - 0.5) * 0.12,
        0.05,
        0.96
      )
    : -clamp((coastlineThreshold - landPressure) * 1.1 + (1 - landPressure) * 0.18, 0.02, 1);

  if (isIce) preliminaryElevation = 0;

  const regionChoice = chooseRegion(lon, lat, context, clamp(preliminaryElevation, 0, 1));
  const region = regionChoice.region;

  const regionLift = isLand
    ? Math.max(0, region.relativeElevation - preliminaryElevation) * regionChoice.accessStrength * 0.48
    : 0;

  const baseElevation = isLand ? clamp(preliminaryElevation + regionLift, 0, 1) : preliminaryElevation;

  const rawRidge = isLand
    ? clamp(
        tectonicPressure * 0.38 +
          Math.max(0, baseElevation - 0.42) * 0.72 +
          region.relativeElevation * 0.24 +
          fineNoise * 0.12,
        0,
        1
      )
    : 0;

  const rawBasin = isLand
    ? clamp((1 - rawRidge) * (1 - Math.abs(baseElevation - 0.34)) * 0.72, 0, 1)
    : 0;

  const coastPressure = clamp(1 - Math.abs(landPressure - coastlineThreshold) / 0.16, 0, 1);
  const shelfPermission = isWater ? clamp(coastPressure * 0.92, 0, 1) : clamp(coastPressure * 0.34, 0, 1);

  const dryInteriorPressure = isLand
    ? clamp((1 - coastPressure) * smoothstep(0.18, 0.68, Math.abs(lat)) * (0.42 + fineNoise * 0.38), 0, 1)
    : 0;

  const polarSeat = isIce
    ? 1
    : major.body && major.body.key === "north_polar_land_body"
      ? clamp(smoothstep(0.64, 0.94, lat), 0, 1)
      : 0;

  const base = Object.freeze({
    major,
    territory,
    regionChoice,
    landPressure,
    isLand,
    isWater,
    isIce,
    southIce: isIce,
    normalizedElevation: baseElevation,
    elevationMeters: isLand ? Math.round(baseElevation * 9200) : isWater ? Math.round(baseElevation * 5600) : 0,
    ridge: rawRidge,
    basin: rawBasin,
    slope: isLand ? clamp(rawRidge * 0.58 + Math.abs(fineNoise - terrainNoise) * 0.62 + coastPressure * 0.16, 0, 1) : 0,
    coastPressure,
    shelfPermission,
    dryInteriorPressure,
    polarSeat,
    terrainNoise,
    fineTerrainNoise: fineNoise,
    tectonicPressure,
    region,
    landBodyKey: major.body ? major.body.key : "none",
    regionId: region.id,
    regionRelativeElevation: region.relativeElevation,
    territoryStrength: territory.strength
  });

  const hydrology = hydrologySignals(lon, lat, base);
  const relief = reliefSignals(lon, lat, base, hydrology);

  const finalElevation = isLand
    ? clamp(
        baseElevation +
          relief.mountainPressure * 0.18 -
          relief.canyonPressure * 0.09 -
          relief.basinCutPressure * 0.05,
        0,
        1
      )
    : baseElevation;

  const finalRidge = isLand
    ? clamp(rawRidge + relief.mountainPressure * 0.44 + relief.mountainHardness * 0.18 - relief.basinCutPressure * 0.10, 0, 1)
    : 0;

  const finalBasin = isLand
    ? clamp(rawBasin + hydrology.lakeBasinPressure * 0.22 + relief.basinCutPressure * 0.20 - relief.mountainPressure * 0.12, 0, 1)
    : 0;

  const finalSlope = isLand
    ? clamp(base.slope + relief.reliefHardness * 0.36 + relief.canyonPressure * 0.26, 0, 1)
    : 0;

  const finalDry = isLand
    ? clamp(dryInteriorPressure + relief.canyonPressure * 0.12 + relief.mountainHardness * 0.08 - hydrology.lakeBasinPressure * 0.12, 0, 1)
    : 0;

  return Object.freeze({
    ...base,
    normalizedElevation: finalElevation,
    elevationMeters: isLand ? Math.round(finalElevation * 9600) : base.elevationMeters,
    ridge: finalRidge,
    basin: finalBasin,
    slope: finalSlope,
    dryInteriorPressure: finalDry,
    hydrology,
    relief
  });
}

function terrainColorInfluence(sample) {
  if (sample.isIce) {
    return Object.freeze({
      base: "south_polar_ice_only",
      r: 238,
      g: 248,
      b: 252,
      ice: 1,
      shelf: 0,
      coast: 0,
      relief: sample.reliefHardness || 0,
      hydrology: sample.hydrologyReadinessIndex || 0
    });
  }

  if (!sample.isLand) {
    return Object.freeze({
      base: "water_permission",
      oceanDepth: clamp(Math.abs(sample.normalizedElevation), 0, 1),
      shelf: sample.shelfPermission,
      coast: sample.coastPressure,
      r: Math.round(mix(8, 44, sample.shelfPermission)),
      g: Math.round(mix(30, 142, sample.shelfPermission)),
      b: Math.round(mix(78, 168, sample.shelfPermission)),
      relief: 0,
      hydrology: sample.hydrologyReadinessIndex || 0
    });
  }

  const elevation = sample.normalizedElevation;
  const highland = sample.ridge;
  const dry = sample.dryInteriorPressure;
  const polar = sample.polarSeat;
  const hydro = sample.hydrologyReadinessIndex || 0;
  const relief = sample.reliefHardness || 0;
  const canyon = sample.canyonPressure || 0;

  return Object.freeze({
    base: "terrain_land_relief",
    elevation,
    highland,
    dry,
    polar,
    hydrology: hydro,
    relief,
    canyon,
    r: Math.round(mix(mix(82, 176, dry), 226, polar * 0.72 + highland * 0.22 + relief * 0.10)),
    g: Math.round(mix(mix(126, 118, dry), 232, polar * 0.72 + hydro * 0.08 + highland * 0.06)),
    b: Math.round(mix(mix(76, 86, dry), 238, polar * 0.72 + hydro * 0.10))
  });
}

export function createTerrainProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    role: "terrain-relief-hydrology-map-child",
    terrainChild: true,

    majorLandBodyCount: TERRAIN_LAW.majorLandBodies,
    visibleTerrainSegments: TERRAIN_LAW.visibleTerrainSegments,
    southPole: TERRAIN_LAW.southPole,
    northPole: TERRAIN_LAW.northPole,
    miscellaneousTerritories: TERRAIN_LAW.miscellaneousTerritories,
    islandDensity: TERRAIN_LAW.islandDensity,

    regionCount: NINE_REGIONS.length,
    regionOrdering: TERRAIN_LAW.nineRegions,
    regionElevationLaw: true,

    hydrologyMap: true,
    reliefRealism: true,
    hydrologyOwnership: "terrain_places_only",
    activeHydrationOwnedHere: false,
    hydrologyCorridors: HYDROLOGY_CORRIDORS,
    reliefRanges: RELIEF_RANGES,

    majorLandBodies: MAJOR_LAND_BODIES,
    southPolarIce: SOUTH_POLAR_ICE,
    miscellaneousTerritoryClusters: MISC_TERRITORY_CLUSTERS,
    nineRegions: NINE_REGIONS,

    ownsTerrain: true,
    ownsHydrologyPlaces: true,
    ownsActiveHydration: false,
    ownsFinalRender: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    visualPassClaimed: false,

    ...overrides
  });
}

export function sampleTerrain(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const terrainContext = getInputContext(context);
  const signals = terrainSignals(point.lon, point.lat, terrainContext);

  const majorBody = signals.major.body;
  const territoryCluster = signals.territory.cluster;
  const region = signals.regionChoice.region;
  const hydrology = signals.hydrology;
  const relief = signals.relief;

  const visualRegionElevation = signals.isLand
    ? clamp(region.relativeElevation * 0.70 + signals.normalizedElevation * 0.24 + relief.mountainPressure * 0.10 - relief.canyonPressure * 0.04, 0, 1)
    : 0;

  const sample = Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    majorLandBodyCount: TERRAIN_LAW.majorLandBodies,
    visibleTerrainSegments: TERRAIN_LAW.visibleTerrainSegments,

    landBodyId: signals.isLand && majorBody ? majorBody.id : 0,
    landBodyKey: signals.isLand && majorBody ? majorBody.key : signals.isIce ? SOUTH_POLAR_ICE.key : "ocean",
    landBodyName: signals.isLand && majorBody ? majorBody.name : signals.isIce ? SOUTH_POLAR_ICE.name : "Ocean",
    landBodyRole: signals.isLand && majorBody ? majorBody.role : signals.isIce ? SOUTH_POLAR_ICE.role : "water body",

    territoryId: territoryCluster ? territoryCluster.id : "none",
    territoryRegionBias: territoryCluster ? territoryCluster.regionBias : 0,
    territoryStrength: signals.territory.strength,

    regionId: signals.isLand ? region.id : 0,
    regionKey: signals.isLand ? region.key : signals.isIce ? "south_polar_ice" : "ocean",
    regionName: signals.isLand ? region.name : signals.isIce ? "South Polar Ice" : "Ocean",
    regionRole: signals.isLand ? region.regionRole : signals.isIce ? SOUTH_POLAR_ICE.role : "water boundary",
    elevationTier: signals.isLand ? region.elevationTier : signals.isIce ? "ice_only" : "water",
    canonicalRegionRelativeElevation: signals.isLand ? region.relativeElevation : 0,
    regionRelativeElevation: visualRegionElevation,
    regionAccessStrength: signals.isLand ? signals.regionChoice.accessStrength : 0,

    coherenceIndex: terrainContext.coherenceIndex,
    collaborativeExpression: terrainContext.collaborativeExpression,
    expressionStrength: terrainContext.expressionStrength,

    landPressure: signals.landPressure,
    isLand: signals.isLand,
    isWater: signals.isWater,
    isIce: signals.isIce,
    southIce: signals.southIce,

    normalizedElevation: signals.normalizedElevation,
    elevationMeters: signals.elevationMeters,
    ridge: signals.ridge,
    basin: signals.basin,
    slope: signals.slope,
    coastPressure: signals.coastPressure,
    shelfPermission: signals.shelfPermission,
    dryInteriorPressure: signals.dryInteriorPressure,
    polarSeat: signals.polarSeat,
    terrainNoise: signals.terrainNoise,
    fineTerrainNoise: signals.fineTerrainNoise,
    tectonicPressure: signals.tectonicPressure,

    watershedId: hydrology.watershedId,
    watershedStrength: hydrology.watershedStrength,
    riverbedPressure: hydrology.riverbedPressure,
    streamPressure: hydrology.streamPressure,
    lakeBasinPressure: hydrology.lakeBasinPressure,
    glacierSeatPressure: hydrology.glacierSeatPressure,
    valleyChannelPressure: hydrology.valleyChannelPressure,
    floodplainPressure: hydrology.floodplainPressure,
    deltaReceiverPressure: hydrology.deltaReceiverPressure,
    snowpackSourcePressure: hydrology.snowpackSourcePressure,
    hydrologyReadinessIndex: hydrology.hydrologyReadinessIndex,

    rangeId: relief.rangeId,
    mountainPressure: relief.mountainPressure,
    mountainHardness: relief.mountainHardness,
    canyonPressure: relief.canyonPressure,
    riverIncisionPressure: relief.riverIncisionPressure,
    streamBranchPressure: relief.streamBranchPressure,
    basinCutPressure: relief.basinCutPressure,
    reliefHardness: relief.reliefHardness,

    terrainColorInfluence: null,

    terrainChild: true,
    ownsTerrain: true,
    ownsHydrologyPlaces: true,
    ownsActiveHydration: false,
    ownsFinalRender: false,
    ownsClimate: false,
    ownsEcology: false,
    visualPassClaimed: false
  });

  return Object.freeze({
    ...sample,
    terrainColorInfluence: terrainColorInfluence(sample)
  });
}

export function buildTerrainField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const landBodyCounts = new Map();
  const regionCounts = new Map();
  const territoryCounts = new Map();
  const watershedCounts = new Map();
  const rangeCounts = new Map();

  let landSamples = 0;
  let waterSamples = 0;
  let iceSamples = 0;
  let elevationSum = 0;
  let hydrologySum = 0;
  let riverbedSum = 0;
  let lakeSum = 0;
  let glacierSum = 0;
  let mountainSum = 0;
  let canyonSum = 0;
  let reliefSum = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleTerrain(u, v, options);
      const index = y * w + x;

      samples[index] = sample;

      hydrologySum += sample.hydrologyReadinessIndex;
      riverbedSum += sample.riverbedPressure;
      lakeSum += sample.lakeBasinPressure;
      glacierSum += sample.glacierSeatPressure;
      mountainSum += sample.mountainPressure;
      canyonSum += sample.canyonPressure;
      reliefSum += sample.reliefHardness;

      if (sample.watershedId !== "ocean") {
        watershedCounts.set(sample.watershedId, (watershedCounts.get(sample.watershedId) || 0) + 1);
      }

      if (sample.rangeId !== "none") {
        rangeCounts.set(sample.rangeId, (rangeCounts.get(sample.rangeId) || 0) + 1);
      }

      if (sample.isIce) {
        iceSamples += 1;
      } else if (sample.isLand) {
        landSamples += 1;
        elevationSum += sample.normalizedElevation;
        maxElevation = Math.max(maxElevation, sample.normalizedElevation);
        minElevation = Math.min(minElevation, sample.normalizedElevation);

        landBodyCounts.set(sample.landBodyId, (landBodyCounts.get(sample.landBodyId) || 0) + 1);
        regionCounts.set(sample.regionId, (regionCounts.get(sample.regionId) || 0) + 1);

        if (sample.territoryId !== "none") {
          territoryCounts.set(sample.territoryId, (territoryCounts.get(sample.territoryId) || 0) + 1);
        }
      } else {
        waterSamples += 1;
      }
    }
  }

  const activeLandBodies = Array.from(landBodyCounts.keys()).sort((a, b) => a - b);
  const activeRegions = Array.from(regionCounts.keys()).sort((a, b) => a - b);
  const activeTerritories = Array.from(territoryCounts.keys()).sort();
  const activeWatersheds = Array.from(watershedCounts.keys()).sort();
  const activeRanges = Array.from(rangeCounts.keys()).sort();

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    width: w,
    height: h,
    samples,
    profile: createTerrainProfile(options.profile || {}),
    stats: Object.freeze({
      landSamples,
      waterSamples,
      iceSamples,
      landRatio: landSamples / samples.length,
      waterRatio: waterSamples / samples.length,
      iceRatio: iceSamples / samples.length,

      activeLandBodyCount: activeLandBodies.length,
      expectedLandBodyCount: TERRAIN_LAW.majorLandBodies,
      activeLandBodies,

      activeRegionCount: activeRegions.length,
      expectedRegionCount: NINE_REGIONS.length,
      activeRegions,

      activeMiscTerritoryCount: activeTerritories.length,
      expectedMiscTerritoryClusters: MISC_TERRITORY_CLUSTERS.length,
      activeTerritories,

      activeWatershedCount: activeWatersheds.length,
      expectedHydrologyCorridorCount: HYDROLOGY_CORRIDORS.length,
      activeWatersheds,

      activeReliefRangeCount: activeRanges.length,
      expectedReliefRangeCount: RELIEF_RANGES.length,
      activeRanges,

      averageLandElevation: elevationSum / Math.max(1, landSamples),
      minLandElevation: Number.isFinite(minElevation) ? minElevation : 0,
      maxLandElevation: Number.isFinite(maxElevation) ? maxElevation : 0,

      averageHydrologyReadiness: hydrologySum / samples.length,
      averageRiverbedPressure: riverbedSum / samples.length,
      averageLakeBasinPressure: lakeSum / samples.length,
      averageGlacierSeatPressure: glacierSum / samples.length,

      averageMountainPressure: mountainSum / samples.length,
      averageCanyonPressure: canyonSum / samples.length,
      averageReliefHardness: reliefSum / samples.length,

      southPoleIceOnly: true,
      regionElevationOrdered: true,
      hydrologyMapActive: true,
      reliefRealismActive: true,
      activeHydrationOwnedHere: false,
      parentMustCompose: true,
      terrainChildOnly: true
    }),
    terrainChild: true,
    downstreamForParent: true,
    parentMustCompose: true,
    visualPassClaimed: false
  });
}

export function getTerrainSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTerrain(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTerrainStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    status: "active",
    id: "audralia-g1-terrain-relief-realism-strengthening-child",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,

    role: "terrain-relief-hydrology-map-child",
    terrainChild: true,
    downstreamForParent: true,

    majorLandBodyCount: TERRAIN_LAW.majorLandBodies,
    visibleTerrainSegments: TERRAIN_LAW.visibleTerrainSegments,
    southPole: TERRAIN_LAW.southPole,
    northPole: TERRAIN_LAW.northPole,
    miscellaneousTerritories: TERRAIN_LAW.miscellaneousTerritories,
    islandDensity: TERRAIN_LAW.islandDensity,

    regionCount: NINE_REGIONS.length,
    regionElevationLaw: "active",
    regionOrdering: TERRAIN_LAW.nineRegions,
    region1: "lowest_origin_tier",
    region9: "highest_convergence_tier",

    hydrologyMap: "active",
    hydrologyOwnership: "terrain_places_only",
    activeHydrationOwnedHere: false,
    hydrologyCorridorCount: HYDROLOGY_CORRIDORS.length,

    reliefRealism: "active",
    reliefRangeCount: RELIEF_RANGES.length,
    terrainRealismStrengthening: true,

    newOutputFields: Object.freeze([
      "watershedId",
      "watershedStrength",
      "riverbedPressure",
      "streamPressure",
      "lakeBasinPressure",
      "glacierSeatPressure",
      "valleyChannelPressure",
      "floodplainPressure",
      "deltaReceiverPressure",
      "snowpackSourcePressure",
      "hydrologyReadinessIndex",
      "mountainPressure",
      "mountainHardness",
      "canyonPressure",
      "riverIncisionPressure",
      "streamBranchPressure",
      "basinCutPressure",
      "reliefHardness"
    ]),

    majorLandBodies: MAJOR_LAND_BODIES,
    southPolarIce: SOUTH_POLAR_ICE,
    miscellaneousTerritoryClusters: MISC_TERRITORY_CLUSTERS,
    nineRegions: NINE_REGIONS,
    hydrologyCorridors: HYDROLOGY_CORRIDORS,
    reliefRanges: RELIEF_RANGES,

    exports: Object.freeze([
      "createTerrainProfile",
      "sampleTerrain",
      "buildTerrainField",
      "getTerrainSampleFromField",
      "getTerrainStatus"
    ]),

    ownsTerrain: true,
    ownsHydrologyPlaces: true,
    ownsActiveHydration: false,
    ownsFinalRender: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTerrainProfile,
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
});
