// /assets/audralia.planet.render-climate.js
// AUDRALIA_G1_PLANET_RENDER_CLIMATE_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Upstream dependencies:
//   /assets/audralia.planet.render-topography.js
//   /assets/audralia.planet.render-hydration.js
// Role: direct downstream climate child for Audralia planet render.
// Scope: climate science only. No ecology, fauna, HTML, route, Earth, Sun, Moon, or final rendering.

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

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_CLIMATE_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-climate.js";
const TOPOGRAPHY_CHILD_FILE = "/assets/audralia.planet.render-topography.js";
const HYDRATION_CHILD_FILE = "/assets/audralia.planet.render-hydration.js";

const DEFAULT_PROFILE = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  childFile: CHILD_FILE,
  upstreamTopography: TOPOGRAPHY_CHILD_FILE,
  upstreamHydration: HYDRATION_CHILD_FILE,
  layer: "climate",

  lattice: 256,

  equatorTemperatureC: 31,
  polarTemperatureC: -28,
  lapseRateCPerKm: 6.5,
  axialTiltDegrees: 23.5,
  oceanThermalBuffer: 0.42,
  mountainRainShadowStrength: 0.38,
  pressureBaseHpa: 1013,

  ownsTopography: false,
  ownsHydration: false,
  ownsClimate: true,
  ownsEcology: false,
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

function mix(a, b, t) {
  return a + (b - a) * t;
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.29) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function getClimateInputs(u, v, options, profile) {
  const topographyField = options.topographyField || null;
  const hydrationField = options.hydrationField || null;

  const topography = options.topographySample ||
    (topographyField
      ? getTopographySampleFromField(topographyField, u, v)
      : sampleTopography(u, v));

  const hydration = options.hydrationSample ||
    (hydrationField
      ? getHydrationSampleFromField(hydrationField, u, v)
      : sampleHydration(u, v, { profile: { lattice: profile.lattice }, topographySample: topography }));

  return Object.freeze({ topography, hydration });
}

function classifyClimateZone(temperatureC, precipitationMm, aridity, glacier, elevationMeters) {
  if (glacier > 0.62 || temperatureC <= -12) return "ice_cap";
  if (temperatureC <= 2 && precipitationMm < 420) return "polar_desert";
  if (temperatureC <= 6) return "tundra";
  if (elevationMeters > 3600 && temperatureC < 10) return "alpine";
  if (aridity > 0.78 && temperatureC > 18) return "hot_desert";
  if (aridity > 0.72) return "cold_desert";
  if (aridity > 0.55) return "steppe";
  if (temperatureC >= 24 && precipitationMm >= 1500) return "tropical_wet";
  if (temperatureC >= 22 && precipitationMm >= 760) return "tropical_seasonal";
  if (temperatureC >= 14 && precipitationMm >= 900) return "warm_temperate_wet";
  if (temperatureC >= 8 && precipitationMm >= 520) return "temperate";
  if (temperatureC >= 2 && precipitationMm >= 420) return "boreal";
  return "dry_cool";
}

function resolveWindBand(lat) {
  const absLat = Math.abs(lat);

  if (absLat < 0.22) {
    return {
      windBand: "equatorial_convergence",
      windDirectionDegrees: lat >= 0 ? 95 : 265,
      windStrength: 0.42
    };
  }

  if (absLat < 0.58) {
    return {
      windBand: "mid_latitude_westerlies",
      windDirectionDegrees: lat >= 0 ? 250 : 110,
      windStrength: 0.68
    };
  }

  return {
    windBand: "polar_easterlies",
    windDirectionDegrees: lat >= 0 ? 70 : 290,
    windStrength: 0.54
  };
}

export function createClimateProfile(overrides = {}) {
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
    layer: "climate"
  });
}

export function sampleClimate(u, v, options = {}) {
  const profile = createClimateProfile(options.profile || {});
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const { topography, hydration } = getClimateInputs(safeU, safeV, options, profile);

  const absLat = Math.abs(topography.lat);
  const latitudeHeat = 1 - smoothstep(0, 0.96, absLat);
  const elevationKm = Math.max(0, topography.elevationMeters) / 1000;

  const oceanBuffer = hydration.isOcean ? profile.oceanThermalBuffer : 0;
  const coastalBuffer = hydration.coastalPermission * 0.22;

  const baselineTemperature = mix(
    profile.polarTemperatureC,
    profile.equatorTemperatureC,
    latitudeHeat
  );

  const lapseCooling = elevationKm * profile.lapseRateCPerKm;
  const seasonalNoise = (fbm(topography.lon * 3.0 + 4.1, topography.lat * 3.0 - 1.7, 601, 4) - 0.5) * 4.6;

  const temperatureC = Math.round(
    (baselineTemperature - lapseCooling + seasonalNoise + oceanBuffer * 3.2 + coastalBuffer * 1.6) * 10
  ) / 10;

  const oceanMoisture = hydration.isOcean
    ? 0.9
    : clamp(hydration.coastalPermission * 0.58 + hydration.riverPermission * 0.3 + hydration.lakePermission * 0.34, 0, 1);

  const orographicLift = clamp(
    topography.mountainPermission * topography.slope * (0.7 + hydration.wetEdgePermission * 0.4),
    0,
    1
  );

  const rainShadow = clamp(
    topography.mountainPermission * profile.mountainRainShadowStrength * (1 - oceanMoisture * 0.45),
    0,
    1
  );

  const convergenceRain = smoothstep(0.36, 1, latitudeHeat) * 0.42;
  const stormTrackRain = smoothstep(0.28, 0.7, absLat) * (1 - smoothstep(0.72, 0.94, absLat)) * 0.34;
  const moistureNoise = fbm(topography.lon * 5.8 - 2.4, topography.lat * 5.8 + 8.1, 701, 5);

  const precipitationSignal = clamp(
    oceanMoisture * 0.48 +
    orographicLift * 0.34 +
    convergenceRain +
    stormTrackRain +
    moistureNoise * 0.22 -
    rainShadow,
    0,
    1
  );

  const precipitationMm = Math.round(mix(80, 2600, precipitationSignal));

  const evaporationPressure = clamp((temperatureC + 12) / 46, 0, 1);
  const aridity = clamp(evaporationPressure * (1 - precipitationSignal * 0.82) + rainShadow * 0.28, 0, 1);

  const pressureHpa = Math.round(
    profile.pressureBaseHpa -
    elevationKm * 115 +
    (hydration.isOcean ? 8 : 0) -
    topography.slope * 10
  );

  const wind = resolveWindBand(topography.lat);
  const humidity = clamp(oceanMoisture * 0.56 + precipitationSignal * 0.44 - aridity * 0.18, 0, 1);
  const frostPermission = clamp((6 - temperatureC) / 20, 0, 1);
  const stormPermission = clamp(precipitationSignal * wind.windStrength * (0.6 + oceanMoisture * 0.4), 0, 1);

  const climateZone = classifyClimateZone(
    temperatureC,
    precipitationMm,
    aridity,
    hydration.glacierPermission,
    topography.elevationMeters
  );

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    layer: "climate",

    u: safeU,
    v: safeV,
    lon: topography.lon,
    lat: topography.lat,

    topography,
    hydration,

    temperatureC,
    precipitationMm,
    pressureHpa,
    humidity,
    aridity,

    windBand: wind.windBand,
    windDirectionDegrees: wind.windDirectionDegrees,
    windStrength: wind.windStrength,

    frostPermission,
    stormPermission,
    climateZone,

    ownsTopography: false,
    ownsHydration: false,
    ownsEcology: false,
    ownsFauna: false,
    renderColor: null
  });
}

export function buildClimateField(options = {}) {
  const profile = createClimateProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || profile.lattice || 256));
  const height = Math.max(8, Math.floor(options.height || profile.lattice || 256));

  const topographyField = options.topographyField || buildTopographyField({
    width,
    height,
    profile: {
      lattice: profile.lattice
    }
  });

  const hydrationField = options.hydrationField || buildHydrationField({
    width,
    height,
    topographyField,
    profile: {
      lattice: profile.lattice
    }
  });

  const samples = new Array(width * height);

  let minTemperatureC = Infinity;
  let maxTemperatureC = -Infinity;
  let sumTemperatureC = 0;
  let sumPrecipitationMm = 0;
  let drySamples = 0;
  let wetSamples = 0;
  let frostSamples = 0;
  let stormSamples = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const sample = sampleClimate(u, v, {
        profile,
        topographyField,
        hydrationField
      });

      const index = y * width + x;
      samples[index] = sample;

      minTemperatureC = Math.min(minTemperatureC, sample.temperatureC);
      maxTemperatureC = Math.max(maxTemperatureC, sample.temperatureC);
      sumTemperatureC += sample.temperatureC;
      sumPrecipitationMm += sample.precipitationMm;

      if (sample.aridity > 0.62) drySamples += 1;
      if (sample.precipitationMm > 1100) wetSamples += 1;
      if (sample.frostPermission > 0.5) frostSamples += 1;
      if (sample.stormPermission > 0.5) stormSamples += 1;
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
    layer: "climate",

    width,
    height,
    profile,
    topographyField,
    hydrationField,
    samples,

    stats: Object.freeze({
      minTemperatureC,
      maxTemperatureC,
      averageTemperatureC: Math.round((sumTemperatureC / samples.length) * 10) / 10,
      averagePrecipitationMm: Math.round(sumPrecipitationMm / samples.length),
      drySampleRatio: drySamples / samples.length,
      wetSampleRatio: wetSamples / samples.length,
      frostSampleRatio: frostSamples / samples.length,
      stormSampleRatio: stormSamples / samples.length
    }),

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function getClimateSampleFromField(field, u, v) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleClimate(u, v);
  }

  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const x = clamp(Math.round(safeU * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(safeV * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getClimateStatus() {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    upstreamHydration: HYDRATION_CHILD_FILE,
    layer: "climate",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: true,
    ownsEcology: false,
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
  createClimateProfile,
  sampleClimate,
  buildClimateField,
  getClimateSampleFromField,
  getClimateStatus
});
