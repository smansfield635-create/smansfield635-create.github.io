// /assets/audralia/audralia/hydration/oceans.render.js
// AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v3
// Full-file replacement. Oceans parent authority only.
// Purpose: consume hydration and define lawful ocean fill, shelf water, coast water, ocean masks,
// surface-water continuity, ocean color/depth handoff, and deep-ocean child handoff.
// Does not own land/void footprint, terrain relief, hydration cycle, deep-ocean trench authority,
// canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleHydration,
  sampleHydrationState,
  sampleSurface as sampleHydrationSurface,
  getHydrationStats,
  getHydrationStatus
} from "./render.js";

const AUDRALIA_OCEANS_RECEIPT = "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v3";
const AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT = "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2";
const AUDRALIA_OCEANS_ALIGNMENT_RECEIPT = "AUDRALIA_OCEANS_HYDRATION_CLIMATE_SURFACE_ALIGNMENT_TNT_v1";

const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_OCEANS_RECEIPT,
  compatibilityReceipt: AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT,
  alignmentReceipt: AUDRALIA_OCEANS_ALIGNMENT_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_CONTRACT_v2",
  file: "assets/audralia/audralia/hydration/oceans.render.js",
  role: "audralia-oceans-parent-continuous-fill-authority",
  lineage: "tectonics->topology->terrain->climate-conduit->hydration->oceans->deep-ocean->runtime->canvas-renderer->route",
  owns: [
    "ocean fill",
    "shelf water",
    "coastal water continuity",
    "surface water classification",
    "ocean mask",
    "shelf mask",
    "coastal feather",
    "ocean color/depth handoff",
    "deep-ocean child handoff"
  ],
  doesNotOwn: [
    "land-versus-void footprint",
    "sea-level boundary",
    "terrain relief",
    "hydration cycle",
    "deep ocean trench authority",
    "canvas paint",
    "route shell",
    "visual pass claim",
    "GraphicBox",
    "image generation"
  ],
  hydrationConsumed: true,
  oceansStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  oceansMayFillOnlyTopologyVoid: true,
  oceansCannotCreateLand: true,
  oceansCannotEraseTopologyLand: true,
  deepOceanChildExpectedNext: true,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v3",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v3",
    "AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2",
    "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v3",
    "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaOceans: true,
    buildOceanField: true,
    buildOceanGrid: true,
    sampleOcean: true,
    sampleOceans: true,
    sampleOceanState: true,
    sampleAudraliaOcean: true,
    sampleOceanField: true,
    sampleSurface: true,
    sample: true,
    getStats: true,
    getOceanStats: true,
    getOceansStats: true,
    getStatus: true,
    getOceansStatus: true
  }
};

let cachedStats = null;
let cachedOceans = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const denominator = edge1 - edge0;

  if (Math.abs(denominator) < 0.000001) {
    return value >= edge1 ? 1 : 0;
  }

  const t = clamp01((value - edge0) / denominator);
  return t * t * (3 - 2 * t);
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = h(0, 0, 0) * (1 - ux) + h(1, 0, 0) * ux;
  const x10 = h(0, 1, 0) * (1 - ux) + h(1, 1, 0) * ux;
  const x01 = h(0, 0, 1) * (1 - ux) + h(1, 0, 1) * ux;
  const x11 = h(0, 1, 1) * (1 - ux) + h(1, 1, 1) * ux;

  const y0 = x00 * (1 - uy) + x10 * uy;
  const y1 = x01 * (1 - uy) + x11 * uy;

  return y0 * (1 - uz) + y1 * uz;
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridgedNoise3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = valueNoise3(x * frequency, y * frequency, z * frequency);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.08;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function radToDeg(value) {
  return value * 180 / Math.PI;
}

function degToRad(value) {
  return value * Math.PI / 180;
}

function normalizeLongitudeDegrees(value) {
  let lon = Number(value);
  if (!Number.isFinite(lon)) lon = 0;

  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  return lon;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const latDegInput = Number(input.latDeg ?? input.latitudeDegrees ?? input.latDegrees);
    const lonDegInput = Number(input.lonDeg ?? input.longitudeDegrees ?? input.lngDeg ?? input.lonDegrees);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg)) ? Number(input.u ?? input.x ?? uArg) : 0.5;
    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg)) ? Number(input.v ?? input.y ?? vArg) : 0.5;

    if (Number.isFinite(latDegInput)) lat = degToRad(latDegInput);
    if (Number.isFinite(lonDegInput)) lon = degToRad(lonDegInput);

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

    return {
      lat,
      lon,
      latDeg: radToDeg(lat),
      lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
      u,
      v
    };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

  return {
    lat,
    lon,
    latDeg: radToDeg(lat),
    lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
    u,
    v
  };
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function hydrationFallback(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const polarIce = Math.abs(point.y) > 0.925;
  const field = hash3(
    Math.round(point.x * 8),
    Math.round(point.y * 8),
    Math.round(point.z * 8)
  );
  const land = field > 0.835 && Math.abs(point.y) < 0.86;
  const shelf = !land && !polarIce && field > 0.765 && field <= 0.835;
  const water = !land && !polarIce;

  return {
    ok: false,
    receipt: "AUDRALIA_OCEANS_INTERNAL_HYDRATION_FALLBACK",
    hydrationClass: water ? "hydration_ocean_passthrough" : polarIce ? "hydration_glacier_snowpack_source" : "hydration_dry_land",
    visualSurfaceClass: polarIce
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    land,
    water,
    liquidWater: water,
    solidSurfaceLand: land || polarIce,
    exposedTerrainLand: land,
    ice: polarIce,
    glacier: polarIce,
    beach: shelf,
    shelf,
    ocean: water && !shelf,
    coastal: shelf,
    depth: water ? clamp01(0.34 + (1 - field) * 0.46) : 0,
    surfaceWaterIndex: water ? 0.7 : 0.18,
    hydration: water ? 0.72 : 0.28,
    hydrationIndex: water ? 0.72 : 0.28,
    rainfall: water ? 0.36 : 0.22,
    evaporation: water ? 0.7 : 0.18,
    coastlineIndex: shelf ? 0.58 : 0,
    shelfIndex: shelf ? 0.64 : 0,
    beachIndex: shelf ? 0.46 : 0,
    fallback: true,
    fallbackSample: true
  };
}

function sampleHydrationSafe(coordinate) {
  const payload = {
    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v
  };

  const attempts = [
    () => sampleHydration(payload),
    () => sampleHydrationState(payload),
    () => sampleHydrationSurface(payload),
    () => sampleHydration(coordinate.lat, coordinate.lon, coordinate.u, coordinate.v),
    () => sampleHydration(coordinate.latDeg, coordinate.lonDeg, coordinate.u, coordinate.v)
  ];

  for (const attempt of attempts) {
    try {
      const sample = attempt();

      if (sample && typeof sample === "object") {
        return sample.sample && typeof sample.sample === "object" ? sample.sample : sample;
      }
    } catch (_) {
      /* try next */
    }
  }

  return hydrationFallback(coordinate);
}

function buildOceanFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const hydration = sampleHydrationSafe(coordinate);

  const topology = hydration.topology || hydration.terrain?.topology || {};
  const terrain = hydration.terrain || {};
  const climate = hydration.climate || {};

  const isIce = Boolean(
    hydration.ice ||
      hydration.glacier ||
      hydration.visualSurfaceClass === "glacier_ice_snowpack_surface"
  );

  const isLand = Boolean(
    hydration.land ||
      hydration.exposedTerrainLand ||
      terrain.land ||
      terrain.exposedTerrainLand
  ) && !hydration.liquidWater && !hydration.water && !isIce;

  const isSolidSurface = Boolean(
    hydration.solidSurfaceLand ||
      hydration.topologyLand ||
      terrain.solidSurfaceLand ||
      isLand ||
      isIce
  );

  const isVoid = !isSolidSurface || Boolean(hydration.water || hydration.liquidWater || hydration.ocean || hydration.shelf);
  const isShelfFromParent = Boolean(hydration.shelf || topology.shelf || topology.topologyClass === "coastal-shelf");
  const isOceanFromParent = Boolean(hydration.ocean || topology.oceanVoid || topology.topologyClass === "ocean-void");

  const coastlineIndex = clamp01(safeNumber(
    topology.coastBand ??
      topology.coastlineIndex ??
      hydration.coastlineIndex ??
      hydration.coastalFeather ??
      hydration.beachIndex,
    isShelfFromParent ? 0.46 : 0
  ));

  const shelfIndexParent = clamp01(safeNumber(
    topology.shelfBand ??
      topology.shelfIndex ??
      hydration.shelfIndex,
    isShelfFromParent ? 0.64 : 0
  ));

  const beachIndex = clamp01(safeNumber(
    topology.beachIndex ??
      hydration.beachIndex ??
      hydration.beach,
    hydration.beach ? 0.42 : 0
  ));

  const signedSeaDistance = safeNumber(
    topology.signedSeaDistance ??
      hydration.signedSeaDistance ??
      (isVoid ? -0.2 : 0.2),
    isVoid ? -0.2 : 0.2
  );

  const hydrationIndex = clamp01(safeNumber(hydration.hydrationIndex ?? hydration.hydration, isVoid ? 0.72 : 0.26));
  const surfaceWaterIndex = clamp01(safeNumber(hydration.surfaceWaterIndex, isVoid ? 0.7 : 0.18));
  const rainfall = clamp01(safeNumber(hydration.rainfall ?? climate.rainfallTendency, 0.34));
  const evaporation = clamp01(safeNumber(hydration.evaporation ?? climate.evaporationTendency, isVoid ? 0.68 : 0.18));
  const elevation = clamp01(safeNumber(hydration.elevation ?? hydration.terrainRelief ?? terrain.elevation, 0));
  const oceanCycleInfluence = clamp01(safeNumber(hydration.oceanCycleInfluence ?? climate.oceanCycleInfluence, isVoid ? 0.72 : coastlineIndex * 0.44));
  const climateWind = clamp01(safeNumber(hydration.windCorridorIndex ?? climate.windCorridorIndex, 0.42));

  const oceanContinuity = fbm3(
    point.x * 1.24 + 8.7,
    point.y * 1.24 - 3.4,
    point.z * 1.24 + 2.6,
    5
  );

  const shelfFeatherNoise = fbm3(
    point.x * 6.5 - 2.9,
    point.y * 6.5 + 7.8,
    point.z * 6.5 - 4.3,
    4
  );

  const currentField = fbm3(
    point.x * 3.8 + 4.4,
    point.y * 3.8 - 5.5,
    point.z * 3.8 + 9.1,
    4
  );

  const depthTexture = ridgedNoise3(
    point.x * 9.2 + 11.1,
    point.y * 9.2 - 1.7,
    point.z * 9.2 + 6.2,
    4
  );

  const coastalTurbulence = fbm3(
    point.x * 14.0 - 6.1,
    point.y * 14.0 + 2.9,
    point.z * 14.0 - 8.8,
    3
  );

  const oceanMask = isVoid && !isLand && !isIce ? 1 : 0;

  const shelfMask = oceanMask
    ? clamp01(
        shelfIndexParent * 0.42 +
          coastlineIndex * 0.30 +
          smoothstep(-0.16, -0.018, signedSeaDistance) * 0.16 +
          shelfFeatherNoise * 0.08 +
          (isShelfFromParent ? 0.14 : 0)
      )
    : 0;

  const coastWaterMask = oceanMask
    ? clamp01(coastlineIndex * 0.54 + beachIndex * 0.18 + shelfMask * 0.24 + oceanCycleInfluence * 0.04)
    : 0;

  const openOceanMask = oceanMask
    ? clamp01(1 - shelfMask * 0.72 - coastWaterMask * 0.22)
    : 0;

  const surfaceCurrentIndex = oceanMask
    ? clamp01(currentField * 0.38 + oceanContinuity * 0.26 + evaporation * 0.15 + Math.abs(point.y) * 0.11 + climateWind * 0.10)
    : 0;

  const waveEnergyIndex = oceanMask
    ? clamp01(surfaceCurrentIndex * 0.36 + coastWaterMask * 0.28 + coastalTurbulence * 0.18 + rainfall * 0.10 + climateWind * 0.08)
    : 0;

  const rawDepth = oceanMask
    ? clamp01(
        openOceanMask * 0.50 +
          depthTexture * 0.22 +
          oceanContinuity * 0.12 +
          (1 - coastlineIndex) * 0.08 +
          (isOceanFromParent ? 0.08 : 0)
      )
    : 0;

  const shelfDepth = oceanMask
    ? clamp01(0.10 + shelfMask * 0.26 + rawDepth * 0.18)
    : 0;

  const oceanDepth = oceanMask
    ? clamp01(shelfMask > 0.38 ? shelfDepth : rawDepth)
    : 0;

  const turquoiseIndex = oceanMask
    ? clamp01(shelfMask * 0.54 + coastWaterMask * 0.24 + (1 - oceanDepth) * 0.13 + hydrationIndex * 0.05 + oceanCycleInfluence * 0.04)
    : 0;

  const blueWaterIndex = oceanMask
    ? clamp01(openOceanMask * 0.56 + oceanDepth * 0.32 + surfaceCurrentIndex * 0.08 + oceanCycleInfluence * 0.04)
    : 0;

  const oceanFillAllowed = oceanMask === 1 && !isLand && !isIce;
  const oceanFillActive = oceanFillAllowed;

  let oceanClass = "ocean_non_water_passthrough";

  if (isIce) oceanClass = "ocean_ice_passthrough";
  else if (isLand) oceanClass = "ocean_land_passthrough";
  else if (oceanFillActive && shelfMask > 0.42) oceanClass = "ocean_shelf_water";
  else if (oceanFillActive && coastWaterMask > 0.36) oceanClass = "ocean_coastal_water";
  else if (oceanFillActive) oceanClass = "ocean_open_water";

  const visualSurfaceClass =
    oceanClass === "ocean_shelf_water" || oceanClass === "ocean_coastal_water"
      ? "shelf_water_surface"
      : oceanClass === "ocean_open_water"
        ? "ocean_water_surface"
        : hydration.visualSurfaceClass || hydration.surfaceClass || "inland_terrain_land_surface";

  return {
    ...hydration,
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    compatibilityReceipt: AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_OCEANS_ALIGNMENT_RECEIPT,
    source: "audralia-oceans-continuous-fill-alignment",
    hydration,
    terrain,
    topology,
    climate,
    hydrationReceipt: hydration.receipt || "",
    hydrationConsumed: true,

    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,

    oceanClass,
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,

    oceanMask,
    shelfMask,
    coastWaterMask,
    openOceanMask,
    oceanFillAllowed,
    oceanFillActive,
    oceansMayFillOnlyTopologyVoid: true,
    oceansCannotCreateLand: true,
    oceansCannotEraseTopologyLand: true,

    oceanContinuity,
    shelfFeatherNoise,
    currentField,
    surfaceCurrentIndex,
    waveEnergyIndex,
    coastalTurbulence,
    depthTexture,
    rawDepth,
    shelfDepth,
    depth: oceanDepth,
    maxDepth: oceanDepth,
    oceanDepth,

    surfaceWaterIndex: oceanFillActive
      ? clamp01(0.62 + oceanDepth * 0.20 + waveEnergyIndex * 0.08 + oceanCycleInfluence * 0.10)
      : surfaceWaterIndex,

    turquoise: turquoiseIndex,
    turquoiseIndex,
    blueWaterIndex,

    water: oceanFillActive || Boolean(hydration.water),
    liquidWater: oceanFillActive || Boolean(hydration.liquidWater),
    ocean: oceanClass === "ocean_open_water",
    shelf: oceanClass === "ocean_shelf_water" || oceanClass === "ocean_coastal_water",
    coastal: coastWaterMask > 0.22 || Boolean(hydration.coastal),
    land: isLand,
    exposedTerrainLand: Boolean(hydration.exposedTerrainLand || terrain.exposedTerrainLand) && !oceanFillActive,
    visibleLand: Boolean(hydration.visibleLand || hydration.exposedTerrainLand || terrain.exposedTerrainLand) && !oceanFillActive,
    solidSurfaceLand: Boolean(hydration.solidSurfaceLand || terrain.solidSurfaceLand || isIce) && !oceanFillActive,
    topologyLand: Boolean(hydration.topologyLand || terrain.topologyLand || isIce) && !oceanFillActive,
    ice: isIce,
    glacier: isIce,
    beach: Boolean(hydration.beach || beachIndex > 0.18),

    elevation,
    maxElevation: elevation,
    oceanCycleInfluence,

    deepOceanCandidate: oceanFillActive && openOceanMask > 0.52 && oceanDepth > 0.42,
    deepOceanChildOwnsFinalDepth: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,

    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 192;
  const height = 96;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];

  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastalSamples = 0;
  let liquidWaterSamples = 0;
  let landSamples = 0;
  let solidSurfaceLandSamples = 0;
  let iceSolidSurfaceSamples = 0;
  let deepOceanCandidateSamples = 0;
  let fallbackSamples = 0;

  let maxDepth = 0;
  let maxRawDepth = 0;
  let maxTurquoise = 0;
  let maxSurfaceCurrentIndex = 0;
  let maxWaveEnergyIndex = 0;
  let maxOceanContinuity = 0;
  let maxShelfMask = 0;
  let maxCoastWaterMask = 0;
  let maxOpenOceanMask = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const oceanSample = buildOceanFieldInternal({ lat, lon, u, v });

      const cls = oceanSample.oceanClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (oceanSample.ocean) oceanSamples += 1;
      if (oceanSample.shelf) shelfSamples += 1;
      if (oceanSample.coastal) coastalSamples += 1;
      if (oceanSample.liquidWater) liquidWaterSamples += 1;
      if (oceanSample.exposedTerrainLand) landSamples += 1;
      if (oceanSample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (oceanSample.ice) iceSolidSurfaceSamples += 1;
      if (oceanSample.deepOceanCandidate) deepOceanCandidateSamples += 1;
      if (oceanSample.fallbackSample) fallbackSamples += 1;

      maxDepth = Math.max(maxDepth, oceanSample.depth);
      maxRawDepth = Math.max(maxRawDepth, oceanSample.rawDepth);
      maxTurquoise = Math.max(maxTurquoise, oceanSample.turquoise);
      maxSurfaceCurrentIndex = Math.max(maxSurfaceCurrentIndex, oceanSample.surfaceCurrentIndex);
      maxWaveEnergyIndex = Math.max(maxWaveEnergyIndex, oceanSample.waveEnergyIndex);
      maxOceanContinuity = Math.max(maxOceanContinuity, oceanSample.oceanContinuity);
      maxShelfMask = Math.max(maxShelfMask, oceanSample.shelfMask);
      maxCoastWaterMask = Math.max(maxCoastWaterMask, oceanSample.coastWaterMask);
      maxOpenOceanMask = Math.max(maxOpenOceanMask, oceanSample.openOceanMask);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const oceanRatio = oceanSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const coastalRatio = coastalSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const landRatio = landSamples / totalSamples;
  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const deepOceanCandidateRatio = deepOceanCandidateSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    compatibilityReceipt: AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_OCEANS_ALIGNMENT_RECEIPT,
    hydrationStats: safeGetHydrationStats(),
    hydrationStatus: safeGetHydrationStatus(),
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),

    oceanSamples,
    shelfSamples,
    coastalSamples,
    liquidWaterSamples,
    waterSamples: liquidWaterSamples,
    landSamples,
    solidSurfaceLandSamples,
    iceSolidSurfaceSamples,
    deepOceanCandidateSamples,
    fallbackSamples,

    oceanRatio,
    shelfRatio,
    coastalRatio,
    liquidWaterRatio,
    waterRatio: liquidWaterRatio,
    landRatio,
    solidSurfaceLandRatio,
    iceSolidSurfaceRatio,
    deepOceanCandidateRatio,
    fallbackRatio,

    maxDepth,
    maxRawDepth,
    maxTurquoise,
    maxSurfaceCurrentIndex,
    maxWaveEnergyIndex,
    maxOceanContinuity,
    maxShelfMask,
    maxCoastWaterMask,
    maxOpenOceanMask,

    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidWaterRatioTargetMet:
      liquidWaterRatio >= TARGET_LIQUID_WATER_RATIO_MIN &&
      liquidWaterRatio <= TARGET_LIQUID_WATER_RATIO_MAX,

    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,

    oceansMayFillOnlyTopologyVoid: true,
    oceansCannotCreateLand: true,
    oceansCannotEraseTopologyLand: true,
    deepOceanChildExpectedNext: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    oceansStable: true,
    continuousFieldActive: true,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  STATUS.fallbackSamples = fallbackSamples;
  STATUS.fallbackAllowed = fallbackSamples > 0;
  STATUS.fallbackReason = fallbackSamples > 0 ? "oceans-fallback-samples-observed" : "hydration-ocean-fill-ready";

  return cachedStats;
}

function safeGetHydrationStats() {
  try {
    return getHydrationStats();
  } catch (_) {
    return null;
  }
}

function safeGetHydrationStatus() {
  try {
    return getHydrationStatus();
  } catch (_) {
    return null;
  }
}

function buildOceanGrid(options = {}) {
  const width = clamp(Math.floor(Number(options.width) || 96), 24, 384);
  const height = clamp(Math.floor(Number(options.height) || 48), 12, 192);
  const samples = new Array(width * height);

  for (let row = 0; row < height; row += 1) {
    const v = height === 1 ? 0.5 : row / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < width; col += 1) {
      const u = width === 1 ? 0.5 : col / (width - 1);
      const lon = (u - 0.5) * Math.PI * 2;
      samples[row * width + col] = buildOceanFieldInternal({ lat, lon, u, v });
    }
  }

  return {
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    compatibilityReceipt: AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_OCEANS_ALIGNMENT_RECEIPT,
    width,
    height,
    samples,
    stats: computeStats(),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function createOceansObject() {
  if (cachedOceans) return cachedOceans;

  cachedOceans = {
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    compatibilityReceipt: AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_OCEANS_ALIGNMENT_RECEIPT,
    status: STATUS,
    sampleOcean: buildOceanFieldInternal,
    sampleOceans: buildOceanFieldInternal,
    sampleOceanState: buildOceanFieldInternal,
    sampleAudraliaOcean: buildOceanFieldInternal,
    sampleOceanField: buildOceanFieldInternal,
    sampleSurface: buildOceanFieldInternal,
    sample: buildOceanFieldInternal,
    buildOceanField: buildOceanFieldInternal,
    buildOceanGrid,
    getStatus,
    getOceansStatus,
    getStats,
    getOceanStats,
    getOceansStats
  };

  return cachedOceans;
}

export function getStatus() {
  return {
    ...STATUS,
    stats: computeStats()
  };
}

export function getOceansStatus() {
  return getStatus();
}

export function getStats() {
  return computeStats();
}

export function getOceanStats() {
  return computeStats();
}

export function getOceansStats() {
  return computeStats();
}

export function sampleOcean(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleOceans(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleOceanState(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaOcean(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleOceanField(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sample(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function buildOceanField(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function createAudraliaOceans() {
  return createOceansObject();
}

export const AUDRALIA_OCEANS_STATUS = STATUS;
export const AUDRALIA_OCEANS_RECEIPT_VALUE = AUDRALIA_OCEANS_RECEIPT;
export const AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT_VALUE = AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT;
export const AUDRALIA_OCEANS_ALIGNMENT_RECEIPT_VALUE = AUDRALIA_OCEANS_ALIGNMENT_RECEIPT;

const api = createOceansObject();

if (typeof window !== "undefined") {
  window.AUDRALIA_OCEANS_STATUS = STATUS;
  window.AUDRALIA_OCEANS_RECEIPT = AUDRALIA_OCEANS_RECEIPT;
  window.__AUDRALIA_OCEANS_STATUS__ = STATUS;
  window.__AUDRALIA_OCEANS_RECEIPT__ = AUDRALIA_OCEANS_RECEIPT;
  window.AudraliaOceans = api;
  window.DGBAudraliaOceans = api;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaOceansReceipt = AUDRALIA_OCEANS_RECEIPT;
    document.documentElement.dataset.audraliaOceansCompatibilityReceipt = AUDRALIA_OCEANS_COMPATIBILITY_RECEIPT;
    document.documentElement.dataset.audraliaOceansAlignmentReceipt = AUDRALIA_OCEANS_ALIGNMENT_RECEIPT;
    document.documentElement.dataset.audraliaOceansContinuousField = "true";
    document.documentElement.dataset.audraliaOceansConsumesHydration = "true";
    document.documentElement.dataset.audraliaOceansFillOnlyTopologyVoid = "true";
    document.documentElement.dataset.audraliaOceansCreatesLand = "false";
    document.documentElement.dataset.audraliaOceansErasesTopologyLand = "false";
    document.documentElement.dataset.audraliaDeepOceanChildExpectedNext = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaOceans;
