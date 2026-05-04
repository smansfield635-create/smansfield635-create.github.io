// /assets/audralia.planet.render-fauna.js
// AUDRALIA_G1_PLANET_RENDER_FAUNA_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Upstream dependencies:
//   /assets/audralia.planet.render-topography.js
//   /assets/audralia.planet.render-hydration.js
//   /assets/audralia.planet.render-climate.js
//   /assets/audralia.planet.render-ecology.js
// Role: direct downstream fauna child for Audralia planet render.
// Scope: fauna eligibility, habitat capacity, population zones, and movement corridors only.
// No HTML, route, Earth, Sun, Moon, final rendering, or public visual pass claim.

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

import {
  buildEcologyField,
  getEcologySampleFromField,
  sampleEcology
} from "/assets/audralia.planet.render-ecology.js";

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_FAUNA_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-fauna.js";

const TOPOGRAPHY_CHILD_FILE = "/assets/audralia.planet.render-topography.js";
const HYDRATION_CHILD_FILE = "/assets/audralia.planet.render-hydration.js";
const CLIMATE_CHILD_FILE = "/assets/audralia.planet.render-climate.js";
const ECOLOGY_CHILD_FILE = "/assets/audralia.planet.render-ecology.js";

const DEFAULT_PROFILE = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  childFile: CHILD_FILE,
  upstreamTopography: TOPOGRAPHY_CHILD_FILE,
  upstreamHydration: HYDRATION_CHILD_FILE,
  upstreamClimate: CLIMATE_CHILD_FILE,
  upstreamEcology: ECOLOGY_CHILD_FILE,
  layer: "fauna",

  lattice: 256,

  minimumHabitatPermission: 0.18,
  minimumTemperatureC: -18,
  maximumTemperatureC: 43,
  migrationSlopeLimit: 0.72,
  highCapacityThreshold: 0.62,
  predatorThreshold: 0.5,
  aquaticThreshold: 0.52,
  aerialThreshold: 0.42,

  ownsTopography: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: true,
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 37.37) * amplitude;
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
  const ecologyField = options.ecologyField || null;

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

  const ecology = options.ecologySample ||
    (ecologyField
      ? getEcologySampleFromField(ecologyField, u, v)
      : sampleEcology(u, v, {
          profile: { lattice: profile.lattice },
          topographySample: topography,
          hydrationSample: hydration,
          climateSample: climate
        }));

  return Object.freeze({ topography, hydration, climate, ecology });
}

function temperatureViability(temperatureC, profile) {
  const low = smoothstep(profile.minimumTemperatureC, 5, temperatureC);
  const high = 1 - smoothstep(31, profile.maximumTemperatureC, temperatureC);
  return clamp(low * high * 1.18, 0, 1);
}

function classifyDominantGuild(scores) {
  let dominant = "sparse_microfauna";
  let dominantScore = -Infinity;

  for (const [guild, score] of Object.entries(scores)) {
    if (score > dominantScore) {
      dominant = guild;
      dominantScore = score;
    }
  }

  return dominant;
}

function classifyFaunaZone(inputs, carryingCapacity, dominantGuild) {
  const { topography, hydration, climate, ecology } = inputs;

  if (hydration.isOcean && carryingCapacity > 0.42) return "marine_fauna_zone";
  if (hydration.glacierPermission > 0.72 || ecology.biome === "ice_ecology") return "ice_edge_fauna_zone";
  if (topography.elevationMeters > 4200) return "alpine_fauna_zone";
  if (ecology.biome === "wetland_biome") return "wetland_fauna_zone";
  if (ecology.canopyPotential > 0.58) return "forest_fauna_zone";
  if (ecology.grasslandPotential > 0.5) return "open_range_fauna_zone";
  if (climate.aridity > 0.68) return "arid_adapted_fauna_zone";
  if (dominantGuild === "aerial_guild") return "aerial_corridor_zone";
  if (carryingCapacity < 0.18) return "minimal_fauna_zone";
  return "mixed_fauna_zone";
}

export function createFaunaProfile(overrides = {}) {
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
    upstreamEcology: ECOLOGY_CHILD_FILE,
    layer: "fauna"
  });
}

export function sampleFauna(u, v, options = {}) {
  const profile = createFaunaProfile(options.profile || {});
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const inputs = resolveInputs(safeU, safeV, options, profile);
  const { topography, hydration, climate, ecology } = inputs;

  const habitatNoise = fbm(topography.lon * 7.2 + 11.8, topography.lat * 7.2 - 4.6, 901, 5);
  const movementNoise = fbm(topography.lon * 13.0 - 8.5, topography.lat * 13.0 + 2.1, 919, 4);

  const tempFit = temperatureViability(climate.temperatureC, profile);
  const baseHabitat = clamp(ecology.faunaHabitatPermission || 0, 0, 1);
  const waterAccess = clamp(
    hydration.riverPermission * 0.28 +
    hydration.lakePermission * 0.24 +
    hydration.wetEdgePermission * 0.22 +
    hydration.coastalPermission * 0.18 +
    (hydration.isOcean ? 0.3 : 0),
    0,
    1
  );

  const terrainAccess = clamp(
    1 -
      topography.slope * 0.42 -
      topography.mountainPermission * 0.18 +
      ecology.rootAccess * 0.24,
    0,
    1
  );

  const climateAccess = clamp(
    tempFit * 0.45 +
    climate.humidity * 0.22 +
    (1 - climate.aridity) * 0.22 +
    (1 - climate.stormPermission * 0.32) * 0.11,
    0,
    1
  );

  const landCarryingCapacity = !hydration.isOcean
    ? clamp(
        baseHabitat * 0.38 +
        waterAccess * 0.2 +
        terrainAccess * 0.18 +
        climateAccess * 0.18 +
        habitatNoise * 0.12,
        0,
        1
      )
    : 0;

  const marineCarryingCapacity = hydration.isOcean
    ? clamp(
        hydration.shelfWaterPermission * 0.34 +
        (1 - hydration.normalizedDepth) * 0.22 +
        climate.temperatureC > -4 ? 0.18 : 0 +
        climate.stormPermission * 0.08 +
        habitatNoise * 0.18,
        0,
        1
      )
    : clamp(
        hydration.lakePermission * 0.24 +
        hydration.riverPermission * 0.16,
        0,
        1
      );

  const carryingCapacity = clamp(
    Math.max(landCarryingCapacity, marineCarryingCapacity) *
      (1 - hydration.glacierPermission * 0.54),
    0,
    1
  );

  const grazerGuild = clamp(
    ecology.grasslandPotential * 0.46 +
    ecology.vegetationDensity * 0.2 +
    waterAccess * 0.14 +
    terrainAccess * 0.2,
    0,
    1
  );

  const browserGuild = clamp(
    ecology.canopyPotential * 0.42 +
    ecology.vegetationDensity * 0.28 +
    ecology.rootAccess * 0.14 +
    waterAccess * 0.16,
    0,
    1
  );

  const wetlandGuild = clamp(
    ecology.wetlandPotential * 0.52 +
    hydration.lakePermission * 0.18 +
    hydration.riverPermission * 0.18 +
    climate.humidity * 0.12,
    0,
    1
  );

  const alpineGuild = clamp(
    topography.mountainPermission * 0.36 +
    (1 - topography.slope * 0.46) +
    climate.frostPermission * 0.18 -
    hydration.glacierPermission * 0.2,
    0,
    1
  );

  const aridGuild = clamp(
    ecology.desertScrubPotential * 0.44 +
    climate.aridity * 0.28 +
    hydration.wetEdgePermission * 0.12 +
    terrainAccess * 0.16,
    0,
    1
  );

  const marineGuild = clamp(
    marineCarryingCapacity *
    (hydration.isOcean ? 1 : 0.46) *
    (0.72 + hydration.shelfWaterPermission * 0.28),
    0,
    1
  );

  const aerialGuild = clamp(
    carryingCapacity * 0.28 +
    climate.windStrength * 0.22 +
    ecology.canopyPotential * 0.18 +
    ecology.grasslandPotential * 0.16 +
    topography.slope * 0.16,
    0,
    1
  );

  const predatorGuild = clamp(
    carryingCapacity *
    profile.predatorThreshold *
    Math.max(grazerGuild, browserGuild, wetlandGuild, marineGuild) *
    (0.82 + movementNoise * 0.28),
    0,
    1
  );

  const burrowerGuild = clamp(
    terrainAccess * 0.32 +
    ecology.grasslandPotential * 0.24 +
    ecology.desertScrubPotential * 0.22 +
    (1 - hydration.wetEdgePermission) * 0.12 +
    (1 - topography.slope) * 0.1,
    0,
    1
  );

  const guildScores = Object.freeze({
    grazer_guild: grazerGuild * carryingCapacity,
    browser_guild: browserGuild * carryingCapacity,
    wetland_guild: wetlandGuild * carryingCapacity,
    alpine_guild: alpineGuild * carryingCapacity,
    arid_guild: aridGuild * carryingCapacity,
    marine_guild: marineGuild,
    aerial_guild: aerialGuild * carryingCapacity,
    predator_guild: predatorGuild,
    burrower_guild: burrowerGuild * carryingCapacity
  });

  const dominantGuild = classifyDominantGuild(guildScores);

  const migrationPermission = clamp(
    carryingCapacity * 0.32 +
    waterAccess * 0.2 +
    terrainAccess * 0.18 +
    (1 - topography.slope / profile.migrationSlopeLimit) * 0.16 +
    movementNoise * 0.14,
    0,
    1
  );

  const biodiversityPotential = clamp(
    carryingCapacity * 0.42 +
    ecology.vegetationDensity * 0.2 +
    waterAccess * 0.14 +
    climate.humidity * 0.12 +
    (1 - climate.aridity) * 0.12,
    0,
    1
  );

  const populationPressure = clamp(
    carryingCapacity *
    (0.64 + biodiversityPotential * 0.36) *
    (1 - climate.stormPermission * 0.12),
    0,
    1
  );

  const faunaPresent = carryingCapacity >= profile.minimumHabitatPermission;

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    upstreamClimate: CLIMATE_CHILD_FILE,
    upstreamEcology: ECOLOGY_CHILD_FILE,
    layer: "fauna",

    u: safeU,
    v: safeV,
    lon: topography.lon,
    lat: topography.lat,

    topography,
    hydration,
    climate,
    ecology,

    faunaPresent,
    faunaZone: classifyFaunaZone(inputs, carryingCapacity, dominantGuild),
    dominantGuild,
    guildScores,

    carryingCapacity,
    landCarryingCapacity,
    marineCarryingCapacity,
    biodiversityPotential,
    migrationPermission,
    populationPressure,

    waterAccess,
    terrainAccess,
    climateAccess,

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    renderColor: null
  });
}

export function buildFaunaField(options = {}) {
  const profile = createFaunaProfile(options.profile || {});
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

  const ecologyField = options.ecologyField || buildEcologyField({
    width,
    height,
    topographyField,
    hydrationField,
    climateField,
    profile: { lattice: profile.lattice }
  });

  const samples = new Array(width * height);

  let presentSamples = 0;
  let highCapacitySamples = 0;
  let migrationSamples = 0;
  let marineSamples = 0;
  let predatorSamples = 0;
  let sumCarryingCapacity = 0;
  let sumBiodiversityPotential = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const sample = sampleFauna(u, v, {
        profile,
        topographyField,
        hydrationField,
        climateField,
        ecologyField
      });

      const index = y * width + x;
      samples[index] = sample;

      sumCarryingCapacity += sample.carryingCapacity;
      sumBiodiversityPotential += sample.biodiversityPotential;

      if (sample.faunaPresent) presentSamples += 1;
      if (sample.carryingCapacity > profile.highCapacityThreshold) highCapacitySamples += 1;
      if (sample.migrationPermission > 0.52) migrationSamples += 1;
      if (sample.guildScores.marine_guild > profile.aquaticThreshold) marineSamples += 1;
      if (sample.guildScores.predator_guild > profile.predatorThreshold) predatorSamples += 1;
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
    upstreamEcology: ECOLOGY_CHILD_FILE,
    layer: "fauna",

    width,
    height,
    profile,
    topographyField,
    hydrationField,
    climateField,
    ecologyField,
    samples,

    stats: Object.freeze({
      faunaPresentSampleRatio: presentSamples / samples.length,
      highCapacitySampleRatio: highCapacitySamples / samples.length,
      migrationSampleRatio: migrationSamples / samples.length,
      marineSampleRatio: marineSamples / samples.length,
      predatorSampleRatio: predatorSamples / samples.length,
      averageCarryingCapacity: sumCarryingCapacity / samples.length,
      averageBiodiversityPotential: sumBiodiversityPotential / samples.length
    }),

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function getFaunaSampleFromField(field, u, v) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleFauna(u, v);
  }

  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const x = clamp(Math.round(safeU * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(safeV * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getFaunaStatus() {
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
    upstreamEcology: ECOLOGY_CHILD_FILE,
    layer: "fauna",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: true,
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
  createFaunaProfile,
  sampleFauna,
  buildFaunaField,
  getFaunaSampleFromField,
  getFaunaStatus
});
