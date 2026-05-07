// /assets/audralia/audralia.climate.render.js
// AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1
// Active renewal: AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2
//
// Runtime-safe climate authority only.
// Climate conduces hydration.
// Climate does not render.
// Climate does not own land, water, terrain, oceans, ecology, route, canvas, GraphicBox, or image generation.

const RECEIPT = "AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2";
const COMPATIBILITY_RECEIPT = "AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2_4K_CLIMATE_ENVIRONMENTAL_CONDUIT";
const FILE = "/assets/audralia/audralia.climate.render.js";

const CLIMATE_LAW = Object.freeze({
  activeInvariant: true,
  visibleClimate: false,
  climateConducesHydration: true,
  climateDoesNotRender: true,

  physicalGenealogy: "tectonics->topology->terrain",
  environmentalConduit: "climate->hydration",
  runtimeCompositionExpected: "topology+terrain+hydration+climate_conditions->runtime->route",

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
  ownsAtmosphericOpticsPermission: true,
  ownsSeasonalBias: true,
  ownsMicroclimateSampling: true,

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
  fieldWidth: 256,
  fieldHeight: 128,
  minFieldWidth: 48,
  minFieldHeight: 24,
  maxFieldWidth: 512,
  maxFieldHeight: 256,

  cleanAtmosphereIndex: 0.965,
  oxygenEnvelopeIndex: 0.94,
  oceanCycleStrength: 0.90,
  pressureCirculationStrength: 0.86,
  rainfallStrength: 0.80,
  evaporationStrength: 0.73,
  snowlineSensitivity: 0.76,
  glacierPermissionStrength: 0.72,
  elevationClimateStrength: 0.88,
  seasonalMotionStrength: 0.64,
  breathableEnvelopeStrength: 0.965,
  microclimateStrength: 0.38,
  windShearStrength: 0.44,
  atmosphericOpticsStrength: 0.48,
  thermalInertiaStrength: 0.58
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

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function fract(value) {
  return value - Math.floor(value);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function normalizeLongitudeDegrees(value) {
  let lon = Number(value);
  if (!Number.isFinite(lon)) lon = 0;

  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  return lon;
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
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

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function normalizePoint(a, b, context = {}) {
  if (typeof a === "object" && a !== null) {
    const input = a;
    const uValue = input.u ?? input.x ?? input.textureU ?? context.u ?? 0.5;
    const vValue = input.v ?? input.y ?? input.textureV ?? context.v ?? 0.5;
    const u = wrap01(uValue);
    const v = clamp(Number(vValue), 0, 1);

    let latDeg = Number(input.latDeg ?? input.latitudeDegrees ?? input.latDegrees);
    let lonDeg = Number(input.lonDeg ?? input.longitudeDegrees ?? input.lngDeg ?? input.lonDegrees);

    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    if (Number.isFinite(latDeg)) lat = latDeg * Math.PI / 180;
    if (Number.isFinite(lonDeg)) lon = lonDeg * Math.PI / 180;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

    latDeg = lat * 180 / Math.PI;
    lonDeg = normalizeLongitudeDegrees(lon * 180 / Math.PI);

    return Object.freeze({
      u,
      v,
      lat,
      lon,
      latDeg,
      lonDeg,
      lonUnit: lonDeg / 180,
      latUnit: latDeg / 90,
      absLat: Math.abs(latDeg) / 90
    });
  }

  const u = wrap01(a);
  const v = clamp(Number(b), 0, 1);
  const lat = (0.5 - v) * Math.PI;
  const lon = (u - 0.5) * Math.PI * 2;
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = normalizeLongitudeDegrees(lon * 180 / Math.PI);

  return Object.freeze({
    u,
    v,
    lat,
    lon,
    latDeg,
    lonDeg,
    lonUnit: lonDeg / 180,
    latUnit: latDeg / 90,
    absLat: Math.abs(latDeg) / 90
  });
}

function readNumber(source, keys, fallback = 0) {
  if (!source || typeof source !== "object") return fallback;

  for (const key of keys) {
    const value = Number(source[key]);
    if (Number.isFinite(value)) return value;
  }

  return fallback;
}

function inferSource(context, keys) {
  if (!context || typeof context !== "object") return null;

  for (const key of keys) {
    if (context[key] && typeof context[key] === "object") return context[key];
  }

  return null;
}

function inferElevation(context) {
  const terrain = inferSource(context, ["terrain", "terrainSample", "terrainState"]);
  const topology = inferSource(context, ["topology", "topologySample", "topologyState"]);
  const runtime = inferSource(context, ["runtime", "runtimeSample", "runtimeState", "surface"]);

  const runtimeElevation = readNumber(runtime, ["elevation", "maxElevation", "terrainRelief", "terrainReliefIndex"], null);
  if (Number.isFinite(runtimeElevation)) return clamp(runtimeElevation, -1, 1);

  const terrainElevation = readNumber(terrain, ["normalizedElevation", "elevation", "elevationIndex", "terrainRelief", "terrainReliefIndex"], null);
  if (Number.isFinite(terrainElevation)) return clamp(terrainElevation, -1, 1);

  const topologyRise = readNumber(topology, ["terrainRisePermission", "landPotential", "seaLevelDistance", "coastBand"], null);
  if (Number.isFinite(topologyRise)) return clamp(topologyRise, -1, 1);

  const oceanDepth = readNumber(runtime || topology, ["depth", "oceanDepthIndex", "bathymetryBlueprintIndex", "basinDepthIndex"], null);
  if (Number.isFinite(oceanDepth)) return -clamp(oceanDepth, 0, 1);

  return 0;
}

function inferLandWater(context) {
  const topology = inferSource(context, ["topology", "topologySample", "topologyState"]);
  const terrain = inferSource(context, ["terrain", "terrainSample", "terrainState"]);
  const runtime = inferSource(context, ["runtime", "runtimeSample", "runtimeState", "surface"]);

  const isLand = Boolean(
    runtime?.land ||
      runtime?.exposedTerrainLand ||
      runtime?.visibleLand ||
      topology?.land ||
      topology?.isAboveWaterLandFootprint ||
      topology?.isLandFootprint ||
      topology?.topologyLandFootprint ||
      terrain?.isLand
  );

  const isIce = Boolean(
    runtime?.ice ||
      runtime?.glacier ||
      topology?.ice ||
      topology?.isPolarIceFootprint ||
      topology?.isSouthPolarIceFootprint ||
      topology?.isNorthPolarIceFootprint ||
      terrain?.isIce ||
      terrain?.glacier
  );

  const isShelf = Boolean(runtime?.shelf || topology?.shelf || topology?.topologyClass === "coastal-shelf");
  const isOcean = Boolean(runtime?.ocean || runtime?.water || topology?.oceanVoid || topology?.topologyClass === "ocean-void");
  const isWater = !isLand && !isIce ? true : Boolean(runtime?.liquidWater || isOcean || isShelf);

  const isCoastline = Boolean(
    runtime?.coastal ||
      runtime?.beach ||
      runtime?.shelf ||
      topology?.seaLevelBoundary ||
      topology?.isCoastline ||
      topology?.isBeach ||
      topology?.isShelf ||
      Number(topology?.shorelinePressure) > 0.32 ||
      Number(topology?.coastBand) > 0.22
  );

  return Object.freeze({
    isLand,
    isWater,
    isIce,
    isShelf,
    isOcean,
    isCoastline
  });
}

function getRegionBand(elevation, point) {
  if (point.absLat > 0.84) return REGION_BANDS[8];

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

function getOpticsBand(opticsIndex) {
  if (opticsIndex <= 0.20) return "clear_thin_light";
  if (opticsIndex <= 0.44) return "soft_blue_scatter";
  if (opticsIndex <= 0.68) return "opal_atmospheric_scatter";
  if (opticsIndex <= 0.84) return "mist_laden_light";
  return "heavy_atmospheric_depth";
}

function resolveContext(a, b, context) {
  if (typeof a === "object" && a !== null && !context) return a.context || a.climateContext || {};
  return context || {};
}

export function sampleClimate(uInput, vInput, context = {}) {
  const resolvedContext = resolveContext(uInput, vInput, context);
  const point = normalizePoint(uInput, vInput, resolvedContext);
  const options = Object.freeze({ ...DEFAULTS, ...(resolvedContext.climateContext || resolvedContext.options || {}) });

  const landWater = inferLandWater(resolvedContext);
  const elevation = inferElevation(resolvedContext);

  const circulation = fbm(point.lonUnit * 3.2 + 2.1, point.latUnit * 3.2 - 1.4, 6101, 5);
  const moistureNoise = fbm(point.lonUnit * 6.4 - 2.8, point.latUnit * 6.4 + 3.7, 6113, 5);
  const pressureNoise = fbm(point.lonUnit * 8.8 + 4.5, point.latUnit * 8.8 - 5.6, 6127, 4);
  const seasonalNoise = fbm(point.lonUnit * 2.0 - 1.5, point.latUnit * 2.0 + 7.9, 6139, 4);
  const microclimateNoise = fbm(point.lonUnit * 21.0 + 9.2, point.latUnit * 17.0 - 4.1, 6151, 3);
  const opticalNoise = fbm(point.lonUnit * 5.1 - 8.2, point.latUnit * 4.8 + 1.1, 6163, 4);
  const windShearNoise = fbm(point.lonUnit * 11.0 + 3.4, point.latUnit * 9.0 - 6.8, 6173, 4);

  const equatorialHeat = clamp(1 - point.absLat * 1.08, 0, 1);
  const polarCold = clamp((point.absLat - 0.62) / 0.38, 0, 1);
  const elevationCooling = elevation > 0 ? clamp(elevation * options.elevationClimateStrength, 0, 1) : 0;
  const oceanModeration = landWater.isWater ? 0.28 : landWater.isCoastline ? 0.20 : 0.045;
  const shelfMoisture = landWater.isShelf ? 0.18 : 0;
  const thermalInertia = clamp(
    oceanModeration * options.thermalInertiaStrength +
      landWater.isOcean * 0.14 +
      landWater.isCoastline * 0.09,
    0,
    1
  );

  const temperatureIndex = clamp(
    equatorialHeat * 0.64 +
      circulation * 0.10 +
      oceanModeration +
      thermalInertia * 0.08 -
      polarCold * 0.36 -
      elevationCooling * 0.25,
    0,
    1
  );

  const pressureIndex = clamp(
    0.43 +
      pressureNoise * 0.27 +
      polarCold * 0.12 +
      elevationCooling * 0.14 -
      equatorialHeat * 0.08 +
      windShearNoise * 0.04,
    0,
    1
  );

  const windCorridorIndex = clamp(
    options.pressureCirculationStrength * 0.32 +
      Math.abs(pressureIndex - 0.50) * 0.84 +
      circulation * 0.22 +
      seasonalNoise * 0.12 +
      windShearNoise * options.windShearStrength * 0.18,
    0,
    1
  );

  const oceanCycleInfluence = clamp(
    (landWater.isWater ? 0.72 : 0.0) +
      (landWater.isCoastline ? 0.46 : 0.0) +
      shelfMoisture +
      moistureNoise * 0.18,
    0,
    1
  );

  const rainfallTendency = clamp(
    options.rainfallStrength * 0.22 +
      oceanCycleInfluence * 0.36 +
      windCorridorIndex * 0.18 +
      moistureNoise * 0.20 +
      microclimateNoise * options.microclimateStrength * 0.08 -
      elevationCooling * 0.055,
    0,
    1
  );

  const evaporationTendency = clamp(
    options.evaporationStrength * 0.22 +
      temperatureIndex * 0.43 +
      windCorridorIndex * 0.17 +
      (landWater.isWater ? 0.18 : landWater.isCoastline ? 0.08 : 0.04),
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
      oceanCycleInfluence * 0.14 +
      windShearNoise * 0.06,
    0,
    1
  );

  const breathableEnvelopeIndex = clamp(
    options.breathableEnvelopeStrength * 0.70 +
      options.cleanAtmosphereIndex * 0.24 +
      options.oxygenEnvelopeIndex * 0.05 -
      stormPermission * 0.018,
    0,
    1
  );

  const atmosphericOpticsIndex = clamp(
    options.atmosphericOpticsStrength * 0.20 +
      opticalNoise * 0.28 +
      rainfallTendency * 0.18 +
      oceanCycleInfluence * 0.16 +
      breathableEnvelopeIndex * 0.12 +
      polarCold * 0.06,
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

  const snowlineIndex = clamp(
    snowPermission * 0.58 +
      elevationCooling * 0.23 +
      polarCold * 0.19,
    0,
    1
  );

  const glacierMeltPermission = clamp(
    glacierPermission * 0.30 +
      temperatureIndex * 0.22 +
      rainfallTendency * 0.16 -
      polarCold * 0.12,
    0,
    1
  );

  const pressureLiftIndex = clamp(
    elevationCooling * 0.32 +
      windCorridorIndex * 0.26 +
      pressureIndex * 0.20 +
      rainfallTendency * 0.12,
    0,
    1
  );

  const coastalFogPermission = clamp(
    landWater.isCoastline || landWater.isShelf
      ? oceanCycleInfluence * 0.38 + pressureIndex * 0.20 + temperatureIndex * 0.12 + opticalNoise * 0.18
      : 0,
    0,
    1
  );

  const regionBand = getRegionBand(elevation, point);

  return Object.freeze({
    receipt: RECEIPT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    activeContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lonUnit,
    lat: point.latUnit,
    lonDeg: point.lonDeg,
    latDeg: point.latDeg,
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
    isShelf: landWater.isShelf,
    isOcean: landWater.isOcean,
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

    windShearIndex: clamp(windShearNoise * options.windShearStrength, 0, 1),

    rainfallTendency,
    rainfallBand: getRainfallBand(rainfallTendency),

    evaporationTendency,
    snowPermission,
    snowlineIndex,
    glacierPermission,
    glacierMeltPermission,
    oceanCycleInfluence,
    stormPermission,
    pressureLiftIndex,
    coastalFogPermission,
    seasonalMotionIndex: clamp(seasonalNoise * options.seasonalMotionStrength, 0, 1),
    atmosphericOpticsIndex,
    atmosphericOpticsBand: getOpticsBand(atmosphericOpticsIndex),
    breathableEnvelopeIndex,
    cleanAtmosphereIndex: clamp(options.cleanAtmosphereIndex, 0, 1),
    oxygenEnvelopeIndex: clamp(options.oxygenEnvelopeIndex, 0, 1),
    thermalInertiaIndex: thermalInertia,
    microclimateIndex: clamp(microclimateNoise * options.microclimateStrength, 0, 1),

    hydrationConductionIndex,
    hydrationConditioningActive: true,
    hydrationMayUseRainfall: true,
    hydrationMayUseEvaporation: true,
    hydrationMayUseSnowline: true,
    hydrationMayUseGlacierPermission: true,
    hydrationMayUseGlacierMeltPermission: true,
    hydrationMayUseOceanCycle: true,
    hydrationMayUsePressureBands: true,
    hydrationMayUseWindCorridors: true,
    hydrationMayUseCoastalFog: true,

    suggestedHydrationBias: Object.freeze({
      oceanCycleInfluence,
      rainfallTendency,
      evaporationTendency,
      snowPermission,
      snowlineIndex,
      glacierPermission,
      glacierMeltPermission,
      pressureIndex,
      pressureLiftIndex,
      windCorridorIndex,
      coastalFogPermission,
      hydrationConductionIndex
    }),

    suggestedRuntimeClimate: Object.freeze({
      atmosphericOpticsIndex,
      breathableEnvelopeIndex,
      cleanAtmosphereIndex: clamp(options.cleanAtmosphereIndex, 0, 1),
      oxygenEnvelopeIndex: clamp(options.oxygenEnvelopeIndex, 0, 1),
      thermalInertiaIndex: thermalInertia,
      stormPermission,
      windShearIndex: clamp(windShearNoise * options.windShearStrength, 0, 1)
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

export function sampleAudraliaClimate(input, context = {}) {
  return sampleClimate(input, undefined, context);
}

export function sampleClimateByLatLon(latDeg, lonDeg, context = {}) {
  return sampleClimate({
    latDeg,
    lonDeg,
    u: wrap01((normalizeLongitudeDegrees(lonDeg) / 360) + 0.5),
    v: clamp(0.5 - (Number(latDeg) || 0) / 180, 0, 1)
  }, undefined, context);
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
  let opticsSamples = 0;
  let coastalFogSamples = 0;
  let cleanBreathableSamples = 0;

  let maxRainfall = 0;
  let maxEvaporation = 0;
  let maxSnow = 0;
  let maxGlacier = 0;
  let maxHydrationConduction = 0;
  let maxOptics = 0;
  let maxWind = 0;
  let maxPressure = 0;
  let maxCoastalFog = 0;

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
      if (sample.atmosphericOpticsIndex > 0.44) opticsSamples += 1;
      if (sample.coastalFogPermission > 0.34) coastalFogSamples += 1;
      if (sample.cleanBreathableAtmosphere && sample.breathableEnvelopeIndex > 0.84) cleanBreathableSamples += 1;

      maxRainfall = Math.max(maxRainfall, sample.rainfallTendency);
      maxEvaporation = Math.max(maxEvaporation, sample.evaporationTendency);
      maxSnow = Math.max(maxSnow, sample.snowPermission);
      maxGlacier = Math.max(maxGlacier, sample.glacierPermission);
      maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationConductionIndex);
      maxOptics = Math.max(maxOptics, sample.atmosphericOpticsIndex);
      maxWind = Math.max(maxWind, sample.windCorridorIndex);
      maxPressure = Math.max(maxPressure, sample.pressureIndex);
      maxCoastalFog = Math.max(maxCoastalFog, sample.coastalFogPermission);
    }
  }

  const total = samples.length || 1;

  return Object.freeze({
    receipt: RECEIPT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
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
      opticsSamples,
      coastalFogSamples,
      cleanBreathableSamples,

      coldRatio: coldSamples / total,
      temperateRatio: temperateSamples / total,
      hotRatio: hotSamples / total,
      rainfallRatio: rainfallSamples / total,
      snowRatio: snowSamples / total,
      glacierRatio: glacierSamples / total,
      oceanCycleRatio: oceanCycleSamples / total,
      hydrationConduitRatio: hydrationConduitSamples / total,
      stormPermissionRatio: stormPermissionSamples / total,
      opticsRatio: opticsSamples / total,
      coastalFogRatio: coastalFogSamples / total,
      cleanBreathableRatio: cleanBreathableSamples / total,

      maxRainfall,
      maxEvaporation,
      maxSnow,
      maxGlacier,
      maxHydrationConduction,
      maxOptics,
      maxWind,
      maxPressure,
      maxCoastalFog,

      climateActive: true,
      climateInvariant: true,
      climateConducesHydration: true,
      climateVisible: false,
      climateDoesNotRender: true,

      cleanBreathableAtmosphere: true,
      oceanDrivenClimate: true,
      elevationStructuredClimate: true,
      atmosphericOpticsActive: true,
      microclimateSamplingActive: true,

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

export function getClimateSampleFromField(field, uInput, vInput, context = {}) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleClimate(uInput, vInput, context);
  }

  const point = normalizePoint(uInput, vInput, context);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleClimate(point.u, point.v, context);
}

export function getClimateStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    activeContract: RECEIPT,
    status: "active",
    id: "audralia-climate-4k-environmental-conduit",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    climateLaw: CLIMATE_LAW,

    exports: Object.freeze([
      "sampleClimate",
      "sampleAudraliaClimate",
      "sampleClimateByLatLon",
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
    ownsAtmosphericOpticsPermission: true,
    ownsSeasonalBias: true,
    ownsMicroclimateSampling: true,

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
  receipt: RECEIPT,
  compatibilityReceipt: COMPATIBILITY_RECEIPT,
  sampleClimate,
  sampleAudraliaClimate,
  sampleClimateByLatLon,
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
