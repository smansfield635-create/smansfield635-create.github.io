// /assets/audralia/audralia.topology.render.js
// AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1
//
// Runtime compatibility preserved:
// AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1
//
// Role:
// - Audralia topology blueprint layer.
// - Owns the whole planet footprint before terrain.
// - Defines landmass versus void, above-water land footprint, sea-level boundary,
//   coastline, beaches, sand, rock, shelves, connected land systems,
//   intentional island separation, sub-sea depth, subterranean depth,
//   and terrain-rise permissions.
//
// Does not own:
// - above-sea elevation
// - mountains
// - ridges
// - canyons
// - valleys
// - terrain relief
// - active water
// - hydration
// - climate
// - ecology
// - foliage
// - trees
// - vegetation
// - fauna
// - runtime
// - route shell
// - final render
// - visual pass claim

const ACTIVE_CONTRACT = "AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1";
const RUNTIME_COMPATIBLE_RECEIPT = "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1";

const RECEIPT = ACTIVE_CONTRACT;

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1",
  "AUDRALIA_G2_TOPOLOGY_CHILD_FROM_CONFIRMED_TERRAIN_TNT_v1",
  "AUDRALIA_G2_TOPOLOGY_GEOLOGY_TERRAIN_ALIGNMENT_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TOPOLOGY_BLUEPRINT_CONNECTED_FOOTPRINT";
const FILE = "/assets/audralia/audralia.topology.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_HANDOFF_TARGET = "/assets/audralia/audralia.terrain.render.js";

const TOPOLOGY_LAW = Object.freeze({
  parentRole: "globe-body-baseline-only",
  topologyRole: "planet-blueprint-land-void-sealevel-connected-footprint-subterranean-authority",
  terrainRoleLater: "above-sea-elevation-and-relief-authority",
  hydrationRoleLater: "water-fill-and-water-behavior-authority",

  ownsTopologyBlueprint: true,
  ownsLandVoidFootprint: true,
  ownsAboveWaterLandFootprint: true,
  ownsSeaLevelBoundary: true,
  ownsBeachSandRockBoundary: true,
  ownsCoastlineIrregularity: true,
  ownsLandBodyConnections: true,
  ownsIslandSeparation: true,
  ownsSubSeaDepthBlueprint: true,
  ownsSubterraneanBlueprint: true,
  ownsTerrainRisePermissions: true,

  ownsAboveSeaElevation: false,
  ownsTerrainRelief: false,
  ownsMountains: false,
  ownsRidges: false,
  ownsCanyons: false,
  ownsValleys: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsFauna: false,
  ownsRuntime: false,
  ownsFinalRender: false,
  visualPassClaimed: false,

  noFoliageLaw: "active",
  noTreesLaw: "active",
  noVegetationLaw: "active",
  noActiveWaterLaw: "active",

  landBodyCount: 6,
  surfaceClassCount: 16,
  connectionCount: 7,
  terrainMayConsume: true,
  hydrationMayConsumeLater: true,
  foliageMayConsume: false,
  ecologyMayConsume: false
});

const SURFACE_CLASSES = Object.freeze([
  Object.freeze({ id: 0, key: "void_deep_ocean", name: "Void Deep Ocean", role: "ocean/void footprint" }),
  Object.freeze({ id: 1, key: "void_abyssal_basin", name: "Void Abyssal Basin", role: "deep basin floor for later water depth" }),
  Object.freeze({ id: 2, key: "void_trench_axis", name: "Void Trench Axis", role: "narrow sub-sea trench axis" }),
  Object.freeze({ id: 3, key: "void_mid_ocean", name: "Void Mid Ocean", role: "standard underwater void field" }),
  Object.freeze({ id: 4, key: "void_continental_shelf", name: "Void Continental Shelf", role: "shallow shelf near landmass" }),
  Object.freeze({ id: 5, key: "coastal_wet_edge", name: "Coastal Wet Edge", role: "sea-level transition edge" }),
  Object.freeze({ id: 6, key: "beach_sand_band", name: "Beach Sand Band", role: "beach and sand placement" }),
  Object.freeze({ id: 7, key: "coastal_rock_band", name: "Coastal Rock Band", role: "rock, cliff, and hard coastline placement" }),
  Object.freeze({ id: 8, key: "low_land_footprint", name: "Low Land Footprint", role: "land exists; terrain later determines height" }),
  Object.freeze({ id: 9, key: "main_landmass_footprint", name: "Main Landmass Footprint", role: "primary stable land body" }),
  Object.freeze({ id: 10, key: "island_footprint", name: "Island Footprint", role: "intentional geological island footprint; not foliage" }),
  Object.freeze({ id: 11, key: "polar_land_footprint", name: "Polar Land Footprint", role: "north polar land footprint" }),
  Object.freeze({ id: 12, key: "polar_ice_footprint", name: "Polar Ice Footprint", role: "south pole ice-only footprint" }),
  Object.freeze({ id: 13, key: "subterranean_rock_mass", name: "Subterranean Rock Mass", role: "underground rock body and foundation" }),
  Object.freeze({ id: 14, key: "subterranean_cavity_permission", name: "Subterranean Cavity Permission", role: "possible underground void/cavity field" }),
  Object.freeze({ id: 15, key: "terrain_rise_seed", name: "Terrain Rise Seed", role: "topology permits terrain to rise later" })
]);

const LAND_BODIES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "dominant_mainland_footprint",
    name: "Dominant Mainland Footprint",
    role: "largest connected primary landmass footprint",
    centerLon: -0.08,
    centerLat: 0.00,
    radiusLon: 0.42,
    radiusLat: 0.25,
    angle: -13,
    coastlineRoughness: 0.26,
    rockBias: 0.46,
    sandBias: 0.34,
    terrainRiseBias: 0.84
  }),
  Object.freeze({
    id: 2,
    key: "western_weathered_body_footprint",
    name: "Western Weathered Body Footprint",
    role: "western landmass connected by eroded neck and shelf",
    centerLon: -0.62,
    centerLat: -0.02,
    radiusLon: 0.25,
    radiusLat: 0.19,
    angle: 22,
    coastlineRoughness: 0.34,
    rockBias: 0.64,
    sandBias: 0.20,
    terrainRiseBias: 0.72
  }),
  Object.freeze({
    id: 3,
    key: "eastern_shelf_body_footprint",
    name: "Eastern Shelf Body Footprint",
    role: "eastern shelf-facing landmass connected by shallow exposed bridge",
    centerLon: 0.56,
    centerLat: 0.03,
    radiusLon: 0.26,
    radiusLat: 0.20,
    angle: -25,
    coastlineRoughness: 0.24,
    rockBias: 0.36,
    sandBias: 0.48,
    terrainRiseBias: 0.68
  }),
  Object.freeze({
    id: 4,
    key: "southern_archipelago_footprint",
    name: "Southern Archipelago Footprint",
    role: "southern broken land system with partial shelf connections",
    centerLon: 0.12,
    centerLat: -0.45,
    radiusLon: 0.36,
    radiusLat: 0.15,
    angle: 9,
    coastlineRoughness: 0.38,
    rockBias: 0.56,
    sandBias: 0.26,
    terrainRiseBias: 0.58
  }),
  Object.freeze({
    id: 5,
    key: "north_polar_land_footprint",
    name: "North Polar Land Footprint",
    role: "northern polar land footprint with irregular mineral edge",
    centerLon: 0.02,
    centerLat: 0.82,
    radiusLon: 0.45,
    radiusLat: 0.13,
    angle: 0,
    coastlineRoughness: 0.24,
    rockBias: 0.72,
    sandBias: 0.08,
    terrainRiseBias: 0.76
  }),
  Object.freeze({
    id: 6,
    key: "south_polar_ice_footprint",
    name: "South Polar Ice Footprint",
    role: "ice-only southern polar footprint",
    centerLon: 0.0,
    centerLat: -0.88,
    radiusLon: 1.0,
    radiusLat: 0.16,
    angle: 0,
    coastlineRoughness: 0.08,
    rockBias: 0.00,
    sandBias: 0.00,
    terrainRiseBias: 0.00
  })
]);

const LAND_CONNECTIONS = Object.freeze([
  Object.freeze({
    id: "western_isthmus_neck",
    from: 1,
    to: 2,
    role: "connects dominant mainland to western weathered body",
    width: 0.082,
    pressure: 0.74,
    sandBias: 0.30,
    rockBias: 0.52
  }),
  Object.freeze({
    id: "eastern_shelf_bridge",
    from: 1,
    to: 3,
    role: "connects dominant mainland to eastern shelf body",
    width: 0.076,
    pressure: 0.68,
    sandBias: 0.48,
    rockBias: 0.34
  }),
  Object.freeze({
    id: "southern_low_neck",
    from: 1,
    to: 4,
    role: "partial low land neck toward southern archipelago",
    width: 0.060,
    pressure: 0.58,
    sandBias: 0.36,
    rockBias: 0.42
  }),
  Object.freeze({
    id: "southern_shelf_chain",
    from: 3,
    to: 4,
    role: "shelf and exposed rock chain between eastern shelf body and southern archipelago",
    width: 0.044,
    pressure: 0.46,
    sandBias: 0.32,
    rockBias: 0.56
  }),
  Object.freeze({
    id: "northern_mineral_shelf",
    from: 1,
    to: 5,
    role: "subpolar shelf connection that does not fully erase the northern sea boundary",
    width: 0.050,
    pressure: 0.44,
    sandBias: 0.08,
    rockBias: 0.70
  }),
  Object.freeze({
    id: "western_frontier_hook",
    from: 2,
    to: 5,
    role: "distant western hook creating irregular northern coastline pressure",
    width: 0.036,
    pressure: 0.32,
    sandBias: 0.10,
    rockBias: 0.72
  }),
  Object.freeze({
    id: "central_low_saddle",
    from: 2,
    to: 3,
    role: "central low saddle that reduces bead separation",
    width: 0.052,
    pressure: 0.50,
    sandBias: 0.34,
    rockBias: 0.44
  })
]);

const PENINSULA_SEEDS = Object.freeze([
  Object.freeze({ id: "northwest_hook", bodyId: 1, lon: -0.36, lat: 0.18, radiusLon: 0.16, radiusLat: 0.055, angle: -24, pressure: 0.34 }),
  Object.freeze({ id: "eastern_spur", bodyId: 1, lon: 0.20, lat: -0.08, radiusLon: 0.18, radiusLat: 0.050, angle: 12, pressure: 0.32 }),
  Object.freeze({ id: "western_cove_split", bodyId: 2, lon: -0.78, lat: 0.08, radiusLon: 0.10, radiusLat: 0.052, angle: 42, pressure: 0.30 }),
  Object.freeze({ id: "southern_tail", bodyId: 4, lon: -0.06, lat: -0.54, radiusLon: 0.20, radiusLat: 0.045, angle: -8, pressure: 0.32 }),
  Object.freeze({ id: "eastern_shelf_arm", bodyId: 3, lon: 0.42, lat: -0.12, radiusLon: 0.14, radiusLat: 0.052, angle: -36, pressure: 0.28 }),
  Object.freeze({ id: "polar_rock_lip", bodyId: 5, lon: -0.20, lat: 0.74, radiusLon: 0.18, radiusLat: 0.038, angle: 0, pressure: 0.24 })
]);

const BAY_CUTS = Object.freeze([
  Object.freeze({ id: "dominant_north_bay", lon: -0.08, lat: 0.20, radiusLon: 0.14, radiusLat: 0.070, cut: 0.26 }),
  Object.freeze({ id: "dominant_south_bay", lon: -0.02, lat: -0.19, radiusLon: 0.17, radiusLat: 0.075, cut: 0.24 }),
  Object.freeze({ id: "western_inner_cove", lon: -0.52, lat: -0.08, radiusLon: 0.10, radiusLat: 0.060, cut: 0.22 }),
  Object.freeze({ id: "eastern_shelf_bay", lon: 0.50, lat: 0.16, radiusLon: 0.10, radiusLat: 0.060, cut: 0.20 }),
  Object.freeze({ id: "southern_archipelago_bite", lon: 0.18, lat: -0.38, radiusLon: 0.16, radiusLat: 0.050, cut: 0.22 }),
  Object.freeze({ id: "polar_north_bay", lon: 0.24, lat: 0.77, radiusLon: 0.16, radiusLat: 0.050, cut: 0.18 })
]);

const ISLAND_FOOTPRINT_ARCS = Object.freeze([
  Object.freeze({
    id: "origin_shelf_rocks",
    landBodyId: 1,
    centerLon: -0.40,
    centerLat: -0.07,
    count: 4,
    spreadLon: 0.15,
    spreadLat: 0.045,
    radius: 0.028,
    sandBias: 0.46,
    rockBias: 0.44,
    intentionalSeparation: true
  }),
  Object.freeze({
    id: "southern_hard_islets",
    landBodyId: 4,
    centerLon: 0.22,
    centerLat: -0.49,
    count: 5,
    spreadLon: 0.20,
    spreadLat: 0.055,
    radius: 0.024,
    sandBias: 0.20,
    rockBias: 0.64,
    intentionalSeparation: true
  }),
  Object.freeze({
    id: "mineral_crown_outcrops",
    landBodyId: 5,
    centerLon: 0.08,
    centerLat: 0.56,
    count: 3,
    spreadLon: 0.12,
    spreadLat: 0.040,
    radius: 0.025,
    sandBias: 0.08,
    rockBias: 0.76,
    intentionalSeparation: true
  })
]);

const OCEAN_TRENCHES = Object.freeze([
  Object.freeze({ id: "western_deep_trench", centerLon: -0.84, centerLat: -0.30, radiusLon: 0.18, radiusLat: 0.42, depth: 0.92 }),
  Object.freeze({ id: "eastern_outer_basin", centerLon: 0.80, centerLat: 0.26, radiusLon: 0.20, radiusLat: 0.36, depth: 0.78 }),
  Object.freeze({ id: "southern_cold_basin", centerLon: 0.04, centerLat: -0.72, radiusLon: 0.72, radiusLat: 0.18, depth: 0.70 }),
  Object.freeze({ id: "north_polar_subsea_bowl", centerLon: -0.12, centerLat: 0.72, radiusLon: 0.56, radiusLat: 0.17, depth: 0.54 })
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
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
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

  return total / Math.max(0.00001, normalizer);
}

function wrapLonDistance(a, b) {
  let d = a - b;
  while (d > 1) d -= 2;
  while (d < -1) d += 2;
  return d;
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

function gaussian(dx, dy, sx, sy, power = 1) {
  return Math.exp(-((dx * dx) / Math.max(0.000001, sx * sx) + (dy * dy) / Math.max(0.000001, sy * sy)) * power);
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
  return Object.freeze({
    blueprintResolution: clamp(Number.isFinite(Number(context.blueprintResolution)) ? Number(context.blueprintResolution) : 0.88, 0, 1),
    coastlineComplexity: clamp(Number.isFinite(Number(context.coastlineComplexity)) ? Number(context.coastlineComplexity) : 0.86, 0, 1),
    connectionStrength: clamp(Number.isFinite(Number(context.connectionStrength)) ? Number(context.connectionStrength) : 0.82, 0, 1),
    subterraneanPressure: clamp(Number.isFinite(Number(context.subterraneanPressure)) ? Number(context.subterraneanPressure) : 0.72, 0, 1)
  });
}

function bodyById(id) {
  return LAND_BODIES.find((body) => body.id === id) || null;
}

function landBodyInfluence(lon, lat, body, context) {
  const dx = wrapLonDistance(lon, body.centerLon);
  const dy = lat - body.centerLat;
  const rotated = rotatePoint(dx, dy, body.angle);

  const primary = gaussian(rotated.x, rotated.y, body.radiusLon, body.radiusLat, 1.04);

  const shoulderA =
    gaussian(
      rotated.x - body.radiusLon * 0.38,
      rotated.y + body.radiusLat * 0.20,
      body.radiusLon * 0.48,
      body.radiusLat * 0.40,
      1.12
    ) * 0.40;

  const shoulderB =
    gaussian(
      rotated.x + body.radiusLon * 0.42,
      rotated.y - body.radiusLat * 0.24,
      body.radiusLon * 0.44,
      body.radiusLat * 0.36,
      1.14
    ) * 0.34;

  const roughness =
    (fbm(lon * 9.4 + body.id * 2.1, lat * 9.4 - body.id * 1.7, 100 + body.id, 5) - 0.5) *
    body.coastlineRoughness *
    context.coastlineComplexity;

  const fracture =
    (fbm(lon * 21.0 - body.id * 0.7, lat * 21.0 + body.id * 1.1, 170 + body.id, 3) - 0.5) *
    0.10;

  const shape = Math.max(primary, shoulderA, shoulderB);
  const edge = smoothstep(0.20, 0.78, shape);

  let bayCut = 0;
  for (const bay of BAY_CUTS) {
    const bdx = wrapLonDistance(lon, bay.lon);
    const bdy = lat - bay.lat;
    bayCut = Math.max(bayCut, gaussian(bdx, bdy, bay.radiusLon, bay.radiusLat, 1.12) * bay.cut);
  }

  let peninsulaAdd = 0;
  for (const seed of PENINSULA_SEEDS) {
    if (seed.bodyId !== body.id) continue;
    const pdx = wrapLonDistance(lon, seed.lon);
    const pdy = lat - seed.lat;
    const pRot = rotatePoint(pdx, pdy, seed.angle);
    peninsulaAdd = Math.max(
      peninsulaAdd,
      gaussian(pRot.x, pRot.y, seed.radiusLon, seed.radiusLat, 1.10) * seed.pressure
    );
  }

  const pressure = shape + roughness * edge + fracture * edge + peninsulaAdd - bayCut * edge;

  return clamp(pressure, 0, 1.45);
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

function connectionInfluence(lon, lat, connection, context) {
  const from = bodyById(connection.from);
  const to = bodyById(connection.to);

  if (!from || !to) {
    return Object.freeze({
      pressure: 0,
      t: 0,
      distance: Infinity,
      connection
    });
  }

  const line = distanceToSegment(lon, lat, from.centerLon, from.centerLat, to.centerLon, to.centerLat);
  const wave = 0.70 + fbm(lon * 8.0 + connection.from, lat * 8.0 - connection.to, 321 + connection.from * 7 + connection.to, 4) * 0.30;
  const neck = smoothstep(connection.width, 0.004, line.distance) * connection.pressure * context.connectionStrength * wave;

  return Object.freeze({
    pressure: clamp(neck, 0, 1),
    t: line.t,
    distance: line.distance,
    connection
  });
}

function islandPoint(arc, index) {
  const step = index - (arc.count - 1) / 2;
  const curve = Math.sin(index * 1.38) * arc.spreadLat * 0.24;

  return Object.freeze({
    lon: arc.centerLon + step * (arc.spreadLon / Math.max(1, arc.count - 1)) + Math.sin(index * 1.91) * 0.018,
    lat: arc.centerLat + curve + Math.cos(index * 1.17) * arc.spreadLat * 0.16,
    radius: arc.radius * (0.78 + (index % 3) * 0.10)
  });
}

function islandInfluence(lon, lat, arc) {
  let strength = 0;

  for (let i = 0; i < arc.count; i += 1) {
    const point = islandPoint(arc, i);
    const dx = wrapLonDistance(lon, point.lon);
    const dy = lat - point.lat;
    const local = gaussian(dx, dy, point.radius, point.radius * 0.62, 1.22);
    strength = Math.max(strength, local);
  }

  return clamp(strength, 0, 1);
}

function computeFootprint(lon, lat, context) {
  let bestBody = null;
  let bestBodyPressure = 0;

  for (const body of LAND_BODIES) {
    const pressure = landBodyInfluence(lon, lat, body, context);

    if (pressure > bestBodyPressure) {
      bestBody = body;
      bestBodyPressure = pressure;
    }
  }

  let bestConnection = null;
  let bestConnectionPressure = 0;
  let bestConnectionDistance = Infinity;

  for (const connection of LAND_CONNECTIONS) {
    const influence = connectionInfluence(lon, lat, connection, context);

    if (influence.pressure > bestConnectionPressure) {
      bestConnection = influence.connection;
      bestConnectionPressure = influence.pressure;
      bestConnectionDistance = influence.distance;
    }
  }

  let bestIslandArc = null;
  let bestIslandPressure = 0;

  for (const arc of ISLAND_FOOTPRINT_ARCS) {
    const pressure = islandInfluence(lon, lat, arc);

    if (pressure > bestIslandPressure) {
      bestIslandArc = arc;
      bestIslandPressure = pressure;
    }
  }

  const southPolarBody = bodyById(6);
  const southPolarPressure = southPolarBody ? landBodyInfluence(lon, lat, southPolarBody, context) : 0;
  const southPolarBand = smoothstep(0.70, 0.94, -lat);
  const southPolarIcePressure = clamp(Math.max(southPolarPressure, southPolarBand), 0, 1);

  if (southPolarIcePressure > 0.52 && southPolarIcePressure >= bestBodyPressure) {
    bestBody = southPolarBody;
    bestBodyPressure = southPolarIcePressure;
  }

  const connectedFootprintPressure = clamp(bestConnectionPressure, 0, 1);
  const mainPressure = clamp(Math.max(bestBodyPressure, connectedFootprintPressure), 0, 1.45);
  const landPressure = clamp(Math.max(mainPressure, bestIslandPressure * 0.98), 0, 1.45);

  const seaLevelThreshold = 0.50;
  const isSouthPolarIceFootprint = Boolean(bestBody && bestBody.id === 6 && southPolarIcePressure > 0.52);
  const isIslandFootprint = Boolean(
    bestIslandArc &&
      bestIslandPressure >= Math.max(0.56, mainPressure * 1.04)
  );

  const isConnectedLandSystem = Boolean(
    bestConnection &&
      connectedFootprintPressure >= 0.28 &&
      connectedFootprintPressure >= bestIslandPressure * 0.72
  );

  const isLandFootprint = landPressure >= seaLevelThreshold || isSouthPolarIceFootprint;
  const isVoidFootprint = !isLandFootprint;

  const connectionFromBody = bestConnection ? bodyById(bestConnection.from) : null;
  const islandBody = bestIslandArc ? bodyById(bestIslandArc.landBodyId) : null;

  const landBody = isSouthPolarIceFootprint
    ? southPolarBody
    : isIslandFootprint
      ? islandBody || bestBody
      : isConnectedLandSystem && connectionFromBody
        ? connectionFromBody
        : bestBody;

  return Object.freeze({
    bestBody,
    landBody,
    bestConnection,
    bestIslandArc,

    landPressure,
    bestBodyPressure,
    connectedFootprintPressure,
    bestConnectionPressure,
    bestConnectionDistance,
    bestIslandPressure,

    seaLevelThreshold,
    seaLevelBoundary: landPressure - seaLevelThreshold,
    seaLevelDistance: Math.abs(landPressure - seaLevelThreshold),

    isLandFootprint,
    isVoidFootprint,
    isIslandFootprint,
    isConnectedLandSystem,
    isSouthPolarIceFootprint,
    isNorthPolarLandFootprint: Boolean(landBody && landBody.id === 5 && isLandFootprint),
    isPolarFootprint: Boolean((landBody && landBody.id === 5) || isSouthPolarIceFootprint)
  });
}

function computeCoastalBlueprint(lon, lat, footprint, context) {
  const boundaryBand = clamp(1 - footprint.seaLevelDistance / 0.14, 0, 1);
  const fine = fbm(lon * 17.0 - 2.4, lat * 17.0 + 3.8, 501, 4);
  const coarse = fbm(lon * 5.2 + 1.1, lat * 5.2 - 0.7, 503, 4);

  const body = footprint.landBody || LAND_BODIES[0];
  const connection = footprint.bestConnection;
  const island = footprint.bestIslandArc;

  const connectionRockBias = connection ? connection.rockBias : 0;
  const connectionSandBias = connection ? connection.sandBias : 0;
  const islandRockBias = island ? island.rockBias : 0;
  const islandSandBias = island ? island.sandBias : 0;

  const isCoastline = boundaryBand > 0.12;

  const rockBase = clamp(
    body.rockBias * 0.78 +
      connectionRockBias * 0.18 +
      islandRockBias * 0.18 +
      (coarse - 0.5) * 0.26 +
      context.coastlineComplexity * 0.10,
    0,
    1
  );

  const sandBase = clamp(
    body.sandBias * 0.78 +
      connectionSandBias * 0.18 +
      islandSandBias * 0.18 +
      (0.5 - coarse) * 0.20,
    0,
    1
  );

  const coastlineIrregularityIndex = clamp(
    Math.abs(fine - 0.5) * 1.10 +
      body.coastlineRoughness * 0.54 +
      (footprint.isConnectedLandSystem ? 0.12 : 0) +
      (footprint.isIslandFootprint ? 0.08 : 0),
    0,
    1
  );

  const shorelinePressure = boundaryBand;
  const beachPressure = clamp(boundaryBand * (0.50 + sandBase * 0.44) * (1 - footprint.isSouthPolarIceFootprint), 0, 1);
  const sandPressure = clamp(beachPressure * (0.52 + sandBase * 0.42) * (1 - rockBase * 0.25), 0, 1);
  const rockPressure = clamp(boundaryBand * (0.42 + rockBase * 0.54) + fine * 0.07, 0, 1);
  const coastalCliffPressure = clamp(rockPressure * (1 - sandPressure * 0.40) * (0.42 + body.coastlineRoughness), 0, 1);

  const wetEdgePermission = clamp(boundaryBand * (footprint.isVoidFootprint ? 0.86 : 0.36), 0, 1);
  const dryEdgePermission = clamp(boundaryBand * (footprint.isLandFootprint ? 0.86 : 0.32), 0, 1);
  const reefShelfPermission = clamp(boundaryBand * (1 - rockPressure * 0.48) * (footprint.isVoidFootprint ? 0.82 : 0.34), 0, 1);

  const bayPermission = clamp(boundaryBand * coastlineIrregularityIndex * (footprint.isLandFootprint ? 0.42 : 0.62), 0, 1);
  const inletPermission = clamp(boundaryBand * coastlineIrregularityIndex * (footprint.isVoidFootprint ? 0.64 : 0.36), 0, 1);
  const peninsulaPermission = clamp(
    footprint.isLandFootprint *
      (footprint.isConnectedLandSystem ? 0.46 : 0.22) +
      coastlineIrregularityIndex * 0.22,
    0,
    1
  );

  const isthmusPermission = clamp(
    footprint.isConnectedLandSystem ? 0.42 + footprint.connectedFootprintPressure * 0.46 : 0,
    0,
    1
  );

  return Object.freeze({
    isCoastline,
    isBeach: beachPressure > 0.42,
    isSand: sandPressure > 0.38,
    isRock: rockPressure > 0.44,
    isShelf: footprint.isVoidFootprint && boundaryBand > 0.18,

    shorelinePressure,
    beachPressure,
    sandPressure,
    rockPressure,
    coastalCliffPressure,
    wetEdgePermission,
    dryEdgePermission,
    reefShelfPermission,

    coastlineIrregularityIndex,
    bayPermission,
    inletPermission,
    peninsulaPermission,
    isthmusPermission
  });
}

function computeSubSeaBlueprint(lon, lat, footprint, coastal) {
  let trenchDepthIndex = 0;
  let trenchAxisId = "none";

  for (const trench of OCEAN_TRENCHES) {
    const dx = wrapLonDistance(lon, trench.centerLon);
    const dy = lat - trench.centerLat;
    const local = gaussian(dx, dy, trench.radiusLon, trench.radiusLat, 1.08) * trench.depth;

    if (local > trenchDepthIndex) {
      trenchDepthIndex = local;
      trenchAxisId = trench.id;
    }
  }

  const shelfDepthIndex = clamp(coastal.reefShelfPermission * 0.30 + coastal.shorelinePressure * 0.18, 0, 1);
  const openVoid = footprint.isVoidFootprint ? clamp(1 - coastal.shorelinePressure * 0.82, 0, 1) : 0;
  const basinNoise = fbm(lon * 3.2 + 9.1, lat * 3.2 - 4.2, 710, 4);
  const basinDepthIndex = clamp(openVoid * (0.38 + basinNoise * 0.38) + trenchDepthIndex * 0.34, 0, 1);

  const oceanDepthIndex = footprint.isVoidFootprint
    ? clamp(shelfDepthIndex * 0.25 + basinDepthIndex * 0.52 + trenchDepthIndex * 0.44, 0, 1)
    : 0;

  const seaFloorShapeIndex = clamp(
    oceanDepthIndex * 0.46 +
      basinDepthIndex * 0.24 +
      trenchDepthIndex * 0.22 +
      fbm(lon * 11.0, lat * 11.0, 717, 3) * 0.08,
    0,
    1
  );

  const subSeaBoundaryPressure = clamp(coastal.shorelinePressure * 0.34 + oceanDepthIndex * 0.26 + trenchDepthIndex * 0.30, 0, 1);
  const abyssalPermission = clamp(smoothstep(0.72, 0.96, oceanDepthIndex) + trenchDepthIndex * 0.42, 0, 1);

  let oceanDepthClass = "land";
  if (footprint.isVoidFootprint) {
    if (trenchDepthIndex > 0.66) oceanDepthClass = "trench";
    else if (oceanDepthIndex > 0.82) oceanDepthClass = "abyssal_basin";
    else if (oceanDepthIndex > 0.64) oceanDepthClass = "deep_ocean";
    else if (oceanDepthIndex > 0.42) oceanDepthClass = "mid_ocean";
    else if (shelfDepthIndex > 0.14) oceanDepthClass = "continental_shelf";
    else oceanDepthClass = "shallow_void";
  }

  return Object.freeze({
    isSubSea: footprint.isVoidFootprint,
    oceanDepthClass,
    oceanDepthIndex,
    shelfDepthIndex,
    basinDepthIndex,
    trenchDepthIndex,
    seaFloorShapeIndex,
    bathymetryBlueprintIndex: clamp(oceanDepthIndex * 0.48 + seaFloorShapeIndex * 0.34 + trenchDepthIndex * 0.18, 0, 1),
    subSeaBoundaryPressure,
    abyssalPermission,
    trenchAxisId
  });
}

function computeSubterraneanBlueprint(lon, lat, footprint, coastal, subsea, context) {
  const foundationNoise = fbm(lon * 4.7 - 2.1, lat * 4.7 + 1.6, 901, 5);
  const cavityNoise = fbm(lon * 13.0 + 5.5, lat * 13.0 - 7.2, 909, 4);
  const boundaryNoise = fbm(lon * 8.0 - 1.2, lat * 8.0 + 4.6, 913, 4);

  const underLandDepthIndex = footprint.isLandFootprint
    ? clamp(0.30 + footprint.landPressure * 0.24 + foundationNoise * 0.24, 0, 1)
    : 0;

  const underCoastDepthIndex = clamp(coastal.shorelinePressure * (0.26 + boundaryNoise * 0.24), 0, 1);
  const underShelfDepthIndex = clamp(coastal.reefShelfPermission * 0.34 + subsea.shelfDepthIndex * 0.42, 0, 1);
  const underBasinDepthIndex = clamp(subsea.basinDepthIndex * 0.38 + subsea.trenchDepthIndex * 0.36, 0, 1);

  const foundationDensityIndex = clamp(
    underLandDepthIndex * 0.40 +
      underCoastDepthIndex * 0.18 +
      underShelfDepthIndex * 0.16 +
      underBasinDepthIndex * 0.20 +
      context.subterraneanPressure * 0.12,
    0,
    1
  );

  const rockMassBoundaryIndex = clamp(
    foundationDensityIndex * 0.48 +
      coastal.rockPressure * 0.20 +
      boundaryNoise * 0.20 +
      (footprint.isSouthPolarIceFootprint ? 0.10 : 0),
    0,
    1
  );

  const cavityPermission = clamp(
    (cavityNoise - 0.56) * 1.6 +
      underLandDepthIndex * 0.16 +
      underBasinDepthIndex * 0.24 -
      coastal.shorelinePressure * 0.14,
    0,
    1
  );

  const subterraneanDepthIndex = clamp(
    underLandDepthIndex * 0.28 +
      underCoastDepthIndex * 0.16 +
      underShelfDepthIndex * 0.18 +
      underBasinDepthIndex * 0.24 +
      rockMassBoundaryIndex * 0.14,
    0,
    1
  );

  const undergroundBoundaryPressure = clamp(
    rockMassBoundaryIndex * 0.52 +
      cavityPermission * 0.22 +
      foundationDensityIndex * 0.26,
    0,
    1
  );

  let subsurfacePressureZone = "none";
  if (undergroundBoundaryPressure > 0.72) subsurfacePressureZone = "hard_boundary";
  else if (cavityPermission > 0.54) subsurfacePressureZone = "cavity_permission";
  else if (foundationDensityIndex > 0.54) subsurfacePressureZone = "foundation_rock_mass";
  else if (underCoastDepthIndex > 0.28) subsurfacePressureZone = "coastal_transition";
  else if (underBasinDepthIndex > 0.34) subsurfacePressureZone = "basin_pressure_zone";
  else if (subterraneanDepthIndex > 0.18) subsurfacePressureZone = "shallow_foundation";

  return Object.freeze({
    isSubterranean: true,
    subterraneanDepthIndex,
    underLandDepthIndex,
    underCoastDepthIndex,
    underShelfDepthIndex,
    underBasinDepthIndex,
    foundationDensityIndex,
    rockMassBoundaryIndex,
    cavityPermission,
    subsurfacePressureZone,
    undergroundBoundaryPressure
  });
}

function computeTerrainPermission(footprint, coastal, subsea, subterranean) {
  const terrainRisePermission = footprint.isLandFootprint && !footprint.isSouthPolarIceFootprint
    ? clamp(
        0.44 +
          footprint.landPressure * 0.34 +
          coastal.dryEdgePermission * 0.16 +
          footprint.connectedFootprintPressure * 0.12,
        0,
        1
      )
    : 0;

  const terrainHoldPermission = footprint.isLandFootprint
    ? clamp(0.36 + coastal.dryEdgePermission * 0.22 + subterranean.foundationDensityIndex * 0.28, 0, 1)
    : 0;

  const terrainBlockPermission = footprint.isVoidFootprint
    ? clamp(0.56 + subsea.oceanDepthIndex * 0.30 + subsea.trenchDepthIndex * 0.20, 0, 1)
    : footprint.isSouthPolarIceFootprint
      ? 0.64
      : 0;

  const coastalRisePermission = clamp(coastal.dryEdgePermission * (footprint.isLandFootprint ? 0.82 : 0.18), 0, 1);
  const islandRisePermission = footprint.isIslandFootprint ? clamp(0.44 + terrainRisePermission * 0.44, 0, 1) : 0;
  const polarRisePermission = footprint.isNorthPolarLandFootprint ? clamp(0.40 + terrainRisePermission * 0.36, 0, 1) : 0;

  const basinDepressionPermission = clamp(
    subsea.basinDepthIndex * 0.42 +
      subsea.trenchDepthIndex * 0.30 +
      subterranean.underBasinDepthIndex * 0.24,
    0,
    1
  );

  const cliffRisePermission = clamp(
    coastal.coastalCliffPressure * 0.58 +
      coastal.rockPressure * 0.28 +
      subterranean.rockMassBoundaryIndex * 0.14,
    0,
    1
  );

  const rockExposurePermission = clamp(
    coastal.rockPressure * 0.38 +
      subterranean.rockMassBoundaryIndex * 0.36 +
      terrainRisePermission * 0.16,
    0,
    1
  );

  let terrainSeedClass = "none";
  if (footprint.isSouthPolarIceFootprint) terrainSeedClass = "polar_ice_footprint";
  else if (footprint.isNorthPolarLandFootprint) terrainSeedClass = "polar_land_rise_seed";
  else if (footprint.isConnectedLandSystem) terrainSeedClass = "connected_landmass_rise_seed";
  else if (footprint.isIslandFootprint) terrainSeedClass = "intentional_island_rise_seed";
  else if (cliffRisePermission > 0.52) terrainSeedClass = "rock_cliff_rise_seed";
  else if (coastal.beachPressure > 0.45) terrainSeedClass = "beach_low_rise_seed";
  else if (terrainRisePermission > 0.42) terrainSeedClass = "landmass_rise_seed";
  else if (basinDepressionPermission > 0.42) terrainSeedClass = "basin_depression_seed";
  else if (footprint.isVoidFootprint) terrainSeedClass = "void_no_rise";

  return Object.freeze({
    terrainRisePermission,
    terrainHoldPermission,
    terrainBlockPermission,
    coastalRisePermission,
    islandRisePermission,
    polarRisePermission,
    basinDepressionPermission,
    cliffRisePermission,
    rockExposurePermission,
    terrainSeedClass
  });
}

function determineSurfaceClass(footprint, coastal, subsea, subterranean, permission) {
  if (footprint.isSouthPolarIceFootprint) return SURFACE_CLASSES[12];

  if (footprint.isVoidFootprint) {
    if (subsea.trenchDepthIndex > 0.64) return SURFACE_CLASSES[2];
    if (subsea.abyssalPermission > 0.62) return SURFACE_CLASSES[1];
    if (coastal.isShelf) return SURFACE_CLASSES[4];
    if (subsea.oceanDepthIndex > 0.54) return SURFACE_CLASSES[0];
    return SURFACE_CLASSES[3];
  }

  if (coastal.isCoastline && coastal.wetEdgePermission > 0.58) return SURFACE_CLASSES[5];
  if (coastal.isBeach && coastal.sandPressure >= coastal.rockPressure) return SURFACE_CLASSES[6];
  if (coastal.isRock || coastal.coastalCliffPressure > 0.50) return SURFACE_CLASSES[7];
  if (footprint.isNorthPolarLandFootprint) return SURFACE_CLASSES[11];
  if (footprint.isIslandFootprint) return SURFACE_CLASSES[10];
  if (permission.terrainRisePermission > 0.72) return SURFACE_CLASSES[15];
  if (footprint.landPressure > 0.78) return SURFACE_CLASSES[9];
  if (subterranean.cavityPermission > 0.62) return SURFACE_CLASSES[14];
  if (subterranean.rockMassBoundaryIndex > 0.62) return SURFACE_CLASSES[13];
  return SURFACE_CLASSES[8];
}

export function createTopologyProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,
    role: "connected-landfootprint-and-irregular-coast-blueprint-child",

    topologyBlueprint: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,

    ownsTopologyBlueprint: true,
    ownsLandVoidFootprint: true,
    ownsAboveWaterLandFootprint: true,
    ownsSeaLevelBoundary: true,
    ownsBeachSandRockBoundary: true,
    ownsCoastlineIrregularity: true,
    ownsLandBodyConnections: true,
    ownsIslandSeparation: true,
    ownsSubSeaDepthBlueprint: true,
    ownsSubterraneanBlueprint: true,
    ownsTerrainRisePermissions: true,

    ownsAboveSeaElevation: false,
    ownsTerrainRelief: false,
    ownsMountains: false,
    ownsRidges: false,
    ownsCanyons: false,
    ownsValleys: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,
    visualPassClaimed: false,

    noFoliageLaw: true,
    noTreesLaw: true,
    noVegetationLaw: true,
    noActiveWaterLaw: true,

    topologyLaw: TOPOLOGY_LAW,
    surfaceClasses: SURFACE_CLASSES,
    landBodies: LAND_BODIES,
    landConnections: LAND_CONNECTIONS,
    peninsulaSeeds: PENINSULA_SEEDS,
    bayCuts: BAY_CUTS,
    islandFootprintArcs: ISLAND_FOOTPRINT_ARCS,
    oceanTrenches: OCEAN_TRENCHES,

    terrainMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    ...overrides
  });
}

export function sampleTopology(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const topologyContext = getInputContext(context);

  const footprint = computeFootprint(point.lon, point.lat, topologyContext);
  const coastal = computeCoastalBlueprint(point.lon, point.lat, footprint, topologyContext);
  const subsea = computeSubSeaBlueprint(point.lon, point.lat, footprint, coastal);
  const subterranean = computeSubterraneanBlueprint(point.lon, point.lat, footprint, coastal, subsea, topologyContext);
  const permission = computeTerrainPermission(footprint, coastal, subsea, subterranean);
  const surfaceClass = determineSurfaceClass(footprint, coastal, subsea, subterranean, permission);

  const landBody = footprint.landBody;
  const islandArc = footprint.bestIslandArc;
  const connection = footprint.bestConnection;

  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    hemisphere: point.lat >= 0 ? "north" : "south",
    latBand: point.lat > 0.66 ? "north_polar" : point.lat > 0.22 ? "north_temperate" : point.lat > -0.22 ? "equatorial" : point.lat > -0.66 ? "south_temperate" : "south_polar",
    lonBand: point.lon < -0.5 ? "far_west" : point.lon < 0 ? "west" : point.lon < 0.5 ? "east" : "far_east",

    topologyBlueprint: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,

    isLandFootprint: footprint.isLandFootprint,
    isVoidFootprint: footprint.isVoidFootprint,
    isAboveWaterLandFootprint: footprint.isLandFootprint && !footprint.isSouthPolarIceFootprint,
    isCoastline: coastal.isCoastline,
    isBeach: coastal.isBeach,
    isSand: coastal.isSand,
    isRock: coastal.isRock,
    isShelf: coastal.isShelf,
    isIslandFootprint: footprint.isIslandFootprint,
    isConnectedLandSystem: footprint.isConnectedLandSystem,
    isPolarFootprint: footprint.isPolarFootprint,
    isNorthPolarLandFootprint: footprint.isNorthPolarLandFootprint,
    isSouthPolarIceFootprint: footprint.isSouthPolarIceFootprint,

    landBodyId: landBody ? landBody.id : 0,
    landBodyKey: landBody ? landBody.key : "void_ocean",
    landBodyName: landBody ? landBody.name : "Void / Ocean Footprint",
    landBodyRole: landBody ? landBody.role : "ocean and void blueprint",
    islandArcId: islandArc ? islandArc.id : "none",

    landConnectionId: connection ? connection.id : "none",
    landConnectionRole: connection ? connection.role : "none",
    connectedFootprintPressure: footprint.connectedFootprintPressure,
    isthmusPermission: coastal.isthmusPermission,
    peninsulaPermission: coastal.peninsulaPermission,
    bayPermission: coastal.bayPermission,
    inletPermission: coastal.inletPermission,
    coastlineIrregularityIndex: coastal.coastlineIrregularityIndex,

    surfaceClass: surfaceClass.key,
    surfaceClassId: surfaceClass.id,
    surfaceClassName: surfaceClass.name,
    surfaceClassRole: surfaceClass.role,

    landPressure: footprint.landPressure,
    seaLevelBoundary: footprint.seaLevelBoundary,
    seaLevelDistance: footprint.seaLevelDistance,
    shorelinePressure: coastal.shorelinePressure,
    beachPressure: coastal.beachPressure,
    sandPressure: coastal.sandPressure,
    rockPressure: coastal.rockPressure,
    coastalCliffPressure: coastal.coastalCliffPressure,
    wetEdgePermission: coastal.wetEdgePermission,
    dryEdgePermission: coastal.dryEdgePermission,
    reefShelfPermission: coastal.reefShelfPermission,

    isSubSea: subsea.isSubSea,
    oceanDepthClass: subsea.oceanDepthClass,
    oceanDepthIndex: subsea.oceanDepthIndex,
    shelfDepthIndex: subsea.shelfDepthIndex,
    basinDepthIndex: subsea.basinDepthIndex,
    trenchDepthIndex: subsea.trenchDepthIndex,
    seaFloorShapeIndex: subsea.seaFloorShapeIndex,
    bathymetryBlueprintIndex: subsea.bathymetryBlueprintIndex,
    subSeaBoundaryPressure: subsea.subSeaBoundaryPressure,
    abyssalPermission: subsea.abyssalPermission,
    trenchAxisId: subsea.trenchAxisId,

    isSubterranean: subterranean.isSubterranean,
    subterraneanDepthIndex: subterranean.subterraneanDepthIndex,
    underLandDepthIndex: subterranean.underLandDepthIndex,
    underCoastDepthIndex: subterranean.underCoastDepthIndex,
    underShelfDepthIndex: subterranean.underShelfDepthIndex,
    underBasinDepthIndex: subterranean.underBasinDepthIndex,
    foundationDensityIndex: subterranean.foundationDensityIndex,
    rockMassBoundaryIndex: subterranean.rockMassBoundaryIndex,
    cavityPermission: subterranean.cavityPermission,
    subsurfacePressureZone: subterranean.subsurfacePressureZone,
    undergroundBoundaryPressure: subterranean.undergroundBoundaryPressure,

    terrainRisePermission: permission.terrainRisePermission,
    terrainHoldPermission: permission.terrainHoldPermission,
    terrainBlockPermission: permission.terrainBlockPermission,
    coastalRisePermission: permission.coastalRisePermission,
    islandRisePermission: permission.islandRisePermission,
    polarRisePermission: permission.polarRisePermission,
    basinDepressionPermission: permission.basinDepressionPermission,
    cliffRisePermission: permission.cliffRisePermission,
    rockExposurePermission: permission.rockExposurePermission,
    terrainSeedClass: permission.terrainSeedClass,

    terrainMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    activeHydrationOwnedHere: false,
    aboveSeaElevationOwnedHere: false,
    terrainReliefOwnedHere: false,
    foliageOwnedHere: false,
    climateOwnedHere: false,
    ecologyOwnedHere: false,

    foliage: false,
    trees: false,
    vegetation: false,

    ownsTopologyBlueprint: true,
    ownsFinalRender: false,
    visualPassClaimed: false
  });
}

export function buildTopologyField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const classCounts = new Map();
  const landBodyCounts = new Map();
  const connectionCounts = new Map();
  const trenchCounts = new Map();

  let landSamples = 0;
  let voidSamples = 0;
  let aboveWaterLandSamples = 0;
  let coastlineSamples = 0;
  let beachSamples = 0;
  let sandSamples = 0;
  let rockSamples = 0;
  let shelfSamples = 0;
  let connectedLandSamples = 0;
  let islandSamples = 0;
  let subSeaSamples = 0;
  let subterraneanSamples = 0;
  let terrainRiseSamples = 0;
  let cavitySamples = 0;
  let foliageSamples = 0;

  let oceanDepthSum = 0;
  let trenchDepthSum = 0;
  let subterraneanDepthSum = 0;
  let terrainRiseSum = 0;
  let beachSum = 0;
  let rockSum = 0;
  let coastlineIrregularitySum = 0;
  let connectionPressureSum = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const sample = sampleTopology(u, v, options);

      samples[index] = sample;

      classCounts.set(sample.surfaceClass, (classCounts.get(sample.surfaceClass) || 0) + 1);
      landBodyCounts.set(sample.landBodyKey, (landBodyCounts.get(sample.landBodyKey) || 0) + 1);

      if (sample.landConnectionId !== "none") {
        connectionCounts.set(sample.landConnectionId, (connectionCounts.get(sample.landConnectionId) || 0) + 1);
      }

      if (sample.trenchAxisId !== "none") {
        trenchCounts.set(sample.trenchAxisId, (trenchCounts.get(sample.trenchAxisId) || 0) + 1);
      }

      if (sample.isLandFootprint) landSamples += 1;
      if (sample.isVoidFootprint) voidSamples += 1;
      if (sample.isAboveWaterLandFootprint) aboveWaterLandSamples += 1;
      if (sample.isCoastline) coastlineSamples += 1;
      if (sample.isBeach) beachSamples += 1;
      if (sample.isSand) sandSamples += 1;
      if (sample.isRock) rockSamples += 1;
      if (sample.isShelf) shelfSamples += 1;
      if (sample.isConnectedLandSystem) connectedLandSamples += 1;
      if (sample.isIslandFootprint) islandSamples += 1;
      if (sample.isSubSea) subSeaSamples += 1;
      if (sample.isSubterranean) subterraneanSamples += 1;
      if (sample.terrainRisePermission > 0.42) terrainRiseSamples += 1;
      if (sample.cavityPermission > 0.42) cavitySamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      oceanDepthSum += sample.oceanDepthIndex;
      trenchDepthSum += sample.trenchDepthIndex;
      subterraneanDepthSum += sample.subterraneanDepthIndex;
      terrainRiseSum += sample.terrainRisePermission;
      beachSum += sample.beachPressure;
      rockSum += sample.rockPressure;
      coastlineIrregularitySum += sample.coastlineIrregularityIndex;
      connectionPressureSum += sample.connectedFootprintPressure;
    }
  }

  const activeSurfaceClasses = Array.from(classCounts.keys()).sort();
  const activeLandBodies = Array.from(landBodyCounts.keys()).sort();
  const activeConnections = Array.from(connectionCounts.keys()).sort();
  const activeTrenchAxes = Array.from(trenchCounts.keys()).sort();

  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,
    width: w,
    height: h,
    samples,
    profile: createTopologyProfile(options.profile || {}),
    stats: Object.freeze({
      totalSamples: samples.length,

      landSamples,
      voidSamples,
      aboveWaterLandSamples,
      coastlineSamples,
      beachSamples,
      sandSamples,
      rockSamples,
      shelfSamples,
      connectedLandSamples,
      islandSamples,
      subSeaSamples,
      subterraneanSamples,
      terrainRiseSamples,
      cavitySamples,
      foliageSamples,

      landRatio: landSamples / samples.length,
      voidRatio: voidSamples / samples.length,
      aboveWaterLandRatio: aboveWaterLandSamples / samples.length,
      coastlineRatio: coastlineSamples / samples.length,
      beachRatio: beachSamples / samples.length,
      shelfRatio: shelfSamples / samples.length,
      connectedLandRatio: connectedLandSamples / samples.length,
      islandRatio: islandSamples / samples.length,
      subSeaRatio: subSeaSamples / samples.length,
      subterraneanRatio: subterraneanSamples / samples.length,
      terrainRiseRatio: terrainRiseSamples / samples.length,

      activeSurfaceClassCount: activeSurfaceClasses.length,
      expectedSurfaceClassCount: SURFACE_CLASSES.length,
      activeSurfaceClasses,

      activeLandBodyCount: activeLandBodies.length,
      expectedLandBodyCount: LAND_BODIES.length,
      activeLandBodies,

      activeConnectionCount: activeConnections.length,
      expectedConnectionCount: LAND_CONNECTIONS.length,
      activeConnections,

      activeTrenchAxisCount: activeTrenchAxes.length,
      expectedTrenchAxisCount: OCEAN_TRENCHES.length,
      activeTrenchAxes,

      averageOceanDepthIndex: oceanDepthSum / samples.length,
      averageTrenchDepthIndex: trenchDepthSum / samples.length,
      averageSubterraneanDepthIndex: subterraneanDepthSum / samples.length,
      averageTerrainRisePermission: terrainRiseSum / samples.length,
      averageBeachPressure: beachSum / samples.length,
      averageRockPressure: rockSum / samples.length,
      averageCoastlineIrregularityIndex: coastlineIrregularitySum / samples.length,
      averageConnectedFootprintPressure: connectionPressureSum / samples.length,

      topologyBlueprintActive: true,
      connectedLandFootprintActive: true,
      irregularCoastlineActive: true,
      landVoidBlueprintActive: true,
      seaLevelBoundaryActive: true,
      beachSandRockBoundaryActive: true,
      subSeaDepthBlueprintActive: true,
      subterraneanBlueprintActive: true,
      terrainHandoffReady: true,
      hydrationHandoffLater: true,

      aboveSeaElevationOwnedHere: false,
      terrainReliefOwnedHere: false,
      activeHydrationOwnedHere: false,
      foliageOwnedHere: false,
      climateOwnedHere: false,
      ecologyOwnedHere: false,
      visualPassClaimed: false
    }),
    topologyBlueprint: true,
    topologyComesBeforeTerrain: true,
    terrainMayConsume: true,
    hydrationMayConsumeLater: true,
    visualPassClaimed: false
  });
}

export function getTopologySampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTopology(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTopologyStatus() {
  return Object.freeze({
    ok: true,

    // Runtime compatibility: the currently installed runtime expects this receipt.
    // The active contract below identifies the actual renewal.
    receipt: RUNTIME_COMPATIBLE_RECEIPT,
    activeContract: ACTIVE_CONTRACT,
    latestContract: ACTIVE_CONTRACT,
    previousReceipts: PREVIOUS_RECEIPTS,

    status: "active",
    id: "audralia-g1-topology-connected-landfootprint-and-irregular-coast",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    role: "connected-landfootprint-and-irregular-coast-blueprint-child",
    topologyBlueprint: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,

    landBodyCount: LAND_BODIES.length,
    surfaceClassCount: SURFACE_CLASSES.length,
    landConnectionCount: LAND_CONNECTIONS.length,
    peninsulaSeedCount: PENINSULA_SEEDS.length,
    bayCutCount: BAY_CUTS.length,
    islandFootprintArcCount: ISLAND_FOOTPRINT_ARCS.length,
    oceanTrenchCount: OCEAN_TRENCHES.length,

    connectedLandFootprint: "active",
    irregularCoastline: "active",
    aboveWaterLandFootprintOwnedHere: true,
    beachesOwnedHere: true,
    sandOwnedHere: true,
    rockOwnedHere: true,
    coastlineOwnedHere: true,
    landBodyConnectionsOwnedHere: true,
    intentionalIslandSeparationOwnedHere: true,

    ownsTopologyBlueprint: true,
    ownsLandVoidFootprint: true,
    ownsAboveWaterLandFootprint: true,
    ownsSeaLevelBoundary: true,
    ownsBeachSandRockBoundary: true,
    ownsCoastlineIrregularity: true,
    ownsLandBodyConnections: true,
    ownsIslandSeparation: true,
    ownsSubSeaDepthBlueprint: true,
    ownsSubterraneanBlueprint: true,
    ownsTerrainRisePermissions: true,

    ownsAboveSeaElevation: false,
    ownsTerrainRelief: false,
    ownsMountains: false,
    ownsRidges: false,
    ownsCanyons: false,
    ownsValleys: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    noFoliageLaw: "active",
    ownsFoliageLawfully: false,
    ownsTreesLawfully: false,
    ownsVegetationLawfully: false,

    terrainMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    exports: Object.freeze([
      "createTopologyProfile",
      "sampleTopology",
      "buildTopologyField",
      "getTopologySampleFromField",
      "getTopologyStatus"
    ]),

    surfaceClasses: SURFACE_CLASSES,
    landBodies: LAND_BODIES,
    landConnections: LAND_CONNECTIONS,
    peninsulaSeeds: PENINSULA_SEEDS,
    bayCuts: BAY_CUTS,
    islandFootprintArcs: ISLAND_FOOTPRINT_ARCS,
    oceanTrenches: OCEAN_TRENCHES,
    topologyLaw: TOPOLOGY_LAW,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTopologyProfile,
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
});
