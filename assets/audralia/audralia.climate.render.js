// /assets/audralia/audralia.climate.render.js
// AUDRALIA_G2_CLIMATE_CHILD_TNT_v1
// Role: second G2 downstream child candidate for /assets/audralia/audralia.planet.render.js.
// Scope: climate-system data only.
// Owns: temperature bands, pressure bands, wind belts, moisture movement, rain-shadow logic, arid/interior logic, polar/subpolar logic, mountain snowline pressure, climate-region readiness.
// Consumes: ./audralia.terrain.render.js and ./audralia.hydration.render.js
// Does not own: terrain, hydration, ecology, fauna, runtime, parent globe rendering, route shell, Earth, Sun, Moon, visual pass claim.

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia.terrain.render.js";

import {
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
} from "./audralia.hydration.render.js";

const RECEIPT = "AUDRALIA_G2_CLIMATE_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2";
const FILE = "/assets/audralia/audralia.climate.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_CHILD_PATH = "/assets/audralia/audralia.terrain.render.js";
const HYDRATION_CHILD_PATH = "/assets/audralia/audralia.hydration.render.js";

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
    total += valueNoise(x * frequency, y * frequency, seed + i * 41.13) * amplitude;
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
    hydration: context.hydration || null,
    terrainField: context.terrainField || null,
    hydrationField: context.hydrationField || null
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

function getHydrationForPoint(u, v, terrain, context) {
  if (context.hydration) return context.hydration;

  if (context.hydrationField) {
    return getHydrationSampleFromField(context.hydrationField, u, v);
  }

  return sampleHydration(u, v, {
    terrain,
    terrainField: context.terrainField,
    coherenceIndex: context.coherenceIndex,
    collaborativeExpression: context.collaborativeExpression
  });
}

function classifyThermalBand(absLat, elevation, polarSeat) {
  if (polarSeat > 0.58 || absLat > 0.78) return "polar";
  if (absLat > 0.58) return "subpolar";
  if (elevation > 0.68) return "alpine";
  if (absLat < 0.22) return "equatorial";
  if (absLat < 0.46) return "subtropical";
  return "temperate";
}

function classifyMoistureBand(moistureIndex, aridityIndex, hydration) {
  if (hydration.isWater) return "marine";
  if (moistureIndex > 0.74) return "wet";
  if (moistureIndex > 0.52) return "humid";
  if (aridityIndex > 0.72) return "arid";
  if (aridityIndex > 0.52) return "semi_arid";
  return "seasonal";
}

function classifyClimateRegion(thermalBand, moistureBand, terrain, hydration) {
  if (hydration.isWater) {
    if (hydration.oceanDepth > 0.68) return "deep_ocean_climate";
    if (hydration.shelfWater > 0.56) return "shelf_marine_climate";
    return "open_marine_climate";
  }

  if (thermalBand === "polar") return "polar_ice_climate";
  if (thermalBand === "subpolar") return "subpolar_coastal_or_highland_climate";
  if (thermalBand === "alpine") return "alpine_mountain_climate";

  if (moistureBand === "wet" || moistureBand === "humid") {
    if (terrain.basin > 0.52) return "humid_basin_climate";
    if (terrain.coastPressure > 0.48) return "humid_coastal_climate";
    return "humid_interior_climate";
  }

  if (moistureBand === "arid") {
    if (terrain.dryInteriorPressure > 0.64) return "deep_dry_interior_climate";
    return "arid_rain_shadow_climate";
  }

  if (moistureBand === "semi_arid") return "semi_arid_transition_climate";

  return "temperate_seasonal_climate";
}

function windVectorForPoint(terrain, hydration) {
  const lon = Number(terrain.lon) || 0;
  const lat = Number(terrain.lat) || 0;
  const absLat = Math.abs(lat);
  const ridge = clamp(terrain.ridge || 0, 0, 1);
  const coast = clamp(terrain.coastPressure || 0, 0, 1);
  const waterMovement = clamp(hydration.waterMovement || 0, 0, 1);

  const tradeFlow = absLat < 0.34 ? -Math.sign(lat || 0.01) * 0.48 : 0;
  const westerlyFlow = absLat >= 0.34 && absLat < 0.68 ? Math.sign(lat || 0.01) * 0.42 : 0;
  const polarFlow = absLat >= 0.68 ? -Math.sign(lat || 0.01) * 0.34 : 0;

  const turbulence = (fbm(lon * 5.1 + 2.4, lat * 5.1 - 8.3, 1200, 4) - 0.5) * 0.34;

  const x = clamp(tradeFlow + westerlyFlow + polarFlow + turbulence + coast * 0.12, -1, 1);
  const y = clamp((fbm(lon * 4.4 - 4.8, lat * 4.4 + 1.9, 1207, 4) - 0.5) * 0.68 - ridge * 0.14 + waterMovement * 0.12, -1, 1);
  const magnitude = clamp(Math.sqrt(x * x + y * y) * (0.52 + coast * 0.18 + ridge * 0.14), 0, 1);
  const angleDeg = Math.atan2(y, x) * 180 / Math.PI;

  return Object.freeze({
    x,
    y,
    magnitude,
    angleDeg
  });
}

function computeClimate(terrain, hydration) {
  const lat = Number(terrain.lat) || 0;
  const absLat = Math.abs(lat);
  const elevation = clamp(terrain.normalizedElevation || 0, 0, 1);
  const ridge = clamp(terrain.ridge || 0, 0, 1);
  const basin = clamp(terrain.basin || 0, 0, 1);
  const dryInterior = clamp(terrain.dryInteriorPressure || 0, 0, 1);
  const polarSeat = clamp(terrain.polarSeat || 0, 0, 1);
  const coastalWetness = clamp(hydration.coastalWetness || 0, 0, 1);
  const waterStrength = clamp(hydration.waterSystemStrength || 0, 0, 1);
  const snowpack = clamp(hydration.snowpack || 0, 0, 1);
  const glacialSeat = clamp(hydration.glacialSeat || 0, 0, 1);
  const oceanDepth = clamp(hydration.oceanDepth || 0, 0, 1);

  const equatorialHeat = 1 - smoothstep(0.08, 0.82, absLat);
  const polarCold = smoothstep(0.58, 0.96, absLat);
  const altitudeCooling = terrain.isLand ? clamp(elevation * 0.44 + ridge * 0.2, 0, 1) : 0;
  const marineModeration = hydration.isWater ? clamp(0.44 + oceanDepth * 0.36, 0, 1) : coastalWetness * 0.24;

  const temperatureIndex = clamp(
    equatorialHeat * 0.78 +
      (1 - polarCold) * 0.18 +
      marineModeration * 0.08 -
      altitudeCooling * 0.28 -
      polarSeat * 0.34 -
      snowpack * 0.16,
    0,
    1
  );

  const pressureNoise = fbm(terrain.lon * 3.6 + 7.4, terrain.lat * 3.6 - 3.2, 1300, 5);
  const pressureBand = clamp(
    0.52 +
      (0.5 - temperatureIndex) * 0.22 +
      polarCold * 0.18 -
      equatorialHeat * 0.14 +
      (pressureNoise - 0.5) * 0.18,
    0,
    1
  );

  const windVector = windVectorForPoint(terrain, hydration);

  const moistureNoise = fbm(terrain.lon * 4.8 - 1.1, terrain.lat * 4.8 + 9.7, 1400, 5);
  const orographicLift = terrain.isLand
    ? clamp(ridge * windVector.magnitude * 0.72 + terrain.slope * 0.18, 0, 1)
    : 0;

  const rainShadow = terrain.isLand
    ? clamp(ridge * (1 - coastalWetness) * 0.72 + dryInterior * 0.34, 0, 1)
    : 0;

  const moistureIndex = clamp(
    waterStrength * 0.38 +
      coastalWetness * 0.34 +
      basin * 0.18 +
      orographicLift * 0.18 +
      moistureNoise * 0.18 -
      rainShadow * 0.28 -
      dryInterior * 0.2,
    0,
    1
  );

  const precipitationIndex = clamp(
    moistureIndex * 0.58 +
      orographicLift * 0.24 +
      pressureBand * 0.12 -
      rainShadow * 0.2,
    0,
    1
  );

  const aridityIndex = clamp(
    dryInterior * 0.56 +
      (1 - moistureIndex) * 0.36 +
      temperatureIndex * 0.18 -
      basin * 0.08 -
      coastalWetness * 0.18,
    0,
    1
  );

  const snowlinePressure = terrain.isLand
    ? clamp(
        altitudeCooling * 0.46 +
          polarCold * 0.38 +
          glacialSeat * 0.22 +
          precipitationIndex * 0.1 -
          temperatureIndex * 0.18,
        0,
        1
      )
    : 0;

  const stormTrackPotential = clamp(
    windVector.magnitude * 0.3 +
      pressureBand * 0.2 +
      moistureIndex * 0.22 +
      coastalWetness * 0.16 +
      Math.abs(temperatureIndex - pressureBand) * 0.18,
    0,
    1
  );

  const seasonalAmplitude = clamp(
    absLat * 0.42 +
      terrain.isLand * 0.18 +
      dryInterior * 0.16 -
      marineModeration * 0.24,
    0,
    1
  );

  const thermalBand = classifyThermalBand(absLat, elevation, polarSeat);
  const moistureBand = classifyMoistureBand(moistureIndex, aridityIndex, hydration);
  const climateRegion = classifyClimateRegion(thermalBand, moistureBand, terrain, hydration);

  return Object.freeze({
    temperatureIndex,
    pressureBand,
    windVector,
    moistureIndex,
    precipitationIndex,
    aridityIndex,
    rainShadow,
    orographicLift,
    snowlinePressure,
    stormTrackPotential,
    seasonalAmplitude,
    marineModeration,
    thermalBand,
    moistureBand,
    climateRegion
  });
}

export function createClimateProfile(overrides = {}) {
  const terrainStatus = getTerrainStatus();
  const hydrationStatus = getHydrationStatus();

  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,
    hydrationChildPath: HYDRATION_CHILD_PATH,
    terrainStatus,
    hydrationStatus,

    role: "audralia-g2-climate-child",
    climateChild: true,
    downstreamForParent: true,

    ownsClimate: true,
    ownsTerrain: false,
    ownsHydration: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    expectedDependencies: Object.freeze(["terrain", "hydration"]),
    exports: Object.freeze([
      "createClimateProfile",
      "sampleClimate",
      "buildClimateField",
      "getClimateSampleFromField",
      "getClimateStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false,

    ...overrides
  });
}

export function sampleClimate(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const ctx = getContext(context);
  const terrain = getTerrainForPoint(point.u, point.v, ctx);
  const hydration = getHydrationForPoint(point.u, point.v, terrain, ctx);
  const climate = computeClimate(terrain, hydration);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,
    hydrationChildPath: HYDRATION_CHILD_PATH,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    terrainDependencyUsed: true,
    hydrationDependencyUsed: true,
    terrainReceipt: terrain.receipt || "terrain-sample",
    hydrationReceipt: hydration.receipt || "hydration-sample",

    terrainLandBodyId: terrain.landBodyId,
    terrainLandBodyName: terrain.landBodyName,
    terrainSummitRegionId: terrain.summitRegionId,
    terrainSummitRegionName: terrain.summitRegionName,

    waterBodyClass: hydration.waterBodyClass,
    oceanDepth: hydration.oceanDepth,
    coastalWetness: hydration.coastalWetness,
    waterMovement: hydration.waterMovement,
    glacialSeat: hydration.glacialSeat,
    snowpack: hydration.snowpack,

    temperatureIndex: climate.temperatureIndex,
    pressureBand: climate.pressureBand,
    windVector: climate.windVector,
    moistureIndex: climate.moistureIndex,
    precipitationIndex: climate.precipitationIndex,
    aridityIndex: climate.aridityIndex,
    rainShadow: climate.rainShadow,
    orographicLift: climate.orographicLift,
    snowlinePressure: climate.snowlinePressure,
    stormTrackPotential: climate.stormTrackPotential,
    seasonalAmplitude: climate.seasonalAmplitude,
    marineModeration: climate.marineModeration,
    thermalBand: climate.thermalBand,
    moistureBand: climate.moistureBand,
    climateRegion: climate.climateRegion,

    climateChild: true,
    downstreamForParent: true,
    ownsClimate: true,
    ownsFinalRender: false,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function buildClimateField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));

  const terrainField = options.terrainField || buildTerrainField(w, h, {
    coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
    collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
  });

  const hydrationField = options.hydrationField || buildHydrationField(w, h, {
    terrainField,
    coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
    collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
  });

  const samples = new Array(w * h);
  const climateRegionCounts = new Map();
  const thermalBandCounts = new Map();
  const moistureBandCounts = new Map();

  let temperatureSum = 0;
  let moistureSum = 0;
  let precipitationSum = 0;
  let ariditySum = 0;
  let stormTrackSum = 0;
  let snowlineSamples = 0;
  let rainShadowSamples = 0;
  let humidSamples = 0;
  let aridSamples = 0;
  let polarSamples = 0;
  let marineSamples = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);

      const terrain = getTerrainSampleFromField(terrainField, u, v);
      const hydration = getHydrationSampleFromField(hydrationField, u, v);
      const sample = sampleClimate(u, v, {
        terrain,
        hydration,
        terrainField,
        hydrationField,
        coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
        collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
      });

      const index = y * w + x;
      samples[index] = sample;

      climateRegionCounts.set(
        sample.climateRegion,
        (climateRegionCounts.get(sample.climateRegion) || 0) + 1
      );

      thermalBandCounts.set(
        sample.thermalBand,
        (thermalBandCounts.get(sample.thermalBand) || 0) + 1
      );

      moistureBandCounts.set(
        sample.moistureBand,
        (moistureBandCounts.get(sample.moistureBand) || 0) + 1
      );

      temperatureSum += sample.temperatureIndex;
      moistureSum += sample.moistureIndex;
      precipitationSum += sample.precipitationIndex;
      ariditySum += sample.aridityIndex;
      stormTrackSum += sample.stormTrackPotential;

      if (sample.snowlinePressure > 0.52) snowlineSamples += 1;
      if (sample.rainShadow > 0.52) rainShadowSamples += 1;
      if (sample.moistureIndex > 0.58) humidSamples += 1;
      if (sample.aridityIndex > 0.58) aridSamples += 1;
      if (sample.thermalBand === "polar" || sample.thermalBand === "subpolar") polarSamples += 1;
      if (sample.moistureBand === "marine") marineSamples += 1;
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
    hydrationChildPath: HYDRATION_CHILD_PATH,

    width: w,
    height: h,
    samples,
    terrainField,
    hydrationField,
    profile: createClimateProfile(options.profile || {}),

    stats: Object.freeze({
      totalSamples: total,
      averageTemperatureIndex: temperatureSum / total,
      averageMoistureIndex: moistureSum / total,
      averagePrecipitationIndex: precipitationSum / total,
      averageAridityIndex: ariditySum / total,
      averageStormTrackPotential: stormTrackSum / total,
      snowlineSamples,
      snowlineRatio: snowlineSamples / total,
      rainShadowSamples,
      rainShadowRatio: rainShadowSamples / total,
      humidSamples,
      humidRatio: humidSamples / total,
      aridSamples,
      aridRatio: aridSamples / total,
      polarSamples,
      polarRatio: polarSamples / total,
      marineSamples,
      marineRatio: marineSamples / total,
      activeClimateRegions: Array.from(climateRegionCounts.keys()).sort(),
      activeClimateRegionCount: climateRegionCounts.size,
      activeThermalBands: Array.from(thermalBandCounts.keys()).sort(),
      activeThermalBandCount: thermalBandCounts.size,
      activeMoistureBands: Array.from(moistureBandCounts.keys()).sort(),
      activeMoistureBandCount: moistureBandCounts.size
    }),

    climateChild: true,
    downstreamForParent: true,
    parentMustCompose: true,
    terrainDependencyUsed: true,
    hydrationDependencyUsed: true,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function getClimateSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleClimate(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getClimateStatus() {
  const terrainStatus = getTerrainStatus();
  const hydrationStatus = getHydrationStatus();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g2-climate-child",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    terrainChildPath: TERRAIN_CHILD_PATH,
    hydrationChildPath: HYDRATION_CHILD_PATH,
    terrainStatus,
    hydrationStatus,

    role: "climate-child",
    climateChild: true,
    downstreamForParent: true,
    terrainDependencyUsed: true,
    hydrationDependencyUsed: true,

    ownsClimate: true,
    ownsTerrain: false,
    ownsHydration: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    exports: Object.freeze([
      "createClimateProfile",
      "sampleClimate",
      "buildClimateField",
      "getClimateSampleFromField",
      "getClimateStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createClimateProfile,
  sampleClimate,
  buildClimateField,
  getClimateSampleFromField,
  getClimateStatus
});
