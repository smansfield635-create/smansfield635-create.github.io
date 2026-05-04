// /assets/audralia.planet.render-ecology.js
// AUDRALIA_G1_PLANET_RENDER_ECOLOGY_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Upstream dependencies:
//   /assets/audralia.planet.render-topography.js
//   /assets/audralia.planet.render-hydration.js
//   /assets/audralia.planet.render-climate.js
// Role: direct downstream ecology/foliage child for Audralia planet render.
// Scope: biome and vegetation science only. No fauna, HTML, route, Earth, Sun, Moon, or final rendering.

import {
  buildTopographyField,
  getTopographySampleFromField,
  sampleTopography
} from "/assets/audralia.planet.render-topography.js";

import {
  buildHydrationField,
  getHydrationSampleFromField,
  sampleHydration
} from "/assets/audralia.planet.render-hydration.js";

import {
  buildClimateField,
  getClimateSampleFromField,
  sampleClimate
} from "/assets/audralia.planet.render-climate.js";

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_ECOLOGY_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-ecology.js";

const TOPOGRAPHY_CHILD_FILE = "/assets/audralia.planet.render-topography.js";
const HYDRATION_CHILD_FILE = "/assets/audralia.planet.render-hydration.js";
const CLIMATE_CHILD_FILE = "/assets/audralia.planet.render-climate.js";

const DEFAULT_PROFILE = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  childFile: CHILD_FILE,
  upstreamTopography: TOPOGRAPHY_CHILD_FILE,
  upstreamHydration: HYDRATION_CHILD_FILE,
  upstreamClimate: CLIMATE_CHILD_FILE,
  layer: "ecology",

  lattice: 256,

  minimumPlantTemperatureC: -8,
  optimalPlantTemperatureC: 21,
  maximumPlantTemperatureC: 38,
  minimumVegetationPrecipitationMm: 160,
  denseForestPrecipitationMm: 1350,
  alpineTreeLineMeters: 3600,
  desertAridityThreshold: 0.68,

  ownsTopography: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: true,
  ownsFauna: false,
  ownsRoute: false,
  ownsHtml: false,
  ownsFinalRender: false
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeInput(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
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

  return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy;
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.31) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function resolveInputs(u, v, options, profile) {
  const topographyField = options.topographyField || null;
  const hydrationField = options.hydrationField || null;
  const climateField = options.climateField || null;

  const topography = options.topographySample ||
    (topographyField
      ? getTopographySampleFromField(topographyField, u, v)
      : sampleTopography(u, v));

  const hydration = options.hydrationSample ||
    (hydrationField
      ? getHydrationSampleFromField(hydrationField, u, v)
      : sampleHydration(u, v, {
          profile: { lattice: profile.lattice },
          topographySample: topography
        }));

  const climate = options.climateSample ||
    (climateField
      ? getClimateSampleFromField(climateField, u, v)
      : sampleClimate(u, v, {
          profile: { lattice: profile.lattice },
          topographySample: topography,
          hydrationSample: hydration
        }));

  return Object.freeze({ topography, hydration, climate });
}

function temperatureSuitability(temperatureC, profile) {
  const low = smoothstep(
    profile.minimumPlantTemperatureC,
    profile.optimalPlantTemperatureC,
    temperatureC
  );

  const high = 1 - smoothstep(
    profile.optimalPlantTemperatureC,
    profile.maximumPlantTemperatureC,
    temperatureC
  );

  return clamp(low * high * 1.35, 0, 1);
}

function moistureSuitability(climate, hydration, profile) {
  const precipitation = smoothstep(
    profile.minimumVegetationPrecipitationMm,
    profile.denseForestPrecipitationMm,
    climate.precipitationMm
  );

  const waterAccess = clamp(
    hydration.wetEdgePermission * 0.38 +
    hydration.riverPermission * 0.28 +
    hydration.lakePermission * 0.24 +
    hydration.coastalPermission * 0.12,
    0,
    1
  );

  const drynessPenalty = clamp(climate.aridity / profile.desertAridityThreshold, 0, 1);

  return clamp(precipitation * 0.72 + waterAccess * 0.34 - drynessPenalty * 0.38, 0, 1);
}

function altitudeSuitability(topography, profile) {
  if (topography.elevationMeters <= 0) return 0;

  const lowland = 1 - smoothstep(profile.alpineTreeLineMeters, 6200, topography.elevationMeters);
  const slopePenalty = 1 - clamp(topography.slope * 0.48, 0, 0.62);

  return clamp(lowland * slopePenalty, 0, 1);
}

function classifyBiome(topography, hydration, climate, vegetationDensity, canopyPotential, rootAccess) {
  if (hydration.isOcean) return "marine_surface";
  if (hydration.glacierPermission > 0.64 || climate.frostPermission > 0.82) return "ice_ecology";
  if (topography.elevationMeters > 4200 && climate.temperatureC < 8) return "alpine_sparse";
  if (vegetationDensity < 0.12 && climate.aridity > 0.72) return "desert_bare";
  if (vegetationDensity < 0.22) return "dry_scrub";
  if (vegetationDensity < 0.42 && climate.temperatureC <= 6) return "tundra_moss";
  if (vegetationDensity < 0.42) return "grassland_steppe";
  if (canopyPotential > 0.68 && climate.temperatureC >= 22) return "warm_rainforest";
  if (canopyPotential > 0.58 && climate.temperatureC >= 12) return "temperate_forest";
  if (canopyPotential > 0.48 && climate.temperatureC < 12) return "boreal_forest";
  if (rootAccess > 0.58 && hydration.wetEdgePermission > 0.54) return "wetland_biome";
  return "mixed_woodland";
}

function classifyVegetationBand(climate, topography) {
  if (topography.elevationMeters > 4200) return "alpine_band";
  if (Math.abs(topography.lat) > 0.72) return "polar_subpolar_band";
  if (Math.abs(topography.lat) < 0.24 && climate.temperatureC > 22) return "equatorial_band";
  if (Math.abs(topography.lat) < 0.52) return "temperate_band";
  return "cool_latitude_band";
}

export function createEcologyProfile(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_PROFILE,
    ...overrides,
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    upstreamClimate: CLIMATE_CHILD_FILE,
    layer: "ecology"
  });
}

export function sampleEcology(u, v, options = {}) {
  const profile = createEcologyProfile(options.profile || {});
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const { topography, hydration, climate } = resolveInputs(safeU, safeV, options, profile);

  const habitatNoise = fbm(topography.lon * 8.2 + 17.4, topography.lat * 8.2 - 6.1, 801, 5);
  const textureNoise = fbm(topography.lon * 17.0 - 5.2, topography.lat * 17.0 + 4.4, 809, 4);

  const tempFit = temperatureSuitability(climate.temperatureC, profile);
  const moistureFit = moistureSuitability(climate, hydration, profile);
  const altitudeFit = altitudeSuitability(topography, profile);

  const landPermission = topography.elevationMeters > 0 && !hydration.isOcean ? 1 : 0;
  const icePenalty = 1 - clamp(Math.max(hydration.glacierPermission, climate.frostPermission * 0.74), 0, 1);

  const rootAccess = clamp(
    moistureFit * 0.42 +
    hydration.riverPermission * 0.24 +
    hydration.lakePermission * 0.2 +
    hydration.wetEdgePermission * 0.14 -
    topography.slope * 0.16,
    0,
    1
  );

  const soilDevelopment = clamp(
    altitudeFit * 0.35 +
    moistureFit * 0.3 +
    (1 - topography.slope) * 0.22 +
    habitatNoise * 0.13,
    0,
    1
  );

  const vegetationDensity = clamp(
    landPermission *
    icePenalty *
    (tempFit * 0.32 + moistureFit * 0.32 + altitudeFit * 0.18 + soilDevelopment * 0.18) *
    (0.82 + habitatNoise * 0.28),
    0,
    1
  );

  const canopyPotential = clamp(
    vegetationDensity *
    smoothstep(700, 1600, climate.precipitationMm) *
    (1 - climate.aridity * 0.68) *
    (1 - topography.slope * 0.28),
    0,
    1
  );

  const grasslandPotential = clamp(
    vegetationDensity *
    (1 - canopyPotential * 0.54) *
    smoothstep(180, 760, climate.precipitationMm) *
    (0.75 + textureNoise * 0.25),
    0,
    1
  );

  const wetlandPotential = clamp(
    landPermission *
    (hydration.wetEdgePermission * 0.44 +
      hydration.lakePermission * 0.28 +
      hydration.riverPermission * 0.3) *
    (1 - topography.slope * 0.52) *
    tempFit,
    0,
    1
  );

  const desertScrubPotential = clamp(
    landPermission *
    climate.aridity *
    smoothstep(0.05, 0.38, vegetationDensity) *
    (1 - canopyPotential),
    0,
    1
  );

  const mossLichenPotential = clamp(
    landPermission *
    climate.frostPermission *
    moistureFit *
    (1 - canopyPotential * 0.8) *
    (1 - hydration.glacierPermission * 0.62),
    0,
    1
  );

  const biome = classifyBiome(
    topography,
    hydration,
    climate,
    vegetationDensity,
    canopyPotential,
    rootAccess
  );

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    upstreamClimate: CLIMATE_CHILD_FILE,
    layer: "ecology",

    u: safeU,
    v: safeV,
    lon: topography.lon,
    lat: topography.lat,

    topography,
    hydration,
    climate,

    biome,
    vegetationBand: classifyVegetationBand(climate, topography),

    vegetationDensity,
    canopyPotential,
    grasslandPotential,
    wetlandPotential,
    desertScrubPotential,
    mossLichenPotential,
    rootAccess,
    soilDevelopment,

    faunaHabitatPermission: clamp(
      vegetationDensity * 0.42 +
      wetlandPotential * 0.18 +
      grasslandPotential * 0.2 +
      canopyPotential * 0.2,
      0,
      1
    ),

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsFauna: false,
    renderColor: null
  });
}

export function buildEcologyField(options = {}) {
  const profile = createEcologyProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || profile.lattice || 256));
  const height = Math.max(8, Math.floor(options.height || profile.lattice || 256));

  const topographyField = options.topographyField || buildTopographyField({
    width,
    height,
    profile: { lattice: profile.lattice }
  });

  const hydrationField = options.hydrationField || buildHydrationField({
    width,
    height,
    topographyField,
    profile: { lattice: profile.lattice }
  });

  const climateField = options.climateField || buildClimateField({
    width,
    height,
    topographyField,
    hydrationField,
    profile: { lattice: profile.lattice }
  });

  const samples = new Array(width * height);

  let vegetatedSamples = 0;
  let canopySamples = 0;
  let grasslandSamples = 0;
  let wetlandSamples = 0;
  let sparseSamples = 0;
  let sumVegetationDensity = 0;
  let sumFaunaHabitatPermission = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const sample = sampleEcology(u, v, {
        profile,
        topographyField,
        hydrationField,
        climateField
      });

      const index = y * width + x;
      samples[index] = sample;

      sumVegetationDensity += sample.vegetationDensity;
      sumFaunaHabitatPermission += sample.faunaHabitatPermission;

      if (sample.vegetationDensity > 0.28) vegetatedSamples += 1;
      if (sample.canopyPotential > 0.52) canopySamples += 1;
      if (sample.grasslandPotential > 0.48) grasslandSamples += 1;
      if (sample.wetlandPotential > 0.44) wetlandSamples += 1;
      if (sample.vegetationDensity <= 0.16 && !sample.hydration.isOcean) sparseSamples += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    upstreamClimate: CLIMATE_CHILD_FILE,
    layer: "ecology",

    width,
    height,
    profile,
    topographyField,
    hydrationField,
    climateField,
    samples,

    stats: Object.freeze({
      averageVegetationDensity: sumVegetationDensity / samples.length,
      averageFaunaHabitatPermission: sumFaunaHabitatPermission / samples.length,
      vegetatedSampleRatio: vegetatedSamples / samples.length,
      canopySampleRatio: canopySamples / samples.length,
      grasslandSampleRatio: grasslandSamples / samples.length,
      wetlandSampleRatio: wetlandSamples / samples.length,
      sparseLandSampleRatio: sparseSamples / samples.length
    }),

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function getEcologySampleFromField(field, u, v) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleEcology(u, v);
  }

  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const x = clamp(Math.round(safeU * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(safeV * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getEcologyStatus() {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    upstreamClimate: CLIMATE_CHILD_FILE,
    layer: "ecology",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: true,
    ownsFauna: false,
    ownsRoute: false,
    ownsHtml: false,
    ownsEarth: false,
    ownsSun: false,
    ownsMoon: false,
    ownsFinalRender: false,

    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createEcologyProfile,
  sampleEcology,
  buildEcologyField,
  getEcologySampleFromField,
  getEcologyStatus
});
