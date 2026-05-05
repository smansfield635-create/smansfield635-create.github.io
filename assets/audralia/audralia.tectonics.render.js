// /assets/audralia/audralia.tectonics.render.js
// AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1
//
// Role:
// - Audralia tectonic plate and mineral-pressure layer.
// - Sits after topology and before terrain.
// - Consumes topology as the land/void/sea-level/subterranean blueprint.
// - Explains ancient exposed land, plate stress, mineral composition,
//   primordial mountain memory, uplift permission, trench pressure,
//   subduction pressure, rift pressure, transform fault pressure,
//   mountain-chain permission, canyon permission, and cliff permission.
//
// Chain:
// parent planet file = globe/body baseline only
// topology child = land / void / beach / sand / rock / shelf / sub-sea / subterranean blueprint
// tectonics child = crustal pressure, plate system, mineral memory, ancient mountain memory
// terrain child = above-sea elevation and relief later
// hydration child = water fill and behavior later
// foliage/ecology child = trees / vegetation / life later
//
// Owns:
// - tectonic plates
// - plate boundaries
// - crustal pressure
// - ancient mountain memory
// - weathered remnant pressure
// - diamond / opal / granite / slate composition pressure
// - uplift permission
// - mountain-chain permission
// - canyon permission
// - cliff permission
// - trench reinforcement permission
// - terrain handoff pressure
//
// Does not own:
// - land footprint
// - void footprint
// - beach placement
// - sand placement
// - rock base placement
// - above-sea elevation
// - mountain height
// - active water
// - hydration
// - climate
// - ecology
// - foliage
// - trees
// - vegetation
// - route shell
// - final render
// - visual pass claim

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
} from "./audralia.topology.render.js?v=AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1";

const RECEIPT = "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TECTONIC_PLATE_LAYER";
const FILE = "/assets/audralia/audralia.tectonics.render.js";

const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TERRAIN_HANDOFF_TARGET = "/assets/audralia/audralia.terrain.render.js";

const TOPOLOGY_CONTRACT = "AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1";

const EARTH_EQUIVALENT_LAND_LAW = Object.freeze({
  currentExposedLandTarget: "earth_equivalent_above_water_land_area_ratio",
  approximateEarthExposedLandRatio: 0.292,
  interpretation: "Audralia is ancient; exposed land remains Earth-scale after vast erosion, subduction, weathering, and collapse.",
  topologyOwnsLandArea: true,
  tectonicsExplainsRemainingLand: true,
  terrainMustNotExpandLandArea: true
});

const PRIMORDIAL_MOUNTAIN_LAW = Object.freeze({
  newbornAudraliaMountainScale: "vastly_above_earth_highest_mountain_standard",
  earthEverestHimalayaStandardOnNewbornAudralia: "short_mountain",
  currentAudraliaMountains: "weathered_remnant_roots_ridges_crowns_and_mineral_spines",
  terrainLaterOwnsFinalHeight: true,
  tectonicsOwnsMountainPermissionAndMemory: true
});

const MINERAL_LAW = Object.freeze({
  dominantComposition: Object.freeze(["diamond", "opal", "granite", "slate"]),
  diamondRole: "extreme pressure remnant, hard exposed value spine, deep crust memory",
  opalRole: "silica seam memory, ancient wet-edge mineral trace without active hydration",
  graniteRole: "craton foundation, stable old continental basement",
  slateRole: "compressed fold belt, metamorphic sheet, ancient pressure record"
});

const TECTONIC_LAW = Object.freeze({
  role: "crustal-pressure-and-mineral-memory-layer",

  ownsTectonicPlates: true,
  ownsPlateBoundaries: true,
  ownsPlateMotion: true,
  ownsCrustalStress: true,
  ownsPrimordialMountainMemory: true,
  ownsWeatheredRemnantPressure: true,
  ownsMineralCompositionPressure: true,
  ownsUpliftPermission: true,
  ownsMountainChainPermission: true,
  ownsCanyonPermission: true,
  ownsCliffPermission: true,
  ownsTrenchReinforcementPermission: true,

  ownsLandFootprint: false,
  ownsVoidFootprint: false,
  ownsBeachPlacement: false,
  ownsSandPlacement: false,
  ownsRockBasePlacement: false,
  ownsAboveSeaElevation: false,
  ownsMountainHeight: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsFinalRender: false,
  visualPassClaimed: false,

  layerOrder: Object.freeze(["topology", "tectonics", "terrain"]),
  topologyDependency: TOPOLOGY_AUTHORITY,
  terrainHandoffTarget: TERRAIN_HANDOFF_TARGET
});

const PLATES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "dominant_mainland_plate",
    name: "Dominant Mainland Plate",
    family: "continental_remnant",
    role: "carries primary mainland crust and old folded roots",
    centerLon: -0.08,
    centerLat: 0.02,
    radiusLon: 0.52,
    radiusLat: 0.32,
    angle: -12,
    motionX: 0.24,
    motionY: 0.10,
    stability: 0.52,
    compressionBias: 0.72,
    riftBias: 0.18,
    transformBias: 0.26,
    upliftBias: 0.66,
    cratonBias: 0.48,
    diamondBias: 0.50,
    opalBias: 0.18,
    graniteBias: 0.56,
    slateBias: 0.50
  }),
  Object.freeze({
    id: 2,
    key: "western_weathered_plate",
    name: "Western Weathered Plate",
    family: "ancient_shield",
    role: "old western crustal shield with hard ridges and fracture basins",
    centerLon: -0.64,
    centerLat: -0.02,
    radiusLon: 0.34,
    radiusLat: 0.28,
    angle: 20,
    motionX: 0.18,
    motionY: 0.02,
    stability: 0.70,
    compressionBias: 0.64,
    riftBias: 0.16,
    transformBias: 0.44,
    upliftBias: 0.48,
    cratonBias: 0.74,
    diamondBias: 0.42,
    opalBias: 0.14,
    graniteBias: 0.78,
    slateBias: 0.46
  }),
  Object.freeze({
    id: 3,
    key: "eastern_shelf_plate",
    name: "Eastern Shelf Plate",
    family: "subduction_margin",
    role: "shelf-facing ocean-continent margin with trench and coastal uplift pressure",
    centerLon: 0.58,
    centerLat: 0.04,
    radiusLon: 0.36,
    radiusLat: 0.28,
    angle: -24,
    motionX: -0.22,
    motionY: 0.02,
    stability: 0.42,
    compressionBias: 0.78,
    riftBias: 0.12,
    transformBias: 0.30,
    upliftBias: 0.74,
    cratonBias: 0.32,
    diamondBias: 0.54,
    opalBias: 0.36,
    graniteBias: 0.42,
    slateBias: 0.62
  }),
  Object.freeze({
    id: 4,
    key: "southern_archipelago_plate",
    name: "Southern Archipelago Plate",
    family: "microplate_arc",
    role: "broken island-chain microplate field with uplifted shelves and old arcs",
    centerLon: 0.12,
    centerLat: -0.46,
    radiusLon: 0.42,
    radiusLat: 0.22,
    angle: 8,
    motionX: 0.10,
    motionY: 0.20,
    stability: 0.34,
    compressionBias: 0.50,
    riftBias: 0.30,
    transformBias: 0.52,
    upliftBias: 0.62,
    cratonBias: 0.22,
    diamondBias: 0.38,
    opalBias: 0.44,
    graniteBias: 0.30,
    slateBias: 0.58
  }),
  Object.freeze({
    id: 5,
    key: "north_polar_craton_plate",
    name: "North Polar Craton Plate",
    family: "stable_craton",
    role: "ancient polar crust, mineral crownland, stable highland permission",
    centerLon: 0.02,
    centerLat: 0.82,
    radiusLon: 0.48,
    radiusLat: 0.18,
    angle: 0,
    motionX: 0.02,
    motionY: -0.04,
    stability: 0.86,
    compressionBias: 0.44,
    riftBias: 0.08,
    transformBias: 0.16,
    upliftBias: 0.58,
    cratonBias: 0.88,
    diamondBias: 0.72,
    opalBias: 0.10,
    graniteBias: 0.80,
    slateBias: 0.38
  }),
  Object.freeze({
    id: 6,
    key: "deep_ocean_basin_plate",
    name: "Deep Ocean Basin Plate",
    family: "oceanic_basin",
    role: "oceanic plate and abyssal basin floor with spreading and sinking memory",
    centerLon: 0.78,
    centerLat: -0.22,
    radiusLon: 0.82,
    radiusLat: 0.72,
    angle: 0,
    motionX: -0.08,
    motionY: -0.04,
    stability: 0.30,
    compressionBias: 0.22,
    riftBias: 0.70,
    transformBias: 0.34,
    upliftBias: 0.12,
    cratonBias: 0.08,
    diamondBias: 0.20,
    opalBias: 0.28,
    graniteBias: 0.12,
    slateBias: 0.22
  }),
  Object.freeze({
    id: 7,
    key: "southern_ice_shelf_plate",
    name: "Southern Ice Shelf Plate",
    family: "locked_polar_boundary",
    role: "south polar ice-supporting crustal base, no landmass conversion",
    centerLon: 0.00,
    centerLat: -0.88,
    radiusLon: 1.00,
    radiusLat: 0.18,
    angle: 0,
    motionX: 0.00,
    motionY: 0.00,
    stability: 0.82,
    compressionBias: 0.20,
    riftBias: 0.06,
    transformBias: 0.12,
    upliftBias: 0.08,
    cratonBias: 0.54,
    diamondBias: 0.16,
    opalBias: 0.06,
    graniteBias: 0.34,
    slateBias: 0.18
  })
]);

const PLATE_BOUNDARIES = Object.freeze([
  Object.freeze({ id: "b01", from: 1, to: 2, type: "convergent", role: "western collision belt", width: 0.070, intensity: 0.74 }),
  Object.freeze({ id: "b02", from: 1, to: 3, type: "convergent_subduction", role: "eastern shelf subduction margin", width: 0.070, intensity: 0.82 }),
  Object.freeze({ id: "b03", from: 3, to: 6, type: "subduction_trench", role: "oceanic trench reinforcement", width: 0.060, intensity: 0.86 }),
  Object.freeze({ id: "b04", from: 1, to: 4, type: "transform", role: "southern lateral fracture and shelf offset", width: 0.052, intensity: 0.68 }),
  Object.freeze({ id: "b05", from: 4, to: 6, type: "microplate_arc", role: "southern island arc pressure", width: 0.058, intensity: 0.70 }),
  Object.freeze({ id: "b06", from: 1, to: 5, type: "stable_craton_transition", role: "northern mineral crown transition", width: 0.050, intensity: 0.48 }),
  Object.freeze({ id: "b07", from: 2, to: 5, type: "transform", role: "western frontier fault hook", width: 0.046, intensity: 0.56 }),
  Object.freeze({ id: "b08", from: 6, to: 7, type: "divergent_locked_polar", role: "southern cold basin and locked shelf boundary", width: 0.064, intensity: 0.46 }),
  Object.freeze({ id: "b09", from: 2, to: 6, type: "divergent", role: "western basin opening memory", width: 0.060, intensity: 0.58 }),
  Object.freeze({ id: "b10", from: 3, to: 4, type: "transform_arc", role: "eastern-to-southern broken margin", width: 0.052, intensity: 0.62 })
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
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
  return Math.exp(
    -(
      (dx * dx) / Math.max(0.000001, sx * sx) +
      (dy * dy) / Math.max(0.000001, sy * sy)
    ) * power
  );
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

function plateById(id) {
  return PLATES.find((plate) => plate.id === id) || null;
}

function boundaryPlateIds(boundary) {
  return Object.freeze({
    from: plateById(boundary.from),
    to: plateById(boundary.to)
  });
}

function plateInfluence(lon, lat, plate) {
  const dx = wrapLonDistance(lon, plate.centerLon);
  const dy = lat - plate.centerLat;
  const rotated = rotatePoint(dx, dy, plate.angle);

  const primary = gaussian(rotated.x, rotated.y, plate.radiusLon, plate.radiusLat, 0.96);
  const memory = fbm(lon * 3.7 + plate.id * 1.2, lat * 3.7 - plate.id * 0.8, 200 + plate.id, 4);
  const edge = smoothstep(0.12, 0.72, primary);

  return clamp(primary + (memory - 0.5) * 0.12 * edge, 0, 1.35);
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

function boundaryInfluence(lon, lat, boundary) {
  const plates = boundaryPlateIds(boundary);

  if (!plates.from || !plates.to) {
    return Object.freeze({
      boundary,
      pressure: 0,
      distance: Infinity,
      t: 0
    });
  }

  const line = distanceToSegment(
    lon,
    lat,
    plates.from.centerLon,
    plates.from.centerLat,
    plates.to.centerLon,
    plates.to.centerLat
  );

  const rough = 0.76 + fbm(lon * 9.1 + boundary.from, lat * 9.1 - boundary.to, 430 + boundary.from * 7 + boundary.to, 4) * 0.24;
  const pressure = smoothstep(boundary.width, 0.004, line.distance) * boundary.intensity * rough;

  return Object.freeze({
    boundary,
    pressure: clamp(pressure, 0, 1),
    distance: line.distance,
    t: line.t
  });
}

function getInputContext(context = {}) {
  return Object.freeze({
    tectonicStressDemand: clamp(
      Number.isFinite(Number(context.tectonicStressDemand)) ? Number(context.tectonicStressDemand) : 0.84,
      0,
      1
    ),
    ancientMountainMemory: clamp(
      Number.isFinite(Number(context.ancientMountainMemory)) ? Number(context.ancientMountainMemory) : 0.96,
      0,
      1
    ),
    mineralExposureDemand: clamp(
      Number.isFinite(Number(context.mineralExposureDemand)) ? Number(context.mineralExposureDemand) : 0.88,
      0,
      1
    ),
    erosionAge: clamp(
      Number.isFinite(Number(context.erosionAge)) ? Number(context.erosionAge) : 1,
      0,
      1
    )
  });
}

function safeTopologySample(u, v, context = {}) {
  try {
    const sample = sampleTopology(u, v, context);
    if (sample) return sample;
  } catch (error) {
    // Fallback below.
  }

  return Object.freeze({
    receipt: "TOPOLOGY_FALLBACK_FOR_TECTONICS",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2,
    isLandFootprint: false,
    isVoidFootprint: true,
    isAboveWaterLandFootprint: false,
    isCoastline: false,
    isBeach: false,
    isSand: false,
    isRock: false,
    isShelf: false,
    isIslandFootprint: false,
    isConnectedLandSystem: false,
    isNorthPolarLandFootprint: false,
    isSouthPolarIceFootprint: false,
    surfaceClass: "void_mid_ocean",
    surfaceClassId: 3,
    landBodyId: 0,
    landBodyKey: "void_ocean",
    oceanDepthIndex: 0.5,
    trenchDepthIndex: 0.2,
    subterraneanDepthIndex: 0.25,
    foundationDensityIndex: 0.1,
    rockMassBoundaryIndex: 0.1,
    terrainRisePermission: 0,
    terrainBlockPermission: 1,
    beachPressure: 0,
    sandPressure: 0,
    rockPressure: 0,
    coastalCliffPressure: 0,
    coastlineIrregularityIndex: 0,
    connectedFootprintPressure: 0,
    foliage: false,
    trees: false,
    vegetation: false,
    visualPassClaimed: false
  });
}

function choosePlate(lon, lat, topology) {
  let bestPlate = PLATES[5];
  let bestScore = -Infinity;

  for (const plate of PLATES) {
    let score = plateInfluence(lon, lat, plate);

    if (topology.isSouthPolarIceFootprint && plate.id === 7) score += 1.25;
    if (topology.isNorthPolarLandFootprint && plate.id === 5) score += 1.1;
    if (topology.landBodyId === 1 && plate.id === 1) score += 0.74;
    if (topology.landBodyId === 2 && plate.id === 2) score += 0.74;
    if (topology.landBodyId === 3 && plate.id === 3) score += 0.74;
    if (topology.landBodyId === 4 && plate.id === 4) score += 0.74;
    if (topology.isVoidFootprint && plate.id === 6) score += 0.42;
    if (topology.isIslandFootprint && plate.id === 4) score += 0.36;
    if (topology.isShelf && (plate.id === 3 || plate.id === 6)) score += 0.28;

    if (score > bestScore) {
      bestScore = score;
      bestPlate = plate;
    }
  }

  return Object.freeze({
    plate: bestPlate,
    plateScore: clamp(bestScore, 0, 2.5)
  });
}

function chooseBoundary(lon, lat) {
  let best = null;
  let bestPressure = 0;

  for (const boundary of PLATE_BOUNDARIES) {
    const influence = boundaryInfluence(lon, lat, boundary);

    if (influence.pressure > bestPressure) {
      best = influence;
      bestPressure = influence.pressure;
    }
  }

  return best || Object.freeze({
    boundary: Object.freeze({
      id: "none",
      from: 0,
      to: 0,
      type: "intraplate",
      role: "within plate interior",
      width: 0,
      intensity: 0
    }),
    pressure: 0,
    distance: Infinity,
    t: 0
  });
}

function boundaryTypePressure(type, boundaryPressure) {
  const convergent =
    type === "convergent" ||
    type === "convergent_subduction" ||
    type === "subduction_trench"
      ? boundaryPressure
      : 0;

  const divergent =
    type === "divergent" ||
    type === "divergent_locked_polar"
      ? boundaryPressure
      : 0;

  const transform =
    type === "transform" ||
    type === "transform_arc"
      ? boundaryPressure
      : 0;

  const subduction =
    type === "convergent_subduction" ||
    type === "subduction_trench"
      ? boundaryPressure
      : 0;

  const microplateArc =
    type === "microplate_arc" ||
    type === "transform_arc"
      ? boundaryPressure
      : 0;

  const stableCraton =
    type === "stable_craton_transition"
      ? boundaryPressure
      : 0;

  return Object.freeze({
    convergent,
    divergent,
    transform,
    subduction,
    microplateArc,
    stableCraton
  });
}

function computeTectonicSignals(lon, lat, topology, plateChoice, boundaryChoice, context) {
  const plate = plateChoice.plate;
  const boundary = boundaryChoice.boundary;
  const boundaryPressure = clamp(boundaryChoice.pressure, 0, 1);
  const typePressure = boundaryTypePressure(boundary.type, boundaryPressure);

  const topologyLand = Boolean(topology.isLandFootprint || topology.isAboveWaterLandFootprint);
  const topologyVoid = Boolean(topology.isVoidFootprint);
  const topologyShelf = Boolean(topology.isShelf);
  const topologyCoast = Boolean(topology.isCoastline);
  const topologyIce = Boolean(topology.isSouthPolarIceFootprint);

  const terrainRisePermission = clamp(Number(topology.terrainRisePermission) || 0, 0, 1);
  const terrainBlockPermission = clamp(Number(topology.terrainBlockPermission) || 0, 0, 1);
  const rockMass = clamp(Number(topology.rockMassBoundaryIndex) || Number(topology.foundationDensityIndex) || 0, 0, 1);
  const subterraneanDepth = clamp(Number(topology.subterraneanDepthIndex) || 0, 0, 1);
  const oceanDepth = clamp(Number(topology.oceanDepthIndex) || 0, 0, 1);
  const trenchDepth = clamp(Number(topology.trenchDepthIndex) || 0, 0, 1);
  const coastalRock = clamp(Number(topology.rockPressure) || 0, 0, 1);
  const beachSand = clamp(Number(topology.sandPressure) || Number(topology.beachPressure) || 0, 0, 1);
  const connectedPressure = clamp(Number(topology.connectedFootprintPressure) || 0, 0, 1);

  const stressNoise = fbm(lon * 6.6 + plate.id * 0.8, lat * 6.6 - plate.id * 0.9, 600 + plate.id, 5);
  const mineralNoise = fbm(lon * 11.4 - plate.id * 0.5, lat * 11.4 + plate.id * 0.7, 720 + plate.id, 4);
  const faultNoise = fbm(lon * 18.0 + 1.1, lat * 18.0 - 2.4, 840 + plate.id, 3);

  const crustalStressIndex = clamp(
    boundaryPressure * 0.38 +
      plate.compressionBias * 0.16 +
      plate.transformBias * 0.12 +
      typePressure.convergent * 0.18 +
      typePressure.transform * 0.14 +
      stressNoise * 0.16,
    0,
    1
  );

  const ancientCrustStabilityIndex = clamp(
    plate.stability * 0.46 +
      plate.cratonBias * 0.28 +
      rockMass * 0.16 +
      (topologyLand ? 0.10 : 0),
    0,
    1
  );

  const primordialMountainMemoryIndex = clamp(
    context.ancientMountainMemory * 0.36 +
      plate.upliftBias * 0.18 +
      typePressure.convergent * 0.22 +
      terrainRisePermission * 0.16 +
      rockMass * 0.12 +
      connectedPressure * 0.08,
    0,
    1
  );

  const weatheredRemnantIndex = clamp(
    context.erosionAge * 0.34 +
      primordialMountainMemoryIndex * 0.26 +
      ancientCrustStabilityIndex * 0.20 +
      crustalStressIndex * 0.12 +
      subterraneanDepth * 0.08,
    0,
    1
  );

  const subductionPressure = clamp(
    typePressure.subduction * 0.62 +
      trenchDepth * 0.18 +
      (topologyShelf ? 0.08 : 0) +
      plate.compressionBias * 0.12,
    0,
    1
  );

  const riftPressure = clamp(
    typePressure.divergent * 0.62 +
      plate.riftBias * 0.22 +
      (topologyVoid ? oceanDepth * 0.12 : 0) +
      stressNoise * 0.08,
    0,
    1
  );

  const transformFaultPressure = clamp(
    typePressure.transform * 0.60 +
      plate.transformBias * 0.24 +
      faultNoise * 0.16,
    0,
    1
  );

  const foldPressure = clamp(
    typePressure.convergent * 0.40 +
      plate.compressionBias * 0.24 +
      crustalStressIndex * 0.22 +
      weatheredRemnantIndex * 0.14,
    0,
    1
  );

  const upliftPermission = topologyLand && !topologyIce
    ? clamp(
        terrainRisePermission * 0.34 +
          typePressure.convergent * 0.22 +
          plate.upliftBias * 0.20 +
          primordialMountainMemoryIndex * 0.16 +
          rockMass * 0.08,
        0,
        1
      )
    : 0;

  const mountainChainPermission = topologyLand && !topologyIce
    ? clamp(
        upliftPermission * 0.36 +
          primordialMountainMemoryIndex * 0.26 +
          foldPressure * 0.20 +
          ancientCrustStabilityIndex * 0.10 +
          connectedPressure * 0.08,
        0,
        1
      )
    : 0;

  const canyonPermission = topologyLand && !topologyIce
    ? clamp(
        transformFaultPressure * 0.24 +
          foldPressure * 0.20 +
          crustalStressIndex * 0.18 +
          weatheredRemnantIndex * 0.16 +
          terrainRisePermission * 0.10 +
          faultNoise * 0.12,
        0,
        1
      )
    : 0;

  const cliffPermission = topologyLand && !topologyIce
    ? clamp(
        coastalRock * 0.26 +
          crustalStressIndex * 0.20 +
          transformFaultPressure * 0.18 +
          ancientCrustStabilityIndex * 0.14 +
          upliftPermission * 0.14 +
          (topologyCoast ? 0.08 : 0),
        0,
        1
      )
    : 0;

  const volcanicArcPermission = clamp(
    typePressure.microplateArc * 0.34 +
      subductionPressure * 0.28 +
      typePressure.convergent * 0.16 +
      (topologyShelf ? 0.08 : 0) +
      plate.riftBias * 0.08,
    0,
    1
  );

  const trenchReinforcementPermission = topologyVoid
    ? clamp(
        subductionPressure * 0.38 +
          trenchDepth * 0.30 +
          oceanDepth * 0.18 +
          typePressure.subduction * 0.14,
        0,
        1
      )
    : clamp(typePressure.subduction * 0.22 + cliffPermission * 0.08, 0, 1);

  const seismicBeltPermission = clamp(
    boundaryPressure * 0.38 +
      transformFaultPressure * 0.22 +
      subductionPressure * 0.18 +
      riftPressure * 0.14 +
      faultNoise * 0.08,
    0,
    1
  );

  const diamondPressureIndex = clamp(
    plate.diamondBias * 0.24 +
      subductionPressure * 0.20 +
      primordialMountainMemoryIndex * 0.18 +
      subterraneanDepth * 0.16 +
      crustalStressIndex * 0.12 +
      mineralNoise * 0.10,
    0,
    1
  );

  const opalSeamIndex = clamp(
    plate.opalBias * 0.28 +
      beachSand * 0.18 +
      (topologyCoast ? 0.14 : 0) +
      (topologyShelf ? 0.12 : 0) +
      mineralNoise * 0.12 +
      subterraneanDepth * 0.08,
    0,
    1
  );

  const graniteCratonIndex = clamp(
    plate.graniteBias * 0.30 +
      ancientCrustStabilityIndex * 0.26 +
      plate.cratonBias * 0.18 +
      rockMass * 0.14 +
      mineralNoise * 0.08 +
      (topologyLand ? 0.04 : 0),
    0,
    1
  );

  const slateFoldBeltIndex = clamp(
    plate.slateBias * 0.28 +
      foldPressure * 0.24 +
      transformFaultPressure * 0.16 +
      typePressure.convergent * 0.14 +
      crustalStressIndex * 0.10 +
      mineralNoise * 0.08,
    0,
    1
  );

  const exposedMineralHardnessIndex = clamp(
    diamondPressureIndex * 0.28 +
      graniteCratonIndex * 0.26 +
      slateFoldBeltIndex * 0.22 +
      opalSeamIndex * 0.10 +
      weatheredRemnantIndex * 0.14,
    0,
    1
  );

  const terrainPressureHandoff = clamp(
    terrainRisePermission * 0.20 +
      upliftPermission * 0.20 +
      mountainChainPermission * 0.18 +
      canyonPermission * 0.14 +
      cliffPermission * 0.12 +
      exposedMineralHardnessIndex * 0.10 +
      trenchReinforcementPermission * 0.06,
    0,
    1
  );

  return Object.freeze({
    crustalStressIndex,
    ancientCrustStabilityIndex,
    primordialMountainMemoryIndex,
    weatheredRemnantIndex,
    subductionPressure,
    riftPressure,
    transformFaultPressure,
    foldPressure,
    upliftPermission,
    mountainChainPermission,
    canyonPermission,
    cliffPermission,
    volcanicArcPermission,
    trenchReinforcementPermission,
    seismicBeltPermission,
    diamondPressureIndex,
    opalSeamIndex,
    graniteCratonIndex,
    slateFoldBeltIndex,
    exposedMineralHardnessIndex,
    terrainPressureHandoff,
    terrainRisePermission,
    terrainBlockPermission
  });
}

function dominantComposition(signals) {
  const entries = [
    ["diamond", signals.diamondPressureIndex],
    ["opal", signals.opalSeamIndex],
    ["granite", signals.graniteCratonIndex],
    ["slate", signals.slateFoldBeltIndex]
  ];

  entries.sort((a, b) => b[1] - a[1]);

  return Object.freeze({
    primary: entries[0][0],
    primaryPressure: entries[0][1],
    secondary: entries[1][0],
    secondaryPressure: entries[1][1],
    ordered: entries.map(([key]) => key)
  });
}

function tectonicType(boundaryType, signals, plate) {
  if (signals.subductionPressure > 0.62) return "subduction_margin";
  if (signals.riftPressure > 0.58) return "rift_or_spreading_zone";
  if (signals.transformFaultPressure > 0.58) return "transform_fault_belt";
  if (signals.mountainChainPermission > 0.62) return "ancient_mountain_root_belt";
  if (signals.graniteCratonIndex > 0.62 && plate.family === "stable_craton") return "stable_craton";
  if (signals.volcanicArcPermission > 0.56) return "ancient_arc_permission";
  if (boundaryType === "intraplate") return "intraplate_weathered_crust";
  return "mixed_tectonic_pressure";
}

export function createTectonicsProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    topologyContract: TOPOLOGY_CONTRACT,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    role: "tectonic-plate-layer-earth-land-area-ancient-mountain-memory",
    tectonicsChild: true,
    topologyDependency: true,
    topologyBeforeTectonics: true,
    tectonicsBeforeTerrain: true,

    earthEquivalentLandLaw: EARTH_EQUIVALENT_LAND_LAW,
    primordialMountainLaw: PRIMORDIAL_MOUNTAIN_LAW,
    mineralLaw: MINERAL_LAW,
    tectonicLaw: TECTONIC_LAW,

    plateCount: PLATES.length,
    boundaryCount: PLATE_BOUNDARIES.length,
    plates: PLATES,
    plateBoundaries: PLATE_BOUNDARIES,

    ownsTectonicPlates: true,
    ownsCrustalStress: true,
    ownsMineralPressure: true,
    ownsUpliftPermission: true,
    ownsTerrainPressureHandoff: true,

    ownsLandFootprint: false,
    ownsVoidFootprint: false,
    ownsBeachPlacement: false,
    ownsSandPlacement: false,
    ownsRockBasePlacement: false,
    ownsAboveSeaElevation: false,
    ownsMountainHeight: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFinalRender: false,
    visualPassClaimed: false,

    ...overrides
  });
}

export function sampleTectonics(uInput, vInput, topologySample = null, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const tectonicContext = getInputContext(context);

  const topology = topologySample || safeTopologySample(point.u, point.v, context.topologyContext || context);
  const plateChoice = choosePlate(point.lon, point.lat, topology);
  const boundaryChoice = chooseBoundary(point.lon, point.lat);
  const signals = computeTectonicSignals(point.lon, point.lat, topology, plateChoice, boundaryChoice, tectonicContext);
  const composition = dominantComposition(signals);

  const plate = plateChoice.plate;
  const boundary = boundaryChoice.boundary;

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    topologyContract: TOPOLOGY_CONTRACT,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topologyReceipt: topology.receipt || "unknown",
    topologySurfaceClass: topology.surfaceClass || "unknown",
    topologySurfaceClassId: topology.surfaceClassId ?? -1,
    topologyLandFootprint: Boolean(topology.isLandFootprint || topology.isAboveWaterLandFootprint),
    topologyVoidFootprint: Boolean(topology.isVoidFootprint),
    topologyEarthEquivalentLandTarget: EARTH_EQUIVALENT_LAND_LAW.approximateEarthExposedLandRatio,
    topologyTerrainRisePermission: clamp(Number(topology.terrainRisePermission) || 0, 0, 1),
    topologyTerrainBlockPermission: clamp(Number(topology.terrainBlockPermission) || 0, 0, 1),

    plateId: plate.id,
    plateKey: plate.key,
    plateName: plate.name,
    plateFamily: plate.family,
    plateRole: plate.role,
    plateScore: plateChoice.plateScore,
    plateMotionX: plate.motionX,
    plateMotionY: plate.motionY,
    plateStability: plate.stability,

    boundaryId: boundary.id,
    boundaryType: boundary.type,
    boundaryRole: boundary.role,
    boundaryPressure: boundaryChoice.pressure,
    boundaryDistance: boundaryChoice.distance,

    tectonicType: tectonicType(boundary.type, signals, plate),

    crustalStressIndex: signals.crustalStressIndex,
    ancientCrustStabilityIndex: signals.ancientCrustStabilityIndex,
    primordialMountainMemoryIndex: signals.primordialMountainMemoryIndex,
    weatheredRemnantIndex: signals.weatheredRemnantIndex,

    newbornAudraliaMountainScale: PRIMORDIAL_MOUNTAIN_LAW.newbornAudraliaMountainScale,
    earthEverestHimalayaStandardOnNewbornAudralia: PRIMORDIAL_MOUNTAIN_LAW.earthEverestHimalayaStandardOnNewbornAudralia,

    convergentBoundaryPressure: boundaryTypePressure(boundary.type, boundaryChoice.pressure).convergent,
    divergentBoundaryPressure: boundaryTypePressure(boundary.type, boundaryChoice.pressure).divergent,
    transformBoundaryPressure: boundaryTypePressure(boundary.type, boundaryChoice.pressure).transform,
    subductionPressure: signals.subductionPressure,
    riftPressure: signals.riftPressure,
    transformFaultPressure: signals.transformFaultPressure,
    foldPressure: signals.foldPressure,

    upliftPermission: signals.upliftPermission,
    mountainChainPermission: signals.mountainChainPermission,
    canyonPermission: signals.canyonPermission,
    cliffPermission: signals.cliffPermission,
    volcanicArcPermission: signals.volcanicArcPermission,
    trenchReinforcementPermission: signals.trenchReinforcementPermission,
    seismicBeltPermission: signals.seismicBeltPermission,

    diamondPressureIndex: signals.diamondPressureIndex,
    opalSeamIndex: signals.opalSeamIndex,
    graniteCratonIndex: signals.graniteCratonIndex,
    slateFoldBeltIndex: signals.slateFoldBeltIndex,
    exposedMineralHardnessIndex: signals.exposedMineralHardnessIndex,

    dominantComposition: composition.primary,
    secondaryComposition: composition.secondary,
    compositionOrder: composition.ordered,

    terrainPressureHandoff: signals.terrainPressureHandoff,
    terrainMayConsume: true,
    terrainMustNotExpandLandArea: true,
    terrainMayUseForElevationReliefOnly: true,

    ownsTectonicPlates: true,
    ownsCrustalStress: true,
    ownsMineralPressure: true,
    ownsUpliftPermission: true,
    ownsTerrainPressureHandoff: true,

    ownsLandFootprint: false,
    ownsVoidFootprint: false,
    ownsBeachPlacement: false,
    ownsSandPlacement: false,
    ownsRockBasePlacement: false,
    ownsAboveSeaElevation: false,
    ownsMountainHeight: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFinalRender: false,

    foliage: false,
    trees: false,
    vegetation: false,
    activeHydrationOwnedHere: false,
    visualPassClaimed: false
  });
}

export function buildTectonicsField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const topologyField = buildTopologyField(w, h, options.topologyContext || {});
  const plateCounts = new Map();
  const boundaryCounts = new Map();
  const compositionCounts = new Map();
  const tectonicTypeCounts = new Map();

  let landFootprintSamples = 0;
  let voidFootprintSamples = 0;
  let stressSum = 0;
  let ancientMemorySum = 0;
  let weatheredRemnantSum = 0;
  let diamondSum = 0;
  let opalSum = 0;
  let graniteSum = 0;
  let slateSum = 0;
  let upliftSum = 0;
  let mountainChainSum = 0;
  let canyonSum = 0;
  let cliffSum = 0;
  let trenchSum = 0;
  let terrainHandoffSum = 0;
  let foliageSamples = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const topologySample = getTopologySampleFromField(topologyField, u, v);
      const sample = sampleTectonics(u, v, topologySample, options);

      samples[index] = sample;

      plateCounts.set(sample.plateKey, (plateCounts.get(sample.plateKey) || 0) + 1);
      boundaryCounts.set(sample.boundaryId, (boundaryCounts.get(sample.boundaryId) || 0) + 1);
      compositionCounts.set(sample.dominantComposition, (compositionCounts.get(sample.dominantComposition) || 0) + 1);
      tectonicTypeCounts.set(sample.tectonicType, (tectonicTypeCounts.get(sample.tectonicType) || 0) + 1);

      if (sample.topologyLandFootprint) landFootprintSamples += 1;
      if (sample.topologyVoidFootprint) voidFootprintSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      stressSum += sample.crustalStressIndex;
      ancientMemorySum += sample.primordialMountainMemoryIndex;
      weatheredRemnantSum += sample.weatheredRemnantIndex;
      diamondSum += sample.diamondPressureIndex;
      opalSum += sample.opalSeamIndex;
      graniteSum += sample.graniteCratonIndex;
      slateSum += sample.slateFoldBeltIndex;
      upliftSum += sample.upliftPermission;
      mountainChainSum += sample.mountainChainPermission;
      canyonSum += sample.canyonPermission;
      cliffSum += sample.cliffPermission;
      trenchSum += sample.trenchReinforcementPermission;
      terrainHandoffSum += sample.terrainPressureHandoff;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    topologyContract: TOPOLOGY_CONTRACT,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,
    width: w,
    height: h,
    samples,
    topologyField,
    profile: createTectonicsProfile(options.profile || {}),
    stats: Object.freeze({
      totalSamples: samples.length,

      landFootprintSamples,
      voidFootprintSamples,
      landFootprintRatio: landFootprintSamples / samples.length,
      voidFootprintRatio: voidFootprintSamples / samples.length,
      earthEquivalentLandTargetRatio: EARTH_EQUIVALENT_LAND_LAW.approximateEarthExposedLandRatio,

      activePlateCount: plateCounts.size,
      expectedPlateCount: PLATES.length,
      activePlates: Array.from(plateCounts.keys()).sort(),

      activeBoundaryCount: boundaryCounts.size,
      expectedBoundaryCount: PLATE_BOUNDARIES.length,
      activeBoundaries: Array.from(boundaryCounts.keys()).sort(),

      activeCompositionCount: compositionCounts.size,
      expectedCompositionSet: MINERAL_LAW.dominantComposition,
      activeCompositions: Array.from(compositionCounts.keys()).sort(),

      activeTectonicTypeCount: tectonicTypeCounts.size,
      activeTectonicTypes: Array.from(tectonicTypeCounts.keys()).sort(),

      averageCrustalStressIndex: stressSum / samples.length,
      averagePrimordialMountainMemoryIndex: ancientMemorySum / samples.length,
      averageWeatheredRemnantIndex: weatheredRemnantSum / samples.length,

      averageDiamondPressureIndex: diamondSum / samples.length,
      averageOpalSeamIndex: opalSum / samples.length,
      averageGraniteCratonIndex: graniteSum / samples.length,
      averageSlateFoldBeltIndex: slateSum / samples.length,

      averageUpliftPermission: upliftSum / samples.length,
      averageMountainChainPermission: mountainChainSum / samples.length,
      averageCanyonPermission: canyonSum / samples.length,
      averageCliffPermission: cliffSum / samples.length,
      averageTrenchReinforcementPermission: trenchSum / samples.length,
      averageTerrainPressureHandoff: terrainHandoffSum / samples.length,

      foliageSamples,

      tectonicsChild: true,
      topologyConsumed: true,
      topologyBeforeTectonics: true,
      tectonicsBeforeTerrain: true,
      terrainMayConsume: true,
      terrainMustNotExpandLandArea: true,

      ownsLandFootprint: false,
      ownsAboveSeaElevation: false,
      ownsMountainHeight: false,
      ownsHydration: false,
      ownsFoliage: false,
      ownsFinalRender: false,
      visualPassClaimed: false
    }),
    tectonicsChild: true,
    topologyDependency: true,
    terrainMayConsume: true,
    visualPassClaimed: false
  });
}

export function getTectonicsSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTectonics(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTectonicsStatus() {
  const topologyStatus = (() => {
    try {
      return getTopologyStatus();
    } catch (error) {
      return Object.freeze({
        ok: false,
        receipt: "topology-status-unavailable",
        error: error && error.message ? error.message : String(error)
      });
    }
  })();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g1-tectonic-plate-layer-earth-land-area-ancient-mountain-memory",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    topologyContract: TOPOLOGY_CONTRACT,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    role: "tectonic-plate-layer-earth-land-area-ancient-mountain-memory",
    tectonicsChild: true,
    topologyDependency: true,
    topologyBeforeTectonics: true,
    tectonicsBeforeTerrain: true,
    topologyStatus,

    earthEquivalentLandLaw: EARTH_EQUIVALENT_LAND_LAW,
    primordialMountainLaw: PRIMORDIAL_MOUNTAIN_LAW,
    mineralLaw: MINERAL_LAW,
    tectonicLaw: TECTONIC_LAW,

    plateCount: PLATES.length,
    boundaryCount: PLATE_BOUNDARIES.length,
    plates: PLATES,
    plateBoundaries: PLATE_BOUNDARIES,

    currentExposedLandTarget: EARTH_EQUIVALENT_LAND_LAW.currentExposedLandTarget,
    approximateEarthExposedLandRatio: EARTH_EQUIVALENT_LAND_LAW.approximateEarthExposedLandRatio,
    newbornAudraliaMountainScale: PRIMORDIAL_MOUNTAIN_LAW.newbornAudraliaMountainScale,
    earthEverestHimalayaStandardOnNewbornAudralia: PRIMORDIAL_MOUNTAIN_LAW.earthEverestHimalayaStandardOnNewbornAudralia,
    dominantComposition: MINERAL_LAW.dominantComposition,

    ownsTectonicPlates: true,
    ownsPlateBoundaries: true,
    ownsCrustalStress: true,
    ownsPrimordialMountainMemory: true,
    ownsWeatheredRemnantPressure: true,
    ownsMineralCompositionPressure: true,
    ownsUpliftPermission: true,
    ownsTerrainPressureHandoff: true,

    ownsLandFootprint: false,
    ownsVoidFootprint: false,
    ownsBeachPlacement: false,
    ownsSandPlacement: false,
    ownsRockBasePlacement: false,
    ownsAboveSeaElevation: false,
    ownsMountainHeight: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFinalRender: false,

    terrainMayConsume: true,
    terrainMustNotExpandLandArea: true,
    terrainMayUseForElevationReliefOnly: true,

    exports: Object.freeze([
      "createTectonicsProfile",
      "sampleTectonics",
      "buildTectonicsField",
      "getTectonicsSampleFromField",
      "getTectonicsStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTectonicsProfile,
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
});
