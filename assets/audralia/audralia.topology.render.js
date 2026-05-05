// /assets/audralia/audralia.topology.render.js
// AUDRALIA_G2_TOPOLOGY_CHILD_FROM_CONFIRMED_TERRAIN_TNT_v1
//
// Role:
// - Second downstream child in the Audralia chain.
// - Consumes /assets/audralia/audralia.terrain.render.js.
// - Expands terrain pressure into topology: ridges, basins, corridors, adjacency,
//   climb paths, watershed gates, and region-to-region elevation flow.
//
// Chain:
// parent planet file = baseline land/water
// terrain child = land pressure, islands, elevation regions
// topology child = relationships between those regions
// hydration child = later water behavior through topology
//
// Owns:
// - topology only
// - Nine-region adjacency
// - elevation-flow rules
// - route/climb corridors
// - ridge/basin relationship pressure
// - watershed permission gates
//
// Does not own:
// - parent globe rendering
// - terrain generation
// - hydration
// - climate
// - ecology
// - fauna
// - runtime
// - route shell
// - Earth
// - Sun
// - Moon
// - visual pass claim

import {
  sampleTerrain as sampleTerrainChild,
  buildTerrainField as buildTerrainFieldChild,
  getTerrainStatus as getTerrainStatusChild
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_TERRAIN_PRESSURE_ISLAND_ELEVATION_CHILD_TNT_v2";

const RECEIPT = "AUDRALIA_G2_TOPOLOGY_CHILD_FROM_CONFIRMED_TERRAIN_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2_TOPOLOGY_CHILD";
const FILE = "/assets/audralia/audralia.topology.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

const TOPOLOGY_LAW = Object.freeze({
  parentRole: "baseline-land-water-only",
  terrainRole: "terrain-pressure-authority",
  topologyRole: "region-relationship-and-elevation-flow-authority",

  ownsTopology: true,
  ownsFinalRender: false,
  ownsTerrainGeneration: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: false,
  ownsRuntime: false,
  visualPassClaimed: false,

  regionCount: 9,
  corridorCount: 16,
  elevationOrdering: "region_1_lowest_to_region_9_highest",
  southPole: "ice_only_boundary",
  northPole: "land_body_topology_anchor",
  terrainDependency: TERRAIN_AUTHORITY
});

const REGIONS = Object.freeze([
  Object.freeze({
    id: 1,
    key: "character",
    name: "Character",
    elevationTier: "low_origin_ground",
    elevation: 0.12,
    anchorLon: -0.42,
    anchorLat: -0.08,
    topologyRole: "origin plain and first stable ground",
    gateType: "entry"
  }),
  Object.freeze({
    id: 2,
    key: "structure",
    name: "Structure",
    elevationTier: "low_plateau",
    elevation: 0.22,
    anchorLon: -0.10,
    anchorLat: 0.08,
    topologyRole: "foundation plateau and first organized rise",
    gateType: "foundation"
  }),
  Object.freeze({
    id: 3,
    key: "balance",
    name: "Balance",
    elevationTier: "basin_transition",
    elevation: 0.32,
    anchorLon: 0.18,
    anchorLat: -0.02,
    topologyRole: "wet-dry transition basin",
    gateType: "transition"
  }),
  Object.freeze({
    id: 4,
    key: "stability",
    name: "Stability",
    elevationTier: "temperate_upland",
    elevation: 0.42,
    anchorLon: 0.54,
    anchorLat: 0.10,
    topologyRole: "repeatable upland route field",
    gateType: "stabilizer"
  }),
  Object.freeze({
    id: 5,
    key: "peace",
    name: "Peace",
    elevationTier: "protected_high_basin",
    elevation: 0.52,
    anchorLon: -0.24,
    anchorLat: -0.24,
    topologyRole: "sheltered basin above lower belts",
    gateType: "sanctuary"
  }),
  Object.freeze({
    id: 6,
    key: "joy",
    name: "Joy",
    elevationTier: "bright_island_highlands",
    elevation: 0.62,
    anchorLon: 0.18,
    anchorLat: -0.48,
    topologyRole: "archipelago uplands and lively island chains",
    gateType: "island_arc"
  }),
  Object.freeze({
    id: 7,
    key: "dignity",
    name: "Dignity",
    elevationTier: "mineral_crownland",
    elevation: 0.72,
    anchorLon: 0.08,
    anchorLat: 0.56,
    topologyRole: "mineral crownland and exposed old pressure",
    gateType: "crown"
  }),
  Object.freeze({
    id: 8,
    key: "free_will",
    name: "Free Will",
    elevationTier: "frontier_ridge_belt",
    elevation: 0.82,
    anchorLon: -0.70,
    anchorLat: 0.22,
    topologyRole: "frontier ridge and open traversal edge",
    gateType: "frontier"
  }),
  Object.freeze({
    id: 9,
    key: "love",
    name: "Love",
    elevationTier: "highest_convergence_summit",
    elevation: 0.92,
    anchorLon: 0.02,
    anchorLat: 0.34,
    topologyRole: "highest convergence summit and route heart",
    gateType: "summit"
  })
]);

const CORRIDORS = Object.freeze([
  Object.freeze({ id: "c01", from: 1, to: 2, role: "origin_to_structure", grade: "low_climb", permeability: 0.94 }),
  Object.freeze({ id: "c02", from: 2, to: 3, role: "structure_to_balance", grade: "basin_entry", permeability: 0.88 }),
  Object.freeze({ id: "c03", from: 3, to: 4, role: "balance_to_stability", grade: "upland_rise", permeability: 0.82 }),
  Object.freeze({ id: "c04", from: 4, to: 7, role: "stability_to_dignity", grade: "mineral_ridge", permeability: 0.68 }),
  Object.freeze({ id: "c05", from: 7, to: 9, role: "dignity_to_love", grade: "crown_to_summit", permeability: 0.58 }),
  Object.freeze({ id: "c06", from: 1, to: 5, role: "character_to_peace", grade: "protected_basin_route", permeability: 0.78 }),
  Object.freeze({ id: "c07", from: 5, to: 6, role: "peace_to_joy", grade: "basin_to_archipelago", permeability: 0.70 }),
  Object.freeze({ id: "c08", from: 6, to: 9, role: "joy_to_love", grade: "island_highland_to_summit", permeability: 0.56 }),
  Object.freeze({ id: "c09", from: 2, to: 8, role: "structure_to_free_will", grade: "foundation_to_frontier", permeability: 0.62 }),
  Object.freeze({ id: "c10", from: 8, to: 9, role: "free_will_to_love", grade: "frontier_to_convergence", permeability: 0.52 }),
  Object.freeze({ id: "c11", from: 3, to: 5, role: "balance_to_peace", grade: "transition_to_shelter", permeability: 0.76 }),
  Object.freeze({ id: "c12", from: 4, to: 9, role: "stability_to_love", grade: "stable_direct_summit_route", permeability: 0.50 }),
  Object.freeze({ id: "c13", from: 7, to: 8, role: "dignity_to_free_will", grade: "crown_frontier_edge", permeability: 0.48 }),
  Object.freeze({ id: "c14", from: 6, to: 3, role: "joy_to_balance", grade: "island_return_to_basin", permeability: 0.66 }),
  Object.freeze({ id: "c15", from: 5, to: 9, role: "peace_to_love", grade: "protected_high_basin_to_summit", permeability: 0.54 }),
  Object.freeze({ id: "c16", from: 8, to: 1, role: "frontier_return_to_origin", grade: "return_path", permeability: 0.46 })
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
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
    coherenceIndex: clamp(
      Number.isFinite(Number(context.coherenceIndex)) ? Number(context.coherenceIndex) : 0.88,
      0,
      1
    ),
    traversalPressure: clamp(
      Number.isFinite(Number(context.traversalPressure)) ? Number(context.traversalPressure) : 0.72,
      0,
      1
    ),
    elevationDemand: clamp(
      Number.isFinite(Number(context.elevationDemand)) ? Number(context.elevationDemand) : 0.76,
      0,
      1
    )
  });
}

function distanceToRegion(lon, lat, region) {
  const dx = wrapLonDistance(lon, region.anchorLon);
  const dy = lat - region.anchorLat;
  return Math.sqrt(dx * dx + dy * dy);
}

function safeTerrainSample(u, v, context = {}) {
  try {
    return sampleTerrainChild(u, v, context);
  } catch (error) {
    return Object.freeze({
      u,
      v,
      lon: u * 2 - 1,
      lat: 1 - v * 2,
      isLand: false,
      isWater: true,
      isIce: false,
      normalizedElevation: -0.42,
      ridge: 0,
      basin: 0,
      coastPressure: 0,
      shelfPermission: 0,
      regionId: 0,
      regionKey: "ocean",
      regionName: "Ocean",
      regionRelativeElevation: 0,
      visualPassClaimed: false
    });
  }
}

function chooseRegion(lon, lat, terrainSample, context) {
  let bestRegion = REGIONS[0];
  let bestScore = -Infinity;

  const terrainElevation = terrainSample && Number.isFinite(Number(terrainSample.normalizedElevation))
    ? clamp(Number(terrainSample.normalizedElevation), 0, 1)
    : 0.28;

  const terrainRegionId = terrainSample && Number.isFinite(Number(terrainSample.regionId))
    ? Number(terrainSample.regionId)
    : 0;

  for (const region of REGIONS) {
    const distance = distanceToRegion(lon, lat, region);
    const proximity = 1 / (0.06 + distance);
    const elevationFit = 1 - Math.abs(region.elevation - terrainElevation);
    const terrainRegionBonus = terrainRegionId === region.id ? 1.25 : 0;
    const access = smoothstep(region.elevation - 0.22, region.elevation + 0.18, context.coherenceIndex);
    const noise = fbm(lon * 2.2 + region.id, lat * 2.2 - region.id, 500 + region.id, 3) * 0.14;

    const score =
      proximity * 0.50 +
      elevationFit * 1.18 +
      terrainRegionBonus +
      access * 0.60 +
      context.elevationDemand * region.elevation * 0.28 +
      noise;

    if (score > bestScore) {
      bestScore = score;
      bestRegion = region;
    }
  }

  return Object.freeze({
    region: bestRegion,
    score: bestScore,
    elevationFit: 1 - Math.abs(bestRegion.elevation - terrainElevation),
    accessStrength: smoothstep(bestRegion.elevation - 0.22, bestRegion.elevation + 0.18, context.coherenceIndex)
  });
}

function corridorDistance(lon, lat, corridor) {
  const from = REGIONS[corridor.from - 1];
  const to = REGIONS[corridor.to - 1];

  if (!from || !to) return Infinity;

  const ax = from.anchorLon;
  const ay = from.anchorLat;
  let bx = to.anchorLon;
  const by = to.anchorLat;

  const dWrap = wrapLonDistance(bx, ax);
  bx = ax + dWrap;

  let px = lon;
  const pWrap = wrapLonDistance(px, ax);
  px = ax + pWrap;

  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = lat - ay;

  const len2 = vx * vx + vy * vy;
  const t = len2 <= 0.00001 ? 0 : clamp((wx * vx + wy * vy) / len2, 0, 1);

  const cx = ax + vx * t;
  const cy = ay + vy * t;

  const dx = px - cx;
  const dy = lat - cy;

  return Math.sqrt(dx * dx + dy * dy);
}

function chooseCorridor(lon, lat, regionChoice, context) {
  let bestCorridor = CORRIDORS[0];
  let bestScore = -Infinity;

  for (const corridor of CORRIDORS) {
    const distance = corridorDistance(lon, lat, corridor);
    const near = 1 / (0.045 + distance);
    const involved =
      corridor.from === regionChoice.region.id || corridor.to === regionChoice.region.id ? 1 : 0;

    const fromRegion = REGIONS[corridor.from - 1];
    const toRegion = REGIONS[corridor.to - 1];
    const climb = Math.abs(toRegion.elevation - fromRegion.elevation);
    const traversalFit = 1 - Math.abs(context.traversalPressure - climb);

    const score =
      near * 0.72 +
      involved * 0.62 +
      traversalFit * 0.24 +
      corridor.permeability * 0.38;

    if (score > bestScore) {
      bestScore = score;
      bestCorridor = corridor;
    }
  }

  return Object.freeze({
    corridor: bestCorridor,
    corridorScore: bestScore,
    corridorPressure: smoothstep(11.5, 21.0, bestScore)
  });
}

function topologySignals(point, terrainSample, context) {
  const regionChoice = chooseRegion(point.lon, point.lat, terrainSample, context);
  const corridorChoice = chooseCorridor(point.lon, point.lat, regionChoice, context);

  const terrainElevation = terrainSample && Number.isFinite(Number(terrainSample.normalizedElevation))
    ? clamp(Number(terrainSample.normalizedElevation), -1, 1)
    : 0;

  const ridgeContinuity = terrainSample && Number.isFinite(Number(terrainSample.ridge))
    ? clamp(Number(terrainSample.ridge), 0, 1)
    : 0;

  const basinContinuity = terrainSample && Number.isFinite(Number(terrainSample.basin))
    ? clamp(Number(terrainSample.basin), 0, 1)
    : 0;

  const coastPressure = terrainSample && Number.isFinite(Number(terrainSample.coastPressure))
    ? clamp(Number(terrainSample.coastPressure), 0, 1)
    : 0;

  const region = regionChoice.region;
  const corridor = corridorChoice.corridor;

  const elevationDelta = clamp(region.elevation - Math.max(0, terrainElevation), -1, 1);
  const climbPressure = clamp(Math.max(0, elevationDelta) * 1.25, 0, 1);
  const descentPressure = clamp(Math.max(0, -elevationDelta) * 0.85, 0, 1);

  const routePressure = clamp(
    corridorChoice.corridorPressure * 0.58 +
      regionChoice.accessStrength * 0.22 +
      context.traversalPressure * 0.20,
    0,
    1
  );

  const watershedPotential = clamp(
    climbPressure * 0.30 +
      ridgeContinuity * 0.26 +
      basinContinuity * 0.22 +
      coastPressure * 0.16 +
      corridorChoice.corridorPressure * 0.14,
    0,
    1
  );

  const topologyIndex = clamp(
    region.elevation * 0.34 +
      routePressure * 0.26 +
      watershedPotential * 0.20 +
      ridgeContinuity * 0.12 +
      regionChoice.elevationFit * 0.08,
    0,
    1
  );

  return Object.freeze({
    region,
    corridor,
    regionChoice,
    corridorChoice,
    terrainElevation,
    elevationDelta,
    climbPressure,
    descentPressure,
    ridgeContinuity,
    basinContinuity,
    coastPressure,
    routePressure,
    watershedPotential,
    topologyIndex
  });
}

function topologyColorInfluence(sample) {
  const elevation = clamp(sample.regionElevation || 0, 0, 1);
  const route = clamp(sample.routePressure || 0, 0, 1);
  const watershed = clamp(sample.watershedPotential || 0, 0, 1);
  const climb = clamp(sample.climbPressure || 0, 0, 1);

  return Object.freeze({
    base: "topology_pressure",
    r: Math.round(mix(92, 236, elevation * 0.74 + climb * 0.18)),
    g: Math.round(mix(118, 204, route * 0.44 + watershed * 0.26)),
    b: Math.round(mix(98, 168, watershed * 0.42)),
    routeAlpha: route,
    watershedAlpha: watershed,
    topologyAlpha: clamp(0.20 + sample.topologyIndex * 0.48, 0, 0.72)
  });
}

export function createTopologyProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    role: "topology-child",

    topologyChild: true,
    ownsTopology: true,
    ownsFinalRender: false,
    ownsTerrainGeneration: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    visualPassClaimed: false,

    regionCount: REGIONS.length,
    corridorCount: CORRIDORS.length,
    elevationOrdering: TOPOLOGY_LAW.elevationOrdering,

    regions: REGIONS,
    corridors: CORRIDORS,
    topologyLaw: TOPOLOGY_LAW,
    terrainStatus: getTerrainStatusChild(),

    ...overrides
  });
}

export function sampleTopology(uInput, vInput, terrainSample = null, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const topologyContext = getInputContext(context);

  const safeTerrain = terrainSample || safeTerrainSample(point.u, point.v, {
    coherenceIndex: topologyContext.coherenceIndex,
    collaborativeExpression: topologyContext.traversalPressure
  });

  const signals = topologySignals(point, safeTerrain, topologyContext);
  const region = signals.region;
  const corridor = signals.corridor;

  const sample = Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    terrainRegionId: safeTerrain.regionId || 0,
    terrainRegionKey: safeTerrain.regionKey || "unknown",
    terrainElevation: signals.terrainElevation,

    regionId: region.id,
    regionKey: region.key,
    regionName: region.name,
    regionElevationTier: region.elevationTier,
    regionElevation: region.elevation,
    regionTopologyRole: region.topologyRole,
    regionGateType: region.gateType,

    corridorId: corridor.id,
    corridorFrom: corridor.from,
    corridorTo: corridor.to,
    corridorRole: corridor.role,
    corridorGrade: corridor.grade,
    corridorPermeability: corridor.permeability,

    elevationDelta: signals.elevationDelta,
    climbPressure: signals.climbPressure,
    descentPressure: signals.descentPressure,
    ridgeContinuity: signals.ridgeContinuity,
    basinContinuity: signals.basinContinuity,
    coastPressure: signals.coastPressure,
    routePressure: signals.routePressure,
    watershedPotential: signals.watershedPotential,
    topologyIndex: signals.topologyIndex,

    coherenceIndex: topologyContext.coherenceIndex,
    traversalPressure: topologyContext.traversalPressure,
    elevationDemand: topologyContext.elevationDemand,

    topologyColorInfluence: null,

    topologyChild: true,
    ownsTopology: true,
    ownsFinalRender: false,
    ownsTerrainGeneration: false,
    visualPassClaimed: false
  });

  return Object.freeze({
    ...sample,
    topologyColorInfluence: topologyColorInfluence(sample)
  });
}

export function buildTopologyField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const terrainField = buildTerrainFieldChild(w, h, options.terrainContext || {});
  const regionCounts = new Map();
  const corridorCounts = new Map();

  let topologySum = 0;
  let routeSum = 0;
  let watershedSum = 0;
  let climbSum = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const terrainSample = terrainField.samples[index] || null;
      const sample = sampleTopology(u, v, terrainSample, options);

      samples[index] = sample;

      regionCounts.set(sample.regionId, (regionCounts.get(sample.regionId) || 0) + 1);
      corridorCounts.set(sample.corridorId, (corridorCounts.get(sample.corridorId) || 0) + 1);

      topologySum += sample.topologyIndex;
      routeSum += sample.routePressure;
      watershedSum += sample.watershedPotential;
      climbSum += sample.climbPressure;
    }
  }

  const activeRegions = Array.from(regionCounts.keys()).sort((a, b) => a - b);
  const activeCorridors = Array.from(corridorCounts.keys()).sort();

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    width: w,
    height: h,
    samples,
    terrainField,
    profile: createTopologyProfile(options.profile || {}),
    stats: Object.freeze({
      activeRegionCount: activeRegions.length,
      expectedRegionCount: REGIONS.length,
      activeRegions,

      activeCorridorCount: activeCorridors.length,
      expectedCorridorCount: CORRIDORS.length,
      activeCorridors,

      averageTopologyIndex: topologySum / samples.length,
      averageRoutePressure: routeSum / samples.length,
      averageWatershedPotential: watershedSum / samples.length,
      averageClimbPressure: climbSum / samples.length,

      terrainConsumed: true,
      elevationOrdered: true,
      topologyChildOnly: true,
      parentMustCompose: true,
      hydrationCanConsumeLater: true
    }),
    topologyChild: true,
    downstreamForTerrain: true,
    downstreamForParentRouteComposition: true,
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
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g2-topology-child-from-confirmed-terrain",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    role: "topology-child",
    topologyChild: true,
    downstreamForTerrain: true,
    downstreamForParentRouteComposition: true,

    regionCount: REGIONS.length,
    corridorCount: CORRIDORS.length,
    elevationOrdering: TOPOLOGY_LAW.elevationOrdering,
    southPole: TOPOLOGY_LAW.southPole,
    northPole: TOPOLOGY_LAW.northPole,

    terrainDependencyConfirmed: true,
    terrainStatus: getTerrainStatusChild(),

    regions: REGIONS,
    corridors: CORRIDORS,

    exports: Object.freeze([
      "createTopologyProfile",
      "sampleTopology",
      "buildTopologyField",
      "getTopologySampleFromField",
      "getTopologyStatus"
    ]),

    ownsTopology: true,
    ownsFinalRender: false,
    ownsTerrainGeneration: false,
    ownsHydration: false,
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
  createTopologyProfile,
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
});
