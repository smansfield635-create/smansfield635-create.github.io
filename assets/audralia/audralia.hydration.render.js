// /assets/audralia/audralia.hydration.render.js
// AUDRALIA_G2_HYDRATION_CHILD_TNT_v1
// Role: second direct downstream child candidate for /assets/audralia/audralia.planet.render.js.
// Scope: hydration/water-system data only.
// Owns: ocean depth, shelf water, coast wetness, drainage permission, basin water potential, lake seats, river path permission, glacial seats, snowpack, dry-channel pressure.
// Consumes: ./audralia.terrain.render.js
// Does not own: terrain, climate, ecology, fauna, runtime, parent globe rendering, route shell, Earth, Sun, Moon, visual pass claim.

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia.terrain.render.js";

const RECEIPT = "AUDRALIA_G2_HYDRATION_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2";
const FILE = "/assets/audralia/audralia.hydration.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_CHILD_PATH = "/assets/audralia/audralia.terrain.render.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
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

function fbm(x, y, seed = 0, octaves = 5) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 37.19) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
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

function getContext(context = {}) {
  return Object.freeze({
    coherenceIndex: Number.isFinite(Number(context.coherenceIndex))
      ? clamp(Number(context.coherenceIndex), 0, 1)
      : 0.92,
    collaborativeExpression: Number.isFinite(Number(context.collaborativeExpression))
      ? clamp(Number(context.collaborativeExpression), 0, 1)
      : 0.88,
    terrain: context.terrain || null,
    terrainField: context.terrainField || null
  });
}

function getTerrainForPoint(u, v, context) {
  if (context.terrain) return context.terrain;

  if (context.terrainField) {
    return getTerrainSampleFromField(context.terrainField, u, v);
  }

  return sampleTerrain(u, v, {
    coherenceIndex: context.coherenceIndex,
    collaborativeExpression: context.collaborativeExpression
  });
}

function drainageVectorFromTerrain(terrain) {
  const lon = Number(terrain.lon) || 0;
  const lat = Number(terrain.lat) || 0;
  const ridge = clamp(terrain.ridge || 0, 0, 1);
  const slope = clamp(terrain.slope || 0, 0, 1);
  const basin = clamp(terrain.basin || 0, 0, 1);
  const coast = clamp(terrain.coastPressure || 0, 0, 1);

  const noiseA = fbm(lon * 4.2 + 3.1, lat * 4.2 - 8.7, 900, 4);
  const noiseB = fbm(lon * 4.2 - 6.8, lat * 4.2 + 2.4, 907, 4);

  const downhillBias = terrain.isLand ? 1 : 0;
  const x = clamp((noiseA - 0.5) * 1.2 + Math.sign(lon || 0.01) * coast * 0.28, -1, 1);
  const y = clamp((noiseB - 0.5) * 1.2 - Math.sign(lat || 0.01) * ridge * 0.18, -1, 1);
  const magnitude = clamp(slope * 0.52 + ridge * 0.24 + coast * 0.2 - basin * 0.16, 0, 1) * downhillBias;
  const angleDeg = Math.atan2(y, x) * 180 / Math.PI;

  return Object.freeze({
    x,
    y,
    magnitude,
    angleDeg
  });
}

function classifyWaterBody(terrain, oceanDepth, lakeSeat, riverPermission, glacialSeat) {
  if (terrain.isWater) {
    if (terrain.shelfPermission > 0.58) return "shallow_shelf_sea";
    if (oceanDepth > 0.72) return "deep_ocean";
    return "open_ocean";
  }

  if (glacialSeat > 0.58) return "glacial_storage";
  if (lakeSeat > 0.62) return "lake_basin";
  if (riverPermission > 0.62) return "river_corridor";
  if (terrain.dryInteriorPressure > 0.58) return "dry_wash_permission";

  return "land_hydration_potential";
}

function computeHydration(terrain) {
  const isWater = terrain.isWater === true;
  const isLand = terrain.isLand === true;

  const elevation = clamp(terrain.normalizedElevation || 0, -1, 1);
  const oceanDepth = isWater
    ? clamp(Math.abs(elevation) * 0.72 + (1 - clamp(terrain.shelfPermission || 0, 0, 1)) * 0.36, 0, 1)
    : 0;

  const shelfWater = isWater
    ? clamp((terrain.shelfPermission || 0) * 0.82 + (terrain.coastPressure || 0) * 0.22, 0, 1)
    : clamp((terrain.coastPressure || 0) * 0.18, 0, 1);

  const coastalWetness = clamp((terrain.coastPressure || 0) * 0.82 + shelfWater * 0.22, 0, 1);

  const drainage = drainageVectorFromTerrain(terrain);

  const basinWaterPotential = isLand
    ? clamp((terrain.basin || 0) * 0.72 + (1 - (terrain.dryInteriorPressure || 0)) * 0.18 + coastalWetness * 0.08, 0, 1)
    : 0;

  const lakeSeat = isLand
    ? clamp(basinWaterPotential * 0.72 + (1 - (terrain.slope || 0)) * 0.22 - (terrain.ridge || 0) * 0.16, 0, 1)
    : 0;

  const riverPathPermission = isLand
    ? clamp(
        drainage.magnitude * 0.48 +
          (terrain.slope || 0) * 0.26 +
          basinWaterPotential * 0.22 +
          coastalWetness * 0.18 -
          (terrain.dryInteriorPressure || 0) * 0.2,
        0,
        1
      )
    : 0;

  const polarPressure = clamp(terrain.polarSeat || 0, 0, 1);
  const highlandPressure = clamp((terrain.ridge || 0) * smoothstep(0.46, 0.86, terrain.normalizedElevation || 0), 0, 1);

  const glacialSeat = isLand
    ? clamp(polarPressure * 0.72 + highlandPressure * 0.38 + (terrain.summitExpressionWeight || 0) * 0.08, 0, 1)
    : 0;

  const snowpack = isLand
    ? clamp(glacialSeat * 0.72 + highlandPressure * 0.22 + polarPressure * 0.18, 0, 1)
    : 0;

  const wetlandSeat = isLand
    ? clamp(lakeSeat * 0.42 + coastalWetness * 0.34 + basinWaterPotential * 0.28 - (terrain.slope || 0) * 0.18, 0, 1)
    : 0;

  const dryChannelPressure = isLand
    ? clamp((terrain.dryInteriorPressure || 0) * 0.58 + drainage.magnitude * 0.22 + (terrain.slope || 0) * 0.18, 0, 1)
    : 0;

  const aquiferPotential = isLand
    ? clamp(basinWaterPotential * 0.32 + lakeSeat * 0.22 + coastalWetness * 0.16 + (1 - (terrain.slope || 0)) * 0.12, 0, 1)
    : 0;

  const waterMovement = clamp(
    oceanDepth * 0.2 +
      shelfWater * 0.22 +
      riverPathPermission * 0.26 +
      drainage.magnitude * 0.26 +
      glacialSeat * 0.12,
    0,
    1
  );

  const waterSystemStrength = clamp(
    (isWater ? oceanDepth * 0.44 + shelfWater * 0.32 : 0) +
      (isLand ? basinWaterPotential * 0.22 + riverPathPermission * 0.22 + lakeSeat * 0.18 + glacialSeat * 0.2 : 0),
    0,
    1
  );

  const waterBodyClass = classifyWaterBody(terrain, oceanDepth, lakeSeat, riverPathPermission, glacialSeat);

  return Object.freeze({
    isWater,
    isLand,
    oceanDepth,
    shelfWater,
    coastalWetness,
    drainageVector: drainage,
    basinWaterPotential,
    lakeSeat,
    riverPathPermission,
    glacialSeat,
    snowpack,
    wetlandSeat,
    dryChannelPressure,
    aquiferPotential,
    waterMovement,
    waterSystemStrength,
    waterBodyClass
  });
}

export function createHydrationProfile(overrides = {}) {
  const terrainStatus = getTerrainStatus();

  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,
    terrainStatus,

    role: "audralia-g2-hydration-child",
    hydrationChild: true,
    downstreamForParent: true,

    ownsHydration: true,
    ownsTerrain: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    expectedDependencies: Object.freeze(["terrain"]),
    exports: Object.freeze([
      "createHydrationProfile",
      "sampleHydration",
      "buildHydrationField",
      "getHydrationSampleFromField",
      "getHydrationStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false,

    ...overrides
  });
}

export function sampleHydration(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const ctx = getContext(context);
  const terrain = getTerrainForPoint(point.u, point.v, ctx);
  const hydration = computeHydration(terrain);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    terrainDependencyUsed: true,
    terrainReceipt: terrain.receipt || "terrain-sample",
    terrainLandBodyId: terrain.landBodyId,
    terrainLandBodyName: terrain.landBodyName,
    terrainSummitRegionId: terrain.summitRegionId,
    terrainSummitRegionName: terrain.summitRegionName,

    isWater: hydration.isWater,
    isLand: hydration.isLand,
    oceanDepth: hydration.oceanDepth,
    shelfWater: hydration.shelfWater,
    coastalWetness: hydration.coastalWetness,
    drainageVector: hydration.drainageVector,
    basinWaterPotential: hydration.basinWaterPotential,
    lakeSeat: hydration.lakeSeat,
    riverPathPermission: hydration.riverPathPermission,
    glacialSeat: hydration.glacialSeat,
    snowpack: hydration.snowpack,
    wetlandSeat: hydration.wetlandSeat,
    dryChannelPressure: hydration.dryChannelPressure,
    aquiferPotential: hydration.aquiferPotential,
    waterMovement: hydration.waterMovement,
    waterSystemStrength: hydration.waterSystemStrength,
    waterBodyClass: hydration.waterBodyClass,

    hydrationChild: true,
    downstreamForParent: true,
    ownsHydration: true,
    ownsFinalRender: false,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function buildHydrationField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));

  const terrainField = options.terrainField || buildTerrainField(w, h, {
    coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
    collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
  });

  const samples = new Array(w * h);
  const waterClassCounts = new Map();

  let oceanSamples = 0;
  let landSamples = 0;
  let shelfSamples = 0;
  let riverPermissionSamples = 0;
  let lakeSeatSamples = 0;
  let glacialSeatSamples = 0;
  let wetlandSeatSamples = 0;
  let dryChannelSamples = 0;

  let oceanDepthSum = 0;
  let waterStrengthSum = 0;
  let movementSum = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const terrain = getTerrainSampleFromField(terrainField, u, v);
      const sample = sampleHydration(u, v, {
        terrain,
        terrainField,
        coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
        collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
      });

      const index = y * w + x;
      samples[index] = sample;

      waterClassCounts.set(
        sample.waterBodyClass,
        (waterClassCounts.get(sample.waterBodyClass) || 0) + 1
      );

      if (sample.isWater) {
        oceanSamples += 1;
        oceanDepthSum += sample.oceanDepth;
      } else {
        landSamples += 1;
      }

      if (sample.shelfWater > 0.48) shelfSamples += 1;
      if (sample.riverPathPermission > 0.58) riverPermissionSamples += 1;
      if (sample.lakeSeat > 0.58) lakeSeatSamples += 1;
      if (sample.glacialSeat > 0.58) glacialSeatSamples += 1;
      if (sample.wetlandSeat > 0.58) wetlandSeatSamples += 1;
      if (sample.dryChannelPressure > 0.58) dryChannelSamples += 1;

      waterStrengthSum += sample.waterSystemStrength;
      movementSum += sample.waterMovement;
    }
  }

  const total = samples.length;

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,

    width: w,
    height: h,
    samples,
    terrainField,
    profile: createHydrationProfile(options.profile || {}),

    stats: Object.freeze({
      totalSamples: total,
      oceanSamples,
      landSamples,
      oceanRatio: oceanSamples / total,
      landRatio: landSamples / total,
      shelfSamples,
      shelfRatio: shelfSamples / total,
      riverPermissionSamples,
      riverPermissionRatio: riverPermissionSamples / Math.max(1, landSamples),
      lakeSeatSamples,
      lakeSeatRatio: lakeSeatSamples / Math.max(1, landSamples),
      glacialSeatSamples,
      glacialSeatRatio: glacialSeatSamples / Math.max(1, landSamples),
      wetlandSeatSamples,
      wetlandSeatRatio: wetlandSeatSamples / Math.max(1, landSamples),
      dryChannelSamples,
      dryChannelRatio: dryChannelSamples / Math.max(1, landSamples),
      averageOceanDepth: oceanDepthSum / Math.max(1, oceanSamples),
      averageWaterSystemStrength: waterStrengthSum / total,
      averageWaterMovement: movementSum / total,
      activeWaterClasses: Array.from(waterClassCounts.keys()).sort(),
      activeWaterClassCount: waterClassCounts.size
    }),

    hydrationChild: true,
    downstreamForParent: true,
    parentMustCompose: true,
    terrainDependencyUsed: true,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function getHydrationSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleHydration(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getHydrationStatus() {
  const terrainStatus = getTerrainStatus();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g2-hydration-child",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,
    terrainStatus,

    role: "hydration-child",
    hydrationChild: true,
    downstreamForParent: true,
    terrainDependencyUsed: true,

    ownsHydration: true,
    ownsTerrain: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    exports: Object.freeze([
      "createHydrationProfile",
      "sampleHydration",
      "buildHydrationField",
      "getHydrationSampleFromField",
      "getHydrationStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createHydrationProfile,
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
});
