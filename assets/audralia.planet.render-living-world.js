// /assets/audralia.planet.render-living-world.js
// AUDRALIA_G1_PLANET_RENDER_LIVING_WORLD_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Upstream dependencies:
//   /assets/audralia.planet.render-topography.js
//   /assets/audralia.planet.render-hydration.js
//   /assets/audralia.planet.render-climate.js
//   /assets/audralia.planet.render-ecology.js
//   /assets/audralia.planet.render-fauna.js
// Role: direct downstream living-world runtime child for Audralia planet render.
// Scope: runtime coordination, time state, seasonal state, activity state, and field orchestration only.
// No HTML, route, Earth, Sun, Moon, final rendering, terrain ownership, or public visual pass claim.

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

import {
  buildFaunaField,
  getFaunaSampleFromField,
  sampleFauna
} from "/assets/audralia.planet.render-fauna.js";

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_LIVING_WORLD_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-living-world.js";

const TOPOGRAPHY_CHILD_FILE = "/assets/audralia.planet.render-topography.js";
const HYDRATION_CHILD_FILE = "/assets/audralia.planet.render-hydration.js";
const CLIMATE_CHILD_FILE = "/assets/audralia.planet.render-climate.js";
const ECOLOGY_CHILD_FILE = "/assets/audralia.planet.render-ecology.js";
const FAUNA_CHILD_FILE = "/assets/audralia.planet.render-fauna.js";

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
  upstreamFauna: FAUNA_CHILD_FILE,
  layer: "living-world-runtime",

  lattice: 256,
  dayLengthHours: 26,
  yearLengthDays: 412,
  axialTiltDegrees: 23.5,
  seasonalAmplitude: 0.34,
  tideCycleHours: 13.1,
  ecologicalPulseStrength: 0.22,
  faunaPulseStrength: 0.28,
  migrationSeasonStrength: 0.36,

  ownsTopography: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: false,
  ownsRuntime: true,
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

function fract(value) {
  return value - Math.floor(value);
}

function cycle01(value) {
  return fract(value);
}

function wave01(value) {
  return 0.5 + Math.sin(value * Math.PI * 2) * 0.5;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 41.41) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function resolveSeason(dayOfYear, profile) {
  const phase = cycle01(dayOfYear / profile.yearLengthDays);
  const northernSummer = wave01(phase - 0.25);
  const southernSummer = wave01(phase + 0.25);
  const equatorialPulse = wave01(phase * 2);

  let seasonName = "vernal_transition";
  if (phase >= 0.125 && phase < 0.375) seasonName = "northern_warm_season";
  if (phase >= 0.375 && phase < 0.625) seasonName = "autumnal_transition";
  if (phase >= 0.625 && phase < 0.875) seasonName = "southern_warm_season";

  return Object.freeze({
    phase,
    seasonName,
    northernSummer,
    southernSummer,
    equatorialPulse
  });
}

function resolveDaylight(localHour, latitude, season, profile) {
  const absLat = Math.abs(latitude);
  const hemisphereFactor = latitude >= 0 ? season.northernSummer : season.southernSummer;
  const seasonalDayBias = (hemisphereFactor - 0.5) * profile.seasonalAmplitude * absLat;
  const noonProximity = wave01((localHour - 6) / profile.dayLengthHours);

  return clamp(noonProximity + seasonalDayBias, 0, 1);
}

function resolveInputs(u, v, options, profile) {
  const topographyField = options.topographyField || null;
  const hydrationField = options.hydrationField || null;
  const climateField = options.climateField || null;
  const ecologyField = options.ecologyField || null;
  const faunaField = options.faunaField || null;

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

  const fauna = options.faunaSample ||
    (faunaField
      ? getFaunaSampleFromField(faunaField, u, v)
      : sampleFauna(u, v, {
          profile: { lattice: profile.lattice },
          topographySample: topography,
          hydrationSample: hydration,
          climateSample: climate,
          ecologySample: ecology
        }));

  return Object.freeze({
    topography,
    hydration,
    climate,
    ecology,
    fauna
  });
}

function classifyRuntimeZone(inputs, activity) {
  const { hydration, climate, ecology, fauna } = inputs;

  if (hydration.isOcean) return "marine_runtime_zone";
  if (hydration.glacierPermission > 0.72) return "ice_runtime_zone";
  if (fauna.faunaPresent && activity.faunaActivity > 0.62) return "active_fauna_runtime_zone";
  if (ecology.vegetationDensity > 0.58 && activity.ecologyActivity > 0.58) return "active_ecology_runtime_zone";
  if (climate.stormPermission > 0.62) return "storm_runtime_zone";
  if (hydration.riverPermission > 0.58 || hydration.lakePermission > 0.58) return "freshwater_runtime_zone";
  if (climate.aridity > 0.7) return "arid_runtime_zone";
  return "stable_land_runtime_zone";
}

export function createLivingWorldProfile(overrides = {}) {
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
    upstreamFauna: FAUNA_CHILD_FILE,
    layer: "living-world-runtime"
  });
}

export function createLivingWorldState(options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
  const elapsedHours = Math.max(0, normalizeInput(options.elapsedHours, 0));
  const elapsedDays = elapsedHours / profile.dayLengthHours;
  const dayOfYear = cycle01(elapsedDays / profile.yearLengthDays) * profile.yearLengthDays;
  const localHour = cycle01(elapsedHours / profile.dayLengthHours) * profile.dayLengthHours;
  const season = resolveSeason(dayOfYear, profile);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "living-world-runtime",

    elapsedHours,
    elapsedDays,
    dayOfYear,
    localHour,
    season,

    runtimeActive: true,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function tickLivingWorldState(previousState, deltaHours = 1, options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
  const priorHours = previousState && Number.isFinite(previousState.elapsedHours)
    ? previousState.elapsedHours
    : 0;

  return createLivingWorldState({
    profile,
    elapsedHours: priorHours + Math.max(0, normalizeInput(deltaHours, 1))
  });
}

export function buildLivingWorldFields(options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
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

  const faunaField = options.faunaField || buildFaunaField({
    width,
    height,
    topographyField,
    hydrationField,
    climateField,
    ecologyField,
    profile: { lattice: profile.lattice }
  });

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "living-world-runtime",

    width,
    height,
    profile,

    topographyField,
    hydrationField,
    climateField,
    ecologyField,
    faunaField,

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function sampleLivingWorld(u, v, options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const state = options.state || createLivingWorldState({ profile });
  const inputs = resolveInputs(safeU, safeV, options, profile);
  const { topography, hydration, climate, ecology, fauna } = inputs;

  const season = state.season || resolveSeason(state.dayOfYear || 0, profile);
  const daylight = resolveDaylight(state.localHour || 0, topography.lat, season, profile);

  const localSeasonWarmth = topography.lat >= 0
    ? season.northernSummer
    : season.southernSummer;

  const tidePhase = wave01((state.elapsedHours || 0) / profile.tideCycleHours + safeU * 0.18);
  const hydrologyPulse = clamp(
    hydration.wetEdgePermission * 0.32 +
    hydration.riverPermission * 0.22 +
    hydration.lakePermission * 0.18 +
    hydration.coastalPermission * 0.14 +
    tidePhase * 0.14,
    0,
    1
  );

  const seasonalGrowth = clamp(
    localSeasonWarmth * 0.36 +
    season.equatorialPulse * (1 - Math.abs(topography.lat)) * 0.16 +
    daylight * 0.22 +
    climate.humidity * 0.16 +
    (1 - climate.aridity) * 0.1,
    0,
    1
  );

  const ecologyActivity = clamp(
    ecology.vegetationDensity * 0.34 +
    ecology.rootAccess * 0.18 +
    hydrologyPulse * 0.16 +
    seasonalGrowth * 0.24 +
    profile.ecologicalPulseStrength * fbm(topography.lon * 6.4, topography.lat * 6.4, 1001, 4),
    0,
    1
  );

  const migrationSeason = clamp(
    Math.abs(localSeasonWarmth - 0.5) * 2 * profile.migrationSeasonStrength +
    fauna.migrationPermission * 0.5,
    0,
    1
  );

  const faunaActivity = clamp(
    fauna.carryingCapacity * 0.28 +
    fauna.biodiversityPotential * 0.22 +
    fauna.migrationPermission * 0.16 +
    daylight * 0.12 +
    migrationSeason * 0.14 +
    profile.faunaPulseStrength * fbm(topography.lon * 9.2 + state.dayOfYear, topography.lat * 9.2, 1101, 4),
    0,
    1
  );

  const stormState = clamp(
    climate.stormPermission * 0.56 +
    hydrologyPulse * 0.18 +
    (1 - daylight) * 0.1 +
    fbm(topography.lon * 4.4 + state.elapsedDays, topography.lat * 4.4, 1201, 4) * 0.16,
    0,
    1
  );

  const snowIceActivity = clamp(
    hydration.glacierPermission * 0.46 +
    climate.frostPermission * 0.32 +
    (1 - localSeasonWarmth) * 0.16 +
    (1 - daylight) * 0.06,
    0,
    1
  );

  const activity = Object.freeze({
    daylight,
    localSeasonWarmth,
    tidePhase,
    hydrologyPulse,
    seasonalGrowth,
    ecologyActivity,
    migrationSeason,
    faunaActivity,
    stormState,
    snowIceActivity
  });

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
    upstreamFauna: FAUNA_CHILD_FILE,
    layer: "living-world-runtime",

    u: safeU,
    v: safeV,
    lon: topography.lon,
    lat: topography.lat,

    state,
    topography,
    hydration,
    climate,
    ecology,
    fauna,
    activity,

    runtimeZone: classifyRuntimeZone(inputs, activity),

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsFinalRender: false,
    renderColor: null
  });
}

export function buildLivingWorldSnapshot(options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || 64));
  const height = Math.max(8, Math.floor(options.height || 64));
  const fieldWidth = Math.max(8, Math.floor(options.fieldWidth || profile.lattice || 256));
  const fieldHeight = Math.max(8, Math.floor(options.fieldHeight || profile.lattice || 256));

  const state = options.state || createLivingWorldState({
    profile,
    elapsedHours: normalizeInput(options.elapsedHours, 0)
  });

  const fields = options.fields || buildLivingWorldFields({
    width: fieldWidth,
    height: fieldHeight,
    profile
  });

  const samples = new Array(width * height);

  let activeEcologySamples = 0;
  let activeFaunaSamples = 0;
  let stormSamples = 0;
  let iceSamples = 0;
  let sumEcologyActivity = 0;
  let sumFaunaActivity = 0;
  let sumHydrologyPulse = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const sample = sampleLivingWorld(u, v, {
        profile,
        state,
        topographyField: fields.topographyField,
        hydrationField: fields.hydrationField,
        climateField: fields.climateField,
        ecologyField: fields.ecologyField,
        faunaField: fields.faunaField
      });

      const index = y * width + x;
      samples[index] = sample;

      sumEcologyActivity += sample.activity.ecologyActivity;
      sumFaunaActivity += sample.activity.faunaActivity;
      sumHydrologyPulse += sample.activity.hydrologyPulse;

      if (sample.activity.ecologyActivity > 0.58) activeEcologySamples += 1;
      if (sample.activity.faunaActivity > 0.58) activeFaunaSamples += 1;
      if (sample.activity.stormState > 0.62) stormSamples += 1;
      if (sample.activity.snowIceActivity > 0.62) iceSamples += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "living-world-runtime",

    width,
    height,
    profile,
    state,
    fields,
    samples,

    stats: Object.freeze({
      averageEcologyActivity: sumEcologyActivity / samples.length,
      averageFaunaActivity: sumFaunaActivity / samples.length,
      averageHydrologyPulse: sumHydrologyPulse / samples.length,
      activeEcologySampleRatio: activeEcologySamples / samples.length,
      activeFaunaSampleRatio: activeFaunaSamples / samples.length,
      stormSampleRatio: stormSamples / samples.length,
      iceSampleRatio: iceSamples / samples.length
    }),

    downstreamForParent: true,
    parentMustCompose: true,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function createLivingWorldRuntime(options = {}) {
  const profile = createLivingWorldProfile(options.profile || {});
  const fields = options.fields || buildLivingWorldFields({
    width: options.width || profile.lattice,
    height: options.height || profile.lattice,
    profile
  });

  let state = options.state || createLivingWorldState({
    profile,
    elapsedHours: normalizeInput(options.elapsedHours, 0)
  });

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "living-world-runtime",

    profile,
    fields,

    getState() {
      return state;
    },

    tick(deltaHours = 1) {
      state = tickLivingWorldState(state, deltaHours, { profile });
      return state;
    },

    sample(u, v) {
      return sampleLivingWorld(u, v, {
        profile,
        state,
        topographyField: fields.topographyField,
        hydrationField: fields.hydrationField,
        climateField: fields.climateField,
        ecologyField: fields.ecologyField,
        faunaField: fields.faunaField
      });
    },

    snapshot(snapshotOptions = {}) {
      return buildLivingWorldSnapshot({
        profile,
        state,
        fields,
        width: snapshotOptions.width || 64,
        height: snapshotOptions.height || 64
      });
    },

    getStatus() {
      return getLivingWorldStatus();
    }
  });
}

export function getLivingWorldStatus() {
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
    upstreamFauna: FAUNA_CHILD_FILE,
    layer: "living-world-runtime",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: true,
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
  createLivingWorldProfile,
  createLivingWorldState,
  tickLivingWorldState,
  buildLivingWorldFields,
  sampleLivingWorld,
  buildLivingWorldSnapshot,
  createLivingWorldRuntime,
  getLivingWorldStatus
});
