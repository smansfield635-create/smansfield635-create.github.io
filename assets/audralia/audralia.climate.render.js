// /assets/audralia/audralia.climate.render.js
// AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1
//
// Role:
// - Audralia invariant climate authority.
// - Active environmental constraint layer.
// - Conditions hydration without rendering climate.
// - Provides temperature, pressure, wind, rainfall, evaporation, snow, glacier,
//   ocean-cycle, and elevation-climate permissions.
// - Does not open ecology, foliage, animals, marine life, or civilization.
//
// Placement:
// - Climate is not downstream of hydration.
// - Climate conduces hydration.
// - Physical genealogy remains: tectonics → topology → terrain.
// - Environmental conduit remains: climate → hydration.
// - Runtime later composes topology + terrain + hydration + climate-derived state.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No canvas rendering.
// - No cloud visual rendering.
// - No weather animation.
// - No land generation.
// - No terrain generation.
// - No hydration ownership.
// - No ecology.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_CLIMATE_INVARIANT_HYDRATION_CONDUIT";
const FILE = "/assets/audralia/audralia.climate.render.js";

const CLIMATE_LAW = Object.freeze({
  activeInvariant: true,
  visibleClimate: false,
  climateConducesHydration: true,
  climateDoesNotRender: true,

  physicalGenealogy: "tectonics→topology→terrain",
  environmentalConduit: "climate→hydration",
  runtimeCompositionExpected: "topology+terrain+hydration+climate_conditions→runtime→route",

  ownsClimateConstraints: true,
  ownsTemperatureBands: true,
  ownsPressureBands: true,
  ownsWindCorridors: true,
  ownsRainfallTendency: true,
  ownsEvaporationTendency: true,
  ownsSnowPermission: true,
  ownsGlacierPermission: true,
  ownsOceanCycleInfluence: true,
  ownsElevationClimateRelationship: true,
  ownsRegionalClimateGates: true,
  ownsBreathableCleanAtmosphereAssumption: true,

  ownsTectonics: false,
  ownsTopology: false,
  ownsTerrain: false,
  ownsHydration: false,
  ownsWaterPlacement: false,
  ownsOceans: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsCloudRendering: false,
  ownsWeatherAnimation: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsAnimals: false,
  ownsMarineLife: false,
  ownsConstructCivilization: false,
  ownsFinalRender: false,

  toxicAtmosphere: false,
  industrialPollution: false,
  emissionsPoisoning: false,
  cleanBreathableAtmosphere: true,
  oceanDrivenClimate: true,
  elevationStructuredClimate: true,
  healthyEarlyWorldEcologyContext: true,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 192,
  fieldHeight: 96,
  minFieldWidth: 48,
  minFieldHeight: 24,
  maxFieldWidth: 384,
  maxFieldHeight: 192,

  cleanAtmosphereIndex: 0.96,
  oceanCycleStrength: 0.88,
  pressureCirculationStrength: 0.84,
  rainfallStrength: 0.78,
  evaporationStrength: 0.72,
  snowlineSensitivity: 0.74,
  glacierPermissionStrength: 0.70,
  elevationClimateStrength: 0.86,
  seasonalMotionStrength: 0.62,
  breathableEnvelopeStrength: 0.96
});

const REGION_BANDS = Object.freeze([
  { id: 1, key: "oceanic_basin_climate", min: -1.00, max: -0.55 },
  { id: 2, key: "shallow_sea_climate", min: -0.55, max: -0.12 },
  { id: 3, key: "coastal_climate", min: -0.12, max: 0.08 },
  { id: 4, key: "lowland_climate", min: 0.08, max: 0.24 },
  { id: 5, key: "basin_plain_climate", min: 0.24, max: 0.38 },
  { id: 6, key: "upland_climate", min: 0.38, max: 0.52 },
  { id: 7, key: "highland_climate", min: 0.52, max: 0.68 },
  { id: 8, key: "alpine_climate", min: 0.68, max: 0.84 },
  { id: 9, key: "polar_glacial_climate", min: 0.84, max: 1.00 }
]);

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed) {
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

function fbm(x, y, seed, octaves = 4) {
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

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2,
    absLat: Math.abs(1 - v * 2)
  });
}

function readNumber(source, keys, fallback) {
  if (!source || typeof source !== "object") return fallback;

  for (const key of keys) {
    const value = Number(source[key]);
    if (Number.isFinite(value)) return value;
  }

  return fallback;
}

function inferElevation(context) {
  const terrain = context && (context.terrain || context.terrainSample) ? (context.terrain || context.terrainSample) : null;
  const topology = context && (context.topology || context.topologySample) ? (context.topology || context.topologySample) : null;

  const terrainElevation = readNumber(
    terrain,
    ["normalizedElevation", "elevation", "elevationIndex"],
    null
  );

  if (Number.isFinite(terrainElevation)) {
    return clamp(terrainElevation, -1, 1);
  }

  const topologyRise = readNumber(
    topology,
    ["terrainRisePermission", "landPotential", "seaLevelDistance"],
    null
  );

  if (Number.isFinite(topologyRise)) {
    return clamp(topologyRise, -1, 1);
  }

  const oceanDepth = readNumber(
    topology,
    ["oceanDepthIndex", "bathymetryBlueprintIndex", "basinDepthIndex"],
    null
  );

  if (Number.isFinite(oceanDepth)) {
    return -clamp(oceanDepth, 0, 1);
  }

  return 0;
}

function inferLandWater(context) {
  const topology = context && (context.topology || context.topologySample) ? (context.topology || context.topologySample) : null;
  const terrain = context && (context.terrain || context.terrainSample) ? (context.terrain || context.terrainSample) : null;

  const isLand = Boolean(
    (topology && (topology.isAboveWaterLandFootprint || topology.isLandFootprint || topology.topologyLandFootprint)) ||
      (terrain && terrain.isLand)
  );

  const isIce = Boolean(
    (topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint)) ||
      (terrain && terrain.isIce)
  );

  const isWater = !isLand && !isIce;

  const isCoastline = Boolean(
    topology &&
      (
        topology.isCoastline ||
        topology.isBeach ||
        topology.isShelf ||
        Number(topology.shorelinePressure) > 0.32
      )
  );

  return Object.freeze({
    isLand,
    isWater,
    isIce,
    isCoastline
  });
}

function getRegionBand(elevation, point) {
  const polar = point.absLat > 0.84;

  if (polar) return REGION_BANDS[8];

  const normalized = clamp((elevation + 1) / 2, 0, 1);

  for (const band of REGION_BANDS) {
    if (normalized >= band.min && normalized <= band.max) return band;
  }

  return REGION_BANDS[4];
}

function getTemperatureBand(temperatureIndex) {
  if (temperatureIndex <= 0.16) return "polar_cold";
  if (temperatureIndex <= 0.30) return "alpine_cool";
  if (temperatureIndex <= 0.46) return "temperate_cool";
  if (temperatureIndex <= 0.64) return "temperate_warm";
  if (temperatureIndex <= 0.80) return "subtropical_warm";
  return "equatorial_hot";
}

function getPressureBand(pressureIndex) {
  if (pressureIndex <= 0.22) return "low_pressure";
  if (pressureIndex <= 0.44) return "soft_low_pressure";
  if (pressureIndex <= 0.62) return "stable_pressure";
  if (pressureIndex <= 0.80) return "strong_pressure";
  return "high_pressure";
}

function getRainfallBand(rainfallIndex) {
  if (rainfallIndex <= 0.16) return "arid";
  if (rainfallIndex <= 0.34) return "dry";
  if (rainfallIndex <= 0.54) return "seasonal";
  if (rainfallIndex <= 0.74) return "wet";
  return "heavy_rainfall";
}

function getWindBand(windIndex) {
  if (windIndex <= 0.20) return "still_air";
  if (windIndex <= 0.44) return "soft_wind";
  if (windIndex <= 0.68) return "steady_wind";
  if (windIndex <= 0.84) return "strong_wind";
  return "storm_permission";
}

export function sampleClimate(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const options = Object.freeze({ ...DEFAULTS, ...(context.climateContext || context || {}) });

  const landWater = inferLandWater(context);
  const elevation = inferElevation(context);

  const circulation = fbm(point.lon * 3.2 + 2.1, point.lat * 3.2 - 1.4, 6101, 4);
  const moistureNoise = fbm(point.lon * 6.4 - 2.8, point.lat * 6.4 + 3.7, 6113, 4);
  const pressureNoise = fbm(point.lon * 8.8 + 4.5, point.lat * 8.8 - 5.6, 6127, 3);
  const seasonalNoise = fbm(point.lon * 2.0 - 1.5, point.lat * 2.0 + 7.9, 6139, 3);

  const equatorialHeat = clamp(1 - point.absLat * 1.08, 0, 1);
  const polarCold = clamp((point.absLat - 0.62) / 0.38, 0, 1);
  const elevationCooling = elevation > 0 ? clamp(elevation * options.elevationClimateStrength, 0, 1) : 0;
  const oceanModeration = landWater.isWater ? 0.26 : landWater.isCoastline ? 0.18 : 0.04;

  const temperatureIndex = clamp(
    equatorialHeat * 0.66 +
      circulation * 0.10 +
      oceanModeration -
      polarCold * 0.36 -
      elevationCooling * 0.24,
    0,
    1
  );

  const pressureIndex = clamp(
    0.44 +
      pressureNoise * 0.26 +
      polarCold * 0.12 +
      elevationCooling * 0.14 -
      equatorialHeat * 0.08,
    0,
    1
  );

  const windCorridorIndex = clamp(
    options.pressureCirculationStrength * 0.34 +
      Math.abs(pressureIndex - 0.50) * 0.82 +
      circulation * 0.24 +
      seasonalNoise * 0.12,
    0,
    1
  );

  const oceanCycleInfluence = clamp(
    (landWater.isWater ? 0.72 : 0.0) +
      (landWater.isCoastline ? 0.44 : 0.0) +
      moistureNoise * 0.18,
    0,
    1
  );

  const rainfallTendency = clamp(
    options.rainfallStrength * 0.22 +
      oceanCycleInfluence * 0.36 +
      windCorridorIndex * 0.18 +
      moistureNoise * 0.20 -
      elevationCooling * 0.06,
    0,
    1
  );

  const evaporationTendency = clamp(
    options.evaporationStrength * 0.22 +
      temperatureIndex * 0.44 +
      windCorridorIndex * 0.18 +
      (landWater.isWater ? 0.16 : 0.04),
    0,
    1
  );

  const snowPermission = clamp(
    polarCold * 0.60 +
      elevationCooling * 0.34 +
      (temperatureIndex < 0.30 ? 0.22 : 0) +
      rainfallTendency * 0.10,
    0,
    1
  );

  const glacierPermission = clamp(
    options.glacierPermissionStrength * 0.20 +
      snowPermission * 0.56 +
      polarCold * 0.26 +
      elevationCooling * 0.18,
    0,
    1
  );

  const stormPermission = clamp(
    windCorridorIndex * 0.46 +
      pressureIndex * 0.20 +
      rainfallTendency * 0.22 +
      oceanCycleInfluence * 0.14,
    0,
    1
  );

  const breathableEnvelopeIndex = clamp(
    options.breathableEnvelopeStrength * 0.72 +
      options.cleanAtmosphereIndex * 0.24 -
      stormPermission * 0.02,
    0,
    1
  );

  const hydrationConductionIndex = clamp(
    rainfallTendency * 0.28 +
      oceanCycleInfluence * 0.24 +
      snowPermission * 0.14 +
      glacierPermission * 0.16 +
      evaporationTendency * 0.10 +
      breathableEnvelopeIndex * 0.08,
    0,
    1
  );

  const regionBand = getRegionBand(elevation, point);

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    absLat: point.absLat,

    climateLaw: CLIMATE_LAW,
    climateActive: true,
    climateInvariant: true,
    climateVisible: false,
    climateConducesHydration: true,
    climateDoesNotRender: true,

    physicalGenealogy: CLIMATE_LAW.physicalGenealogy,
    environmentalConduit: CLIMATE_LAW.environmentalConduit,
    runtimeCompositionExpected: CLIMATE_LAW.runtimeCompositionExpected,

    terrainElevationInput: elevation,
    isLand: landWater.isLand,
    isWater: landWater.isWater,
    isIce: landWater.isIce,
    isCoastline: landWater.isCoastline,

    regionBandId: regionBand.id,
    regionBandKey: regionBand.key,
    elevationClimateStructured: true,

    temperatureIndex,
    temperatureBand: getTemperatureBand(temperatureIndex),

    pressureIndex,
    pressureBand: getPressureBand(pressureIndex),

    windCorridorIndex,
    windBand: getWindBand(windCorridorIndex),

    rainfallTendency,
    rainfallBand: getRainfallBand(rainfallTendency),

    evaporationTendency,
    snowPermission,
    glacierPermission,
    oceanCycleInfluence,
    stormPermission,
    seasonalMotionIndex: clamp(seasonalNoise * options.seasonalMotionStrength, 0, 1),
    breathableEnvelopeIndex,
    cleanAtmosphereIndex: clamp(options.cleanAtmosphereIndex, 0, 1),

    hydrationConductionIndex,
    hydrationConditioningActive: true,
    hydrationMayUseRainfall: true,
    hydrationMayUseEvaporation: true,
    hydrationMayUseSnowline: true,
    hydrationMayUseGlacierPermission: true,
    hydrationMayUseOceanCycle: true,
    hydrationMayUsePressureBands: true,
    hydrationMayUseWindCorridors: true,

    suggestedHydrationBias: Object.freeze({
      oceanCycleInfluence,
      rainfallTendency,
      evaporationTendency,
      snowPermission,
      glacierPermission,
      pressureIndex,
      windCorridorIndex,
      hydrationConductionIndex
    }),

    ownsClimateConstraints: true,
    ownsHydration: false,
    ownsWaterPlacement: false,
    ownsTectonics: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsCloudRendering: false,
    ownsWeatherAnimation: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,

    toxicAtmosphere: false,
    industrialPollution: false,
    emissionsPoisoning: false,
    cleanBreathableAtmosphere: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function buildClimateField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const samples = new Array(w * h);

  let coldSamples = 0;
  let temperateSamples = 0;
  let hotSamples = 0;
  let rainfallSamples = 0;
  let snowSamples = 0;
  let glacierSamples = 0;
  let oceanCycleSamples = 0;
  let hydrationConduitSamples = 0;
  let stormPermissionSamples = 0;

  let maxRainfall = 0;
  let maxEvaporation = 0;
  let maxSnow = 0;
  let maxGlacier = 0;
  let maxHydrationConduction = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleClimate(u, v, context);

      samples[y * w + x] = sample;

      if (sample.temperatureIndex <= 0.30) coldSamples += 1;
      else if (sample.temperatureIndex >= 0.70) hotSamples += 1;
      else temperateSamples += 1;

      if (sample.rainfallTendency > 0.44) rainfallSamples += 1;
      if (sample.snowPermission > 0.44) snowSamples += 1;
      if (sample.glacierPermission > 0.44) glacierSamples += 1;
      if (sample.oceanCycleInfluence > 0.44) oceanCycleSamples += 1;
      if (sample.hydrationConductionIndex > 0.44) hydrationConduitSamples += 1;
      if (sample.stormPermission > 0.62) stormPermissionSamples += 1;

      maxRainfall = Math.max(maxRainfall, sample.rainfallTendency);
      maxEvaporation = Math.max(maxEvaporation, sample.evaporationTendency);
      maxSnow = Math.max(maxSnow, sample.snowPermission);
      maxGlacier = Math.max(maxGlacier, sample.glacierPermission);
      maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationConductionIndex);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,

    stats: Object.freeze({
      totalSamples: samples.length,

      coldSamples,
      temperateSamples,
      hotSamples,
      rainfallSamples,
      snowSamples,
      glacierSamples,
      oceanCycleSamples,
      hydrationConduitSamples,
      stormPermissionSamples,

      coldRatio: samples.length ? coldSamples / samples.length : 0,
      temperateRatio: samples.length ? temperateSamples / samples.length : 0,
      hotRatio: samples.length ? hotSamples / samples.length : 0,
      rainfallRatio: samples.length ? rainfallSamples / samples.length : 0,
      snowRatio: samples.length ? snowSamples / samples.length : 0,
      glacierRatio: samples.length ? glacierSamples / samples.length : 0,
      oceanCycleRatio: samples.length ? oceanCycleSamples / samples.length : 0,
      hydrationConduitRatio: samples.length ? hydrationConduitSamples / samples.length : 0,
      stormPermissionRatio: samples.length ? stormPermissionSamples / samples.length : 0,

      maxRainfall,
      maxEvaporation,
      maxSnow,
      maxGlacier,
      maxHydrationConduction,

      climateActive: true,
      climateInvariant: true,
      climateConducesHydration: true,
      climateVisible: false,
      climateDoesNotRender: true,

      cleanBreathableAtmosphere: true,
      oceanDrivenClimate: true,
      elevationStructuredClimate: true,

      ecologyEnabled: false,
      foliageEnabled: false,
      treesEnabled: false,
      vegetationEnabled: false,
      animalsEnabled: false,
      marineLifeEnabled: false,
      constructCivilizationEnabled: false,

      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    })
  });
}

export function getClimateSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleClimate(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleClimate(point.u, point.v);
}

export function getClimateStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeContract: RECEIPT,
    status: "active",
    id: "audralia-climate-invariant-hydration-conduit",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    climateLaw: CLIMATE_LAW,

    exports: Object.freeze([
      "sampleClimate",
      "buildClimateField",
      "getClimateSampleFromField",
      "getClimateStatus"
    ]),

    activeInvariant: true,
    visibleClimate: false,
    climateConducesHydration: true,
    climateDoesNotRender: true,

    physicalGenealogy: CLIMATE_LAW.physicalGenealogy,
    environmentalConduit: CLIMATE_LAW.environmentalConduit,
    runtimeCompositionExpected: CLIMATE_LAW.runtimeCompositionExpected,

    ownsClimateConstraints: true,
    ownsTemperatureBands: true,
    ownsPressureBands: true,
    ownsWindCorridors: true,
    ownsRainfallTendency: true,
    ownsEvaporationTendency: true,
    ownsSnowPermission: true,
    ownsGlacierPermission: true,
    ownsOceanCycleInfluence: true,
    ownsElevationClimateRelationship: true,
    ownsRegionalClimateGates: true,
    ownsBreathableCleanAtmosphereAssumption: true,

    ownsHydration: false,
    ownsWaterPlacement: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsCloudRendering: false,
    ownsWeatherAnimation: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,

    toxicAtmosphere: false,
    industrialPollution: false,
    emissionsPoisoning: false,
    cleanBreathableAtmosphere: true,
    oceanDrivenClimate: true,
    elevationStructuredClimate: true,
    healthyEarlyWorldEcologyContext: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleClimate,
  buildClimateField,
  getClimateSampleFromField,
  getClimateStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaClimate = api;
  window.AudraliaClimate = api;
  window.audraliaClimate = api;
}

export default api;
